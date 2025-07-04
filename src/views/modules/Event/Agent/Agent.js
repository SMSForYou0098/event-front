import React, { useState, memo, Fragment, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Card, Button, Alert } from "react-bootstrap";
import axios from "axios";
import animate from '../../../../assets/event/stock/send_confirm.gif';
import { useMyContext } from "../../../../Context/MyContextProvider";
import Swal from "sweetalert2";
import MobileCheckOut from "../Events/StaticComponents/mobileCheckOut";
import CheckOutTickets from "../TicketModal/CheckOutTickets";
import AgentBookingSummary from "./AgnetBookingComps/AgentBookingSummary";
import EventAccordionAgentPOS from "./AgnetBookingComps/EventAccordionAgentPOS";
import AgentBookingModal from "./AgnetBookingComps/AgentBookingModal";
import DynamicAttendeeForm from "../Events/LandingEvents/OrderComps/DynamicAttendeeForm";
import { checkForDuplicateAttendees, processImageFile, sanitizeData, sanitizeInput, validateAttendeeData } from "../CustomComponents/AttendeeStroreUtils";
import DuplicateAttendeeError from "../Events/LandingEvents/OrderComps/DuplicateAttendeeError";
import { cancelToken, SECONDARY } from "../CustomUtils/Consts";
import EventDatesModal from "../Events/LandingEvents/OrderComps/EventDatesModal";
import { AlertTriangle, Calendar } from "lucide-react";
import TicketModal from "../TicketModal/TicketModal";
const Agent = memo(({ isSponser = false, isAccreditation = false }) => {
    const { api, UserData, isMobile, sendTickets, ErrorAlert,
        authToken, formateTemplateTime, getCurrencySymbol, fetchCategoryData, successAlert, UserCredits, formatDateRange, convertTo12HourFormat, userRole } = useMyContext();
    const id = 6;
    const navigate = useNavigate();
    const [isCheckOut, setIsCheckOut] = useState(true);
    const [event, setEvent] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [userTickets, setUserTickets] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [error, setError] = useState(null);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [subtotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [ticketCurrency, setTicketCurrency] = useState('₹');
    const [totalTax, setTotalTax] = useState(0);
    const [grandTotal, setGrandTotal] = useState(0);
    const [baseAmount, setBaseAmount] = useState(0);
    const [centralGST, setCentralGST] = useState(0);
    const [stateGST, setStateGST] = useState(0);
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [disableChoice, setDisableChoice] = useState(false);
    const [ticketSummary, setTicketSummary] = useState([]);
    const [selectedTicketID, setSelectedTicketID] = useState(null);
    const [discountType, setDiscountType] = useState('fixed');
    const [method, setMethod] = useState('Cash');
    const [discountValue, setDiscountValue] = useState();
    const [confirm, setConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [attendee, setAttendee] = useState([]);
    const [resetCounterTrigger, setRsetCounterTrigger] = useState(0)
    const [bookings, setBookings] = useState([])

    //send mail states
    const [masterBookings, setMasterBookings] = useState([]);
    const [normalBookings, setNormalBookings] = useState([]);
    const [categoryData, setCategoryData] = useState();
    const [mainBookings, setMainBookings] = useState([]);
    const [disable, setDisable] = useState(false);
    const [bookingUser, setBookingUser] = useState();
    const [photo, setPhoto] = useState(null);
    const [doc, setDoc] = useState(null);
    //attndee state
    const [isAttendeeRequired, setIsAttendeeRequired] = useState(false);
    const [attendeeState, setAttendeeState] = useState(false);
    const [selectedAttendees, setSelectedAttendees] = useState();
    const [allAttendees, setAllAttendees] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [showDateModal, setShowDateModal] = useState(false);
    const handleShowDateModal = () => setShowDateModal(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isAmusment, setIsAmusment] = useState(false);

    const getUserTickets = useCallback(async () => {
        if (isAccreditation) {
            try {
                const response = await axios.get(`${api}user-ticket-list/${UserData?.id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (response.data?.status) {
                    const ticketIds = response.data?.data
                        ?.flatMap(ticket =>
                            Array.isArray(ticket?.ticket_id) ? ticket.ticket_id : [ticket?.ticket_id]
                        )
                        .filter(Boolean);
                    setUserTickets(ticketIds);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }, [UserData, isAccreditation]);

    const AttendyView = () => {
        setIsAttendeeRequired(categoryData?.categoryData?.attendy_required === 1);
        return categoryData?.categoryData?.attendy_required === 1
    }
    const getUrl = useCallback(() => {
        if (isSponser) {
            return `${api}sponsor-bookings/${UserData?.id}`;
        } else if (isAccreditation) {
            return `${api}accreditation-bookings/${UserData?.id}`;
        } else {
            return `${api}agent-bookings/${UserData?.id}`;
        }
    }, [api, UserData, isSponser, isAccreditation]);

    const GetBookings = async () => {
        const url = getUrl();
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        })
            .then((res) => {
                if (res.data.status) {
                    setBookings(res.data)
                }
            }).catch((err) =>
                console.log(err)
            )
    }
    const getTicketData = async (id) => {
        await axios.get(`${api}event-detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then(async (res) => {
            if (res.data.status) {
                let data = res.data.events
                if (data?.category?.title === 'Amusement') {
                    setIsAmusment(true)
                    handleShowDateModal()
                }
                setEvent(data)
                const ticket = data?.tickets;
                if (userRole === 'Accreditation') {
                    const filteredTickets = ticket?.filter((item) => userTickets?.includes(item?.id));
                    setTickets(filteredTickets);
                }
                else {
                    setTickets(ticket)
                }
                const CData = await fetchCategoryData(data?.category?.id)
                setCategoryData(CData)
            }
        }).catch((err) =>
            console.log(err)
        )
    }

    useEffect(() => {
        if (categoryData) {
            AttendyView()
        }
    }, [categoryData]);

    useEffect(() => {
        if (isAccreditation) {
            getUserTickets()
        }
        GetBookings()
        if (isMobile) {
            setIsCheckOut(true)
        }
    }, [])

    const getTicketCount = (quantity, category, price, id) => {
        if (selectedTicketID && selectedTicketID !== id && quantity > 0) {
            setRsetCounterTrigger(prev => prev + 1);
        }
        setSelectedTicketID(id);
        setSelectedTickets({ category, quantity, price, id });
    };

    useEffect(() => {
        if (selectedTickets?.quantity > 0) {
            setDisable(false)
            let price = selectedTickets?.sale === 'true' ? selectedTickets?.sale_price : selectedTickets?.price;
            const totalPriceForCategory = price * selectedTickets.quantity;
            setSubTotal(totalPriceForCategory);
        } else {
            setDisable(true)
            setSubTotal(0);
            setBaseAmount(0);
            setCentralGST(0);
            setStateGST(0);
            setTotalTax(0);
            setGrandTotal(0);
        }
    }, [selectedTickets]);


    useEffect(() => {
        if (subtotal) {
            // setBaseAmount(subtotal * 10 / 100)
            setCentralGST(baseAmount * 9 / 100)
            setStateGST(baseAmount * 9 / 100)
            setTotalTax((centralGST + stateGST + baseAmount)?.toFixed(2))
        }

        if (((subtotal + totalTax) - discount) > 0) {
            let total = (subtotal + +totalTax) - discount
            setGrandTotal(total?.toFixed(2))
        }
    }, [subtotal, totalTax, discount, baseAmount, centralGST, stateGST]);

    const handleDiscount = () => {
        let disc = 0;
        if (discountValue) {
            if (discountType === 'fixed') {
                disc = discountValue;
                setDiscount(disc)
                setDisableChoice(true)
            } else if (discountType === 'percentage') {
                disc = subtotal * discountValue / 100
                setDiscount(disc)
                setDisableChoice(true)
            }
            console.log(disc)
            setGrandTotal(grandTotal - disc)
        }
    };

    useEffect(() => {
        setDisableChoice(false)
        if (discountValue) {
            setDiscount(0);
        }
    }, [discountValue, discountType]);


    useEffect(() => {
        if (bookingHistory.length > 0) {
            const ticketMap = bookingHistory.reduce((acc, booking) => {
                const ticket = event.tickets?.find(item => item.id === booking.ticket_id);
                if (ticket) {
                    if (!acc[ticket.name]) {
                        acc[ticket.name] = { ...ticket, quantity: 0 };
                    }
                    acc[ticket.name].quantity += 1;
                }
                return acc;
            }, {});

            // Convert the map to an array
            const ticketsData = Object.values(ticketMap);
            setTicketSummary(ticketsData);
        }
    }, [bookingHistory, event.tickets]);



    //model states
    const [showPrintModel, setShowPrintModel] = useState(false);
    const handleClose = () => {
        setShowPrintModel(false)
        setConfirm(false)
        // navigate(-1);
    }

    const HandleSendTicket = (data) => {
        // sendTickets(data, 'new')
        let template = isAmusment ? 'Amusement Booking' : 'Booking Confirmation';
        sendTickets(data, 'new', false, template);
    }


    useEffect(() => {
        if (attendee.length !== 0) {
            handleBooking();
        }
    }, [attendee]);


    const [activeKey, setActiveKey] = useState('0');
    useEffect(() => {
        const accordionButton = document.querySelector('.accordion-button');
        if (accordionButton) {
            accordionButton.style.backgroundColor = 'transparent';
        }
    }, []);

    const handleButtonClick = (id) => {
        setAttendeeState(false)
        setAllAttendees([])
        setSelectedTickets(null)
        setRsetCounterTrigger(prev => prev + 1);
        getTicketData(id)
        setSelectedDate('')
        setIsDateSelected(false);
        setActiveKey(null);
    };
    //send mail
    useEffect(() => {
        if (masterBookings.length > 0 || normalBookings) {
            const masterBookingIds = masterBookings.flatMap((data) => data?.booking_id);
            const filteredNormalBookings = normalBookings.filter(
                (booking) => !masterBookingIds.includes(booking?.id)
            );
            const combinedBookings = [...masterBookings, ...filteredNormalBookings];
            setMainBookings(combinedBookings)
        }
    }, [masterBookings, normalBookings]);

    useEffect(() => {
        if (mainBookings?.length > 0) {
            HandleSendMail(mainBookings)
        }
    }, [mainBookings]);

    const getTicketPrice = (category) => {
        let ticket = event?.tickets?.find((item) => item.name === category)
        return ticket?.price
    }

    const HandleSendMail = async (data) => {
        if (data?.length > 0) {
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

                return {
                    email,
                    number, // Assuming you want to include this
                    thumbnail,
                    category,
                    qty,
                    name,
                    price: getTicketPrice(category) * qty?.toFixed(2),
                    eventName,
                    eventDate,
                    eventTime,
                    DateTime,
                    address,
                    location,
                    convenience_fee: totalTax,
                    total: grandTotal
                    // Include any other necessary fields
                };
            });
            if (Booking?.length > 0) {
                sendMail(Booking)
            }
        }
    }
    const sendMail = async (data) => {
        try {
            setDisable(true)
            const res = await axios.post(`${api}booking-mail/${UserData?.id}`, { data }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });

        } catch (err) {
            console.log(err);
        } finally {
            setDisable(false)
        }
    }


    const getSelectedAttendees = (data) => {
        setAllAttendees(data)
        setDisable(data?.length === selectedTickets?.quantity ? false : true);
        setSelectedAttendees(data?.length)
    }

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [ticketModal, setTicketModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [designation, setDesignation] = useState('');
    const [ticketData, setTicketData] = useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const resetAllFields = () => {
        setName('');
        setEmail('');
        setNumber('');
        setDoc(null);
        setPhoto(null);
        setCompanyName('');
        setDesignation('');
        // Reset payment method to Cash (default)
        setMethod('Cash');
    };
    const HandleBookingModel = async () => {
        if (selectedTickets?.quantity > 0) {
            let isAr = AttendyView()
            if (isAr) {
                if (attendeeState) {
                    await HandleAttendeeSubmit()
                } else {
                    setIsAttendeeRequired(false);
                    setDisable(true)
                    setAttendeeState(true)
                }
            } else {
                setShowPrintModel(true);
            }
        } else {
            ErrorAlert('Please Select A Ticket');
        }
    }
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
                    const atts = sanitizeData(allAttendees)
                    let isDuplicate = checkForDuplicateAttendees(atts, setErrorMessages, setShowErrorModal);
                    if (isDuplicate) {
                        return
                    }
                    //const loader = showLoading('Booking')
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
                    formData.append('isAgentBooking', true);
                    const response = await axios.post(`${api}attndy-store`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    if (response.data.status) {
                        // loader.close()
                        successAlert('Success', 'Attendees Saved Successfully')
                        setAttendees(response?.data?.data)
                        setShowPrintModel(true);
                    }
                } catch (error) {
                    console.error('Error submitting form data:', error);
                }
            }
        });
    };
    const handleSubmit = async () => {
        setDisable(true);
        if (!name) {
            ErrorAlert("Name is required");
            return;
        }

        if (!number) {
            ErrorAlert("Mobile number is required");
            return;
        }
        if (isAccreditation && !photo) {
            ErrorAlert("Photo is required");
        }
        try {
            const res = await axios.post(`${api}chek-email`, {
                'email': email,
                'number': number,
            }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data?.exists) {
                if (res.data.is_email_and_mobile_different_users) {
                    ErrorAlert('This number & email is already registered');
                    return false;
                } else {
                    if (res.data?.mobile_exists) {
                        if (isAccreditation) {
                            const formData = new FormData();
                            if (companyName) {
                                formData.append('company_name', companyName);
                            }
                            if (photo) {
                                const processedPhoto = photo instanceof File ? await processImageFile(photo) : photo;
                                formData.append('photo', processedPhoto);
                            }
                            if (doc) {
                                const processedDoc = doc instanceof File ? await processImageFile(doc) : doc;
                                formData.append('doc', processedDoc);
                            }
                            if (designation) {
                                formData.append('designation', designation);
                            }
                            formData.append('user_id', res.data?.user?.id);
                            await axios.post(`${api}update-user/${res.data?.user?.id}`, formData, {
                                headers: {
                                    'Authorization': 'Bearer ' + authToken,
                                    'Content-Type': 'multipart/form-data'
                                }
                            });
                        }
                        handleBooking(res.data?.user);
                    } else if (res.data?.email_exists) {
                        ErrorAlert('This email is already registered');
                    }
                }
            } else {
                handleSignUp();
            }
        } catch (err) {
            console.log(err?.response?.data?.message || err.response?.data?.error || "An error occurred");
            ErrorAlert("An error occurred, please try again.", err);
        } finally {
            setDisable(false);
        }
    };

    const handleSignUp = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('number', number);
        formData.append('password', number);
        formData.append('reporting_user', UserData?.id);
        // add companyName if exists
        if (companyName) {
            formData.append('company_name', companyName);
        }
        if (designation) {
            formData.append('designation', designation);
        }
        if (photo) {
            const processedPhoto = await processImageFile(photo)
            formData.append('photo', processedPhoto);
        }
        if (doc) {
            const processedDoc = await processImageFile(doc)
            formData.append('doc', processedDoc);
        }
        await axios.post(`${api}create-user`, formData, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                handleBooking(res.data.user)
            }
        }).catch((err) =>
            console.log(err)
        )
    }
    const handleBooking = async (createdUser) => {
        // Early return if already processing a booking request
        if (disable || loading) return;

        // Immediately disable the button to prevent multiple clicks
        setDisable(true);
        setLoading(true);

        const validTickets = selectedTickets?.quantity > 0;
        const bookingTypes = [
            { flag: isAmusment, prefix: 'amusement-agent' },
            { flag: isSponser, prefix: 'sponsor' },
            { flag: isAccreditation, prefix: 'accreditation' }
        ];
        let url;
        let masterUrl;
        const type = bookingTypes.find(t => t.flag)?.prefix || 'agent';
        url = `${api}${type}-book-ticket/${id}`;
        masterUrl = `${api}${type}-master-booking/${createdUser?.id}`;
        if (validTickets) {
            const formData = new FormData();
            attendees?.forEach((attendee, index) => {
                Object.entries(attendee).forEach(([fieldKey, fieldValue]) => {
                    formData.append(`attendees[${index}][${fieldKey}]`, fieldValue);
                });
            });
            const requestData = {
                agent_id: UserData?.id,
                access_area: selectedAreas.map(item => item?.value),
                user_id: createdUser?.id,
                number: createdUser?.number,
                email: createdUser?.email,
                base_amount: subtotal,
                type: event?.event_type,
                name: createdUser?.name,
                booking_date: selectedDate,
                payment_method: method,
                amount: grandTotal,
                discount: discount,
                tickets: selectedTickets
            };

            Object.entries(requestData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            // Handle selectedTickets object
            Object.entries(selectedTickets || {}).forEach(([ticketKey, ticketValue]) => {
                formData.append(`tickets[${ticketKey}]`, ticketValue);
            });

            try {
                const res = await axios.post(url, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    },
                    cancelToken: cancelToken
                });
                if (res.data.status) {
                    setBookingHistory(res.data?.bookings);
                    const bookings = res.data?.bookings;
                    const bookingIds = bookings.map(booking => booking?.id);
                    setNormalBookings(prevNormalBookings => [...prevNormalBookings, ...bookings]);
                    if (bookings.length > 1) {
                        const masterRes = await axios.post(masterUrl, {
                            agent_id: UserData?.id,
                            user_id: createdUser?.id,
                            amount: grandTotal,
                            payment_method: method,
                            bookingIds
                        }, {
                            headers: {
                                'Authorization': 'Bearer ' + authToken,
                            }
                        });
                        if (masterRes.data.status) {
                            setLoading(false);
                            setConfirm(true);
                            const master = masterRes.data.booking;
                            setMasterBookings(prevMasterBookings => [...prevMasterBookings, master]);
                            // HandleSendTicket(masterRes.data?.booking)
                        }
                    } else {
                        // HandleSendTicket(bookings.find((item) => item?.id === bookings[0]?.id))
                        setLoading(false)
                        setConfirm(true);
                        if (isAccreditation) {
                            setTicketData(bookings[0]);
                        }
                    }
                    setIsCheckOut(false);
                }
            } catch (err) {
                setShowDateModal(false);
                setLoading(false);
                setConfirm(false);
                setShowPrintModel(false);
                setAttendeeState(false);
                setIsCheckOut(false);
                setAttendees([]);
                setSelectedTickets([]);
                setError(err.response?.data?.message || err.response?.data?.error || "An error occurred");
            } finally {
                resetAllFields();
                UserCredits(UserData?.id)
                setDisable(false);
                setLoading(false);
            }
        } else {
            ErrorAlert('Please Select A Ticket');
        }
    };
    const [isDateSelected, setIsDateSelected] = useState(false);
    const ticketRefs = useRef([]);
    const HandleDate = async () => {
        setIsDateSelected(true);
        setShowDateModal(false);
    }
    useEffect(() => {
        let timeoutId;
        if (error) {
            timeoutId = setTimeout(() => {
                setError(null);
            }, 5000);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [error]);

    function handleCloseModal() {
        setTicketModal(false)
    }
    return (
        <Fragment>
            <TicketModal
                show={ticketModal}
                handleCloseModal={handleCloseModal}
                ticketType={{ type: 'combine' }}
                ticketData={ticketData}
                ticketRefs={ticketRefs}
                loading={loading}
                isAccreditation={isAccreditation}
                showTicketDetails={isAccreditation}
                // downloadTicket={downloadTicket}
                isMobile={isMobile}
                formatDateRange={formatDateRange}
                convertTo12HourFormat={convertTo12HourFormat}
            />
            <EventDatesModal
                show={showDateModal}
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                dateRange={event?.date_range}
                setShow={setShowDateModal}
                handleSave={HandleDate}
            />
            <DuplicateAttendeeError
                errorMessages={errorMessages}
                showErrorModal={showErrorModal}
                setShowErrorModal={setShowErrorModal}
            />
            <AgentBookingModal
                name={name}
                setSelectedAreas={setSelectedAreas}
                selectedAreas={selectedAreas}
                event={event}
                doc={doc}
                setDoc={setDoc}
                selectedTickets={selectedTickets}
                ticketData={ticketData}
                companyName={companyName}
                setCompanyName={setCompanyName}
                showPrintModel={showPrintModel}
                handleClose={handleClose}
                confirm={confirm}
                setTicketModal={setTicketModal}
                isAccreditation={isAccreditation}
                setPhoto={setPhoto}
                setDesignation={setDesignation}
                designation={designation}
                photo={photo}
                attendee={attendee}
                disabled={disable}
                loading={loading}
                animate={animate}
                setName={setName}
                number={number}
                setNumber={setNumber}
                email={email}
                setEmail={setEmail}
                handleSubmit={handleSubmit}
                setMethod={setMethod}
            />

            {(isMobile && isCheckOut) &&
                <MobileCheckOut
                    disable={disable}
                    ticketCurrency={ticketCurrency}
                    handlePayment={HandleBookingModel}
                    grandTotal={grandTotal}
                    isAttendeeRequired={isAttendeeRequired}
                    attendeeState={attendeeState}
                    attendees={selectedAttendees}
                    quantity={selectedTickets?.quantity}
                />
            }
            <Row>
                <Col lg="12">
                    <EventAccordionAgentPOS
                        handleButtonClick={handleButtonClick}
                        activeKey={activeKey}
                        setActiveKey={setActiveKey}
                    />
                </Col>
            </Row>
            <Row>
                {attendeeState ? (
                    <DynamicAttendeeForm
                        showAttendeeSuggetion={event?.offline_att_sug === 0}
                        isAgent={true}
                        getAttendees={getSelectedAttendees}
                        category_id={categoryData?.categoryData?.id}
                        setDisable={setDisable}
                        disable={disable}
                        AttendyView={AttendyView}
                        event={event}
                        setAttendees={setAttendees}
                        apiData={categoryData?.customFieldsData}
                        setAttendeeState={setAttendeeState}
                        selectedTickets={selectedTickets}
                        quantity={selectedTickets?.quantity}
                    />
                ) : (event?.category?.title !== 'Amusement' || (event?.category?.title === 'Amusement' && isDateSelected)) && (
                    <Col lg="8">
                        {error && (
                            <Alert variant="danger" className="mb-2  d-flex align-items-center">
                                <AlertTriangle size={18} className="me-2" />
                                <span>{error || "An error occurred while processing your request."}</span>
                            </Alert>
                        )}
                        <Card>
                            <Card.Header className="py-3">
                                <div className="row align-items-center">
                                    <div className="col-md-6 col-12">
                                        <h5 className="mb-0">{event?.name}</h5>
                                    </div>
                                    {(selectedDate || event?.date_range) && (
                                        <div className="col-md-6 col-12 text-md-end text-start mt-2 mt-md-0">
                                            <span className="text-black d-flex align-items-center gap-1 justify-content-md-end">
                                                <Button className="p-0 m-0 d-flex" variant="link" onClick={handleShowDateModal}>
                                                    <Calendar size={16} color={SECONDARY} />
                                                </Button>
                                                : {selectedDate || formatDateRange(event?.date_range)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card.Header>
                            {event &&
                                <Card.Body className="p-0">
                                    <CheckOutTickets
                                        loading={loading}
                                        event={event}
                                        tickets={tickets}
                                        isMobile={isMobile}
                                        resetCounterTrigger={resetCounterTrigger}
                                        getTicketCount={getTicketCount}
                                        selectedTickets={selectedTickets}
                                        getCurrencySymbol={getCurrencySymbol}
                                    />
                                </Card.Body>
                            }
                        </Card>
                    </Col>
                )}
                {(event?.category?.title !== 'Amusement' || (event?.category?.title === 'Amusement' && isDateSelected)) && (
                    <Col lg="4">
                        <AgentBookingSummary
                            disabled={disable}
                            UserData={UserData}
                            bookings={bookings}
                            ticketCurrency={ticketCurrency}
                            subtotal={subtotal}
                            discount={discount}
                            baseAmount={baseAmount}
                            centralGST={centralGST}
                            totalTax={totalTax}
                            discountType={discountType}
                            setDiscountType={setDiscountType}
                            discountValue={discountValue}
                            setDiscountValue={setDiscountValue}
                            disableChoice={disableChoice}
                            handleDiscount={handleDiscount}
                            grandTotal={grandTotal}
                            HandleBookingModel={HandleBookingModel}
                            isMobile={isMobile}
                            isAttendeeRequired={isAttendeeRequired}
                        />
                    </Col>
                )}
            </Row>
        </Fragment >
    );
});

Agent.displayName = "Agent";
export default Agent;
