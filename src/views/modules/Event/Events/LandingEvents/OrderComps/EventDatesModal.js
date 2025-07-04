import { X } from 'lucide-react'
import * as moment from 'moment'
import React from 'react'
import { Button, Col, Modal, Row } from 'react-bootstrap'
import Flatpickr from 'react-flatpickr';

const EventDatesModal = (props) => {
    const { show, dateRange, setShow, selectedDate, setSelectedDate, handleSave } = props
    const [startDate, endDate] = dateRange ? dateRange.split(",") : [null, null];
    const styles = {
        calendarWrapper: {
            display: 'inline-block',
            margin: '0px 0px',
        },
        flatpickrInput: {
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
        },
        flatpickrCalendar: {
            '.flatpickr-calendar': {
                margin: '0 0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
            },
            '.flatpickr-calendar.inline': {
                margin: '0 0',
                width: '100%',
                maxWidth: '325px',
            },
            '.flatpickr-current-month': {
                padding: '8px 0',
            },
        }
    };

    return (
        <Modal show={show} onHide={() => setShow(false)} centered>
            <Modal.Header className="d-flex align-items-center justify-content-between border-0 pb-2">
                <Modal.Title className="fw-bold fs-5">Pick a Date</Modal.Title>
                <Button onClick={() => setShow(false)} className='bg-transparent border-0 p-0 m-0'>
                    <X size={22} color='black' />
                </Button>
            </Modal.Header>

            <Modal.Body className="p-4">
                <Row className="justify-content-center g-3">
                    <Col xs={12} md={12} className="d-flex justify-content-center">
                        <div style={styles.calendarWrapper}>
                            <style>
                                {`
                                .flatpickr-calendar {
                                  margin: 0 0 !important;
                                }
                                .flatpickr-calendar.inline {
                                  margin: 0 0 !important;
                                  width: 100% !important;
                                  max-width: 325px !important;
                                }
                                .flatpickr-current-month {
                                  padding: 8px 0 !important;
                                }
                            `}
                            </style>
                            <Flatpickr
                                options={{
                                    dateFormat: "Y-m-d",
                                    minDate: moment(startDate).isBefore(moment()) ? new Date() : startDate,
                                    maxDate: endDate,
                                    defaultDate: selectedDate,
                                    inline: true,
                                    onChange: (selectedDates) =>
                                        setSelectedDate(moment(selectedDates[0]).format("YYYY-MM-DD")),
                                }}
                                className="form-control text-center fw-semibold"
                                placeholder="Select a date"
                                style={styles.flatpickrInput}
                            />
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button
                    variant="primary"
                    className="fw-semibold"
                    onClick={handleSave} // Save and go to next step
                >
                    Save and Next
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EventDatesModal
