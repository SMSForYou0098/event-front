import axios from 'axios';
import { Armchair, BedDouble, Sofa, Ticket } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Container, Image, Overlay, Row, Tooltip } from 'react-bootstrap';
import { Seatmap } from '@alisaitteke/seatmap-canvas-react';
import PropTypes from 'prop-types';
import ErrorBoundary from '../KonvaSeatingChart/ErrorBoundary';
const SatMapSeats = ({ eventId, api, authToken, ErrorAlert, successAlert, tickets }) => {
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


    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [disabledSeats, setDisabledSeats] = useState([]);
    const [groundImage, setGroundImage] = useState(null);
    const seatmapRef = useRef(null);
    const [rangeStartSeat, setRangeStartSeat] = useState(null);

    const getExistingSeatConfig = async () => {
        try {
            if (!eventId) {
                throw new Error("Missing required parameter: eventId");
            }

            const response = await axios.get(`${api}seat-config/${eventId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });

            if (!response.data) {
                throw new Error("No data received from server");
            }

            if (response.data?.status) {
                const seatData = response.data?.seats || [];
                const formattedSeats = seatData.reduce((acc, seat) => {
                    if (seat?.seat_id) {
                        acc[seat.seat_id] = seat.category;
                    }
                    return acc;
                }, {});

                const disabledSeatsList = seatData
                    .filter(seat => seat?.disabled === 1)
                    .map(seat => seat?.seat_id)
                    .filter(Boolean);

                setDisabledSeats(disabledSeatsList);
                setSeatCategories(formattedSeats);

                const configData = response.data?.configData?.config;
                if (configData) {
                    try {
                        setConfig(JSON.parse(configData));
                    } catch (parseError) {
                        throw new Error("Invalid config data format");
                    }
                }
            }
        } catch (error) {
            ErrorAlert(error.message || "Error updating seat config");
        }
    };

    useEffect(() => {
        let mounted = true;

        const initializeData = async () => {
            if (tickets?.length && mounted) {
                const sorted = [...tickets].sort((a, b) => b.price - a.price);
                setSortedTickets(sorted);
            }
            await getExistingSeatConfig();
        };

        const loadGroundImage = () => {
            const image = new window.Image();
            image.src = `https://placehold.co/${config.imageWidth}x${config.imageHeight}`;

            image.onload = () => {
                if (mounted) {
                    setGroundImage(image);
                }
            };

            image.onerror = () => {
                if (mounted) {
                    ErrorAlert("Failed to load ground image");
                    setGroundImage(null);
                }
            };
        };

        initializeData();
        loadGroundImage();

        return () => {
            mounted = false;
        };
    }, [tickets, config.imageWidth, config.imageHeight, eventId]);

    const SEAT_CONSTANTS = {
        MAX_RANGE_SEATS: 10,
        SEAT_WIDTH: 30,
        SEAT_HEIGHT: 30,
        SEAT_SPACING: 34,
    };

    const SEAT_COLORS = {
        VIP: "gold",
        STANDARD: "blue",
        LOUNGE: "green",
        RESERVED: "#641e16",
        DISABLED: "gray"
    };

    const onRender = (ctx) => {
        if (groundImage) {
            const imageX = (ctx.canvas.width - config.imageWidth) / 2;
            const imageY = (ctx.canvas.height - config.imageHeight) / 2;
            ctx.drawImage(groundImage, imageX, imageY, config.imageWidth, config.imageHeight);
        }
    };
    const selectionColors = {
        available: "#E8E8E8",       // Light gray for available seats
        hover: "#B8E6FF",          // Light blue for hover state
        selected: "#FF4B4B",       // Bright red for selected seats
        rangeStart: "#8B4FFF",     // Bright purple for range start
        inRange: "#FFB84D",        // Warm orange for potential range
        assigned: "#808080"        // Gray for assigned seats
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
    // ✅ Check if the seat is valid based on section and configuration
    const isSeatValid = (section, row, seat) => {
        const seatId = `${section}-R${row}-S${seat}`;
        return seatCategories[seatId] && seatCategories[seatId] !== "Disabled"; // ❌ Block "Disabled" seats
    };
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
    const RetriveTicketName = (id) => {
        let tname = sortedTickets?.find((ticket) => String(ticket?.id) === String(id)) || { name: 'Disabled' };
        return tname?.name
    }
    const [assignedSeats, setAssignedSeats] = useState([]);
    const [tooltipTarget, setTooltipTarget] = useState(null);
    const seatIcons = {
        VIP: <Sofa size={20} color="#fff" />,
        Standard: <Armchair size={20} color="#fff" />,
        Lounge: <Armchair size={20} color="#fff" />,
        Bed: <BedDouble size={20} color="#fff" />,
        Reserved: <Ticket size={20} color="#fff" />
    };
    const handleMouseLeave = () => {
        setHoveredSeat(null);
        setTooltipTarget(null);
    };

    const getSeatConfig = React.useMemo(() => {
        return () => {
            const allSeats = [];
            const sections = [
                { name: "Top", rows: config.topRows || 0, cols: config.topSeats || 0, offsetX: (ctx) => (ctx.canvas.width - config.topSeats * 34) / 2, offsetY: 0 },
                { name: "Left", rows: config.leftRows || 0, cols: config.leftSeats || 0, offsetX: 0, offsetY: config.topRows * 34 },
                { name: "Right", rows: config.rightRows || 0, cols: config.rightSeats || 0, offsetX: (ctx) => ctx.canvas.width - config.rightSeats * 34, offsetY: config.topRows * 34 },
                { name: "Bottom", rows: config.bottomRows || 0, cols: config.bottomSeats || 0, offsetX: (ctx) => (ctx.canvas.width - config.bottomSeats * 34) / 2, offsetY: config.topRows * 34 + Math.max(config.leftRows, config.rightRows) * 34 }
            ];

            sections.forEach(section => {
                for (let row = 0; row < section.rows; row++) {
                    for (let col = 0; col < section.cols; col++) {
                        const seatId = `${section.name}-R${row + 1}-S${col + 1}`;
                        const category = seatCategories[seatId];
                        const isDisabled = !category || category === "Disabled";
                        const isSelected = selectedSeats.includes(seatId);
                        const isRangeStart = seatId === rangeStartSeat;
                        const isInValidRange = rangeStartSeat ? getSeatsInRange(rangeStartSeat, seatId).includes(seatId) : false;

                        allSeats.push({
                            id: seatId,
                            x: (ctx) => section.offsetX(ctx) + col * 34,
                            y: section.offsetY + row * 34,
                            width: 30,
                            height: 30,
                            fill: isRangeStart ? selectionColors.rangeStart : isSelected ? selectionColors.selected : isDisabled ? "#A0A0A0" : category ? seatColors[tickets.findIndex((ticket) => parseInt(ticket.id) === parseInt(category))] : selectionColors.available,
                            onClick: !isDisabled ? () => handleSeatClick(seatId) : undefined,
                            onMouseEnter: !isDisabled && (rangeStartSeat && isInValidRange) ? (e) => handleMouseEnter(e, seatId, category) : undefined,
                            onMouseLeave: !isDisabled && !rangeStartSeat ? handleMouseLeave : undefined,
                            style: {
                                borderRadius: "6px",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                pointerEvents: isDisabled || (rangeStartSeat && !isInValidRange) ? "none" : "auto",
                                transition: "all 0.2s ease",
                                border: !isDisabled && rangeStartSeat && !isRangeStart ? `2px dashed ${selectionColors.rangeStart}` : "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "10px",
                                color: "#fff",
                                boxShadow: isSelected || isRangeStart ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
                                transform: isSelected || isRangeStart ? "scale(1.1)" : "scale(1)",
                            },
                            label: isDisabled ? "X" : category ? seatIcons[category] || <Armchair size={20} color="#fff" /> : seatId.split('-').pop()
                        });
                    }
                }
            });
            return allSeats;
        };
    }, [config, seatCategories, selectedSeats, rangeStartSeat, tickets]);
    const seatColors = ["gold", "blue", "green", '#641e16', "gray"];
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
    const isSeatAssigned = (seatId) => {
        return assignedSeats.includes(seatId);
    };
    return (
        <Container fluid className="py-2 px-4">
            <Row className="mb-4">
                <Col md={12}>
                    <div className="mb-3 d-flex gap-3">
                        {/* ... (Your categories legend) */}
                    </div>
                </Col>
                <Col md={12}>
                    <ErrorBoundary>
                        <div className="d-flex justify-content-center flex-column">
                            <div className="position-relative">
                                <Seatmap
                                    ref={seatmapRef}
                                    seats={getSeatConfig()}
                                    width={500}
                                    height={500}
                                    onRender={onRender}
                                />
                            </div>
                        </div>
                    </ErrorBoundary>
                    {/* ... (Your tooltip and total seats/price display) */}
                </Col>
            </Row>
        </Container>
    );
};

SatMapSeats.propTypes = {
    eventId: PropTypes.string.isRequired,
    api: PropTypes.string.isRequired,
    authToken: PropTypes.string.isRequired,
    ErrorAlert: PropTypes.func.isRequired,
    successAlert: PropTypes.func.isRequired,
    tickets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
    })).isRequired
};
export default SatMapSeats;