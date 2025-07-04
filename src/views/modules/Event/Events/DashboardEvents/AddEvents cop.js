import React, { useEffect, useRef, useState } from "react";

//react-bootstrap
import { Row, Col, Image, Modal, Form, Button, InputGroup, Alert, Table } from "react-bootstrap";
//components
import Card from "../../../../../components/bootstrap/card";
//router
import { Link, Navigate, useLocation } from "react-router-dom";
import currencyData from '../../../../../JSON/currency.json';
// img
import Flatpickr from "react-flatpickr";
import axios from "axios";
import { Dashboard, Tus, Uppy } from "uppy";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import Select from "react-select";
import * as moment from "moment";
import Swal from "sweetalert2";

// img
import imgsuccess from "../../../../../assets/images/pages/img-success.png";
import EventFormTabs from "./EventComponent/EventFormTabs";
import TimingFieldset from "./EventComponent/Forms/TimingFieldset";

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
    const [templateShow, setTemplateShow] = useState(false);
    const [eventId, setEventId] = useState('');
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

    //refs
    const canvasRef = useRef(null);
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
                    console.log(file.data)
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
    function HandleEditTicket(id) {
        let data = tickets?.find((item) => item?.id === id)

        setTicketData(data)
        setTicketTitle(data?.name)
        setPrice(data?.price)
        setTicketQuantity(data?.ticket_quantity)
        setBookingPerCustomer(data?.booking_per_customer)
        setTicketDescription(data?.description)
        setTaxes(TaxType.find((item) => item?.value === data?.taxes))
        setSalePrice(data?.sale_price)
        setSale(data?.sale === 'true' ? true : false)
        setSoldOut(data?.sold_out === 'true' ? true : false)
        setDonation(data?.donation === 'true' ? true : false)
        if (data?.sale === 'true') {
            const [startDate, endDate] = data.sale_date?.split(',');
            if (startDate) {
                const start = new Date(startDate);
                setSaleDate(start);
            }
            if (endDate) {
                const end = new Date(endDate);
                setSaleEndDate(end);
            }
        }
        setCurrency(currencies.find((item) => item?.value === data?.currency))
        setEditState(true)
        setModelShow(true)
    }
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
    const HandleDeleteTicket = () => {

    }
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
            }else if (show === 'Media') {
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
                                            <Form.Label className="custom-file-input">Conver price to INR</Form.Label>
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
                        {/* <fieldset className={`${show === "Timing" ? "d-block" : "d-none"}`}>
                            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                                <div className="form-card text-start">
                                    <Row>
                                        <Col md={4}>
                                            <div className="form-group">
                                                <label className="form-label">Event Date Range: *</label>
                                                <div className="form-group">
                                                    <Flatpickr
                                                        options={{ minDate: 'today', mode: 'range' }}
                                                        className="form-control flatpickrdate"
                                                        placeholder="Select Date... "
                                                        value={dateRange}
                                                        onChange={(date) => handleDateChange(date)}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="form-group">
                                                <label className="form-label">Event Start Time: *</label>
                                                <div className="form-group">
                                                    <Flatpickr
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        className="form-control flatpickrtime"
                                                        placeholder="Select Time "
                                                        value={startTime}
                                                        onChange={(time) => setStartTime(time[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={4}>
                                            <div className="form-group">
                                                <label className="form-label">Event End Time: *</label>
                                                <div className="form-group">
                                                    <Flatpickr
                                                        options={{
                                                            enableTime: true,
                                                            noCalendar: true,
                                                            dateFormat: 'H:i',
                                                        }}
                                                        className="form-control flatpickrtime"
                                                        placeholder="Select Time "
                                                        value={endTime}
                                                        onChange={(time) => setEndTime(time[0].toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                        {(dateRange && dateRange?.length > 1) &&
                                            <Col md={4}>
                                                <Form.Group className="form-group">
                                                    <Form.Label className="custom-file-input">&nbsp;</Form.Label>
                                                    <div className="d-flex gap-4">
                                                        <Form.Check className="ps-2">
                                                            <Form.Check.Label>
                                                                Daily
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                        <Form.Check className="form-switch">
                                                            <Form.Check.Input
                                                                type="checkbox"
                                                                className="me-2"
                                                                //value="season"
                                                                onChange={(e) => setEventType(e.target.checked)}
                                                            />
                                                            <Form.Check.Label htmlFor="Season">
                                                                Season
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        }
                                    </Row>
                                </div>

                                <Button
                                    type="submit"
                                    name=""
                                    className="action-button float-end"
                                    value=""
                                // onClick={() => HandleFormChange("Timing")}
                                >
                                    Next
                                </Button>
                            </Form>
                        </fieldset> */}
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
                        <fieldset className={`${show === "Ticket" ? "d-block" : "d-none"}`}>
                            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                                <div className="form-card text-start">
                                    <Row>
                                        <Col md={5} className="mb-3">
                                            <Row>
                                                <Col md={12}>
                                                    <div className="d-flex justify-content-between">
                                                        <h6>Ticket Categories</h6>
                                                        <Button
                                                            name=""
                                                            className="position-relative float-end action-button bg-danger border-0 d-flex align-items-center gap-2"
                                                            value=""
                                                            onClick={() => setModelShow(true)}
                                                        >
                                                            <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-32" height="32"><path opacity="0.4" d="M13.7505 9.70303V7.68318C13.354 7.68318 13.0251 7.36377 13.0251 6.97859V4.57356C13.0251 4.2532 12.764 4.00049 12.4352 4.00049H5.7911C3.70213 4.00049 2 5.653 2 7.68318V10.1155C2 10.3043 2.07737 10.4828 2.21277 10.6143C2.34816 10.7449 2.53191 10.8201 2.72534 10.8201C3.46035 10.8201 4.02128 11.3274 4.02128 11.9944C4.02128 12.6905 3.45068 13.2448 2.73501 13.2533C2.33849 13.2533 2 13.5257 2 13.9203V16.3262C2 18.3555 3.70213 19.9995 5.78143 19.9995H12.4352C12.764 19.9995 13.0251 19.745 13.0251 19.4265V17.3963C13.0251 17.0027 13.354 16.6917 13.7505 16.6917V14.8701C13.354 14.8701 13.0251 14.5497 13.0251 14.1655V10.4076C13.0251 10.0224 13.354 9.70303 13.7505 9.70303Z" fill="currentColor"></path><path d="M19.9787 11.9948C19.9787 12.69 20.559 13.2443 21.265 13.2537C21.6615 13.2537 22 13.5262 22 13.9113V16.3258C22 18.3559 20.3075 20 18.2186 20H15.0658C14.7466 20 14.4758 19.7454 14.4758 19.426V17.3967C14.4758 17.0022 14.1567 16.6921 13.7505 16.6921V14.8705C14.1567 14.8705 14.4758 14.5502 14.4758 14.1659V10.4081C14.4758 10.022 14.1567 9.70348 13.7505 9.70348V7.6827C14.1567 7.6827 14.4758 7.36328 14.4758 6.9781V4.57401C14.4758 4.25366 14.7466 4 15.0658 4H18.2186C20.3075 4 22 5.64406 22 7.6733V10.0407C22 10.2286 21.9226 10.4081 21.7872 10.5387C21.6518 10.6702 21.4681 10.7453 21.2747 10.7453C20.559 10.7453 19.9787 11.31 19.9787 11.9948Z" fill="currentColor"></path></svg>
                                                            New Ticket
                                                        </Button>
                                                    </div>
                                                </Col>
                                                <Col md={12}>
                                                    <div className="bd-example table-responsive">
                                                        <Table className="table-striped">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Ticket</th>
                                                                    <th scope="col">Price</th>
                                                                    <th scope="col">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {tickets.length > 0 ?
                                                                    tickets?.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <th scope="row">{item?.name}</th>
                                                                            <td>{item?.price}</td>
                                                                            <td>{item?.sale === 1 ?
                                                                                item?.sale_price
                                                                                :
                                                                                <div className="text-danger">
                                                                                    No Sale
                                                                                </div>
                                                                            }</td>
                                                                            <td>
                                                                                <div class="d-flex gap-2 align-items-center list-user-action">
                                                                                    <button type="button" onClick={() => HandleEditTicket(item?.id)} class="btn btn-sm btn-icon btn-warning">
                                                                                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><circle cx="12.1747" cy="11.8891" r="2.63616" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></circle></svg>
                                                                                    </button>
                                                                                    <button type="button" onClick={() => HandleDeleteTicket(item?.id)} class="btn btn-sm btn-icon btn-danger">
                                                                                        <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><circle cx="12.1747" cy="11.8891" r="2.63616" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></circle></svg>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                    :
                                                                    <tr>
                                                                        <th scope="row" colSpan={5} className="text-center">No Tickets Found</th>
                                                                    </tr>
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col md={5} className="mb-3">
                                            <Row>
                                                <Col md={12}>
                                                    <Form.Group className="mb-3 form-group">
                                                        <h6>Ticket Terms</h6>
                                                        <textarea
                                                            className="form-control"
                                                            name="eventName"
                                                            placeholder="Ticket Terms"
                                                            value={ticketTerms}
                                                            rows={5}
                                                            onChange={(e) => setTicketTerms(e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="mt-3">
                                    <Button
                                        type="submit"
                                        name=""
                                        className="action-button float-end ms-2"
                                        value=""
                                    // onClick={() => handleChangeTicket()}
                                    >
                                        Next
                                    </Button>
                                    <Button
                                        type="button"
                                        name=""
                                        className="btn-danger action-button float-end"
                                        value=""
                                        onClick={() => AccountShow("Timing")}
                                    >
                                        Back
                                    </Button>
                                </div>
                            </Form>
                        </fieldset>
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
