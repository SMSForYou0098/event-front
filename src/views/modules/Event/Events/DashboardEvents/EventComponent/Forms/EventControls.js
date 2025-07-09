import React from 'react'
import { Col, Form } from 'react-bootstrap'
import Select from 'react-select'
import { scanOption } from '../../EditEvent'
import { customStyles } from '../../../../CustomComponents/select2'
const EventControls = (props) => {
    const { eventFeature, setEventFeature, status, setStatus, houseFull, setHouseFull, smsOtpCheckout, setSmsOtpCheckout, mutiScan, setMultiScan, setOfflineAttSug, setOnlineAttSug, onlineAttSug, offlineAttSug, scanDetail, setScanDetail,ticketSystem,setTicketSystem } = props

    return (
        <>
            <Col md="2">
                <Form.Group className="form-group">
                    <Form.Label className="custom-file-input">Event Controls</Form.Label>
                    <Form.Check className="form-switch">
                        <Form.Check.Input
                            type="checkbox"
                            className="me-2"
                            id="flexSwitchCheckDefault"
                            checked={eventFeature}
                            onChange={(e) => setEventFeature(e.target.checked)}
                        />
                        <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                            Event Features
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Col>

            <Col md="2">
                <Form.Group className="form-group">
                    <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                    <Form.Check className="form-switch">
                        <Form.Check.Input
                            type="checkbox"
                            className="me-2"
                            id="status"
                            checked={status}
                            onChange={(e) => setStatus(e.target.checked)}
                        />
                        <Form.Check.Label htmlFor="status">
                            Event Status
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Col>
            <Col md="2">
                <Form.Group className="form-group">
                    <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                    <Form.Check className="form-switch">
                        <Form.Check.Input
                            type="checkbox"
                            className="me-2"
                            id="flexSwitchCheckDefault"
                            checked={houseFull}
                            onChange={(e) => setHouseFull(e.target.checked)}
                        />
                        <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                            House Full
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Col>
            {/* <Col md="2">
                <Form.Group className="form-group">
                    <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                    <Form.Check className="form-switch">
                        <Form.Check.Input
                            type="checkbox"
                            className="me-2"
                            id="flexSwitchCheckDefault"
                            checked={smsOtpCheckout}
                            onChange={(e) => setSmsOtpCheckout(e.target.checked)}
                        />
                        <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                            SMS OTP Checkout
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Col> */}
            {/* <Col md="4">
                <Form.Group>
                    <Form.Label>UserData While Scan: *</Form.Label>
                    <Select
                        options={scanOption}
                        styles={customStyles}
                        value={scanDetail}
                        onChange={(data) => setScanDetail(data)}
                        // required
                    />
                    <Form.Control.Feedback tooltip>
                        Looks good!
                    </Form.Control.Feedback>
                </Form.Group>
            </Col> */}
            <Col md="3">
                <Form.Group className="form-group">
                    <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                    <Form.Check className="form-switch">
                        <Form.Check.Input
                            type="checkbox"
                            className="me-2"
                            id="onlineAttendee"
                            checked={onlineAttSug}
                            onChange={(e) => setOnlineAttSug(e.target.checked)}
                        />
                        <Form.Check.Label htmlFor="onlineAttendee">
                            Hide Online Attendee Suggetion
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Col>
            <Col md="3">
                <Form.Group className="form-group">
                    <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                    <Form.Check className="form-switch">
                        <Form.Check.Input
                            type="checkbox"
                            className="me-2"
                            id="offlineAttendee"
                            checked={offlineAttSug}
                            onChange={(e) => setOfflineAttSug(e.target.checked)}
                        />
                        <Form.Check.Label htmlFor="offlineAttendee">
                            Hide Agent Attendee Suggetion
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Col>
            <Col md="2">
                <Form.Group className="form-group">
                    <Form.Label className="custom-file-input"></Form.Label>
                    <Form.Check className="form-switch">
                        <Form.Check.Input
                            type="checkbox"
                            className="me-2"
                            id="multiscan"
                            checked={mutiScan}
                            onChange={(e) => setMultiScan(e.target.checked)}
                        />
                        <Form.Check.Label htmlFor="multiscan">
                            Multi Scan Ticket
                        </Form.Check.Label>
                    </Form.Check>
                </Form.Group>
            </Col>
            <Col md="3" className='d-flex align-items-center'>
                <Form.Group className="form-group d-flex align-items-center m-0">
                <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                    <Form.Check.Label className="me-2" htmlFor="ticket_type">
                        Booking By Ticket
                    </Form.Check.Label>
                    <Form.Check
                        type="switch"
                        id="ticket_type"
                        checked={ticketSystem}
                        onChange={(e) => setTicketSystem(e.target.checked)}
                    />
                    <Form.Check.Label className="ms-2" htmlFor="ticket_type">
                        Booking By Seat
                    </Form.Check.Label>
                </Form.Group>
            </Col>

        </>
    )
}

export default EventControls
