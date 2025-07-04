import React, { memo, Fragment, useState, useEffect, useRef } from "react";

//React-bootstrap
import { Row, Col, Card, Form, Modal, Button } from "react-bootstrap";
import QrScanner from 'qr-scanner';
//Component
import useSound from 'use-sound';
import beepSound from '../../../../assets/event/stock/tik.mp3';
import errorSound from '../../../../assets/event/stock/error.mp3';
//Img
import Swal from "sweetalert2";
import axios from "axios";

import CountUp from "react-countup";
import { useMyContext } from "../../../../Context/MyContextProvider";
const Camera = memo(() => {
    const { api, formatDateTime,authToken,UserData } = useMyContext();
    const [QRdata, setQRData] = useState('');
    const [show, setShow] = useState(false);
    const [ticketData, setTicketData] = useState([]);
    const [eventData, setEventData] = useState([]);
    const [hasData, setHasData] = useState(false);
    const [play] = useSound(beepSound);
    const [error] = useSound(errorSound);
    const [autoCheck, setAutoCheck] = useState(false);

    const getEventData = async (data) => {
        await axios.get(`${api}event-ticket-info/${6}`, {
            headers: {
              'Authorization': 'Bearer ' + authToken,
            }
          })
            .then((res) => {
                //  
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
    }, [QRdata]);
    
    useEffect(() => {
        if ((Object.entries(ticketData)?.length || ticketData?.bookings?.length) > 0) {
            setHasData(true)
        }
    }, [ticketData]);

    const [isProcessing, setIsProcessing] = useState(false);
    const handleVerify = async () => {
        if (QRdata && !isProcessing) {
            setIsProcessing(true); // Set processing to true to avoid multiple calls
    
            try {
                const res = await axios.get(`${api}chek-in/${QRdata}`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });
    
                if (res.data.status) {
                    Sweetalert();
                    setQRData('');
                    setShow(false);
                    getEventData();
                }
            } catch (err) {
                SweetalertError(err.response.data.message);
            } finally {
                setIsProcessing(false); // Reset processing state after the call is done
            }
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
    
    function SweetalertError(data) {
        Swal.fire({
            icon: "error",
            title: data,
            timer: 1000,
            willClose: () => { // Triggered when the alert closes
                setIsProcessing(false); // Allow further requests after SweetAlert closes
            }
        });
    }
    const handleQrCodeSuccess = (decodedText) => {
        setQRData(decodedText)
    };
    
    const videoElementRef = useRef(null);
    useEffect(() => {
        const video = videoElementRef.current;
        const qrScanner = new QrScanner(
            video,
            (result) => {
                // console.log('decoded qr code:', result);
                handleQrCodeSuccess(result?.data);
            },
            {
                returnDetailedScanResult: true,
                highlightScanRegion: true,
                highlightCodeOutline: true,
            }
        );
        qrScanner.start();

        return () => {
            qrScanner.stop();
            qrScanner.destroy();
        };
    }, []);


    useEffect(() => {
        if (show && autoCheck) {
            const timer = setTimeout(() => {
                handleVerify();
            }, 2000);

            // Cleanup function to clear the timeout if the effect is re-run or unmounted
            return () => clearTimeout(timer);
        }
    }, [show]);
    const styles = {
        videoWrapper: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '5px',
        },
        qrVideo: {
            objectFit: 'cover',
            //border: '1px solid #ddd',
            width: '310px',
            height: '500px',
            borderRadius: '10px',
        },
        scannedText: {
            wordWrap: 'break-word',
        },
    };
    return (
        <Fragment>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {hasData && (ticketData?.ticket?.event?.name || ticketData?.bookings[0]?.ticket?.event?.name || '')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="border rounded">
                        <Card className="shadow-none mb-0">
                            <Card.Body>
                                <Row>
                                    <Col lg="3">
                                        <h6>Number: </h6>
                                        <h6 className="mt-2">{hasData && ((ticketData?.number === null ? 'null' : ticketData?.number) || ticketData?.bookings[0]?.number || '')}</h6>
                                    </Col>
                                    <Col lg="3">
                                        <h6>Ticket Type:</h6>
                                        <p className="mt-2 mb-0">{hasData && (ticketData?.ticket?.name || ticketData?.bookings[0]?.ticket?.name || '')}</p>
                                    </Col>
                                    <Col lg="3">
                                        <h6>Quantity:</h6>
                                        <p className="mt-2 mb-0">{hasData && (ticketData?.bookings?.length || ticketData?.quantity || 1)}</p>
                                    </Col>
                                    <Col lg="3">
                                        <h6>Event Date:</h6>
                                        <p className="mt-2 mb-0">
                                            {hasData && (ticketData?.ticket?.event?.date_range || ticketData?.bookings[0]?.ticket?.event?.date_range || '')}
                                        </p>
                                    </Col>
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
                <Col lg="12">
                    <div className="">
                        <Row>
                            <Col>
                                <Card className="card-block card-stretch card-height">
                                    <Card.Body>
                                        <div className="mb-2 d-flex justify-content-between align-items-center">
                                            <span className="text-dark ">Checked</span>
                                        </div>
                                        <h2 className="counter m-0 p-0">
                                            <CountUp
                                                start={0}
                                                end={eventData?.checked_bookings}
                                                duration={1}
                                                useEasing={true}
                                                separator=","
                                            />
                                        </h2>
                                        {/* <small>Available to pay out.</small> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <Card className="card-block card-stretch card-height">
                                    <Card.Body>
                                        <div className="mb-2 d-flex justify-content-between align-items-center">
                                            <span className="text-dark ">Remaining</span>
                                        </div>
                                        <h2 className="counter m-0 p-0">
                                            <CountUp
                                                start={0}
                                                end={eventData?.remaining_bookings}
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
                                        <h2 className="counter m-0 p-0">
                                            <CountUp
                                                start={0}
                                                end={eventData?.total_bookings}
                                                duration={1}
                                                useEasing={true}
                                                separator=","
                                            />
                                        </h2>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col sm="12" lg="3">
                    <Card>
                        <Card.Body className="d-flex justify-content-center flex-column">
                            <div className='d-flex justify-content-end'>
                                <div className='d-flex gap-2'>
                                    <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                                        Auto Check
                                    </Form.Check.Label>
                                    <Form.Check className="form-switch">
                                        <Form.Check.Input
                                            type="checkbox"
                                            className="me-2"
                                            id="flexSwitchCheckDefault"
                                            // checked={eventFeature}
                                            onChange={(e) => setAutoCheck(e.target.checked)}
                                        />
                                    </Form.Check>
                                </div>
                            </div>
                            <video style={styles.qrVideo} ref={videoElementRef} />
                        </Card.Body>
                    </Card>
                </Col>


            </Row>
        </Fragment>
    );
});
Camera.displayName = "Camera";
export default Camera;
