import React from 'react';
import { Form, Button } from 'react-bootstrap';

const LocationFieldset = ({
    validated,
    UpdateEvent,
    mapCode,
    handleInputChange,
    show
}) => {
    return (
        <fieldset className={`${show === "Location" ? "d-block" : "d-none"}`}>
            <Form validated={validated} onSubmit={(e) => UpdateEvent(e)} className="needs-validation" noValidate>
                <div className="form-card">
                    <div className="row">
                        <div className="col-md-12">
                            <Button type="submit" className="action-button float-end">
                                Next
                            </Button>
                        </div>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label className="form-label">Your google map embed code: *</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    placeholder={`Your google map iframe...`}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        {mapCode && (
                            <div className="col-md-12">
                                <iframe
                                    className="w-100"
                                    title="map"
                                    src={mapCode}
                                    height="500"
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>
                        )}
                    </div>
                </div>
            </Form>
        </fieldset>
    );
};

export default LocationFieldset;
