import React, { useState, useEffect } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Send } from "lucide-react";
import { hasEventStarted, getEventFromBooking } from "./eventUtils";
import { CustomTooltip } from "../../CustomUtils/CustomTooltip";

const TicketActions = ({ onSendTickets, item ,isEventStarted}) => {

  const handleSendClick = () => {
    if (!isEventStarted) {
      onSendTickets(item);
    }
  };

  if (isEventStarted) {
    return (
      <CustomTooltip text="This event has already started. Tickets can no longer be sent.">
        <Button
          variant="outline-primary"
          className="d-flex align-items-center gap-1"
          disabled
        >
          <Send size={16} />
          Send Tickets
        </Button>
      </CustomTooltip>
    );
  }

  return (
    <CustomTooltip text="Send tickets">
      <Button
        variant="outline-primary"
        className="d-flex align-items-center gap-1"
        onClick={() => handleSendClick(item)}
      >
        <Send size={16} /> Send Tickets
      </Button>
    </CustomTooltip>
  );
};

export default TicketActions;
