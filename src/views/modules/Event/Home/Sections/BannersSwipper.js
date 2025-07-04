import React, { useLayoutEffect, useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import { PlayCircle } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const Banners = () => {
    const { isMobile, api } = useMyContext();
    const [banners, setBanners] = useState({ mobile: [], pc: [] });
    const swiperRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);
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
        fetchBanners()
    }, []);

    const displayedBanners = isMobile ? banners.mobile : banners.pc;

    // Force autoplay for PC specifically
    useEffect(() => {
        if (!isMobile && displayedBanners.length > 1 && swiperInstance) {
            // Reset and explicitly start autoplay for PC
            setTimeout(() => {
                try {
                    swiperInstance.autoplay.stop();
                    swiperInstance.autoplay.start();
                    // Force a slide change to kickstart autoplay properly
                    swiperInstance.slideNext(750);
                } catch (err) {
                    console.log("Swiper initialization issue:", err);
                }
            }, 1000);
        }
    }, [displayedBanners, isMobile, swiperInstance]);

    return (
        <div className="banner" style={{
            // margin: !isMobile ? '6rem auto 0 auto' : '0 auto 0 auto',
            maxWidth: '1980px',
            overflow: 'hidden'
        }}>
            <Swiper
                ref={swiperRef}
                className="p-0 m-0 swiper-wrapper list-inline"
                slidesPerView={1}
                loop={true}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                speed={750}
                spaceBetween={0}
                pagination={{
                    clickable: true,
                }}
                modules={[Autoplay, Pagination]}
                onSwiper={(swiper) => {
                    setSwiperInstance(swiper);
                    // Force swiper update after initialization
                    setTimeout(() => {
                        if (swiper && !isMobile) {
                            swiper.update();
                            if (swiper.pagination) swiper.pagination.update();
                            swiper.autoplay.stop();
                            swiper.autoplay.start();
                        }
                    }, 500);
                }}
            >
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
                        <SwiperSlide className="card-slide" key={index}>
                            <Link to={banner?.src}>
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
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    )
}

export default Banners