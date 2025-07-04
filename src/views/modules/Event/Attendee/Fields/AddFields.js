import React, { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { CustomTextField, CustomSelect, CustomSwitch, CustomCheckbox, CustomRadioButton, CustomTextArea, CustomNumberField, CustomDateField, CustomFileField, CustomColorPicker, CustomRangeField } from '../../CustomComponents/CustomFormFields';
import CustomIconButton from '../../CustomComponents/CustomIconButton';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import axios from 'axios';
import SelectedOptionView from './SelectedOptionView';
const AddFields = ({ show, setShow, editState, setEditState, GetPages, editData }) => {
    const { api, successAlert, authToken,userRole } = useMyContext();

    const [label, setLabel] = useState('');
    const [fieldType, setFieldType] = useState('');
    const [editId, setEditId] = useState('');
    const [required, setRequired] = useState(false);
    const [validated, setValidated] = useState(false);
    const [selectOptions, setSelectOptions] = useState([]);
    const [options, setOptions] = useState([]);
    const [newOption, setNewOption] = useState('');
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [fixed, setFixed] = useState(false);


    const fieldOptions = [
        { value: 'text', label: 'Text' },
        { value: 'email', label: 'Email' },
        { value: 'select', label: 'Select' },
        { value: 'switch', label: 'Switch' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'radio', label: 'Radio' },
        { value: 'textarea', label: 'Text Area' },
        { value: 'number', label: 'Number' },
        { value: 'date', label: 'Date' },
        { value: 'file', label: 'File' },
        { value: 'color', label: 'Color Picker' },
        { value: 'range', label: 'Range' },
    ];

    useEffect(() => {
        if (editState && editData) {
            setEditId(editData?.id)
            setLabel(editData?.field_name);
            setFieldType(editData?.field_type);
            setRequired(editData?.field_required === 1 ? true : false);
            setOptions(editData?.field_options && JSON?.parse(editData?.field_options));
        }
    }, [editState, editData]);

    const resetFieldStates = () => {
        setNewOption('');

        setOptions([]);
        setSelectOptions([]);
    };

    const handleFieldChange = (selectedOption) => {
        if (selectedOption) {
            setFieldType(selectedOption.value);
            resetFieldStates();
        }
    };

    const addOption = () => {
        if (newOption) {
            setOptions((prevOptions) => [...(prevOptions || []), newOption]);
            setNewOption(''); // Clear input after adding
        }
    };

    const removeOption = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
    };

    const Options = ({ options }) => (
        <>
            <p className='mb-2'>Options : </p>
            <div className='row custom-dotted-border p-3'>
                {options && options?.map((item, i) =>
                    <Col>
                        <SelectedOptionView item={item} key={i} closable={true} HandleClick={() => removeOption(i)} />
                    </Col>
                )}
            </div>
        </>
    )

    const renderField = () => {
        switch (fieldType) {
            case 'text':
                return <CustomTextField label={'Your Field Preview'} required={required} validationMessage="This field is required" />;
            case 'email':
                return <CustomTextField label={'Your Field Preview'} required={required} validationMessage="This field is required" />;
            case 'select':
                return (
                    <Row>
                        <Col lg="10">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Add Option:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addOption();
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <small className="text-muted mb-2">
                                    You can add an option by pressing <strong>Enter</strong> or by clicking the <strong>+</strong> button.
                                </small>
                            </Form.Group>
                        </Col>
                        <Col lg="2">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>&nbsp;⠀</Form.Label>
                                <CustomIconButton
                                    type={'add'}
                                    onClick={addOption}
                                    iconclass={'m-0 p-0'}
                                    buttonClasses={'p-0 m-0'}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="12">
                            <Options options={options} />
                        </Col>
                        <Col lg="12">
                            <CustomSelect
                                label={'Your Field Preview'}
                                required={required}
                                validationMessage="Please select an option"
                            />
                        </Col>

                    </Row>
                );
            case 'switch':
                return <CustomSwitch label={'Your Field Preview'} required={required} validationMessage="Switch is required" />;
            case 'checkbox':
                return (
                    <Row>
                        {options?.map((option, index) =>
                            <Col>
                                <CustomCheckbox key={index} label={option} validationMessage="Checkbox is required" />
                            </Col>
                        )}
                        <Col lg="10">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Add Option:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addOption();
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <small className="text-muted mb-2">
                                    You can add an option by pressing <strong>Enter</strong> or by clicking the <strong>+</strong> button.
                                </small>
                            </Form.Group>
                        </Col>
                        <Col lg="2">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>&nbsp;⠀</Form.Label>
                                <CustomIconButton
                                    type={'add'}
                                    onClick={addOption}
                                    iconclass={'m-0 p-0'}
                                    buttonClasses={'p-0 m-0'}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="12">
                            <Options options={options} />
                        </Col>
                    </Row>
                );

            case 'radio':
                return (
                    <Row>
                        {options?.map((option, index) => (
                            <Col>
                                <CustomRadioButton
                                    key={index}
                                    label={option}
                                    required={required}
                                    validationMessage="Checkbox is required"
                                />
                            </Col>
                        ))}
                        <Col lg="10">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Add Option:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addOption();
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <small className="text-muted mb-2">
                                    You can add an option by pressing <strong>Enter</strong> or by clicking the <strong>+</strong> button.
                                </small>
                            </Form.Group>
                        </Col>
                        <Col lg="2">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>&nbsp;⠀</Form.Label>
                                <CustomIconButton
                                    type={'add'}
                                    onClick={addOption}
                                    iconclass={'m-0 p-0'}
                                    buttonClasses={'p-0 m-0'}
                                />
                            </Form.Group>
                        </Col>
                        <Col lg="12">
                            <Options options={options} />
                        </Col>
                    </Row>
                );

            case 'textarea':
                return <CustomTextArea label={'Your Field Preview'} required={required} validationMessage="This field is required" />;
            case 'number':
                return <CustomNumberField label={'Your Field Preview'} required={required} validationMessage="Please enter a number" />;
            case 'date':
                return <CustomDateField label={'Your Field Preview'} required={required} validationMessage="Please select a date" />;
            case 'file':
                return <CustomFileField label={'Your Field Preview'} required={required} validationMessage="File is required" />;
            case 'color':
                return <CustomColorPicker label={'Your Field Preview'} required={required} validationMessage="Please select a color" />;
            case 'range':
                return <CustomRangeField label={'Your Field Preview'} required={required} validationMessage="Please select a range" />;
            default:
                return null;
        }
    };

    const handleClose = () => {
        setShow(false)
        setEditState(false)
        setLabel('');
        setFieldType('');
        setEditId('');
        setRequired(false);
        setValidated(false);
        setSelectOptions([]);
        setOptions([]);
        setNewOption('');
        setError(null);
        setLoading(false);
    }


    const HandleSubmit = async () => {
        setLoading(true)
        try {
            const payload = {
                id: editState ? editId : null,
                field_type: fieldType,
                field_name: label,
                field_required: required,
                field_options: options,
                fixed: fixed,
                field_slug: label.replace(/\s+/g, '_')
            };
            let apiUrl = editState ? `${api}field-update/${editId}` : `${api}field-store`;
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            GetPages()
            resetFieldStates()
            handleClose()
            successAlert(editState ? 'Field Updated Successfully' : 'New Field Added Successfully')
            if (response.data.status) {
            }
        } catch (error) {
            setError(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <Modal show={show} onHide={() => handleClose()}>
            <Modal.Header closeButton>
                <Modal.Title className="text-center w-100">{editState ? 'Edit' : 'New'} Fields</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row>
                        <Col lg="12">
                            {error &&
                                <Alert variant="danger d-flex align-items-center" role="alert">
                                    <svg className="me-2" id="exclamation-triangle-fill" fill="currentColor" width="20" viewBox="0 0 16 16">
                                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                                    </svg>
                                    <div>
                                        {error}
                                    </div>
                                </Alert>
                            }
                            <Form.Group className="mb-3 form-group">
                                <Form.Label className="custom-file-input">Label</Form.Label>
                                <Form.Control type="text" value={label} placeholder="" onChange={(e) => setLabel(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col lg="12">
                            <CustomSelect
                                label="Field Type:"
                                value={{ value: fieldType, label: fieldType }}
                                options={fieldOptions}
                                onChange={handleFieldChange}
                                required={true}
                                className="mb-3"
                                validationMessage="Please select a field type."
                                validated={validated}
                            />
                        </Col>
                        <Col lg="12">
                            {renderField()}
                        </Col>
                        <Col lg="6">
                            <CustomSwitch
                                label={'Required'}
                                className="mt-3"
                                checked={required}
                                // required={required}
                                onChange={(e) => setRequired(e.target.checked)}
                                validationMessage="Switch is required"
                            />
                        </Col>
                        {userRole === 'Admin' &&
                            <Col lg="6">
                                <CustomSwitch
                                    label={'Fixed'}
                                    className="mt-3"
                                    checked={fixed}
                                    onChange={(e) => setFixed(e.target.checked)}
                                    validationMessage="Switch is required"
                                />
                                <p className="text-muted">fixed field is not editable.</p>
                            </Col>
                        }

                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger"
                    onClick={handleClose}
                >
                    Discard Changes
                </Button>
                <Button variant="primary" disabled={loading} onClick={HandleSubmit}>
                    {loading ? 'Loading...' : 'Save'}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddFields