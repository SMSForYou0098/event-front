import React, { useState, useRef } from "react";
import { Container, Row, Col, Card, Form, Button, Modal, Image, Badge } from "react-bootstrap";
import axios from "axios";
import { Armchair, BedDouble, Sofa } from "lucide-react";

const NewSeatingChart = ({ eventId, api, authToken, ErrorAlert, successAlert, tickets }) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [sections, setSections] = useState([]);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    const [sectionForm, setSectionForm] = useState({
        name: "",
        rows: 0,
        cols: 0,
        seatSpacing: 0,
        rowSpacing: 0
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = (e) => {
        if (!uploadedImage) return;

        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setSelectedPoint({ x, y });
        setShowSectionModal(true);
    };

    const handleAddSection = () => {
        const newSection = {
            ...sectionForm,
            id: Date.now(),
            position: selectedPoint,
            gaps: gapPositions // Add gaps to the section data
        };

        setSections([...sections, newSection]);
        setShowSectionModal(false);
        setSectionForm({
            name: "",
            rows: 0,
            cols: 0,
            seatSpacing: 0,
            rowSpacing: 0
        });
        setGapPositions([]); // Reset gaps
    };

    const handleSubmit = async () => {
        try {
            const configData = {
                image: uploadedImage,
                sections: sections,
                event_id: eventId
            };

            const response = await axios.post(
                `${api}seat-config-store`,
                configData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (response.data?.status) {
                successAlert("Seating configuration saved successfully!");
            }
        } catch (error) {
            ErrorAlert("Error saving seating configuration");
        }
    };
    const [seatPreview, setSeatPreview] = useState({
        rows: 2,
        cols: 4,
        seatType: 'standard' // 'standard', 'vip', 'lounge'
    });

    // Add seat icon mapping
    const seatIcons = {
        standard: <Armchair size={20} />,
        vip: <Sofa size={20} />,
        lounge: <BedDouble size={20} />
    };

    // Add this component inside your file
    // Add this to your state declarations
    const [gapPositions, setGapPositions] = useState([]);
    const [selectedGap, setSelectedGap] = useState({
        row: 0,
        afterSeat: 0,
        width: 1
    });

    // Modify the SeatPreview component
    const SeatPreview = ({ config, seatType, gaps }) => {
        return (
            <div className="seat-preview-container p-3 bg-light rounded">
                <h6 className="mb-3">Seat Arrangement Preview</h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: `${config.rowSpacing || 8}px` }}>
                    {Array(config.rows).fill(0).map((_, rowIndex) => (
                        <div key={rowIndex} style={{ display: 'flex', gap: `${config.seatSpacing || 8}px`, justifyContent: 'center' }}>
                            {Array(config.cols).fill(0).map((_, colIndex) => {
                                // Check if there should be a gap before this seat
                                const gap = gaps?.find(g => g.row === rowIndex && g.afterSeat === colIndex);

                                return (
                                    <React.Fragment key={`${rowIndex}-${colIndex}`}>
                                        <div
                                            style={{
                                                width: '30px',
                                                height: '30px',
                                                backgroundColor: '#e0e0e0',
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#666'
                                            }}
                                        >
                                            {seatIcons[seatType]}
                                        </div>
                                        {gap && (
                                            <div style={{
                                                width: `${gap.width * 30}px`,
                                                height: '30px',
                                                border: '1px dashed #999',
                                                borderRadius: '4px',
                                                margin: '0 4px'
                                            }} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Add this form group in the Modal.Body after existing form fields
    return (
        <Container fluid className="p-4">
            <Card>
                <Card.Header>
                    <Card.Title>Arena Layout Configuration</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload Arena Layout</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </Form.Group>

                            <div className="mt-4">
                                <h5>Added Sections:</h5>
                                {sections.map((section, index) => (
                                    <div key={section.id} className="mb-2 p-2 border rounded">
                                        <h6>{section.name}</h6>
                                        <small>
                                            Rows: {section.rows}, Columns: {section.cols}<br />
                                            Position: ({Math.round(section.position.x)}, {Math.round(section.position.y)})
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col md={8}>
                            <div
                                style={{
                                    position: 'relative',
                                    maxWidth: '100%',
                                    border: '1px solid #ccc'
                                }}
                            >
                                {uploadedImage ? (
                                    <Image
                                        ref={imageRef}
                                        src={uploadedImage}
                                        alt="Arena Layout"
                                        style={{ width: '100%', cursor: 'crosshair' }}
                                        onClick={handleImageClick}
                                    />
                                ) : (
                                    <div className="text-center p-5 bg-light">
                                        <p>Upload an image to start marking sections</p>
                                    </div>
                                )}

                                {sections.map((section) => (
                                    <div
                                        key={section.id}
                                        style={{
                                            position: 'absolute',
                                            left: section.position.x,
                                            top: section.position.y,
                                            width: '10px',
                                            height: '10px',
                                            backgroundColor: 'red',
                                            borderRadius: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                        title={section.name}
                                    />
                                ))}
                            </div>
                        </Col>
                    </Row>

                    <div className="mt-3 text-end">
                        <Button variant="primary" onClick={handleSubmit}>
                            Save Configuration
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Add Section</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Section Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={sectionForm.name}
                                        onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Number of Rows</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={seatPreview.rows}
                                        onChange={(e) => setSeatPreview(prev => ({
                                            ...prev,
                                            rows: parseInt(e.target.value) || 1
                                        }))}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Seats per Row</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={seatPreview.cols}
                                        onChange={(e) => setSeatPreview(prev => ({
                                            ...prev,
                                            cols: parseInt(e.target.value) || 1
                                        }))}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Seat Spacing (px)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={seatPreview.seatSpacing}
                                        onChange={(e) => setSectionForm({ ...sectionForm, seatSpacing: parseInt(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Row Spacing (px)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={seatPreview.rowSpacing}
                                        onChange={(e) => setSectionForm({ ...sectionForm, rowSpacing: parseInt(e.target.value) })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Gap Width (seats)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={selectedGap.width}
                                        onChange={(e) => setSelectedGap({
                                            ...selectedGap,
                                            width: parseInt(e.target.value) || 1
                                        })}
                                    />
                                </Form.Group>
                            </Col>

                            <h6>Add Space Between Seats</h6>
                            <Row className="g-3">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Row Number</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            max={seatPreview.rows - 1}
                                            value={selectedGap.row}
                                            onChange={(e) => setSelectedGap({
                                                ...selectedGap,
                                                row: parseInt(e.target.value) || 0
                                            })}
                                        />
                                        <Form.Text className="text-muted">
                                            Starting from 0
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>From Seat</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            max={seatPreview.cols - 2}
                                            value={selectedGap.startSeat}
                                            onChange={(e) => setSelectedGap({
                                                ...selectedGap,
                                                startSeat: parseInt(e.target.value) || 0,
                                                endSeat: Math.max(parseInt(e.target.value) + 1, selectedGap.endSeat)
                                            })}
                                        />
                                        <Form.Text className="text-muted">
                                            Starting from 0
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>To Seat</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min={selectedGap.startSeat + 1}
                                            max={seatPreview.cols - 1}
                                            value={selectedGap.endSeat}
                                            onChange={(e) => setSelectedGap({
                                                ...selectedGap,
                                                endSeat: parseInt(e.target.value) || selectedGap.startSeat + 1
                                            })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Blank Seats</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={selectedGap.width}
                                            onChange={(e) => setSelectedGap({
                                                ...selectedGap,
                                                width: parseInt(e.target.value) || 1
                                            })}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => {
                                            setGapPositions([...gapPositions, { ...selectedGap }]);
                                            setSelectedGap({ row: 0, startSeat: 0, endSeat: 1, width: 1 });
                                        }}
                                        disabled={selectedGap.endSeat <= selectedGap.startSeat}
                                    >
                                        Add Space
                                    </Button>
                                </Col>
                            </Row>
                            {gapPositions.length > 0 && (
                                <div className="mt-3">
                                    <h6>Added Gaps:</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {gapPositions.map((gap, index) => (
                                            <Badge
                                                key={index}
                                                bg="light"
                                                text="dark"
                                                className="d-flex align-items-center gap-2"
                                            >
                                                Row {gap.row}, After Seat {gap.afterSeat} (Width: {gap.width})
                                                <Button
                                                    size="sm"
                                                    variant="link"
                                                    className="p-0 text-danger"
                                                    onClick={() => setGapPositions(gaps => gaps.filter((_, i) => i !== index))}
                                                >
                                                    ×
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Col md={12}>
                                <div className="preview-container">
                                    <SeatPreview
                                        config={seatPreview}
                                        seatType={seatPreview.seatType}
                                        gaps={gapPositions}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSectionModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddSection}>
                        Add Section
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container >
    );
};

export default NewSeatingChart;