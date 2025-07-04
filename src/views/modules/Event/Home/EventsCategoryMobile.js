import React from 'react'
import { Col, Container, Image, Row } from 'react-bootstrap'
import { Swiper, SwiperSlide } from 'swiper/react'
import Category1 from '../../../../assets/event/stock/Other/tov/tov1.webp';
import Category2 from '../../../../assets/event/stock/Other/tov/tov2.webp';
import Category3 from '../../../../assets/event/stock/Other/tov/tov3.webp';
import Category4 from '../../../../assets/event/stock/Other/tov/tov4.webp';
import Category5 from '../../../../assets/event/stock/Other/tov/tov5.webp';
import Category6 from '../../../../assets/event/stock/Other/tov/tov6.webp';
import Category7 from '../../../../assets/event/stock/Other/tov/tov7.webp';

const EventsCategoryMobile = () => {
    const categoryImages = [Category1, Category2, Category3, Category4, Category5, Category6, Category7,]
    return (
        <Container fluid className="px-5">
            <Row className="align-items-center">
                <Col md={12} className="text-center">
                    <h4 className="text-secondary pb-2 text-capitalize">Our <span className="text-primary">Events</span></h4>
                </Col>
                <div className="overflow-hidden slider-circle-btn" id="app-slider">
                    <Swiper
                        className="p-0 m-0 mb-2 swiper-wrapper list-inline"
                        slidesPerView={5}
                        spaceBetween={32}
                        autoplay={true}
                        navigation={{
                            nextEl: "#app-slider-next",
                            prevEl: "#app-slider-prev",
                        }}
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            550: { slidesPerView: 3 },
                            991: { slidesPerView: 4 },
                            1400: { slidesPerView: 4 },
                            1500: { slidesPerView: 6 },
                            1920: { slidesPerView: 6 },
                            2040: { slidesPerView: 6 },
                            2440: { slidesPerView: 6 },
                        }}
                    >
                        {categoryImages?.map((item, i) => (
                            <SwiperSlide className="card card-slide overflow-hidden" key={i}>
                                <Image
                                    src={item}
                                    alt="team-details"
                                    className="img-fluid"
                                    loading="lazy"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Row>
        </Container>
    )
}

export default EventsCategoryMobile
