import React, { Fragment, memo, useState, useLayoutEffect } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import DOMPurify from 'dompurify';
import { Dot, Mails, Map, } from "lucide-react";
import { motion } from "framer-motion";
import { WhatsAppIcon } from "../../../../components/partials/dashboard/sidebarstyle/NavIcons";
import footerBg from "../../../../assets/event/stock/footer.jpg"; // Adjust the path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faYoutube, faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { BiSupport } from "react-icons/bi";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
 
const MainFooter = memo(() => {
    const { api, createSlug, systemSetting } = useMyContext()
    const [date, setDate] = useState();
    const [groups, setGroups] = useState([]);
    const [data, setData] = useState();
    const [socialLinks, setSocialLinks] = useState();
 
    const getFooterData = async () => {
        try {
            const res = await axios.get(`${api}footer-group`);
            if (res.data.status) {
                const configData = res.data.FooterData;
                const groupsData = res.data.GroupData;
                const links = res.data.SocialLinks;
                setSocialLinks(links)
                setData(configData)
                setGroups(groupsData)
            }
        } catch (err) {
            console.log(err);
        }
    };
    const getYear = () => setDate(new Date().getFullYear());
    useLayoutEffect(() => {
        getFooterData()
        getYear();
    }, []);
    const bgStyle = {
        background: `url(${systemSetting?.footer_bg || footerBg})`,
        backgroundSize: 'contain',  // Changed from 'cover' to 'contain'
        backgroundPosition: 'center center',
        backgroundRepeat: 'repeat',  // Changed to 'repeat' to fill space without stretching
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
        backgroundColor: '#17132E', // Added fallback background color
    }
    const socialIcons = [
        {
            link: socialLinks?.facebook,
            icon: <FontAwesomeIcon icon={faFacebook} size="2x" color="white" />,
            tooltip: 'Follow us on Facebook'
        },
        {
            link: socialLinks?.instagram,
            icon: <FontAwesomeIcon icon={faInstagram} size="2x" color="white" />,
            tooltip: 'Follow us on Instagram'
        },
        {
            link: socialLinks?.youtube,
            icon: <FontAwesomeIcon icon={faYoutube} size="2x" color="white" />,
            tooltip: 'Subscribe to our YouTube'
        },
        {
            link: socialLinks?.twitter,
            icon: <FontAwesomeIcon icon={faXTwitter} size="2x" color="white" />,
            tooltip: 'Follow us on X (Twitter)'
        }
    ];
    const contactItems = [
        {
            icon: <BiSupport size={24} color="white" />,
            text: data?.footer_contact,
            action: `tel:${data?.footer_contact}`,
            tooltip: 'Call Customer Support'
        },
        {
            icon: <WhatsAppIcon size={24} color="white" />,
            text: data?.footer_whatsapp_number,
            action: `https://wa.me/${data?.footer_whatsapp_number}?text=hi!`,
            tooltip: 'Chat on WhatsApp'
        }
    ];
    return (
        <Fragment>
            <footer>
                <div className="py-5" style={bgStyle}>
                    <Container>
                        <Row>
                            <Col lg={3} md={6} sm={6} className="mb-2 col-6">
                                <Link to="/" className="navbar-brand d-flex align-items-center">
                                    <Image src={data?.logo || data?.footer_logo} width={180} loading="lazy" />
                                </Link>
                                <div className="d-flex align-items-center mt-2 mb-3">
                                    <Map color="white" size={26} />
                                    <span className="ms-4 text-white"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.footer_address) }}
                                    />
                                </div>
                                <div className="d-flex align-items-center mt-2 mb-3">
                                    <Mails color="white" />
                                    <Link className="ms-4 mb-0 text-white" to={`mailto:${data?.footer_email}`}>
                                        {data?.footer_email}
                                    </Link>
                                </div>
 
                            </Col>
                            {groups && groups?.map((item, i) => (
                                <Col lg={3} md={6} sm={6} key={i} className="col-6 mb-4">
                                    <h5 className="mb-3 text-white">{item.title}</h5>
                                    <ul className="m-0 p-0 list-unstyled text-white">
                                        {item?.footer_menu.map((link, j) => (
                                            <Link key={j} to={`/pages/${createSlug(link.title)}`} className="text-white">
                                                <li className="mb-2 d-flex align-items-center">
                                                    <Dot color="white" />
                                                    <span>{link.title}</span>
                                                </li>
                                            </Link>
                                        ))}
                                    </ul>
                                </Col>
                            ))}
                            <Col lg={3} md={6} sm={6} className="col-6 mt-4 mt-md-0">
                                <h5 className="mb-4 text-white">Contacts</h5>
                                <Row>
                                    {contactItems.map((item, index) => (
                                        <Col key={index} md={12} xs={12} className="ms-2 d-flex align-items-center gap-3 mb-3">
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotate: 10 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                <CustomTooltip text={item.tooltip}>
                                                    {item.icon}
                                                </CustomTooltip>
                                            </motion.div>
                                            <a
                                                href={item.action}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white text-decoration-none cursor-pointer"
                                            >
                                                {item.text}
                                            </a>
                                        </Col>
                                    ))}
 
                                    <div className="d-flex flex-wrap gap-3 mt-3">
                                        {socialIcons.map((item, index) => (
                                            <Link
                                                key={index}
                                                to={item.link}
                                                className="cursor-pointer"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.3, rotate: 10 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    <CustomTooltip text={item.tooltip}>
                                                        {item.icon}
                                                    </CustomTooltip>
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                    <Container className=" py-4 footer-border">
                        <Row>
                            <Col md={12} className="text-center text-white">
                                <p className="mb-0 d-flex gap-2 justify-content-center">
                                    © {date} {data?.site_credit && (
                                        <span
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.site_credit) }}
                                        />
                                    )}
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="footer-bottom" style={{ background: '#17132E' }}>
                </div>
            </footer>
        </Fragment>
    );
});
 
export default MainFooter;

 