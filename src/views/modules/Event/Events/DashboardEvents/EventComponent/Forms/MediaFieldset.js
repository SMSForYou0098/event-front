import React, { useEffect, useState } from 'react';
import { Form, Button, Image, Col, Card, Row } from 'react-bootstrap';
import { Dashboard, Tus, Uppy } from "uppy";
import { useMyContext } from '../../../../../../../Context/MyContextProvider';
import { X } from 'lucide-react';
import { processImageFile } from '../../../../CustomComponents/AttendeeStroreUtils';
import EventMediaPreview, { PhotosGallary } from './EventMediaPreview';


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
    setIsCircle,
    isCircle
}) => {

    const { ErrorAlert } = useMyContext();

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
                        <Row className=''>
                            <div className="col-md-5">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="custom-file-input">Thumbnail Image</Form.Label>
                                    <div className="file-uploader"></div>
                                    <span>Upload 16:9 ratio thumbnail image of atleast 600x725 px (jpg/jpeg/png)</span>
                                </Form.Group>
                            </div>
                            <Col md="7">
                                <Row className='align-items-center'>
                                    {/* media fields  */}
                                    <Col lg="6">
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
                                    <Col lg="6" className="mt-3">
                                        <EventMediaPreview
                                            idCard={idCard}
                                            instaThumb={instaThumb}
                                            layoutImagePreview={layoutImagePreview}
                                            setIsCircle={setIsCircle}
                                            isCircle={isCircle}
                                        />
                                    </Col>
                                </Row>
                                <Col md="12">
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
                                    <PhotosGallary
                                        imagepreview={imagepreview}
                                        handleImageChange={handleImageChange}
                                        setImagepreview={setImagepreview}
                                        setImages={setImages}
                                        images={images}
                                        setIsCircle={setIsCircle}
                                        isCircle={isCircle}
                                    />
                                </Col>
                            </Col>
                        </Row>
                    </div>

                </div>
            </Form>
        </fieldset >
    );
};

export default MediaFieldset;
