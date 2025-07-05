import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import profileImage from "../../../../assets/event/stock/profile.jpg";
import { FetchImageBlob, ImageStyleSelector } from "./CanvasUtils";
import { useMyContext } from "../../../../Context/MyContextProvider";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignVerticalSpaceAround,
  Info,
  MousePointer,
  Move,
  RotateCcw,
  Save,
  Settings,
} from "lucide-react";
import axios from "axios";
import IDCardDragAndDrop from "./IDCardDragAndDrop";

// Move instruction array outside component to prevent recreation on every render
const instructionList = [
  {
    Icon: Move,
    text: "Drag and drop elements to rearrange their position",
  },
  {
    Icon: MousePointer,
    text: "Hold Shift key and click to select multiple elements",
  },
  {
    Icon: Settings,
    text: "Use the settings panel to modify styles and appearance",
  },
  {
    Icon: RotateCcw,
    text: "Use Ctrl+Z to undo recent changes",
  },
  {
    Icon: Save,
    text: "Changes are saved automatically",
  },
  {
    Icon: AlignCenter,
    text: "Press Ctrl+E to horizontally center selected element",
  },
  {
    Icon: AlignVerticalSpaceAround,
    text: "Press Ctrl+Q to vertically center selected element",
  },
  {
    Icon: AlignLeft,
    text: "Press Ctrl+1 to align selected element to left third line",
  },
  {
    Icon: AlignRight,
    text: "Press Ctrl+2 to align selected element to right third line",
  },
];

const CanvasSettings = ({
  previewUrl,
  setLayoutData,
  categoryId,
  isCircle,
  setIsCircle,
  disabled,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { api, authToken } = useMyContext();
  const [finalImage, setFinalImage] = useState(null);
  const [savedLayout, setSavedLayout] = useState();
  const [fetchingLayout, setFetchingLayout] = useState(false);
  const [loading, setLoading] = useState(false);

  const [dummyUserData, setDummyUserData] = useState({
    name: "Your name",
    number: "Your Company name",
    email: "Your designation",
    // company: { zone: [2, 3, 5] },
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setDummyUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSetIsCircle = useCallback((value) => {
    setIsCircle(value);
  }, [setIsCircle]);

  useEffect(() => {
    console.log("Fetching layout for categoryId:", categoryId);
    if (!categoryId || !authToken) return;
    
    // const fetchLayout = async () => {
    //   try {
    //     setFetchingLayout(true);
    //     const response = await axios.get(`${api}get-layout/${categoryId}`, {
    //       headers: {
    //         Authorization: `Bearer ${authToken}`,
    //       },
    //     });

    //     const data = response.data;
    //     if (data.status && data.data) {
    //       const parsed = data.data;

    //       const transformedLayout = {
    //         userPhoto: JSON.parse(parsed.user_photo || "{}"),
    //         textValue_0: JSON.parse(parsed.text_1 || "{}"),
    //         textValue_1: JSON.parse(parsed.text_2 || "{}"),
    //         textValue_2: JSON.parse(parsed.text_3 || "{}"),
    //         qrCode: JSON.parse(parsed.qr_code || "{}"),
    //         zoneGroup: JSON.parse(parsed.zones || "{}"),
    //       };

    //       setSavedLayout(transformedLayout);
    //       handleSetIsCircle(transformedLayout.userPhoto?.isCircle || false);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch layout:", error);
    //   } finally {
    //     setFetchingLayout(false);
    //   }
    // };

    // fetchLayout();
  }, [categoryId, authToken, api, handleSetIsCircle]);

  useEffect(() => {
    setLoading(true);
    if(!previewUrl) {
      setFinalImage(null);
        setLoading(false);
        return;
    }
    const imgsrc = typeof previewUrl === "string" ? previewUrl : URL.createObjectURL(previewUrl);
    
    if (imgsrc && imgsrc?.startsWith("blob:")) {
      setFinalImage(previewUrl);
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
        console.log("Fetching images for previewUrl:", imgsrc);
      await Promise.all([
        FetchImageBlob(api, setLoading, imgsrc, setFinalImage, authToken),
      ]);
    };

    if (imgsrc) {
      fetchImages();
    }
    setLoading(false);
  }, [previewUrl, api, authToken]);

  // Memoize instruction data to prevent re-renders
  const memoizedInstructions = useMemo(() => instructionList, []);

  // Memoize dummy user data structure
  const memoizedUserData = useMemo(() => dummyUserData, [dummyUserData]);

  return (
    <>
      {previewUrl && (
        <div className="d-flex justify-content-between w-100 align-items-center mb-2">
          <h6 className="p-0 m-0">ID Card Preview</h6>
          <Button
            variant="outline-primary"
            size="sm"
            disabled={disabled}
            onClick={() => setShowSettingsModal(true)}
            className="d-flex align-items-center gap-2"
          >
            <Settings size={16} />
            Settings
          </Button>
        </div>
      )}

      <Modal
        show={showSettingsModal}
        onHide={() => setShowSettingsModal(false)}
        size="xl"
        centered
        dialogClassName="custom-modal"
        backdrop="static"
      >
        <Modal.Header closeButton className="sticky-top bg-white z-3">
          <Modal.Title>ID Card Layout Editor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Left Column: Form controls */}
            <Col md={6}>
              <h5>User Info</h5>
              <Form>
                <Row>
                  <Col xs={6} className="mb-3">
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={dummyUserData.name}
                        onChange={handleInputChange}
                        placeholder="Enter name"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group className="mb-3">
                      <Form.Label>Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="Number"
                        value={dummyUserData.Number}
                        onChange={handleInputChange}
                        placeholder="Enter Number"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group className="mb-3">
                      <Form.Label>email</Form.Label>
                      <Form.Control
                        type="text"
                        name="email_name"
                        value={dummyUserData.email}
                        onChange={handleInputChange}
                        placeholder="Enter email"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} className="mb-3">
                    <ImageStyleSelector
                      isCircle={isCircle}
                      setIsCircle={setIsCircle}
                    />
                  </Col>
                </Row>
              </Form>
              <div className="p-3 rounded-3 border">
                <h6 className="text-primary mb-3 fw-semibold">
                  <Info size={16} className="me-2" />
                  Editor Instructions
                </h6>
                <ul className="list-unstyled mb-0">
                  {memoizedInstructions.map((instruction, index) => (
                    <li
                      key={index}
                      className="mb-2 d-flex align-items-center gap-2"
                    >
                      <instruction.Icon size={14} className="text-secondary" />
                      <span>{instruction.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
            {/* Right Column: Canvas Editor */}
            <Col md={6}>
              <IDCardDragAndDrop
                finalImage={finalImage}
                userImage={profileImage}
                orderId="d$NzCUtf"
                bgRequired={true}
                userData={memoizedUserData}
                isEdit={true}
                isCircle={isCircle}
                setIsCircle={setIsCircle}
                setShowSettingsModal={setShowSettingsModal}
                setLayoutData={setLayoutData}
                categoryId={categoryId}
                savedLayout={savedLayout}
                fetchingLayout={fetchingLayout}
              />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CanvasSettings;
