import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Form, Button } from 'react-bootstrap'
import { useMyContext } from '../../../../Context/MyContextProvider'
import axios from 'axios'
import Comission from './Comission'
import Select from 'react-select';
const Tax = () => {
    const { api, successAlert, UserData, ErrorAlert,authToken } = useMyContext();
    const [taxTitle, setTaxTitle] = useState('');
    const [rateType, setRateType] = useState(null);
    const [rate, setRate] = useState('');
    const [taxType, setTaxType] = useState(null);
    const [status, setStatus] = useState('');

    const handleStoreTax = async () => {
        try {
            const response = await axios.post(`${api}taxes`, {
                tax_title: taxTitle,
                rate_type: rateType.value,
                rate: rate,
                tax_type: taxType.value,
                status: status,
                user_id: UserData?.id,
            }, {
                headers: {
                  'Authorization': 'Bearer ' + authToken,
                }
              });
            ;
            successAlert('Success', 'Tax stored successfully');
        } catch (error) {
            console.error('Error storing tax:', error);
            ErrorAlert('Error', 'Error storing tax');
        }
    };

    const handleRetrieveTax = async () => {
        try {
            const response = await axios.get(`${api}taxes/${1}`, {
                headers: {
                  'Authorization': 'Bearer ' + authToken,
                }
              });
            const taxData = response.data?.taxes;
            // Update state with retrieved data
            setTaxTitle(taxData.tax_title);
            setRateType(RateOptions.find(option => option.value === taxData.rate_type));
            setRate(taxData.rate);
            setTaxType(taxTypeOptions.find(option => option.value === taxData.tax_type));
            setStatus(taxData.status);
        } catch (error) {
            console.error('Error retrieving tax:', error);
            setStatus('Error retrieving tax');
        }
    };
    useEffect(() => {
        handleRetrieveTax()
    }, []);

    const taxTypeOptions = [
        { value: 'Inclusive', label: 'Inclusive' },
        { value: 'Exclusive', label: 'Exclusive' },
    ];
    const RateOptions = [
        { value: 'Fixed', label: 'Fixed' },
        { value: 'Percentage', label: 'Percentage' },
    ];

    const handleRateTypeChange = (selectedOption) => {
        setRateType(selectedOption);
    };

    const handleTaxTypeChange = (selectedOption) => {
        setTaxType(selectedOption);
    };
    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };
    return (
        <Row>
            <Col lg="6">
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Tax</h4>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Tax Title</Form.Label>
                                        <Form.Control type="text" placeholder="" value={taxTitle} onChange={(e) => setTaxTitle(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Rate Type</Form.Label>
                                        <Select
                                            options={RateOptions}
                                            value={rateType}
                                            onChange={handleRateTypeChange}
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
                                <Col lg="6">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Tax Type</Form.Label>
                                        <Select
                                            options={taxTypeOptions}
                                            value={taxType}
                                            onChange={handleTaxTypeChange}
                                            placeholder="Select Tax Type"
                                        />
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
                                    <Button type="button" onClick={(e) => handleStoreTax(e)}>Submit</Button>
                                </div>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg="6">
                <Comission />
            </Col>
        </Row>
    )
}

export default Tax