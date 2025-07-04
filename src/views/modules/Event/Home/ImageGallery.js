import React, { useState } from 'react'
import { Button, Image, Modal, Form } from 'react-bootstrap'
import img1 from '../../../../assets/event/stock/gallery/1.jpg'
import img2 from '../../../../assets/event/stock/gallery/2.jpg'
import img3 from '../../../../assets/event/stock/gallery/3.jpg'
import img4 from '../../../../assets/event/stock/gallery/4.jpg'
import img5 from '../../../../assets/event/stock/gallery/5.jpg'
import img6 from '../../../../assets/event/stock/gallery/6.jpg'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

// FsLightbox
import ReactFsLightbox from "fslightbox-react";
import { Link } from 'react-router-dom'
const FsLightbox = ReactFsLightbox.default
    ? ReactFsLightbox.default
    : ReactFsLightbox;
const ImageGallery = () => {
    const [show, setShow] = useState(false)
    const images = [
        { path: img1, text: '2022' },
        { path: img2, text: '2022' },
        { path: img3, text: '2023' },
        { path: img4, text: '2023' },
        { path: img5, text: '2024' },
        { path: img6, text: '2024' },
        { path: img2, text: '2022' },
        { path: img3, text: '2023' },
        { path: img4, text: '2023' },
        { path: img5, text: '2024' },
        { path: img6, text: '2024' }
    ]
    const HandleContactModel = () => {
        setShow(true)
    }
    const handleClose = () => setShow(false)

    const [youtubevideoController, setyoutubevideoController] = useState({
        toggler: false,
        slide: 1,
    });

    function youtubevideoOnSlide(number) {
        setyoutubevideoController({
            toggler: !youtubevideoController.toggler,
            slide: number,
        });
    }

    return (
        <>
            <FsLightbox
                toggler={youtubevideoController.toggler}
                sources={[
                    "https://www.youtube.com/watch?v=n4o9cHSSrrA",
                    "https://www.youtube.com/watch?v=n4o9cHSSrrA",
                    "https://www.youtube.com/watch?v=n4o9cHSSrrA",
                ]}
                slide={youtubevideoController.slide}
            />

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Contact Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <Form.Floating className=" mb-3">
                                <Form.Control type="email" className="" id="floatingInput1" autoComplete="username email" placeholder="name@example.com" />
                                <Form.Label style={{ left: '15px' }} htmlFor="floatingInput">Name</Form.Label>
                            </Form.Floating>

                            <Form.Floating className=" mb-3">
                                <Form.Control type="email" className="" id="floatingInput1" autoComplete="username email" placeholder="name@example.com" />
                                <Form.Label style={{ left: '15px' }} htmlFor="floatingInput">Phone Number</Form.Label>
                            </Form.Floating>

                            <Form.Floating className=" mb-3">
                                <Form.Control type="email" className="" id="floatingInput1" autoComplete="username email" placeholder="name@example.com" />
                                <Form.Label style={{ left: '15px' }} htmlFor="floatingInput">Email address</Form.Label>
                            </Form.Floating>

                            <Form.Floating className=" mb-3">
                                <Form.Control type="email" className="" id="floatingInput1" autoComplete="username email" placeholder="name@example.com" />
                                <Form.Label style={{ left: '15px' }} htmlFor="floatingInput">Organization</Form.Label>
                            </Form.Floating>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                        Discard
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>
                <h4 className="text-secondary pb-3 text-capitalize">
                    Successful{" "}
                    <span className="text-primary">Events</span>
                </h4>
                <div
                    className="overflow-hidden slider-circle-btn  "
                    id="app-slider"
                >
                    <Swiper
                        className="p-0 m-0 mb-2 swiper-wrapper list-inline"
                        slidesPerView={5}
                        spaceBetween={32}
                        autoplay={true}
                        modules={[Navigation]}
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            550: { slidesPerView: 2 },
                            991: { slidesPerView: 4 },
                            1400: { slidesPerView: 4 },
                            1500: { slidesPerView: 8 },
                            1920: { slidesPerView: 8 },
                            2040: { slidesPerView: 8 },
                            2440: { slidesPerView: 8 },
                        }}
                    >

                        {images?.map((item, index) => (
                            <SwiperSlide className="card card-slide overflow-hidden" key={index}>
                                <div className="hover-effects">
                                    <Image src={item?.path} className="img-fluid" loading='lazy' alt="" width={500} />
                                    <div className="ovrlay-6 d-flex justify-content-center align-items-center"
                                        style={{
                                            background: 'linear-gradient(to bottom, rgba(23, 19, 46, 0.7), rgba(23, 19, 46, 0.7))',
                                        }}
                                    >
                                        <div className="d-flex flex-column justify-content-center align-items-center">
                                            <h1 className="mt-4 mb-2 text-center text-white">{item?.text}</h1>
                                            <div className="iq-video bg-secondary  text-center d-inline-block iq-fslightbox-img rounded-5"
                                            style={{width:'3.5rem'}}
                                            >
                                                <Link onClick={() => youtubevideoOnSlide(1)} className="d-blok">
                                                    <svg
                                                        width="48"
                                                        className="text-white"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M16 12.0049C16 12.2576 15.9205 12.5113 15.7614 12.7145C15.7315 12.7543 15.5923 12.9186 15.483 13.0255L15.4233 13.0838C14.5881 13.9694 12.5099 15.3011 11.456 15.7278C11.456 15.7375 10.8295 15.9913 10.5312 16H10.4915C10.0341 16 9.60653 15.7482 9.38778 15.34C9.26847 15.1154 9.15909 14.4642 9.14915 14.4554C9.05966 13.8712 9 12.9769 9 11.9951C9 10.9657 9.05966 10.0316 9.16903 9.45808C9.16903 9.44836 9.27841 8.92345 9.34801 8.74848C9.45739 8.49672 9.65625 8.2819 9.90483 8.14581C10.1037 8.04957 10.3125 8 10.5312 8C10.7599 8.01069 11.1875 8.15553 11.3565 8.22357C12.4702 8.65128 14.598 10.051 15.4134 10.9064C15.5526 11.0425 15.7017 11.2087 15.7415 11.2467C15.9105 11.4605 16 11.723 16 12.0049Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </>


    )
}

export default ImageGallery