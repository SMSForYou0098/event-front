import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Card, Dropdown, Image, Form, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import partyImage from "../../../../../assets/modules/e-commerce/images/product/party3.jpg";
import { useMyContext } from '../../../../../Context/MyContextProvider';
import TicketModal from '../../TicketModal/TicketModal';
import AttendeeModal from './AttendeeModal';
import { ChevronDown, Search } from 'lucide-react';
import TicketActions from './TicketActions';
import LoaderComp from '../../CustomUtils/LoaderComp';
import Flatpickr from "react-flatpickr";
import SendTicketsModal from './SendTicketsModal';
import { getEventFromBooking, hasEventStarted } from './eventUtils';

const BookingList = ({ bookings, loading, setLoading, hideDownload }) => {
    const { isMobile, formatDateRange } = useMyContext()

    const [ticketData, setTicketData] = useState([]);
    const [ticketType, setTicketType] = useState({ id: '', type: '' });
    const [show, setShow] = useState(false); const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState([]);
    const flatpickrRef = useRef(null);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [showSendModal, setShowSendModal] = useState(false);
    const [bookingData, setBookingData] = useState(null);

    const handleOpenSendModal = (item) => {
        setBookingData(item);
        setShowSendModal(true);
    };

    const handleCloseSendModal = () => {
        setShowSendModal(false);
        setBookingData(null);
    };
    const filterBookings = useCallback((term = searchTerm, dates = dateRange) => {
        if (!bookings) return;
        setLoading(true);
        let filtered = [...bookings];

        // Filter by search term
        if (term) {
            const searchValue = term.toLowerCase();
            filtered = filtered.filter(item => {
                const eventName = item?.ticket?.event?.name || (item?.bookings && item?.bookings[0]?.ticket?.event?.name) || '';
                const userName = item?.name || item?.bookings?.[0]?.name || '';
                const userNumber = item?.number || item?.bookings?.[0]?.number || '';
                const ticketName = item?.ticket?.name || item?.bookings?.[0]?.ticket?.name || '';

                return eventName.toLowerCase().includes(searchValue) ||
                    userName.toLowerCase().includes(searchValue) ||
                    userNumber.includes(searchValue) ||
                    ticketName.toLowerCase().includes(searchValue);
            });
        }

        // Filter by date range
        if (dates && dates.length > 0) {
            filtered = filtered.filter(item => {
                const bookingDate = new Date(item?.booking_date || item?.created_at);

                const startDate = new Date(dates[0]);
                const endDate = new Date(dates[1]);
                // Set end date to end of day
                endDate.setHours(23, 59, 59, 999);

                return bookingDate >= startDate && bookingDate <= endDate;
            });
        }
        setLoading(false);
        setFilteredBookings(filtered);
    }, [bookings, searchTerm, dateRange]);

    useEffect(() => {
        filterBookings();
    }, [bookings, filterBookings]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date?.toLocaleDateString('en-US', dateOptions);
        const hours = date?.getHours();
        const minutes = date?.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        const minutesFormatted = minutes?.toString()?.padStart(2, '0');
        const formattedTime = `${hours12}:${minutesFormatted} ${period}`;
        return `${formattedDate} ${formattedTime}`;
    };

    const handleTicketPreview = (item, type, id) => {
        setTicketData(item)
        setTicketType({ id: id, type: type })
        setShow(true)
    }

    function handleCloseModal() {
        setTicketData([])
        setTicketType()
        setShow(false)
    }

    const [attendess, setAttendess] = useState();
    const [category, setCategory] = useState();
    // make state for toggle show 
    const [showAttendees, setShowAttendees] = useState(false);
    const CloseAttendeeModal = () => {
        setAttendess()
        setShowAttendees(false)
    }
    const HandleShowAttendees = (data) => {
        const ctg = data?.bookings?.[0]?.ticket?.event?.category || data?.ticket?.event?.category;
        setCategory(ctg)
        if (data?.attendees || data?.attendee) {
            let attendee = (data?.attendee && [data?.attendee]) || (data?.attendees && data?.attendees)
            setShowAttendees(true);
            setAttendess(attendee);
        }
    }
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center my-4">
                <LoaderComp />
            </div>
        )
    }
    return (
        <>
            <SendTicketsModal
                show={showSendModal}
                handleClose={handleCloseSendModal}
                bookingData={bookingData}
            />

            <TicketModal
                show={show}
                handleCloseModal={handleCloseModal}
                ticketType={ticketType}
                ticketData={ticketData}
                isAccreditation={ticketData?.type === 'AccreditationBooking'}
                showTicketDetails={ticketData?.type === 'AccreditationBooking'}
                formatDateRange={formatDateRange}
            />
            <AttendeeModal
                show={showAttendees}
                data={attendess}
                handleCloseModal={CloseAttendeeModal}
                category={category}
                Slider={true}

            />
            <Row className='pb-3 align-items-center justify-content-between'>
                <Col md={4} className="mb-3 mb-md-0">
                    <Form.Group className="search-input">
                        <div className="input-group">
                            <span className="input-group-text" id="search-input">
                                <Search size={18} />
                            </span>
                            <Form.Control
                                type="text"
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={(e) => {
                                    const newSearchTerm = e.target.value;
                                    setSearchTerm(newSearchTerm);
                                    filterBookings(newSearchTerm, dateRange);
                                }}
                            />
                        </div>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <div className="date-picker-container position-relative">
                            <Flatpickr
                                className="form-control flatpickrdate"
                                value={dateRange}
                                options={{
                                    mode: "range",
                                    dateFormat: "Y-m-d",
                                    rangeSeparator: " to ",
                                }}
                                placeholder="Select date range"
                                ref={flatpickrRef}
                                onChange={(date) => {
                                    setDateRange(date);
                                    filterBookings(searchTerm, date);
                                }}
                            />
                            {dateRange && (
                                <Button
                                    variant="link"
                                    className="position-absolute end-0 top-0 text-secondary"
                                    style={{ padding: "0.375rem 0.75rem" }} onClick={() => {
                                        setDateRange([]);
                                        filterBookings(searchTerm, []);
                                        if (flatpickrRef.current) {
                                            flatpickrRef.current.flatpickr.clear();
                                        }
                                    }}
                                >
                                    ×
                                </Button>
                            )}
                        </div>
                    </Form.Group>
                </Col>
            </Row>
            {filteredBookings?.length > 0 ?
                filteredBookings?.map((item, index) => {
                    return (
                        <Card className="card shadow-none border iq-product-order-placed" key={index} style={{ marginBottom: isMobile && '3rem' }}>
                            <div className="card-header user-details-bg-color bg-light px-4 py-2">
                                <div className="iq-order-content">
                                    <div className="iq-order-user-details d-flex justify-content-between align-items-center gap-4">
                                        <div>
                                            <div className='d-flex p-0 m-0 align-items-center gap-2'>
                                                <span>Booking Date : </span>
                                                <h6 className="mb-0">{formatDate(item?.booking_date || item?.created_at)}</h6>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='d-flex p-0 m-0 align-items-center gap-2'>
                                                <span>Qty : </span>
                                                <h6 className="mb-0">{item?.bookings?.length > 1 ? item?.bookings?.length : 1}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Card.Body>
                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                    <div className="d-flex align-items-center">
                                        <Image
                                            src={item?.ticket?.event?.thumbnail ?? item?.bookings?.[0]?.ticket?.event?.thumbnail ?? partyImage}
                                            alt="Event Thumbnail"
                                            className="img-fluid rounded avatar-100 iq-product-bg"
                                            loading="lazy"
                                        />

                                        <div className={`ms-3`}>
                                            <Link style={{ pointerEvents: 'none' }} to="">
                                                <h6 className="mb-2">{item?.ticket?.event?.name || (item?.bookings && item?.bookings[0]?.ticket?.event?.name)}</h6>
                                            </Link>
                                            <div className={`${!isMobile && 'd-flex flex-column gap-2'}`}>
                                                <h6 className="mb-xl-0 mb-2 iq-order-id">
                                                    Date: <Link style={{ pointerEvents: 'none' }} to="#">{formatDateRange(item?.ticket?.event?.date_range || item?.bookings?.[0]?.ticket?.event?.date_range)}</Link>
                                                </h6>
                                                <h6 className="mb-xl-0 mb-2 iq-order-id">
                                                    Amount: <Link style={{ pointerEvents: 'none' }} to="#">
                                                        ₹{item?.amount || 0}
                                                    </Link>
                                                </h6>
                                                <h6 className="mb-xl-0 mb-2 iq-order-id">
                                                    User: <Link style={{ pointerEvents: 'none' }} to="#">{item?.name || item?.bookings?.[0]?.name}</Link>
                                                </h6>
                                                <h6 className="mb-xl-0 mb-2 iq-order-id">
                                                    Mo : <Link style={{ pointerEvents: 'none' }} to="#">{item?.number || item?.bookings?.[0]?.number}</Link>
                                                </h6>
                                                <h6 className="mb-xl-0 mb-2 iq-order-id">
                                                    Ticket : <Link style={{ pointerEvents: 'none' }} to="#">{item?.ticket?.name || item?.bookings?.[0]?.ticket?.name}</Link>
                                                </h6>                                                <h6 className="mb-xl-0 mb-2 iq-order-id">
                                                    Status: <span className={`badge p-1 bg-${(item?.status || item?.bookings?.[0]?.status) === "0" ? "warning" : "success"}`}>
                                                        {(item?.status || item?.bookings?.[0]?.status) === "0" ? "Uncheck" : "Checked"}
                                                    </span>
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 mt-xl-0 mt-3 mt-md-0">
                                        <div className={`text-end d-flex ${!isMobile ? 'flex-column' : ''} gap-1`}>
                                            {(item?.attendees?.length > 0 || item?.attendee) &&
                                                <Dropdown.Toggle
                                                    onClick={() => HandleShowAttendees(item)}
                                                    as={Button}
                                                    variant="btn-primary"
                                                    bsPrefix="btn-primary mb-3 "
                                                >
                                                    See Attendee
                                                </Dropdown.Toggle>
                                            }
                                            {!hideDownload &&
                                                <Dropdown>
                                                    <Dropdown.Toggle
                                                        className='d-flex align-items-center gap-1'
                                                        as={Button}
                                                        variant="btn-primary"
                                                        bsPrefix="btn-primary mb-3 "
                                                    >
                                                        Generate E-Ticket{" "}
                                                        <ChevronDown />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <li>
                                                            <Dropdown.Item
                                                                disabled={ticketType && ticketType.id === item.id}
                                                                onClick={() => handleTicketPreview(item, 'combine', item?.id)}>
                                                                Combine
                                                            </Dropdown.Item>
                                                        </li>

                                                        {item?.bookings &&
                                                            <>
                                                                <li>
                                                                    <Dropdown.Divider />
                                                                </li>
                                                                <li>
                                                                    <Dropdown.Item
                                                                        disabled={ticketType && ticketType.id === item.id}
                                                                        onClick={() => handleTicketPreview(item, 'individual', item?.id)}>
                                                                        Individual
                                                                    </Dropdown.Item>
                                                                </li>
                                                            </>
                                                        }
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            }
                                        </div>
                                        <TicketActions
                                            onSendTickets={handleOpenSendModal}
                                            item={item} />
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    )
                })
                :
                <Card className="shadow-none border">
                    <Card.Body>
                        <div className="text-center py-4">
                            <h5>No bookings found</h5>
                            <p>Try adjusting your search or date filters</p>
                        </div>
                    </Card.Body>
                </Card>
            }
        </>
    )
}

export default BookingList