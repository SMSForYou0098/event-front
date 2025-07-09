import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, InputGroup, Row } from 'react-bootstrap'
import Select from "react-select";
import { useMyContext } from '../../../../../Context/MyContextProvider';
import axios from 'axios';
import JoditEditor from 'jodit-react';
import { useNavigate } from 'react-router-dom';
import { CustomSelect } from '../../CustomComponents/CustomFormFields';
import EventControls from './EventComponent/Forms/EventControls';
import { customStyles } from '../../CustomComponents/select2';
import { scanOption } from './EditEvent';
const MakeEvent = () => {
    const { api, UserList, authToken, userRole, UserData, EventCategory,ErrorAlert } = useMyContext();

    const navigate = useNavigate()
    const [validated, setValidated] = useState(false);
    const [users, setUsers] = useState([]);
    const [address, setAddress] = useState('');
    const [userId, setUserId] = useState('');
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');

    const [description, setDescription] = useState('');
    const [customerCareNumber, setCustomerCareNumber] = useState('');
    const [eventFeature, setEventFeature] = useState('');
    const [status, setStatus] = useState('');
    const [houseFull, setHouseFull] = useState('');
    const [smsOtpCheckout, setSmsOtpCheckout] = useState('');
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [scanDetail, setScanDetail] = useState({ label: 'Both', value: 2 });
    const [countries, setCountries] = useState([]);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [ticketSystem, setTicketSystem] = useState(false);
    const [categoryList, setCategoryList] = useState();
    const [onlineAttSug, setOnlineAttSug] = useState("");
    const [offlineAttSug, setOfflineAttSug] = useState("");
    const [mutiScan, setMultiScan] = useState('');

    useEffect(() => {
        EventCategory(setCategoryList)
        if (userRole === 'Organizer') {
            setUserId({ key: UserData?.id, label: UserData?.id })
            setIsOrganizer(true)
        }
        setUsers(UserList ?? [])
    }, [UserList]);

    useEffect(() => {
        axios.post(`https://api.first.org/data/v1/countries`)
            .then((res) => {
                const transformedData = Object.values(res.data.data).map(item => ({
                    label: item.country,
                    value: item.country,
                }));
                setCountries([{ label: 'Select State', value: 'Select State', isDisabled: true }, ...transformedData]);
            })
            .catch((err) => { // console.log(err)
            })
    }, [])
    useEffect(() => {
        setStates([{ label: 'Select State', value: 'Select State', isDisabled: true }]);
        if (country) {
            axios.post(`https://countriesnow.space/api/v0.1/countries/states`, { "country": country })
                .then((res) => {
                    const transformedData = res.data.data.states.map(state => ({
                        label: state.name,
                        value: state.name,
                    }));
                    setStates([{ label: 'Select State', value: 'Select State', isDisabled: true }, ...transformedData]);
                })
                .catch((err) => { })
        }
    }, [country])

    useEffect(() => {
        setCities([{ label: 'Select City', value: 'Select City' }])
        if (state) {
            axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`, { "country": country, "state": state })
                .then((res) => {
                    let data = res.data.data;
                    const transformedData = data.map(city => ({
                        label: city,
                        value: city,
                    }))
                    setCities([{ label: 'Select City', value: 'Select City', isDisabled: true }, ...transformedData])
                }).catch((err) =>
                    console.log(err)
                )
        }
    }, [state])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
         if (
    !name ||
    !category ||
    !address ||
    !description ||
    !city ||
    !state ||
    (!isOrganizer && !userId)
  ) {
    setValidated(true);
    ErrorAlert("Please fill all required fields.");
    return;
  }
  if(!status ){
    ErrorAlert("Note You Forgot On Event Status")
  }
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const user = userRole === 'Organizer' ? UserData?.id : userId?.value;
            // console.log(name)
            const formData = new FormData();
            formData.append('address', address);
            formData.append('user_id', user);
            formData.append('category', category?.value);
            formData.append('name', name);
            formData.append('country', country);
            formData.append('state', state);
            formData.append('city', city);
            formData.append('description', description);
            // formData.append('customer_care_number', customerCareNumber);
            //formData.append('status', status);
            formData.append('event_feature', eventFeature  === true ? 1 : 0);
            formData.append('status', status === true ? 1 : 0);
            formData.append('house_full', houseFull === true ? 1 : 0);
            formData.append('multi_scan', mutiScan === true ? 1 : 0);
            formData.append('sms_otp_checkout', smsOtpCheckout === true ? 1 : 0);
            formData.append('offline_att_sug', offlineAttSug  === true ? 1 : 0);
            formData.append('online_att_sug', onlineAttSug  === true ? 1 : 0);
            formData.append('ticket_system', ticketSystem  === true ? 1 : 0);
            formData.append('scan_detail', scanDetail?.value);
            await axios.post(`${api}create-event`, formData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            })
                .then((res) => {
                    if (res.data.status) {
                        let id = res.data.event?.event_key
                        // navigate('/dashboard/events/edit/', { state: { id } })
                        navigate(`/dashboard/events/edit/${id}`)
                    }
                }).catch((err) =>
                    console.log(err)
                )
            setValidated(true);
        }
    }
    return (
        <>
            <Row>
                <Col sm="12" lg="8">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Event Primary Details</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Form validated={validated} onSubmit={handleSubmit} className="needs-validation" noValidate>
                                <Row>
                                    {!isOrganizer &&
                                        <Col md="4">
                                            <CustomSelect
                                                label="User:"
                                                options={users}
                                                styles={customStyles}
                                                onChange={setUserId}
                                                required={true}
                                                validationMessage="Please select a user."
                                                validated={validated}
                                            />
                                        </Col>
                                    }
                                    <Col md="4">
                                        <CustomSelect
                                            label="Category:"
                                            options={categoryList}
                                            styles={customStyles}
                                            onChange={setCategory}
                                            required={true}
                                            validationMessage="Please select a category."
                                            validated={validated}
                                        />
                                    </Col>
                                    <Col md="4">
                                        <Form.Group className="position-relative">
                                            <Form.Label htmlFor="validationTooltipUsername">Event Name: *</Form.Label>
                                            <InputGroup hasValidation>
                                                <Form.Control
                                                    type="text"
                                                    id="validationTooltipUsername"
                                                    aria-describedby="validationTooltipUsernamePrepend"
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                                <Form.Control.Feedback tooltip>
                                                    Looks good!
                                                </Form.Control.Feedback>
                                                <Form.Control.Feedback tooltip type="invalid">
                                                    Please enter event name.
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    {/* <Col md="4">
                                        <Form.Group>
                                            <Form.Label>Country: *</Form.Label>
                                            <Select
                                                options={countries}
                                                styles={customStyles}
                                                onChange={(e) => setCountry(e.value)}
                                                required
                                            />
                                            <Form.Control.Feedback tooltip>
                                                Looks good!
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col> */}
                                    <Col md="4">
                                        <Form.Group>
                                            <Form.Label>State: *</Form.Label>
                                            <Select
                                                options={states}
                                                styles={customStyles}
                                                onChange={(e) => setState(e.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="4">
                                        <Form.Group>
                                            <Form.Label>City: *</Form.Label>
                                            <Select
                                                options={cities}
                                                styles={customStyles}
                                                onChange={(e) => setCity(e.label)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="4">
                                        <Form.Group>
                                            <Form.Label>UserData While Scan: *</Form.Label>
                                            <Select
                                                options={scanOption}
                                                styles={customStyles}
                                                value={scanDetail}
                                                onChange={(data) => setScanDetail(data)}
                                                // required
                                            />
                                            <Form.Control.Feedback tooltip>
                                                Looks good!
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md="12">
                                        <Form.Group>
                                            <Form.Label>Address: *</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows="3"
                                                onChange={(e) => setAddress(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md="12">
                                        <Form.Group>
                                            <Form.Label>Event Description: *</Form.Label>
                                            <JoditEditor
                                                tabIndex={1}
                                                value={description}
                                                onChange={(value) => setDescription(value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {/* <Col md="6">
                                        <Form.Group>
                                            <Form.Label>Add Customer Care Number: *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Customer Care Number"
                                                value={customerCareNumber}
                                                onChange={(e) => setCustomerCareNumber(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col> */}
                                    <Row>
                                        <EventControls
                                            ticketSystem={ticketSystem}
                                            setScanDetail={setScanDetail}
                                            scanDetails={scanDetail}
                                            setTicketSystem={setTicketSystem}
                                            eventFeature={eventFeature}
                                            mutiScan={mutiScan}
                                            setMultiScan={setMultiScan}
                                            offlineAttSug={offlineAttSug}
                                            setOfflineAttSug={setOfflineAttSug}
                                            setOnlineAttSug={setOnlineAttSug}
                                            onlineAttSug={onlineAttSug}
                                            setEventFeature={setEventFeature}
                                            status={status}
                                            setStatus={setStatus}
                                            houseFull={houseFull}
                                            setHouseFull={setHouseFull}
                                            smsOtpCheckout={smsOtpCheckout}
                                            setSmsOtpCheckout={setSmsOtpCheckout}
                                        />
                                    </Row>
                                </Row>
                                <Button type="submit" className="action-button float-end">
                                    Proceed to details
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default MakeEvent