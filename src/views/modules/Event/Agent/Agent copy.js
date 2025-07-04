import React, { useState, memo, Fragment, useEffect } from "react";

// Router
import { Link, useLocation, useNavigate } from "react-router-dom";

// React-bootstrap
import { Button, Row, Col, Table, Card, Modal, Form, Image, Accordion } from "react-bootstrap";

import axios from "axios";


import currencyData from '../../../../JSON/currency.json';
import animate from '../../../../assets/event/stock/send_confirm.gif';
import CustomCounter from "../Events/Counter/customCounter";
import { useMyContext } from "../../../../Context/MyContextProvider";
import PosEvents from "../POS/PosEvents";

const Agent = memo(() => {
    const { api, UserData, isMobile, sendTickets, ErrorAlert, successAlert, authToken, formateTemplateTime } = useMyContext();
    const id = 6;
    const navigate = useNavigate();
    const [isCheckOut, setIsCheckOut] = useState(true);
    const [currentStep, setCurrentStep] = useState('checkout');
    const [event, setEvent] = useState([]);
    const [currencyMaster, setCurrencyMaster] = useState([]);
    const [selectedTickets, setSelectedTickets] = useState([]);
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
    const [resetCounters, setResetCounters] = useState(0);
    const [resetCounterTrigger, setRsetCounterTrigger] = useState(0)
    const [bookings, setBookings] = useState([])

    //send mail states
    const [masterBookings, setMasterBookings] = useState([]);
    const [normalBookings, setNormalBookings] = useState([]);
    const [mainBookings, setMainBookings] = useState([]);




    const GetBookings = async () => {
        await axios.get(`${api}agent-bookings/${UserData?.id}`, {
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
        setCurrencyMaster(currencyData)
        GetBookings()
        if (isMobile) {
            setIsCheckOut(true)
        }
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
        setSelectedTickets(prevTickets => {
            const existingIndex = prevTickets.findIndex(ticket => ticket.category === category);
            if (existingIndex !== -1) {
                // If category exists, update its quantity
                const updatedTickets = [...prevTickets];
                updatedTickets[existingIndex].quantity = quantity;
                return updatedTickets;
            } else {
                return [...prevTickets, { category, quantity, price, id }];
            }
        });
    }

    useEffect(() => {
        const isAnyTicketSelected = selectedTickets?.some(ticket => ticket?.quantity > 0);
        if (isAnyTicketSelected) {
            const total = selectedTickets.reduce((acc, ticket) => {
                let price = ticket?.sale === 'true' ? ticket?.sale_price : ticket?.price
                const totalPriceForCategory = price * ticket.quantity;
                return acc + totalPriceForCategory;
            }, 0);
            setSubTotal(total);
        } else {
            setSubTotal(0)
            setBaseAmount(0)
            setCentralGST(0)
            setStateGST(0)
            setTotalTax(0)
            setGrandTotal(0)
        }
    }, [selectedTickets]);


    useEffect(() => {
        if (subtotal) {
            setBaseAmount(subtotal * 10 / 100)
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



    //model states
    const [showPrintModel, setShowPrintModel] = useState(false);
    const HandleBookingModel = () => {
        const validTickets = selectedTickets.filter(ticket => ticket.quantity > 0);
        if (validTickets[0]?.quantity === undefined) {
            ErrorAlert('Please Select A Ticket')
        } else {
            setShowPrintModel(true)
        }
    }
    const handleSubmit = async () => {
        await axios.post(`${api}chek-email`, {
            'email': email,
            'number': number,
        }, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.exists) {
                setAttendee(res.data.user)

                //ErrorAlert(res.data.message)
            } else {
                handleSignUp()
            }
        }).catch((err) =>
            console.log(err)
        )
    }
    const handleSignUp = async () => {
        await axios.post(`${api}create-user`, {
            'name': name,
            'email': email,
            'number': number,
            'password': number,
            'reporting_user': UserData?.id
        }, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {

                setAttendee(res.data.user)
                //handleBooking(res.data.user?.id)
            }
        }).catch((err) =>
            console.log(err)
        )
    }
    const handleClose = () => {
        setShowPrintModel(false)
        setConfirm(false)
        navigate('/dashboard/agent-bookings');
        setRsetCounterTrigger(resetCounterTrigger + 1)
        setResetCounters(prev => prev + 1);
        //successAlert('Success','Booking Successfully')
    }
    const handleBooking = async () => {
        const validTickets = selectedTickets.filter(ticket => ticket.quantity > 0);

        const requestData = {
            agent_id: UserData?.id,
            user_id: attendee?.id,
            number: attendee?.number,
            email: attendee?.email,
            name: attendee?.name,
            payment_method: method,
            amount: grandTotal,
            discount: discount,
            tickets: validTickets
        };
        try {
            const res = await axios.post(`${api}book-ticket/${id}`, requestData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                setBookingHistory(res.data?.bookings);
                const bookings = res.data?.bookings;
                setNormalBookings(prevNormalBookings => [...prevNormalBookings, ...bookings]);
                const bookingsByCategory = bookings.reduce((acc, booking) => {
                    const ticket = validTickets.find(t => t.id === booking.ticket_id);
                    if (ticket) {
                        if (!acc[ticket.category]) {
                            acc[ticket.category] = [];
                        }
                        acc[ticket.category].push(booking.id);
                    }
                    return acc;
                }, {});
                for (const category in bookingsByCategory) {
                    const bookingIds = bookingsByCategory[category];
                    if (bookingIds.length > 1) {
                        const masterRes = await axios.post(`${api}master-booking/${attendee?.id}`, {
                            agent_id: UserData?.id,
                            user_id: attendee?.id,
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
                            HandleSendTicket(masterRes.data?.booking)
                        }
                    } else {
                        HandleSendTicket(bookings.find((item) => item?.id === bookingIds[0]))
                        setLoading(false)
                        setConfirm(true);
                    }
                }
                setIsCheckOut(false);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const HandleSendTicket = (data) => {
        // console.log(data,'new')
        sendTickets(data, 'new')
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
        getTicketData(id)
        setActiveKey(null);

    };

    //send mail
    useEffect(() => {
        if (masterBookings.length > 0) {
            const masterBookingIds = masterBookings.flatMap((data) =>data?.booking_id);
            // const masterBookingIds = masterBookings.flatMap((data) => JSON.parse(data?.booking_id));
            //console.log(masterBookingIds);
            const filteredNormalBookings = normalBookings.filter(
                (booking) => !masterBookingIds.includes(booking?.id)
            );

            const combinedBookings = [...masterBookings, ...filteredNormalBookings];
            setMainBookings(combinedBookings)
        }
    }, [masterBookings, normalBookings]);

    useEffect(() => {
        const validTickets = selectedTickets.filter(ticket => ticket.quantity > 0);
        if (mainBookings?.length === validTickets?.length) {
            HandleSendMail(mainBookings)
        }
    }, [mainBookings]);

    const getTicketPrice = (category) => {
        let ticket = event?.tickets?.find((item) => item.name === category)
        return ticket?.price
    }
    const HandleSendMail = async (data) => {

        //event data
        const validTickets = selectedTickets.filter(ticket => ticket.quantity > 0);
        if (data?.length === validTickets?.length) {
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
                    convenience_fee:0,
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
            const res = await axios.post(`${api}booking-mail/${UserData?.id}`, { data }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <Fragment>
            {/* print model  */}
            <Modal show={showPrintModel} onHide={() => handleClose()} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{confirm ? 'Booking Confirmation' : 'Attendee Detail'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {confirm ?
                        <div className="d-flex flex-column justify-content-center py-3">
                            <h4 className="text-center">Thank You For Your Booking!</h4>
                            <span className="text-center">
                                <Image src={animate} width={200} />
                            </span>
                            <h3 className="text-center">Booking Confirmed</h3>
                            <p className="text-center">Ticket sent to {attendee?.name} on Email/WhatsApp/SMS.</p>

                            <div className="text-center">
                                <Button className="border rounded-pill w-50" onClick={() => handleClose()}>Close</Button>
                            </div>
                        </div>

                        :
                        <div className="">
                            <Row className="d-flex justify-content-between">
                                <Col sm="12" md="12" className="form-group">
                                    <input type="text" className="form-control mb-0" id="firstName" placeholder="Enter Name" onChange={(e) => setName(e.target.value)} />
                                </Col>
                                <Col sm="12" md="12" className="form-group">
                                    <input type="number" className="form-control mb-0" id="Phone_NO" placeholder="Enter Phone Number" onChange={(e) => setNumber(e.target.value)} />
                                </Col>
                                <Col sm="12" md="12" className="form-group">
                                    <input type="email" className="form-control mb-0" id="Emailid" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
                                </Col>
                                <Col sm="12" md="12" className="form-group">
                                    <div className="text-center pb-3">
                                        <Form.Label className="form-check-label ms-1" htmlFor="aggrement-hopeui">Ticket will be sent to {name || 'User'} on Email/WhatsApp/SMS</Form.Label>
                                    </div>
                                </Col>
                                <Col sm="4" md="4" className="form-group">
                                    <div className="form-radio form-check">
                                        <Form.Check.Input
                                            type="radio"
                                            id="customRadio8"
                                            name="payment"
                                            className="me-2"
                                            value={'Cash'}
                                            onChange={(e) => setMethod(e.target.value)}
                                            defaultChecked
                                        />
                                        <Form.Label
                                            className="custom-control-label"
                                            htmlFor="customRadio8"
                                        >
                                            {" "}
                                            Cash
                                        </Form.Label>
                                    </div>
                                </Col>
                                <Col sm="4" md="4" className="form-group">
                                    <div className="form-radio form-check">
                                        <Form.Check.Input
                                            type="radio"
                                            id="customRadio8"
                                            name="payment"
                                            className="me-2"
                                            value={'UPI'}
                                            onChange={(e) => setMethod(e.target.value)}

                                        />
                                        <Form.Label
                                            className="custom-control-label"
                                            htmlFor="customRadio8"
                                        >
                                            {" "}
                                            UPI
                                        </Form.Label>
                                    </div>
                                </Col>
                                <Col sm="4" md="4" className="form-group">
                                    <div className="form-radio form-check">
                                        <Form.Check.Input
                                            type="radio"
                                            id="customRadio8"
                                            name="payment"
                                            className="me-2"
                                            value={'Net Banking'}
                                            onChange={(e) => setMethod(e.target.value)}
                                        />
                                        <Form.Label
                                            className="custom-control-label"
                                            htmlFor="customRadio8"
                                        >
                                            {" "}
                                            Net Banking
                                        </Form.Label>
                                    </div>
                                </Col>
                                <Col sm="12" md="12" className="form-group">
                                    <div className="d-flex justify-content-center pb-3">
                                        <Button type="button" className="btn btn-primary d-flex align-content-center gap-2"
                                            onClick={() => handleSubmit()}
                                        >
                                            {loading &&
                                                <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-20" height="20"><path d="M21.4274 2.5783C20.9274 2.0673 20.1874 1.8783 19.4974 2.0783L3.40742 6.7273C2.67942 6.9293 2.16342 7.5063 2.02442 8.2383C1.88242 8.9843 2.37842 9.9323 3.02642 10.3283L8.05742 13.4003C8.57342 13.7163 9.23942 13.6373 9.66642 13.2093L15.4274 7.4483C15.7174 7.1473 16.1974 7.1473 16.4874 7.4483C16.7774 7.7373 16.7774 8.2083 16.4874 8.5083L10.7164 14.2693C10.2884 14.6973 10.2084 15.3613 10.5234 15.8783L13.5974 20.9283C13.9574 21.5273 14.5774 21.8683 15.2574 21.8683C15.3374 21.8683 15.4274 21.8683 15.5074 21.8573C16.2874 21.7583 16.9074 21.2273 17.1374 20.4773L21.9074 4.5083C22.1174 3.8283 21.9274 3.0883 21.4274 2.5783Z" fill="currentColor"></path><path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M3.01049 16.8079C2.81849 16.8079 2.62649 16.7349 2.48049 16.5879C2.18749 16.2949 2.18749 15.8209 2.48049 15.5279L3.84549 14.1619C4.13849 13.8699 4.61349 13.8699 4.90649 14.1619C5.19849 14.4549 5.19849 14.9299 4.90649 15.2229L3.54049 16.5879C3.39449 16.7349 3.20249 16.8079 3.01049 16.8079ZM6.77169 18.0003C6.57969 18.0003 6.38769 17.9273 6.24169 17.7803C5.94869 17.4873 5.94869 17.0133 6.24169 16.7203L7.60669 15.3543C7.89969 15.0623 8.37469 15.0623 8.66769 15.3543C8.95969 15.6473 8.95969 16.1223 8.66769 16.4153L7.30169 17.7803C7.15569 17.9273 6.96369 18.0003 6.77169 18.0003ZM7.02539 21.5683C7.17139 21.7153 7.36339 21.7883 7.55539 21.7883C7.74739 21.7883 7.93939 21.7153 8.08539 21.5683L9.45139 20.2033C9.74339 19.9103 9.74339 19.4353 9.45139 19.1423C9.15839 18.8503 8.68339 18.8503 8.39039 19.1423L7.02539 20.5083C6.73239 20.8013 6.73239 21.2753 7.02539 21.5683Z" fill="currentColor"></path></svg>
                                            }
                                            {loading ? 'Seding Tickets' : 'Submit'}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    }
                </Modal.Body>
            </Modal>
            {/* print model end */}
            {/* mobile */}
            {
                (isMobile && isCheckOut) &&

                <div className="d-flex  flex-wrap gap-4 p-0  w-100 justify-content-center bg-danger"
                    style={{
                        position: 'fixed',
                        left: '0',
                        zIndex: '99',
                        bottom: '0',
                    }}
                >
                    <div className="d-flex align-content-center w-100" onClick={() => setShowPrintModel(true)}>
                        <Link
                            to=""
                            className="btn text-white d-flex align-items-center py-4 w-100 justify-content-center p-0 bg-warning"
                            style={{ borderRadius: '0' }}
                        >
                            <strong>Amount :</strong> {ticketCurrency}{grandTotal}
                        </Link>
                        <Link
                            to=""
                            className="btn btn-primary d-flex align-items-center py-4 w-100 justify-content-center p-0"
                            style={{ borderRadius: '0' }}
                        >
                            Checkout
                        </Link>
                    </div>
                </div>
            }
            {/* end mobile  */}
            <Row>
                <Col lg="12">
                    <Card>
                        <Card.Body className="py-0">
                            <Accordion flush className="p-0" activeKey={activeKey} onSelect={(e) => setActiveKey(e)}>
                                <Accordion.Item eventKey="0" className="bg-transparent">
                                    <Accordion.Header>Events</Accordion.Header>
                                    <Accordion.Body className="bg-transparent p-0 pt-3">
                                        <Row>
                                            <Col lg="12">
                                                <Form>
                                                    <Row>
                                                        <Col lg="12">
                                                            <Form.Group className="mb-3 form-group input-group search-input w-100">
                                                                <input
                                                                    type="search"
                                                                    className="form-control"
                                                                    placeholder="Search Your Event..."
                                                                />
                                                                <span className="input-group-text">
                                                                    <svg
                                                                        width="18"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                    >
                                                                        <circle
                                                                            cx="11.7669"
                                                                            cy="11.7666"
                                                                            r="8.98856"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        ></circle>
                                                                        <path
                                                                            d="M18.0186 18.4851L21.5426 22"
                                                                            stroke="currentColor"
                                                                            strokeWidth="1.5"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        ></path>
                                                                    </svg>
                                                                </span>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Col>
                                            <Col lg="12">
                                                <PosEvents handleButtonClick={handleButtonClick} />
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg="8">
                    <Card>
                        <div className="card-header card-header d-flex align-content-center justify-content-between">
                            <h5>{event?.name}</h5>
                        </div>
                        <Card.Body className="p-0">
                            <Table responsive className="mb-0">
                                <tbody>
                                    {event?.tickets?.map((item, index) => {
                                        return (
                                            <tr data-item="list" key={index}>
                                                <td>
                                                    <div className="d-flex align-items-center gap-4">
                                                        <div>
                                                            <h6 className="mb-3">{item.name}</h6>
                                                            <p className="mb-1 d-flex gap-2">Price: {getCurrencySymbol(item.currency)}
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
                                                <td>
                                                    <CustomCounter
                                                        rsetCounterTrigger={resetCounterTrigger}
                                                        getTicketCount={getTicketCount}
                                                        category={item.name}
                                                        price={item?.sale === 1 ? item?.sale_price : item?.price}
                                                        limit={10}
                                                        ticketID={item.id}
                                                        disabled={selectedTicketID !== null && selectedTicketID !== item.id}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-3">
                                                        <p className="text-decoration-line-through mb-0">
                                                        </p>
                                                        <Link to="#" className="text-decoration-none">
                                                            {getCurrencySymbol(item.currency)}  {selectedTickets.map((ticket) =>
                                                                ticket.category === item.name &&
                                                                (item?.sale === 1 ? item?.sale_price : item?.price) * ticket.quantity
                                                            )}
                                                        </Link>
                                                    </div>
                                                </td>
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
                        <div className="d-flex  gap-2 justify-content-center">
                            <div className="d-flex  gap-2">
                                <div>Bookings :<span className="text-secondary"> {bookings?.allbookings?.length}</span>
                                </div>
                                <div>Amt :<span className="text-danger"> ₹{(bookings?.amount)?.toFixed(2)}</span>
                                </div>
                                <div>Disc :<span className="text-primary"> ₹{(bookings?.discount)?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="card-header d-flex align-content-center justify-content-between">
                            <h4 className="mb-0">Checkout</h4>
                            <div>
                                Available Balance :
                                <span className="text-primary"> ₹0</span>
                            </div>
                        </div>
                        <Card.Body>
                            <div className="border-bottom">
                            </div>
                            <div className="mt-4">
                                <div className="d-flex justify-content-between mb-4">
                                    <h6>Sub Total</h6>
                                    <h6 className="text-primary">{ticketCurrency}{subtotal}</h6>
                                </div>
                                <div className="d-flex justify-content-between mb-4">
                                    <h6>Discount</h6>
                                    <h6 className="text-success">{ticketCurrency}{discount}</h6>
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
                                <div className="border-bottom">
                                    <div className="input-group mb-3">
                                        <Form.Select
                                            aria-label="Default select example"
                                            value={discountType}
                                            onChange={(e) => setDiscountType(e.target.value)}
                                        >
                                            <option value="fixed">Fixed</option>
                                            <option value="percentage">Percentage</option>
                                        </Form.Select>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Add Discount"
                                            aria-label="value"
                                            aria-describedby="CouponCode"
                                            value={discountValue}
                                            onChange={(e) => setDiscountValue(e.target.value)}
                                        />
                                        <Button
                                            className="btn btn-primary"
                                            type="button"
                                            id="CouponCode"
                                            disabled={disableChoice}
                                            onClick={() => handleDiscount()}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">

                                <div className="d-flex justify-content-between mb-4">
                                    <h6 className="mb-0">Order Total</h6>
                                    <h5 className="text-primary mb-0">
                                        {ticketCurrency}{grandTotal}
                                    </h5>

                                </div>

                                {/* <div className="alert border-primary rounded border-1 mb-4">
                                            <div className="d-flex justify-content-between align-items-center ">
                                                <h6 className="text-primary mb-0">
                                                    Total Savings on this order
                                                </h6>
                                                <h6 className="text-primary mb-0">
                                                    <b>{ticketCurrency}{discount}</b>
                                                </h6>
                                            </div>
                                        </div> */}
                                {
                                    !isMobile &&
                                    <div className="d-flex">
                                        <Button
                                            id="place-order"
                                            to="#"
                                            // onClick={orderSummary}
                                            onClick={() => HandleBookingModel()}
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
        </Fragment >
    );
});

Agent.displayName = "Agent";
export default Agent;
