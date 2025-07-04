import React, { useEffect, useState } from "react";

//react-bootstrap
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import Select from "react-select";
//router
import { Link } from "react-router-dom";
// img

import axios from "axios";
import { customStyles } from "../../plugins/pages/select2";
import { useMyContext } from "../../../../Context/MyContextProvider";





const NewUserWizard = () => {
    const{api}=useMyContext();
    const [show, AccountShow] = useState("Profile");
    const [validated, setValidated] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [pincode, setPincode] = useState('');
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setNumber] = useState('')
    const [organisation, setOrganisation] = useState('')
    const [altNumber, setAltNumber] = useState('')
    const [bankName, setBankName] = useState('')
    const [bankNumber, setBankNumber] = useState('')
    const [bankIfsc, setBankIfsc] = useState('')
    const [bankBranch, setBankBranch] = useState('')
    const [bankMicr, setBankMicr] = useState('')
    const [taxNumber, setTaxNumber] = useState('')
    const [password, setPassword] = useState('')





    useEffect(() => {
        axios.post(`https://countriesnow.space/api/v0.1/countries/states`, { "country": "India" })
            .then((res) => {
                // Transform data to desired format
                const transformedData = res.data.data.states.map(state => ({
                    label: state.name,
                    value: state.name,
                }));
                // Store transformed data in state
                setStates(transformedData);
            })
            .catch((err) =>
                console.log(err)
            )

    }, [])

    useEffect(() => {
        if (pincode.length === 6) {
            axios.get(`https://api.postalpincode.in/pincode/${pincode}`)
                .then((res) => {
                    setState({ label: res.data[0].PostOffice[0].State, value: res.data[0].PostOffice[0].State })
                    setCity('')
                }
                ).catch((err) =>
                    console.log(err)
                )
        }
    }, [pincode])
    useEffect(() => {
        if (state) {
            axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`, { "country": "India", "state": state.value })
                .then((res) => {
                    let data = res.data.data;
                    const transformedData = data.map(city => ({
                        label: city,
                        value: city,
                    }))
                    setCities(transformedData)
                }).catch((err) =>
                    console.log(err)
                )
        }
    }, [state])

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            const formData = new FormData();

            formData.append('city', city);
            formData.append('state', state);
            formData.append('pincode', pincode);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('number', number);
            formData.append('organisation', organisation);
            formData.append('alt_number', altNumber);
            formData.append('bank_name', bankName);
            formData.append('bank_number', bankNumber);
            formData.append('bank_ifsc', bankIfsc);
            formData.append('bank_branch', bankBranch);
            formData.append('bank_micr', bankMicr);
            formData.append('tax_number', taxNumber);
            formData.append('password', password);
            axios.post(`${api}create-user`,formData)
                .then((res) => {
                    
                }).catch((err) =>
                    console.log(err)
                )
            setValidated(true);
        }
    };

    return (
        <Row>
            <Col sm="12" lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                            <h4 className="card-title">Add New User</h4>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {/* <Form id="form-wizard1" className="text-center mt-3"> */}
                        <ul id="top-tab-list" className="p-0 row list-inline">
                            <li className={` ${show === "Profile" ? " active" : ""}  col-lg-3 col-md-6 text-start mb-2 `}
                                id="Profile"
                                onClick={() => AccountShow('Profile')}>
                                <Link to="#">
                                    <div className="iq-icon me-3">
                                        <svg
                                            className="icon-20 svg-icon"
                                            width="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                opacity="0.4"
                                                d="M8.23918 8.70907V7.36726C8.24934 5.37044 9.92597 3.73939 11.9989 3.73939C13.5841 3.73939 15.0067 4.72339 15.5249 6.19541C15.6976 6.65262 16.2057 6.89017 16.663 6.73213C16.8865 6.66156 17.0694 6.50253 17.171 6.29381C17.2727 6.08508 17.293 5.84654 17.2117 5.62787C16.4394 3.46208 14.3462 2 11.9786 2C8.95048 2 6.48126 4.41626 6.46094 7.38714V8.91084L8.23918 8.70907Z"
                                                fill="currentColor"
                                            ></path>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.7688 8.71118H16.2312C18.5886 8.71118 20.5 10.5808 20.5 12.8867V17.8246C20.5 20.1305 18.5886 22.0001 16.2312 22.0001H7.7688C5.41136 22.0001 3.5 20.1305 3.5 17.8246V12.8867C3.5 10.5808 5.41136 8.71118 7.7688 8.71118ZM11.9949 17.3286C12.4928 17.3286 12.8891 16.941 12.8891 16.454V14.2474C12.8891 13.7703 12.4928 13.3827 11.9949 13.3827C11.5072 13.3827 11.1109 13.7703 11.1109 14.2474V16.454C11.1109 16.941 11.5072 17.3286 11.9949 17.3286Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </div>{" "}
                                    <span className="dark-wizard">Profile</span>
                                </Link>
                            </li>
                            <li className={` ${show === "Address" ? " active" : ""}  col-lg-3 col-md-6 text-start mb-2 `}
                                id="Address"
                                onClick={() => AccountShow('Address')}>
                                <Link to="#">
                                    <div className="iq-icon me-3">
                                        <svg
                                            className="icon-20 svg-icon"
                                            width="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                opacity="0.4"
                                                d="M8.23918 8.70907V7.36726C8.24934 5.37044 9.92597 3.73939 11.9989 3.73939C13.5841 3.73939 15.0067 4.72339 15.5249 6.19541C15.6976 6.65262 16.2057 6.89017 16.663 6.73213C16.8865 6.66156 17.0694 6.50253 17.171 6.29381C17.2727 6.08508 17.293 5.84654 17.2117 5.62787C16.4394 3.46208 14.3462 2 11.9786 2C8.95048 2 6.48126 4.41626 6.46094 7.38714V8.91084L8.23918 8.70907Z"
                                                fill="currentColor"
                                            ></path>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.7688 8.71118H16.2312C18.5886 8.71118 20.5 10.5808 20.5 12.8867V17.8246C20.5 20.1305 18.5886 22.0001 16.2312 22.0001H7.7688C5.41136 22.0001 3.5 20.1305 3.5 17.8246V12.8867C3.5 10.5808 5.41136 8.71118 7.7688 8.71118ZM11.9949 17.3286C12.4928 17.3286 12.8891 16.941 12.8891 16.454V14.2474C12.8891 13.7703 12.4928 13.3827 11.9949 13.3827C11.5072 13.3827 11.1109 13.7703 11.1109 14.2474V16.454C11.1109 16.941 11.5072 17.3286 11.9949 17.3286Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </div>{" "}
                                    <span className="dark-wizard">Address</span>
                                </Link>
                            </li>
                            <li className={`${show === "Banking" ? " active" : ""} mb-2 col-lg-3 col-md-6 text-start`}
                                id="Timing"
                                onClick={() => AccountShow('Banking')}
                            >
                                <Link to="#">
                                    <div className="iq-icon me-3">
                                        <svg
                                            className="icon-20"
                                            width="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M11.997 15.1746C7.684 15.1746 4 15.8546 4 18.5746C4 21.2956 7.661 21.9996 11.997 21.9996C16.31 21.9996 19.994 21.3206 19.994 18.5996C19.994 15.8786 16.334 15.1746 11.997 15.1746Z"
                                                fill="currentColor"
                                            ></path>
                                            <path
                                                opacity="0.4"
                                                d="M11.9971 12.5838C14.9351 12.5838 17.2891 10.2288 17.2891 7.29176C17.2891 4.35476 14.9351 1.99976 11.9971 1.99976C9.06008 1.99976 6.70508 4.35476 6.70508 7.29176C6.70508 10.2288 9.06008 12.5838 11.9971 12.5838Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </div>{" "}
                                    <span className="dark-wizard">Banking</span>
                                </Link>
                            </li>
                            <li className={`${show === "Security" ? " active" : ""} mb-2 col-lg-3 col-md-6 text-start`}
                                id="Security"
                                onClick={() => AccountShow('Security')}
                            >
                                <Link to="#">
                                    <div className="iq-icon me-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="icon-20"
                                            width="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M16.71 10.0721C16.71 10.5716 17.11 10.9711 17.61 10.9711C18.11 10.9711 18.52 10.5716 18.52 10.0721C18.52 9.57269 18.11 9.16315 17.61 9.16315C17.11 9.16315 16.71 9.57269 16.71 10.0721ZM14.77 16.1054C14.06 16.8146 13.08 17.2542 12 17.2542C10.95 17.2542 9.97 16.8446 9.22 16.1054C8.48 15.3563 8.07 14.3774 8.07 13.3285C8.06 12.2897 8.47 11.3108 9.21 10.5616C9.96 9.81243 10.95 9.40288 12 9.40288C13.05 9.40288 14.04 9.81243 14.78 10.5516C15.52 11.3008 15.93 12.2897 15.93 13.3285C15.92 14.4173 15.48 15.3962 14.77 16.1054ZM12 10.9012C11.35 10.9012 10.74 11.1509 10.27 11.6204C9.81 12.0799 9.56 12.6892 9.57 13.3185V13.3285C9.57 13.9778 9.82 14.5871 10.28 15.0466C10.74 15.5061 11.35 15.7558 12 15.7558C13.34 15.7558 14.42 14.667 14.43 13.3285C14.43 12.6792 14.18 12.0699 13.72 11.6104C13.26 11.1509 12.65 10.9012 12 10.9012Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                opacity="0.4"
                                                d="M17.44 6.2364L17.34 6.01665C17.07 5.44728 16.76 4.78801 16.57 4.40844C16.11 3.50943 15.32 3.00999 14.35 3H9.64C8.67 3.00999 7.89 3.50943 7.43 4.40844C7.23 4.80799 6.89 5.52719 6.61 6.11654L6.55 6.2364C6.52 6.31632 6.44 6.35627 6.36 6.35627C3.95 6.35627 2 8.3141 2 10.7114V16.6448C2 19.0422 3.95 21 6.36 21H17.64C20.04 21 22 19.0422 22 16.6448V10.7114C22 8.3141 20.04 6.35627 17.64 6.35627C17.55 6.35627 17.48 6.30633 17.44 6.2364Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </div>{" "}
                                    <span className="dark-wizard">Security</span>
                                </Link>
                            </li>
                        </ul>
                        <fieldset className={`${show === "Profile" ? "d-block" : "d-none"}`}>
                            <Form validated={validated} onSubmit={(e) => handleSubmit(e)} className="needs-validation" noValidate>
                                <div className="form-card text-start">
                                    <div className="row">
                                        <Form.Group className="col-md-6 form-group">
                                            <Form.Label htmlFor="fname">Name:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="fname"
                                                placeholder="Name"
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-6  form-group">
                                            <Form.Label htmlFor="mobno">Mobile Number:</Form.Label>
                                            <Form.Control
                                                type="number"
                                                id="mobno"
                                                placeholder="Mobile Number"
                                                onChange={(e) => setNumber(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-6 form-group">
                                            <Form.Label htmlFor="lname">Organisation:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="lname"
                                                placeholder="Organisation"
                                                onChange={(e) => setOrganisation(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-6  form-group">
                                            <Form.Label htmlFor="altconno">
                                                Alternate Contact:
                                            </Form.Label>
                                            <Form.Control
                                                type="number"
                                                id="altconno"
                                                placeholder="Alternate Contact"
                                                onChange={(e) => setAltNumber(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group className="col-md-6  form-group">
                                            <Form.Label htmlFor="altconno">GST / VAT Tax:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                id="altconno"
                                                placeholder="GST / VAT Tax"
                                                onChange={(e) => setTaxNumber(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    name=""
                                    className="action-button float-end"
                                    value=""
                                >
                                    Save
                                </Button>
                            </Form>
                        </fieldset>
                        <fieldset className={`${show === "Address" ? "d-block" : "d-none"}`}>
                            <div className="form-card text-start">
                                <div className="row">
                                    <Form.Group className="col-md-12 form-group">
                                        <Form.Label htmlFor="pno">Full Address:</Form.Label>
                                        <Form.Control as="textarea" rows={3} />
                                    </Form.Group>
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="pno">Pin Code:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            id="pno"
                                            placeholder="Pin Code"
                                            onChange={(e) => setPincode(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">State: *</label>
                                            <Select
                                                options={states}
                                                styles={customStyles}
                                                onChange={(e) => setState(e)}
                                                value={state ? state : ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="form-label">City/Town: *</label>
                                            <Select
                                                options={cities}
                                                styles={customStyles}
                                                onChange={(e) => setCity(e)}
                                                value={city}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="button"
                                name="next"
                                className="next action-button float-end"
                                value="Next"
                                onClick={() => AccountShow("Timing")}
                            >
                                Save
                            </Button>
                        </fieldset>
                        <fieldset className={`${show === "Banking" ? "d-block" : "d-none"}`}>
                            <div className="form-card text-start">
                                <div className="row">
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="add1">Bank Name:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="add1"
                                            placeholder="Bank Name"
                                            onChange={(e) => setBankName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="add2">Bank IFSC Code:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="add2"
                                            placeholder="Bank IFSC Code"
                                            onChange={(e) => setBankIfsc(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="cname">Branch Name:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="cname"
                                            placeholder="Branch Name"
                                            onChange={(e) => setBankBranch(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="cname">Account Number:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            id="cname"
                                            placeholder="Account Number"
                                            onChange={(e) => setBankNumber(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="cname">MICR / Swift Code:</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="cname"
                                            placeholder="MICR / Swift Code"
                                            onChange={(e) => setBankMicr(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <Button
                                type="button"
                                name="next"
                                className="next action-button float-end"
                                value="Next"
                                onClick={() => AccountShow("Timing")}
                            >
                                Save
                            </Button>
                        </fieldset>
                        <fieldset className={`${show === "Security" ? "d-block" : "d-none"}`}>
                            <div className="form-card text-start">
                                <div className="row">
                                    <Form.Group className="col-md-4  form-group">
                                        <Form.Label htmlFor="email">Email:</Form.Label>
                                        <Form.Control
                                            type="email"
                                            id="email"
                                            placeholder="Email"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="pass">Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="pass"
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="col-md-4 form-group">
                                        <Form.Label htmlFor="rpass">Confirm Password:</Form.Label>
                                        <Form.Control
                                            type="password"
                                            id="rpass"
                                            placeholder="Confirm Password"
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="mt-3">
                                <Button
                                    type="button"
                                    name="next"
                                    className="next action-button float-end"
                                    value="Next"
                                    onClick={() => AccountShow("Timing")}
                                >
                                    Save
                                </Button>
                            </div>
                        </fieldset>
                        {/* </Form> */}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default NewUserWizard;
