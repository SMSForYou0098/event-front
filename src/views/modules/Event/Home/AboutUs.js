import React, { memo, Fragment } from "react";

// react-bootstrap
import { Col, Row, Container, Image, ListGroup } from "react-bootstrap";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const AboutUs = memo(() => {
    return (
        <Fragment>
            <div className="section-padding">
                <Container>
                    <div className="d-flex justify-content-center align-items-center">
                        Details Will Be Updated Soon
                    </div>
                </Container>
            </div>
        </Fragment>
    );
});
AboutUs.displayName = "AboutUs";
export default AboutUs;
