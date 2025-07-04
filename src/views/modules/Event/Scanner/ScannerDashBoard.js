import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useMyContext } from '../../../../Context/MyContextProvider';
import { Card, Col, Row } from 'react-bootstrap';
import CountUp from 'react-countup';

const ScannerDashBoard = () => {
    const { api, authToken, UserData } = useMyContext();
    const [eventData, setEventData] = useState([]);
    // Fetch event ticket information
    const getEventData = async () => {
        try {
            const res = await axios.get(`${api}event-ticket-info/${UserData?.id}`, {
                headers: { 'Authorization': 'Bearer ' + authToken }
            });

            if (res.data.status) {
                setEventData(res.data.data);
            }
        } catch (err) {
            console.error('Event data fetch error:', err);
        }
    };
    // Initialize event data on component mount
    useEffect(() => {
        getEventData();
    }, []);

    const StatsCard = ({ label, value }) => (
        <Col>
            <Card className="card-block card-stretch card-height">
                <Card.Body>
                    <div className="mb-2 d-flex justify-content-between align-items-center">
                        <span className="text-dark">{label}</span>
                    </div>
                    <h2 className="counter p-0">
                        <CountUp
                            start={0}
                            end={value}
                            duration={1}
                            useEasing={true}
                            separator=","
                        />
                    </h2>
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <Row>
            <Col lg="12">
                <Row>
                    {eventData?.map((item, index) => (
                        <Col key={index} xl={6} md={6}>
                            <Card>
                                <Card.Header>{item?.event?.name}</Card.Header>
                                <Card.Body>
                                    <Row>
                                        {['Checked', 'Remaining', 'Total'].map((type) => (
                                            <StatsCard
                                                key={type}
                                                label={type}
                                                value={item?.[`${type.toLowerCase()}_bookings`]}
                                            />
                                        ))}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    )
}

export default ScannerDashBoard
