import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useMyContext } from '../../../../../Context/MyContextProvider'

const MobileCheckOut = (props) => {
    const { ticketCurrency, handlePayment, grandTotal, isAttendeeRequired, disable, isAttendeeButton, attendees, quantity, attendeeState,loading } = props
    const { ErrorAlert } = useMyContext()
    const [buttonLabel, setButtonLabel] = useState('');
    useEffect(() => {
        if (isAttendeeRequired) {
            setButtonLabel('Next');
        } else if (attendeeState && quantity && attendees && quantity === attendees) {
            setButtonLabel('Checkout & Next');
        } else {
            setButtonLabel('Checkout');
        }
    }, [isAttendeeRequired, quantity, attendees]);
    return (
        <Container
            fluid
            className={`d-flex flex-column justify-content-end`}
            style={{
                position: 'fixed',
                left: '0',
                zIndex: '99',
                bottom: '0',
                maxWidth: '100%',
                margin: '0',
                padding: '0',
            }}
            // onClick={() => console.log(disable)}
            onClick={() => !loading && disable ? ErrorAlert(attendeeState && attendees !== quantity ? 'Attendees Must Be Same As Ticket Quantity' : 'Something Went Wrong') : handlePayment()}
        >
            {
                isAttendeeButton ? (
                    <Row className="g-0">
                        <Col xs={12} className="p-0">
                            <Button
                                disabled={disable}
                                variant="primary"
                                className="w-100 text-white py-4"
                                style={{ borderRadius: '0' }}
                            >
                                Save Attendee Details
                            </Button>
                        </Col>
                    </Row>
                ) :
                    <Row className="g-0">
                        <Col xs={6} className="p-0">
                            <Button
                                // onClick={() => handlePayment()}
                                // disabled={disable}
                                variant="secondary"
                                className="w-100 text-white py-4"
                                style={{ borderRadius: '0' }}
                            >
                                Amount : <strong className="text-white h5">{ticketCurrency}{grandTotal}</strong>
                            </Button>
                        </Col>
                        <Col xs={6} className="p-0">
                            <Link
                                // disabled={disable}
                                to=""
                                className="btn btn-primary w-100 d-flex align-items-center justify-content-center py-4"
                                style={{ borderRadius: '0', textDecoration: 'none' }}
                            >
                                {buttonLabel}
                            </Link>
                        </Col>
                    </Row>
            }
        </Container>

    )
}

export default MobileCheckOut