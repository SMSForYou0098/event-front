import React from 'react';
import { Form, Button, Image, Row, Col } from 'react-bootstrap';
import imgsuccess from "../../../../../../../assets/images/pages/img-success.png";
import { Link } from 'react-router-dom';
const PublishFieldset = ({ validated, UpdateEvent, show, name, id, metaTitle, setMetaTitle, metaDescription, setMetaDescription, keywords, setKeywords, metaTag, setMetaTag }) => {
    return (
        <fieldset className={`${show === "Publish" ? "d-block" : "d-none"}`}>
            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                <Row>
                    <Col md={6}>
                        <h4>SEO & Publish </h4>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter title"
                                value={metaTitle}
                                onChange={(e) => setMetaTitle(e.target.value)}

                            />
                        </Form.Group>

                        <Form.Group controlId="formMetaDescription">
                            <Form.Label>Meta Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter meta description"
                                value={metaDescription}
                                onChange={(e) => setMetaDescription(e.target.value)}

                            />
                        </Form.Group>

                        <Form.Group controlId="formKeywords">
                            <Form.Label>Keywords</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter keywords (comma separated)"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formTag">
                            <Form.Label>Tag</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter a tag"
                                value={metaTag}
                                onChange={(e) => setMetaTag(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <div className="form-card">
                            <h2 className="text-success text-center">
                                <strong>You Have Successfully Created Event !</strong>
                            </h2>
                            <br />
                            <div className="row justify-content-center">
                                <div className="col-3">
                                    <div className="d-flex justify-content-center align-items-center flex-column">
                                        <Image
                                            src={imgsuccess}
                                            // className="img-fluid"
                                            alt="fit-image"
                                            width={200}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" className="action-button float-end">
                            Publish
                        </Button>
                    </Col>
                </Row>
            </Form>
        </fieldset>
    );
};

export default PublishFieldset;
