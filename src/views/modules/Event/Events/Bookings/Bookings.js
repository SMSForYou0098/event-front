import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Tab, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import axios from "axios";
import BookingList from "./BookingList";
const Bookings = () => {
    const { api, UserData, authToken, ErrorAlert } = useMyContext();
    const [bookings, setBookings] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const getBookings = useCallback(async () => {
        if (!UserData?.id) return;
        setIsLoading(true);
        try {
            const response = await axios.get(`${api}user-bookings/${UserData.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                const data = response.data.bookings;
                const filteredBookings = data.filter(booking =>
                    booking.bookings && Array.isArray(booking.bookings) && booking.bookings.length > 0
                );
                const normalBooking = data.filter(booking => !booking.bookings);
                const allBookings = [...filteredBookings, ...normalBooking].sort((a, b) =>
                    new Date(b.created_at) - new Date(a.created_at)
                );
                
                setBookings(allBookings);
            }
        } catch (err) {
            ErrorAlert(err.message || 'Failed to fetch bookings');
        } finally {
            setIsLoading(false);
        }
    }, [api, UserData?.id, authToken]);

    useEffect(() => {
        getBookings();
    }, [getBookings]);


    return (
        <>
            <Row>
                <Col lg="8">
                    <Card>
                        <Card.Header>
                            <h4 className="card-title">Booking History</h4>
                        </Card.Header>
                        <Card.Body>
                            <Tab.Container defaultActiveKey="first">

                                <Tab.Content>
                                    <Tab.Pane
                                        eventKey="first"
                                        id="order"
                                        role="tabpanel"
                                        aria-labelledby="order-tab"
                                    >
                                        <BookingList bookings={bookings} loading={isLoading} setLoading={setIsLoading} />
                                        <div className="col-12 text-center">
                                            <Link to="#" className="btn btn-primary">
                                                Load More
                                            </Link>
                                        </div>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        </>
    )
}

export default Bookings
