import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const POSAttendeeModal = (props) => {
    const { show, handleClose, disabled, setName, name, setNumber, handleSubmit, setMethod, number } = props;
    const [error, setError] = useState("");

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
                                type="text"
                                id="firstName"
                                placeholder="Enter Name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError(""); // Clear error on input
                                }}
                            />
                        </Col>
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
                                    disabled={!name.trim() || number?.length !== 10} // Disable button if fields are empty
                                >
                                    Submit
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
