import axios from 'axios';
import * as moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Image, InputGroup, Modal, Row, Spinner, Table } from 'react-bootstrap'
import { useMyContext } from '../../../../../Context/MyContextProvider';
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import Swal from 'sweetalert2';
import { Ticket } from 'lucide-react';
import NewSeatingChart from '../SeetingChart/NewSeatingChart';
const TicketByEvent = ({ eventId, eventName, showEventName }) => {
    const { api, ErrorAlert, successAlert, UserData, authToken, getCurrencySymbol } = useMyContext();
    // ticket code starts here
    const [tickets, setTickets] = useState([]);
    const [areas, setAreas] = useState([]);
    const [selectedAreas, setSelectedAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modifyAccessArea, setModifyAccessArea] = useState(false);

    const GetTickets = async (id) => {
        setLoading(true);
        try {
            const url = `${api}tickets/${id}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                const ticketData = response.data.tickets;
                setTickets(ticketData);
            }
        } catch (error) {
            // console.log('Error fetching ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAreas = useCallback(async () => {
        try {
            const url = `${api}accessarea-list/${eventId}`
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            let data = res.data.data || [];
            if (data.length > 0) {
                data = data.map(area => ({
                    value: area.id,
                    label: area.title
                }));
                setAreas(data || []);
            }
        } catch {
            setAreas([]);
        }
    }, [api, eventId, authToken]);

    useEffect(() => {
        if (eventId) {
            getAreas();
            GetTickets(eventId)
        }
    }, [eventId, getAreas]);


    const handleClose = () => setModelShow(false);

    const [editState, setEditState] = useState(false)
    const [ticketData, setTicketData] = useState(false)

    // ticket states 
    const [ticketTitle, setTicketTitle] = useState('');
    const [currencies, setCurrencies] = useState([]);
    const [currencyIcon, setCurrencyIcon] = useState('');
    const [convertedPrice, setConvertedPrice] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [price, setPrice] = useState('');
    const [templateId, setTemplateId] = useState('');
    const [ticketQuantity, setTicketQuantity] = useState('');
    const [bookingPerCustomer, setBookingPerCustomer] = useState('');
    const [userBookingLimit, setUserBookingLimit] = useState('');
    const [ticketDescription, setTicketDescription] = useState('');
    const [taxes, setTaxes] = useState('');
    const [saleDate, setSaleDate] = useState('');
    const [ticketTerms, setTicketTerms] = useState('');
    const [backgroundImage, setBackgroundImage] = useState();
    const [soldOut, setSoldOut] = useState('');
    const [notOpen, setNotOpen] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [validated, setValidated] = useState(false);
    const [sale, setSale] = useState(false);
    const [fastFilling, setFastFilling] = useState(false);
    const [status, setStatus] = useState(true);
    const [saleStartDate, setSaleStartDate] = useState('');
    const [saleEndDate, setSaleEndDate] = useState('');
    const [promocode, setPromocode] = useState([]);
    const [promocodes, setPromocodes] = useState([]);
    const TaxType = [
        { value: "Inclusive", label: "Inclusive" },
        { value: "Exclusive", label: "Exclusive" },
    ];
    const [modelShow, setModelShow] = useState(false);
    const [currencyMaster, setCurrencyMaster] = useState([]);


    const fetchCurrency = async () => {
        try {
            const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
            const currencyOptions = Object.keys(res.data.rates).map((cur) => ({
                value: cur,
                label: cur,
            }));
            setCurrencies(currencyOptions);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };
    const getPromocodes = async () => {
        try {
            const res = await axios.get(`${api}promo-list/${UserData?.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            const formattedPromocodes = res.data.promoCodes.reverse().map((promo) => ({
                value: promo.id,
                label: promo.code
            }));

            setPromocodes(formattedPromocodes);
        } catch (err) {
            // console.log(err);
        }
    };
    useEffect(() => {
        if (currencyMaster && currency) {
            if (currencyMaster.hasOwnProperty(currency)) {
                let symbol = currencyMaster[currency]?.symbol;
                setCurrencyIcon(symbol);
            }
        }
    }, [currencyMaster, currency])
    useEffect(() => {
        getPromocodes()
        fetchCurrency()
    }, []);
    useEffect(() => {
        if (price) {
            try {
                axios.get(`https://open.er-api.com/v6/latest/${currency?.value}`)
                    .then(response => {
                        const rate = response.data.rates.INR;
                        setConvertedPrice((price * rate).toFixed(2));
                    })
                    .catch(error => {
                        // console.log('Error fetching exchange rate in:', error);
                    });
            } catch (err) {
                // console.log('Error fetching exchange rate out:', err);
            }
        } else {
            setConvertedPrice('');
        }
    }, [price, currency]);


    function HandleEditTicket(id) {
        let data = tickets?.find((item) => item?.id === id)
        setTicketData(data)
        const preselectedAreaIds = data?.access_area || [];
        const preselectedAreas = areas.filter(area => preselectedAreaIds.includes(area.value));
        setSelectedAreas(preselectedAreas);
        setTicketTitle(data?.name)
        setPrice(data?.price)
        setTicketQuantity(data?.ticket_quantity)
        setBookingPerCustomer(data?.booking_per_customer)
        setUserBookingLimit(data?.user_booking_limit)
        setTicketDescription(data?.description)
        setTaxes(TaxType.find((item) => item?.value === data?.taxes))
        setSalePrice(data?.sale_price)
        setFastFilling(data?.fast_filling === 1 ? true : false)
        setModifyAccessArea(data?.modify_as === 1 ? true : false)
        setSale(data?.sale === 1 ? true : false)
        setSoldOut(data?.sold_out === 1 ? true : false)
        setImagePreviewUrl(data?.background_image)
        setNotOpen(data?.booking_not_open === 1 ? true : false)
        setStatus(data?.status === 1 ? true : false)
        if (data?.sale === 'true') {
            const [startDate, endDate] = data.sale_date?.split(',');
            if (startDate) {
                const start = new Date(startDate);
                setSaleStartDate(start);
            }
            if (endDate) {
                const end = new Date(endDate);
                setSaleEndDate(end);
            }
        }
        const promoIds = data?.promocode_ids || [];
        const matchingPromocodes = promocodes.filter((promo) => promoIds.includes(promo.value));
        setPromocode(matchingPromocodes);
        setBackgroundImage(data?.background_image)
        setCurrency(currencies.find((item) => item?.value === data?.currency))
        setEditState(true)
        setModelShow(true)
    }

    const resetFields = () => {
        setEditState(false)
        setTicketData([])
        setPromocode([])
        setSelectedAreas([]);
        setModifyAccessArea(false);
        setTicketData('');
        setTicketTitle('');
        setPrice('');
        setTicketQuantity('');
        setBookingPerCustomer('');
        setBookingPerCustomer('');
        setTicketDescription('');
        setTaxes(null);
        setSalePrice('');
        setSale(false);
        setSoldOut(false);
        setNotOpen(false);
        setStatus(true);
        setSaleDate('');
        setSaleEndDate('');
        setCurrency('');
        setSaleStartDate('');
        setSaleEndDate('');
        setBackgroundImage('');
        setImagePreviewUrl(''); // Create a preview URL
        setModelShow(false);
    }

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

    const handlePromocode = (codes) => {
        setPromocode(codes);
    };

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const handleBackGround = (e) => {
        const file = e.target.files[0];
        const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (file) {
            if (validFormats.includes(file.type)) {
                const img = new window.Image();
                img.onload = () => {
                    URL.revokeObjectURL(img.src);
                    setBackgroundImage(file);
                    setImagePreviewUrl(URL.createObjectURL(file)); // Create a preview URL
                    // if (img.width === 263 && img.height === 575) {
                    // } else {
                    //     ErrorAlert("Invalid image dimensions. Please upload an image that is exactly 263x575 pixels.");
                    // }
                };
                img.onerror = () => {
                    ErrorAlert("Error loading image. Please try again.");
                };
                img.src = URL.createObjectURL(file);
            } else {
                ErrorAlert("Invalid file format. Please upload an image in JPG, JPEG, PNG, or WEBP format.");
            }
        }
    };

    const HandleDelete = async (ticketId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to undo this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${api}ticket-delete/${ticketId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                if (response.status === 200) {
                    const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
                    setTickets(updatedTickets);
                    successAlert("Ticket deleted successfully");
                } else {
                    ErrorAlert("Failed to delete ticket");
                }
            } catch (error) {
                ErrorAlert("Error deleting ticket");
                console.error(error);
            }
        }
    };


    const SubmitTicket = async (event) => {
        event.preventDefault()
        const url = editState ? `${api}update-ticket/${ticketData?.id}` : `${api}create-ticket/${eventId}`
        const form = event.currentTarget;
        const promoCodeIds = promocode?.map(code => code?.value);
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            setLoading(true); // Set loading to true when submission starts
            try {
                const formData = new FormData();
                let datesArray = [];
                //return
                if (saleStartDate && saleEndDate) {
                    const start = moment(saleStartDate).format('YYYY-MM-DD');
                    const end = moment(saleEndDate).format('YYYY-MM-DD');
                    datesArray = [start, end].sort((a, b) => new Date(a) - new Date(b));
                }
                formData.append('currency', currency?.value);
                formData.append('price', price);
                formData.append('template_id', templateId);
                formData.append('ticket_title', ticketTitle);
                formData.append('ticket_quantity', ticketQuantity);
                formData.append('booking_per_customer', bookingPerCustomer);
                // formData.append('ticket_description', ticketDescription);
                formData.append('taxes', taxes?.value);
                formData.append('ticket_terms', ticketTerms);
                formData.append('background_image', backgroundImage);
                formData.append('promocode_codes', promoCodeIds);
                formData.append('user_booking_limit', userBookingLimit);
                formData.append('sold_out', soldOut);
                formData.append('booking_not_open', notOpen);
                formData.append('sale', sale);
                formData.append('fast_filling', fastFilling);

                formData.append('sale_price', salePrice);
                formData.append('ticket_template', templateId);
                formData.append('sale_date', datesArray);
                formData.append('status', status);
                formData.append('access_area', selectedAreas.map(area => area.value));
                formData.append('modify_access_area', modifyAccessArea);
                if (eventId) {
                    await axios.post(url, formData, {
                        headers: {
                            'Authorization': 'Bearer ' + authToken,
                        }
                    })
                        .then((res) => {

                            if (res.data.status) {
                                setTickets(res.data?.tickets)
                                resetFields()
                                setModelShow(false)
                                successAlert('Success', res.data?.message)
                                //AccountShow('Location')
                                //setValidate(prevState => ({ ...prevState, form3: true }));
                            }
                        }).catch((err) =>
                            console.log(err)
                        )
                }
            } catch (error) {
                ErrorAlert('Failed to submit ticket');
            } finally {
                setLoading(false);
            }
        }
    };


    return (
        <div>
            {/* model  */}
            <Modal
                className="modal-lg fade"
                id="add-appointment"
                data-bs-keyboard="true"
                tabIndex="-1"
                aria-hidden="true"
                show={modelShow}
                onHide={resetFields}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title as="h5">
                        {editState ? `Edit Ticket - ${ticketData?.name} ` : `Add Ticket`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated} onSubmit={SubmitTicket} className="needs-validation" noValidate>
                        <Row>
                            <Col md={9}>
                                <Row>
                                    <Col md={4}>
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
                                    </Col>
                                    <Col md={4}>
                                        <div className="form-group">
                                            <label className="form-label">Currency: *</label>
                                            <Select
                                                options={currencies}
                                                value={currency}
                                                className="js-choice"
                                                select="one"
                                                onChange={(e) => setCurrency(e)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3 form-group">
                                            <Form.Label className="custom-file-input">Price</Form.Label>
                                            <InputGroup className="mb-3">
                                                <InputGroup.Text>{currencyIcon}</InputGroup.Text>
                                                <Form.Control type="number" aria-label="" value={price} onChange={(e) => setPrice(e.target.value)} />
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    {currency !== 'INR' &&
                                        <Col md={3}>
                                            <Form.Group className="mb-3 form-group">
                                                <Form.Label className="custom-file-input">Convert price to INR</Form.Label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    name=""
                                                    value={convertedPrice}
                                                    disabled
                                                />
                                                <span className="text-grey fw-light fs-6 opacity-50">*ignore if currency is INR</span>
                                            </Form.Group>
                                        </Col>
                                    }
                                    <Col md={3}>
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
                                    </Col>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <label className="form-label">Ticket Limit Per Booking: *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="Booking Limit Per Customer"
                                                placeholder=""
                                                value={bookingPerCustomer}
                                                onChange={(e) => setBookingPerCustomer(e.target.value)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <label className="form-label">Booking Limit Per User: *</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="Booking Limit Per Customer"
                                                placeholder=""
                                                value={userBookingLimit}
                                                onChange={(e) => setUserBookingLimit(e.target.value)}
                                            />
                                        </div>
                                    </Col>

                                    {/* <Col md={24}>
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
                                    </Col> */}

                                    <Col md={3}>
                                        <div className="form-group">
                                            <label className="form-label">Tax Type: *</label>
                                            <Select
                                                options={TaxType}
                                                value={taxes}
                                                select="one"
                                                onChange={(e) => setTaxes(e)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <label className="form-label">Access Areas: *</label>
                                            <Select
                                                isMulti
                                                options={areas}
                                                value={selectedAreas}
                                                onChange={(selected) => setSelectedAreas(selected)}
                                                className="js-choice"
                                                placeholder="Select"
                                                menuPortalTarget={document.body}
                                                styles={{
                                                    menuPortal: base => ({ ...base, zIndex: 9999 })
                                                }}

                                            />
                                        </div>

                                    </Col>
                                    <Col md={3}>
                                        <div className="form-group">
                                            <label className="form-label">Promocodes: *</label>
                                            <Select
                                                options={promocodes}
                                                select="one"
                                                isMulti
                                                value={promocode}
                                                onChange={(promocode) => handlePromocode(promocode)}
                                            />
                                        </div>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3 form-group">
                                            <Form.Label className="custom-file-input">Ticket Background Image</Form.Label>
                                            <Form.Control type="file" id="customFile" accept=".jpg, .jpeg, .png, .webp" onChange={(e) => handleBackGround(e)} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <div className="form-group">
                                            <Form.Check.Label htmlFor="sale">Sale:</Form.Check.Label>
                                            <Form.Check className="form-switch">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={sale}
                                                    onChange={(e) => setSale(e.target.checked)}
                                                />
                                            </Form.Check>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Check.Label htmlFor="flexSwitchCheckDefault">Sold Out:</Form.Check.Label>
                                        <Form.Group className="form-group">
                                            <Form.Check className="form-switch">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="me-2"
                                                    id="flexSwitchCheckDefault"
                                                    checked={soldOut}
                                                    onChange={(e) => setSoldOut(e.target.checked)}
                                                />
                                            </Form.Check>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Check.Label htmlFor="notOpen"> Not Open:</Form.Check.Label>
                                        <Form.Group className="form-group">
                                            <Form.Check className="form-switch">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={notOpen}
                                                    id="notOpen"
                                                    onChange={(e) => setNotOpen(e.target.checked)}
                                                />
                                            </Form.Check>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Check.Label htmlFor="notOpen"> Fast Filling:</Form.Check.Label>
                                        <Form.Group className="form-group">
                                            <Form.Check className="form-switch">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={fastFilling}
                                                    id="notOpen"
                                                    onChange={(e) => setFastFilling(e.target.checked)}
                                                />
                                            </Form.Check>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Check.Label htmlFor="modify"> Modify Area:</Form.Check.Label>
                                        <Form.Group className="form-group">
                                            <Form.Check className="form-switch">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={modifyAccessArea}
                                                    id="modify"
                                                    onChange={(e) => setModifyAccessArea(e.target.checked)}
                                                />
                                            </Form.Check>
                                        </Form.Group>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Check.Label htmlFor="status"> Ticket Status:</Form.Check.Label>
                                        <Form.Group className="form-group">
                                            <Form.Check className="form-switch">
                                                <Form.Check.Input
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={status}
                                                    id="status"
                                                    onChange={(e) => setStatus(e.target.checked)}
                                                />
                                            </Form.Check>
                                        </Form.Group>
                                    </Col>
                                    {sale &&
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
                                                            value={saleStartDate}
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

                                    <Col md={12}>
                                        <div className="mt-3">
                                            <Button
                                                type="submit"
                                                name=""
                                                disabled={loading}
                                                className="action-button float-end"
                                                value=""
                                            >
                                                {editState ? `Update  ` : `Save `}
                                            </Button>
                                            <Button className="action-button float-end me-3" variant="danger" onClick={handleClose}>
                                                Discard
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3}>
                                <div className="image-preview-container">
                                    <h5>Ticket Preview:</h5>
                                    <Image
                                        src={imagePreviewUrl ? imagePreviewUrl : `https://placehold.co/263x575`}
                                        alt="Background Image Preview"
                                        fluid
                                        style={{ border: '1px solid #ddd', borderRadius: '5px', marginTop: '10px' }}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
            {/* end model  */}
            <Row>
                <Col md={24}>
                    <div className="d-flex justify-content-between">
                        {showEventName ? <h5>Ticket Categories of {eventName}</h5> : <span></span>}
                        <Button
                            name=""
                            className="position-relative float-end action-button bg-danger border-0 d-flex align-items-center gap-2"
                            value=""
                            onClick={() => setModelShow(true)}>
                            <Ticket /> New Ticket
                        </Button>
                    </div>
                </Col>
                <Col md={24}>
                    <Table className="table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Ticket</th>
                                <th scope="col">Price</th>
                                <th scope="col">Sale</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className='text-center'>
                                        <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                                            <Spinner animation="border" variant="primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </div>
                                    </td>
                                </tr>
                            ) : tickets?.length > 0 ? (
                                tickets?.map((item, index) => (
                                    <tr key={index}>
                                        <th scope="row">{item?.name}</th>
                                        <td>{getCurrencySymbol(item?.currency) + item?.price}</td>
                                        <td>{item?.sale === 1 ?
                                            getCurrencySymbol(item?.currency) + item?.sale_price
                                            :
                                            <div className="text-danger">
                                                No Sale
                                            </div>
                                        }</td>
                                        <td>
                                            <div className="d-flex gap-2 align-items-center list-user-action">
                                                <button type="button" onClick={() => HandleEditTicket(item?.id)} className="btn btn-sm btn-icon btn-warning">
                                                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="12.1747" cy="11.8891" r="2.63616" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle></svg>
                                                </button>
                                                <button type="button" onClick={() => HandleDelete(item?.id)} className="btn btn-sm btn-icon btn-danger">
                                                    <svg fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><circle cx="12.1747" cy="11.8891" r="2.63616" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <th scope="row" colSpan={5} className="text-center">No Tickets Found</th>
                                </tr>
                            )}
                        </tbody>

                    </Table>
                </Col>
            </Row>
            {/* <SeatingForm/> */}
            <NewSeatingChart
                eventId={eventId}
                tickets={tickets}
                api={api}
                authToken={authToken}
                successAlert={successAlert}
                ErrorAlert={ErrorAlert} />
        </div>
    )
}

export default TicketByEvent
