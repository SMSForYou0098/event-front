import React, { useState, memo, useEffect } from "react";
import { Row, Col, Image, Table, Card, Container } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import ShareOffcanvas from "../../../../../components/partials/components/shareOffcanvasNew";
import partyImage from "../../../../../assets/modules/e-commerce/images/product/party3.jpg";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import CommonPricingComp from "../../TicketModal/CommonPricingComp";
import MobileBookNowButton from "./MobileBookNowButton";
import CommonMobileTopBar from "../../CustomUtils/BookingUtils/CommonMobileTopBar";
import MetaData from "../../CustomUtils/MetaData";
import { MapPin, ShoppingCart } from "lucide-react";
import EventDatesModal from "./OrderComps/EventDatesModal";
import LoginModel from "../../Auth/LoginModel";
import EventAccordion from "./EventDetailTabComps/EventTabContents";
import LoaderComp from "../../CustomUtils/LoaderComp";
import ExpiredEvent from "./ExpiredEvent";
const EventDetail = memo(() => {
    const { api, UserData, isMobile, authToken, successAlert, formatDateRange, convertTo12HourFormat, systemSetting, setHideMobileMenu } = useMyContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState([]);
    const [tickets, setTikcets] = useState([]);
    const [isExpired, setIsExpired] = useState(false);
    // setLoading
    const [loading, setLoading] = useState(true);
    const [modelShow, setModelShow] = useState(false);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    useEffect(() => {
        scrollToTop()
        setHideMobileMenu(true);
        setLoading(true);
        axios.get(`${api}event-detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                setIsExpired(res.data?.event_expired);
                setEvent(res.data.events)
                if (res.data?.events?.tickets) {
                    let tt = res.data?.events?.tickets?.filter((item) => {
                        return parseInt(item?.status) === 1;
                    });
                    if (tt?.length > 0) {
                        setTikcets(tt || []);
                    }
                }
            }
        }).catch((err) =>
            console.log(err)
        ).finally(() => {
            setLoading(false);
        });
        return () => {
            setHideMobileMenu(false);
        }
    }, []);


    const handleBooking = async (status) => {
        const isLoggedIn = UserData && Object?.keys(UserData)?.length > 0;
        // console.log(status)
        if (status || isLoggedIn) {
            if (event?.category?.title === 'Amusement') {
                if (selectedDate) {
                    navigate('/events/' + id + '/process', { state: { selectedDate } });
                } else {
                    handleShowDateModal();
                    return;
                }
            } else {
                navigate('/events/' + id + '/process');
            }

            // Show success alert only if the user just logged in
            if (status && !isLoggedIn) {
                successAlert('Success', 'Login Successfully');
            }
        } else {
            setModelShow(true);
        }
    };

    const disable = event?.booking_not_start || event?.booking_close
    const formatPhoneNumber = (number) => {
        let cleanNumber = number?.replace(/\D/g, '');

        if (cleanNumber?.length > 10) {
            return `+${cleanNumber?.slice(0, -10)}-${cleanNumber?.slice(-10, -6)}-${cleanNumber?.slice(-6, -4)}-${cleanNumber?.slice(-4)}`;
        } else {
            return `${cleanNumber?.slice(0, 4)}-${cleanNumber?.slice(4, 6)}-${cleanNumber?.slice(6)}`;
        }
    };
    const formattedNumber = formatPhoneNumber(systemSetting?.missed_call_no);

    // make state for showDateModal
    const [showDateModal, setShowDateModal] = useState(false);
    const handleShowDateModal = () => setShowDateModal(true);
    const [selectedDate, setSelectedDate] = useState(null);
    return (
        <Container style={{ marginTop: !isMobile && '6rem' }}>
            <MetaData event={event} />
            {/* //login model */}
            <LoginModel
                modelShow={modelShow}
                handleClose={() => setModelShow(false)}
                api={api}
                onLoginSuccess={(status) => {
                    handleBooking(status)
                }}
            />
            {/* //login model end*/}
            <Row>
                {loading ?
                    <Col lg="12" className="text-center">
                        <LoaderComp />
                    </Col>
                    :
                    <Col lg={12}>
                        <CommonMobileTopBar isMobile={isMobile} title={event?.name} />
                        {!isExpired &&
                            <MobileBookNowButton
                                isMobile={isMobile}
                                isExpired={isExpired}
                                disable={disable}
                                handleBooking={handleBooking}
                            />
                        }
                        <EventDatesModal
                            show={showDateModal}
                            setSelectedDate={setSelectedDate}
                            selectedDate={selectedDate}
                            dateRange={event?.date_range}
                            setShow={setShowDateModal}
                            handleSave={handleBooking}
                        />
                        <hr />
                        <Card className="mt-5">
                            <Card.Body>
                                <Row>
                                    <Col lg="12">
                                        <Row className="align-items-center">
                                            <Col lg="5">
                                                <div className="product-vertical-slider" onClick={() => handleBooking(false)}>
                                                    <div className="d-flex justify-content-center">
                                                        <Image
                                                            width={isMobile ? 250 : 400}
                                                            src={event?.thumbnail || partyImage}
                                                            alt="product-details"
                                                            className="img-fluid iq-product-img hover-media rounded-5"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="contacts text-center mt-3">
                                                    <p className="p-0 m-0">
                                                        <a href={`https://wa.me/${systemSetting?.missed_call_no?.replace(/\D/g, '')}?text=Hi`} target="_blank" rel="noopener noreferrer">
                                                            <i className="fa-brands fa-whatsapp text-success me-2" />
                                                        </a>
                                                        Say <strong>Hi</strong> or call{" "}
                                                        <a href={`tel:${systemSetting?.missed_call_no?.replace(/\D/g, '')}`} className="text-decoration-none">
                                                            <FontAwesomeIcon icon={faPhone} className="ms-2" /> {formattedNumber}
                                                        </a>
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col lg="7" className="mt-4 mt-lg-0">
                                                <div className="border-bottom">
                                                    {!isMobile &&
                                                        <div className="d-flex flex-column align-content-between justify-items-center mb-3">
                                                            <div className="d-flex justify-content-between mb-2">
                                                                <h4 className="mb-0">{event?.name}</h4>
                                                                <div className="d-flex justify-content-end ">
                                                                    <ShareOffcanvas share={true} />
                                                                </div>
                                                            </div>

                                                        </div>
                                                    }
                                                    {event?.booking_not_start ?
                                                        <p className="text-danger">Booking Not Started Yet</p> :
                                                        (event?.booking_close || isExpired) ?
                                                            <p className="text-danger">Booking Closed</p> :
                                                            <div className="d-flex align-items-center">
                                                                <div className="table-responsive  w-100">
                                                                    <Table responsive striped className="mb-0" role="grid">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="text-black h5">Ticket Category</th>
                                                                                <th className="text-black h5">Price</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {tickets?.map((item, index) => {
                                                                                return (
                                                                                    <tr key={index}>
                                                                                        <td className="text-black">{item.name}</td>
                                                                                        <td className="text-black h5">
                                                                                            <CommonPricingComp
                                                                                                currency={item.currency}
                                                                                                price={item.price}
                                                                                                isSale={item?.sale}
                                                                                                salePrice={item?.sale_price} />
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                            }
                                                                        </tbody>
                                                                    </Table>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>
                                                <div className="d-flex gap-2 border-bottom">
                                                    <p className="py-4 mb-0">
                                                        <MapPin size={16} />
                                                    </p>
                                                    <p className="text-dark pt-4 mb-0">
                                                        {event?.address}
                                                    </p>
                                                </div>
                                                <div className="d-flex flex-column py-2">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className="text-dark">Event Date:</span>
                                                        <span className="text-primary  ms-2">
                                                            {formatDateRange(event?.date_range)}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className="text-dark">Entry Time:</span>
                                                        <span className="text-primary  ms-2">{convertTo12HourFormat(event?.entry_time)}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className="text-dark">Starts At:</span>
                                                        <span className="text-primary  ms-2">{convertTo12HourFormat(event?.start_time)}</span>
                                                    </div>

                                                </div>
                                                {isExpired ?
                                                    <ExpiredEvent />
                                                    :
                                                    !isMobile &&
                                                    <div>
                                                        <div className={`d-flex py-4 flex-wrap gap-4 ${disable && 'opacity-50'}`}
                                                            onClick={() => !disable && handleBooking()}>
                                                            <Link
                                                                disabled={disable}
                                                                className="btn btn-warning d-flex align-items-center gap-2" style={{backgroundColor:"#B85DE8"}}
                                                            >
                                                                <span className="btn-inner d-flex ">
                                                                    <ShoppingCart />
                                                                </span>
                                                                Book Now
                                                            </Link>
                                                        </div>
                                                    </div>
                                                }

                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body>
                                <EventAccordion event={event} />
                            </Card.Body>
                        </Card>
                    </Col>
                }
            </Row>
        </Container>
    );
});
EventDetail.displayName = "EventDetail";
export default EventDetail;
