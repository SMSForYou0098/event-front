import React, { Fragment, memo } from "react";
import { Container, Row } from "react-bootstrap";
import LiveEvents from "../Events/LandingEvents/LiveEvents";
import { useMyContext } from "../../../../Context/MyContextProvider";

const Events = memo(() => {
  const {isMobile} = useMyContext();
  return (
    <Fragment>
      <div >
        <Container fluid className="px-5">
          <Row>
            <LiveEvents />
          </Row>
        </Container>
      </div>
    </Fragment>
  );
});

export default Events;
