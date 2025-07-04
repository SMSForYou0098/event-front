import React, { useEffect, useState } from 'react'
import { Button, Badge, Card, Col, Image, Modal, Row } from 'react-bootstrap'
import BookingsAttendee from '../Events/LandingEvents/OrderComps/BookingsAttendee';
import { CircleCheckBig } from 'lucide-react';

const ScanedUserData = (props) => {
    const { show, ticketData, type, setShow, showAttendeee, attendees, categoryData, handleVerify, event } = props

    const [hasData, setHasData] = useState(false);
    const [section, setSection] = useState(parseInt(event?.scan_detail));
    useEffect(() => {
        if (event) {
            setSection(parseInt(event?.scan_detail))
        }
    }, [event])
    const fields = [
        // ...(hasData &&
        //     (ticketData?.attendee?.Photo || ticketData?.bookings?.[0]?.attendee?.Photo)
        //     ? [
        //         {
        //             // label: "Photo",
        //             isPhoto: true,
        //             value:
        //                 ticketData?.attendee?.Photo ||
        //                 ticketData?.bookings?.[0]?.attendee?.Photo,
        //         },
        //     ]
        //     : []
        // ),
        {
            label: "Mo",
            value: hasData
                ? ticketData?.number || ticketData?.bookings?.[0]?.number || ""
                : "",
        },
        {
            label: "Name",
            value: hasData
                ? ticketData?.name || ticketData?.bookings?.[0]?.name || ""
                : "",
        },
        {
            label: "Ticket",
            value: hasData
                ? ticketData?.ticket?.name || ticketData?.bookings?.[0]?.ticket?.name || ""
                : "",
        },
        {
            label: "QTY",
            value: hasData
                ? ticketData?.quantity || ticketData?.bookings?.length || 1
                : "",
        },
        {
            label: "From",
            value: hasData
                ? ticketData?.ticket?.event?.date_range?.split(",")[0] ||
                ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")[0] ||
                ""
                : "",
        },
        {
            label: "To",
            value: hasData
                ? ticketData?.ticket?.event?.date_range?.split(",")[1] ||
                ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")[1] ||
                (ticketData?.ticket?.event?.date_range?.split(",")?.length === 1
                    ? ticketData?.ticket?.event?.date_range
                    : "") ||
                (ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")?.length === 1
                    ? ticketData?.bookings?.[0]?.ticket?.event?.date_range
                    : "") ||
                ""
                : "",
        },
    ];


    useEffect(() => {
        setHasData((Object.entries(ticketData)?.length || ticketData?.bookings?.length) > 0);
    }, [ticketData]);
    return (
        <Modal
            show={show}
            onHide={() => setShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            className="ticket-scan-modal"
        // centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {hasData && (ticketData?.ticket?.event?.name || ticketData?.bookings?.[0]?.ticket?.event?.name || '')} - {type}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <div>
                    {section !== 0 && showAttendeee && (
                        <BookingsAttendee
                            Slider={true}
                            attendeeList={attendees}
                            apiData={categoryData?.customFieldsData}
                            ShowAction={false}
                        />
                    )}
                    {section !== 1 &&
                        <div className="profile-card-container">
                            <Row className="g-0">
                                <Col xs={5} className="">
                                    <div className="profile-header text-center p-4" style={{ borderRight: '2px dotted #dee2e6' }}>
                                        <h3 className="mb-1 fw-bold">
                                            {hasData ? ticketData?.name || ticketData?.bookings?.[0]?.name || "" : ""}
                                        </h3>
                                        <p className="mb-0 fs-5">
                                            {hasData ? ticketData?.number || ticketData?.bookings?.[0]?.number || "" : ""}
                                        </p>
                                        <div className="ticket-badge mb-2">
                                            <span className="badge bg-light text-primary fs-6 px-3 py-2">
                                                {hasData ? ticketData?.ticket?.name || ticketData?.bookings?.[0]?.ticket?.name || "" : ""}
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={7} className="">
                                    <div className="ticket-details p-3">
                                        <Row className="g-3">
                                            <Col xs={6}>
                                                <h6 className="text-dark mb-1">QTY</h6>
                                                <h4 className="mb-0 fs-6 fw-bold text-primary">
                                                    {hasData ? ticketData?.quantity || ticketData?.bookings?.length || 1 : ""}
                                                </h4>
                                            </Col>

                                            <Col xs={6}>
                                                <h6 className="text-dark mb-1">Type</h6>
                                                <h4 className="mb-0 fs-6 fw-bold text-primary">{type}</h4>
                                            </Col>

                                            {((hasData && ticketData?.ticket?.event?.date_range) ||
                                                (hasData && ticketData?.bookings?.[0]?.ticket?.event?.date_range)) && (
                                                    <>
                                                        <Col xs={6}>
                                                            <h6 className="text-dark mb-1">From</h6>
                                                            <h5 className="mb-0 fs-6 fw-bold text-primary">
                                                                {hasData ? ticketData?.ticket?.event?.date_range?.split(",")[0] ||
                                                                    ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")[0] || "" : ""}
                                                            </h5>
                                                        </Col>

                                                        <Col xs={6}>
                                                            <h6 className="text-dark mb-1">To</h6>
                                                            <h5 className="mb-0 fs-6 fw-bold text-primary">
                                                                {hasData ? ticketData?.ticket?.event?.date_range?.split(",")[1] ||
                                                                    ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")[1] ||
                                                                    (ticketData?.ticket?.event?.date_range?.split(",")?.length === 1
                                                                        ? ticketData?.ticket?.event?.date_range
                                                                        : "") ||
                                                                    (ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")?.length === 1
                                                                        ? ticketData?.bookings?.[0]?.ticket?.event?.date_range
                                                                        : "") || "" : ""}
                                                            </h5>
                                                        </Col>
                                                    </>
                                                )}

                                            {type === "Accreditation" && (
                                                <Col xs={12} className="mt-3">
                                                    <Card>
                                                        <Card.Header className="text-center bg-primary text-white py-2">
                                                            <h5 className="mb-0">Access Areas</h5>
                                                        </Card.Header>
                                                        <Card.Body className="p-3">
                                                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                                                {ticketData?.access_area?.map((item, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        bg="success"
                                                                        className="p-2 mb-2 fs-6 d-flex align-items-center"
                                                                    >
                                                                        <CircleCheckBig size={18} className="me-1" />
                                                                        {item}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )}
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                    }
                </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center bg-light">
                <Button
                    onClick={() => handleVerify()}
                    variant="primary"
                    size="lg"
                    className="px-5 py-2 fs-5 rounded-pill"
                >
                    Verify Ticket
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ScanedUserData
