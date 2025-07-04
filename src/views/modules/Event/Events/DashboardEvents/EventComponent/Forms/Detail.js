import React from 'react'
import JoditEditor from 'jodit-react'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import Select from 'react-select'
import { useMyContext } from '../../../../../../../Context/MyContextProvider'
import EventControls from './EventControls'
const Detail = (props) => {
    const { validated, UpdateEvent, userRole, userId, customStyles, setUserId, categoryList, category, setCategory, handleSelectValue, name, setName, states, state, setState, cities, city, setCity, address, setAddress, description, setDescription, customerCareNumber, setCustomerCareNumber, eventFeature, setEventFeature, status, setStatus, houseFull, setHouseFull, smsOtpCheckout, setSmsOtpCheckout, show, mutiScan, setMultiScan, setOfflineAttSug, setOnlineAttSug, onlineAttSug, offlineAttSug, scanDetail, setScanDetail,setTicketSystem,ticketSystem } = props
    const { UserList } = useMyContext()
    return (
        <fieldset className={`${show === "Detail" ? "d-block" : "d-none"}`}>
            <Form validated={validated} onSubmit={UpdateEvent} className="needs-validation" noValidate>
                <div className="form-card text-start">
                    <Row>
                        {
                            userRole === 'Admin' &&
                            <Col md="4">
                                <Form.Group>
                                    <Form.Label>Organizer: * <strong>{`(${userId?.label})`}</strong></Form.Label>
                                    {/* <Select
                                        options={UserList}
                                        value={userId}
                                        styles={customStyles}
                                        onChange={(e) => setUserId(e)}
                                        required
                                    />
                                    <Form.Control.Feedback tooltip>
                                        Looks good!
                                    </Form.Control.Feedback> */}
                                </Form.Group>
                            </Col>
                        }
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>Category: *</Form.Label>
                                <Select
                                    options={categoryList}
                                    styles={customStyles}
                                    value={category}
                                    onChange={(e) => handleSelectValue(e, setCategory)}
                                    required
                                />
                                <Form.Control.Feedback tooltip>
                                    Looks good!
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <Form.Group className="position-relative">
                                <Form.Label htmlFor="validationTooltipUsername">Event Name: *</Form.Label>
                                <InputGroup hasValidation>
                                    <Form.Control
                                        type="text"
                                        id="validationTooltipUsername"
                                        value={name}
                                        aria-describedby="validationTooltipUsernamePrepend"
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback tooltip>
                                        Looks good!
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback tooltip type="invalid">
                                        Please enter event name.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                        {/* <Col md="4">
                            <Form.Group>
                                <Form.Label>Country: *</Form.Label>
                                <Select
                                    options={countries}
                                    styles={customStyles}
                                    value={country}
                                    onChange={(e) => handleSelectCounty(e)}
                                    required
                                />
                                <Form.Control.Feedback tooltip>
                                    Looks good!
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col> */}
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>State: *</Form.Label>
                                <Select
                                    options={states}
                                    styles={customStyles}
                                    value={state}
                                    onChange={(e) => handleSelectValue(e, setState)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <Form.Group>
                                <Form.Label>City: *</Form.Label>
                                <Select
                                    options={cities}
                                    value={city}
                                    styles={customStyles}
                                    onChange={(e) => handleSelectValue(e, setCity)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md="12">
                            <Form.Group>
                                <Form.Label>Address: *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md="12">
                            <Form.Group>
                                <Form.Label>Event Description: *</Form.Label>
                                <JoditEditor
                                    value={description}
                                    onChange={(value) => setDescription(value)}
                                />
                            </Form.Group>
                        </Col>
                        {/* <Col md="6">
                            <Form.Group>
                                <Form.Label>Add Customer Care Number: *</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Customer Care Number"
                                    value={customerCareNumber}
                                    onChange={(e) => setCustomerCareNumber(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col> */}
                        <Row>
                            <EventControls
                                ticketSystem={ticketSystem}
                                setTicketSystem={setTicketSystem}
                                eventFeature={eventFeature}
                                setEventFeature={setEventFeature}
                                status={status}
                                mutiScan={mutiScan}
                                setScanDetail={setScanDetail}
                                scanDetail={scanDetail}
                                setMultiScan={setMultiScan}
                                offlineAttSug={offlineAttSug}
                                setOfflineAttSug={setOfflineAttSug}
                                setOnlineAttSug={setOnlineAttSug}
                                onlineAttSug={onlineAttSug}
                                setStatus={setStatus}
                                houseFull={houseFull}
                                setHouseFull={setHouseFull}
                                smsOtpCheckout={smsOtpCheckout}
                                setSmsOtpCheckout={setSmsOtpCheckout}
                            />
                            {/* <Col md="2">
                                <Form.Group className="form-group">
                                    <Form.Label className="custom-file-input"></Form.Label>
                                    <Form.Check className="form-switch">
                                        <Form.Check.Input
                                            type="checkbox"
                                            className="me-2"
                                            id="HighDemandEvent"
                                            checked={eventFeature}
                                            onChange={(e) => setEventFeature(e.target.checked)}
                                        />
                                        <Form.Check.Label htmlFor="HighDemandEvent">
                                            High Demand Event
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
                                            id="soldOut"
                                            checked={houseFull}
                                            onChange={(e) => setHouseFull(e.target.checked)}
                                        />
                                        <Form.Check.Label htmlFor="soldOut">
                                            House Full / Sold Out
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
                                            id="otp"
                                            checked={smsOtpCheckout}
                                            onChange={(e) => setSmsOtpCheckout(e.target.checked)}
                                        />
                                        <Form.Check.Label htmlFor="otp">
                                            SMS OTP Checkout
                                        </Form.Check.Label>
                                    </Form.Check>
                                </Form.Group>
                            </Col> */}
                        </Row>
                    </Row>
                </div>

                <Button type="submit" className="action-button float-end">
                    Save & Next
                </Button>
            </Form>
        </fieldset>
    )
}

export default Detail