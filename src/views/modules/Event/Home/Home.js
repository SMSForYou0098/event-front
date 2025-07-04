import React, { Fragment, memo } from "react";
import { Container } from "react-bootstrap";
import EventsContainer from "../Events/LandingEvents/EventsContainer";
import FeatureEvent from "../Events/LandingEvents/FeatureEvent";
import CategoryBG from '../../../../assets/event/stock/gradient.jpg'
import cardBg from '../../../../assets/event/stock/glass_bg3.jpg'
import Banners from "./Sections/BannersSwipper";
import EventsCategoryMobile from "./EventsCategoryMobile";
import MetaData from "../CustomUtils/MetaData";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SlickBanners from "./Sections/SlickBanners";

const Home = memo(() => {
  return (
    <Fragment>
       <MetaData/>
      {/* <Banners /> */}
      <SlickBanners />     
      <div className="main bg-cover" style={{ background: `url(${cardBg})` }}>
        <div className="section-padding  py-2 pt-4">
          <Container fluid className="px-5">
            <FeatureEvent />
          </Container>
        </div>
        <div className="section-padding  py-2">
          <Container fluid className="px-5">
            <div className="d-flex py-2 pt-0">
              <h5 className="text-secondary text-capitalize">Events</h5>
            </div>
            <EventsContainer />
          </Container>
        </div>
      </div>
      <div className="py-3" style={{ background: `url(${CategoryBG})`, backgroundSize: 'cover' }}>
        {/* {isMobile ? 
        : 
        <EventsCategoryPC /> */}
        <EventsCategoryMobile /> 
        {/* } */}
      </div>
      {/* <div className="py-3 page-bg bg-cover" style={{ background: `url(${cardBg})` }}>
        <Container fluid className="px-5">
          <ImageGallery />
        </Container>
      </div> */}
    </Fragment>
  );
});

export default Home;
