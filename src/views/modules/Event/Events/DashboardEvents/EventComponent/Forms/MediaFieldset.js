import React, { useEffect, useState } from 'react';
import { Form, Button, Image, Col, Card, Row } from 'react-bootstrap';
import { Dashboard, Tus, Uppy } from "uppy";
import { useMyContext } from '../../../../../../../Context/MyContextProvider';
import { X } from 'lucide-react';
import { processImageFile } from '../../../../CustomComponents/AttendeeStroreUtils';


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
                        <div className="col-md-6">
                            <Form.Group className="mb-3 form-group">
                                <Form.Label className="custom-file-input">Thumbnail Image</Form.Label>
                                <div className="file-uploader"></div>
                                <span>Upload 16:9 ratio thumbnail image of atleast 600x725 px (jpg/jpeg/png)</span>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Row>
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
                                {/* Show upload button if less than 4 images */}
                                {imagepreview.length < 4 && (
                                    <Col xs={3} sm={3} md={3} lg={3} >
                                        <Card className="d-flex align-items-center justify-content-center">
                                            <Card.Body className="p-2">
                                                <Form.Group controlId="image-upload">
                                                    <Form.Label>Upload Image</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageChange(e, imagepreview.length)}
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}
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
                                <Col lg="12">
                                    <Form.Group className="mb-3 form-group d-flex align-items-center gap-3">
                                        <div className="flex-grow-1">
                                            <Form.Label>ID Card : (282 × 260 px)</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setIdCard(e.target.files[0])}
                                            />
                                        </div>
                                        {idCard && (
                                            <div>
                                                <img
                                                    src={
                                                        typeof idCard === 'string'
                                                            ? idCard
                                                            : URL.createObjectURL(idCard)
                                                    }
                                                    alt="ID Card Preview"
                                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                                                />
                                            </div>
                                        )}
                                    </Form.Group>
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
                                    {instaThumb && (
                                        <div className="mt-2">
                                            <Image
                                                src={URL.createObjectURL(instaThumb)}
                                                alt="Instagram Thumbnail Preview"
                                                style={{
                                                    maxWidth: "50%",
                                                    height: "auto",
                                                    borderRadius: "10px"
                                                }}
                                            />
                                        </div>
                                    )}
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
                                {layoutImagePreview && (
                                    <Col md="12" className="mt-3">
                                        <Image src={layoutImagePreview} alt="Preview" style={{ maxWidth: "50%", height: "auto", borderRadius: "10px" }} />
                                    </Col>
                                )}
                            </Row>
                        </div>
                    </div>

                </div>
            </Form>
        </fieldset >
    );
};

export default MediaFieldset;
