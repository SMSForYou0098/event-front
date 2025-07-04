import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';

const TimingFieldset = ({
    validated,
    UpdateEvent,
    dateRange,
    setDateRange,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    eventType,
    setEventType,
    show,
    handleDateChange,
    entryTime,
    setEntryTime,
}) => {
    return (
        <fieldset className={`${show === "Timing" ? "d-block" : "d-none"}`}>
            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                <div className="form-card text-start">
                    <Row>
                        <Col md={4}>
                            <div className="form-group">
                                <label className="form-label">Event Date Range: *</label>
                                <Flatpickr
                                    options={{ minDate: 'today', mode: 'range' }}
                                    className="form-control flatpickrdate"
                                    placeholder="Select Date..."
                                    value={dateRange}
                                    onChange={(date) => setDateRange(handleDateChange(date))}
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="form-group">
                                <label className="form-label">Event Entry Time: *</label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'H:i',
                                    }}
                                    className="form-control flatpickrtime"
                                    placeholder="Select Time "
                                    value={entryTime}
                                    onChange={(time) => setEntryTime(time[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))}
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="form-group">
                                <label className="form-label">Event Start Time: *</label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'H:i',
                                    }}
                                    className="form-control flatpickrtime"
                                    placeholder="Select Time "
                                    value={startTime}
                                    onChange={(time) => setStartTime(time[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))}
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="form-group">
                                <label className="form-label">Event End Time: *</label>
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'H:i',
                                    }}
                                    className="form-control flatpickrtime"
                                    placeholder="Select Time "
                                    value={endTime}
                                    onChange={(time) => setEndTime(time[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))}
                                />
                            </div>
                        </Col>
                        {dateRange && dateRange.length > 1 && (
                            <Col md={4}>
                                <Form.Group className="form-group">
                                    <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                                    <div className="d-flex gap-4">
                                        <Form.Check className="ps-2">
                                            <Form.Check.Label>Daily</Form.Check.Label>
                                        </Form.Check>
                                        <Form.Check className="form-switch">
                                            <Form.Check.Input
                                                type="checkbox"
                                                className="me-2"
                                                checked={eventType}
                                                onChange={(e) => setEventType(e.target.checked)}
                                            />
                                            <Form.Check.Label htmlFor="Season">Season</Form.Check.Label>
                                        </Form.Check>
                                    </div>
                                </Form.Group>
                            </Col>
                        )}
                    </Row>
                </div>
                <Button type="submit" className="action-button float-end">
                    Next
                </Button>
            </Form>
        </fieldset>
    );
};

export default TimingFieldset;
