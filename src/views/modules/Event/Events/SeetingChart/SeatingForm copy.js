import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Image, Modal, Button } from "react-bootstrap";
import { Sofa, Armchair, BedDouble, Ticket } from "lucide-react";
import axios from "axios";

const SeatingForm = ({ eventId, api, authToken, ErrorAlert, successAlert,tickets }) => {
    const [config, setConfig] = useState({
        topRows: 2,
        bottomRows: 2,
        leftRows: 9,
        rightRows: 9,
        topSeats: 8,
        bottomSeats: 8,
        leftSeats: 2,
        rightSeats: 2,
        imageWidth: 100,
        imageHeight: 300
    }); 
    const [sortedTickets, setSortedTickets] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [seatCategory, setSeatCategory] = useState("");
    const [seatCategories, setSeatCategories] = useState({});

    const getExistingSeatConfig = async () => {
        try {
            if (!eventId) {
                ErrorAlert("Missing required parameters: config or eventId");
            }

            const response = await axios.get(`${api}seat-config/${eventId}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            if (response.data?.status) {
                const seatData = response.data?.seats || [];
                const formattedSeats = seatData.reduce((acc, seat) => {
                    acc[seat?.seat_id] = seat?.category;
                    return acc;
                }, {});
                setSeatCategories(formattedSeats);
               setConfig(JSON.parse(response.data?.configData?.config))

            }
        } catch (error) {
            ErrorAlert("Error updating seat config:", error.response?.data || error.message);
        }
    }

    useEffect(() => {
        if (tickets?.length) {
           const sorted = [...tickets].sort((a, b) => b.price - a.price);
            setSortedTickets(sorted);
        }
        getExistingSeatConfig();
    }, [tickets]);

    // States for range selection
    const [rangeStartSeat, setRangeStartSeat] = useState(null);
    const seatColors = {
        VIP: "gold",
        Regular: "blue",
        Economy: "green",
        Disabled: "gray", // Added "Disabled" category
    };

    const selectionColors = {
        available: "#E8E8E8",       // Light gray for available seats
        hover: "#B8E6FF",          // Light blue for hover state
        selected: "#FF4B4B",       // Bright red for selected seats
        rangeStart: "#8B4FFF",     // Bright purple for range start
        inRange: "#FFB84D",        // Warm orange for potential range
        assigned: "#808080"        // Gray for assigned seats
    };



    // Helper function to get seats between two seats
    const getSeatsInRange = (startSeat, endSeat) => {
        // Parse seat IDs to get section and alphanumeric position
        const parseId = (id) => {
            const [section, rowStr, seatStr] = id.split('-');
            const rowNum = parseInt(rowStr.substring(1));
            const seatNum = parseInt(seatStr.substring(1));

            // Calculate section-specific row label
            let sectionStartRow;
            switch (section) {
                case 'Top': sectionStartRow = 1; break;
                case 'Left': sectionStartRow = config.topRows + 1; break;
                case 'Right': sectionStartRow = config.topRows + 1; break;
                case 'Bottom': sectionStartRow = config.topRows + Math.max(config.leftRows, config.rightRows) + 1; break;
                default: sectionStartRow = 1;
            }

            const totalRowNumber = sectionStartRow + rowNum - 1;
            const sectionIndex = Math.floor((totalRowNumber - 1) / 9);
            const rowLabel = `${String.fromCharCode(65 + sectionIndex)}${((totalRowNumber - 1) % 9) + 1}`;

            return {
                section,
                originalRow: rowNum,
                originalSeat: seatNum,
                rowLabel,
                absoluteRow: totalRowNumber
            };
        };

        const start = parseId(startSeat);
        const end = parseId(endSeat);

        // Only allow range selection within same section
        if (start.section !== end.section) {
            return [startSeat];
        }

        const selectedSeats = [];

        // Determine if selection is horizontal (same absolute row) or vertical (same seat number)
        const isHorizontalSelection = start.absoluteRow === end.absoluteRow;
        const isVerticalSelection = start.originalSeat === end.originalSeat;

        if (!isHorizontalSelection && !isVerticalSelection) {
            return [startSeat];
        }

        if (isHorizontalSelection) {
            const minSeat = Math.min(start.originalSeat, end.originalSeat);
            const maxSeat = Math.max(start.originalSeat, end.originalSeat);

            for (let seat = minSeat; seat <= maxSeat; seat++) {
                const seatId = `${start.section}-R${start.originalRow}-S${seat}`;
                const seatExists = (
                    (start.section === 'Top' && seat <= config.topSeats) ||
                    (start.section === 'Bottom' && seat <= config.bottomSeats) ||
                    (start.section === 'Left' && seat <= config.leftSeats) ||
                    (start.section === 'Right' && seat <= config.rightSeats)
                );

                if (seatExists && !seatCategories[seatId]) {
                    selectedSeats.push(seatId);
                }
            }
        } else if (isVerticalSelection) {
            const minRow = Math.min(start.originalRow, end.originalRow);
            const maxRow = Math.max(start.originalRow, end.originalRow);

            for (let row = minRow; row <= maxRow; row++) {
                const seatId = `${start.section}-R${row}-S${start.originalSeat}`;
                const rowExists = (
                    (start.section === 'Top' && row <= config.topRows) ||
                    (start.section === 'Bottom' && row <= config.bottomRows) ||
                    (start.section === 'Left' && row <= config.leftRows) ||
                    (start.section === 'Right' && row <= config.rightRows)
                );

                if (rowExists && !seatCategories[seatId]) {
                    selectedSeats.push(seatId);
                }
            }
        }
        //  console.log(selectedSeats)
        return selectedSeats;
    };

    const handleSeatClick = (seatId) => {
        if (seatCategories[seatId]) return; // Prevent selecting assigned seats

        if (!rangeStartSeat) {
            // Start a new selection range
            setRangeStartSeat(seatId);
            setSelectedSeats((prev) => [...prev, seatId]); // Add new selection
        } else {
            // Get all seats in range and append them to selectedSeats
            const seatsInRange = getSeatsInRange(rangeStartSeat, seatId);
            setSelectedSeats((prev) => [...new Set([...prev, ...seatsInRange])]); // Merge without duplicates
            setRangeStartSeat(null);
        }
    };

    const [bulkSeatAssignments, setBulkSeatAssignments] = useState([]);
    const handleBulkAssign = () => {
        if (!seatCategory) return;

        const newCategories = { ...seatCategories };
        selectedSeats.forEach(seatId => {
            newCategories[seatId] = seatCategory;
        });
        setBulkSeatAssignments(prevAssignments => {
            const updatedAssignments = [
                ...prevAssignments,
                ...selectedSeats.map(seatId => ({
                    seat_id: seatId,
                    category: seatCategory,
                    ...(seatCategory === "Disabled" ? { disabled: true } : { disabled: false })
                }))
            ];
            return updatedAssignments;
        });

        setSeatCategories(newCategories);
        setSelectedSeats([]);
        setSeatCategory("");
        setShowModal(false);
        setRangeStartSeat(null);
    };

    const cancelSelection = () => {
        setSelectedSeats([]);
        setRangeStartSeat(null);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setConfig((prev) => ({
            ...prev,
            [name]: Number(value) || 0
        }));
    };

    const seatIcons = {
        VIP: <Sofa size={20} color="#fff" />,
        Standard: <Armchair size={20} color="#fff" />,
        Lounge: <Armchair size={20} color="#fff" />,
        Bed: <BedDouble size={20} color="#fff" />,
        Reserved: <Ticket size={20} color="#fff" />
    };


    const updateSeatConfig = async () => {
        try {
            if (!config || !eventId) {
                ErrorAlert("Missing required parameters: config or eventId");
            }

            const response = await axios.post(`${api}seat-config-store`, {
                config,
                event_id: eventId,
                ground_type: 'rectangle',
                event_type: 'outdoor'
            },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            if (response.data?.status) {
                bulkAssignSeats(response.data.configData?.id);
                successAlert("Seat config updated successfully")
            }
        } catch (error) {
            ErrorAlert("Error updating seat config:", error.response?.data || error.message);
        }
    };


    const bulkAssignSeats = async (condfigId) => {
        try {
            if (!config || !eventId) {
                ErrorAlert("Missing required parameters: config or eventId");
            }

            const response = await axios.post(`${api}event-seat-store`, {
                seats: bulkSeatAssignments,
                event_id: eventId,
                config_id: condfigId
            },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );
            if (response.data?.status) {
                successAlert("Seat config updated successfully")
            }
        } catch (error) {
            ErrorAlert("Error updating seat config:", error.response?.data || error.message);
        }
    };



    const renderSeats = (rows, cols, section) => {
        let sectionStartRow;
        switch (section) {
            case 'Top': sectionStartRow = 1; break;
            case 'Left': sectionStartRow = config.topRows + 1; break;
            case 'Right': sectionStartRow = config.topRows + 1; break;
            case 'Bottom': sectionStartRow = config.topRows + Math.max(config.leftRows, config.rightRows) + 1; break;
            default: sectionStartRow = 1;
        }

        return (
            <div style={{ display: "grid", gap: "4px" }}>
                {[...Array(rows)]?.map((_, rowIndex) => {
                    const totalRowNumber = sectionStartRow + rowIndex;
                    const sectionIndex = Math.floor((totalRowNumber - 1) / 9);
                    let rowLabel;
                    if (section === 'Right') {
                        rowLabel = `R${String.fromCharCode(65 + sectionIndex)}${((totalRowNumber - 1) % 9) + 1}`;
                    } else if (section === 'Left') {
                        rowLabel = `L${String.fromCharCode(65 + sectionIndex)}${((totalRowNumber - 1) % 9) + 1}`;
                    } else {
                        rowLabel = `${String.fromCharCode(65 + sectionIndex)}${((totalRowNumber - 1) % 9) + 1}`;
                    }

                    return (
                        <div key={rowIndex} style={{ display: "flex", gap: "4px" }}>
                            {[...Array(cols)]?.map((_, colIndex) => {
                                const seatNumber = colIndex + 1;
                                const displayId = `${rowLabel}-${seatNumber}`;
                                const seatId = `${section}-R${rowIndex + 1}-S${colIndex + 1}`;
                                const category = seatCategories[seatId];
                                const isSelected = selectedSeats.includes(seatId);
                                const isRangeStart = seatId === rangeStartSeat;
                                return (
                                    <div
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        onMouseEnter={(e) => {
                                            if (!category && rangeStartSeat && seatId !== rangeStartSeat) {
                                                const previewRange = getSeatsInRange(rangeStartSeat, seatId);
                                                previewRange?.forEach(id => {
                                                    const elem = document.querySelector(`[data-seat-id="${id}"]`);
                                                    if (elem) elem.style.backgroundColor = selectionColors?.inRange;
                                                });
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (rangeStartSeat) {
                                                const allSeats = document.querySelectorAll("[data-seat-id]");
                                                allSeats.forEach(elem => {
                                                    const id = elem.getAttribute("data-seat-id");
                                                    if (!selectedSeats.includes(id) && id !== rangeStartSeat) {
                                                        elem.style.backgroundColor = seatCategories[id]
                                                            ? seatColors[seatCategories[id]]
                                                            : selectionColors.available;
                                                    }
                                                });
                                            }
                                        }}
                                        data-seat-id={seatId}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            backgroundColor: isRangeStart
                                                ? selectionColors.rangeStart
                                                : isSelected
                                                    ? selectionColors.selected
                                                    : category
                                                        ? seatColors[category]
                                                        : selectionColors.available,
                                            borderRadius: "6px",
                                            cursor: category ? "not-allowed" : "pointer",
                                            opacity: category ? 0.9 : 1,
                                            transition: "all 0.2s ease",
                                            border: rangeStartSeat && !category && !isRangeStart
                                                ? `2px dashed ${selectionColors.rangeStart}`
                                                : "none",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "10px",
                                            color: "#fff",
                                            boxShadow: isSelected || isRangeStart
                                                ? "0 2px 4px rgba(0,0,0,0.2)"
                                                : "none",
                                            transform: isSelected || isRangeStart
                                                ? "scale(1.1)"
                                                : "scale(1)"
                                        }}
                                        title={`${displayId}${category ? ` - ${category}` : ""}${isRangeStart ? " (Range Start)" : ""}`}
                                    >
                                        {category ? seatIcons[category] || <Armchair size={20} color="#fff" /> : displayId}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    };
    return (
        <Container fluid className="p-4">
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <Card.Title className="m-0">Seating Configuration</Card.Title>
                    <Button variant="primary" onClick={updateSeatConfig}>Submit</Button>
                </Card.Header>

                <Card.Body>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Row>
                                {config && Object?.keys(config)?.map((key) => (
                                    <Col md={6} key={key}>
                                        <Form.Group>
                                            <Form.Label>{key.replace(/([A-Z])/g, ' $1')}</Form.Label>
                                            <Form.Control type="number" name={key} value={config[key]} onChange={handleChange} />
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                        <Col md={6}>
                            <div className="d-flex gap-5">
                                <div className="d-flex justify-content-center flex-column">
                                    <div className="position-relative">
                                        <div className="d-flex justify-content-center mb-4">
                                            {renderSeats(config?.topRows, config?.topSeats, "Top")}
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center gap-4">
                                            <div>{renderSeats(config.leftRows, config.leftSeats, "Left")}</div>
                                            <div>
                                                <Image
                                                    className="img-fluid w-100 h-100"
                                                    src={`https://placehold.co/${config.imageWidth}x${config.imageHeight}`}
                                                    alt="Ground" />
                                            </div>
                                            <div>{renderSeats(config?.rightRows, config?.rightSeats, "Right")}</div>
                                        </div>
                                        <div className="d-flex justify-content-center mt-4">
                                            {renderSeats(config?.bottomRows, config?.bottomSeats, "Bottom")}
                                        </div>
                                    </div>
                                    {selectedSeats.length > 0 && (
                                        <div className="text-center mt-3">
                                            <Button
                                                onClick={() => setShowModal(true)}
                                                variant="primary"
                                                disabled={!!rangeStartSeat}
                                            >
                                                Assign Category ({selectedSeats.length} seats selected)
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <h5>Category Legend:</h5>
                                    {Object.entries(seatColors).map(([category, color]) => (
                                        <div key={category} className="d-flex align-items-center gap-2 mb-2">
                                            <div style={{
                                                width: "16px",
                                                height: "16px",
                                                backgroundColor: color,
                                                borderRadius: "2px"
                                            }} />
                                            <span>{category}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Seat Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select Category</Form.Label>
                            <Form.Select
                                value={seatCategory}
                                onChange={(e) => setSeatCategory(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="VIP">VIP</option>
                                <option value="Regular">Regular</option>
                                <option value="Economy">Economy</option>
                                <option value="Disabled">Disabled</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleBulkAssign}
                        disabled={!seatCategory}
                    >
                        Assign
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SeatingForm;