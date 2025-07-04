import React, { useState, memo, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, Table, Card, Form, Accordion } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import CustomCounter from "../Events/Counter/customCounter";
import PosEvents from "./PosEvents";
import POSPrintModal from "./POSPrintModal";
import POSAttendeeModal from "./POSAttendeeModal";
import CommonPricingComp from "../TicketModal/CommonPricingComp";
import OrderCalculation from "../CustomUtils/BookingUtils/OrderSmmary";
import DiscoutFIeldGroup from "../CustomUtils/BookingUtils/DiscoutFIeldGroup";
import { cancelToken, SECONDARY } from "../CustomUtils/Consts";
import { Calendar, Search } from "lucide-react";
const POS = memo(() => {
    const { api, UserData, isMobile, ErrorAlert, authToken, getCurrencySymbol, formatDateRange } = useMyContext();
    const [eventID, setEventID] = useState(true);
    const [isCheckOut, setIsCheckOut] = useState(true);
    const [event, setEvent] = useState([]);
    const [tickets, setTickets] = useState([]);
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
    const [disableChoice, setDisableChoice] = useState(false);
    const [ticketSummary, setTicketSummary] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [selectedTicketID, setSelectedTicketID] = useState(null);
    const [discountType, setDiscountType] = useState('fixed');
    const [discountValue, setDiscountValue] = useState();
    const [resetCounterTrigger, setRsetCounterTrigger] = useState(0)
    const [bookings, setBookings] = useState([])
    const [isAmusment, setIsAmusment] = useState(false);
    const GetBookings = async () => {
        const url = `${api}pos-bookings/${UserData?.id}`;
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
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
                    let data = res.data.events
                    setIsAmusment(data?.category?.title === 'Amusement')
                    setEvent(res.data.events)
                    if (res.data?.events?.tickets) {
                        let tt = res.data?.events?.tickets?.filter((item) => {
                            return parseInt(item?.status) === 1;
                        });
                        if (tt?.length > 0) {
                            setTickets(tt || []);
                        }
                    }
                }
            }).catch((err) =>
                console.log(err)
            )
    }
    useEffect(() => {
        if (isMobile) {
            setIsCheckOut(true)
        }
    }, [isMobile])


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
            const firstSelectedTicket = selectedTickets.find(ticket => ticket?.quantity > 0);
            setTickets(tickets?.filter((item) => item?.id === firstSelectedTicket?.id));
        } else {
            setSubTotal(0)
            setBaseAmount(0)
            setCentralGST(0)
            setStateGST(0)
            setTotalTax(0)
            setGrandTotal(0)
            setTickets(event?.tickets)
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
                setDiscount(discountValue)
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
            const ticketsData = Object.values(ticketMap);
            setTicketSummary(ticketsData);
        }
    }, [bookingHistory, event?.tickets]);



    //model states
    const [showPrintModel, setShowPrintModel] = useState(false);
    const [activeKey, setActiveKey] = useState('0');
    useEffect(() => {
        GetBookings()
        const accordionButton = document.querySelector('.accordion-button');
        if (accordionButton) {
            accordionButton.style.backgroundColor = 'transparent';
        }
    }, []);

    const handleButtonClick = (id) => {
        setRsetCounterTrigger(resetCounterTrigger + 1)
        getTicketData(id)
        setActiveKey(null);
    };
    const closePrintModel = () => {
        setShowPrintModel(false)
        resetfields()
        setRsetCounterTrigger(resetCounterTrigger + 1)
    }
    const StorePOSBooking = async () => {
        setShowAttendeeModel(false)
        const validTickets = selectedTickets.filter(ticket => ticket?.quantity > 0);
        if (validTickets[0]?.quantity === undefined) {
            ErrorAlert('Please Select A Ticket')
        } else {
            const requestData = {
                user_id: UserData?.id,
                number: number,
                name: name,
                tickets: validTickets,
                discount: discount,
                amount: grandTotal,
                payment_method: method,
            };
            try {
                // Book tickets
                let url;
                if (isAmusment) {
                    url = `${api}amusementBook-pos/${eventID}`
                } else {
                    url = `${api}book-pos/${eventID}`
                }
                const res = await axios.post(url, requestData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    },
                    cancelToken: cancelToken
                });
                if (res.data.status) {
                    setShowPrintModel(true)
                    setBookingData(res.data?.bookings);
                    GetBookings()
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    const resetfields = () => {
        setDiscountValue('')
        setName('')
        setNumber('')
        setDiscount(0)
        setSelectedTickets([]);
        setDisableChoice(false)
    }
    //attendee section
    const [showAttendeeModel, setShowAttendeeModel] = useState(false);
    const [method, setMethod] = useState();
    const handleClose = (skip) => {
        setShowAttendeeModel(false)
        if (skip) {
            StorePOSBooking()
        }
    }
    const handleBooking = async () => {
        const validTickets = selectedTickets.filter(ticket => ticket?.quantity > 0);
        if (validTickets[0]?.quantity === undefined) {
            ErrorAlert('Please Select A Ticket')
        } else {
            setShowAttendeeModel(true);
        }
    };
    const [searchTerm, setSearchTerm] = useState('')
    return (
        <Fragment>
            {/* print model  */}
            <POSAttendeeModal
                show={showAttendeeModel}
                handleClose={handleClose}
                setName={setName}
                name={name}
                setNumber={setNumber}
                number={number}
                setEmail={setName}
                handleSubmit={StorePOSBooking}
                setMethod={setMethod}
            />
            <POSPrintModal
                showPrintModel={showPrintModel}
                closePrintModel={closePrintModel}
                event={event}
                bookingData={bookingData}
                subtotal={subtotal}
                totalTax={totalTax}
                discount={discount}
                grandTotal={grandTotal}
            />
            {/* print model end */}
            {(isMobile && isCheckOut) &&
                <div className="d-flex w-100  flex-wrap gap-4 p-0  justify-content-center bg-danger"
                    style={{
                        position: 'fixed',
                        left: '0',
                        zIndex: '99',
                        bottom: '0',
                        // background: '#f16a1b'
                    }}
                >
                    <div className="d-flex align-content-center w-100" onClick={() => handleBooking()}>
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
                                                                    value={searchTerm}
                                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                                />
                                                                <span className="input-group-text">
                                                                    <Search size={16} />
                                                                </span>
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Col>
                                            <Col lg="12">
                                                <PosEvents searchTerm={searchTerm} handleButtonClick={handleButtonClick} />
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
                        <Card.Header className="py-3">
                            <div className="row align-items-center">
                                <div className="col-md-6 col-12">
                                    <h5 className="mb-0">{event?.name}</h5>
                                </div>
                                {(event?.date_range) && (
                                    <div className="col-md-6 col-12 text-md-end text-start mt-2 mt-md-0">
                                        <span className="text-black d-flex align-items-center gap-1 justify-content-md-end">
                                            <Button className="p-0 m-0 d-flex" variant="link">
                                                <Calendar size={16} color={SECONDARY} />
                                            </Button>
                                            : {formatDateRange(event?.date_range)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive className="mb-0">
                                <tbody>
                                    {tickets?.length > 0 ?
                                        tickets?.map((item, index) => {
                                            return (
                                                <tr data-item="list" key={index} className={`${(item.sold_out === 'true' || item.donation === 'true') && 'opacity-50'}`} style={{ pointerEvents: (item.sold_out === 'true' || item.donation === 'true') && 'none' }}>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-4">
                                                            <div>
                                                                <h6 className="mb-3">{item.name}{'  '}
                                                                    <span className="text-danger">
                                                                        {item.sold_out === 'true' ? 'Booking Closed' : item.donation === 'true' && 'Booking Not Started Yet'}
                                                                    </span>
                                                                </h6>
                                                                <p className="mb-1 d-flex gap-2 text-black">Price:
                                                                    <CommonPricingComp
                                                                        currency={item?.currency}
                                                                        price={item?.price}
                                                                        isSale={item?.sale}
                                                                        salePrice={item?.sale_price} />
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <CustomCounter
                                                            getTicketCount={getTicketCount}
                                                            category={item.name}
                                                            price={item?.sale === 1 ? item?.sale_price : item?.price}
                                                            limit={10}
                                                            resetCounterTrigger={resetCounterTrigger}
                                                            ticketID={item.id}
                                                            disabled={selectedTicketID !== null && selectedTicketID !== item.id}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="d-flex gap-3">
                                                            <p className="text-decoration-line-through mb-0">
                                                            </p>
                                                            <Link to="#" className="text-decoration-none">
                                                                {getCurrencySymbol(item?.currency)}{selectedTickets?.map((ticket) =>
                                                                    ticket.category === item.name &&
                                                                    (item?.sale === 1 ? item?.sale_price : item?.price) * ticket.quantity
                                                                )}
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                        :
                                        <tr>
                                            <td colSpan="3" className="text-center">No Tickets Available</td>
                                        </tr>
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg="4">
                    <Card>
                        <div className="d-flex  gap-2 justify-content-center">
                            <div>
                                Bookings :<span className="text-secondary"> {bookings?.allbookings?.length ?? 0}</span>
                            </div>
                            <div>
                                Amt :<span className="text-danger"> ₹{(parseInt(bookings?.amount) ?? 0).toFixed(2)}</span>
                            </div>
                            <div>
                                Disc :<span className="text-primary"> ₹{(parseInt(bookings?.discount) ?? 0).toFixed(2)}</span>
                            </div>
                        </div>
                        {/* <div className="card-header d-flex align-content-center justify-content-between">
                            <h4 className="mb-0">Checkout</h4>
                        </div> */}
                        <Card.Body>
                            <div className="mt-2">
                                <OrderCalculation
                                    ticketCurrency={ticketCurrency}
                                    subtotal={subtotal}
                                    discount={discount}
                                    baseAmount={baseAmount}
                                    centralGST={centralGST}
                                    totalTax={totalTax}
                                />
                                <DiscoutFIeldGroup
                                    discountType={discountType}
                                    setDiscountType={setDiscountType}
                                    discountValue={discountValue}
                                    setDiscountValue={setDiscountValue}
                                    disableChoice={disableChoice}
                                    handleDiscount={handleDiscount}
                                />
                            </div>
                            <div className="mt-4">

                                <div className="d-flex justify-content-between mb-4">
                                    <h6 className="mb-0">Order Total</h6>
                                    <h5 className="text-primary mb-0">
                                        {ticketCurrency}{grandTotal}
                                    </h5>
                                </div>
                                {
                                    !isMobile &&
                                    <div className="d-flex">
                                        <Button
                                            id="place-order"
                                            to="#"
                                            // onClick={orderSummary}
                                            onClick={handleBooking}
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

POS.displayName = "POS";
export default POS;
