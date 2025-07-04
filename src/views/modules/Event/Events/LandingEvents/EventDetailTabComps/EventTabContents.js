import React, { useEffect, useMemo, useState } from 'react';
import { Col, Image, Row, Accordion, Table } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { useMyContext } from '../../../../../../Context/MyContextProvider';
import FsLightbox from "fslightbox-react";
import { FaFileAlt, FaImage, FaInfoCircle, FaInstagram, FaMapMarkerAlt, FaThLarge, FaYoutube } from 'react-icons/fa';
import { Plus, Minus } from 'lucide-react';

const Media = ({ youtubeUrl, isMobile, images }) => {
    let img = [];
    try {
        img = JSON.parse(images.replace(/\\/g, ""));
    } catch (error) {
        //console.error("Invalid image JSON string", error);
    }
    const [lightboxController, setLightboxController] = useState({
        toggler: false,
        slide: 1,
    });

    const openLightbox = (index) => {
        setLightboxController({
            toggler: !lightboxController.toggler, // Toggle lightbox
            slide: index + 1, // FS Lightbox slides are 1-based
        });
    };
    const [metaData, setMetaData] = useState({
        title: "Default Title",
        description: "Default Description",
        keywords: "default, keywords",
        ogImage: "", // Open Graph Image for social sharing
    });
    return (
        <>
            <Row>
                <Col xs={12}>
                    <ReactPlayer
                        url={youtubeUrl}
                        controls
                        width={`${isMobile ? '350px' : '800px'}`}
                        height={`${isMobile ? '250px' : '400px'}`}
                    />
                </Col>
                <Col>
                    <Row className="g-3 mt-2">
                        {img?.map((path, i) => (
                            <Col xs={6} sm={6} md={3} lg={3} key={i}>
                                <Image
                                    src={path}
                                    alt="event-details"
                                    className="img-fluid iq-product-img rounded-3 w-100"
                                    loading="lazy"
                                    // onClick={() => openLightbox(i)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
            <div style={{ position: "relative", zIndex: lightboxController.toggler ? 1000 : 'auto' }}>
                <FsLightbox
                    toggler={lightboxController.toggler}
                    sources={img} // Pass all images to lightbox
                    slide={lightboxController.slide}
                />
            </div>
        </>
    );
}

const Info = ({ ticketTerms }) => (
    <Table bordered className="mb-0" responsive>
        <tbody>
            <tr>
                <td className="mb-0" dangerouslySetInnerHTML={{ __html: ticketTerms?.replace(/\r\n/g, '<br />') }} />
            </tr>
        </tbody>
    </Table>
);
const Description = ({ description }) => (
    <div className="d-flex flex-column">
        <p className="mb-0 text-black" dangerouslySetInnerHTML={{ __html: description }}></p>
    </div>
);
const MapCode = ({ location }) => {
    return (
        <div className="d-flex flex-column">
            <iframe
                className="w-100"
                title="map"
                src={location}
                height="500"
                allowFullScreen=""
                loading="lazy"
            ></iframe>
        </div>
    )
};
const EventLayout = ({ src }) => {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <Image
                width={400}
                src={src}
                alt="event-layout"
            />
        </div>
    )
};
const Tutorial = ({ data, isMobile }) => {
    const videoUrl = isMobile ? data?.insta_url : data?.youtube_url;

    return (
        <div className="d-flex justify-content-center align-items-center">
            <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="position-relative d-inline-block"
            >
                <Image
                    src={data?.insta_thumb}
                    alt="tutorial-thumbnail"
                    className="img-fluid rounded w-50 d-flex justify-content-center align-items-center"
                // width={isMobile ? 350 : 800}
                // height={isMobile ? 250 : 400}
                />
                {/* <div className="position-absolute top-50 start-50 translate-middle">
                    <i className="fas fa-play-circle text-white fs-1"></i>
                </div> */}
            </a>
        </div>
    );
};
const EventAccordion = ({ event }) => {
    const { isMobile } = useMyContext();
    const [activeKey, setActiveKey] = useState(null);

    useEffect(() => {
        const buttons = document.querySelectorAll('.accordion-button.collapsed');
        buttons.forEach(btn => {
            btn.classList.add('bg-transparent');
            btn.classList.add('border-bottom');
        });
        if (isMobile) {
            buttons.forEach(btn => btn.classList.add('py-0'));
        }
    }, [activeKey, isMobile]);

    const items = useMemo(() => [
        {
            key: "0",
            label: "Description",
            icon: <FaFileAlt className="me-2" />,
            content: <Description description={event?.description} />
        },
        {
            key: "1",
            label: "Layout",
            icon: <FaThLarge className="me-2" />,
            content: <EventLayout src={event?.layout_image} />
        },
        {
            key: "2",
            label: isMobile ? "Instagram" : "Youtube",
            icon: isMobile ? <FaInstagram className="me-2" /> : <FaYoutube className="me-2" />,
            content: <Tutorial data={event} isMobile={isMobile} />
        },
        {
            key: "3",
            label: "Media",
            icon: <FaImage className="me-2" />,
            content: <Media images={event?.images} youtubeUrl={event?.youtube_url} isMobile={isMobile} />
        },
        {
            key: "4",
            label: "Location Map",
            icon: <FaMapMarkerAlt className="me-2" />,
            content: <MapCode location={event?.map_code} />
        },
        {
            key: "5",
            label: "Terms & Condition",
            icon: <FaInfoCircle className="me-2" />,
            content: <Info ticketTerms={event?.ticket_terms} />
        }
    ], [event, isMobile]);

    return (
        <>
            <style>{`
                .accordion-button::after { display: none !important; }
            `}</style>
            <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                {items.map(({ key, label, icon, content }) => {
                    const isOpen = activeKey === key;
                    return (
                        <Accordion.Item eventKey={key} key={key} style={{ background: 'transparent', border: 'none' }}>
                            <Accordion.Header >
                                <span className="d-flex align-items-center text-black">
                                    {icon}
                                    {label}
                                </span>
                                <span className="ms-auto">
                                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                </span>
                            </Accordion.Header>
                            <Accordion.Body style={{ background: 'transparent' }} className="bg-transparent">
                                {content}
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </>
    );
};

export default EventAccordion;
