import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import TicketByEvent from '../../TicketByEvent';


const TicketFieldset = ({
    validated,
    UpdateEvent,
    MainId,
    name,
    ticketTerms,
    setTicketTerms,
    ticketBG,
    setTicketBG,
    show,
    AccountShow
}) => {
    return (
        <fieldset className={`${show === "Ticket" ? "d-block" : "d-none"}`}>
            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
            <div className="mt-3">
                    <Button type="submit" className="action-button float-end ms-2">
                        Next
                    </Button>
                    <Button type="button" className="btn-danger action-button float-end" onClick={() => AccountShow("Timing")}>
                        Back
                    </Button>
                </div>
                <div className="form-card text-start">
                    <Row>
                        <Col md={5} className="mb-3">
                            <TicketByEvent eventId={MainId} eventName={name} />
                        </Col>
                        <Col md={5} className="mb-3">
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3 form-group">
                                        <h6>Ticket Terms</h6>
                                        <textarea
                                            className="form-control"
                                            name="eventName"
                                            placeholder="Ticket Terms"
                                            value={ticketTerms}
                                            rows={5}
                                            onChange={(e) => setTicketTerms(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                {/* <Col md={12}>
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Ticket Background</Form.Label>
                                        <Form.Control type="text" placeholder="url " value={ticketBG} onChange={(e) => setTicketBG(e.target.value)} />
                                    </Form.Group>
                                </Col> */}
                            </Row>
                        </Col>
                    </Row>
                </div>
               
            </Form>
        </fieldset>
    );
};

export default TicketFieldset;
