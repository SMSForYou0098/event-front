import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBullhorn } from "@fortawesome/free-solid-svg-icons";
import PushNotificationModal from "./PushNotificationModal";

const PushNotificationButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <PushNotificationModal
        show={showModal}
        setIsLoading={setIsLoading}
        onHide={() => setShowModal(false)}
      />
      <Button
        variant="primary"
        disabled={isLoading}
        className="btn btn-primary d-flex align-items-center gap-2"
        onClick={() => setShowModal(true)}
      >
        Push Notification
        <FontAwesomeIcon icon={faBullhorn}/>
      </Button>
    </>
  );
};

export default PushNotificationButton;
