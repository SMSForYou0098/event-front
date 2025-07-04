import React, { useState } from "react";
import { Modal, Form, Button, Col } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";

const PushNotificationModal = ({ show, onHide, setIsLoading }) => {
  const { api, authToken, UserData } = useMyContext();
  const [validated, setValidated] = useState(false);
  const [notification, setNotification] = useState({
    title: "",
    body: "",
    image: null,
    url: "",
    userGroup: "live",
  });

  const userGroups = [
    { value: "live", label: "Live Users" },
    { value: "4hours", label: "Last 4 Hour Users" },
    { value: "today", label: "Today Users" },
    { value: "2days", label: "Last Two Days" },
    { value: "all", label: "All Users" },
  ];

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", notification.title);
      formData.append("body", notification.body);
      if (notification.image) formData.append("image", notification.image);
      if (notification.url) formData.append("url", notification.url);
      formData.append("user_group", notification.userGroup);
      formData.append("user_id", UserData?.id);

      await axios.post(`${api}send-to-token`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onHide();
      setNotification({
        title: "",
        body: "",
        image: null,
        url: "",
        userGroup: "live",
      });
      setValidated(false);
    } catch (error) {
      console.error("Error sending notification:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setValidated(false);
    setNotification({
      title: "",
      body: "",
      image: null,
      url: "",
      userGroup: "live",
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send Push Notification</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleNotificationSubmit}
        >
          <Form.Group className="mb-3 row">
            {userGroups.map((group) => (
              <Col xs={12} md={6} key={group.value}>
                <Form.Check
                  type="radio"
                  name="userGroup"
                  id={`user-group-${group.value}`}
                  label={group.label}
                  checked={notification.userGroup === group.value}
                  onChange={() =>
                    setNotification({ ...notification, userGroup: group.value })
                  }
                  required
                />
              </Col>
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) =>
                setNotification({ ...notification, image: e.target.files[0] })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={notification.title}
              onChange={(e) =>
                setNotification({ ...notification, title: e.target.value })
              }
              placeholder="Enter notification title"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a title
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Body <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notification.body}
              onChange={(e) =>
                setNotification({ ...notification, body: e.target.value })
              }
              placeholder="Enter notification message"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a message body
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>URL (Optional)</Form.Label>
            <Form.Control
              type="url"
              value={notification.url}
              onChange={(e) =>
                setNotification({ ...notification, url: e.target.value })
              }
              placeholder="Enter URL for notification click action"
              pattern="https?://.+"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid URL (starting with http:// or https://)
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Notification
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PushNotificationModal;
