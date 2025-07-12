import React from 'react'
import { Row, Col, Card, Alert, Image, Button } from 'react-bootstrap';
import { TrueCircleIcon } from '../../../CustomHooks/CustomIcon';
import partyImage from "../../../../../../assets/modules/e-commerce/images/product/party3.jpg";
import BookingsAttendee from './BookingsAttendee';
import { ArrowBigDownDash, BriefcaseBusiness, Calendar, Clock, MapPin, ShoppingCart, SquareCheck, Ticket } from 'lucide-react';
import Swal from 'sweetalert2';
const Sumary = ({
    event,
    mainBookings,
    selectedTickets,
    isMaster,
    disableChoice,
    setDownladTicketType,
    navigate,
    currentStep,
    convertTo12HourFormat,
    apiData,
    attendeeList
}) => {
    console.log('selectedT',attendeeList)
    const handleDownloadClick = () => {
        Swal.fire({
            title: 'Download Ticket',
            text: "Choose how you want to download your ticket.Once a ticket type is selected, it can't be changed!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Combine',
            cancelButtonText: isMaster ? 'Individual' : 'Cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setDownladTicketType({ type: 'combine' });
            } else if (result.dismiss === Swal.DismissReason.cancel && isMaster) {
                setDownladTicketType({ type: 'individual' });
            }
        });
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };
    return (
        <div id="order-summary" className={`iq-product-tracker-card b-0 ${currentStep === 'orderSummary' ? 'show' : ''}`}>
            <Row>
                <Col lg={6} md={6} xl={6}>
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
                                                    <TrueCircleIcon />
                                                    <strong>Hurray! Booking Success</strong>
                                                </div>
                                                <div>
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
                                                <Col lg="9">
                                                    <div className="d-flex flex-column gap-2 text-black my-3">
                                                        {/* Define all data items in an array for mapping */}
                                                        {[
                                                            { icon: <SquareCheck size={16} />, label: "Name", value: event?.name },
                                                            { icon: <MapPin size={16} />, label: "Venue", value: event?.address },
                                                            // Group items that should appear on the same line
                                                            [
                                                                { icon: <Clock size={16} />, label: "Time", value: convertTo12HourFormat(event?.start_time) },
                                                                { icon: <BriefcaseBusiness size={16} />, label: "Ticket QTY", value: selectedTickets?.quantity || attendeeList.length || 1 }
                                                            ],
                                                            [
                                                                { icon: <Ticket size={16} />, label: "Type", value: selectedTickets?.category },
                                                                { icon: <ShoppingCart size={16} />, label: "Total AMT", value: `₹${(mainBookings[0]?.amount || mainBookings?.amount )?? 0}` }
                                                            ],
                                                            [
                                                                { icon: <Calendar size={16} />, label: "Payment Date", value: formatDate(new Date()) },
                                                                ...(mainBookings?.booking_date || mainBookings[0]?.booking_date ? [
                                                                    { icon: <Calendar size={16} />, label: "Booking Date", value: formatDate(mainBookings?.booking_date ?? mainBookings[0]?.booking_date) }
                                                                ] : [])
                                                            ]
                                                        ].map((item, index) => (
                                                            <div key={index} className={`item d-flex ${Array.isArray(item) ? 'gap-3' : 'gap-2'}`}>
                                                                {Array.isArray(item) ? (
                                                                    // Render two items on the same line
                                                                    item.map((subItem, subIndex) => (
                                                                        <div key={subIndex} className="d-flex gap-2">
                                                                            <div className="icon">{subItem.icon}</div>
                                                                            <div className="data" style={{ color: "#000" }}>
                                                                                {subItem.label}: <strong style={{ color: "#000" }}>{subItem.value}</strong>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    // Render single item
                                                                    <>
                                                                        <div className="icon">{item.icon}</div>
                                                                        <div className="data" style={{ color: "#000" }}>
                                                                            {item.label}: <strong style={{ color: "#000" }}>{item.value}</strong>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Row>
                                                        <Col lg="12" className="d-flex justify-content-center gap-3 mt-3">
                                                            {[
                                                                {
                                                                    variant: "primary",
                                                                    text: "Download",
                                                                    icon: <ArrowBigDownDash size={18} />,
                                                                    onClick: handleDownloadClick
                                                                },
                                                                {
                                                                    variant: "success",
                                                                    text: "My Bookings",
                                                                    icon: <ShoppingCart size={18} />,
                                                                    onClick: () => navigate('/dashboard/bookings')
                                                                }
                                                            ].map((button, index) => (
                                                                <Button
                                                                    key={index}
                                                                    variant={button.variant}
                                                                    className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                                                                    onClick={button.onClick}
                                                                >
                                                                    <span>{button.text}</span>
                                                                    {button.icon}
                                                                </Button>
                                                            ))}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                {attendeeList?.length > 0 &&
                    <Col lg={6} md={6} xl={6}>
                        <Card>
                            <Card.Header>Attendee Details</Card.Header>
                            <Card.Body>
                                <BookingsAttendee
                                    attendeeList={attendeeList}
                                    apiData={apiData}
                                    ShowAction={false}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                }
            </Row>
        </div>
    )
}

export default Sumary