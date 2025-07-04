import React, { memo, Fragment, useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import axios from "axios";
import partyImage from "../../../../../assets/modules/e-commerce/images/product/party3.jpg";
import Skeleton from "./Skeleton";
import EventCard from "./EventCard/EventCard";
const FeatureEvent = memo(() => {
  const { api, authToken } = useMyContext();
  const [featureEvents, setFeatureEvents] = useState([]);
  const [loading, setLoading] = useState();

  const GetFeatureEvents = async () => {
    setLoading(true)
    await axios.get(`${api}feature-event`, {
      headers: {
        'Authorization': 'Bearer ' + authToken,
      }
    }).then((res) => {
      if (res.data.status) {
        setFeatureEvents(res.data.events)
        setLoading(false)
      }
    }).catch((err) => {
      setLoading(false)
    }
    )
  }
  useEffect(() => {
    GetFeatureEvents()
  }, []);


  return (
    <Fragment>
      {featureEvents?.length > 0 &&
        <Row className="row-cols-1">
          <div className="d-flex py-1 pt-0">
            <h5 className="text-secondary text-capitalize">
              High{' '}
              <span className="text-primary">Demand</span>
            </h5>
          </div>
          {
            loading ?
              [...Array(6)].map((_, index) => (
                <Col lg="2" key={index}>
                  <Skeleton />
                </Col>
              ))
              :
              <div
                className="overflow-hidden slider-circle-btn"
                id="ecommerce-slider"
              >
                <Swiper
                  className="p-0 m-0  swiper-wrapper list-inline"
                  slidesPerView={3}
                  spaceBetween={0}
                  modules={[Navigation]}
                  autoplay
                  navigation={{
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                  }}
                  breakpoints={{
                    320: { slidesPerView: 2 },
                    550: { slidesPerView:3 },
                    991: { slidesPerView: 6 },
                    1400: { slidesPerView: 6 },
                    1500: { slidesPerView: 6 },
                    1920: { slidesPerView: 6 },
                    2040: { slidesPerView: 6 },
                    2440: { slidesPerView: 6 },
                  }}
                >
                  {featureEvents?.length > 0 && featureEvents?.map((item, index) =>
                    <SwiperSlide className="card-slide p-2" key={index}>
                      <EventCard
                        className="animate:hover-media"
                        productName={item.name}
                        userName={item.user?.organisation}
                        city={item?.city}
                        productImage={item?.thumbnail ? item?.thumbnail : partyImage}
                        id={item?.event_key}
                        productRating="3.5"
                        statusColor="primary"
                        isSoldOut={item?.booking_close}
                        fastFilling={item?.fast_filling}
                        isNotStart={item?.booking_not_start}
                        productPrice={item?.lowest_ticket_price}
                        salePrice={item?.lowest_sale_price}
                        statusDetails={item?.on_sale || ''}
                      />
                    </SwiperSlide>
                  )}

                </Swiper>
                <div className="swiper-button swiper-button-next"></div>
                <div className="swiper-button swiper-button-prev"></div>
              </div>
          }
        </Row>
      }
    </Fragment>
  );
});
FeatureEvent.displayName = "FeatureEvent";
export default FeatureEvent;
