import React, { useEffect, useState } from 'react'
import { Col, Container, Image, Modal, Row } from 'react-bootstrap'
import { Swiper, SwiperSlide } from 'swiper/react';
import Cookies from 'js-cookie';
const HomeArtistSection = ({ isMobile }) => {
    const canShowModal = () => {
        const hideModalUntil = Cookies.get('artists_modal');
        if (!hideModalUntil) return true; // If cookie doesn't exist, show the modal
        const hideUntilDate = new Date(hideModalUntil);
        const now = new Date();
        return now > hideUntilDate; // Show modal if current time is past the stored timestamp
    };
    const [images, setImages] = useState(false);
    const [show, setShow] = useState(false);
    useEffect(() => {
        const data = [];
        setImages(data);

        if (!isMobile && canShowModal()) {
            setShow(true);
        }
    }, [isMobile]);


    const handleClose = () => {
        setShow(false);
        const hideUntil = new Date();
        hideUntil.setHours(hideUntil.getHours() + 24);
        Cookies.set('artists_modal', hideUntil.toISOString(), { expires: 1 });
    };
    return (
        <>
            {/* Render modal only for non-mobile devices */}
            {!isMobile && (
                <Modal
                    show={show}
                    onHide={handleClose}
                    centered
                    dialogClassName="custom-modal">
                    <Modal.Header closeButton />
                    <Modal.Body>
                        <Swiper
                            navigation
                            autoplay={{ delay: 3000 }}
                            slidesPerView={1}
                            loop={true}
                        >
                            {images?.length > 0 &&
                                images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <Image
                                            src={image}
                                            fluid
                                            loading="lazy"
                                            alt={`Slide ${index}`}
                                        />
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </Modal.Body>
                </Modal>
            )}

            {/* Render Swiper container for mobile devices */}
            {isMobile && (
                <Container
                    fluid
                    className="d-flex flex-column justify-content-end"
                    style={{
                        position: 'fixed',
                        left: '0',
                        zIndex: '99',
                        bottom: '0',
                        maxWidth: '100%',
                        margin: '0',
                        padding: '0',
                    }}
                >
                    <Row className="g-0">
                        <Col xs={12} className="p-0">
                            {images.length > 0 && (
                                <Swiper
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 3000 }}
                                    spaceBetween={30}
                                    slidesPerView={1}
                                    loop={true}
                                >
                                    {images.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <Image
                                                src={image}
                                                fluid
                                                loading="lazy"
                                                alt={`Slide ${index}`}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    );
}

export default HomeArtistSection;