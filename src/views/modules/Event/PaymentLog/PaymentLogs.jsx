import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import CommonListing from "../CustomUtils/CommonListing";
import { Code, Printer } from "lucide-react";
import { Button, Modal } from "react-bootstrap";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
const PaymentLogs = memo(() => {
  const {
    api,
    UserData,
    formatDateTime,
    authToken,
    formatDateRange,
    ErrorAlert,
  } = useMyContext();
  const [bookings, setBookings] = useState([]);
  const [dateRange, setDateRange] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedParams, setSelectedParams] = useState(null);
  // Optimize GetBookings with better error handling and loading state
  const GetBookings = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = dateRange ? `?date=${dateRange}` : "";
      const url = `${api}payment-log/${queryParams}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data.status) {
        setBookings(response.data.PaymentLog);
      } else {
        setBookings([]);
      }
    } catch (error) {
      ErrorAlert("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, [api, UserData?.id, dateRange, authToken]);

  useEffect(() => {
    GetBookings();
  }, [dateRange, UserData?.id, api, authToken, GetBookings]);
  const handleShowModal = (params) => {
    setSelectedParams(params);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedParams(null);
  };

  const columns = useMemo(() => {
    const commonProps = {
      headerAlign: "center",
      align: "center",
      sort: true,
    };
    return [
      {
        dataField: "id",
        text: "#",
        formatter: (cell, row, rowIndex) => rowIndex + 1,
        ...commonProps,
      },
      {
        dataField: "amount",
        text: "Amount",
        ...commonProps,
      },
      {
        dataField: "payment_id",
        text: "Payment ID",
        formatter: (cell) => formatDateRange(cell),
        ...commonProps,
      },
      {
        dataField: "session_id",
        text: "Session ID",
        ...commonProps,
      },
      {
        dataField: "status",
        text: "Status",
        ...commonProps,
      },
      {
        dataField: "txnid",
        text: "txnid",
        ...commonProps,
      },
      {
        dataField: "action",
        text: "Action",
        formatter: (cell, row) => {
          const isDisabled = row?.is_deleted === true || row?.status === "1";

          const actions = [
            {
              tooltip: "See Full Object",
              variant: "success",
              icon: <Code size={16} />,
              disabled: isDisabled,
              onClick: () => handleShowModal(row),
            },
          ];

          return (
            <div className="d-flex gap-2 justify-content-center">
              {actions.map((action, index) => (
                <CustomTooltip key={index} text={action.tooltip}>
                  <Button
                    variant={action.variant}
                    className="btn-sm btn-icon"
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    {action.icon}
                  </Button>
                </CustomTooltip>
              ))}
            </div>
          );
        },
        ...commonProps,
      },
    ];
  }, [formatDateTime, formatDateRange]);
  return (
    <>
      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Payment Parameters</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <pre
            className="bg-light p-3 rounded"
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {selectedParams
              ? JSON.stringify(selectedParams, null, 2)
              : "No parameters available"}
          </pre>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <CommonListing
        tile={"Payment Logs"}
        bookings={bookings}
        dateRange={dateRange}
        ShowReportCard={false}
        loading={loading}
        columns={columns}
        setDateRange={setDateRange}
        searchPlaceholder={"Search Payment Logs..."}
        exportPermisson={"Export POS Bookings"}
        //bookingLink={"/dashboard/pos"}
       // ButtonLable={"New Booking"}
      />
    </>
  );
});

PaymentLogs.displayName = "PaymentLogs";
export default PaymentLogs;
