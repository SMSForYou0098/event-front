import React, { memo, Fragment, useState, useEffect } from "react";
import { Row, Col, Card, Form, Modal, Button, Image } from "react-bootstrap";
import useSound from 'use-sound';
import CountUp from "react-countup";
import Swal from "sweetalert2";
import axios from "axios";
import beepSound from '../../../../assets/event/stock/tik.mp3';
import errorSound from '../../../../assets/event/stock/error.mp3';
import { useMyContext } from "../../../../Context/MyContextProvider";
const Scanner = memo(() => {
    const { api, UserData, authToken, formatDateTime } = useMyContext();
    const [QRdata, setQRData] = useState('');
    const [show, setShow] = useState(false);
    const [ticketData, setTicketData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [autoCheck, setAutoCheck] = useState(false);
    const [play] = useSound(beepSound);
    const [error] = useSound(errorSound);

    const getEventData = async () => {
        await axios.get(`${api}event-ticket-info/${UserData?.id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                setEventData(res.data.data)
            }
        }).catch((err) => { })
    }

    useEffect(() => {
        getEventData()
    }, []);

    const getTicketDetail = async (data) => {
        await axios.post(`${api}verify-ticket/${data}`, {
            user_id: UserData?.reporting_user
        }, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        })
            .then((res) => {
                if (res.data.status) {
                    play()
                    setTicketData(res.data.bookings)
                    setShow(true)
                }
            }).catch((err) => {
                setQRData('')
                const formattedTime = formatDateTime(err.response.data?.time);
                const message = `${err.response.data?.time && `Check In: <strong>${formattedTime}</strong>`}`;
                Swal.fire({
                    icon: 'error',
                    title: err.response.data.message,
                    html: `${message}`,
                    timer: 1000,
                });
                error()
            }
            )
    }

    useEffect(() => {
        if (QRdata?.length === 9) {
            getTicketDetail(QRdata)
        }
    }, [QRdata])

    useEffect(() => {
        if ((Object.entries(ticketData)?.length || ticketData?.bookings?.length) > 0) {
            setHasData(true)
        }
    }, [ticketData])

    const [isProcessing, setIsProcessing] = useState(false);
    const handleVerify = async () => {
        if (QRdata && !isProcessing) {
            await axios.get(`${api}chek-in/${QRdata}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            })
                .then((res) => {
                    //  
                    if (res.data.status) {
                        Sweetalert();
                        setQRData('')
                        setShow(false)
                        getEventData()
                    }
                }).catch((err) =>
                    SweetalertError(err.response.data.message)
                )
        }
    };

    function Sweetalert() {
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Ticket Scanned Successfully.",
            timer: 1000,
            willClose: () => { // Triggered when the alert closes
                setIsProcessing(false); // Allow further requests after SweetAlert closes
            }
        });
    }
    function SweetalertError(data, subData) {
        Swal.fire({
            icon: "error",
            title: data,
            text: subData,
            willClose: () => { 
                setIsProcessing(false);
            }
        });
    }

    useEffect(() => {
        if (show && autoCheck) {
            const timer = setTimeout(() => {
                handleVerify();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [show]);

    const HandleClose = () => {
        setQRData('');
        setShow(false)
    }

    const fields = [
        ...(hasData &&
            (ticketData?.attendee?.Photo || ticketData?.bookings?.[0]?.attendee?.Photo)
            ? [
                {
                    // label: "Photo",
                    isPhoto: true,
                    value:
                        ticketData?.attendee?.Photo ||
                        ticketData?.bookings?.[0]?.attendee?.Photo,
                },
            ]
            : []
        ),
        {
            label: "Number",
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
                ? ticketData?.ticket?.event?.date_range?.split(",")[1] || // Second date if exists
                ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")[1] || // Second date in bookings
                (ticketData?.ticket?.event?.date_range?.split(",")?.length === 1 // Use first date if only one exists
                    ? ticketData?.ticket?.event?.date_range
                    : "") ||
                (ticketData?.bookings?.[0]?.ticket?.event?.date_range?.split(",")?.length === 1
                    ? ticketData?.bookings?.[0]?.ticket?.event?.date_range
                    : "") ||
                ""
                : "",
        },

    ];
    return (
        <Fragment>
            <Modal
                show={show}
                onHide={() => HandleClose()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="" className="d-flex justify-content-center">
                        <h5>
                            {hasData && (ticketData?.ticket?.event?.name || ticketData?.bookings[0]?.ticket?.event?.name || '')}
                        </h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="border rounded">
                        <Card className="shadow-none mb-0">
                            <Card.Body className="py-2">
                                <Row>
                                    {fields.map((field, index) => (
                                        <Col
                                            key={index}
                                            xs={field?.isPhoto ? 12 : 6}
                                            md={field?.isPhoto ? 12 : 4}
                                            className={`d-flex align-items-center gap-3 mb-3 ${field?.isPhoto && 'justify-content-center'}`}
                                        >
                                            {field?.isPhoto ? (
                                                <Image
                                                    src={field?.value}
                                                    alt="Field Image"
                                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <>
                                                    <p className="p-0 m-0">{field?.label}:</p>
                                                    <h6 className="p-0 m-0">{field?.value}</h6>
                                                </>
                                            )}
                                        </Col>
                                    ))}
                                </Row>

                            </Card.Body>
                        </Card>
                    </div>
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-center">
                    <Button onClick={handleVerify}>Verify</Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Row>
                    {eventData?.map((item, index) => (
                        <Col key={index} xl={6} md={6}>
                            <Card>
                                <Card.Header>{item?.event?.name}</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col>
                                            <Card className="card-block card-stretch card-height">
                                                <Card.Body>
                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <span className="text-dark ">Checked</span>
                                                    </div>
                                                    <h2 className="counter p-0">
                                                        <CountUp
                                                            start={0}
                                                            end={item?.checked_bookings}
                                                            duration={1}
                                                            useEasing={true}
                                                            separator=","
                                                        />
                                                    </h2>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="card-block card-stretch card-height">
                                                <Card.Body>
                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <span className="text-dark ">Remaining</span>
                                                    </div>
                                                    <h2 className="counter p-0">
                                                        <CountUp
                                                            start={0}
                                                            end={item?.remaining_bookings}
                                                            duration={1}
                                                            useEasing={true}
                                                            separator=","
                                                        />
                                                    </h2>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col>
                                            <Card className="card-block card-stretch card-height">
                                                <Card.Body>
                                                    <div className="mb-2 d-flex justify-content-between align-items-center">
                                                        <span className="text-dark ">Total</span>
                                                    </div>
                                                    <h2 className="counter p-0">
                                                        <CountUp
                                                            start={0}
                                                            end={item?.total_bookings}
                                                            duration={1}
                                                            useEasing={true}
                                                            separator=","
                                                        />
                                                    </h2>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Row>
            <Row>
                <Col sm="12" lg="6">
                    <Card>
                        <div className="scanner">
                            <div className="scanne-by-device">
                                <Card.Body>
                                    <div className='d-flex justify-content-between'>
                                        <p>Scan the qr code by scanner</p>
                                        <div className='d-flex gap-2'>
                                            <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                                                Auto Check
                                            </Form.Check.Label>
                                            <Form.Check className="form-switch">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="me-2"
                                                    id="flexSwitchCheckDefault"
                                                    onChange={(e) => setAutoCheck(e.target.checked)}
                                                />
                                            </Form.Check>
                                        </div>
                                    </div>
                                    <Row>
                                        <Col md="6" lg="12" className='mb-3'>
                                            <Form.Control
                                                type="text"
                                                value={QRdata}
                                                onChange={(e) => setQRData(e.target.value)}
                                                placeholder="QR Data"
                                                maxLength={9}
                                                autoFocus
                                            />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
});
Scanner.displayName = "Scanner";
export default Scanner;
