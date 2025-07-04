import React, {
  memo,
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import axios from "axios";
import { Eye, Download, FileText } from "lucide-react"; // Added FileText
import { Mail, Phone, Calendar, MapPin, MessageSquare } from "lucide-react";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import CommonListing from "../CustomUtils/CommonListing";
import FsLightbox from "fslightbox-react";
import jsPDF from "jspdf"; // Added jsPDF
import html2canvas from "html2canvas"; // Added html2canvas

const UserQueries = memo(() => {
  const { api, formatDateTime, ErrorAlert, authToken } = useMyContext();
  const [loading, setLoading] = useState(true);
  const [queries, setQueries] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [lightboxSource, setLightboxSource] = useState(null);
  const [lightboxToggler, setLightboxToggler] = useState(false); // updated
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false); // Added state for PDF generation

  const QueryData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}contac-list`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.data) {
        setQueries(response.data.data.reverse());
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      ErrorAlert("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  }, [api, authToken, ErrorAlert]);

  useEffect(() => {
    QueryData();
  }, [QueryData]);

  const showModal = useCallback(
    (id) => {
      const query = queries.find((q) => q.id === id);
      setSelectedQuery(query);
      setOpen(true);
    },
    [queries]
  );

  const handleCancel = () => {
    setOpen(false);
    setSelectedQuery(null);
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
        dataField: "name",
        text: "Name",
        sort: true,
      },
      {
        dataField: "number",
        text: "Number",
        sort: true,
      },
      {
        dataField: "message",
        text: "Message",
        formatter: (cell) =>
          cell && cell.length > 30 ? cell.substring(0, 30) + "..." : cell,
        sort: true,
      },
      //   {
      //     dataField: "image",
      //     text: "Image",
      //     formatter: (cell) => {
      //       if (cell) {
      //         return (
      //           <img
      //             src={cell}
      //             alt="User Query"
      //             loading="lazy"
      //             style={{
      //               width: "50px",
      //               height: "50px",
      //               objectFit: "cover",
      //               borderRadius: "50%",
      //               cursor: "pointer",
      //             }}
      //             onClick={() => {
      //               setLightboxSource(cell);
      //               setLightboxToggler((prev) => !prev); // toggle
      //             }}
      //           />
      //         );
      //       }
      //       return <span className="text-muted">No Image</span>;
      //     },
      //     sort: true,
      //   },
      {
        dataField: "created_at",
        text: "Date & Time",
        formatter: (cell) => formatDateTime(cell),
        sort: true,
      },
      {
        dataField: "action",
        text: "Action",
        formatter: (cell, row) => {
          const actions = [
            {
              tooltip: "View In Detail",
              onClick: () => showModal(row.id),
              variant: "secondary",
              icon: <Eye size={16} />,
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
                  >
                    {action.icon}
                  </Button>
                </CustomTooltip>
              ))}
            </div>
          );
        },
        headerAlign: "center",
        align: "center",
      },
    ],
    [formatDateTime, showModal]
  );

  const downloadImage = async () => {
    try {
      const response = await fetch(selectedQuery.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user-query-image.jpg"); // Or derive filename
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
      ErrorAlert("Failed to download image.");
    }
  };
  const handleDownloadPdf = async () => {
    const input = document.getElementById("query-details-content");
    if (!input) {
      ErrorAlert("Could not find content to download.");
      return;
    }
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(input, {
        scale: 2, // Improves quality
        useCORS: true, // Important if images are from other domains
        logging: false, // Disables logging to console for html2canvas
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;

      let newCanvasWidth = pdfWidth - 20; // 10pt margin on each side
      let newCanvasHeight = newCanvasWidth / ratio;

      // If canvas height is still too large, scale it down to fit PDF height with a larger margin
      if (newCanvasHeight > pdfHeight - 30) {
        // Increased bottom margin buffer (was pdfHeight - 20)
        newCanvasHeight = pdfHeight - 30; // Apply new height limit
        newCanvasWidth = newCanvasHeight * ratio; // Adjust width to maintain aspect ratio
      }

      const x = (pdfWidth - newCanvasWidth) / 2;
      const y = 10; // 10pt margin from top

      pdf.addImage(imgData, "PNG", x, y, newCanvasWidth, newCanvasHeight);
      pdf.save(
        `user-query-${
          selectedQuery?.name?.replace(/\\s+/g, "_") || "details"
        }.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      ErrorAlert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <Fragment>
      {/* Lightbox */}
      <FsLightbox
        toggler={lightboxToggler}
        sources={lightboxSource ? [lightboxSource] : []}
      />

      {/* Modal */}
      <Modal show={open} onHide={handleCancel} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>User Query Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuery && (
            <div
              id="query-details-content" // Added ID for PDF generation
              className="container-fluid p-3"
              style={{
                background: "#f8f9fa",
                borderRadius: "12px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              }}
            >
              <div className="row mb-4 align-items-center">
                {selectedQuery.image && (
                  <div className="col-md-3 text-center mb-3 mb-md-0">
                    <img
                      src={selectedQuery.image}
                      alt="User Query"
                      style={{
                        maxWidth: "120px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setLightboxSource(selectedQuery.image);
                        setLightboxToggler((prev) => !prev); // toggle
                      }}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="mt-2 d-block w-25 mx-auto"
                      download="user-query-image"
                      onClick={downloadImage}
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                )}
                <div className={selectedQuery.image ? "col-md-9" : "col-md-12"}>
                  <h5 className="fw-bold mb-2" style={{ color: "#34495e" }}>
                    {selectedQuery.name}
                  </h5>

                  {
                  [{
                    icon: Mail,
                    label: selectedQuery.email,
                    href: `mailto:${selectedQuery.email}`,
                  },
                  {
                    icon: Phone,
                    label: selectedQuery.number,
                    href: `tel:${selectedQuery.number}`,
                  },
                  {
                    icon: Calendar,
                    label: formatDateTime(selectedQuery.created_at),
                  },
                ]?.filter((item) => item.label) // remove empty/null fields
                  ?.map((item, index) => (
                    <div
                      key={index}
                      className="mb-1 d-flex align-items-center"
                      style={{ fontSize: "0.95rem" }}
                    >
                      <item.icon size={16} className="me-2" />
                      {item.href ? (
                        <a
                          href={item.href}
                          style={{ color: "inherit", textDecoration: "none" }}
                        >
                          {item.label}
                        </a>
                      ) : (
                        item.label
                      )}
                    </div>
                  ))}

                  <div
                    className="my-4 d-flex align-items-center"
                    style={{ fontSize: "0.95rem" }}
                  >
                    <Button
                      variant="info"
                      size="sm"
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                    >
                      {isGeneratingPdf ? (
                        "Generating..."
                      ) : (
                        <>
                          <FileText size={16} className="me-2" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-12">
                  <div
                    className="p-3"
                    style={{
                      background: "#fff",
                      borderRadius: "8px",
                      border: "1px solid #e3e3e3",
                    }}
                  >
                    <span className="fw-bold" style={{ color: "#34495e" }}>
                      <MessageSquare size={16} className="me-2" />
                      Message:
                    </span>
                    <div className="mt-2" style={{ whiteSpace: "pre-line" }}>
                      {selectedQuery.message}
                    </div>
                  </div>
                </div>
              </div>
              {selectedQuery.address && (
                <div className="row mb-2">
                  <div className="col-12">
                    <div
                      className="p-3 mb-2"
                      style={{
                        background: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e3e3e3",
                      }}
                    >
                      <span className="fw-bold" style={{ color: "#34495e" }}>
                        <MapPin size={16} className="me-2" />
                        Address:
                      </span>
                      <div className="mt-2" style={{ whiteSpace: "pre-line" }}>
                        {selectedQuery.address}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Table */}
      <Row>
        <Col sm="12">
          <CommonListing
            tile={"User Queries"}
            bookings={queries}
            loading={loading}
            columns={columns}
            searchPlaceholder={"Search Queries"}
            exportPermisson={"Export Events"}
            ShowReportCard={false}
          />
        </Col>
      </Row>
    </Fragment>
  );
});

export default UserQueries;
