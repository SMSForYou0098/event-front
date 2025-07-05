import React, {
  memo,
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Row, Image, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import CommonListing from "../CustomUtils/CommonListing";
import { Edit, Eye, IdCard, Trash2 } from "lucide-react";
import TicketModal from "../TicketModal/TicketModal";
import Select from "react-select";
import Swal from "sweetalert2";
import { set } from "lodash";
const Attendees = memo(() => {
  const {
    api,
    successAlert,
    formatDateRange,
    convertTo12HourFormat,
    isMobile,
    authToken,
    UserData,
  } = useMyContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState({});
  const [ticketModal, setTicketModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bgRequired, setBgRequired] = useState(false);

  const GetAttendee = useCallback(
    async (eventId) => {
      if (!eventId || !UserData?.id) return;

      try {
        setLoading(true);
        const response = await axios.get(
          `${api}attendee-list/${UserData.id}/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (response.data.status) {
          setUsers(response.data.attendees);
        }
      } catch (error) {
        console.error("Error fetching attendees:", error);
      } finally {
        setLoading(false);
      }
    },
    [api, UserData?.id, authToken]
  );

  const [selectedImage, setSelectedImage] = useState("");

  const openLightbox = useCallback((imagePath) => {
    setSelectedImage(imagePath);
  }, []);

  const handleShowIdCardModal = useCallback((ticket) => {
  Swal.fire({
    title: 'Background Selection',
    text: 'Please choose whether you want the ticket with or without a background.',
    icon: 'question',
    showCancelButton: false,
    showDenyButton: true,
    showCloseButton: true,
    confirmButtonText: 'With Background',
    denyButtonText: 'Without Background',
    allowOutsideClick: true,
  }).then((result) => {
    if (result.isConfirmed || result.isDenied) {
      setTicketData(ticket);
      setBgRequired(result.isConfirmed); // true if confirmed, false if denied
      setTicketModal(true);
    }
  });
}, [setTicketData, setBgRequired, setTicketModal]);


  const handleCloseModal = useCallback(() => {
    setTicketModal(false);
    setTimeout(() => {
      setSelectedImage("");
      setTicketData({});
    }, 1000);
  }, []);

  const getEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}events/attendee`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status) {
        // Convert to react-select format: { label, value }
        const formattedEvents = response.data.data.map((event) => ({
          label: event.name,
          value: event.id,
          card_url: event.card_url,
        }));
        setEvents(formattedEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        dataField: "id",
        text: "#",
        formatter: (cell, row, rowIndex) => rowIndex + 1,
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "Name",
        text: "Name",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "Mo",
        text: "Contact",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "Email",
        text: "Email",
        headerAlign: "center",
        align: "center",
        sort: true,
      },
      {
        dataField: "Photo",
        text: "Photo",
        formatter: (cell) => {
          if (cell) {
            return (
              <div className="d-flex justify-content-center">
                <CustomTooltip text="View Photo">
                  <div
                    onClick={() => openLightbox(cell)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={cell}
                      alt="Attendee"
                      loading="lazy"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </CustomTooltip>
              </div>
            );
          }
          return <span>No Image</span>;
        },
        headerAlign: "center",
        align: "center",
      },
      {
        dataField: "action",
        text: "Action",
        formatter: (cell, row) => {
          const actions = [
            {
              tooltip: "Generate ID Card",
              icon: <IdCard size={16} />,
              onClick: () => handleShowIdCardModal(row),
              variant: "secondary",
              // isDisabled: row?.status !== 1 || parseInt(row.approval_status) !== 1,
              visible: true,
            },
            {
              tooltip: "Preview User",
              icon: <Eye size={16} />,
              // onClick: () => handlePreview(row.id),
              variant: "info",
              visible: true,
            },
            {
              tooltip: "Manage User",
              icon: <Edit size={16} />,
              // onClick: () => AssignCredit(row.id),
              variant: "primary",
              visible: true,
            },
            {
              tooltip: "Delete User",
              icon: <Trash2 size={16} />,
              // onClick: () => HandleDelete(row.id),
              variant: "danger",
              visible: true,
            },
          ];

          return (
            <div className="d-flex gap-2 justify-content-center">
              {actions
                .filter((a) => a.visible)
                .map((action, idx) => (
                  <CustomTooltip key={idx} text={action.tooltip}>
                    <Button
                      variant={action.variant}
                      className="btn-sm btn-icon"
                      onClick={action.onClick}
                      disabled={action?.isDisabled}
                    >
                      {action.icon}
                    </Button>
                  </CustomTooltip>
                ))}
            </div>
          );
        },
      },
    ],
    [openLightbox, handleShowIdCardModal]
  );

  const handleSelectEvent = (selectedOption) => {
    setSelectedEvent(selectedOption);
    GetAttendee(selectedOption?.value);
  };

  


  useEffect(() => {
    getEvents();
  }, []);

  return (
    <Fragment>
      <Form.Group className="col-md-3 mb-3">
        <Form.Label htmlFor="eventSelect">Event:</Form.Label>
        <Select
          id="eventSelect"
          inputId="eventSelect"
          options={events}
          value={selectedEvent}
          className="js-choice"
          placeholder="Select Event"
          onChange={handleSelectEvent}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
        />
      </Form.Group>

      <Row>
        {selectedImage && (
          <div
            className="lightbox-overlay"
            onClick={() => setSelectedImage("")}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              cursor: "pointer",
            }}
          >
            <Image
              src={selectedImage}
              alt="Full size"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "contain",
              }}
            />
          </div>
        )}
        <TicketModal
          show={ticketModal}
          handleCloseModal={handleCloseModal}
          ticketType={{ type: "combine" }}
          ticketData={ticketData}
          ticketRefs={[]}
          loading={loading}
          isIdCard={true}
          bgRequired={bgRequired}
          card_url={selectedEvent?.card_url || ""}
          showTicketDetails={true}
          showPrintButton={true}
          // downloadTicket={downloadTicket}
          isMobile={isMobile}
          formatDateRange={formatDateRange}
          convertTo12HourFormat={convertTo12HourFormat}
        />
        <CommonListing
          tile={"Attendees"}
          bookings={users}
          exportPermisson={"Export Attendees"}
          loading={loading}
          columns={columns}
          ShowReportCard={false}
          searchPlaceholder={"Search Attendees..."}
        />
      </Row>
    </Fragment>
  );
});

Attendees.displayName = "Attendees";
export default Attendees;
