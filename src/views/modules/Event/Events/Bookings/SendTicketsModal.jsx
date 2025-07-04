import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { hasEventStarted, getEventFromBooking } from "./eventUtils";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";

const SendTicketsModal = ({ show, handleClose, bookingData }) => {
  const { api, authToken, cancelToken } = useMyContext();
  const [step, setStep] = useState(1);
  const [validated, setValidated] = useState(false);
  const [ticketSelection, setTicketSelection] = useState("all");
  const [sendMethod, setSendMethod] = useState("both");
  const [ticketCount, setTicketCount] = useState(1);
  const [checkingUser, setCheckingUser] = useState(false);
  const [recipientData, setRecipientData] = useState({
    name: "",
    email: "",
    number: "",
  });
  const [isEventStarted, setIsEventStarted] = useState(false);
  const [isExist, setIsExist] = useState(false);
  const hasMultipleTickets = bookingData?.bookings?.length > 1;
  const totalTickets = bookingData?.bookings?.length || 1;

  useEffect(() => {
    if (bookingData) {
      // Get event object from booking data
      const event = getEventFromBooking(bookingData);

      // Check if event has started
      if (event) {
        setIsEventStarted(hasEventStarted(event));
      }
    }
  }, [bookingData]);

  const HandleCheckUser = async (number) => {
    setCheckingUser(true);
    try {
      const url = `${api}user-form-number/${number}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        cancelToken: cancelToken,
      });

      setIsExist(response.data.status);
      if (response.data.status) {
        const user = response.data.user;
        setRecipientData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    } finally {
      setCheckingUser(false);
    }
  };
  useEffect(() => {
    const { number } = recipientData;
    if (number && (number?.length === 10 || number?.length === 12)) {
      HandleCheckUser(number);
    } else {
      setRecipientData((prev) => ({
        ...prev,
        name: "",
        email: "",
      }));
    }
  }, [recipientData?.number]);

  const handleTicketSelectionChange = (e) => {
    setTicketSelection(e.target.value);
  };

  const handleSendMethodChange = (e) => {
    setSendMethod(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // Prepare API payload
    const payload = {
      // Booking information
      bookingId: bookingData?.id,
      eventId:
        bookingData?.ticket?.event?.id ||
        bookingData?.bookings?.[0]?.ticket?.event?.id,
      eventName:
        bookingData?.ticket?.event?.name ||
        bookingData?.bookings?.[0]?.ticket?.event?.name,

      // Ticket selection details
      ticketSelectionType: hasMultipleTickets ? ticketSelection : "all",
      ticketQuantity:
        hasMultipleTickets && ticketSelection === "individual"
          ? ticketCount
          : totalTickets,
      type: hasMultipleTickets ? "master" : "single",
      table: bookingData?.type,
      // Delivery method
      deliveryMethod: sendMethod,

      // Recipient information
      recipient: {
        ...recipientData,
      },
    };

    // Make API call
    console.log("Sending tickets API payload:", payload);

    // TODO: Replace with actual API call
    // Example:
    // sendTicketsToRecipient(payload)
    //   .then(response => {
    //     console.log('Tickets sent successfully', response);
    //     resetModal();
    //     handleClose();
    //   })
    //   .catch(error => {
    //     console.error('Error sending tickets', error);
    //     // Handle error
    //   });

    // For now, we'll just simulate success
    setTimeout(() => {
      console.log("Tickets sent successfully");
      //   resetModal();
      //   handleClose();
    }, 1000);
  };
  const resetModal = () => {
    // Reset step to first screen
    setStep(1);

    // Reset selections to defaults
    setTicketSelection("all");
    setSendMethod("whatsapp");
    setTicketCount(1);

    // Clear all form data
    setRecipientData({
      name: "",
      email: "",
      number: "",
    });

    // Clear validation state
    setValidated(false);
  };

  const handleModalClose = () => {
    resetModal();
    handleClose();
  };
  // Effect to reset modal when it's closed externally
  useEffect(() => {
    if (!show) {
      resetModal();
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={handleModalClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Send Tickets
          {bookingData && (
            <small
              className="d-block text-muted"
              style={{ fontSize: "0.8rem" }}
            >
              {bookingData?.ticket?.event?.name ||
                bookingData?.bookings?.[0]?.ticket?.event?.name}
            </small>
          )}
        </Modal.Title>
      </Modal.Header>{" "}
      <Modal.Body>
        {isEventStarted && (
          <Alert variant="danger" className="mb-4">
            <div className="fw-bold mb-1">This event has already started</div>
            <p className="mb-0">
              The ticket delivery service is only available before the event
              begins. Please use alternative methods to share access with your
              guests.
            </p>
          </Alert>
        )}

        {!isEventStarted && step === 1 ? (
          <Form>
            {hasMultipleTickets && (
              <Form.Group className="mb-4">
                <Form.Label className="d-block">Select Tickets</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="All Tickets"
                    name="ticketSelection"
                    id="all-tickets"
                    value="all"
                    checked={ticketSelection === "all"}
                    onChange={handleTicketSelectionChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    label="Individual Tickets"
                    name="ticketSelection"
                    id="individual-tickets"
                    value="individual"
                    checked={ticketSelection === "individual"}
                    onChange={handleTicketSelectionChange}
                  />
                </div>

                {ticketSelection === "individual" && (
                  <Form.Group className="mt-3">
                    <Form.Label>Number of Tickets to Send</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max={totalTickets}
                      value={ticketCount}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const limitedValue = Math.min(value, totalTickets);
                        setTicketCount(limitedValue);
                      }}
                      required
                    />
                    <Form.Text className="text-muted">
                      Maximum: {totalTickets} tickets
                    </Form.Text>
                  </Form.Group>
                )}
              </Form.Group>
            )}

            {(!hasMultipleTickets || ticketSelection) && (
              <Form.Group className="mb-3">
                <Form.Label className="d-block">Send Tickets via</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    label="WhatsApp"
                    name="sendMethod"
                    id="whatsapp"
                    value="whatsapp"
                    checked={sendMethod === "whatsapp"}
                    onChange={handleSendMethodChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    label="SMS"
                    name="sendMethod"
                    id="sms"
                    value="sms"
                    checked={sendMethod === "sms"}
                    onChange={handleSendMethodChange}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    label="Both"
                    name="sendMethod"
                    id="both"
                    value="both"
                    checked={sendMethod === "both"}
                    onChange={handleSendMethodChange}
                  />
                </div>
              </Form.Group>
            )}
          </Form>
        ) : (
          !isEventStarted && (
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="number"
                  value={recipientData.number}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                  pattern="^(\d{10}|\d{12})$"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid 10 or 12 digit phone number.
                </Form.Control.Feedback>
                <div className="text-info mt-2 small">
                  Please enter mobile number to check existing user details
                </div>
              </Form.Group>
              {checkingUser && (
                <div className="text-primary mt-2 small d-flex align-items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Checking user details...
                </div>
              )}
              {!checkingUser &&
                recipientData?.number &&
                (recipientData.number?.length === 10 ||
                  recipientData.number?.length === 12) && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Recipient Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={recipientData.name}
                        disabled={isExist}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter recipient name"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a name.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={recipientData.email}
                        disabled={isExist}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter email address"
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please provide a valid email address.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
            </Form>
          )
        )}
      </Modal.Body>
      <Modal.Footer>
        {isEventStarted ? (
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        ) : step === 1 ? (
          <>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Send Tickets
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default SendTicketsModal;
