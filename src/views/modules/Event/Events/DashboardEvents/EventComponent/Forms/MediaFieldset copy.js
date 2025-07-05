import React, { useEffect, useState } from 'react';
import { Form, Button, Image, Col, Card, Row } from 'react-bootstrap';
import { Dashboard, Tus, Uppy } from "uppy";
import { useMyContext } from '../../../../../../../Context/MyContextProvider';
import { X } from 'lucide-react';
import { processImageFile } from '../../../../CustomComponents/AttendeeStroreUtils';
import { motion, AnimatePresence } from "framer-motion";

const MediaFieldset = ({
    validated,
    UpdateEvent,
    imagepreview,
    youtubeUrl,
    loading,
    setThumbnail,
    setIdCard,
    idCard,
    setYoutubeUrl,
    show,
    setImagepreview,
    setImages,
    images,
    setLayoutImage,
    layoutImage,
    layoutImagePreview,
    setLayoutImagePreview,
    instaUrl,
    setInstaUrl,
    instaThumb,
    setInstaThumb,
}) => {

    const { ErrorAlert } = useMyContext();

    const [imageLimitReached, setImageLimitReached] = useState(false);

    useEffect(() => {
        if (!loading) {
            const uppy = new Uppy({
                restrictions: {
                    maxFileSize: 2 * 1024 * 1024, // 2MB
                    allowedFileTypes: ['image/*'],
                    maxNumberOfFiles: 1
                }
            })
                .use(Dashboard, {
                    inline: true,
                    note: 'Images only (JPG, JPEG, PNG), up to 2MB',
                    target: '.file-uploader',
                    proudlyDisplayPoweredByUppy: false
                })
                .use(Tus, { endpoint: 'https://master.tus.io/files/' });

            uppy.on('file-added', (file) => {
                if (!file.type.startsWith('image/')) {
                    ErrorAlert('Please upload only image files!');
                    uppy.removeFile(file.id);
                    return;
                }
            });

            uppy.on('upload-success', (file) => {
                const image = new window.Image();
                image.src = window.URL.createObjectURL(file.data);

                image.onload = function () {
                    if (this.width === 600 && this.height === 725) {
                        setThumbnail(file?.data)
                    } else {
                        ErrorAlert("Please upload an image with dimensions of 600x725 pixels!");
                        uppy.removeFile(file.id);
                    }
                };
            });

            return () => {
                uppy.close();
            };
        }
    }, [loading]);


    // Function to handle file selection
    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        const newImages = [...images];
        const newPreviews = [...imagepreview];

        newImages[index] = file;
        newPreviews[index] = URL.createObjectURL(file);

        setImages(newImages);
        setImagepreview(newPreviews);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagepreview.filter((_, i) => i !== index);

        setImages(newImages);
        setImagepreview(newPreviews);
    };

    const handleInstaThumbChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const compressed = await processImageFile(file);
            if (compressed) {
                // Create a new Blob from the compressed data
                const blob = new Blob([compressed], { type: file.type });
                setInstaThumb(blob);
            }
        } catch (error) {
            ErrorAlert('Error processing image. Please try again.');
            // console.error('Error processing image:', error);
        }
    };

    const handleLayoutImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLayoutImage(file);
            setLayoutImagePreview(URL.createObjectURL(file));
        }
    };

    const textAnimationProps = {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2, duration: 0.3 },
    };
    const renderPlaceholder = (src) => (
        src ? (
            <div>
                <img
                    src={
                        typeof src === 'string'
                            ? src
                            : URL.createObjectURL(src)
                    }
                    alt="ID Card Preview"
                    style={{ width: 204, height: 321, objectFit: 'cover', borderRadius: 10 }}
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
                    <small>
                        Expected size: 321×204px
                    </small>
                    <br />
                    <small>ID Card Preview</small>
                </motion.div>
            </div>
        )
    );
    return (
        <fieldset className={`${show === "Media" ? "d-block" : "d-none"}`}>
            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                <div className="form-card text-start">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3">
                                <Button
                                    type="submit"
                                    name=""
                                    className="action-button float-end"
                                    value=""
                                // onClick={() => AccountShow("Timing")}
                                >
                                    Save & Next
                                </Button>
                            </div>
                        </div>
                        <Row className=''>
                            <div className="col-md-5">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="custom-file-input">Thumbnail Image</Form.Label>
                                    <div className="file-uploader"></div>
                                    <span>Upload 16:9 ratio thumbnail image of atleast 600x725 px (jpg/jpeg/png)</span>
                                </Form.Group>
                            </div>
                            <div className="col-md-7">
                                <Row className='align-items-center'>
                                    <Col lg="4">
                                        <Row>
                                            {/* col 12 */}
                                            <Col xs={12} className="mb-3">
                                                <Form.Group className="mb-3 form-group d-flex align-items-center gap-3">
                                                    <div className="flex-grow-1">
                                                        <Form.Label>ID Card : (321 × 204 px)</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setIdCard(e.target.files[0])}
                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col md='12'>
                                                <div className="form-group">
                                                    <label className="form-label">YouTube Video URL (Optional): *</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="yt"
                                                        value={youtubeUrl}
                                                        placeholder="https://www.youtube.com/watch?v=Zjq1zRWpcgs"
                                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='12'>
                                                <div className="form-group">
                                                    <label className="form-label">Instagram URL (Optional):</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="insta"
                                                        value={instaUrl}
                                                        placeholder="https://www.instagram.com/p/xyz123"
                                                        onChange={(e) => setInstaUrl(e.target.value)}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md='12'>
                                                <Form.Group controlId="insta-thumb-upload">
                                                    <Form.Label>Instagram Thumbnail (Optional)</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleInstaThumbChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md='12'>
                                                <Form.Group controlId="image-upload">
                                                    <Form.Label>Ground/Arena Layout Image</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleLayoutImageChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col lg="8" className='justify-content-center d-flex align-items-center'>
                                        {renderPlaceholder(idCard)}
                                        {renderPlaceholder(instaThumb)}
                                        {renderPlaceholder(layoutImagePreview)}
                                    </Col>
                                </Row>
                                <div className="col-lg-12">
                                    {/* Show upload button if less than 4 images */}
                                    {imagepreview.length < 4 && (
                                        <Form.Group controlId="image-upload">
                                            <Form.Label>Upload Image</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, imagepreview.length)}
                                            />
                                        </Form.Group>
                                    )}
                                    <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
                                        {imagepreview.map((preview, index) => (
                                            <Col xs={3} sm={3} md={3} lg={3} key={index}>
                                                <Card className="position-relative">
                                                    <Card.Body className="p-2">
                                                        <div className="position-relative" style={{ width: "100%", paddingTop: "100%" }}>
                                                            <Image
                                                                src={preview || "/placeholder.svg"}
                                                                alt={`Image ${index + 1}`}
                                                                className="position-absolute top-0 start-0 w-100 h-100 object-cover rounded"
                                                            />
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                className="position-absolute top-0 end-0 p-1"
                                                                style={{ transform: "translate(50%, -50%)", borderRadius: "50%" }}
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <X size={12} />
                                                            </Button>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </div>

                </div>
            </Form>
        </fieldset >
    );
};

export default MediaFieldset;
