import React, { useEffect, useMemo, useState } from 'react'
import { Nav } from 'react-bootstrap';
import { FaThLarge, FaFileAlt, FaInfoCircle, FaImage, FaMapMarkerAlt, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useMyContext } from '../../../../../../Context/MyContextProvider';

const DetailsTab = () => {
    const {isMobile} = useMyContext();
    const [activeTab, setActiveTab] = useState('');
    const iconVariants = {
        selected: {
            scale: 1.2,
            y: -5,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                duration: 0.5
            }
        },
        unselected: {
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                duration: 0.5
            }
        },
        hover: {
            scale: 1.1,
            rotate: 15,
            transition: {
                type: "tween",
                ease: "easeInOut",
                duration: 0.2
            }
        }
    };


    const tabs = useMemo(() => [
        {
            key: "description",
            eventKey: "first",
            target: "#nav-description",
            label: "Description",
            icon: <FaFileAlt className="me-2" />,
            ariaSelected: "false"
        },
        {
            key: "layout",
            eventKey: "fourth",
            target: "#nav-layout",
            label: "Event Layout",
            icon: <FaThLarge className="me-2" />,
            ariaSelected: "true"
        },
        {
            key: "social",
            eventKey: "sixth",
            target: "#nav-social",
            label: isMobile ? "Instagram" : "Youtube",
            icon: isMobile ? <FaInstagram className="me-2" /> : <FaYoutube className="me-2" />,
            ariaSelected: "false"
        },
        {
            key: "media",
            eventKey: "third",
            target: "#nav-review",
            label: "Media",
            icon: <FaImage className="me-2" />,
            ariaSelected: "false"
        },
        {
            key: "location",
            eventKey: "fifth",
            target: "#nav-location",
            label: "Location Map",
            icon: <FaMapMarkerAlt className="me-2" />,
            ariaSelected: "false"
        },
        {
            key: "info",
            eventKey: "second",
            target: "#nav-info",
            label: "Terms & Condition",
            icon: <FaInfoCircle className="me-2" />,
            ariaSelected: "false"
        }
    ], [isMobile]);

    useEffect(() => {
        if (tabs.length > 0) {
            setActiveTab(tabs[0].key);
        }
    }, [tabs]);

    return (
        <div className="mb-0 nav nav-tabs" id="nav-tab1" role="tablist">
            {tabs.map(({ key, eventKey, target, label, icon, ariaSelected }) => (
                <Nav.Link
                    key={key}
                    eventKey={eventKey}
                    id={`nav-${key}-tab`}
                    data-bs-toggle="tab"
                    data-bs-target={target}
                    type="button"
                    role="tab"
                    aria-controls={target.substring(1)}
                    aria-selected={activeTab === key}
                    onClick={() => setActiveTab(key)}
                >
                    <motion.span
                        variants={iconVariants}
                        animate={activeTab === key ? 'selected' : 'unselected'}
                        // whileHover="hover"
                        style={{ display: 'inline-block' }}
                    >
                        {icon}
                        {label}
                    </motion.span>
                </Nav.Link>
            ))}
        </div>
    )
}

export default DetailsTab