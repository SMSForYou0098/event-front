import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import LoaderComp from "../CustomUtils/LoaderComp";
import Select from "react-select";

const EventNotification = () => {
  const { api, authToken, successAlert } = useMyContext();
  const [show, setShow] = useState(false);
  const [eventDay, setEventDay] = useState("today");
  const [notificationType, setNotificationType] = useState("both");
  const [loading, setLoading] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertVariant, setAlertVariant] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [validated, setValidated] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const fetchEvents = useCallback(async () => {
    try {
      setFetchingEvents(true);
      const response = await axios.get(`${api}events-days/${eventDay}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (response.data.status && response.data.data) {
        setEvents(response.data.data);
        setSelectedEventIds([]);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setFetchingEvents(false);
    }
  }, [api, authToken, eventDay]);

  // Fetch events when event day changes
  useEffect(() => {
    if (show) {
      fetchEvents();
    }
  }, [show, fetchEvents]);
  const handleEventDayChange = (e) => {
    setEventDay(e.target.value);
    setSelectedEventIds([]);
  };

  const handleEventSelection = (selectedOptions) => {
    const eventIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedEventIds(eventIds);
    
    // Clear validation error when user selects events
    if (eventIds.length > 0) {
      setFormErrors({...formErrors, events: null});
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (selectedEventIds.length === 0) {
      errors.events = "Please select at least one event";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    // Set form as validated to show validation messages
    setValidated(true);
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);

      // Prepare payload with selected event IDs
      const payload = {
        eventDay,
        notificationType,
        event_ids: selectedEventIds
      };
      
      const response = await axios.post(`${api}send-notifications`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Close modal and show success message using context
      handleClose();
      
      if (response.data.status) {
        successAlert("Success", "Notification sent successfully!");
      } else {
        // Show error message but keep modal open
        setAlertVariant("danger");
        setAlertMessage("Failed to send notification. Please try again.");
        setAlertShow(true);
      }
    } catch (error) {
      console.error("Error sending notification:", error);

      // Show error message but keep modal open
      setAlertVariant("danger");
      setAlertMessage("Failed to send notification. Please try again.");
      setAlertShow(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Event Notification
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Event Notification</Modal.Title>
        </Modal.Header>{" "}
        <Modal.Body>
          {alertShow && (
            <Alert
              variant={alertVariant}
              onClose={() => setAlertShow(false)}
              dismissible
            >
              {alertMessage}
            </Alert>
          )}
          <Form noValidate validated={validated}>
            <Form.Group className="mb-3">
              <Form.Label>Select Event Day</Form.Label>
              <Form.Select
                value={eventDay}
                onChange={handleEventDayChange}
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
              </Form.Select>
            </Form.Group>            <Form.Group className="mb-3">
              <Form.Label>Select Events</Form.Label>
              {fetchingEvents ? (
                <div className="text-center"><LoaderComp/></div>
              ) : (
                <>
                  <Select
                    isMulti
                    options={events?.length > 0 ? events?.map(event => ({
                      value: event.id,
                      label: event.name || event.title
                    })) : []}
                    value={selectedEventIds.map(id => {
                      const event = events.find(e => e.id === id);
                      return {
                        value: id, 
                        label: event ? (event.name || event.title) : id
                      };
                    })}
                    onChange={handleEventSelection}
                    isDisabled={events.length === 0}
                    placeholder={events?.length > 0 ? "Select events..." : "No events found"}
                    className={formErrors.events ? "is-invalid" : ""}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: formErrors.events ? "#dc3545" : baseStyles.borderColor,
                      }),
                    }}
                  />
                  {formErrors.events && (
                    <div className="invalid-feedback" style={{ display: 'block' }}>
                      {formErrors.events}
                    </div>
                  )}
                </>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notification Method</Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  label="WhatsApp"
                  name="notificationType"
                  id="whatsapp"
                  value="whatsapp"
                  checked={notificationType === "whatsapp"}
                  onChange={(e) => setNotificationType(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="SMS"
                  name="notificationType"
                  id="sms"
                  value="sms"
                  checked={notificationType === "sms"}
                  onChange={(e) => setNotificationType(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Both"
                  name="notificationType"
                  id="both"
                  value="both"
                  checked={notificationType === "both"}
                  onChange={(e) => setNotificationType(e.target.value)}
                />
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={loading || selectedEventIds.length === 0}
          >
            {loading ? "Sending..." : "Send Notification"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventNotification;
