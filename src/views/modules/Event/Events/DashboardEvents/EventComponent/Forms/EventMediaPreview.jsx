import React from "react";
import { motion } from "framer-motion";
import { Button, Col, Image, Row } from "react-bootstrap";
import CanvasSettings from "../../../../CustomUtils/CanvasSettings";
import { X } from "lucide-react";

export const PhotosGallary = (props) => {
  const { imagepreview, setImages, setImagepreview, images, isCircle, setIsCircle } = props;
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagepreview.filter((_, i) => i !== index);

    setImages(newImages);
    setImagepreview(newPreviews);
  };
  return (
    <Row className="mt-2 g-5">
      {imagepreview.map((preview, index) => (
        <Col xs={3} sm={3} md={3} lg={3} key={index}>
          <div
            className="position-relative"
            style={{ width: "100%", paddingTop: "100%" }}
          >
            <Image
              src={preview || "/placeholder.svg"}
              alt={`Image ${index + 1}`}
              className="position-absolute top-0 start-0 w-100 h-100 object-cover rounded-5"
            />
            <Button
              variant="danger"
              size="sm"
              className="position-absolute top-0 end-0 p-1 rounded-circle d-flex align-items-center justify-content-center"
              style={{
                transform: "translate(50%, -50%)",
                width: "24px",
                height: "24px",
                minWidth: "24px",
                border: "none",
              }}
              onClick={() => removeImage(index)}
            >
              <X size={12} />
            </Button>
          </div>
        </Col>
      ))}
    </Row>
  );
};

const EventMediaPreview = (props) => {
  const { idCard, instaThumb, layoutImagePreview, savedLayout } = props;
    const { setLayoutData, isCircle, setIsCircle, categoryId, imageLoading } = props;

  const textAnimationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.2, duration: 0.3 },
  };
  const renderIdCardPlaceholder = (src) =>
    src ? (
      <div>
        <img
          src={typeof src === "string" ? src : URL.createObjectURL(src)}
          alt="ID Card Preview"
          style={{
            width: 204,
            height: 321,
            objectFit: "cover",
            borderRadius: 10,
          }}
        />
      </div>
    ) : (
      <div
        className="d-flex flex-column justify-content-center align-items-center text-muted"
        style={{
          border: "2px dashed var(--bs-secondary)",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
          padding: "10px",
          width: `204px`,
          height: `321px`,
          overflow: "hidden",
        }}
      >
        <motion.div {...textAnimationProps}>
          No file selected
          <br />
          <small>Expected size: 321×204px</small>
          <br />
          <small>ID Card Preview</small>
        </motion.div>
      </div>
    );

  const renderImagePreview = (src, alt = "Preview") =>
    src ? (
      <div className="mb-3">
        <img
          src={typeof src === "string" ? src : URL.createObjectURL(src)}
          alt={alt}
          style={{
            maxWidth: "200px",
            maxHeight: "200px",
            objectFit: "cover",
            borderRadius: 10,
          }}
        />
      </div>
    ) : (
      <div
        className="d-flex flex-column justify-content-center align-items-center text-muted"
        style={{
          border: "2px dashed var(--bs-secondary)",
          borderRadius: "8px",
          fontSize: "14px",
          textAlign: "center",
          padding: "10px",
          width: `200px`,
          height: `200px`,
          overflow: "hidden",
        }}
      />
    );
  return (
    <Row>
      <Col
        md={6}
        className="d-flex flex-column align-items-center justify-content-center"
      >
        <CanvasSettings
          previewUrl={idCard}
          setLayoutData={setLayoutData}
          isCircle={isCircle}
          setIsCircle={setIsCircle}
          categoryId={categoryId}
          disabled={imageLoading}
          savedLayout={savedLayout}
        />
        {renderIdCardPlaceholder(idCard)}
      </Col>
      <Col
        md={6}
        className="d-flex flex-column align-items-center justify-content-centerer"
      >
        <Row className="g-3">
          <Col md={12}>
            <div>
              <h6 className="mb-2">Instagram Thumbnail</h6>
              {renderImagePreview(instaThumb, "Instagram Thumbnail")}
            </div>
          </Col>
          <Col md={12}>
            <div>
              <h6 className="mb-2">Ground/Arena Layout</h6>
              {renderImagePreview(layoutImagePreview, "Layout Image")}
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default EventMediaPreview;
