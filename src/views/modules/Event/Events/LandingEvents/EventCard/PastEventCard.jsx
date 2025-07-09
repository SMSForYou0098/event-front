import React from "react";
import { Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMyContext } from "../../../../../../Context/MyContextProvider";

const PastEventCard = ({ event, isNavigate = true }) => {
  const { createSlug } = useMyContext();

  const cardContent = (
    <Card
      className="iq-product-custom-card animate:hover-media border-0 shadow-none"
      style={{ width: "98%" }}
    >
      <div className="iq-product-hover-img position-relative animate:hover-media-wrap">
        <Image
          src={event.image}
          alt={event.name}
          loading="lazy"
          className="w-100 bg-transparent"
          style={{ height: 200, objectFit: "cover" }}
        />
      </div>
      <Card.Body className="p-0 px-1 py-2">
        <div className="d-flex justify-content-between align-items-center flex-column mb-1">
          <span className="h6 iq-product-detail mb-0">{event?.name}</span>
        </div>
        <div className="d-flex justify-content-center align-items-center flex-column">
          <small className="text-muted">{event?.date}</small>
          <h6 className="mb-0">
            {Number(event?.price) === 0 ? "Free" : `₹${event?.price}`}
          </h6>
        </div>
      </Card.Body>
    </Card>
  );

  return isNavigate ? (
    <Link
      to={`/events/${createSlug(event.category)}/${createSlug(
        event.user
      )}/${createSlug(event.name)}/${event.id}`}
    >
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

export default PastEventCard;
