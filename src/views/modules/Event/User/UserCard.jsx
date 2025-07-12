import axios from "axios";
import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const FetchImageBlob = async (api, setLoading, imageUrl, setState) => {
  if (!imageUrl) {
    setState(null);
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post(
      `${api}get-image/retrive`,
      { path: imageUrl },
      { responseType: "blob" }
    );
    const imageBlob = res.data;
    const url = URL.createObjectURL(imageBlob);
    setState(url);
  } catch (error) {
    console.error("Error fetching image:", error);
    setState(null);
  } finally {
    setLoading(false);
  }
};

const UserCard = () => {
  const { api, ErrorAlert } = useMyContext();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [show, setShow] = useState(false);
  const [ticketType, setTicketType] = useState(null);

  const getCardData = useCallback(async () => {
    if (!orderId) {
      const msg = "Order ID not found";
      setErrorMsg(msg);
      ErrorAlert(msg);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${api}gan-card/${orderId}`);
      if (response.data.status && Array.isArray(response.data.data)) {
        const rawCards = response.data.data;

        const processedCards = await Promise.all(
          rawCards.map(async (item) => {
            const bgImageUrl = item?.card_url;
            let finalImage = null;
            if (bgImageUrl) {
              await FetchImageBlob(
                api,
                () => {},
                bgImageUrl,
                (val) => (finalImage = val)
              );
            }

            return {
              ...item,
              finalImage,
            };
          })
        );

        setCards(processedCards);
        setErrorMsg("");
      } else {
        const msg = "No data found for this order ID";
        setErrorMsg(msg);
        ErrorAlert(msg);
      }
    } catch (error) {
      const err =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch card data";
      setErrorMsg(err);
      ErrorAlert(err);
    } finally {
      setLoading(false);
    }
  }, [api, orderId, ErrorAlert]);

  useEffect(() => {
    getCardData();
  }, [getCardData]);

  const handleDownload = async () => {
    setShow(false);
    setTimeout(async () => {
      if (ticketType?.type === "individual") {
        for (let i = 0; i < cards.length; i++) {
          const el = document.getElementById(`ticket-${i}`);
          if (el) await downloadImage(el, `ticket_${cards[i].token}`);
        }
      } else if (ticketType?.type === "combine") {
        await downloadAllAsZip();
      }
    }, 300);
  };

  const showSingleAlert = useCallback(() => {
    Swal.fire({
      title: "Select an Option",
      text: "Would you like to download the tickets?",
      icon: "question",
      showCloseButton: true,
      focusConfirm: false,
      showDenyButton: true,
      confirmButtonText: "Individual",
      denyButtonText: "Combined ZIP",
    }).then((result) => {
      if (result.isConfirmed) {
        setTicketType({ type: "individual" });
        setShow(true);
      } else if (result.isDenied) {
        setTicketType({ type: "combine" });
        setShow(true);
      }
    });
  }, []);

  const downloadImage = async (el, name) => {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    const data = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = `${name}.png`;
    a.click();
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();
    for (let i = 0; i < cards.length; i++) {
      const el = document.getElementById(`ticket-${i}`);
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      zip.file(`ticket_${cards[i].token}.png`, dataUrl.split(",")[1], {
        base64: true,
      });
    }
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = `tickets.zip`;
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "2rem 1rem",
      }}
    >
      <Container>
        <h4 className="mb-4 text-center">Download E Tickets</h4>

        <div className="text-center mb-4">
          <Button variant="primary" onClick={showSingleAlert}>
            Download Tickets
          </Button>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : errorMsg ? (
          <div className="text-danger text-center">{errorMsg}</div>
        ) : (
          <div className="tickets-container">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                576: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                },
              }}
              style={{
                padding: "20px 0 40px", // Add padding for pagination
              }}
            >
              {cards.map((card, i) => (
                <SwiperSlide key={card.token}>
                  <div
                    id={`ticket-${i}`}
                    style={{
                      position: "relative",
                      backgroundImage: `url(${card.finalImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "204px",
                      height: "307px",
                      margin: "0 auto", // Center the ticket
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "25%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#fff",
                        padding: "4px",
                        borderRadius: "4px",
                      }}
                    >
                      <QRCodeCanvas value={card.token} size={60} level="H" />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <Modal show={show} onHide={() => setShow(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Processing</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please wait while your downloads are prepared...</Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default UserCard;