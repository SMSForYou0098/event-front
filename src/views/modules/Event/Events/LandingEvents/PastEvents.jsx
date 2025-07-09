"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Card, Col, Placeholder, Row } from "react-bootstrap";
import PastEventCard from "./EventCard/PastEventCard";
import Skeleton from "./Skeleton";

const PastEvents = () => {
  const { api, authToken } = useMyContext();
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getPastEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}past-events`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status) {
        setPastEvents(response.data.events || []);
      } else {
        setError("Failed to fetch past events.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching past events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPastEvents();
  }, []);

  // Loading placeholder card
  const renderPlaceholders = (count = 4) => (
  <Row className="g-3">
    {Array.from({ length: count }).map((_, idx) => (
      <Col key={`placeholder-${idx}`} xs={12} sm={6} md={4} lg={3}>
        <Skeleton />
      </Col>
    ))}
  </Row>
);



  return (
    <div className="container py-4">
      <h5 className="mb-3">Past Events</h5>

      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && pastEvents.length === 0 && (
        <p>No past events found.</p>
      )}

      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          576: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
        navigation={false}
      >
        {loading
          ? renderPlaceholders(4) // show 4 loading cards
          : pastEvents.map((event) => (
              <SwiperSlide key={event.id}>
                <PastEventCard
                  isNavigate={false}
                  event={{
                    id: event.id,
                    name: event.name,
                    category: event.category?.title,
                    user: event.user?.name,
                    date: event.date_range,
                    image: event.banner || "/default-banner.jpg",
                    price:
                      event.lowest_sale_price ?? event.lowest_ticket_price,
                  }}
                />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default PastEvents;
