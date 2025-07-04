import React, { memo, Fragment } from "react";

//React-bootstrap
import { Image } from "react-bootstrap";

//Components
import Card from "../../../../components/bootstrap/card";

//Router
import { Link } from "react-router-dom";

const PosEventCard = memo((props) => {


  return (
    <Fragment>
      <div className="animate:hover-media">
        <div className="iq-product-hover-img position-relative animate:hover-media-wrap rounded-4">
          <Link>
            <Image
              src={props.productImage}
              alt="product-details"
              className="img-fluid iq-product-img hover-media rounded-4"
            />
          </Link>
        </div>
        <Card.Body className="p-0 px-1 py-2">
          <div className="d-flex justify-content-between align-items-center flex-column mb-1">
            <Link
              className="h6 iq-product-detail mb-0"
            >
              {props.productName}
            </Link>
          </div>
        </Card.Body>
      </div>
    </Fragment>
  );
});

PosEventCard.displayName = "PosEventCard";
export default PosEventCard;
