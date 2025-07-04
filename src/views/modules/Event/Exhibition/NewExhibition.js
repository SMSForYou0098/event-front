import React, { useState, memo, Fragment, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import Swal from "sweetalert2";
import MobileCheckOut from "../Events/StaticComponents/mobileCheckOut";
import CheckOutTickets from "../TicketModal/CheckOutTickets";
import DynamicAttendeeForm from "../Events/LandingEvents/OrderComps/DynamicAttendeeForm";
import { checkForDuplicateAttendees, sanitizeData, sanitizeInput, validateAttendeeData } from "../CustomComponents/AttendeeStroreUtils";
import DuplicateAttendeeError from "../Events/LandingEvents/OrderComps/DuplicateAttendeeError";
import { cancelToken } from "../CustomUtils/Consts";
import EventAccordionAgentPOS from "../Agent/AgnetBookingComps/EventAccordionAgentPOS";
import AgentBookingSummary from "../Agent/AgnetBookingComps/AgentBookingSummary";
import POSPrintModal from "../POS/POSPrintModal";
import TicketModal from "../TicketModal/TicketModal";

const NewExhibition = memo(() => {
    const { api, UserData, isMobile, ErrorAlert,
        authToken, getCurrencySymbol, fetchCategoryData, successAlert ,formatDateRange} = useMyContext();
    const [isCheckOut, setIsCheckOut] = useState(true);
    const [event, setEvent] = useState([]);

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
    const [disableChoice, setDisableChoice] = useState(false);
    const [ticketSummary, setTicketSummary] = useState([]);
    const [selectedTicketID, setSelectedTicketID] = useState(null);
    const [discountType, setDiscountType] = useState('fixed');
    const [method, setMethod] = useState('Cash');
    const [discountValue, setDiscountValue] = useState();
    const [confirm, setConfirm] = useState(false);
    const [resetCounterTrigger, setRsetCounterTrigger] = useState(0)
    const [bookings, setBookings] = useState([])
    const [categoryData, setCategoryData] = useState();
    const [disable, setDisable] = useState(false);
    const [bookingData, setBookingData] = useState();

    //attndee state
    const [isAttendeeRequired, setIsAttendeeRequired] = useState(false);
    const [attendeeState, setAttendeeState] = useState(false);
    const [selectedAttendees, setSelectedAttendees] = useState();
    const [allAttendees, setAllAttendees] = useState([]);
    const [attendees, setAttendees] = useState([]);

    const AttendyView = () => {
        setIsAttendeeRequired(categoryData?.categoryData?.attendy_required === 1);
        return categoryData?.categoryData?.attendy_required === 1
    }

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
            .then(async (res) => {
                if (res.data.status) {
                    let data = res.data.events
                    setEvent(data)
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
    }, [bookingHistory, event?.tickets]);



    //model states
    const [showPrintModel, setShowPrintModel] = useState(false);
    const handleClose = () => {
        setShowPrintModel(false)
        setConfirm(false)
        // navigate('/dashboard/agent-bookings');
    }



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
        setActiveKey(null);
    };



    const getSelectedAttendees = (data) => {
        setAllAttendees(data)
        setDisable(data?.length === selectedTickets?.quantity ? false : true);
        setSelectedAttendees(data?.length)
    }

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

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
                handleBooking()
                //await HandleAttendeeSubmit()
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
                        handleBooking(response?.data?.data[0]?.id);
                        setShowPrintModel(true);
                    }
                } catch (error) {
                    console.error('Error submitting form data:', error);
                }
            }
        });
    };


    const handleBooking = async (attendeeID) => {
        //console.log(attendees[0]?.id);return
        setAttendeeState(false)
        const validTickets = selectedTickets?.quantity > 0 && selectedTickets;
        if (validTickets?.quantity === undefined) {
            ErrorAlert('Please Select A Ticket')
        } else {
            const requestData = {
                user_id: UserData?.id,
                agent_id: UserData?.id,
                tickets: validTickets,
                attendee_id: attendeeID,
                discount: discount,
                amount: grandTotal,
                payment_method: method,
            };
            try {
                // Book tickets
                const res = await axios.post(`${api}book-exhibition/${event?.id}`, requestData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    },
                    cancelToken: cancelToken
                });
                if (res.data.status) {
                    //console.log(res.data)
                    setBookingData(res.data?.bookings);
                    // setShowPrintModel(true)
                    // setAttendeeState(res.data?.bookings);
                    GetBookings()
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <Fragment>
            <DuplicateAttendeeError errorMessages={errorMessages} showErrorModal={showErrorModal} setShowErrorModal={setShowErrorModal} />
            
             <TicketModal
                show={showPrintModel}
                showTicketDetails={true}
                showPrintButton={true}
                handleCloseModal={handleClose}
                ticketType={{type : 'combine'}}
                ticketData={bookingData}
                formatDateRange={formatDateRange}
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
                {attendeeState ?
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
                    :
                    <Col lg="8">
                        <Card>
                            <div className="card-header card-header d-flex align-content-center justify-content-between">
                                <h5>{event?.name}</h5>
                            </div>
                            <Card.Body className="p-0">
                                <CheckOutTickets
                                    event={event}
                                    isMobile={isMobile}
                                    resetCounterTrigger={resetCounterTrigger}
                                    getTicketCount={getTicketCount}
                                    selectedTickets={selectedTickets}
                                    getCurrencySymbol={getCurrencySymbol}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                }
                <Col lg="4">
                    <AgentBookingSummary
                        disabled={disable}
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
            </Row>
        </Fragment >
    );
});

NewExhibition.displayName = "NewExhibition";
export default NewExhibition;
