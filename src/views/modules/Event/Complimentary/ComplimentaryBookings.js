import React, { useState, memo, Fragment, useEffect, useRef } from "react";
import { Button, Row, Col, Card, Modal, Form, Fade, Table } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import QRGenerator from "../Events/Tickets/QRGenerator";
import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import generateQRCodeZip from "../Events/Tickets/generateQRCodeZip";
import SendTickets from "./SendTickets";
import CommonEventAccordion from "../CustomHooks/CommonEventAccordion";
import { FaFileExcel } from "react-icons/fa";
import CountUp from "react-countup";
const ComplimentaryBookings = memo(() => {
    const { api, UserData, ErrorAlert, authToken, successAlert, systemSetting, loader } = useMyContext();

    const [tickets, setTickets] = useState([]);
    const [showExistDataModal, setShowExistDataModal] = useState(false);
    const [data, setData] = useState([]);
    const [existData, setExistData] = useState([]);
    const [number, setNumber] = useState('');
    const [selectedTicketID, setSelectedTicketID] = useState(null);
    const [dataType, setDataType] = useState(false);
    // make disable state
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([])
    const fileInputRef = useRef(null);

    useEffect(() => {
        const accordionButton = document.querySelector('.accordion-button');
        if (accordionButton) {
            accordionButton.style.backgroundColor = 'transparent';
        }
    }, []);


    const getTicketData = async (id) => {
        if (!isNaN(id)) {
            await axios.get(`${api}ticket-info/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            }).then((res) => {
            }).catch((err) => { })
        }
    }

    //qr
    const handleZip = () => {
        showLoading()
        generateZip()
    }

    const generateZip = async () => {
        await generateQRCodeZip({
            bookings,
            QRGenerator: QRGenerator,
            loader: loader
        });
    };

    const showLoading = (progress = 0) => {
        return Swal.fire({
            title: "Processing",
            text: progress === 0 ? "Processing will start soon. Please wait..." : "Processing...",
            html: `
                <div style="text-align: center;">
                    <img src=${loader} style="width: 10rem; display: block; margin: 0 auto;"/>
                </div>
            `,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            customClass: {
                htmlContainer: 'swal2-html-container-cutom'
            },

        });
    };
    //     <div class="spinner-border text-primary mt-4" role="status">
    //     <span class="visually-hidden">Loading...</span>
    // </div>
    const handleChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d*$/?.test(value)) {
            const numericValue = Number(value);
            if (numericValue <= 1000) {
                setNumber(value);
                setDisable(value === '' || value === '0');
            } else {
                setNumber('')
                ErrorAlert('Oops! You can create a maximum 1000 bookings');
            }
        }
    };
    // make function reset bookings 
    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    const resetBookings = () => {
        setBookings([])
        setData([])
        setDisable(true)
    }
    const HandleTicket = (id) => {
        resetBookings()

        setDataType(false)
        setSelectedTicketID(id)
        getTicketData(id)
    }
    const handleSwitchChange = (e) => {
        resetBookings()
        setDataType(e.target.checked)
    }

    const [showModal, setShowModal] = useState(false);
    const [duplicateData, setDuplicateData] = useState([]);

    const handleFileChange = (event) => {
        resetBookings()
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const loadingAlert = showLoader(0, "Verifying Excel file...");
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const range = XLSX.utils.decode_range(worksheet['!ref']);

                const processedData = [];

                for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
                    const row = [];
                    for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
                        const cellAddress = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
                        const cell = worksheet[cellAddress];
                        row.push(cell ? cell.v : undefined);
                    }
                    if (row[1] && row[2]) {
                        processedData.push({
                            name: row[0] || '',
                            email: row[1],
                            number: row[2],
                            token: row[3],
                            rowIndex: rowNum + 1,
                        });
                    }
                }
                if (!processedData || processedData?.length === 0) {
                    ErrorAlert('The Excel file is empty.');
                    resetFileInput()
                    return;
                }

                try {
                    // Validate each row
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    const emailMap = new Map();
                    const duplicates = [];
                    processedData?.forEach((item, index) => {
                        // Validate email
                        if (!emailRegex.test(item?.email)) {
                            throw new Error(`Row ${index + 1}: Invalid email address: ${item?.email}`);
                        }

                        // Validate number
                        if (isNaN(Number(item?.number))) {
                            throw new Error(`Row ${index + 1}: Invalid number: ${item?.number}`);
                        }
                        if (emailMap?.has(item?.email)) {
                            duplicates?.push({
                                ...item,
                                duplicateRows: [emailMap.get(item?.email), item?.rowIndex],
                            });
                        } else {
                            emailMap.set(item.email, item.rowIndex);
                        }
                    });
                    if (duplicates?.length > 0) {
                        setDuplicateData(duplicates);
                        setShowModal(true);
                        resetFileInput()
                    } else {
                        const attendeeValidation = systemSetting?.complimentary_attendee_validation === 1
                        if (attendeeValidation) {
                            checkUser(processedData, loadingAlert)
                        } else {
                            setData(processedData);
                            successAlert('File Imported', `${processedData?.length} Attendees Detected successfully`);
                            setDisable(false)
                        }
                    }
                } catch (error) {
                    resetFileInput()
                    ErrorAlert(error.message);
                } finally {
                    loadingAlert.close();
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const showLoader = (progress = 0, title) => {
        return Swal.fire({
            title: title,
            html: `
                <div style="text-align: center;">
                    <img src=${loader} style="width: 10rem; display: block; margin: 0 auto;"/>
                    <div class="spinner-border text-primary mt-4" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            customClass: {
                htmlContainer: 'swal2-html-container-cutom'
            },
        });
    };


    const checkUser = async (data, loadingAlert) => {
        try {
            const response = await axios.post(`${api}complimentary-booking/check/users`, {
                users: data
            }, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });

            if (response.data.status) {
                let res = response.data?.results
                if (res?.length > 0) {
                    resetFileInput()
                    setShowExistDataModal(true)
                    setExistData(res);
                } else {
                    setData(data);
                    setDisable(false)
                }
            } else {
            }
        } catch (error) {
            ErrorAlert('An error occurred while checking user booking.');
        } finally {
            loadingAlert.close();
        }
    };
    const onHide = () => {
        setShowExistDataModal(false);
    }

    const handleSubmit = async () => {
        setLoading(true);
        let ticketData = tickets?.find((item) => parseInt(item?.id) === parseInt(selectedTicketID));

        if (!ticketData) {
            ErrorAlert('Please Select Event/Ticket First');
            return;
        }

        const loadingAlert = showLoading();
        let requestData = {
            user_id: UserData.id,
            payment_method: 'offline',
            ticket_id: ticketData.id
        };

        if (dataType) {
            requestData.user = data;
            requestData.quantity = data.length;
        } else {
            requestData.number = UserData.number;
            requestData.email = UserData.email;
            requestData.name = UserData.name;
            requestData.quantity = number;
        }

        try {
            let res = await DynamicApiRequest(dataType, requestData);

            if (res.data.status) {
                let allBookings = res.data?.bookings?.map((item) => ({
                    token: item?.token,
                    name: item?.name,
                    email: item?.email,
                    number: item?.number,
                }));

                setBookings(allBookings);
                successAlert('Booking Success', 'Complimentary Booking Created Successfully');
            }

        } catch (err) {
            ErrorAlert('Something went wrong');
        } finally {
            setLoading(false);
            loadingAlert.close();
            Swal.fire({
                title: 'Bookings Success!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };


    const DynamicApiRequest = async (type, requestData) => {
        const endpoint = type ? 'complimentary-booking' : 'complimentary-booking-store';
        const res = await axios.post(`${api}${endpoint}`, requestData, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        });
        return res;
    }

    return (
        <Fragment>
            <Modal show={showExistDataModal} onHide={onHide} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Existing Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Number</th>
                                    <th>Email Exists</th>
                                    <th>Number Exists</th>
                                </tr>
                            </thead>
                            <tbody>
                                {existData?.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data?.email}</td>
                                        <td>{data?.number}</td>
                                        <td>{data?.email_exists ? 'Yes' : 'No'}</td>
                                        <td>{data?.number_exists ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    {existData.length > 10 && ( // Show a message if there are more than 10 entries
                        <div className="text-center mt-2">
                            <span>{existData.length - 10} more entries...</span>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* print model end */}
            <Modal show={showModal} onClick={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Duplicate Emails Found</Modal.Title>
                    <p>The following emails appear in multiple rows:</p>
                </Modal.Header>
                <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
                    <Modal.Body>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Duplicate Rows</th>
                                </tr>
                            </thead>
                            <tbody>
                                {duplicateData?.map((dup, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{dup.email}</td>
                                        <td>{dup.duplicateRows.join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                </div>
                <Modal.Footer>
                    <p className="text-danger">
                        Please fix the duplicates and re-upload the file.
                    </p>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <CommonEventAccordion showLoader={showLoader} setTickets={setTickets} setSelectedTicketID={setSelectedTicketID} />
            {tickets?.length > 0 && (
                <Fade in={tickets?.length > 0}>
                    <Row>
                        <Col lg="12">
                            <div className="">
                                <Row>
                                    <Col>
                                        <Card className="card-block card-stretch card-height">
                                            <Card.Header className="h5">Complimentary Bookings</Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Form.Group className="col-md-2 form-group">
                                                        <Form.Label>Select Category:</Form.Label>
                                                        <Form.Select
                                                            required
                                                            value={selectedTicketID}
                                                            onChange={(e) => HandleTicket(e.target.value)}
                                                        >
                                                            <option value={null}>Select</option>
                                                            {
                                                                tickets?.map((item, index) => (
                                                                    <option value={item?.id} key={index}>{item?.name}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                        <Form.Control.Feedback type="invalid">Please Select Category</Form.Control.Feedback>
                                                    </Form.Group>
                                                    {selectedTicketID && (
                                                        <>
                                                            <Form.Group className="col-md-2 form-group">
                                                                <Form.Label htmlFor="ticketSwitch">Select Option:</Form.Label>
                                                                <Form.Check
                                                                    type="switch"
                                                                    id="ticketSwitch"
                                                                    label="Import From Excel"
                                                                    checked={dataType}
                                                                    onChange={handleSwitchChange}
                                                                />
                                                                {
                                                                    !(data?.length > 0) &&
                                                                    <div className="text-secondary">Enable for Excel import data.</div>
                                                                }
                                                            </Form.Group>
                                                            {dataType ? (
                                                                <>
                                                                    <Form.Group className="col-md-2 form-group">
                                                                        <Form.Label htmlFor="fileInput">Select File:</Form.Label>
                                                                        <Form.Control
                                                                            type="file"
                                                                            id="fileInput"
                                                                            accept=".xls,.xlsx"
                                                                            ref={fileInputRef}
                                                                            onChange={handleFileChange}
                                                                        />
                                                                        {
                                                                            !(data?.length > 0) && bookings?.length === 0 &&
                                                                            <div className="text-secondary">❕ Please upload an Excel file.</div>
                                                                        }
                                                                    </Form.Group>
                                                                    {data?.length > 0 ?
                                                                        (
                                                                            <Form.Group className="col-md-2 form-group">
                                                                                <Form.Label htmlFor="downloadButton">Imported Data Overview:</Form.Label> <br />
                                                                                <h4 className="counter">
                                                                                    <CountUp
                                                                                        start={0}
                                                                                        end={data?.length}
                                                                                        duration={3}
                                                                                        separator=""
                                                                                        decimals={0}
                                                                                    />
                                                                                    {' '}Attendees
                                                                                </h4>
                                                                            </Form.Group>
                                                                        )
                                                                        :
                                                                        (
                                                                            <Form.Group className="col-md-2 form-group">
                                                                                <Form.Label htmlFor="downloadButton">Download Sample File:</Form.Label> <br />
                                                                                <a className="text-muted h3" href='https://server.getyourticket.in/uploads/demo.xlsx' download>
                                                                                    <FaFileExcel />
                                                                                </a>
                                                                            </Form.Group>
                                                                        )
                                                                    }
                                                                    {
                                                                        bookings?.length > 0 && (
                                                                            <Form.Group className="col-md-2 form-group">
                                                                                <SendTickets bookings={bookings} />
                                                                            </Form.Group>
                                                                        )
                                                                    }
                                                                </>
                                                            ) : (
                                                                <Form.Group className="col-md-2 form-group">
                                                                    <Form.Label htmlFor="fname">Total Ticket:</Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        id="fname"
                                                                        placeholder=""
                                                                        required
                                                                        value={number}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <div className="text-secondary">❕ Max 1000 tickets allowed.</div>

                                                                </Form.Group>
                                                            )}

                                                            <Form.Group className="col-md-2 form-group">
                                                                <Form.Label>&nbsp;</Form.Label>
                                                                {
                                                                    bookings?.length > 0 ?
                                                                        <div className="btn d-flex justify-content-end">
                                                                            <Button variant="btn btn-secondary"
                                                                                disabled={loading}
                                                                                onClick={() => handleZip()}>
                                                                                Download ZIP
                                                                            </Button>
                                                                        </div>
                                                                        :
                                                                        <div className="btn d-flex justify-content-end">
                                                                            <Button disabled={disable} onClick={handleSubmit} variant="btn btn-primary">
                                                                                Submit Booking
                                                                            </Button>
                                                                        </div>
                                                                }
                                                            </Form.Group>

                                                        </>
                                                    )}
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                    </Row>
                </Fade>
            )}
        </Fragment >
    );
});

ComplimentaryBookings.displayName = "ComplimentaryBookings";
export default ComplimentaryBookings;
