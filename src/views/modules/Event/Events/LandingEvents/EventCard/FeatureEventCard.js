import React, { memo, Fragment } from "react";

//React-bootstrap
import { Image, Card } from "react-bootstrap";

//Router
import { Link } from "react-router-dom";

import { useMyContext } from "../../../../../Context/MyContextProvider";
const FeatureEventCard = memo((props) => {
  const { createSlug } = useMyContext()
  return (
    <Fragment>
      <Link to={`/events/${createSlug(props.city)}/${createSlug(props?.userName)}/${createSlug(props?.productName)}/${props?.id}`}>
        <div className="animate:hover-media">
          <div className="iq-product-hover-img position-relative animate:hover-media-wrap rounded-4">
            <Image
              loading="lazy"
              src={props.productImage}
              alt="product-details"
              className="img-fluid iq-product-img hover-media"
            />
            <div className="d-flex justify-content-start">
              {props.statusDetails && (
                <div className={`iq-ribbon-effect text-primary ${props.statusColor}`}>
                  <span>{'Sale'}</span>
                </div>
              )}
              {props.isPromoted && (
                <div className={`iq-ribbon-effect text-danger ${props.statusColor}`}
                  style={
                    {
                      marginLeft: props.statusDetails ? '3rem' : '0'
                    }
                  }>
                  <span>{'Promoted'}</span>
                </div>
              )}
              {props.isFree && (
                <div className={`iq-ribbon-effect text-danger ${props.statusColor}`} style={
                  {
                    marginLeft: (props.statusDetails && props.isPromoted) ? '6rem' : (props.statusDetails || props.isPromoted) && '3rem'
                  }
                }>
                  <span>{'Free'}</span>
                </div>
              )}
              {props.isRecommended && (
                <div className={`iq-ribbon-effect text-danger ${props.statusColor}`} style={
                  {
                    marginLeft: (props.statusDetails && props.isPromoted && props.isFree) ? '9rem' :
                      ((props.statusDetails && props.isPromoted)
                        ||
                        (props.statusDetails && props.isFree)
                        ||
                        (props.isPromoted && props.isFree)
                      ) ? '6rem' :
                        (props.statusDetails || props.isPromoted || props.isFree) ? '3rem' : '0'
                  }
                }>
                  <span>{'Recommended'}</span>
                </div>
              )}
            </div>
          </div>
          <span className="h6 iq-product-detail mb-0">
            <Card.Body className="p-0 px-1 py-2">
              <div className="d-flex justify-content-between align-items-center flex-column mb-1">
                {props.productName}
              </div>
              <div className="d-flex justify-content-center align-items-center">
                {
                  props.isSoldOut ?
                    <p className="text-danger">Booking Closed</p>
                    :
                    props.isNotStart ?
                      <p className="text-danger">Booking Not Started Yet</p>
                      :
                      <div className="d-flex gap-1 ">
                        {
                          props.statusDetails && Number(props.productPrice) > Number(props.salePrice) ? (
                            <div className="d-flex gap-1 align-items-center">
                              <h6 className="mb-0">{'₹' + (props?.salePrice || 0)}</h6>
                              <p
                                className="mb-0 text-muted"
                                style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}
                              >
                                {'₹' + (props?.productPrice || 0)}
                              </p>
                            </div>
                          ) : (
                            <h6 className="mb-0">{'₹' + (props?.productPrice || 0)}</h6>
                          )
                        }
                      </div>
                }
              </div>
            </Card.Body>
          </span>
        </div>
      </Link>
    </Fragment>
  );
});

FeatureEventCard.displayName = "FeatureEventCard";
export default FeatureEventCard;
