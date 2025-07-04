import React, { useState } from 'react'
import { Button, Form, Modal, OverlayTrigger, ProgressBar, Spinner, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMyContext } from '../../../../Context/MyContextProvider';
import Swal from 'sweetalert2';


const ProgressDisplay = ({ type, number, percentage }) => (
    <div className="mb-3">
        <p>Sending {type} ticket to: {number}</p>
        <ProgressBar animated now={percentage} label={`${percentage}%`} />
    </div>
);


const SendTickets = ({ bookings }) => {
    const { handleWhatsappAlert, extractDetails, HandleSendSMS, sendMail } = useMyContext()
    const [sendToAll, setSendToAll] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentNumber, setCurrentNumber] = useState('');

    const [progress, setProgress] = useState({
        Whatsapp: 0,
        SMS: 0,
        Email: 0
    });

    const updateProgress = (type, index, total) => {
        setProgress(prev => ({
            ...prev,
            [type]: ((index + 1) / total * 100).toFixed(2)
        }));
    };
    const resetProgress = () => {
        setProgress({
            Whatsapp: 0,
            SMS: 0,
            Email: 0
        });
    };

    const sendWhatsappTicket = async (booking, index, total) => {
        const { eventName, category, location, DateTime, thumbnail } = extractDetails(booking?.data);
        const values = [booking?.name, eventName, 1, category, location, DateTime];
        setCurrentNumber(booking?.number);
        await handleWhatsappAlert(booking?.number, 'bookingconfirmed2', values, thumbnail);
        updateProgress('Whatsapp', index, total);
    };
    const sendSMSTicket = async (booking, index, total) => {
        const { eventName, organizerSenderId, organizerApiKey, config_status, ticketName } = extractDetails(booking?.data);
        setCurrentNumber(booking?.number);
        await HandleSendSMS(
            booking?.number,
            null,
            organizerApiKey,
            organizerSenderId,
            config_status,
            booking?.name,
            1,
            ticketName,
            eventName
        );
        updateProgress('SMS', index, total);
    };



    const sendEmailTicket = async (booking, index, total) => {
        const { eventName, thumbnail, category, eventDate, eventTime, DateTime, address, location } = extractDetails(booking?.data);
        const data = {
            email: booking?.email,
            number: booking?.number,
            thumbnail,
            category,
            qty: 1,
            name: booking?.name,
            eventName,
            eventDate,
            eventTime,
            DateTime,
            address,
            location,
            price: 0,
            convenience_fee: 0,
            total: 0
        };
        setCurrentNumber(booking?.number);
        await sendMail([data]);
        updateProgress('Email', index, total);
    };
    const showSuccessAlert = () => {
        Swal.fire({
            icon: 'success',
            title: 'Tickets Sent!',
            text: 'All tickets have been sent successfully.',
        });
    };
    const handleSend = async (type) => {
        setShowModal(true);
        setType(type)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const totalBookings = bookings.length;

        try {
            if (type === 'All') {
                setIsProcessing(true);
                for (let i = 0; i < bookings.length; i++) {
                    const booking = bookings[i];
                    await sendWhatsappTicket(booking, i, totalBookings);
                    await sendSMSTicket(booking, i, totalBookings);
                    // await sendEmailTicket(booking, i, totalBookings);
                }
            } else {
                const sendFunction = {
                    Whatsapp: sendWhatsappTicket,
                    SMS: sendSMSTicket,
                    // Email: sendEmailTicket
                }[type];
                setIsProcessing(true);
                await Promise.all(
                    bookings.map((booking, index) => sendFunction(booking, index, totalBookings))
                );
            }

            resetProgress();
            setShowModal(false);
            setIsProcessing(false);
            showSuccessAlert();
        } catch (error) {
            console.error('Error sending tickets:', error);
            setIsProcessing(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send some tickets. Please try again.',
            });
        }
    };

    const getModalContent = (type) => {
        if (!isProcessing) {
            return (
                <LoadingDisplay
                    type={type === 'All' ? 'all channels' : type}
                />
            );
        }
        return (
            <>
                {progress.Whatsapp > 0 && (
                    <ProgressDisplay
                        type="Whatsapp"
                        number={currentNumber}
                        percentage={progress.Whatsapp}
                    />
                )}
                {progress.SMS > 0 && (
                    <ProgressDisplay
                        type="SMS"
                        number={currentNumber}
                        percentage={progress.SMS}
                    />
                )}
                {progress.Email > 0 && (
                    <ProgressDisplay
                        type="Email"
                        number={currentNumber}
                        percentage={progress.Email}
                    />
                )}
            </>
        );
    };


    const LoadingDisplay = ({ type }) => (
        <div className="text-center py-3">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p className="mb-1">Preparing to send tickets via {type}</p>
            <p className="text-muted small">Please wait while we initialize the process...</p>
        </div>
    );

    return (
        <div>
            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Sending Tickets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {getModalContent(type)}
                </Modal.Body>
            </Modal>
            <div style={{ marginBottom: '20px' }}>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={sendToAll ? 'Send All' : 'Send Individually'}
                    checked={sendToAll}
                    onChange={() => setSendToAll(!sendToAll)}
                />
            </div>
            {sendToAll ? (
                <Button variant="primary" onClick={() => handleSend('All')}>
                    Send Tickets
                </Button>
            ) : (
                <div className="d-flex gap-3 align-items-center">
                    <OverlayTrigger
                        placement={'top'}
                        overlay={<Tooltip>Whatsapp</Tooltip>}
                    >
                        <Link style={{ fontSize: '1.5rem' }} onClick={() => handleSend('Whatsapp')}>
                            <i className="fa-brands fa-whatsapp text-gray"></i>
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement={'top'}
                        overlay={<Tooltip>SMS</Tooltip>}
                    >
                        <Link style={{ fontSize: '1.3rem' }} onClick={() => handleSend('SMS')}>
                            <i className="fa-regular fa-message text-gray"></i>
                        </Link>
                    </OverlayTrigger>
                    {/* <OverlayTrigger
                        placement={'top'}
                        overlay={<Tooltip>Email</Tooltip>}
                    >
                        <Link style={{ fontSize: '1.4rem' }} onClick={() => handleSend('Email')}>
                            <i className="fa-regular fa-envelope  text-gray"></i>
                        </Link>
                    </OverlayTrigger> */}
                </div>
            )}
        </div>
    );
};

export default SendTickets
