import React, { useState } from 'react'
import { Button, Card, Col, Image, Row,Form } from 'react-bootstrap'
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
const ForMobile = () => {
    const { api, successAlert, authToken, ErrorAlert } = useMyContext();
    const [imageFields, setImageFields] = useState([{ imagePreviewUrl: '', backgroundImage: null }]);
    const handleBackGround = (e, index) => {
        const file = e.target.files[0];
        const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (file) {
            if (validFormats.includes(file.type)) {
                const img = new window.Image();
                img.onload = () => {
                    URL.revokeObjectURL(img.src);
                    // Set the background image and preview URL without dimension validation
                    const updatedFields = [...imageFields];
                    updatedFields[index].backgroundImage = file;
                    updatedFields[index].imagePreviewUrl = URL.createObjectURL(file); // Create a preview URL
                    setImageFields(updatedFields);
                };
                img.onerror = () => {
                    ErrorAlert('Error loading image. Please try again.');
                };
                img.src = URL.createObjectURL(file);
            } else {
                ErrorAlert('Invalid file format. Please upload an image in JPG, JPEG, PNG, or WEBP format.');
            }
        }
    };

    const addImageField = () => {
        setImageFields([...imageFields, { imagePreviewUrl: '', backgroundImage: null }]);
    };
    const handleRemoveImage = () => {
        const updatedFields = imageFields.filter((_, index) => index !== imageFields.length - 1);
        setImageFields(updatedFields);
    }

    const handleSubmit = async () => {
        const formData = new FormData();

        // Append each image file to the formData object
        imageFields?.forEach((field, index) => {
            if (field?.backgroundImage) {
                formData.append(`image_${index + 1}`, field.backgroundImage);
            }
        });

        try {
            const response = await axios.post(`${api}sponsorsImages`, formData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.status) {
                successAlert('Images uploaded successfully!');
            }
        } catch (error) {
            ErrorAlert('Error uploading images. Please try again.');
        }
    };
    return (
        <Row>
            <Col md={6}>
                <Card>
                    <Card.Header>
                        <div className='d-flex justify-content-between'>
                            <h4 className="card-title">Artist Images</h4>
                            <Button type="button" onClick={(e) => handleSubmit(e)}>Submit</Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {imageFields?.map((field, index) => (
                                <>
                                    <Col md={10} key={index}>
                                        <Form.Group className="mb-3 form-group">
                                            <Form.Label>Artist Image {index + 1}</Form.Label>
                                            <Form.Control
                                                type="file"
                                                id={`customFile${index}`}
                                                accept=".jpg, .jpeg, .png, .webp"
                                                onChange={(e) => handleBackGround(e, index)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    {index > 0 ? (
                                        <Col lg="1" key={index} className='d-flex justify-content-start align-items-center mt-2'>
                                            <Button type="button" className='m-0 p-0' variant="link" onClick={() => handleRemoveImage(index)}>
                                                <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.4" d="M16.34 1.99976H7.67C4.28 1.99976 2 4.37976 2 7.91976V16.0898C2 19.6198 4.28 21.9998 7.67 21.9998H16.34C19.73 21.9998 22 19.6198 22 16.0898V7.91976C22 4.37976 19.73 1.99976 16.34 1.99976Z" fill="currentColor"></path>
                                                    <path d="M15.0158 13.7703L13.2368 11.9923L15.0148 10.2143C15.3568 9.87326 15.3568 9.31826 15.0148 8.97726C14.6728 8.63326 14.1198 8.63426 13.7778 8.97626L11.9988 10.7543L10.2198 8.97426C9.87782 8.63226 9.32382 8.63426 8.98182 8.97426C8.64082 9.31626 8.64082 9.87126 8.98182 10.2123L10.7618 11.9923L8.98582 13.7673C8.64382 14.1093 8.64382 14.6643 8.98582 15.0043C9.15682 15.1763 9.37982 15.2613 9.60382 15.2613C9.82882 15.2613 10.0518 15.1763 10.2228 15.0053L11.9988 13.2293L13.7788 15.0083C13.9498 15.1793 14.1728 15.2643 14.3968 15.2643C14.6208 15.2643 14.8448 15.1783 15.0158 15.0083C15.3578 14.6663 15.3578 14.1123 15.0158 13.7703Z" fill="currentColor"></path>
                                                </svg>
                                            </Button>
                                        </Col>
                                    ) : (
                                        <Col lg={1}></Col>
                                    )}
                                </>
                            ))}
                            <Col lg={imageFields.length > 1 ? '12' : '1'} className={`d-flex align-items-center mt-3`}>
                                <span className='d-flex w-100 justify-content-center'>
                                    <Button className='p-0 m-0' type="button" variant="link" onClick={() => addImageField()}>
                                        <svg
                                            width={'40'}
                                            className="icon-45 hvr-icon"
                                            viewBox="0 0 28 28"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.33 2H16.66C20.06 2 22 3.92 22 7.33V16.67C22 20.06 20.07 22 16.67 22H7.33C3.92 22 2 20.06 2 16.67V7.33C2 3.92 3.92 2 7.33 2ZM12.82 12.83H15.66C16.12 12.82 16.49 12.45 16.49 11.99C16.49 11.53 16.12 11.16 15.66 11.16H12.82V8.34C12.82 7.88 12.45 7.51 11.99 7.51C11.53 7.51 11.16 7.88 11.16 8.34V11.16H8.33C8.11 11.16 7.9 11.25 7.74 11.4C7.59 11.56 7.5 11.769 7.5 11.99C7.5 12.45 7.87 12.82 8.33 12.83H11.16V15.66C11.16 16.12 11.53 16.49 11.99 16.49C12.45 16.49 12.82 16.12 12.82 15.66V12.83Z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                    </Button>
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            {imageFields.map((field, index) => (
                                <Col md={12} key={index}>
                                    <div className="image-preview-container">
                                        <Image
                                            src={field.imagePreviewUrl ? field.imagePreviewUrl : `https://placehold.co/600x200`}
                                            alt={`Background Image Preview ${index + 1}`}
                                            fluid
                                            style={{ border: '1px solid #ddd', borderRadius: '5px', marginTop: '10px' }}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ForMobile