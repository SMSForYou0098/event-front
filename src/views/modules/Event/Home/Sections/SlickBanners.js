import React, { useLayoutEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import { PlayCircle } from 'lucide-react';
// Import slick css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slick-overrides.css';

const SlickBanners = () => {
    const { isMobile, api } = useMyContext();
    const [banners, setBanners] = useState({ mobile: [], pc: [] });
    const sliderRef = useRef(null);
    
    const fetchBanners = async () => {
        try {
            const response = await axios.get(`${api}banners`);
            const { banners } = response.data;

            const mobileBanners = [];
            const pcBanners = [];

            banners.forEach(banner => {
                // Get the banner number from the first key
                const keys = Object.keys(banner);
                const bannerIndex = keys[0].split('_')[1];

                const mobileObj = {
                    url: banner[`banners_${bannerIndex}_mobileUrl`],
                    type: banner[`banners_${bannerIndex}_type`]?.split('/')[0] || 'image',
                    src: banner[`banners_${bannerIndex}_redirectUrl`] === 'undefined' ? '#' : banner[`banners_${bannerIndex}_redirectUrl`]
                };

                const pcObj = {
                    url: banner[`banners_${bannerIndex}_pcUrl`],
                    type: banner[`banners_${bannerIndex}_type`]?.split('/')[0] || 'image',
                    src: banner[`banners_${bannerIndex}_redirectUrl`] === 'undefined' ? '#' : banner[`banners_${bannerIndex}_redirectUrl`]
                };

                mobileBanners.push(mobileObj);
                pcBanners.push(pcObj);
            });

            setBanners({
                mobile: mobileBanners,
                pc: pcBanners,
            });
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    useLayoutEffect(() => {
        fetchBanners();
    }, []);

    const displayedBanners = isMobile ? banners.mobile : banners.pc;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: false,
        arrows: false,
        centerMode: false,
        className: 'banner-slider-inner',
        dotsClass: 'slick-dots custom-dots',
        // draggable: true,
        // swipe: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true,
                    draggable: true,
                    swipe: true
                }
            }
        ]
    };

    return (
        <div className="slick-banner" style={{
            maxWidth: '1980px',
            overflow: 'hidden',
            margin: '0 auto',
            position: 'relative'
        }}>
            <Slider ref={sliderRef} {...settings}>
                {displayedBanners?.map((banner, index) => {
                        const bannerStyle = {
                            background: `url(${banner?.url}) no-repeat center center`,
                            backgroundSize: '100% 100%',  // This might cause stretching
                            backgroundColor: '#000000',
                            height: isMobile && '16rem',
                            // height: isMobile ? '16rem' : 'auto',
                            maxWidth: isMobile ? '100%' : '1980px',
                            width: '100%',
                            position: 'relative',
                            // margin: '0 auto',
                            aspectRatio: '1980/550',
                            objectFit: 'fill'  // This property doesn't work with background images
                        };
                    return (
                        <div key={index} className="slider-item">
                            <Link to={banner?.src} style={{display: 'block', lineHeight: 0}}>
                                <div className="position-relative video-box" style={bannerStyle}>
                                    <div className="iq-popup-video">
                                        <div className="iq-video-icon position-absolute">
                                            {banner?.type === 'video' &&
                                                <>
                                                    <div className="iq-video bg-secondary position-absolute text-center d-inline-block iq-fslightbox-img">
                                                        <Link to="https://smsforyou.biz/GYT.mp4" className="d-blok">
                                                            <PlayCircle />
                                                        </Link>
                                                    </div>
                                                    <div className="waves"></div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default SlickBanners;