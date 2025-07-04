import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Form, Button } from 'react-bootstrap'
import { useMyContext } from '../../../../Context/MyContextProvider'
import axios from 'axios'
import Select from 'react-select';
const Comission = () => {
    const { api, successAlert, UserData, ErrorAlert,authToken } = useMyContext();
    // Initialize state for each field
    const [commissionType, setCommissionType] = useState('');
    const [rate, setRate] = useState('');
    const [status, setStatus] = useState('');

    const handleRetrieveTax = async () => {
        try {
            const response = await axios.get(`${api}commissions/${1}`, {
                headers: {
                  'Authorization': 'Bearer ' + authToken,
                }
              });
            const commission = response.data?.commission;
            // Update state with retrieved data
            setCommissionType(commissionOption.find(option => option.value === commission.commission_type));
            setRate(commission.commission_rate);
            setStatus(commission.status);
        } catch (error) {
            console.error('Error retrieving tax:', error);
            setStatus('Error retrieving tax');
        }
    };

    useEffect(() => {
        handleRetrieveTax()
    }, []);

    const SubmitCommission = async () => {
        try {
            const response = await axios.post(`${api}commissions-store`, {
                commission_type: commissionType?.value,
                commission_rate	: rate,
                status: status,
                user_id: UserData?.id,
            }, {
                headers: {
                  'Authorization': 'Bearer ' + authToken,
                }
              });
            ;
            successAlert('Success', 'Commission stored successfully');
        } catch (error) {
            console.error('Error storing tax:', error);
            ErrorAlert('Error', 'Error storing Commission');
        }
    };
    const commissionOption = [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Percentage', label: 'Percentage' },
    ];
    const handleCommissionTypeChange = (selectedOption) => {
        setCommissionType(selectedOption);
    };
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };
    return (

        <Card>
            <Card.Header>
                <h4 className="card-title">Commision</h4>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Row>

                        <Col lg="6">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Commision Type</Form.Label>
                                <Select
                                    options={commissionOption}
                                    value={commissionType}
                                    onChange={handleCommissionTypeChange}
                                    placeholder="Select Tax Type"
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="6">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Rate</Form.Label>
                                <Form.Control type="text" placeholder="" value={rate} onChange={(e) => setRate(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col lg="6" className='d-flex gap-3'>
                <div className="form-radio form-check">
                    <Form.Check.Input
                        type="radio"
                        id="enableRadio"
                        name="status"
                        className="me-2"
                        value="1"
                        checked={status === "1"}
                        onChange={handleStatusChange}
                    />
                    <Form.Label
                        className="custom-control-label"
                        htmlFor="enableRadio"
                    >
                        Enable
                    </Form.Label>
                </div>
                <div className="form-radio form-check">
                    <Form.Check.Input
                        type="radio"
                        id="disableRadio"
                        name="status"
                        className="me-2"
                        value="0"
                        checked={status === "0"}
                        onChange={handleStatusChange}
                    />
                    <Form.Label
                        className="custom-control-label"
                        htmlFor="disableRadio"
                    >
                        Disable
                    </Form.Label>
                </div>
            </Col>
                        <div className='d-flex justify-content-end'>
                            <Button type="button" onClick={(e) => SubmitCommission(e)}>Submit</Button>
                        </div>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default Comission