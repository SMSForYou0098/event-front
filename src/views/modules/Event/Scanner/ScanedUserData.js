import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Image, Modal, Row } from 'react-bootstrap'
import BookingsAttendee from '../Events/LandingEvents/OrderComps/BookingsAttendee';
import { Calendar, CircleCheckBig, Clock, Hash, Phone, Ticket, User } from 'lucide-react';
import { useMyContext } from '../../../../Context/MyContextProvider';

const ScanedUserData = (props) => {
    const { show, ticketData, type, setShow, showAttendeee, attendees, categoryData, handleVerify, event } = props
    const { formatDateRange, convertTo12HourFormat } = useMyContext()
    const [hasData, setHasData] = useState(false);
    const [section, setSection] = useState(parseInt(event?.scan_detail));
    useEffect(() => {
        if (event) {
            setSection(parseInt(event?.scan_detail))
        }
    }, [event])

    const extractDate = (ticketData) => {
        if (!ticketData) return "";

        // Try to get date from primary ticket data or bookings
        const dateRange = ticketData?.ticket?.event?.date_range ||
            ticketData?.bookings?.[0]?.ticket?.event?.date_range || "";

        if (!dateRange) return "";
        // Return start date (From date)
        return dateRange;
    }

    const fields = [
        {
            label: "Name",
            icon: <User size={20} />,
            value: hasData
                ? ticketData?.name || ticketData?.bookings?.[0]?.name || ""
                : "",
        },
        {
            label: "Mo",
            icon: <Phone size={20} />,
            value: hasData
                ? ticketData?.number || ticketData?.bookings?.[0]?.number || ""
                : "",
        },
        {
            label: "Ticket",
            icon: <Ticket size={20} />,
            value: hasData
                ? ticketData?.ticket?.name || ticketData?.bookings?.[0]?.ticket?.name || ""
                : "",
        },
        {
            label: "QTY",
            icon: <Hash size={20} />,
            value: hasData
                ? ticketData?.quantity || ticketData?.bookings?.length || 1
                : "",
        },
        {
            label: "Date",
            icon: <Calendar size={20} />,
            value: hasData ? formatDateRange(extractDate(ticketData)) : "",
        },
        {
            label: "Time",
            icon: <Clock size={20} />,
            value: hasData
                ? convertTo12HourFormat(ticketData?.ticket?.event?.entry_time ||
                    ticketData?.bookings?.[0]?.ticket?.event?.entry_time) : "",
        },
    ];


    useEffect(() => {
        setHasData((Object.entries(ticketData)?.length || ticketData?.bookings?.length) > 0);
    }, [ticketData]);
    return (<Modal
        show={show}
        onHide={() => setShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        className="ticket-scan-modal"
    // centered
    >
        <Modal.Header closeButton className="justify-content-center">
            <Modal.Title className="text-center w-100">
                {hasData && (ticketData?.ticket?.event?.name || ticketData?.bookings?.[0]?.ticket?.event?.name || '')} - {type}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="">
                {section !== 0 && showAttendeee && (
                    <BookingsAttendee
                        Slider={true}
                        attendeeList={attendees}
                        apiData={categoryData?.customFieldsData}
                        ShowAction={false}
                    />
                )}
                {section !== 1 &&
                    <Card className="shadow-none mb-0">
                        <Card.Body>
                            <Row>
                                {fields?.map((field, index) => (
                                    <Col
                                        key={index}
                                        xs={field?.isPhoto ? 12 : 12}
                                        md={field?.isPhoto ? 12 : 4}
                                        className={`d-flex ${field?.isPhoto ? 'justify-content-center' : 'flex-column'} mb-2 ${field?.isPhoto && 'justify-content-center'}`}
                                    >{field?.isPhoto ? (
                                        <Image
                                            src={field?.value}
                                            alt="Field Image"
                                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="mobile-field-container p-1 border-bottom w-100">
                                            <div className="d-flex gap-5 align-items-center">
                                                <p className="p-0 m-0 text-dark fs-5 d-flex align-items-center">
                                                    {field?.icon}
                                                    <span className="ms-2 d-none d-md-inline">{field?.label}:</span>
                                                </p>
                                                <h4 className={`p-0 m-0 fw-bold text-primary ${field?.label === "Name" ? "fs-1" : "fs-5"}`}>
                                                    {field?.value}
                                                </h4>
                                            </div>
                                        </div>
                                    )}
                                    </Col>
                                ))}
                            </Row>
                            {type === "Accreditation" && (
                                <div className="d-flex flex-column custom-dotted-border p-3">
                                    <h6 className="text-primary text-center text-decoration-underline">Access Area:</h6>
                                    <Col xs={12} className="d-flex flex-wrap justify-content-center gap-2">
                                        {ticketData?.access_area?.map((item, index) => (
                                            <span
                                                key={index}
                                                className="badge rounded-pill text-dark px-3 py-2 fs-6 shadow-sm d-flex align-items-center"
                                                style={{ fontWeight: 500, letterSpacing: 1 }}
                                            >
                                                <CircleCheckBig size={18} className="me-2" color="limegreen" />
                                                {item}
                                            </span>
                                        ))}
                                    </Col>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                }
            </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
            <Button
                onClick={() => handleVerify()}
                size="lg"
                className="rounded-circle p-0 fs-2 d-flex justify-content-center align-items-center"
                style={{ width: "120px", height: "120px", minWidth: "120px" }}>
                Verify
            </Button>
        </Modal.Footer>
    </Modal>
    )
}

export default ScanedUserData
