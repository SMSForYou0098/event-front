import React, { Fragment, useEffect, useState } from 'react';
import { Col, Row, Button, Card, Form, Modal } from "react-bootstrap";
import { CustomCheckbox, CustomColorPicker, CustomDateField, CustomFileField, CustomNumberField, CustomRadioButton, CustomRangeField, CustomSelect, CustomTextArea, CustomTextField } from '../../../CustomComponents/CustomFormFields';
import axios from 'axios';
import { useMyContext } from '../../../../../../Context/MyContextProvider';
import { DleteIcon, EditIcon } from '../../../CustomHooks/CustomIcon';


const DynamicAttendeeForm = ({ apiData, setAttendeeState, quantity, AttendyView, setAttendees, setDisable }) => {
    const { api, successAlert, UserData } = useMyContext()
    const [attendeeList, setAttendeesList] = useState([]);
    const [attendeeData, setAttendeeData] = useState({});
    const [editIndex, setEditIndex] = useState();
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = (index) => {
        setEditIndex(index); // Set the edit index (null if adding a new attendee)
        if (index && attendeeList.length > 0) {
            setAttendeeData(attendeeList[index]);
        }
        else {
            setAttendeeData({})
        };
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false)
        setAttendeesList([]);
        setAttendeeData({});
    };

    const Back = () => {
        AttendyView()
        setAttendeeState(false)
        setDisable(false)
    }

    const handleFieldChange = (fieldName, value) => {
        setAttendeeData(prevData => ({
            ...prevData,
            [fieldName]: value, // Set field name as key and value as field's value
        }));
    };

    const handleAddOrUpdateAttendee = (e) => {
        e.preventDefault();
        if (editIndex) {
            const updatedList = [...attendeeList];
            updatedList[editIndex] = attendeeData;
            setAttendeesList(updatedList);
        } else {
            setAttendeesList([...attendeeList, attendeeData]);
        }

        setAttendeeData({});
        setEditIndex();
        handleCloseModal();
    };
    const renderField = (field, ticketIndex) => {
        const { field_name, field_type, field_options = [], required } = field;
        const onChange = (e) => {
            const value = e.target ? e.target.value : e;
            if (value && typeof value === 'object' && value.label && value.value) {
                handleFieldChange(field_name, value.value);
            } else {
                if (e.target.type === 'file') {
                    const file = e.target.files[0];
                    handleFieldChange(field_name, file);
                } else {
                    handleFieldChange(field_name, value);
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
                        // value={editValue}
                        label={field_name}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'select':
                return (
                    <CustomSelect
                        label={field_name}
                        // value={{ label: editValue, value: editValue }}
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
                                    // defaultChecked={option === editValue}
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
                                // checked={option === editValue}
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
                        // value={editValue}
                        rows={3}
                        required={required}
                    />
                );
            case 'number':
                return (
                    <CustomNumberField
                        label={field_name}
                        // value={editValue}
                        onChange={onChange}
                        required={required}
                    />
                );
            case 'date':
                return (
                    <CustomDateField
                        label={field_name}
                        // value={editValue}
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

        // console.log(attendeeList); return
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
            if (response.data.status) {
                successAlert('success', 'Attendees Saved Successfully')
                setAttendees(response.data.data)
                setDisable(false)
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const handleDeleteAttendee = (index) => {
        const updatedList = attendeeList.filter((_, i) => i !== index);
        setAttendeesList(updatedList);
        setAttendees(updatedList);
    };
    return (
        <Col lg="8">
            <>
                <Card className="mb-4">
                    <Card.Header className="position text-end">
                        <Button variant="secondary" onClick={Back}>
                            Back
                        </Button>
                    </Card.Header>

                    {/* Render Attendee Cards */}
                    {attendeeList?.map((attendee, index) => (
                        <div key={index} className="custom-dotted-border m-2 rounded-3">
                            <Card.Header className="d-flex justify-content-between">
                                Attendee Details - Ticket {index + 1}
                                <div className='d-flex gap-2'>
                                    <div className="cursor-pointer" onClick={() => handleOpenModal(index)}>
                                        <EditIcon size={25} />
                                    </div>
                                    <div className="cursor-pointer" onClick={() => handleDeleteAttendee(index)}>
                                        <DleteIcon size={25} />
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    {apiData?.map((field, fieldIndex) => (
                                        <Col md={4} key={fieldIndex} className="text-black mb-2">
                                            <strong>{field.field_name}: </strong>
                                            {attendee[field.field_name]}
                                        </Col>
                                    ))}
                                </Row>
                            </Card.Body>
                        </div>
                    ))}

                    {/* Add Attendee Button */}
                    {attendeeList?.length < quantity && (
                        <Card.Footer className="text-end">
                            <Button variant="primary" onClick={() => handleOpenModal()}>
                                Add Attendee
                            </Button>
                        </Card.Footer>
                    )}
                </Card>

                {/* Modal for Adding Attendee */}
                <Modal show={showModal} onHide={handleCloseModal} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{editIndex !== null ? "Edit Attendee Details" : "Add Attendee Details"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form
                            onSubmit={(e) => handleAddOrUpdateAttendee(e)}
                        >
                            <Row>
                                {apiData?.map((field, fieldIndex) => (
                                    <Col md={6} key={fieldIndex} className="text-black mb-2">
                                        {renderField(field)}
                                    </Col>
                                ))}
                            </Row>
                            <Button variant="primary" type="submit" className='position-relative float-end'>
                                Save
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Submit All Attendee Details */}
                {attendeeList?.length === quantity && (
                    <Card.Footer className="text-end">
                        <Button variant="success" onClick={HandleSubmit}>
                            Save All Attendee Details
                        </Button>
                    </Card.Footer>
                )}
            </>
        </Col>
    );
};

export default DynamicAttendeeForm;
