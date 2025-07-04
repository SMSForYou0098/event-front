import axios from 'axios';
import { Armchair, BedDouble, Sofa, Ticket } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Image, Overlay, Row, Tooltip } from 'react-bootstrap';

const RenderUserSeats = ({ eventId, api, authToken, ErrorAlert, successAlert, tickets }) => {
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
    const [seatCategories, setSeatCategories] = useState({});
    const [disabledSeats, setDisabledSeats] = useState([]);
    const [zoomedSection, setZoomedSection] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(0);

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
                const disabledSeatsList = seatData
                    .filter(seat => seat?.disabled === 1)
                    .map(seat => seat?.seat_id);

                setDisabledSeats(disabledSeatsList);
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
    const seatColors = ["gold", "blue", "green", '#641e16', "gray"];


    const selectionColors = {
        available: "#E8E8E8",       // Light gray for available seats
        hover: "#B8E6FF",          // Light blue for hover state
        selected: "#FF4B4B",       // Bright red for selected seats
        rangeStart: "#8B4FFF",     // Bright purple for range start
        inRange: "#FFB84D",        // Warm orange for potential range
        assigned: "#808080"        // Gray for assigned seats
    };

    const RetriveTicketName = (id) => {
        let tname = sortedTickets?.find((ticket) => String(ticket?.id) === String(id)) || { name: 'Disabled' };
        return tname?.name
    }
    const seatIcons = {
        VIP: <Sofa size={20} color="#fff" />,
        Standard: <Armchair size={20} color="#fff" />,
        Lounge: <Armchair size={20} color="#fff" />,
        Bed: <BedDouble size={20} color="#fff" />,
        Reserved: <Ticket size={20} color="#fff" />
    };




    // Calculate Total Seats and Price
    const totalSeats = selectedSeats.length;
    const totalPrice = selectedSeats.reduce((sum, seatId) => {
        const category = seatCategories[seatId];
        const price = sortedTickets.find(ticket => ticket.id === category)?.price || 0;
        return sum + price;
    }, 0);


    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [tooltipTarget, setTooltipTarget] = useState(null);
    const [assignedSeats, setAssignedSeats] = useState([]);
    const parseId = (id) => {
        const [section, rowStr, seatStr] = id.split('-');
        const rowNum = parseInt(rowStr.substring(1));
        const seatNum = parseInt(seatStr.substring(1));

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
    const getSeatsInRange = (startSeat, endSeat) => {
        const start = parseId(startSeat);
        const end = parseId(endSeat);

        // ❌ Prevent selection across different sections
        if (start.section !== end.section) {
            return [startSeat];
        }

        const selectedSeats = [];
        const isHorizontal = start.absoluteRow === end.absoluteRow;
        const isVertical = start.originalSeat === end.originalSeat;

        if (!isHorizontal && !isVertical) {
            return [startSeat]; // ❌ Prevent diagonal selection
        }

        // ✅ Horizontal Selection
        if (isHorizontal) {
            const minSeat = Math.min(start.originalSeat, end.originalSeat);
            const maxSeat = Math.max(start.originalSeat, end.originalSeat);

            for (let seat = minSeat; seat <= maxSeat; seat++) {
                const seatId = `${start.section}-R${start.originalRow}-S${seat}`;
                if (!isSeatValid(start.section, start.originalRow, seat)) {
                    return [startSeat]; // 🚀 Stop if any seat in range is disabled
                }
                selectedSeats.push(seatId);
            }
        }

        // ✅ Vertical Selection
        if (isVertical) {
            const minRow = Math.min(start.originalRow, end.originalRow);
            const maxRow = Math.max(start.originalRow, end.originalRow);

            for (let row = minRow; row <= maxRow; row++) {
                const seatId = `${start.section}-R${row}-S${start.originalSeat}`;
                if (!isSeatValid(start.section, row, start.originalSeat)) {
                    return [startSeat]; // 🚀 Stop if any seat in range is disabled
                }
                selectedSeats.push(seatId);
            }
        }

        return selectedSeats.length ? selectedSeats : [startSeat];
    };



    // ✅ Check if the seat is valid based on section and configuration
    const isSeatValid = (section, row, seat) => {
        const seatId = `${section}-R${row}-S${seat}`;
        return seatCategories[seatId] && seatCategories[seatId] !== "Disabled"; // ❌ Block "Disabled" seats
    };

    // ✅ Ensure the seat is already assigned before selection
    const isSeatAssigned = (seatId) => {
        return assignedSeats.includes(seatId);
    };

    // ✅ Handle hover event for previewing seat selection


    const handleMouseLeave = () => {
        setHoveredSeat(null);
        setTooltipTarget(null);
    };


    const handleSeatClick = (seatId) => {
        const category = seatCategories[seatId]; // 🏷 Get seat category
        if (!category) return; // ❌ Ignore if no category found

        // ✅ Handle category switching
        if (selectedSeats.length > 0) {
            const firstSelectedCategory = seatCategories[selectedSeats[0]];
            if (category !== firstSelectedCategory) {
                setSelectedSeats([seatId]); // 🔄 Reset selection for new category
                setRangeStartSeat(seatId);
                return;
            }
        }

        // ✅ Initialize range selection
        if (!rangeStartSeat || !selectedSeats.includes(rangeStartSeat)) {
            // console.log(seatId)
            setRangeStartSeat(seatId);
            setSelectedSeats([seatId]);
            return;
        }

        // ✅ Select seats in range
        const seatsInRange = getSeatsInRange(rangeStartSeat, seatId);

        if (seatsInRange.length > 10) {
            ErrorAlert("You can select a maximum of 10 seats in range.");
            return;
        }
        // console.log(seatsInRange)
        setSelectedSeats(seatsInRange);
        setRangeStartSeat(null); // ✅ Reset after selection
    };

    const handleMouseEnter = (event, seatId, category) => {
        // Set tooltip info
        setHoveredSeat({
            id: seatId,
            category: category ? RetriveTicketName(category) : "General",
            price: tickets.find(ticket => parseInt(ticket.id) === parseInt(category))?.price || "N/A"
        });
        setTooltipTarget(event.target);

        // Only handle hover effects if we have a range start seat
        if (rangeStartSeat) {
            const previewRange = getSeatsInRange(rangeStartSeat, seatId);

            // First reset all seats to their original colors
            document.querySelectorAll('[data-seat-id]').forEach(elem => {
                const id = elem.getAttribute('data-seat-id');
                const seatCategory = seatCategories[id];

                if (!selectedSeats.includes(id) && id !== rangeStartSeat) {
                    const colorIndex = tickets.findIndex(ticket =>
                        parseInt(ticket.id) === parseInt(seatCategory)
                    );
                    elem.style.backgroundColor = seatCategory && seatCategory !== "Disabled"
                        ? seatColors[colorIndex]
                        : selectionColors.available;
                    elem.style.opacity = "1";
                }
            });

            // Only color seats in the valid range
            if (previewRange.length > 1) { // Only if we have a valid range
                previewRange.forEach(id => {
                    const elem = document.querySelector(`[data-seat-id="${id}"]`);
                    if (elem && !isSeatAssigned(id) && !selectedSeats.includes(id) && id !== rangeStartSeat) {
                        const seatCategory = seatCategories[id];
                        if (seatCategory && seatCategory !== "Disabled" &&
                            seatCategory === seatCategories[rangeStartSeat]) { // Must be same category
                            elem.style.backgroundColor = selectionColors.inRange;
                            elem.style.opacity = "0.8";
                        }
                    }
                });
            }
        }
    };


    const renderSeats = (rows, cols, section) => {
        let sectionStartRow;
        switch (section) {
            case "Top":
                sectionStartRow = 1;
                break;
            case "Left":
            case "Right":
                sectionStartRow = config.topRows + 1;
                break;
            case "Bottom":
                sectionStartRow = config.topRows + Math.max(config.leftRows, config.rightRows) + 1;
                break;
            default:
                sectionStartRow = 1;
        }
        const shouldShowCompact = !zoomedSection && (zoomLevel === 0 || ((rows * cols > 50) && zoomLevel === 0));
        if (shouldShowCompact) {
            return renderCompactSeats(rows, cols, section);
        }
        if (zoomedSection && zoomedSection !== section) {
            return null;
        }
        return (
            <div
                style={{
                    display: "grid",
                    gap: "4px",
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: "center center",
                    transition: "transform 0.3s ease"
                }}
            >
                <div style={{ display: "grid", gap: "4px" }}>
                    {[...Array(rows)].map((_, rowIndex) => {
                        const totalRowNumber = sectionStartRow + rowIndex;
                        const sectionIndex = Math.floor((totalRowNumber - 1) / 9);
                        let rowLabel =
                            section === "Right"
                                ? `R${String.fromCharCode(65 + sectionIndex)}${((totalRowNumber - 1) % 9) + 1}`
                                : section === "Left"
                                    ? `L${String.fromCharCode(65 + sectionIndex)}${((totalRowNumber - 1) % 9) + 1}`
                                    : `${String.fromCharCode(65 + sectionIndex)}${((totalRowNumber - 1) % 9) + 1}`;

                        return (
                            <div key={rowIndex} style={{ display: "flex", gap: "4px" }}>
                                {[...Array(cols)].map((_, colIndex) => {
                                    const seatNumber = colIndex + 1;
                                    const displayId = `${rowLabel}-${seatNumber}`;
                                    const seatId = `${section}-R${rowIndex + 1}-S${colIndex + 1}`;
                                    const category = seatCategories[seatId];

                                    // 🚀 Handle seat states
                                    const isDisabled = !category || category === "Disabled";
                                    const isSelected = selectedSeats.includes(seatId);
                                    const isRangeStart = seatId === rangeStartSeat;
                                    const isInValidRange = rangeStartSeat ?
                                        getSeatsInRange(rangeStartSeat, seatId).includes(seatId) : false;
                                    return (
                                        <div
                                            key={seatId}
                                            onClick={!isDisabled ? () => handleSeatClick(seatId) : undefined}
                                            onMouseEnter={
                                                !isDisabled && (rangeStartSeat && isInValidRange) ?
                                                    (e) => handleMouseEnter(e, seatId, category) : undefined
                                            }
                                            onMouseLeave={!isDisabled && !rangeStartSeat ? handleMouseLeave : undefined}
                                            data-seat-id={seatId}
                                            // Inside the renderSeats function, update the style object:
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                backgroundColor: isRangeStart
                                                    ? selectionColors.rangeStart
                                                    : isSelected
                                                        ? selectionColors.selected
                                                        : isDisabled
                                                            ? "#A0A0A0"
                                                            : category
                                                                ? seatColors[tickets.findIndex((ticket) =>
                                                                    parseInt(ticket.id) === parseInt(category))]
                                                                : selectionColors.available,
                                                borderRadius: "6px",
                                                cursor: isDisabled ? "not-allowed" : "pointer",
                                                pointerEvents: isDisabled || (rangeStartSeat && !isInValidRange) ?
                                                    "none" : "auto",
                                                transition: "all 0.2s ease",
                                                border: !isDisabled && rangeStartSeat && !isRangeStart
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
                                                    : "scale(1)",
                                                '&:hover': {
                                                    backgroundColor: !isDisabled && !isSelected && !isRangeStart
                                                        ? selectionColors.hover
                                                        : undefined,
                                                }
                                            }}
                                        >
                                            {isDisabled ? "X" : category ? seatIcons[category] || <Armchair size={20} color="#fff" /> : displayId}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderCompactSeats = (rows, cols, section) => {
        return (
            <div
                style={{
                    display: "grid",
                    gap: "2px",
                    cursor: "pointer"
                }}
                onClick={() => setZoomedSection(section)}
            >
                {[...Array(rows)].map((_, rowIndex) => (
                    <div key={rowIndex} style={{ display: "flex", gap: "2px" }}>
                        {[...Array(cols)].map((_, colIndex) => {
                            const seatId = `${section}-R${rowIndex + 1}-S${colIndex + 1}`;
                            const category = seatCategories[seatId];
                            const isDisabled = !category || category === "Disabled";

                            return (
                                <div
                                    key={`${seatId}-compact`}
                                    style={{
                                        width: "4px",
                                        height: "4px",
                                        backgroundColor: isDisabled
                                            ? "#A0A0A0"
                                            : category
                                                ? seatColors[tickets.findIndex((ticket) =>
                                                    parseInt(ticket.id) === parseInt(category))]
                                                : selectionColors.available,
                                        borderRadius: "50%"
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        );
    };

    // useEffect(() => {
    //     console.log(zoomedSection)
    // },[zoomedSection]);
    // Add zoom controls
    const ZoomControls = () => {
        const isCompactView = !zoomedSection && (
            (config?.topRows * config?.topSeats > 50) ||
            (config?.leftRows * config?.leftSeats > 50) ||
            (config?.rightRows * config?.rightSeats > 50) ||
            (config?.bottomRows * config?.bottomSeats > 50)
        );
        // console.log(zoomLevel)
        const handleZoomOut = () => {
            const newZoomLevel = Math.max(zoomLevel - 0.2, 0);
            setZoomLevel(newZoomLevel);

            // Switch to compact view when zoom level reaches 0
            if (newZoomLevel === 0) {
                setZoomedSection(null);
            }
        };
        const handleZoomIn = () => {
            setZoomLevel(prev => Math.min(prev + 1, 0.8));
        };

        return (
            <div
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 1000,
                    background: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
            >
                <button
                    onClick={() => setZoomedSection(null)}
                    style={{ marginRight: "5px" }}
                >
                    Reset Zoom
                </button>
                <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 2}
                >
                    +
                </button>
                <button
                    onClick={handleZoomOut}
                    disabled={isCompactView} // Only disable when in compact view
                >
                    -
                </button>
            </div >
        );
    };


    return (
        <Container fluid className="py-2 px-4">
            <Row className="mb-4">
                <Col md={12}>
                    <div className="mb-3 d-flex gap-3">
                        <h5>Categories:</h5>
                        {tickets
                            .sort((a, b) => b.price - a.price) // Sorting tickets from highest to lowest price
                            .map((item, index) => (
                                <div key={item?.name} className="d-flex align-items-center gap-2 mb-2">
                                    <div
                                        style={{
                                            width: "18px",
                                            height: "18px",
                                            backgroundColor: seatColors[index], // Default to gray if no color is assigned
                                            borderRadius: "4px",
                                            border: "1px solid #ccc",
                                        }}
                                        aria-label={`${item?.name} seat color`}
                                    />
                                    <span style={{ fontWeight: "500" }}>{item?.name} - ₹{item?.price}</span>
                                </div>
                            ))}
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div
                                style={{
                                    width: "18px",
                                    height: "18px",
                                    backgroundColor: "Grey", // Default to gray if no color is assigned
                                    borderRadius: "4px",
                                    border: "1px solid #ccc",
                                }}
                                aria-label={`Disabled seat color`}
                            />
                            <span style={{ fontWeight: "500" }}>Disabled</span>
                        </div>
                    </div>
                </Col>
                <Col md={12}>
                    <div className="d-flex justify-content-center flex-column">
                        <div className="position-relative">
                            {zoomedSection && <ZoomControls />}
                            <div style={{
                                transform: zoomedSection ? 'scale(1.5)' : 'scale(1)',
                                transformOrigin: 'center center',
                                transition: 'transform 0.3s ease'
                            }}>
                                <div className="d-flex justify-content-center mb-4">
                                    {renderSeats(config?.topRows, config?.topSeats, "Top")}
                                </div>
                                <div className="d-flex justify-content-center align-items-center gap-4">
                                    <div>{renderSeats(config.leftRows, config.leftSeats, "Left")}</div>
                                    <div>
                                        <Image
                                            className="img-fluid w-100 h-100"
                                            style={{
                                                transform: zoomedSection ? 'scale(0.7)' : 'scale(1)',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            src={`https://placehold.co/${config.imageWidth}x${config.imageHeight}`}
                                            alt="Ground"
                                        />
                                    </div>
                                    <div>{renderSeats(config?.rightRows, config?.rightSeats, "Right")}</div>
                                </div>
                                <div className="d-flex justify-content-center mt-4">
                                    {renderSeats(config?.bottomRows, config?.bottomSeats, "Bottom")}
                                </div>
                            </div>
                        </div>
                    </div>
                    {hoveredSeat && (
                        <Overlay target={tooltipTarget} show={!!hoveredSeat} placement="top">
                            {(props) => (
                                <Tooltip {...props}>
                                    <strong>Category:</strong> {hoveredSeat.category} <br />
                                    <strong>Price:</strong> ₹{hoveredSeat.price} <br />
                                </Tooltip>
                            )}
                        </Overlay>
                    )}
                    <div>
                        <h5>Total Seats: {totalSeats}</h5>
                        <h5>Total Price: ₹{totalPrice}</h5>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};


export default RenderUserSeats
