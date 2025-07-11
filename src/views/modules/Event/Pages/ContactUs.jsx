import React, { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { BsChatDots, BsPeople, BsEnvelope } from "react-icons/bs";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";

const ContactUs = () => {
  const { api,isMobile } = useMyContext(); // Assuming MyContext is available globally
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    address: "",
    message: "",
    screenshot: null,
  });
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const screenshotRef = useRef();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const formEl = event.currentTarget;
    if (formEl.checkValidity() === false) {
      setValidated(true);
      return;
    }
    setSubmitting(true);
    setSuccess(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      const res = await axios.post(`${api}contac-store`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.status) {
        setSuccess("Your request has been submitted successfully! We will get back to you soon.");
        setForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          address: "",
          message: "",
          screenshot: null,
        });
        if (screenshotRef.current) screenshotRef.current.value = "";
        setValidated(false);
      } else {
        setSuccess("Failed to send. Please try again.");
      }
    } catch {
      setSuccess("Failed to send. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div>
      <Helmet>
        <title>Contact Us | Get Your Ticket - Showmates</title>
        <meta
          name="description"
          content="Contact Showmates for quick support, personalized assistance, and feedback. Get your ticket and connect with us today!"
        />
        <meta
          property="og:title"
          content="Contact Us | Get Your Ticket - Showmates"
        />
        <meta
          property="og:description"
          content="Contact Showmates for quick support, personalized assistance, and feedback. Get your ticket and connect with us today!"
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <Container style={{ marginTop: !isMobile && "6rem" }}>
        <Row className="justify-content-center align-items-center">
          <Col md={7}>
            <Card className="p-4 shadow-sm border-0">
                <h2 className="fw-bold mb-4 text-secondary text-center">Contact Us</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="contactName">
                      <Form.Label className="text-dark">
                        Your Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="John Doe"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="text-dark"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Name is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="contactEmail">
                      <Form.Label className="text-dark">Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="you@example.com"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="text-dark"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="contactPhone">
                      <Form.Label className="text-dark">
                        Phone Number <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="text-dark"
                        placeholder="e.g. +919876543210"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Phone number is required.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="contactSubject">
                      <Form.Label className="text-dark">Subject</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="text-dark"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group controlId="contactAddress">
                      <Form.Label className="text-dark">Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Enter your address..."
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="text-dark"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="contactMessage">
                  <Form.Label className="text-dark">
                    Message <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                  className="text-dark"
                    as="textarea"
                    rows={2}
                    placeholder="Tell us about your query..."
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Message is required.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="contactScreenshot">
                  <Form.Label className="text-dark">Attach Screenshot</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="screenshot"
                    onChange={handleChange}
                    ref={screenshotRef}
                    className="text-dark"
                  />
                </Form.Group>
                {success && (
                  <div
                    className={`mb-3 text-${
                      success.includes("submitted") ? "success" : "danger"
                    }`}
                  >
                    {success}
                  </div>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  // style={{ background: "rgb(23, 19, 46)", border: "none" }}
                  className="w-100 mt-2"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              </Form>
            </Card>
          </Col>
          <Col md={5} className="mb-4 mb-md-0">
            <h2 className="fw-bold mb-2 text-secondary">Get Your Ticket</h2>
            <p className="mb-4 text-muted">
              We'd love to hear from you! Fill out the form and our team will
              get back to you soon.
            </p>
            <div className="mb-3" style={{ color: "#b30000", fontWeight: 500 }}>
              Please enter/provide proper info to reach out easily
            </div>
            <Card
              className="p-4"
              style={{
                background: "rgb(23, 19, 46,0.1)",
                color: "#000",
                border: "none",
              }}
            >
              <ul className="ps-3" style={{ listStyle: "none" }}>
                <li className="mb-2">
                  <BsChatDots className="me-2" />
                  Quick response to your queries
                </li>
                <li className="mb-2">
                  <BsPeople className="me-2" />
                  Personalized support for your needs
                </li>
                <li>
                  <BsEnvelope className="me-2" />
                  We value your feedback and suggestions
                </li>
              </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactUs;
