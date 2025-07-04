import React, { useEffect, useState } from 'react'
import { Row, Spinner } from 'react-bootstrap'
//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import partyImage from "../../../../assets/modules/e-commerce/images/product/party3.jpg";
import PosEventCard from './PosEventCard';
const PosEvents = ({ handleButtonClick, searchTerm }) => {
    const { api, authToken, UserData, truncateString } = useMyContext();
    const [events, setEvents] = useState([]);
    const [filteredEvent, setFilteredEvents] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${api}pos-events/${UserData?.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                setFilteredEvents(res.data.events);
                setEvents(res.data.events);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formattedProductName = (name) => {
        let updated = name?.replace(' ', "-");
        return truncateString(updated)
    }

    const handleEventData = (id) => {
        handleButtonClick(id)
    }

    useEffect(() => {
        if (searchTerm) {
            const filtered = events.filter(event =>
                event.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEvents(filtered);
        } else {
            setFilteredEvents(events);
        }
    }, [searchTerm, events]);


    return (
        <Row className="row-cols-1">
            {loading ? ( // Conditional rendering for loading
                <div className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
                    <Spinner animation="border" variant="primary" />
                    <span className="ms-3">Loading events...</span>
                </div>
            ) : (
                <div
                    className="overflow-hidden slider-circle-btn"
                    id="ecommerce-slider"
                >
                    <Swiper
                        className="p-0 m-0 mb-2 swiper-wrapper list-inline text-center"
                        slidesPerView={6}
                        spaceBetween={50}
                        modules={[Navigation]}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        breakpoints={{
                            320: { slidesPerView: 3 },
                            550: { slidesPerView: 4 },
                            991: { slidesPerView: 4 },
                            1400: { slidesPerView: 4 },
                            1500: { slidesPerView: 4 },
                            1920: { slidesPerView: 8 },
                            2040: { slidesPerView: 8 },
                            2440: { slidesPerView: 8 },
                        }}
                    >
                        {filteredEvent?.length > 0 && filteredEvent?.map((item, index) =>
                            <SwiperSlide className="card-slide" onClick={() => handleEventData(item?.event_key)} key={index}>
                                <PosEventCard
                                    productName={formattedProductName(item.name)}
                                    productImage={item?.thumbnail ? item?.thumbnail : partyImage}
                                    id={item?.event_key}
                                    productRating="3.5"
                                    statusColor="primary"
                                />
                            </SwiperSlide>
                        )}

                    </Swiper>
                    <div className="swiper-button swiper-button-next"></div>
                    <div className="swiper-button swiper-button-prev"></div>
                </div>
            )}
        </Row>
    )
}

export default PosEvents