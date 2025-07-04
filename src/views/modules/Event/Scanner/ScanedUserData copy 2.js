import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Image, Modal, Row } from 'react-bootstrap'
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
    return (        <Modal
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
                                    {fields?.map((field, index) => (                                        <Col
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
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p className="p-0 m-0 text-dark fs-5">{field?.label}:</p>
                                                        <h4 className="p-0 m-0 fw-bold text-primary">{field?.value}</h4>
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
                <Button onClick={() => handleVerify()} size="lg" className="px-5 py-2 fs-5">Verify</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ScanedUserData
