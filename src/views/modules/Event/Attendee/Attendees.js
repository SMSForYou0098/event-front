import React, { memo, Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { Row, Image, Button, } from "react-bootstrap";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import CommonListing from "../CustomUtils/CommonListing";
import { Edit, Eye, IdCard, Trash2 } from "lucide-react";
import TicketModal from "../TicketModal/TicketModal";

const Attendees = memo(() => {
  const { api, successAlert, formatDateRange, convertTo12HourFormat, isMobile, authToken, UserData } = useMyContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketData, setTicketData] = useState({});
  const [ticketModal, setTicketModal] = useState(false);

  const GetAttendee = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}attendee-list/${UserData?.id}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      });

      if (response.data.status) {
        setUsers(response.data.attendees);
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setLoading(false);
    }
  }, [api, UserData?.id, authToken]);

  useEffect(() => {
    GetAttendee();
  }, [GetAttendee]);


  const [selectedImage, setSelectedImage] = useState("");

  const openLightbox = useCallback((imagePath) => {
    setSelectedImage(imagePath);
  }, []);

  const handleShowIdCardModal = useCallback((data) => {
    console.log(data)
    setTicketData(data);
    setTicketModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setTicketModal(false);
    setTimeout(() => {
      setSelectedImage("");
      setTicketData({});
    }, 1000);
  }, []);

  const columns = useMemo(() => [
    {
      dataField: 'id',
      text: '#',
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Name',
      text: 'Name',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Mo',
      text: 'Contact',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Email',
      text: 'Email',
      headerAlign: 'center',
      align: 'center',
      sort: true
    },
    {
      dataField: 'Photo',
      text: 'Photo',
      formatter: (cell) => {
        if (cell) {
          return (
            <div className="d-flex justify-content-center">
              <CustomTooltip text="View Photo">
                <div onClick={() => openLightbox(cell)} style={{ cursor: 'pointer' }}>
                  <img src={cell} alt="Attendee" loading="lazy"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }} />
                </div>
              </CustomTooltip>
            </div>
          );
        }
        return <span>No Image</span>;
      },
      headerAlign: 'center',
      align: 'center'
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
    }
  ], [openLightbox, handleShowIdCardModal]);



  return (
    <Fragment>
      <Row>

        {selectedImage && (
          <div
            className="lightbox-overlay"
            onClick={() => setSelectedImage("")}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              cursor: 'pointer'
            }}
          >
            <Image
              src={selectedImage}
              alt="Full size"
              style={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain'
              }}
            />
          </div>
        )}
        <TicketModal
          show={ticketModal}
          handleCloseModal={handleCloseModal}
          ticketType={{ type: 'combine' }}
          ticketData={ticketData}
          ticketRefs={[]}
          loading={loading}
          isIdCard={true}
          showTicketDetails={true}
          showPrintButton={true}
          // downloadTicket={downloadTicket}
          isMobile={isMobile}
          formatDateRange={formatDateRange}
          convertTo12HourFormat={convertTo12HourFormat}
        />
        <CommonListing
          tile={'Attendees'}
          bookings={users}
          exportPermisson={'Export Attendees'}
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
