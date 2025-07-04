import React, { useLayoutEffect, useState } from 'react';
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { PlayCircle } from 'lucide-react';
import './BannerStyles.css'; // Adding custom CSS

const BootstrapBanners = () => {
    const { isMobile, api } = useMyContext();
    const [banners, setBanners] = useState({ mobile: [], pc: [] });
    const [index, setIndex] = useState(0);
    
    useLayoutEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(api);
                setBanners({ mobile: response.data.mobile, pc: response.data.pc });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [api]);

    const displayedBanners = isMobile ? banners.mobile : banners.pc;

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div className="bootstrap-banner no-overflow" style={{
            maxWidth: '1980px',
            margin: '0 auto'
        }}>
            <Carousel 
                activeIndex={index} 
                onSelect={handleSelect}
                interval={3000}
                indicators={true}
                controls={false}
                fade={true}
                className="banner-carousel"
            >
                {displayedBanners?.map((banner, idx) => {
                    const bannerStyle = {
                        background: `url(${banner?.url}) no-repeat center center`,
                        backgroundSize: 'cover',
                        height: isMobile ? '16rem' : '550px',
                        width: '100%',
                        display: 'block',
                        position: 'relative'
                    };
                    return (
                        <Carousel.Item key={idx} className="banner-item">
                            <Link to={banner?.src} className="banner-link">
                                <div className="position-relative video-box banner-container" style={bannerStyle}>
                                    {banner?.type === 'video' && (
                                        <div className="iq-popup-video">
                                            <div className="iq-video-icon position-absolute">
                                                <div className="iq-video bg-secondary position-absolute text-center d-inline-block iq-fslightbox-img">
                                                    <Link to="https://smsforyou.biz/GYT.mp4" className="d-blok">
                                                        <PlayCircle />
                                                    </Link>
                                                </div>
                                                <div className="waves"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </Carousel.Item>
                    );
                })}
            </Carousel>
        </div>
    );
};

export default BootstrapBanners;