import React from "react";
import { getImageStyle } from "./styleUtils";
import { Image } from "react-bootstrap";

const ImageCard = ({ src, width }) => (
  <div className=" overflow-hidden" style={getImageStyle(width)}>
    <Image src={src} alt="team-details" className="img-fluid" loading="lazy" />
  </div>
);

export default ImageCard;
