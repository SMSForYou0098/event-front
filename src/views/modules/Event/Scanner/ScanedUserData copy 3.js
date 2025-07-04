import React, { useEffect, useState } from 'react'
import { Button, Badge, Card, Col, Image, Modal, Row, ListGroup } from 'react-bootstrap'
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
                        <Card className="border-0 rounded-0">
                            <Card.Body className="p-0">
                                <ListGroup variant="flush">
                                    {fields?.map((field, index) => (
                                        field?.isPhoto ? (
                                            <div key={index} className="text-center p-3">
                                                <Image
                                                    src={field?.value}
                                                    alt="Field Image"
                                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                                    className="border rounded shadow-sm"
                                                />
                                            </div>
                                        ) : (
                                            <ListGroup.Item 
                                                key={index} 
                                                className={`py-3 ${index % 2 === 0 ? 'bg-light' : ''}`}
                                            >
                                                <Row className="align-items-center">
                                                    <Col xs={4} className="ps-3">
                                                        <Badge bg="primary" pill className="px-3 py-2 fs-6">
                                                            {field?.label}
                                                        </Badge>
                                                    </Col>
                                                    <Col xs={8} className="text-end pe-3">
                                                        <h4 className="m-0 fw-bold">{field?.value}</h4>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )
                                    ))}
                                </ListGroup>
                                
                                {type === "Accreditation" && (
                                    <div className="p-3 border-top">
                                        <h5 className="text-primary text-center mb-3">Access Areas</h5>
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
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
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
