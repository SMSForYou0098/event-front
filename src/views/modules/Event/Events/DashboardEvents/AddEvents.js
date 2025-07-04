import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Image, Modal, Form, Button, InputGroup, Alert } from "react-bootstrap";
import Card from "../../../../../components/bootstrap/card";
import { Link, Navigate, useLocation } from "react-router-dom";
import currencyData from '../../../../../JSON/currency.json';
import Flatpickr from "react-flatpickr";
import axios from "axios";
import { Dashboard, Tus, Uppy } from "uppy";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import Select from "react-select";
import * as moment from "moment";
import Swal from "sweetalert2";
import imgsuccess from "../../../../../assets/images/pages/img-success.png";
import EventFormTabs from "./EventComponent/EventFormTabs";
import TimingFieldset from "./EventComponent/Forms/TimingFieldset";
import TicketFieldset from "./EventComponent/Forms/TicketFieldset";

const AddEvent = () => {

    const { api, authToken } = useMyContext();
    let location = useLocation();
    let id = location.state?.id;
    let name = location.state?.name;
    const TaxType = [
        { value: "Inclusive", label: "Inclusive" },
        { value: "Exclusive", label: "Exclusive" },
    ];
    let DefaultMap = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24788.9238267884!2d72.90574674760647!3d22.545584252320303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4c18b7bc839b%3A0x40b6686c1df8e12b!2sSMS%20FOR%20YOU%20-%20Website%20Development%20%7C%20Telecom%20Solutions%20%7C%20Google%20Workspace%20%7C%20Cloud%20Solutions!5e0!3m2!1sen!2sin!4v1717503583176!5m2!1sen!2sin'

    const [show, AccountShow] = useState("Timing");
    const [modelShow, setModelShow] = useState(false);

    const [eventId, setEventId] = useState('');
    const [MainId, setMainID] = useState('');
    // Event states 
    const [dateRange, setDateRange] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [mapCode, setMapCode] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [images, setImages] = useState([]);

    // ticket states 
    const [ticketTitle, setTicketTitle] = useState('');
    const [tickets, setTickets] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [currencyMaster, setCurrencyMaster] = useState([]);
    const [imagepreview, setImagepreview] = useState([]);
    const [currencyIcon, setCurrencyIcon] = useState('');
    const [convertedPrice, setConvertedPrice] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [price, setPrice] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [ticketQuantity, setTicketQuantity] = useState('');
    const [bookingPerCustomer, setBookingPerCustomer] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [taxes, setTaxes] = useState('');
    const [soldOut, setSoldOut] = useState('');
    const [donation, setDonation] = useState('');
    const [ticketTerms, setTicketTerms] = useState('');
    const [saleDate, setSaleDate] = useState('');
    const [backgroundImage, setBackgroundImage] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [eventType, setEventType] = useState('');
    const [sale, setSale] = useState(false);
    const [saleStartDate, setSaleStartDate] = useState('');
    const [saleEndDate, setSaleEndDate] = useState('');


    const [validate, setValidate] = useState({
        form1: true,
        form2: false,
        form3: false,
        form4: false,
        form5: false,
        form6: false,
    });


    const formRef = useRef(null);

    const ErrorAlert = () => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please provide and fill the previous form detail!",
            backdrop: `rgba(60,60,60,0.8)`,
            // footer: '<a href="">Why do I have this issue?</a>',
        });
    }

    useEffect(() => {
        if (id !== undefined) {
            setEventId(id)
        } else {
            <Navigate to={'dashboard/events/new'} />
        }

        const uppy = new Uppy()
            .use(Dashboard, {
                inline: true,
                target: '.file-uploader',
            })
            .use(Tus, { endpoint: 'https://master.tus.io/files/' });

        uppy.on('upload-success', (file) => {
            const image = new window.Image();
            image.src = window.URL.createObjectURL(file.data);
            image.onload = function () {
                if (file &&
                    this.width >= 600 && this.height >= 725
                ) {
                    // Pass the uploaded file to the parent component
                    setThumbnail(file.data)
                } else {
                    // alert('Please upload an image with dimensions of at least 600x725 pixels.');
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Please upload an image with dimensions of 600x725 pixels!",
                        backdrop: `rgba(60,60,60,0.8)`,
                        // footer: '<a href="">Why do I have this issue?</a>',
                    });
                    // Optionally, you can also remove the uploaded file here
                    uppy.removeFile(file.id);
                }
            };
        });


        return () => {
            uppy.close();
        };
    }, []);



    useEffect(() => {
        setCurrencyMaster(currencyData)
        axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`).then((res) => {
            const currencyOptions = Object.keys(res.data.rates).map((cur) => ({
                value: cur,
                label: cur,
            }));
            setCurrencies(currencyOptions);
        }).catch((err) => console.log(err))
    }, [])

    useEffect(() => {
        if (currencyMaster && currency) {
            if (currencyMaster.hasOwnProperty(currency)) {
                let symbol = currencyMaster[currency]?.symbol;
                // console.log(symbol)
                setCurrencyIcon(symbol);
            }
        }
    }, [currencyMaster, currency])

    useEffect(() => {
        if (price) {
            try {
                axios.get(`https://open.er-api.com/v6/latest/${currency}`)
                    .then(response => {
                        const rate = response.data.rates.INR;
                        setConvertedPrice((price * rate).toFixed(2));
                    })
                    .catch(error => {
                        console.log('Error fetching exchange rate in:', error);
                    });
            } catch (err) {
                console.log('Error fetching exchange rate out:', err);
            }
        } else {
            setConvertedPrice('');
        }
    }, [price, currency]);

    const handleInputChange = (event) => {
        const iframeCode = event.target.value;
        const parser = new DOMParser();
        const doc = parser.parseFromString(iframeCode, 'text/html');
        const iframe = doc.querySelector('iframe');
        if (iframe) {
            setMapCode(iframe.src);
        }
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const newImages = [];
        const imageURLs = [];
        const existingImages = new Set(imagepreview); // Use imagepreview to avoid duplicate URLs
        const currentImageCount = images.length;

        for (let i = 0; i < files.length; i++) {
            if (newImages.length + currentImageCount >= 4) break; // Ensure the total number of images does not exceed 4

            const file = files[i];
            newImages.push(file);
            const imageUrl = URL.createObjectURL(file);

            if (!existingImages.has(imageUrl)) {
                imageURLs.push(imageUrl);
                existingImages.add(imageUrl);
            }
        }

        setImages([...images, ...newImages].slice(0, 4)); // Ensure only up to 4 images
        setImagepreview([...imagepreview, ...imageURLs].slice(0, 4)); // Ensure only up to 4 preview URLs
    };

    const handleClose = () => {
        if (formRef.current) {
            formRef.current.reset();
            setCurrency('INR')
            setPrice('')
            setCurrencyIcon('₹')
            setConvertedPrice('')
        }
        setModelShow(false)
    };


    const [validated, setValidated] = useState(false);

    const handleDateChange = (dates) => {
        let formattedDates = [];

        if (dates.length === 1 && moment(dates[0]).isValid()) {
            formattedDates = moment(dates[0]).format('YYYY-MM-DD');
        } else if (dates.length === 2 && moment(dates[0]).isSame(dates[1], 'day')) {
            if (moment(dates[0]).isValid()) {
                formattedDates = [moment(dates[0]).format('YYYY-MM-DD')];
            }
        } else if (dates.length > 1) {
            formattedDates = dates
                .filter(date => moment(date).isValid())
                .map(date => moment(date).format('YYYY-MM-DD'));
        }
        return formattedDates;
    };
    const handleSaleDate = (date, type) => {
        const formattedDate = moment(date[0]).format('YYYY-MM-DD');
        let newStartDate = saleStartDate;
        let newEndDate = saleEndDate;

        if (type === 'start') {
            newStartDate = formattedDate;
        } else if (type === 'end') {
            newEndDate = formattedDate;
        }

        // Ensure the dates are in ascending order
        if (newStartDate && newEndDate) {
            const start = new Date(newStartDate);
            const end = new Date(newEndDate);

            if (start > end) {
                [newStartDate, newEndDate] = [newEndDate, newStartDate];
            }
        }

        setSaleStartDate(newStartDate);
        setSaleEndDate(newEndDate);
    };



    const [editState, setEditState] = useState(false)
    const [ticketData, setTicketData] = useState(false)
    const [ticketBG, setTicketBG] = useState('');
    // seo states 
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [metaTag, setMetaTag] = useState('');

    const SubmitTicket = async (event) => {
        const url = editState ? `${api}update-ticket/${ticketData?.id}` : `${api}create-ticket/${eventId}`
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            const formData = new FormData();
            let datesArray = [];
            if (saleStartDate && saleEndDate) {
                const start = moment(saleStartDate).format('YYYY-MM-DD');
                const end = moment(saleEndDate).format('YYYY-MM-DD');
                datesArray = [start, end].sort((a, b) => new Date(a) - new Date(b));
            }
            formData.append('event_id', eventId);
            formData.append('currency', currency?.value);
            formData.append('price', price);
            formData.append('template_id', templateId);
            formData.append('ticket_title', ticketTitle);
            formData.append('ticket_quantity', ticketQuantity);
            formData.append('booking_per_customer', bookingPerCustomer);
            formData.append('ticket_description', ticketDescription);
            formData.append('taxes', taxes?.value);
            formData.append('ticket_terms', ticketTerms);
            formData.append('background_image', backgroundImage);
            formData.append('sold_out', soldOut);
            formData.append('donation', donation);
            formData.append('sale', sale);
            formData.append('sale_price', salePrice);
            formData.append('ticket_template', templateId);
            formData.append('sale_date', datesArray);

            if (eventId) {
                await axios.post(url, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                }).then((res) => {
                    console.log(res)
                    if (res.data.status) {
                        setTickets(res.data?.tickets)
                        resetFields()
                        setModelShow(false)
                        //AccountShow('Location')
                        //setValidate(prevState => ({ ...prevState, form3: true }));
                    }
                }).catch((err) =>
                    console.log(err)
                )
            }
            setValidated(true);
        }
    };

    const resetFields = () => {
        setEditState(false)
        setTicketData([])
        setTicketData('');
        setTicketTitle('');
        setPrice('');
        setTicketQuantity('');
        setBookingPerCustomer('');
        setTicketDescription('');
        setTaxes(null);
        setSalePrice('');
        setSale(false);
        setSoldOut(false);
        setDonation(false);
        setSaleDate('');
        setSaleEndDate('');
        setCurrency('');
    }

    const UpdateEvent = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {

            const formData = new FormData();
            if (show === 'Timing') {
                formData.append('date_range', handleDateChange(dateRange));
                formData.append('start_time', startTime);
                formData.append('end_time', endTime);
                formData.append('event_type', eventType ? 'season' : 'daily');
            }

            else if (show === 'Ticket') {
                formData.append('ticket_terms', ticketTerms);
                formData.append('ticket_template_id', ticketBG);
            }
            else if (show === 'Location') {
                formData.append('map_code', mapCode);
            }
            else if (show === 'Media') {
                formData.append('name', name);
                formData.append('thumbnail', thumbnail);
                formData.append('youtube_url', youtubeUrl);
                if (images.length > 0) {
                    formData.append('images_1', images[0]);
                    formData.append('images_2', images[1]);
                    formData.append('images_3', images[2]);
                    formData.append('images_4', images[3]);
                }
            } else if (show === 'Media') {
                images.forEach((image, index) => {
                    formData.append(`images[${index}]`, image);
                });
                formData.append('status', 1);
            }
            else {
                formData.append('meta_title', metaTitle);
                formData.append('meta_description', metaDescription);
                formData.append('meta_keyword', keywords);
                formData.append('meta_tag', metaTag);
            }
            if (eventId) {
                await axios.post(`${api}update-event/${eventId}`, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                })
                    .then((res) => {
                        setEventId(res.data.event?.event_key)
                        setMainID(res.data.event?.id)
                        // return
                        if (res.data.status) {
                            if (show === 'Timing') {
                                setValidate(prevState => ({ ...prevState, form1: true }));
                                setValidated(false)
                                AccountShow('Ticket')
                            } else if (show === 'Ticket') {
                                setValidate(prevState => ({ ...prevState, form2: true }));
                                setValidated(false)
                                AccountShow('Location')
                            } else if (show === 'Location') {
                                setValidate(prevState => ({ ...prevState, form3: true }));
                                setValidated(false)
                                AccountShow('Media')
                            } else if (show === 'Media') {
                                setValidate(prevState => ({ ...prevState, form4: true }));
                                setValidated(false)
                                AccountShow('Publish')
                            }
                        }
                    }).catch((err) =>
                        console.log(err)
                    )
            }
            setValidated(true);
        }
    }
    return (
        <Row>
            <Col sm="12" lg="12">

                {/* model  */}
                <Modal
                    className="modal-lg fade"
                    id="add-appointment"
                    data-bs-keyboard="true"
                    tabIndex="-1"
                    aria-hidden="true"
                    show={modelShow}
                    onHide={handleClose}
                    size="xl"
                >
                    <Modal.Header closeButton>
                        <Modal.Title as="h5">
                            {editState ? `Edit  ` : `Add `}Ticket
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form validated={validated} onSubmit={SubmitTicket} className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Title</Form.Label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="event_name"
                                            placeholder=""
                                            value={ticketTitle}
                                            onChange={(e) => setTicketTitle(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Currency: *</label>
                                        <Select
                                            options={currencies}
                                            // value={currency}
                                            className="js-choice"
                                            select="one"
                                            onChange={(e) => setCurrency(e.label)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label className="custom-file-input">Price</Form.Label>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Text>{currencyIcon}</InputGroup.Text>
                                            <Form.Control type="number" aria-label="" value={price} onChange={(e) => setPrice(e.target.value)} />
                                        </InputGroup>
                                    </Form.Group>
                                </div>
                                {currency !== 'INR' &&
                                    <div className="col-md-4">
                                        <Form.Group className="mb-3 form-group">
                                            <Form.Label className="custom-file-input">Convert price to INR</Form.Label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name=""
                                                value={convertedPrice}
                                                disabled
                                            />
                                            <span className="text-grey fw-light fs-6 opacity-50">*ignore if your selected currency is INR</span>
                                        </Form.Group>
                                    </div>
                                }
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Total Ticket Quantity: *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="ticket quantity"
                                            value={ticketQuantity}
                                            placeholder=""
                                            onChange={(e) => setTicketQuantity(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="form-label">Booking Limit Per Customer: *</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="Booking Limit Per Customer"
                                            placeholder=""
                                            value={bookingPerCustomer}
                                            onChange={(e) => setBookingPerCustomer(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label className="form-label">Description: *</label>
                                        <textarea
                                            rows={2}
                                            className="form-control"
                                            name="Description"
                                            placeholder=""
                                            value={ticketDescription}
                                            onChange={(e) => setTicketDescription(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">Tax Type: *</label>
                                        <Select
                                            options={TaxType}
                                            value={taxes}
                                            select="one"
                                            onChange={(e) => setTaxes(e.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label className="form-label">Promocodes: *</label>
                                        <Select
                                            options={TaxType}
                                            select="one"
                                            onChange={(promocode) => setTicketDescription(promocode.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label className="form-label">Sale: *</label>
                                        <Form.Check className="form-switch">
                                            <Form.Check.Input
                                                type="checkbox"
                                                className="me-2"
                                                checked={sale}
                                                onChange={(e) => setSale(e.target.checked)}
                                            />
                                            <Form.Check.Label htmlFor="sale">
                                                Sale
                                            </Form.Check.Label>
                                        </Form.Check>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Sold Out: *</label>
                                    <Form.Group className="form-group">
                                        <Form.Check className="form-switch">
                                            <Form.Check.Input
                                                type="checkbox"
                                                className="me-2"
                                                id="flexSwitchCheckDefault"
                                                value={soldOut}
                                            />
                                            <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                                                Sold Out
                                            </Form.Check.Label>
                                        </Form.Check>
                                    </Form.Group>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Donation: *</label>
                                    <Form.Group className="form-group">
                                        <Form.Check className="form-switch">
                                            <Form.Check.Input
                                                type="checkbox"
                                                className="me-2"
                                                value={donation}
                                                id="flexSwitchCheckDefault"
                                            />
                                            <Form.Check.Label htmlFor="flexSwitchCheckDefault">
                                                Donation
                                            </Form.Check.Label>
                                        </Form.Check>
                                    </Form.Group>
                                </div>
                                {(sale || ticketData.sale === 'true') &&
                                    <>
                                        <div className="col-md-12 mb-2">
                                            <Alert variant="success" role="alert">
                                                <p className="m-0"> Enter Sale Start-End Date & Sale Price to make this Ticket on sale.</p>
                                            </Alert>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Sale Start Date : *</label>
                                                <div className="form-group">
                                                    <Flatpickr
                                                        options={{ minDate: 'today' }}
                                                        className="form-control flatpickrdate"
                                                        placeholder="Select Date..."
                                                        value={saleDate}
                                                        onChange={(date) => handleSaleDate(date, 'start')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Sale End Date : *</label>
                                                <div className="form-group">
                                                    <Flatpickr
                                                        options={{ minDate: 'today' }}
                                                        className="form-control flatpickrdate"
                                                        placeholder="Select Date..."
                                                        value={saleEndDate}
                                                        onChange={(date) => handleSaleDate(date, 'end')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label className="form-label">Sale Price: *</label>
                                                <div className="form-group">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="ticket quantity"
                                                        placeholder=""
                                                        value={salePrice}
                                                        onChange={(e) => setSalePrice(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="row">

                                <div className="col-md-12">
                                    <div className="mt-3">
                                        <Button
                                            type="submit"
                                            name=""
                                            className="action-button float-end"
                                            value=""
                                        // onClick={() => AccountShow("Timing")}
                                        >
                                            {editState ? `Update  ` : `Save `}
                                        </Button>
                                        <Button className="action-button float-end me-3" variant="danger" onClick={handleClose}>
                                            Discard
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
                {/* end model  */}

                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                            <h4 className="card-title">Add New Event</h4>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <EventFormTabs validate={validate} show={show} AccountShow={AccountShow} ErrorAlert={ErrorAlert} isNew={true} />

                        <TimingFieldset
                            validated={validated}
                            UpdateEvent={UpdateEvent}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            startTime={startTime}
                            setStartTime={setStartTime}
                            endTime={endTime}
                            setEndTime={setEndTime}
                            eventType={eventType}
                            setEventType={setEventType}
                            show={show}
                            handleDateChange={handleDateChange}
                        />
                        <TicketFieldset
                            validated={validated}
                            UpdateEvent={UpdateEvent}
                            MainId={MainId}
                            name={name}
                            ticketTerms={ticketTerms}
                            setTicketTerms={setTicketTerms}
                            ticketBG={ticketBG}
                            setTicketBG={setTicketBG}
                            show={show}
                            AccountShow={AccountShow}
                        />
                        <fieldset className={`${show === "Location" ? "d-block" : "d-none"}`}>
                            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                                <div className="form-card text-start">
                                    <div className="row">
                                        <div className="mt-3">
                                            <Button
                                                type="submit"
                                                name=""
                                                className="action-button float-end"
                                                value=""
                                            // onClick={() => AccountShow("Timing")}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-group">
                                                <label className="form-label">Your google map embed code: *</label>
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    name="event_name"
                                                    placeholder={`Your google map iframe, Ex : <iframe src=https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1302.810382807851!2d72.9269907678651!3d22.545260213329744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4c18b7bc839b%3A0x40b6686c1df8e12b!2sSMS%20FOR%20YOU%20-%20Website%20Development%20%7C%20Telecom%20Solutions%20%7C%20Google%20Workspace%20%7C%20Cloud%20Solutions!5e0!3m2!1sen!2sin!4v1717566004085!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <iframe
                                                className="w-100"
                                                title="map"
                                                src={DefaultMap}
                                                height="500"
                                                allowFullScreen=""
                                                loading="lazy"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </fieldset>
                        <fieldset className={`${show === "Media" ? "d-block" : "d-none"}`}>
                            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                                <div className="form-card text-start">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <Form.Group className="mb-3 form-group">
                                                <Form.Label className="custom-file-input">Thumbnail Image</Form.Label>
                                                <div className="file-uploader"></div>
                                                <span>Upload 16:9 ratio thumbnail image of atleast 600x725 px (jpg/jpeg/png)</span>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <Form.Group className="mb-3 form-group">
                                                        <Form.Label className="custom-file-input">Images Gallery</Form.Label>
                                                        <Form.Control type="file" id="customFile" multiple onChange={handleImageChange} />
                                                    </Form.Group>
                                                </div>
                                                {imagepreview.length > 0 ?
                                                    imagepreview?.map((imageUrl, index) => (
                                                        <div className="col-md-3" key={index}>
                                                            <Form.Group className="mb-3 form-group">
                                                                <Form.Label className="custom-file-input">Image {index + 1}</Form.Label>
                                                                <div className="image">
                                                                    <span className="position-relative top-0 start-100 translate-middle p-1 px-2 bg-danger rounded-circle text-white">
                                                                        x
                                                                        <span className="visually-hidden">
                                                                            unread messages
                                                                        </span>
                                                                    </span>
                                                                    <Image src={imageUrl} alt={`Image ${index + 1}`} className="img-fluid w-100" />
                                                                </div>
                                                            </Form.Group>
                                                        </div>
                                                    ))
                                                    :
                                                    <>
                                                        {[...Array(4)].map((_, index) => (
                                                            <div className="col-md-3" key={index}>
                                                                <Form.Group className="mb-3 form-group">
                                                                    <Form.Label className="custom-file-input">Image {index + 1}</Form.Label>
                                                                    <Image src={`https://placehold.co/200x200`} alt={`Barcode ${index + 1}`} className="img-fluid w-100" />
                                                                </Form.Group>
                                                            </div>
                                                        ))}
                                                    </>
                                                }

                                                <div className="col-md-12">
                                                    <div className="form-group">
                                                        <label className="form-label">YouTube Video URL (Optional): *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="yt"
                                                            placeholder="https://www.youtube.com/watch?v=Zjq1zRWpcgs"
                                                            onChange={(e) => setYoutubeUrl(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-12">
                                                    <div className="mt-3">
                                                        <Button
                                                            type="submit"
                                                            name=""
                                                            className="action-button "
                                                            value=""
                                                        // onClick={() => AccountShow("Timing")}
                                                        >
                                                            Publish
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </Form>
                        </fieldset>
                        <fieldset className={`${show === "Publish" ? "d-block" : "d-none"}`}>
                            <div className="form-card">
                                <h2 className="text-success text-center">
                                    <strong>You Have Successfully Created Event !</strong>
                                </h2>
                                <br />
                                <div className="row justify-content-center">
                                    <div className="col-3">
                                        <div className="d-flex justify-content-center align-items-center flex-column">
                                            <Image
                                                src={imgsuccess}
                                                className="img-fluid"
                                                alt="fit-image"
                                                width={200}
                                            />{" "}
                                            <Link to={`/events/${(name)?.replace(/\s+/g, '-')}/${id}`} className="btn btn-secondary mt-3">View Event</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default AddEvent;
