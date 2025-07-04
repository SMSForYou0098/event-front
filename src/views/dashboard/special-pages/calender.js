import React, { memo, Fragment } from "react";

//react-bootstrap
import { Row, Col } from "react-bootstrap";

//components
import Card from "../../../components/bootstrap/card";
import HeaderBread from "../../../components/partials/components/header-breadcrumb";

//full calendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import * as moment from "moment";

const Calender = memo(() => {
  const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : r;
        return v.toString(16);
      }
    );
  };

  const events = [
    {
      id: uuidv4(),
      title: "5:30a Click for Google 1",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-20, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-20, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
      description: "test",
    },
    {
      id: uuidv4(),
      title: "5:30a All Day Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-18, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-18, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(108,117,125,0.2)",
      textColor: "rgba(108,117,125,1)",
      borderColor: "rgba(108,117,125,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Long Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-16, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-13, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(8,130,12,0.2)",
      textColor: "rgba(8,130,12,1)",
      borderColor: "rgba(8,130,12,1)",
    },

    {
      id: uuidv4(),
      title: "5:30a Repeating Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-12, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-12, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(235,153,27,0.2)",
      textColor: "rgba(235,153,27,1)",
      borderColor: "rgba(235,153,27,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Repeating Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-10, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-10, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(206,32,20,0.2)",
      textColor: "rgba(206,32,20,1)",
      borderColor: "rgba(206,32,20,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Birthday Party",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-8, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-8, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Meeting",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-6, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-6, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Birthday Party",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-5, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-5, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(235,153,27,0.2)",
      textColor: "rgba(235,153,27,1)",
      borderColor: "rgba(235,153,27,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Birthday Party",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(-2, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD")
        .add(-2, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(235,153,27,0.2)",
      textColor: "rgba(235,153,27,1)",
      borderColor: "rgba(235,153,27,1)",
    },

    {
      id: uuidv4(),
      title: "5:30a Meeting",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(0, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD").add(0, "days").format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Click for Google",
      url: "http://google.com/",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(0, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD").add(0, "days").format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Repeating Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(0, "days")
        .format("YYYY-MM-DD"),
      end: moment(new Date(), "YYYY-MM-DD").add(0, "days").format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Birthday Party",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(0, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(235,153,27,0.2)",
      textColor: "rgba(235,153,27,1)",
      borderColor: "rgba(235,153,27,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Doctor Meeting",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(0, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(235,153,27,0.2)",
      textColor: "rgba(235,153,27,1)",
      borderColor: "rgba(235,153,27,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a All Day Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(1, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Repeating Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(8, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
    {
      id: uuidv4(),
      title: "5:30a Repeating Event",
      start: moment(new Date(), "YYYY-MM-DD")
        .add(10, "days")
        .format("YYYY-MM-DD"),
      backgroundColor: "rgba(58,87,232,0.2)",
      textColor: "rgba(58,87,232,1)",
      borderColor: "rgba(58,87,232,1)",
    },
  ];
  return (
    <Fragment>
      <HeaderBread />
      <Row>
        <Col lg="12">
          <Row>
            <Col lg="12" className="col-lg-12">
              <Card>
                <Card.Body>
                  <FullCalendar
                    plugins={[dayGridPlugin, listPlugin, bootstrapPlugin]}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                    }}
                    events={events}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
});

Calender.displayName = "Calender";
export default Calender;
