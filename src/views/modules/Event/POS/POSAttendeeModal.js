import { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";

const POSAttendeeModal = (props) => {
    const { show, handleClose, disabled, setName, name, setNumber, handleSubmit, setMethod, number } = props;
    const {api , authToken} = useMyContext();
    const [error, setError] = useState("");
    const [showNameField, setShowNameField] = useState(false);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    // Fetch user details when phone number is valid
    const fetchUserDetails = useCallback(async () => {
        if ((number?.length === 10 || number?.length === 12) && /^\d+$/.test(number)) {
            setIsLoadingUser(true);
            setError("");
            
            try {
                // Use axios with authorization header
                const response = await axios.get(`${api}pos/ex-user/${number}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.data.status) {
                    const userData = response.data.data;
                    setName(userData.name || "");
                    setShowNameField(true);
                } else {
                    // User not found, show name field for manual entry
                    setName("");
                    setShowNameField(true);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                if (error.response && error.response.status === 404) {
                    // User not found, show name field for manual entry
                    setName("");
                } else {
                    setError("Failed to fetch user details. Please try again.");
                }
                setShowNameField(true);
            } finally {
                setIsLoadingUser(false);
            }
        } else {
            setShowNameField(false);
            setName("");
        }
    }, [number, api, authToken, setName]);
    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const validateAndSubmit = () => {
        if (!name.trim()) {
            setError("Please enter a valid name.");
            return;
        }
        if (!/^\d{10}$/.test(number)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        setError("");
        handleSubmit();
    };

    return (
        <Modal show={show} onHide={() => handleClose()} centered>
            <Modal.Header closeButton={!disabled}>
                <Modal.Title className="text-center w-100">Attendee Detail For This Booking</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="">
                    <Row className="d-flex justify-content-between">
                        <Col sm="12" md="12" className="form-group">
                            <Form.Control
                                type="number"
                                id="Phone_NO"
                                value={number}
                                placeholder="Enter Phone Number"
                                onChange={(e) => {
                                    if (e.target.value.length > 10) {
                                        e.target.value = e.target.value.slice(0, 10);
                                    }
                                    setNumber(e.target.value);
                                    setError(""); // Clear error on input
                                }}
                            />
                        </Col>
                        {showNameField && (
                            <Col sm="12" md="12" className="form-group">
                                <Form.Control
                                    type="text"
                                    id="firstName"
                                    placeholder={isLoadingUser ? "Loading..." : "Enter Name"}
                                    value={name}
                                    disabled={isLoadingUser}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError(""); // Clear error on input
                                    }}
                                />
                            </Col>
                        )}
                        {error && (
                            <Col sm="12" className="text-danger text-center">
                                {error}
                            </Col>
                        )}
                        <Col sm="4" md="4" className="form-group">
                            <div className="form-radio form-check">
                                <Form.Check.Input
                                    type="radio"
                                    id="cashPayment"
                                    name="payment"
                                    className="me-2"
                                    value={'Cash'}
                                    onChange={(e) => setMethod(e.target.value)}
                                    defaultChecked
                                />
                                <Form.Label htmlFor="cashPayment">
                                    Cash
                                </Form.Label>
                            </div>
                        </Col>
                        <Col sm="4" md="4" className="form-group">
                            <div className="form-radio form-check">
                                <Form.Check.Input
                                    type="radio"
                                    id="upiPayment"
                                    name="payment"
                                    className="me-2"
                                    value={'UPI'}
                                    onChange={(e) => setMethod(e.target.value)}
                                />
                                <Form.Label htmlFor="upiPayment">
                                    UPI
                                </Form.Label>
                            </div>
                        </Col>
                        <Col sm="4" md="4" className="form-group">
                            <div className="form-radio form-check">
                                <Form.Check.Input
                                    type="radio"
                                    id="netBankingPayment"
                                    name="payment"
                                    className="me-2"
                                    value={'Net Banking'}
                                    onChange={(e) => setMethod(e.target.value)}
                                />
                                <Form.Label htmlFor="netBankingPayment">
                                    Net Banking
                                </Form.Label>
                            </div>
                        </Col>
                        <Col sm="12" md="12" className="form-group">
                            <div className="d-flex justify-content-center pb-3 gap-3">
                                <Button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={validateAndSubmit}
                                    disabled={!name.trim() || number?.length !== 10 || isLoadingUser} // Disable button if fields are empty or API is loading
                                >
                                    {isLoadingUser ? "Loading..." : "Submit"}
                                </Button>
                                <Button type="button" className="btn btn-success"
                                    onClick={() => handleClose(true)}>
                                    Skip
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default POSAttendeeModal;
