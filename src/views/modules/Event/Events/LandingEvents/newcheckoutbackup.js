import React, { useState, memo, Fragment, useEffect } from "react";
// Router
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

// React-bootstrap
import { Form, Button, Row, Col, Image, Table, Card, Alert, TabPane, Badge, Modal, Container } from "react-bootstrap";

import Swal from "sweetalert2";

//Img
import confirmImage from "../../../../../assets/event/stock/confirm.gif";
import partyImage from "../../../../../assets/modules/e-commerce/images/product/party3.jpg";
import axios from "axios";

import { useMyContext } from "../../../../../Context/MyContextProvider";
import currencyData from '../../../../../JSON/currency.json';
import CustomCounter from "../Counter/customCounter";
import TicketModal from "../../TicketModal/TicketModal";
import { capitalize, toLower } from 'lodash';

const NewChekout = memo(() => {
    const { api, UserData, isMobile, sendTickets, authToken, formateTemplateTime, ErrorAlert, convertTo12HourFormat, formatDateRange } = useMyContext();
    const [isCheckOut, setIsCheckOut] = useState(true);
    const [currentStep, setCurrentStep] = useState('checkout');
    const navigate = useNavigate('')


    const orderSummary = () => {
        setCurrentStep('orderSummary');
        setIsCheckOut(false);
    };
    const naviagte = useNavigate()


    const { id } = useParams();
    const location = useLocation();
    const [event, setEvent] = useState([]);
    const [currencyMaster, setCurrencyMaster] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);
    const [bookingHistory, setBookingHistory] = useState([]);
    const [ticketData, setTicketData] = useState([]);
    const [code, setCode] = useState('');
    const [appliedPromoCode, setAppliedPromoCode] = useState('');
    const [subtotal, setSubTotal] = useState('0');
    const [discount, setDiscount] = useState(0);
    const [ticketCurrency, setTicketCurrency] = useState('₹');
    const [totalTax, setTotalTax] = useState('0');
    const [grandTotal, setGrandTotal] = useState('0');
    const [baseAmount, setBaseAmount] = useState('0');
    const [centralGST, setCentralGST] = useState('0');
    const [stateGST, setStateGST] = useState('0');
    const [quantity, setQuantity] = useState('0');
    const [downladTicketType, setDownladTicketType] = useState('');
    const [ticketSummary, setTicketSummary] = useState([]);
    const [disableChoice, setDisableChoice] = useState(false);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedTicketID, setSelectedTicketID] = useState(null);
    const [resetCounterTrigger, setRsetCounterTrigger] = useState(0)
    useEffect(() => {
        const savedTickets = localStorage.getItem('selectedTickets');
        if (savedTickets) {
            setSelectedTickets(JSON.parse(savedTickets));
        }
    }, []);


    const getTicketData = async () => {
        await axios.get(`${api}event-detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        })
            .then((res) => {
                if (res.data.status) {
                    setEvent(res.data.events)
                }
            }).catch((err) =>
                console.log(err)
            )
    }

    useEffect(() => {
        getTicketData()
        setCurrencyMaster(currencyData)
        if (isMobile) {
            setIsCheckOut(true)
        }
        return () => {
            localStorage.removeItem('selectedTickets');
            localStorage.removeItem('total');
            localStorage.removeItem('convenience_fee');
            localStorage.removeItem('sub_total');
        };
    }, [])


    const getCurrencySymbol = (currency) => {
        if (currencyMaster && currency) {

            if (currencyMaster.hasOwnProperty(currency)) {
                let symbol = currencyMaster[currency]?.symbol;
                return symbol;
            }
        }
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
        // console.log(selectedTickets)
        if (selectedTickets?.quantity > 0) {
            let price = selectedTickets?.sale === 'true' ? selectedTickets?.sale_price : selectedTickets?.price;
            const totalPriceForCategory = price * selectedTickets.quantity;
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







    const [discountType, setDiscountType] = useState();

    const applyPromode = async () => {
        try {
            const res = await axios.post(`${api}check-promo-code/${event?.user_id}`, {
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
                setCode('')
            } else {
                SweetalertError(res.data.message)
            }
        } catch (err) {
            SweetalertError(err.response.data.message)
        }
    };
    const handleRemovePromocode = () => {
        setDiscount(0)
    };

    useEffect(() => {
        if (subtotal) {
            // Calculate the base amount
            let baseAmount = 0;
            setBaseAmount(baseAmount);

            // Calculate Central GST and State GST
            let centralGST = baseAmount * 9 / 100;
            let stateGST = baseAmount * 9 / 100;
            setCentralGST(centralGST);
            setStateGST(stateGST);

            // Calculate total tax
            let tax = centralGST + stateGST + baseAmount;
            setTotalTax(tax > 0 ? tax?.toFixed(2) : 0);
        }
    }, [subtotal, totalTax, discount, baseAmount, centralGST, stateGST]);

    const [masterBookings, setMasterBookings] = useState([]);
    const [normalBookings, setNormalBookings] = useState([]);
    const [mainBookings, setMainBookings] = useState(false);
    const [status, setStatus] = useState([]);

    const HandleSendTicket = (data) => {
        sendTickets(data, 'new')
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
            // title: "Something went wrong",
            text: capitalize(message),
        });
    }

    //model states
    const [show, setShow] = useState(false);
    function handleclose() {
        setShow(false)
        orderSummary()
    }


    const applyDiscount = (discountAmount, discountType) => {
        // Apply discount based on the type
        if (discountType === "percentage") {
            discountAmount = subtotal * discount / 100; // Calculate percentage discount
        } else if (discountType === "fixed") {
            discountAmount = discount; // Use the fixed discount amount
        }
        // Calculate the grand total
        if (((subtotal + +totalTax) - discountAmount) > 0) {
            let total = (subtotal + +totalTax) - discountAmount;
            setGrandTotal(total.toFixed(2));
        }
    }



    useEffect(() => {
        if (downladTicketType) {
            Swal.fire({
                title: "Are you sure?",
                text: "While selecting a ticket type make sure to its can't changable!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Generate Ticket!"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Generated!",
                        text: "Your Ticket Generate Successfully",
                        icon: "success"
                    });
                    setDisableChoice(true)
                    HandleSelectTicketType(downladTicketType)
                    setTicketShow(true)
                }
            });
        }
    }, [downladTicketType]);



    const HandleSelectTicketType = (type) => {
        if (type === 'combine') {
            setTicketData(mainBookings);
        } else if (type === 'individual') {
            const master = masterBookings.flatMap((data) => data.bookings);
            const allBookings = [...master, ...normalBookings];
            const uniqueBookings = Array.from(new Set(allBookings.map(booking => booking.id)))
                .map(id => allBookings.find(booking => booking.id === id));
            setTicketData(uniqueBookings);
        }
    }


    const getTicketPrice = (category) => {
        let ticket = event?.tickets?.find((item) => item.name === category)
        let price = ticket?.sale === 'true' ? ticket?.sale_price : ticket?.price
        return price
    }


    // const [status, setStatus] = useState('');
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('status');
        if (status) {
            if (status === 'success') {
                handleBooking();
            } else {
                // localStorage.removeItem('selectedTickets');
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
                        naviagte('/');
                    }
                });
            }
        }
    }, [location?.search]);


    const handlePayment = async () => {
        const validTickets = selectedTickets.quantity > 0;
        if (!validTickets) {
            ErrorAlert('Please Select A Ticket')
        } else {
            localStorage.setItem('selectedTickets', JSON.stringify(selectedTickets));
            localStorage.setItem('total', grandTotal);
            localStorage.setItem('sub_total', subtotal);
            localStorage.setItem('convenience_fee', totalTax);
            setLoading(true);
            setError('');
            try {
                // Make a POST request to your Laravel backend to initiate the payment
                const response = await axios.post(`${api}initiate-payment`, {
                    amount: grandTotal,
                    productinfo: event?.name,
                    event_id: event?.event_key,
                    firstname: UserData?.name,
                    phone: UserData?.number,
                    email: UserData?.email,
                    organizer_id: event?.user?.id,
                    txnid: 'efwefafds'
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });
                
                if (response.data?.result?.status === 1) {
                    let code = response.data?.result?.data
                    window.location.href = 'https://pay.easebuzz.in/pay/' + code;
                } else {
                    setError('Payment initiation failed');
                }
            } catch (error) {
                //console.error('Error initiating payment:', error);
                setError('An error occurred while initiating payment.');
            } finally {
                setLoading(false);
            }
        }
    }

    const [ticketShow, setTicketShow] = useState(false);
    function handlecloseTickets() {
        setTicketShow(false)
    }

    // const handleBooking = async () => {
    //     setStatus(true)
    //     const reserve = JSON.parse(localStorage.getItem('selectedTickets'));
    //     const total = localStorage.getItem('total');
    //     setSelectedTickets(reserve)
    //     const validTickets = reserve.filter(ticket => ticket.quantity > 0);
    //     const queryParams = new URLSearchParams(window.location.search);
    //     queryParams.delete('status');
    //     window.history.replaceState({}, '', `${window.location.pathname}`);
    //     const requestData = {
    //         user_id: UserData?.id,
    //         email: UserData?.email,
    //         number: UserData?.number,
    //         name: UserData?.name,
    //         amount: grandTotal || total,
    //         payment_method: 'Offline',
    //         tickets: validTickets,
    //         type: event?.event_type
    //     };
    //     try {
    //         // Book tickets
    //         const res = await axios.post(`${api}book-ticket/${id}`, requestData, {
    //             headers: {
    //                 'Authorization': 'Bearer ' + authToken,
    //             }
    //         });
    //         if (res.data.status) {
    //             setBookingHistory(res.data?.bookings);
    //             const bookings = res.data?.bookings;
    //             setNormalBookings(prevNormalBookings => [...prevNormalBookings, ...bookings]);
    //             const bookingsByCategory = bookings.reduce((acc, booking) => {
    //                 const ticket = validTickets.find(t => t.id === booking.ticket_id);
    //                 if (ticket) {
    //                     if (!acc[ticket.category]) {
    //                         acc[ticket.category] = [];
    //                     }
    //                     acc[ticket.category].push(booking.id);
    //                 }
    //                 return acc;
    //             }, {});

    //             // Create master bookings for each category
    //             for (const category in bookingsByCategory) {
    //                 const bookingIds = bookingsByCategory[category];
    //                 if (bookingIds.length > 1) {
    //                     const masterRes = await axios.post(`${api}master-booking/${UserData?.id}`, { bookingIds }, {
    //                         headers: {
    //                             'Authorization': 'Bearer ' + authToken,
    //                         }
    //                     });
    //                     if (masterRes.data.status) {
    //                         const master = masterRes.data.booking;
    //                         console.log(master)
    //                         setMasterBookings(prevMasterBookings => [...prevMasterBookings, master]);
    //                         HandleSendTicket(masterRes.data?.booking)
    //                         setShow(true);
    //                     }
    //                 } else {
    //                     HandleSendTicket(bookings.find((item) => item?.id === bookingIds[0]))
    //                     setShow(true);
    //                 }
    //             }
    //             setIsCheckOut(false);
    //         }
    //     } catch (err) {
    //     } finally {
    //         setStatus(false)
    //     }
    // };




    useEffect(() => {
        if (masterBookings.length > 0 || normalBookings) {
            // const masterBookingIds = masterBookings.flatMap((data) => JSON.parse(data?.booking_id));
            const masterBookingIds = masterBookings?.flatMap((data) => data?.booking_id);
            //console.log(masterBookingIds);
            const filteredNormalBookings = normalBookings.filter(
                (booking) => !masterBookingIds.includes(booking?.id)
            );
            const combinedBookings = [...masterBookings, ...filteredNormalBookings];
            setMainBookings(combinedBookings)
        }
    }, [masterBookings, normalBookings]);

    useEffect(() => {
        if (!status && mainBookings.length > 0) {
            PrePareMailData(mainBookings);
        }
    }, [status, mainBookings]);

    const PrePareMailData = async (data) => {
        //console.log('mail for',data) // got the data here
        //event data
        const reserve = JSON.parse(localStorage.getItem('selectedTickets'));
        setSelectedTickets(reserve)
        const validTickets = reserve.quantity > 0;
        const convenience_fee = localStorage.getItem('convenience_fee');
        if (data?.length && validTickets) {
            console.log(data)
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
                const total = grandTotal === 0 ? localStorage.getItem('total') : grandTotal;
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
    const [mailSend, setMailSend] = useState(false);
    const sendMail = async (data) => {
        try {
            const res = await axios.post(`${api}booking-mail/${UserData?.id}`, { data }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data?.status) {
                setMailSend(true)
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (mailSend) {
            const timer = setTimeout(() => {
                localStorage.removeItem('selectedTickets');
                localStorage.removeItem('total');
                localStorage.removeItem('convenience_fee');
                localStorage.removeItem('sub_total');
            }, 5000); // Delay of 5000 milliseconds (5 seconds)

            // Cleanup function to clear the timer if the component unmounts or dependencies change
            return () => clearTimeout(timer);
        }
    }, [currentStep, mailSend]);

    const handleBooking = async () => {
        setStatus(true);
        const reserve = JSON.parse(localStorage.getItem('selectedTickets'));
        const total = localStorage.getItem('total');
        const convenience_fee = localStorage.getItem('convenience_fee');
        const sub_total = localStorage.getItem('sub_total');
        // console.log(total)
        setSelectedTickets(reserve);
        setQuantity(reserve?.quantity)
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.delete('status');
        window.history.replaceState({}, '', `${window.location.pathname}`);
        const requestData = {
            user_id: UserData?.id,
            email: UserData?.email,
            number: UserData?.number,
            name: UserData?.name,
            payment_method: 'online',
            amount: total,
            // convenience_fee: convenience_fee,
            base_amount: sub_total,
            tickets: reserve,
            type: event?.event_type
        };
        try {
            // Book tickets
            const res = await axios.post(`${api}book-ticket/${id}`, requestData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                setBookingHistory(res.data?.bookings);
                const bookings = res.data?.bookings;
                setNormalBookings(prevNormalBookings => [...prevNormalBookings, ...bookings]);
                const bookingIds = bookings.map(booking => booking.id);
                // Create master bookings for each category
                if (bookingIds.length > 1) {
                    const masterRes = await axios.post(`${api}master-booking/${UserData?.id}`, { bookingIds }, {
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                        }
                    });
                    if (masterRes.data.status) {
                        const master = masterRes.data.booking;
                        setMasterBookings(prevMasterBookings => [...prevMasterBookings, master]);
                        HandleSendTicket(masterRes.data?.booking);
                        setShow(true);
                    }
                } else {
                    HandleSendTicket(bookings.find((item) => item?.id === bookingIds[0]));
                    setShow(true);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setStatus(false); // Moved to ensure it's set after bookings are handled
        }
    };
    return (
        <Fragment>
            {/* success model  */}
            <Modal show={show} backdrop="static" centered>
                <Modal.Body>
                    <div className="d-flex flex-column justify-content-center py-3">
                        <h3 className="text-center">Booking Confirmed!</h3>
                        <span className="text-center">
                            <Image src={confirmImage} width={200} />
                        </span>
                        <h4 className="text-center">Thank You For Your Booking!</h4>
                        {/* <p className="text-center">Your Booking is currently confirmed as online Booking.</p> */}

                        <div className="text-center">
                            <Button className="border rounded-pill w-50" onClick={() => handleclose()}>Booking Summary</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {/* success model end */}

            {/* print model  */}
            <TicketModal
                show={ticketShow}
                handleCloseModal={handlecloseTickets}
                ticketType={downladTicketType}
                ticketData={ticketData}
                formatDateRange={formatDateRange}
            />
            {/* print model end */}

            <Row>
                {/* <Col sm="12"> */}
                {/* <ul className="text-center iq-product-tracker mb-0 py-4" id="progressbar">
                    <li className={`iq-tracker-position-0 ${currentStep === 'checkout' ? 'active' : 'done'}`} id="iq-tracker-position-1">
                        Checkout
                    </li>
                    <li className={`iq-tracker-position-0 ${currentStep === 'orderSummary' ? 'active' : ''}`} id="iq-tracker-position-2">
                        Booking Summary
                    </li>
                </ul> */}
                {
                    (isMobile && isCheckOut) &&
                    <Container
                        fluid
                        className="d-flex flex-column justify-content-end"
                        style={{
                            position: 'fixed',
                            left: '0',
                            zIndex: '99',
                            bottom: '0',
                            maxWidth: '100%',
                            margin: '0',
                            padding: '0',
                        }}
                        onClick={() => handlePayment()}
                    >
                        <Row className="g-0">
                            <Col xs={6} className="p-0">
                                <Button
                                    variant="secondary"
                                    className="w-100 text-white py-4"
                                    style={{ borderRadius: '0' }}
                                >
                                    Amount : <strong className="text-white h5">{ticketCurrency}{grandTotal}</strong>
                                </Button>
                            </Col>
                            <Col xs={6} className="p-0">
                                <Link
                                    to=""
                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-4"
                                    style={{ borderRadius: '0', textDecoration: 'none' }}
                                >
                                    Checkout
                                </Link>
                            </Col>
                        </Row>
                    </Container>
                }
                {
                    isCheckOut &&
                    <div id="checkout" className={`iq-product-tracker-card b-0 ${currentStep === 'checkout' ? 'show' : ''}`}>
                        <Row>
                            <Col lg="8">
                                {error &&
                                    <Alert variant="danger d-flex align-items-center" role="alert">
                                        <svg className="me-2" id="exclamation-triangle-fill" fill="currentColor" width="20" viewBox="0 0 16 16">
                                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                        </svg>
                                        <div>
                                            {error}
                                        </div>
                                    </Alert>
                                }
                                <Card>
                                    <div className="card-header">
                                        <h5>{event?.name}</h5>
                                    </div>
                                    <Card.Body className="p-0">
                                        <Table responsive className="mb-0">
                                            <tbody>
                                                {event?.tickets?.map((item, index) => {
                                                    return (
                                                        <tr data-item="list" key={index} className={`${(item.sold_out === 'true' || item.donation === 'true') && 'opacity-50'}`} style={{ pointerEvents: (item.sold_out === 'true' || item.donation === 'true') && 'none' }}>
                                                            <td className={`pe-0 ${isMobile ? 'h5' : 'h6'}`}>
                                                                <div className="d-flex align-items-center gap-4">
                                                                    <div>
                                                                        <p className="mb-3">{item.name}{'  '}
                                                                            <span className="text-danger">
                                                                                {item.sold_out === 'true' ? 'Booking Closed' : item.donation === 'true' && 'Booking Not Started Yet'}
                                                                            </span>
                                                                        </p>
                                                                        <p className="mb-1 d-flex gap-2 text-black">Price: {getCurrencySymbol(item.currency)}
                                                                            {
                                                                                item?.sale === 1 ?
                                                                                    <>
                                                                                        <span className="mb-0" style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>
                                                                                            {'₹' + item?.price}
                                                                                        </span>
                                                                                        <span className="mb-0">
                                                                                            {'₹' + item?.sale_price}
                                                                                        </span>
                                                                                    </>
                                                                                    :
                                                                                    item?.price
                                                                            }
                                                                        </p>
                                                                        {/* <p className="mb-1">Size: {item.size}</p> */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-0">
                                                                <CustomCounter
                                                                    resetCounterTrigger={resetCounterTrigger}
                                                                    getTicketCount={getTicketCount}
                                                                    category={item.name}
                                                                    price={item?.sale === 1 ? item?.sale_price : item?.price}
                                                                    limit={10}
                                                                    ticketID={item.id}
                                                                />
                                                            </td>
                                                            {!isMobile &&
                                                                <td className="ps-0">
                                                                    <div className="d-flex gap-3">
                                                                        <p className="text-decoration-line-through mb-0">
                                                                        </p>
                                                                        <Link to="#" className="text-decoration-none h5">
                                                                            {getCurrencySymbol(item.currency)}{
                                                                                selectedTickets.quantity > 0 && selectedTickets?.category === item.name &&
                                                                                (item?.sale === 1 ? item?.sale_price : item?.price) * selectedTickets?.quantity
                                                                            }
                                                                        </Link>
                                                                    </div>
                                                                </td>
                                                            }
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg="4">
                                <Card>
                                    <div className="card-header">
                                        <h4 className="mb-0">Booking Summary</h4>
                                    </div>
                                    <Card.Body>
                                        <div className="border-bottom">
                                            <div className="input-group mb-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Promo Code"
                                                    aria-label="Promo Code"
                                                    aria-describedby="PromoCode"
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                />
                                                <Button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    id="CouponCode"
                                                    onClick={() => applyPromode()}
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="border-bottom mt-4">
                                            {
                                                discount !== 0 &&
                                                <div className="d-flex justify-content-end  mb-4">
                                                    <TabPane id="alerts-disimissible-component" className=" tab-pane tab-example-result fade active show " role="tabpanel" aria-labelledby="alerts-disimissible-component-tab">
                                                        <Alert className="d-flex align-content-center justify-content-between gap-2 alert-success alert-dismissible fade show mb-0" role="alert">
                                                            <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.94118 10.7474V20.7444C5.94118 21.0758 5.81103 21.3936 5.57937 21.628C5.3477 21.8623 5.0335 21.994 4.70588 21.994H2.23529C1.90767 21.994 1.59347 21.8623 1.36181 21.628C1.13015 21.3936 1 21.0758 1 20.7444V11.997C1 11.6656 1.13015 11.3477 1.36181 11.1134C1.59347 10.879 1.90767 10.7474 2.23529 10.7474H5.94118ZM5.94118 10.7474C7.25166 10.7474 8.50847 10.2207 9.43512 9.28334C10.3618 8.34594 10.8824 7.07456 10.8824 5.74887V4.49925C10.8824 3.83641 11.1426 3.20071 11.606 2.73201C12.0693 2.26331 12.6977 2 13.3529 2C14.0082 2 14.6366 2.26331 15.0999 2.73201C15.5632 3.20071 15.8235 3.83641 15.8235 4.49925V10.7474H19.5294C20.1847 10.7474 20.8131 11.0107 21.2764 11.4794C21.7397 11.9481 22 12.5838 22 13.2466L20.7647 19.4947C20.5871 20.2613 20.25 20.9196 19.8045 21.3704C19.3589 21.8211 18.8288 22.04 18.2941 21.994H9.64706C8.6642 21.994 7.72159 21.599 7.0266 20.896C6.33162 20.1929 5.94118 19.2394 5.94118 18.2451" stroke="currentColor" />
                                                            </svg>
                                                            <h6 className="p-0 m-0"><Badge bg="danger">{appliedPromoCode}</Badge></h6>
                                                            <div className="d-flex justify-content-between">
                                                                <div>
                                                                    <strong>Success!</strong> Promocode applied succesfully!
                                                                    {/* <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleRemovePromocode()}></button> */}
                                                                </div>
                                                            </div>
                                                        </Alert>
                                                    </TabPane>
                                                </div>
                                            }
                                            <div className="d-flex justify-content-between mb-4">
                                                <h6>Sub Total</h6>
                                                <h6 className="text-primary">{ticketCurrency}{subtotal}</h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <h6>Discount</h6>
                                                <h6 className="text-success">{ticketCurrency}{subtotal * discount / 100}</h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <h6>Base Amount</h6>
                                                <h6 className="text-success">{ticketCurrency}{baseAmount}</h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <h6>Central GST (CGST) @ 9%</h6>
                                                <h6 className="text-success">{ticketCurrency}{centralGST}</h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <h6>State GST (SGST) @ 9%</h6>
                                                <h6 className="text-success">{ticketCurrency}{centralGST}</h6>
                                            </div>
                                            <div className="d-flex justify-content-between mb-4">
                                                <h6>Convenience fees</h6>
                                                <h6 className="text-success">{ticketCurrency}{totalTax}</h6>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between mb-4">
                                                <h6 className="mb-0">Order Total</h6>
                                                <h5 className="text-primary mb-0">
                                                    {ticketCurrency}{grandTotal}
                                                </h5>

                                            </div>
                                            <div className="alert border-primary rounded border-1 mb-4">
                                                <div className="d-flex justify-content-between align-items-center ">
                                                    <h6 className="text-primary mb-0">
                                                        Total Savings on this order
                                                    </h6>
                                                    <h6 className="text-primary mb-0">
                                                        <b>{ticketCurrency}{subtotal * discount / 100}</b>
                                                    </h6>
                                                </div>
                                            </div>
                                            {
                                                !isMobile &&
                                                <div className="d-flex">
                                                    <Button
                                                        id="place-order"
                                                        to="#"
                                                        // onClick={handleBooking}
                                                        onClick={() => handlePayment()}
                                                        variant="primary d-block mt-3 next w-100"
                                                    >
                                                        Checkout
                                                    </Button>
                                                </div>
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
                {
                    currentStep === 'orderSummary' &&
                    <div id="order-summary" className={`iq-product-tracker-card b-0 ${currentStep === 'orderSummary' ? 'show' : ''}`}>
                        <Row>
                            <Col lg={8} md={8} xl={8}>
                                <Card>
                                    <Card.Header>
                                        <h4 className="mb-0">Booking Summary</h4>
                                    </Card.Header>
                                    <Card.Body>
                                        <div className="">
                                            <div className="Main">
                                                <Row>
                                                    <Col lg='12'>
                                                        <Alert variant="success d-flex flex-column" role="alert">

                                                            <div className="d-flex mb-2">
                                                                <svg className="me-2" id="check-circle-fill" width="20" fill="currentColor" viewBox="0 0 16 16">
                                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
                                                                </svg>
                                                                <strong>Hurray! Booking Success</strong>
                                                            </div>
                                                            <div>

                                                                {/* <h5 className="p-0 m-0">Thank you for booking!</h5> */}
                                                                <p className="p-0 m-0">Check Email/SMS/WhatsApp For Confirmation.</p>
                                                            </div>
                                                        </Alert>
                                                    </Col>

                                                    <Col>
                                                        <Row>
                                                            <Col lg='3'>
                                                                <Image src={event?.thumbnail || partyImage}
                                                                    width={200}
                                                                    alt="product-details"
                                                                    className="img-fluid iq-product-img hover-media border rounded-4"
                                                                ></Image>

                                                            </Col>
                                                            <Col lg='9'>
                                                                <div className="d-flex flex-column gap-2">
                                                                    <div className="item d-flex gap-2 mt-3">
                                                                        <div className="icon">
                                                                            <svg fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                                <path fillRule="evenodd" clipRule="evenodd" d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63549 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M8.43994 12.0002L10.8139 14.3732L15.5599 9.6272" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="data">Name : <strong>{event?.name}</strong></div>
                                                                    </div>
                                                                    <div className="item d-flex gap-2">
                                                                        <div className="icon">
                                                                            <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-32" width="32" height="32" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M14.5 10.5005C14.5 9.11924 13.3808 8 12.0005 8C10.6192 8 9.5 9.11924 9.5 10.5005C9.5 11.8808 10.6192 13 12.0005 13C13.3808 13 14.5 11.8808 14.5 10.5005Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M11.9995 21C10.801 21 4.5 15.8984 4.5 10.5633C4.5 6.38664 7.8571 3 11.9995 3C16.1419 3 19.5 6.38664 19.5 10.5633C19.5 15.8984 13.198 21 11.9995 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                                        </div>
                                                                        <div className="data">Venue : <strong>{event?.address}</strong></div>
                                                                    </div>
                                                                    <div className="item d-flex gap-2">
                                                                        <div className="item d-flex gap-2">
                                                                            <div className="icon">
                                                                                <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-32" width="32" height="32" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M16.3345 2.75024H7.66549C4.64449 2.75024 2.75049 4.88924 2.75049 7.91624V16.0842C2.75049 19.1112 4.63449 21.2502 7.66549 21.2502H16.3335C19.3645 21.2502 21.2505 19.1112 21.2505 16.0842V7.91624C21.2505 4.88924 19.3645 2.75024 16.3345 2.75024Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.391 14.0178L12 11.9948V7.63379" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                                            </div>
                                                                            <div className="data">Time : <strong>{convertTo12HourFormat(event?.start_time)}</strong></div>
                                                                        </div> |
                                                                        <div className="item d-flex gap-2">
                                                                            <div className="icon">
                                                                                <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-32" width="32" height="32" viewBox="0 0 24 24"><path d="M11.9951 16.6766V14.1396" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M18.19 5.33008C19.88 5.33008 21.24 6.70008 21.24 8.39008V11.8301C18.78 13.2701 15.53 14.1401 11.99 14.1401C8.45 14.1401 5.21 13.2701 2.75 11.8301V8.38008C2.75 6.69008 4.12 5.33008 5.81 5.33008H18.19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.4951 5.32576V4.95976C15.4951 3.73976 14.5051 2.74976 13.2851 2.74976H10.7051C9.48512 2.74976 8.49512 3.73976 8.49512 4.95976V5.32576" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M2.77441 15.4829L2.96341 17.9919C3.09141 19.6829 4.50041 20.9899 6.19541 20.9899H17.7944C19.4894 20.9899 20.8984 19.6829 21.0264 17.9919L21.2154 15.4829" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                                            </div>
                                                                            <div className="data">
                                                                                Ticket QTY : <strong>{quantity || 1}</strong>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="item d-flex gap-2">
                                                                        <div className="icon">
                                                                            <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-32" width="32" height="32" viewBox="0 0 24 24"><path d="M13.8496 4.25024V6.67024" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.8496 17.76V19.784" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M13.8496 14.3247V9.50366" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M18.7021 20C20.5242 20 22 18.5426 22 16.7431V14.1506C20.7943 14.1506 19.8233 13.1917 19.8233 12.001C19.8233 10.8104 20.7943 9.85039 22 9.85039L21.999 7.25686C21.999 5.45745 20.5221 4 18.7011 4H5.29892C3.47789 4 2.00104 5.45745 2.00104 7.25686L2 9.93485C3.20567 9.93485 4.17668 10.8104 4.17668 12.001C4.17668 13.1917 3.20567 14.1506 2 14.1506V16.7431C2 18.5426 3.4758 20 5.29787 20H18.7021Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                                        </div>
                                                                        Ticket Type : <strong>
                                                                            {selectedTickets?.category}
                                                                        </strong>
                                                                    </div>
                                                                    <div className="item d-flex gap-2">
                                                                        <div className="icon">
                                                                            <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-32" width="32" height="32" viewBox="0 0 24 24"><path d="M2.75 3.25L4.83 3.61L5.793 15.083C5.87 16.02 6.653 16.739 7.593 16.736H18.502C19.399 16.738 20.16 16.078 20.287 15.19L21.236 8.632C21.342 7.899 20.833 7.219 20.101 7.113C20.037 7.104 5.164 7.099 5.164 7.099" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14.125 10.7949H16.898" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M7.15435 20.2026C7.45535 20.2026 7.69835 20.4466 7.69835 20.7466C7.69835 21.0476 7.45535 21.2916 7.15435 21.2916C6.85335 21.2916 6.61035 21.0476 6.61035 20.7466C6.61035 20.4466 6.85335 20.2026 7.15435 20.2026Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M18.4346 20.2026C18.7356 20.2026 18.9796 20.4466 18.9796 20.7466C18.9796 21.0476 18.7356 21.2916 18.4346 21.2916C18.1336 21.2916 17.8906 21.0476 17.8906 20.7466C17.8906 20.4466 18.1336 20.2026 18.4346 20.2026Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                                        </div>
                                                                        <div className="data">Total Amount : <strong>{localStorage.getItem('total')}</strong></div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col lg='12'>
                                                                <div className="radio-group text-center">
                                                                    <div key={`inline-${'radio'}`} className="mb-3">
                                                                        <label className="text-dark me-2">Download Ticket</label>
                                                                        <Form.Check
                                                                            inline
                                                                            label="Individual"
                                                                            name="group1"
                                                                            type={'radio'}
                                                                            id={`inline-${'radio'}-1`}
                                                                            value={'individual'}
                                                                            disabled={disableChoice}
                                                                            onChange={(e) => setDownladTicketType(e.target.value)}
                                                                        />
                                                                        <Form.Check
                                                                            inline
                                                                            label="Group"
                                                                            name="group1"
                                                                            type={'radio'}
                                                                            value={'combine'}
                                                                            id={`inline-${'radio'}-2`}
                                                                            disabled={disableChoice}
                                                                            onChange={(e) => setDownladTicketType(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                            <Col>
                                                                {
                                                                    disableChoice &&
                                                                    <div className="d-flex justify-content-center">
                                                                        <Button variant="success py-2 px-4 m-0  d-flex align-items-center gap-1" onClick={() => navigate('/dashboard/bookings')}>
                                                                            <div style={{ cursor: 'pointer', marginTop: '-2px' }} className="download-btn">
                                                                                <div className="icon">
                                                                                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-32" width="32" height="32" viewBox="0 0 24 24"><path d="M2.75 3.25L4.83 3.61L5.793 15.083C5.87 16.02 6.653 16.739 7.593 16.736H18.502C19.399 16.738 20.16 16.078 20.287 15.19L21.236 8.632C21.342 7.899 20.833 7.219 20.101 7.113C20.037 7.104 5.164 7.099 5.164 7.099" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14.125 10.7949H16.898" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M7.15435 20.2026C7.45535 20.2026 7.69835 20.4466 7.69835 20.7466C7.69835 21.0476 7.45535 21.2916 7.15435 21.2916C6.85335 21.2916 6.61035 21.0476 6.61035 20.7466C6.61035 20.4466 6.85335 20.2026 7.15435 20.2026Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M18.4346 20.2026C18.7356 20.2026 18.9796 20.4466 18.9796 20.7466C18.9796 21.0476 18.7356 21.2916 18.4346 21.2916C18.1336 21.2916 17.8906 21.0476 17.8906 20.7466C17.8906 20.4466 18.1336 20.2026 18.4346 20.2026Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                                                                </div>
                                                                            </div>
                                                                            View My Bookings
                                                                        </Button>
                                                                    </div>
                                                                }
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                }
            </Row>
        </Fragment>
    );
});

NewChekout.displayName = "NewChekout";
export default NewChekout;
