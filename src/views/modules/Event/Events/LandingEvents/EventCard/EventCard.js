import React, { memo, Fragment } from "react";
import { Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useMyContext } from "../../../../../../Context/MyContextProvider";
const EventCard = memo((props) => {
    const { createSlug } = useMyContext();
    const renderRibbon = (label, isVisible, marginLeft) =>
        isVisible && (
            <div className={`iq-ribbon-effect text-danger ${props?.statusColor}`} style={{ marginLeft }}>
                <span>{label}</span>
            </div>
        );

    return (
        <Fragment>
            <Link
                to={`/events/${createSlug(props?.city)}/${createSlug(props?.userName)}/${createSlug(
                    props?.productName
                )}/${props?.id}`}
            >
                {/* rounded-4 */}
                <Card
                    className={`iq-product-custom-card ${props?.className || "animate:hover-media"} border-0 shadow-none`}
                    style={{ width: props?.width || "98%" }}
                >
                    <div className="iq-product-hover-img position-relative animate:hover-media-wrap">
                        <Image
                            src={props?.productImage}
                            alt="product-details"
                            loading="lazy"
                            className="w-100 bg-transparent"
                        />
                        <div className="d-flex justify-content-start">
                            {renderRibbon("Sale", props?.statusDetails, "0")}
                            {renderRibbon("Promoted", props?.isPromoted, props?.statusDetails ? "3rem" : "0")}
                            {renderRibbon(
                                "Free",
                                props?.isFree,
                                props?.statusDetails && props?.isPromoted ? "6rem" : props?.statusDetails || props?.isPromoted ? "3rem" : "0"
                            )}
                            {renderRibbon(
                                "Recommended",
                                props?.isRecommended,
                                props?.statusDetails && props?.isPromoted && props?.isFree
                                    ? "9rem"
                                    : (props?.statusDetails && props?.isPromoted) ||
                                        (props?.statusDetails && props?.isFree) ||
                                        (props?.isPromoted && props?.isFree)
                                        ? "6rem"
                                        : props?.statusDetails || props?.isPromoted || props?.isFree
                                            ? "3rem"
                                            : "0"
                            )}
                        </div>
                    </div>
                    <Card.Body className="p-0 px-1 py-2">
                        <div className="d-flex justify-content-between align-items-center flex-column mb-1">
                            <span className="h6 iq-product-detail mb-0">{props?.productName}</span>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            {props?.isSoldOut ? (
                                <p className="text-danger">Booking Closed</p>
                            ) : props?.isNotStart ? (
                                <p className="text-danger">Booking Not Started Yet</p>
                            ) : (
                                <div className="d-flex gap-1">
                                    {props?.statusDetails && Number(props?.productPrice) > Number(props?.salePrice) ? (
                                        <div className="d-flex gap-1 align-items-center">
                                            <h6 className="mb-0">
                                                {Number(props?.salePrice) === 0 ? "Free" : `₹${props?.salePrice || 0}`}
                                            </h6>
                                            <p
                                                className="mb-0 text-muted"
                                                style={{
                                                    textDecorationLine: "line-through",
                                                    textDecorationStyle: "solid",
                                                }}
                                            >
                                                {Number(props?.productPrice) === 0 ? "Free" : `₹${props?.productPrice || 0}`}
                                            </p>
                                        </div>
                                    ) : (
                                        <h6 className="mb-0">
                                            {Number(props?.productPrice) === 0 ? "Free" : `₹${props?.productPrice || 0}`}
                                        </h6>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Link>
        </Fragment>
    );
});

EventCard.displayName = "EventCard";
export default EventCard;
