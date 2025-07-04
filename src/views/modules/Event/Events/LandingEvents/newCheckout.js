import React, { useState, memo, Fragment, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Row, Image, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import confirmImage from "../../../../../assets/event/stock/confirm.gif";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import TicketModal from "../../TicketModal/TicketModal";
import MobileCheckOut from "../StaticComponents/mobileCheckOut";
import Sumary from "./OrderComps/Sumary";
import CheckOutData from "./OrderComps/CheckOutData";
import CheckUserMailComp from "../../User/CheckUserMailComp";
import DuolicateAttendeeError from "./OrderComps/DuplicateAttendeeError";
import { checkForDuplicateAttendees, sanitizeData, sanitizeInput, validateAttendeeData } from "../../CustomComponents/AttendeeStroreUtils";
import { cancelToken } from "../../CustomUtils/Consts";
import ExpiredEvent from "./ExpiredEvent";
import LoaderComp from "../../CustomUtils/LoaderComp";

const NewChekout = memo(() => {
    const { api, UserData, isMobile, authToken, formateTemplateTime, ErrorAlert, convertTo12HourFormat, formatDateRange, successAlert, getCurrencySymbol, showLoading, fetchCategoryData, loader } = useMyContext();
    const [isCheckOut, setIsCheckOut] = useState(true);
    const [currentStep, setCurrentStep] = useState('checkout');
    const navigate = useNavigate('')
    const location = useLocation();
    const { id } = useParams();
    const { selectedDate } = location.state || {};
    const orderSummary = () => {
        setCurrentStep('orderSummary');
        setIsCheckOut(false);
    };
    const [event, setEvent] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState();
    const [bookingHistory, setBookingHistory] = useState([]);
    const [ticketData, setTicketData] = useState();
    const [code, setCode] = useState('');
    const [appliedPromoCode, setAppliedPromoCode] = useState('');
    const [subtotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [ticketCurrency, setTicketCurrency] = useState('₹');
    const [totalTax, setTotalTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [baseAmount, setBaseAmount] = useState(0);
    const [centralGST, setCentralGST] = useState(0);
    const [stateGST, setStateGST] = useState(0);
    const [setConvenienceFee, convenienceFee] = useState(0);
    const [downladTicketType, setDownladTicketType] = useState('');
    const [ticketSummary, setTicketSummary] = useState([]);
    const [disableChoice, setDisableChoice] = useState(false);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedTicketID, setSelectedTicketID] = useState(null);
    const [resetCounterTrigger, setRsetCounterTrigger] = useState(0)
    const [categoryData, setCategoryData] = useState(null);
    const [attendeeState, setAttendeeState] = useState(false);
    // make state for isAttendeeRequired
    const [isAttendeeRequired, setIsAttendeeRequired] = useState(false);
    const [disable, setDisable] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [discountType, setDiscountType] = useState();
    const [isExpired, setIsExpired] = useState(false);
    const [tikcets, setTikcets] = useState([]);
    const getTicketData = async () => {
        setLoading(true);
        await axios.get(`${api}event-detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        })
            .then((res) => {
                if (res.data.status) {
                    setIsExpired(res.data?.event_expired);
                    setEvent(res.data.events)
                    if (res.data?.events?.tickets) {
                        let tt = res.data?.events?.tickets?.filter((item) => {
                            return parseInt(item?.status) === 1;
                        });
                        if (tt?.length > 0) {
                            setTikcets(tt || []);
                        }
                    }
                }
            }).catch((err) =>
                console.log(err)
            ).finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        getTicketData()
        if (isMobile) {
            setIsCheckOut(true)
        }
    }, [])



    useEffect(() => {
        if (event?.category) {
            getCategoryData()
        }
    }, [event]);

    const getCategoryData = async () => {
        let data = await fetchCategoryData(event?.category?.id)
        setCategoryData(data)
    }

    useEffect(() => {
        if (categoryData) {
            AttendyView()
        }
    }, [categoryData]);

    const AttendyView = () => {
        setIsAttendeeRequired(categoryData?.categoryData?.attendy_required === 1);
    }

    const getTicketCount = (quantity, category, price, id) => {
        if (selectedTicketID && selectedTicketID !== id && quantity > 0) {
            setRsetCounterTrigger(prev => prev + 1);
        }
        setSelectedTicketID(id);
        setDiscount(0)
        setAppliedPromoCode('')
        setCode('')
        setSelectedTickets({ category, quantity, price, id });
    };

    useEffect(() => {
        if (selectedTickets?.quantity > 0) {
            let price = selectedTickets?.sale === 'true' ? selectedTickets?.sale_price : selectedTickets?.price;
            const totalPriceForCategory = price * selectedTickets?.quantity;
            setSubTotal(totalPriceForCategory);
        } else {
            setSubTotal(0);
            setBaseAmount(0);
            setCentralGST(0);
            setStateGST(0);
            setTotalTax(0);
            setGrandTotal(0);
        }
    }, [selectedTickets]);

    const applyPromode = async () => {
        if (!event?.user_id) {
            SweetalertError('Event organizer information is missing');
            return;
        }

        if (!selectedTickets?.id) {
            SweetalertError('Please select a ticket first');
            return;
        }

        if (!grandTotal) {
            SweetalertError('Total amount cannot be zero');
            return;
        }

        if (!code || code.trim() === '') {
            SweetalertError('Please enter a promo code');
            return;
        }
        try {
            const res = await axios.post(`${api}check-promo-code/${event?.user_id}`, {
                ticket_id: selectedTickets?.id,
                amount: grandTotal,
                promo_code: code,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const data = res.data.promo_data
                setDiscount(data?.discount_value)
                setDiscountType(data?.discount_type)
                setAppliedPromoCode(code)
                Sweetalert()
                //setCode('')
            } else {
                SweetalertError(res.data.message)
            }
        } catch (err) {
            SweetalertError(err.response.data.message)
        }
    };

    const handleRemovePromocode = () => {
        setDiscount(0)
        setCode('')
    };

    useEffect(() => {
        if (subtotal) {
            let baseAmount = subtotal;
            setBaseAmount(baseAmount);

            // let centralGST = baseAmount * 9 / 100;
            let centralGST = 0;
            // let stateGST = baseAmount * 9 / 100;
            let stateGST = 0;
            setCentralGST(centralGST);
            setStateGST(stateGST);

            let tax = centralGST + stateGST;
            setTotalTax(tax > 0 ? tax?.toFixed(2) : 0);
        }

        // Apply discount as a percentage if a discount is present
        let discountAmount = 0; // Initialize discountAmount

        // Apply discount based on the type
        if (discount > 0) { // Ensure discount is greater than 0 to calculate
            if (discountType === "percentage") {
                discountAmount = subtotal * discount / 100; // Calculate percentage discount
            } else if (discountType === "fixed") {
                discountAmount = discount; // Use the fixed discount amount
            }
        }

        // Calculate the grand total only if totalTax and subtotal are available
        if (subtotal || totalTax) {
            let total = (subtotal + +totalTax) - discountAmount;
            // Ensure grand total is not negative
            setTotalDiscount(discountAmount)
            setGrandTotal(total > 0 ? total.toFixed(2) : '0.00');
        }
    }, [subtotal, totalTax, discount, discountType]);

    const [masterBookings, setMasterBookings] = useState([]);
    const [normalBookings, setNormalBookings] = useState([]);
    const [mainBookings, setMainBookings] = useState(false);
    const [isMaster, setIsMaster] = useState(false);


    const HandleSendTicket = (data, template) => {
        // sendTickets(data, 'new', false, template)
    }

    useEffect(() => {
        if (bookingHistory.length > 0) {
            // Group tickets by category and sum quantities
            const ticketMap = bookingHistory.reduce((acc, booking) => {
                const ticket = event.tickets?.find(item => item.id === booking.ticket_id);
                if (ticket) {
                    if (!acc[ticket.name]) {
                        acc[ticket.name] = { ...ticket, quantity: 0 };
                    }
                    acc[ticket.name].quantity += 1; // Assuming each booking represents one ticket
                }
                return acc;
            }, {});

            // Convert the map to an array
            const ticketsData = Object.values(ticketMap);
            setTicketSummary(ticketsData);
        }
    }, [bookingHistory, event.tickets]);


    function Sweetalert() {
        Swal.fire({
            icon: "success",
            title: "Applied Success!",
            text: "Promocode applied succesfully.",
        });
    }
    function SweetalertError(message) {
        Swal.fire({
            icon: "error",
            text: message,
        });
    }

    //model states
    const [show, setShow] = useState(false);
    function handleclose() {
        setShow(false)
        orderSummary()
    }


    useEffect(() => {
        if (downladTicketType) {
            setDisableChoice(true)
            setTicketShow(true)
        }
    }, [downladTicketType]);


    const getTicketPrice = (category) => {
        let ticket = event?.tickets?.find((item) => item.name === category)
        let price = ticket?.sale === 'true' ? ticket?.sale_price : ticket?.price
        return price
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const session_id = queryParams.get('session_id');
        if (session_id) {
            if (session_id) {
                handleBooking();
            } else {
                Swal.fire({
                    title: 'Payment Failed',
                    text: 'Unfortunately, your payment could not be processed.',
                    icon: 'error',
                    showCancelButton: true,
                    confirmButtonText: '<i class="fas fa-redo-alt"></i> Proceed Again',
                    cancelButtonText: '<i class="fas fa-home"></i> Go To Home'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.close();
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        navigate('/');
                    }
                });
            }
        }
    }, [location]);

    const [ticketShow, setTicketShow] = useState(false);
    function handlecloseTickets() {
        setTicketShow(false)
    }

    useEffect(() => {
        if (isMaster) {
            setMainBookings(masterBookings?.bookings ?? masterBookings[0]?.bookings)
        } else {
            //console.log(normalBookings)
            setMainBookings(normalBookings)
        }
    }, [masterBookings, normalBookings]);

    useEffect(() => {
        if (mainBookings?.length > 0) {
            PrePareMailData(mainBookings);
        }
    }, [mainBookings]);

    const PrePareMailData = async (data) => {
        if (data?.length) {
            const Booking = data?.map((item) => {
                // Extracting common fields
                const number = item?.number ?? item?.bookings?.[0]?.number ?? 'Unknown';
                const email = item?.email ?? item?.bookings?.[0]?.email ?? 'Unknown';
                const thumbnail = item?.ticket?.event?.thumbnail ?? item?.bookings?.[0]?.ticket?.event?.thumbnail ?? 'https://smsforyou.biz/ticketcopy.jpg';
                const name = item?.user?.name ?? item?.bookings?.[0]?.user?.name ?? 'Guest';
                const qty = item?.bookings?.length ?? 1;
                const category = item?.ticket?.name ?? item?.bookings?.[0]?.ticket?.name ?? 'General';
                const eventName = item?.ticket?.event?.name ?? item?.bookings?.[0]?.ticket?.event?.name ?? 'Event';
                const eventDate = item?.ticket?.event?.date_range ?? item?.bookings?.[0]?.ticket?.event?.date_range ?? 'TBD';
                const eventTime = item?.ticket?.event?.start_time ?? item?.bookings?.[0]?.ticket?.event?.start_time ?? 'TBD';
                const address = item?.ticket?.event?.address ?? item?.bookings?.[0]?.ticket?.event?.address ?? 'No Address Provided';
                const location = address.replace(/,/g, '|');
                const DateTime = formateTemplateTime(eventDate, eventTime);
                let price = getTicketPrice(category) * qty?.toFixed(2);
                const total = item?.amount ?? item?.bookings?.[0]?.amount ?? 0;
                const convenience_fee = item?.total_tax ?? item?.bookings?.[0]?.total_tax ?? 0;
                return {
                    // allTicketTotal,
                    email,
                    number, // Assuming you want to include this
                    thumbnail,
                    category,
                    qty,
                    name,
                    eventName,
                    eventDate,
                    eventTime,
                    DateTime,
                    address,
                    location,
                    price,
                    convenience_fee: convenience_fee,
                    total
                    // Include any other necessary fields
                };
            });
            if (Booking?.length > 0) {
                sendMail(Booking);
            }
        }
    }

    // send Email verification
    const sendMail = async (data) => {
        try {
            const res = await axios.post(`${api}booking-mail/${UserData?.id}`, { data }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data?.status) {
                // setMailSend(true)
            }
        } catch (err) {
            console.log(err);
        }
    }

    const [allAttendees, setAllAttendees] = useState([]);
    useEffect(() => {
        if (mainBookings) {
            const combinedAttendees = Array.isArray(mainBookings)
                ? mainBookings?.map(booking => booking.attendee)?.flat()
                : [mainBookings]?.map(booking => booking.attendee)?.flat();
            setAllAttendees(combinedAttendees?.filter(Boolean)); // Remove any null/undefined values
        }
    }, [mainBookings]);

    const [selectedAttendees, setSelectedAttendees] = useState();
    const getSelectedAttendees = (data) => {
        setAllAttendees(data)
        setDisable(data?.length === selectedTickets?.quantity ? false : true);
        setSelectedAttendees(data?.length)
    }

    const handleBookingResponse = (responseData, isPaidBooking = false) => {
        try {
            if (responseData.status) {
                const master = isPaidBooking ? responseData.isMaster : responseData.is_master;
                setIsMaster(master);

                const bookings = responseData.bookings;
                const getTicketData = () => {
                    if (master) {
                        return isPaidBooking ? bookings[0] : bookings;
                    }
                    return bookings[0];
                };
                setTicketData(getTicketData());
                let bookingsToCheck = null;
                if (master) {
                    bookingsToCheck = Array.isArray(isPaidBooking ? bookings[0].bookings : bookings.bookings)
                        ? (isPaidBooking ? bookings[0] : bookings)
                        : [];

                } else {
                    bookingsToCheck = Array.isArray(bookings) ? bookings : [];
                }
                // Validate paid bookings
                if (isPaidBooking) {
                    const isValidPayment = master
                        ? bookingsToCheck?.bookings?.some(booking => parseInt(booking.payment_status) === 1)
                        : bookingsToCheck?.some(booking => parseInt(booking.payment_status) === 1);
                    if (!isValidPayment) {
                        ErrorAlert('Something Went Wrong.');
                        return false;
                    }
                    const storedData = localStorage.getItem('ticketSession');
                    const { session_id, selectedTickets } = JSON.parse(storedData);
                    if (parseInt(session_id) === parseInt(master ? bookings[0].bookings[0]?.txnid : bookings[0]?.txnid)) {
                        setSelectedTickets(selectedTickets);
                    }
                }

                // Handle bookings based on master status
                if (master) {
                    let Bkng = isPaidBooking ? bookings[0] : bookingsToCheck
                    let template = Bkng?.bookings[0]?.booking_date ? 'Amusement Booking' : 'Booking Confirmation';
                    setMasterBookings(isPaidBooking ? bookings[0] : bookingsToCheck);
                    HandleSendTicket(bookingsToCheck, template);
                } else {
                    let template = bookingsToCheck[0]?.booking_date ? 'Amusement Booking' : 'Booking Confirmation';
                    setNormalBookings(bookingsToCheck);
                    HandleSendTicket(bookingsToCheck[0] ?? bookingsToCheck, template);
                }

                setShow(true);
                return true;
            }
            return false;
        } catch (error) {
            // console.error('Error handling booking response:', error);
            ErrorAlert('An error occurred while processing the booking.');
            return false;
        }
    };

    const handlePayment = async () => {

        if (!UserData?.email) {
            ErrorAlert('Please Complete Your Profile')
        }
        else {
            if (selectedTickets?.quantity > 0) {
                if (categoryData?.categoryData?.attendy_required === 1) {
                    if (categoryData?.categoryData?.attendy_required === 1 && !attendeeState) {
                        setIsAttendeeRequired(false);
                        setDisable(true)
                        setAttendeeState(true)
                    } else {
                        await HandleAttendeeSubmit()

                    }
                } else {
                    const loader = showLoading('Booking')
                    await ProcessBooking(loader);
                }
            } else {
                ErrorAlert('Please select a ticket first')
            }
        }
    }

    const handleBooking = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const sessionId = queryParams.get('session_id');
            const payment_status = queryParams.get('status');
            const booking_category = queryParams.get('category');
            window.history.pushState({}, '', window.location.pathname);
            if (payment_status === 'failure') {
                ErrorAlert('Payment failed. Please try again.');
            } else if (payment_status === 'userCancelled') {
                ErrorAlert('Payment was canceled. Please initiate payment again if required.');
                return false
            }
            if (sessionId && payment_status === 'success') {
                try {
                    const isAmuseMentPark = booking_category === 'Amusement'
                    const url = isAmuseMentPark ? `${api}verify-amusement-booking` : `${api}verify-booking`;
                    const res = await axios.post(url, { session_id: sessionId }, {
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                        }
                    });
                    if (res.data.status) {
                        await handleBookingResponse(res.data, true)
                    } else {
                        ErrorAlert('Booking verification failed. Please try again.');
                    }
                } catch (err) {
                    ErrorAlert('An error occurred while verifying your booking.');
                }
            }
        } catch (err) {
            ErrorAlert('An error occurred while verifying your booking.');
        } finally {
            setLoading(false);
        }
    };
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    const HandleAttendeeSubmit = async () => {
        if (allAttendees?.some(attendee => {
            const { valid, message } = validateAttendeeData(attendee);
            if (!valid) {
                Swal.fire('Error', message, 'error');
                return true;
            }
            return false;
        })) return;

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save it!',
            cancelButtonText: 'No, cancel!',
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const formData = new FormData();
                    const atts = allAttendees ? sanitizeData(allAttendees) : [];
                    let isDuplicate = checkForDuplicateAttendees(atts, setErrorMessages, setShowErrorModal);
                    if (isDuplicate) {
                        return
                    }
                    const loader = showLoading('Booking')
                    allAttendees?.forEach((attendee, index) => {
                        Object.keys(attendee).forEach(fieldKey => {
                            if (fieldKey !== 'missingFields') {
                                const fieldValue = attendee[fieldKey];
                                formData.append(`attendees[${index}][${fieldKey}]`, sanitizeInput(fieldValue));
                            }
                        });
                    });

                    // append user id in formData
                    formData.append('user_id', UserData?.id);
                    formData.append('user_name', sanitizeInput(UserData?.name));
                    formData.append('event_name', sanitizeInput(event?.name));
                    const response = await axios.post(`${api}attndy-store`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.data.status) {
                        successAlert('Success', 'Attendees Saved Successfully')
                        setAttendees(response?.data?.data)
                        ProcessBooking(loader, response?.data?.data)
                    }
                } catch (error) {
                    console.error('Error submitting form data:', error);
                }
            }
        });
    };
    const ProcessBooking = async (loader, attendeeList) => {
        try {
            setLoading(true);
            const validTickets = selectedTickets?.quantity > 0;
            if (!validTickets) {
                ErrorAlert('Please Select A Ticket')
            } else {
                const formData = new FormData();
                if (attendeeList?.length > 0) {
                    attendeeList?.forEach((attendee, index) => {
                        Object.entries(attendee).forEach(([fieldKey, fieldValue]) => {
                            formData.append(`attendees[${index}][${fieldKey}]`, fieldValue);
                        });
                    });
                }
                const requestData = {
                    user_id: UserData?.id,
                    email: UserData?.email,
                    number: UserData?.number,
                    name: UserData?.name,
                    payment_method: 'online',
                    amount: grandTotal,
                    // convenience_fee: convenienceFee,
                    base_amount: subtotal,
                    tickets: selectedTickets,
                    type: event?.event_type
                };
                setLoading(true);
                setError('');
                try {
                    formData.append('amount', Number(grandTotal) === 0 ? '0' : grandTotal?.toString());
                    formData.append('productinfo', event?.name);
                    formData.append('event_id', event?.event_key);
                    formData.append('firstname', UserData?.name);
                    formData.append('phone', UserData?.number);
                    if (appliedPromoCode) {
                        formData.append('promo_code', appliedPromoCode);
                    }
                    formData.append('total_tax', totalTax);
                    formData.append('discount', totalDiscount);
                    formData.append('email', UserData?.email);
                    formData.append('organizer_id', event?.user?.id);
                    formData.append('category', event?.category?.title);
                    if (selectedDate) {
                        formData.append('booking_date', selectedDate);
                    }
                    formData.append('requestData', JSON.stringify(requestData));

                    const response = await axios.post(`${api}initiate-payment`, formData, {
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                        },
                        cancelToken: cancelToken
                    });
                    if (grandTotal === 0 && response.data.status) {
                        await handleBookingResponse(response.data);
                        return false;
                    }
                    if (response.data?.result?.status === 1 || response.data?.result?.success) {
                        setAllAttendees([]);
                        const sessionData = {
                            session_id: response.data.txnid,
                            selectedTickets: selectedTickets,
                        };
                        localStorage.setItem('ticketSession', JSON.stringify(sessionData));
                        // let code = response.data?.result?.data
                        let url = response.data?.url
                        window.location.href = url;
                        // window.location.href = 'https://pay.easebuzz.in/pay/' + code;
                        //window.location.href = 'https://testpay.easebuzz.in/pay/' + code;
                    } else {
                        setError('Payment initiation failed');
                    }
                } catch (error) {
                    const err = error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred while initiating payment.';
                    setError(err);
                } finally {
                    setLoading(false);
                    loader.close();
                }
            }
        } catch (error) {
            const err = error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred while initiating payment.';
            setError(err);
        } finally {
            setLoading(false); // Reset loading state regardless of success/failure
        }
    }
    return (
        <Fragment>
            {loading ?
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <LoaderComp />
                </div>
                :
                <>
                    <DuolicateAttendeeError errorMessages={errorMessages} showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} />
                    <CheckUserMailComp number={UserData?.number} />
                    {/* success model  */}
                    <Modal show={show} backdrop="static" centered>
                        <Modal.Body>
                            <div className="d-flex flex-column justify-content-center py-3">
                                <h3 className="text-center">Booking Confirmed!</h3>
                                <span className="text-center">
                                    <Image src={loading ? loader : confirmImage} width={200} />
                                </span>
                                <h4 className="text-center">Thank You For Your Booking!</h4>
                                <div className="text-center">
                                    <Button disabled={loading} className="border rounded-pill w-50" onClick={() => handleclose()}>Booking Summary</Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    {/* success model end */}

                    {/* Ticket model  */}
                    <TicketModal
                        show={ticketShow}
                        handleCloseModal={handlecloseTickets}
                        ticketType={downladTicketType}
                        ticketData={ticketData}
                        formatDateRange={formatDateRange}
                    />
                    {/* Ticket model end */}
                    <Row>
                        {(!isExpired && isMobile && isCheckOut) &&
                            <MobileCheckOut
                                disable={disable}
                                loading={loading}
                                ticketCurrency={ticketCurrency}
                                handlePayment={handlePayment}
                                grandTotal={grandTotal}
                                isAttendeeRequired={isAttendeeRequired}
                                attendeeState={attendeeState}
                                attendees={selectedAttendees}
                                quantity={selectedTickets?.quantity}
                            />
                        }

                        {
                            isExpired ?
                                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '50vh' }}>
                                    <ExpiredEvent />
                                </div>
                                :
                                isCheckOut &&
                                <CheckOutData
                                    bookingdate={selectedDate}
                                    isAgent={false}
                                    loading={loading}
                                    getAttendees={getSelectedAttendees}
                                    categoryData={categoryData}
                                    setDisable={setDisable}
                                    disable={disable}
                                    setAttendees={setAttendees}
                                    AttendyView={AttendyView}
                                    attendeeState={attendeeState}
                                    setAttendeeState={setAttendeeState}
                                    event={event}
                                    tickets={tikcets}
                                    selectedTickets={selectedTickets}
                                    currentStep={currentStep}
                                    error={error}
                                    isMobile={isMobile}
                                    resetCounterTrigger={resetCounterTrigger}
                                    getTicketCount={getTicketCount}
                                    getCurrencySymbol={getCurrencySymbol}
                                    code={code}
                                    setCode={setCode}
                                    applyPromode={applyPromode}
                                    discount={discount}
                                    appliedPromoCode={appliedPromoCode}
                                    ticketCurrency={ticketCurrency}
                                    subtotal={subtotal}
                                    handleRemovePromocode={handleRemovePromocode}
                                    totalDiscount={totalDiscount}
                                    baseAmount={baseAmount}
                                    centralGST={centralGST}
                                    totalTax={totalTax}
                                    grandTotal={grandTotal}
                                    handlePayment={handlePayment}
                                    isAttendeeRequired={isAttendeeRequired}
                                />
                        }
                        {
                            currentStep === 'orderSummary' &&
                            <Sumary
                                event={event}
                                attendeeList={allAttendees}
                                apiData={categoryData?.customFieldsData}
                                mainBookings={mainBookings}
                                selectedTickets={selectedTickets}
                                isMaster={isMaster}
                                disableChoice={disableChoice}
                                setDownladTicketType={setDownladTicketType}
                                navigate={navigate}
                                currentStep={currentStep}
                                convertTo12HourFormat={convertTo12HourFormat}
                            />
                        }
                    </Row>
                </>
            }
        </Fragment>
    );
});

NewChekout.displayName = "NewChekout";
export default NewChekout;
