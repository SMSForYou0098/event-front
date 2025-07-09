import React, { useEffect, useState } from 'react';
import { Col, Row, Button, Card, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import axios from 'axios';
import { useMyContext } from '../../../../../../Context/MyContextProvider';
import AttendySugettion from './BookingProcess.js/AttendySugettion';
import { PlusIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import BookingsAttendee from './BookingsAttendee';
import { processImageFile } from '../../../CustomComponents/AttendeeStroreUtils';

const DynamicAttendeeForm = (props) => {
    const { apiData, setAttendeeState, quantity, AttendyView, setAttendees, setDisable, category_id, getAttendees, isAgent, showAttendeeSuggetion,sucessAlert,selectedTickets, setIsProceed, disable } = props;
    const { api, UserData, isMobile } = useMyContext()
    const [existingAttendee, setExistingAttendee] = useState([]);
    const [attendeeList, setAttendeesList] = useState([]);
    const [attendeeData, setAttendeeData] = useState({});   
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [ShowAction, setShowAction] = useState(true);
    const [requiredFields, setRequiredFields] = useState([]);
    const [errors, setErrors] = useState({});


    const handleOpenModal = (index = null) => {
        if (index !== null) {
            setAttendeeData(attendeeList[index]);
            setEditingIndex(index);
        } else {
            setAttendeeData({});
            setEditingIndex(null);
        }
        setShowModal(true);
    };
    const GetUserAttandee = async () => {
        try {
            await axios.get(`${api}user-attendee/${UserData.id}/${category_id}?isAgent=${isAgent}`)
                .then((response) => {
                    const Exising_attendy = response.data.attendees;
                    if (Exising_attendy.length > 0) {
                        setExistingAttendee(Exising_attendy)
                        setShowAddAttendeeModal(true);
                    }
                })
                .catch((error) => {

                });

        } catch (error) {
        }
    }
    useEffect(() => {
        const requiredFields = apiData?.filter((field) => field.field_required === 1);
        const requiredFieldNames = requiredFields?.map((field) => field.field_name);
        setRequiredFields(requiredFieldNames)
    }, [apiData]);

    useEffect(() => {
        if (showAttendeeSuggetion) {
            if (UserData && category_id && selectedTickets?.quantity > 0) {
                GetUserAttandee()
            }
        }
    }, [showAttendeeSuggetion])

    const handleCloseModal = () => {
        setShowModal(false)
        setErrors({});
    };

    const Back = () => {
        AttendyView()
        setAttendeeState(false)
        setDisable(false)
    }

    const handleFieldChange = (fieldName, value) => {
        setAttendeeData(prevData => ({
            ...prevData,
            [fieldName]: value,
        }));
    };

    const validateAttendeeData = (attendeeData, requiredFields) => {
        const newErrors = {};

        requiredFields?.forEach((field) => {
            const value = attendeeData[field] || "";

            // If it's a File object and the field includes "photo", ensure it's selected
            if (value instanceof File && field?.toLowerCase()?.includes("photo") && !value) {
                newErrors[field] = `${field} is required`;
                return;
            }

            // Ensure value is a string before calling trim()
            if (!(value instanceof File) && typeof value === "string" && !value.trim()) {
                newErrors[field] = `${field} is required`;
            }

            const numberFields = ["number", "phone number", "mobile number", "contact_number","mo"];
            if (numberFields.includes(field?.toLowerCase()) && !/^\d{10}$/.test(value)) {
                newErrors[field] = `${field} must be a valid 10-digit number`;
            }

            if (/email/i.test(field) && requiredFields?.includes(field) && (typeof value !== "string" || !value.trim())) {
                newErrors[field] = `${field} is required`;
            }

            if (/email/i.test(field) && requiredFields?.includes(field) && typeof value === "string" && value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors[field] = `${field} must be a valid email address`;
            }
        });

        if (!requiredFields?.includes("email")) {
            const emailField = Object.keys(attendeeData).find((field) => /email/i.test(field));
            if (emailField && typeof attendeeData[emailField] === "string" && attendeeData[emailField]?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendeeData[emailField])) {
                newErrors[emailField] = `${emailField} must be a valid email address`;
            }
        }

        return newErrors;
    };

    const handleAddAttendee = () => {
        const newErrors = attendeeData ? validateAttendeeData(attendeeData, requiredFields) : {};
        if (Object.keys(newErrors)?.length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});

        if (editingIndex !== null) {
            const updatedAttendeeData = { ...attendeeData };
            let missingFields = requiredFields?.filter(field => !updatedAttendeeData[field] || updatedAttendeeData[field] === "");

            const updatedList = [...attendeeList];
            updatedList[editingIndex] = {
                ...updatedAttendeeData,
                missingFields
            };

            setAttendeesList(updatedList);
            setAttendees(updatedList);
        } else {
            const missingFields = requiredFields?.filter(field => !attendeeData[field] || attendeeData[field] === "");
            setAttendeesList([
                ...attendeeList,
                { ...attendeeData, missingFields }
            ]);
            setAttendees([
                ...attendeeList,
                { ...attendeeData, missingFields }
            ]);
        }
        // setAttendeeData({});
        handleCloseModal();
    };

    useEffect(() => {
        getAttendees(attendeeList);
    }, [attendeeList]);

    const handleDeleteAttendee = (index) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedList = attendeeList?.filter((_, i) => i !== index);
                setAttendeesList(updatedList);
                setAttendees(updatedList);
                sucessAlert('The attendee has been deleted.');
            } else {
                Swal.fire(
                    'Cancelled',
                    'The attendee was not deleted.',
                    'info'
                );
            }
        });
    };

    const renderField = (field) => {
        const { field_name, lable, field_type, field_options = [], field_required } = field;
        const required = field_required === 1;
        const value = attendeeData[field_name] || '';
        const lbl = required
            ? `${lable} <span class="text-danger">*</span>`
            : lable;

        const onChange = async (e) => {
            const value = e.target ? e.target.value : e;
            if (value && typeof value === 'object' && value.label && value.value) {
                handleFieldChange(field_name, value.value);
            } else {
                if (e.target.type === 'file') {
                    const file = e.target.files[0];
                    const processedFile = await processImageFile(file);
                    if (processedFile) {
                        handleFieldChange(field_name, processedFile);
                    }
                } else {
                    handleFieldChange(field_name, value);
                }
            }
        };

        switch (field_type) {
            case 'text':
            case 'email':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Form.Control
                                type={field_type}
                                value={value}
                                onChange={onChange}
                                required={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            case 'select':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Select
                                value={{ label: value, value }}
                                options={JSON.parse(field_options).map(option => ({ label: option, value: option }))}
                                onChange={onChange}
                                isRequired={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            case 'radio':
                return (
                    <Form.Group>
                        <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                        <div className="d-flex gap-3">
                            {JSON.parse(field_options).map((option, index) => (
                                <Form.Check
                                    key={index}
                                    type="radio"
                                    checked={value === option}
                                    label={option}
                                    value={option}
                                    name={field_name}
                                    onChange={onChange}
                                    required={required}
                                />
                            ))}
                        </div>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </Form.Group>
                );
            case 'checkbox':
                return (
                    <Form.Group>
                        <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                        {JSON.parse(field_options).map((option, index) => (
                            <Form.Check
                                key={index}
                                type="checkbox"
                                checked={Array.isArray(value) && value?.includes(option)}
                                label={option}
                                onChange={(e) => onChange(e, option)}
                                required={required}
                            />
                        ))}
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </Form.Group>
                );
            case 'textarea':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={value}
                                onChange={onChange}
                                required={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            case 'number':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Form.Control
                                type="number"
                                value={value}
                                onChange={onChange}
                                required={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            case 'date':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Form.Control
                                type="date"
                                value={value}
                                onChange={onChange}
                                required={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            case 'file':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Form.Control
                                type="file"
                                onChange={onChange}
                                required={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            case 'color':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Form.Control
                                type="color"
                                onChange={onChange}
                                required={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            case 'range':
                return (
                    <>
                        <Form.Group>
                            <Form.Label dangerouslySetInnerHTML={{ __html: lbl }}></Form.Label>
                            <Form.Control
                                type="range"
                                onChange={onChange}
                                required={required}
                            />
                        </Form.Group>
                        <Form.Text className="text-danger fw-bold">
                            {errors[field_name] || ''}
                        </Form.Text>
                    </>
                );
            default:
                return null;
        }
    };

    const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);

    return (
        <Col lg="12">
            <>
                <Card className="mb-4">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5>Attendees {attendeeList.length + '/' + quantity}</h5>
                        <Button variant="secondary" onClick={Back}>
                            Back
                        </Button>
                    </Card.Header>
                    {/* Add Attendee Button */}
                    {attendeeList?.length < quantity && (
                        <Card.Footer className="d-flex justify-content-center ">
                            <Button variant="primary" className='d-flex align-items-center gap-2' onClick={() => handleOpenModal()}>
                                <PlusIcon size={20} /> Add Attendee
                            </Button>
                        </Card.Footer>
                    )}
                    {/* Render Attendee Cards */}
                    <BookingsAttendee
                        attendeeList={attendeeList}
                        apiData={apiData}
                        handleOpenModal={handleOpenModal}
                        handleDeleteAttendee={handleDeleteAttendee}
                        ShowAction={ShowAction}
                    />
                </Card>
                {showAttendeeSuggetion &&
                    <AttendySugettion
                        quantity={quantity}
                        totalAttendee={attendeeList?.length}
                        list={attendeeList}
                        showAddAttendeeModal={showAddAttendeeModal}
                        setShowAddAttendeeModal={setShowAddAttendeeModal}
                        data={existingAttendee}
                        openAddModal={setShowModal}
                        requiredFields={requiredFields}
                        setAttendeesList={setAttendeesList}
                    //attendeeList={attendeeList}
                    />
                }
                {/* Modal for Adding Attendee */}
                <Modal show={showModal} onHide={handleCloseModal} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Attendee Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <>
                            <Row>
                                {apiData?.map((field, fieldIndex) => (
                                    <Col md={6} key={fieldIndex} className="text-black mb-2">
                                        {renderField(field)}
                                    </Col>
                                ))}
                            </Row>
                            <Button
                                variant="primary"
                                type="submit"
                                className='position-relative float-end'
                                onClick={() => handleAddAttendee()}>
                                {editingIndex ? 'Update' : 'Save'}
                            </Button>
                        </>
                    </Modal.Body>
                </Modal>

                {/* Submit All Attendee Details */}
                {/* {attendeeList?.length === quantity && (
                    <Card.Footer className="text-end">
                        <Button variant="primary" onClick={HandleSubmit} disabled={!disable}>
                            Save All Attendee Details
                        </Button>
                    </Card.Footer>
                )} */}
            </>
            {!isMobile && <Button disabled={disable} onClick={()=>setIsProceed(true)}>Proceed</Button>}
        </Col>
    );
};

export default DynamicAttendeeForm;
