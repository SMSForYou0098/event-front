import React, { Fragment, useEffect, useState } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { CustomCheckbox, CustomColorPicker, CustomDateField, CustomFileField, CustomNumberField, CustomRadioButton, CustomRangeField, CustomSelect, CustomTextArea, CustomTextField } from '../../../CustomComponents/CustomFormFields';
import axios from 'axios';
import { useMyContext } from '../../../../../../Context/MyContextProvider';

const DynamicAttendeeForm = ({ apiData, setAttendeeState, quantity, AttendyView,setAttendees,setDisable }) => {
    const { api,successAlert,UserData } = useMyContext()
    const [attendeeData, setAttendeeData] = useState([]);

    useEffect(() => {
        setAttendeeData(Array.from({ length: quantity }, () => ({})));
    }, [quantity]);

    const Back = () => {
        AttendyView()
        setAttendeeState(false)
        setDisable(false)
    }

    const handleFieldChange = (ticketIndex, fieldName, value) => {
        setAttendeeData(prevData => {
            const updatedData = [...prevData];
            updatedData[ticketIndex] = {
                ...updatedData[ticketIndex],
                [fieldName]: value, // Set field name as key and value as field's value
            };
            return updatedData;
        });
    };

    const renderField = (field, ticketIndex) => {
        const { field_name, field_type, field_options = [], required } = field;
        const onChange = (e) => {
            const value = e.target ? e.target.value : e;
            if (value && typeof value === 'object' && value.label && value.value) {
                const fieldValue = value.value;
                handleFieldChange(ticketIndex, field_name, fieldValue);
            } else {
                if (e.target.type === 'file') {
                    const file = e.target.files[0];
                    handleFieldChange(ticketIndex, field_name, file);
                } else {
                    handleFieldChange(ticketIndex, field_name, value);
                }
            }
        };
        switch (field_type) {
            case 'text':
                return (
                    <CustomTextField
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'email':
                return (
                    <CustomTextField
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'select':
                return (
                    <CustomSelect
                        label={field_name}
                        options={JSON.parse(field_options).map(option => ({ label: option, value: option }))}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'radio':
                return (
                    <div>
                        <Form.Label>{field_name}</Form.Label>
                        <div className="d-flex gap-3">
                            {JSON.parse(field_options).map((option, index) => (
                                <CustomRadioButton
                                    key={index}
                                    value={option}
                                    name={field_name + ticketIndex}
                                    label={field_name}
                                    option={option}
                                    onChange={onChange}
                                    required={required}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'checkbox':
                return (
                    <div>
                        <Form.Label>{field_name}</Form.Label>
                        {JSON.parse(field_options).map((option, index) => (
                            <CustomCheckbox
                                key={index}
                                label={option}
                                onChange={(e) => onChange(e, option)}
                                required={required}
                            />
                        ))}
                    </div>
                );
            case 'textarea':
                return (
                    <CustomTextArea
                        label={field_name}
                        onChange={onChange}
                        rows={3}
                        required={required}
                    />
                );
            case 'number':
                return (
                    <CustomNumberField
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'date':
                return (
                    <CustomDateField
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'file':
                return (
                    <CustomFileField
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'color':
                return (
                    <CustomColorPicker
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'range':
                return (
                    <CustomRangeField
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            default:
                return null;
        }
    };

    const HandleSubmit = async () => {
        
        //setAttendees(attendeeData)
        try {
            const formData = new FormData();
            attendeeData.forEach((attendee, index) => {
                Object.keys(attendee).forEach(fieldKey => {
                    const fieldValue = attendee[fieldKey];
                    if (fieldValue instanceof File) {
                        formData.append(`attendees[${index}][${fieldKey}]`, fieldValue);
                    } else {
                        formData.append(`attendees[${index}][${fieldKey}]`, fieldValue);
                    }
                });
            });
            // append user id in formData
            formData.append('user_id', UserData?.id);
            const response = await axios.post(`${api}attndy-store`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.data.status){
                successAlert('success', 'Attendees Saved Successfully')
                setAttendees(response.data.data)
                setDisable(false)
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };
    return (
        <Col lg="8">
            <Form>
                <Card className="mb-4">
                    <Card.Header className="position text-end">
                        <Button variant="secondary" onClick={() => Back()}>
                            Back
                        </Button>
                    </Card.Header>
                    {Array.from({ length: quantity }, (_, ticketIndex) => (
                        <Fragment key={ticketIndex}>
                            <Card.Header>Attendee Details - Ticket {ticketIndex + 1}</Card.Header>
                            <Card.Body>
                                <Row>
                                    {apiData?.map((field, index) => (
                                        <Col md={4} key={`${ticketIndex}-${index}`} className="text-black mb-2">
                                            {renderField(field, ticketIndex)}
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </Fragment>
                    ))}
                    <Card.Footer className='text-end'>
                        <Button variant="primary" onClick={HandleSubmit}>
                            Save Attendee Detail
                        </Button>
                    </Card.Footer>
                </Card>
            </Form>
        </Col>
    );
};

export default DynamicAttendeeForm;
