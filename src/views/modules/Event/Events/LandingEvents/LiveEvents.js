import React, { useState, memo, Fragment, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/css";
import partyImage from "../../../../../assets/modules/e-commerce/images/product/party3.jpg";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import axios from "axios";
import FeatureEvent from "./FeatureEvent";
import EventsContainer from "./EventsContainer";
import { Link } from "react-router-dom";
import FilterOptions from "./FilterOptions";
import { ChevronRight, SearchIcon } from "lucide-react";
SwiperCore.use([Autoplay]);
const LiveEvents = memo(() => {
    const { api, authToken,isMobile } = useMyContext();
    const [events, setEvents] = useState([]);
    const [featureEvents, setFeatureEvents] = useState([]);
    const categoryList = [
        { value: 'Business Seminars', label: 'Business Seminars' },
        { value: 'Live Band', label: 'Live Band' },
        { value: 'Live Concert', label: 'Live Concert' },
        { value: 'DJ Night', label: 'DJ Night' },
        { value: 'Garba Night', label: 'Garba Night' },
        { value: 'Food festival', label: 'Food festival' },
        { value: 'Education Festival', label: 'Education Festival' },
        { value: 'Techno Fair', label: 'Techno Fair' },
        { value: 'Real Estate', label: 'Real Estate' },
        { value: 'Automotive Expo', label: 'Automotive Expo' },
        { value: 'Fun fair', label: 'Fun fair' }
    ];

    const fetchEvents = () => {
        axios.get(`${api}events`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                setEvents(res.data.events)
            }
        }).catch((err) =>
            console.log(err)
        )
    }
    const GetFeatureEvents = () => {
        axios.get(`${api}feature-event`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                setFeatureEvents(res.data.events)
            }
        }).catch((err) =>
            console.log(err)
        )
    }
    useEffect(() => {
        fetchEvents()
        GetFeatureEvents()
    }, []);

    const formattedProductName = (name) => {
        let updated = name.replace(' ', "-");
        return updated
    }
    const HandleCTG = (category) => {
        //console.log(category)
    }
    return (
        <Fragment>
            {/* <div className="mt-4 mb-4"> */}
            <Row>
                <Col lg="12" style={{ marginTop: !isMobile && '6rem' }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">{''}</h5>
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex gap-3">
                                <div>
                                    <Link
                                        className="bg-transparent d-flex justify-content-between gap-2 align-items-center iq-custom-collapse"
                                        data-bs-toggle="collapse"
                                        to="#iq-product-filter-02"
                                        role="button"
                                        aria-expanded="true"
                                        aria-controls="iq-product-filter-02"
                                    >
                                        <p className="mb-0">Type</p>
                                        <i className="right-icon">
                                            <ChevronRight />
                                        </i>
                                    </Link>
                                    <div className="collapse mt-2" id="iq-product-filter-02">
                                        {categoryList?.map((item, index) =>
                                            <FilterOptions
                                                key={index}
                                                uniqueName="type"
                                                id={item?.value}
                                                productName={item?.value}
                                                HandleOnchange={HandleCTG}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <ul
                                className="nav nav-pills mb-0 iq-product-filter d-flex bg-transparent align-items-center"
                                id="pills-tab"
                                role="tablist"
                            >
                                <li className="nav-item dropdown d-none d-xl-block">
                                    <div className="form-group input-group mb-0 search-input w-100 ">
                                        <input
                                            type="search"
                                            className="form-control"
                                            placeholder="Search..."
                                        />
                                        <span className="input-group-text">
                                           <SearchIcon size={20}/>
                                        </span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content" id="pills-tabContent">
                        <div
                            className="tab-pane fade show active"
                            id="pills-grid-view"
                            role="tabpanel"
                            aria-labelledby="grid-view-tab"
                        >
                            <EventsContainer />
                        </div>
                    </div>
                </Col>
                <FeatureEvent featureEvents={featureEvents} formattedProductName={formattedProductName} partyImage={partyImage} />
            </Row>
            {/* </div> */}
        </Fragment>
    );
});
LiveEvents.displayName = "LiveEvents";
export default LiveEvents;
