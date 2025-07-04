import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Image, Modal, Row } from 'react-bootstrap'
import { File as FileIcon, FileImage, FileText, Loader2, MailIcon, MessageSquare, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import axios from 'axios';
import { cancelToken } from '../../CustomUtils/Consts';
// Add this function inside your AgentBookingModal component, before the return statement
export const handleDocumentOpen = (doc) => {
    // If it's a string URL (from server), just open it in a new tab
    if (typeof doc === 'string') {
        window.open(doc, '_blank');
    }
    // If it's a File object, handle different file types
    else if (doc && typeof doc === 'object' && doc.name) {
        const url = URL.createObjectURL(doc);

        if (doc.type && doc.type.includes('image')) {
            window.open(url, '_blank');
        }
        else if (doc.type && doc.type.includes('pdf')) {
            window.open(url, '_blank');
        }
        else {
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name || 'document';
            a.click();
            URL.revokeObjectURL(url);
        }
    }
};
const AgentBookingModal = (props) => {
    const { api, authToken, loader } = useMyContext();
    const { showPrintModel, handleClose, confirm, attendee, disabled, loading, setName, name, number, setNumber, setEmail, handleSubmit, setMethod, email, isAccreditation, setPhoto, photo, setTicketModal, setCompanyName, companyName, designation, setDesignation, event, setSelectedAreas, selectedTickets, doc, setDoc } = props;
    const [isExist, setIsExist] = useState(false);
    const [checkingUser, setCheckingUser] = useState(false);
    const [areas, setAreas] = useState([]);
    const [ticket, setTicket] = useState(null);
    const [validated, setValidated] = useState(false);

    const HandleCheckUser = async (number) => {
        setCheckingUser(true);
        try {
            const url = `${api}user-form-number/${number}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                cancelToken: cancelToken
            });

            setIsExist(response.data.status)
            if (response.data.status) {
                setName(response.data?.user?.name);
                setEmail(response.data?.user?.email);
                setPhoto(response.data?.user?.photo || null);
                setDoc(response.data?.user?.doc || null);
                setCompanyName(response.data?.user?.company_name || null);
                setDesignation(response.data?.user?.designation || null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        } finally {
            setCheckingUser(false);
        }
    };
    const getAreas = useCallback(async () => {
        try {
            const url = `${api}accessarea-list/${event?.id}`
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            let data = res.data.data || [];
            if (data.length > 0) {
                data = data.map(area => ({
                    value: area.id,
                    label: area.title
                }));
                setAreas(data || []);
                const preselectedAreaIds = ticket?.access_area || [];
                const preselectedAreas = data.filter(area => preselectedAreaIds.includes(area.value));
                setSelectedAreas(preselectedAreas);
            }
        } catch {
            setAreas([]);
        }
    }, [api, event, authToken]);

    useEffect(() => {
        if (isAccreditation) {
            getAreas();
        }
    }, [isAccreditation, getAreas]);

    useEffect(() => {
        if (number && (number?.length === 10 || number?.length === 12)) {
            HandleCheckUser(number)
        } else {
            setName("");
            setEmail("");
            setIsExist(false);
        }
    }, [number]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }
        setValidated(true);
        handleSubmit();
    };

    useEffect(() => {
        if (event) {
            const ticketData = event?.tickets?.find(t => t?.id === selectedTickets?.id);
            if (ticketData) {
                setTicket(ticketData);
            }
        }
    }, [event, selectedTickets]);

    const resetAllFields = () => {
        setName('');
        setEmail('');
        setNumber('');
        setDoc(null);
        setPhoto(null);
        setCompanyName('');
        setDesignation('');
        setIsExist(false);
        setValidated(false);
        // Reset payment method to Cash (default)
        setMethod('Cash');
    };
    // Modify the modal's onHide to include field reset
    const handleModalClose = () => {
        resetAllFields();
        handleClose();
    };
    const paymentOptions = ["Cash", "UPI", "Net Banking"];
    return (
        <Modal show={showPrintModel} onHide={() => handleModalClose()} centered>
            <Modal.Header closeButton={!disabled}>
                <Modal.Title className="text-center w-100">{confirm ? 'Thank You For Your Booking!' : 'User Detail For This Booking'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="d-flex flex-column align-items-center justify-content-center py-4">
                        <Image src={loader} width={150} />
                    </div>
                ) : confirm ? (
                    <div className="d-flex flex-column justify-content-center py-3">
                        <span className="text-center">
                            {/* <Image src={animate} width={150} /> */}
                            <Image src={loader} width={150} />
                        </span>
                        <h3 className="text-center">Booking Confirmed</h3>
                        <p className="text-center py-3">Ticket sent to {attendee?.name} on Email/WhatsApp/SMS.</p>

                        <div className="text-center">
                            <Row className="justify-content-center g-2">
                                <Col xs={12} md={isAccreditation ? 6 : 12} className="mb-2 mb-md-0">
                                    <Button
                                        className="border rounded-pill w-100"
                                        disabled={disabled}
                                        onClick={() => handleClose()}
                                    >
                                        {(loading || disabled) ? 'Please Wait' : 'Close'}
                                    </Button>
                                </Col>
                                {isAccreditation && (
                                    <Col xs={12} md={6}>
                                        <Button
                                            type="button"
                                            disabled={disabled}
                                            className="btn btn-secondary rounded-pill w-100"
                                            onClick={() => setTicketModal(true)}
                                        >
                                            {(loading || disabled) ? 'Please Wait' : ' Generate Ticket'}
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </div>
                ) : (
                    <div className="">
                        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                            <Row className="d-flex justify-content-between">
                                <Col sm="12" md="12" className="form-group">
                                    <Form.Control
                                        type="number"
                                        id="Phone_NO"
                                        placeholder="Enter Phone Number"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        onInput={(e) => {
                                            if (e.target.value.length > 12) e.target.value = e.target.value.slice(0, 10);
                                        }}
                                        required
                                        isInvalid={validated && (!number || (number.length !== 10 && number.length !== 12))}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid phone number (10 or 12 digits).
                                    </Form.Control.Feedback>
                                    {!number && (
                                        <div className="text-info mt-2 small">
                                            Please enter mobile number to check existing user details
                                        </div>
                                    )}
                                    {checkingUser && (
                                        <div className="text-primary mt-2 small d-flex align-items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            Checking user details...
                                        </div>
                                    )}
                                </Col>
                                {!checkingUser && number && (number.length === 10 || number.length === 12) && (
                                    <>
                                        <Col sm="12" md="12" className="form-group">
                                            <Form.Control
                                                type="text"
                                                id="firstName"
                                                placeholder="Enter Name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                maxLength={50}
                                                disabled={isExist}
                                                required
                                                isInvalid={validated && !name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a name.
                                            </Form.Control.Feedback>
                                        </Col>
                                        <Col sm="12" md="12" className="form-group">
                                            <Form.Control
                                                type="email"
                                                id="Emailid"
                                                placeholder="Enter Email"
                                                disabled={isExist}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                isInvalid={validated && !email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter a valid email.
                                            </Form.Control.Feedback>
                                        </Col>
                                        {isAccreditation && (
                                            <>
                                                {/* <Col sm="12" md="12" className="form-group">
                                                    <Select
                                                        isMulti
                                                        options={areas}
                                                        onChange={(selected) => {
                                                            // Prevent removing preselected areas
                                                            const preselected = selectedAreas?.filter(area => preselectedAreaIds.includes(area.value)) || [];
                                                            const nonPreselected = (selected || []).filter(area => !preselectedAreaIds.includes(area.value));
                                                            setSelectedAreas([...preselected, ...nonPreselected]);
                                                        }}
                                                        isDisabled={parseInt(ticket?.modify_as) === 0}
                                                        value={selectedAreas || []}
                                                        className="js-choice"
                                                        placeholder="Select Access Areas"
                                                        menuPortalTarget={document.body}
                                                        styles={{
                                                            menuPortal: base => ({ ...base, zIndex: 9999 })
                                                        }}

                                                    />
                                                </Col> */}
                                                <Col sm="12" md="12" className="form-group">
                                                    <Form.Control
                                                        type="text"
                                                        id="designation"
                                                        placeholder="Enter Designation"
                                                        value={designation}
                                                        onChange={(e) => setDesignation(e.target.value)}
                                                        maxLength={50}
                                                        required
                                                        isInvalid={validated && !designation}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter a designation.
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col sm="12" md="12" className="form-group">
                                                    <Form.Control
                                                        type="text"
                                                        id="companyName"
                                                        placeholder="Enter Company Name"
                                                        value={companyName}
                                                        onChange={(e) => setCompanyName(e.target.value)}
                                                        maxLength={50}
                                                        required
                                                        isInvalid={validated && !companyName}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter a company name.
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col sm="12" md="12" className="form-group">
                                                    <Form.Label htmlFor="photo" className="mb-1">
                                                        Passport Size Photo <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        id="photo"
                                                        placeholder='Choose Photo'
                                                        onChange={(e) => setPhoto(e.target.files[0])}
                                                        required={!(typeof photo === 'string' && photo)}
                                                        isInvalid={validated && (!(photo && (typeof photo === 'string' || photo instanceof File)))}
                                                        accept="image/*"
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please upload a photo.
                                                    </Form.Control.Feedback>
                                                </Col>
                                                <Col sm="12" md="12" className="form-group">
                                                    <Form.Label htmlFor="photo" className="mb-1">
                                                        Upload ID proof  <span className="text-danger">*</span>
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        id="document"
                                                        required={!(typeof doc === 'string' && doc)}
                                                        onChange={(e) => setDoc(e.target.files[0])}
                                                        accept=".pdf,.doc,.docx,image/jpeg,image/png,image/bmp,image/webp"
                                                    />
                                                </Col>
                                                {photo && (
                                                    <Col sm="12" md="6" className="form-group">
                                                        <Image
                                                            src={
                                                                typeof photo === "string"
                                                                    ? photo
                                                                    : (photo instanceof File ? URL.createObjectURL(photo) : undefined)
                                                            }
                                                            alt="User Photo"
                                                            className="img-thumbnail"
                                                            width={100}
                                                        />
                                                    </Col>)}
                                                    {doc && (
                                                        <Col sm="12" md="6" className="form-group">
                                                            <div
                                                                className="custom-dotted-border 
                                                            doc-preview p-2 
                                                            rounded d-flex 
                                                            flex-column align-items-center 
                                                            overflow-hidden
                                                            position-relative">
                                                                <Button
                                                                    variant="link"
                                                                    className="p-0 text-danger position-absolute top-0 end-0 m-1"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation(); // Prevent triggering the parent click
                                                                        setDoc(null);
                                                                    }}
                                                                >
                                                                    <X size={16} />
                                                                </Button>
                                                                <div
                                                                    className="w-100 d-flex flex-column align-items-center cursor-pointer"
                                                                    style={{ cursor: 'pointer' }}
                                                                    onClick={() => handleDocumentOpen(doc)}
                                                                >
                                                                    <div className="my-2">
                                                                        {/* Improved file type detection */}
                                                                        {typeof doc === 'string' ? (
                                                                            // For string URLs, check file extension
                                                                            doc.toLowerCase().endsWith('.pdf') ? (
                                                                                <FileText size={24} className="text-danger" />
                                                                            ) : doc.toLowerCase().match(/\.(doc|docx)$/) ? (
                                                                                <FileText size={24} className="text-primary" />
                                                                            ) : doc.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/) ? (
                                                                                <FileImage size={24} className="text-success" />
                                                                            ) : (
                                                                                <FileIcon size={24} className="text-secondary" />
                                                                            )
                                                                        ) : doc && typeof doc === 'object' && doc.type ? (
                                                                            // For File objects, check MIME type
                                                                            doc.type.includes('pdf') ? (
                                                                                <FileText size={24} className="text-danger" />
                                                                            ) : doc.type.includes('word') || (doc.name && doc.name.match(/\.(doc|docx)$/)) ? (
                                                                                <FileText size={24} className="text-primary" />
                                                                            ) : doc.type.includes('image') ? (
                                                                                <FileImage size={24} className="text-success" />
                                                                            ) : (
                                                                                <FileIcon size={24} className="text-secondary" />
                                                                            )
                                                                        ) : (
                                                                            <FileIcon size={24} className="text-secondary" />
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="flex-grow-1 text-primary text-truncate"
                                                                        style={{ maxWidth: 160 }}
                                                                        title={
                                                                            typeof doc === 'string'
                                                                                ? doc.split('/').pop()
                                                                                : (doc && typeof doc === 'object' && doc.name ? doc.name : "Document uploaded")
                                                                        }
                                                                    >
                                                                        {
                                                                            (() => {
                                                                                const filename = typeof doc === 'string'
                                                                                    ? doc.split('/').pop()
                                                                                    : (doc && typeof doc === 'object' && doc.name ? doc.name : "Document uploaded");
                                                                                return filename.length > 22
                                                                                    ? filename.slice(0, 10) + '...' + filename.slice(-9)
                                                                                    : filename;
                                                                            })()
                                                                        }
                                                                    </div>
                                                                    <small className="text-muted mt-1">Click to view document</small>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    )}
                                            </>

                                        )}
                                    </>
                                )}

                                <Col sm="12" md="12" className="form-group">
                                    <div className="text-center text-secondary pb-3">
                                        <Form.Label className="form-check-label ms-1" htmlFor="aggrement-hopeui">
                                            <span className="me-2">
                                                Ticket will be sent to {name || 'User'} on
                                            </span>
                                            <span>
                                                <MailIcon size={16} /> / <FaWhatsapp size={16} /> / <MessageSquare size={16} />
                                            </span>
                                        </Form.Label>
                                    </div>
                                </Col>
                                {paymentOptions?.map((method, index) => (
                                    <Col sm="4" md="4" className="form-group" key={method}>
                                        <div className="form-radio form-check">
                                            <Form.Check.Input
                                                type="radio"
                                                id={`customRadio${index}`}
                                                name="payment"
                                                className="me-2"
                                                value={method}
                                                onChange={(e) => setMethod(e.target.value)}
                                                defaultChecked={index === 0}
                                            />
                                            <Form.Label
                                                className="custom-control-label"
                                                htmlFor={`customRadio${index}`}
                                            >
                                                {method}
                                            </Form.Label>
                                        </div>
                                    </Col>
                                ))}
                                <Col sm="12" md="12" className="form-group">
                                    <div className="d-flex justify-content-center pb-3">
                                        <Button
                                            type="submit"
                                            className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                                            disabled={loading || disabled}
                                        >
                                            {loading && <Loader2 size={20} className="animate-spin" />}
                                            {loading ? 'Sending Tickets' : 'Submit'}
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default AgentBookingModal
