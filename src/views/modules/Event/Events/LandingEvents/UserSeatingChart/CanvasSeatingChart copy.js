import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Tooltip, Overlay } from 'react-bootstrap';
import { canvasHelpers } from './canvasHelpers';
import './seetingchart.css';
import axios from 'axios';
import { PRIMARY, SECONDARY } from '../../../CustomUtils/Consts';
const CanvasSeatingChart = ({ eventId, api, authToken, ErrorAlert, successAlert, tickets }) => {
    const topCanvasRef = useRef(null);
    const leftCanvasRef = useRef(null);
    const rightCanvasRef = useRef(null);
    const bottomCanvasRef = useRef(null);

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
    const [seatCategories, setSeatCategories] = useState({});
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [rangeStartSeat, setRangeStartSeat] = useState(null);
    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [tooltipTarget, setTooltipTarget] = useState(null);
    const [scale, setScale] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoomedSection, setZoomedSection] = useState(null);
    const [disabledSeats, setDisabledSeats] = useState([]);
    // Constants
    const SEAT_SIZE = 25; // Reduced from 30 to 20
    const GAP = 10; // Reduced from 4 to 2
    const COMPACT_SIZE = 3; // Reduced from 4 to 3

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

    useEffect(() => {
        initializeCanvas();
        // Prevent browser zoom on Ctrl+Wheel
        const preventBrowserZoom = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
        };

        // Add the event listener to the window
        window.addEventListener('wheel', preventBrowserZoom, { passive: false });

        // Cleanup
        return () => {
            window.removeEventListener('wheel', preventBrowserZoom);
        };
    }, []);

    useEffect(() => {
        if (config && Object.keys(seatCategories).length > 0) {
            initializeCanvas();
            drawSeats();
        }
    }, [config, seatCategories, scale, pan, selectedSeats, rangeStartSeat, zoomedSection]);

    const initializeCanvas = () => {
        const sections = [
            { ref: topCanvasRef, name: "Top", rows: config.topRows, seats: config.topSeats },
            { ref: leftCanvasRef, name: "Left", rows: config.leftRows, seats: config.leftSeats },
            { ref: rightCanvasRef, name: "Right", rows: config.rightRows, seats: config.rightSeats },
            { ref: bottomCanvasRef, name: "Bottom", rows: config.bottomRows, seats: config.bottomSeats }
        ];

        sections.forEach(({ ref, name, rows, seats }) => {
            const canvas = ref.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');

            // Set canvas dimensions based on seat configuration
            canvas.width = seats * (SEAT_SIZE + GAP);
            canvas.height = rows * (SEAT_SIZE + GAP);

            // Set initial scale and enable antialiasing
            ctx.scale(1, 1);
            ctx.imageSmoothingEnabled = true;

            // Draw seats immediately after initialization
            drawSection(ctx, name, rows, seats);
        });
    };

    const drawSection = (ctx, section, rows, cols) => {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const seatId = `${section}-R${row + 1}-S${col + 1}`;
                const x = col * (SEAT_SIZE + GAP);
                const y = row * (SEAT_SIZE + GAP);
                const displayId = `${section[0]}${row + 1}-${col + 1}`;

                const category = seatCategories[seatId];
                const isSelected = selectedSeats.includes(seatId);
                const isRangeStart = seatId === rangeStartSeat;
                const isHovered = hoveredSeat?.id === seatId;

                canvasHelpers.drawSeat(
                    ctx,
                    x,
                    y,
                    SEAT_SIZE,
                    getSeatColor(category, seatId, isRangeStart), // Pass seatId instead of isSelected
                    isSelected,
                    isHovered,
                    displayId
                );
            }
        }
    };

    const handleSeatSelection = (clickedSeat) => {
        const { id: seatId, category } = clickedSeat;

        // Ignore if no category or disabled
        if (!category || category === "Disabled") return;

        // Handle category switching
        if (selectedSeats.length > 0) {
            const firstSelectedCategory = seatCategories[selectedSeats[0]];
            if (category !== firstSelectedCategory) {
                setSelectedSeats([seatId]);
                setRangeStartSeat(seatId);
                return;
            }
        }
        // Initialize range selection
        if (!rangeStartSeat) {
            setRangeStartSeat(seatId);
            setSelectedSeats([seatId]);
            return;
        }

        // Complete range selection
        const seatsInRange = getSeatsInRange(rangeStartSeat, seatId);
        if (seatsInRange.length > 10) {
            ErrorAlert("You can select a maximum of 10 seats in range.");
            return;
        }

        setSelectedSeats(seatsInRange);
        setRangeStartSeat(null);
    };
    const getSeatsInRange = (startSeat, endSeat) => {
        const [startSection, startRow, startCol] = parseSeatId(startSeat);
        const [endSection, endRow, endCol] = parseSeatId(endSeat);

        // Only allow range selection within same section
        if (startSection !== endSection) {
            return [startSeat];
        }

        const range = [];
        const startR = Math.min(startRow, endRow);
        const endR = Math.max(startRow, endRow);
        const startC = Math.min(startCol, endCol);
        const endC = Math.max(startCol, endCol);

        // Handle both vertical and horizontal ranges
        for (let row = startR; row <= endR; row++) {
            for (let col = startC; col <= endC; col++) {
                const seatId = `${startSection}-R${row}-S${col}`;
                // Check if the seat has the same category as the start seat
                if (seatCategories[seatId] === seatCategories[startSeat] && !disabledSeats.includes(seatId)) {
                    range.push(seatId);
                }
            }
        }

        return range;
    };

    const parseSeatId = (seatId) => {
        const [section, row, seat] = seatId?.split('-');
        return [
            section,
            parseInt(row.substring(1)),
            parseInt(seat.substring(1))
        ];
    };
    const seatColors = ["gold", "blue", "green", '#641e16', "gray"];
    const getSeatColor = (category, seatId, isRangeStart) => {
        if (!category || category === "Disabled") return '#808080';

        // Handle range selection coloring
        if (rangeStartSeat && seatId) {
            try {
                const [startSection, startRow, startCol] = parseSeatId(rangeStartSeat);
                const [currentSection, currentRow, currentCol] = parseSeatId(seatId);

                // Check if current seat is within potential range
                if (startSection === currentSection) {
                    const startSeatCategory = seatCategories[rangeStartSeat];

                    // If hovering and same category as range start
                    if (hoveredSeat?.id && category === startSeatCategory) {
                        // Get all seats in potential range
                        const previewRange = getSeatsInRange(rangeStartSeat, hoveredSeat.id);
                        // If current seat is in preview range, show PRIMARY color
                        if (previewRange.includes(seatId)) {
                            return PRIMARY;
                        }
                    }

                    // Range start seat remains red
                    if (seatId === rangeStartSeat) {
                        return '#FF4444';
                    }

                    // Already selected seats
                    if (selectedSeats.includes(seatId)) {
                        return SECONDARY;
                    }
                }
            } catch (error) {
                console.error("Error parsing seat ID:", error);
                return '#CCCCCC';
            }
        }

        // Normal coloring logic
        if (isRangeStart) return '#FF4444';
        if (selectedSeats.includes(seatId)) return SECONDARY;

        const colorIndex = sortedTickets.findIndex(t => t.id === parseInt(category));
        return colorIndex >= 0 ? seatColors[colorIndex] : '#CCCCCC';
    };

    const drawSeats = () => {
        const sections = [
            { ref: topCanvasRef, name: "Top", rows: config.topRows, seats: config.topSeats },
            { ref: leftCanvasRef, name: "Left", rows: config.leftRows, seats: config.leftSeats },
            { ref: rightCanvasRef, name: "Right", rows: config.rightRows, seats: config.rightSeats },
            { ref: bottomCanvasRef, name: "Bottom", rows: config.bottomRows, seats: config.bottomSeats }
        ];

        sections.forEach(({ ref, name, rows, seats }) => {
            const canvas = ref.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (zoomedSection && zoomedSection !== name) return;

            ctx.save();
            ctx.translate(pan.x, pan.y);
            ctx.scale(scale, scale);
            drawSection(ctx, name, rows, seats);
            ctx.restore();
        });
    };
    const getCanvasCoordinates = (event, canvas) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left - pan.x) * scaleX / scale,
            y: (event.clientY - rect.top - pan.y) * scaleY / scale
        };
    };
    const handleCanvasClick = (event) => {
        // Get the section from the clicked canvas
        const section = event.target.getAttribute('data-section');
        const canvas = event.target;
        const coords = getCanvasCoordinates(event, canvas);
        const rect = canvas.getBoundingClientRect();

        // Calculate click position relative to the canvas
        // const x = (event.clientX - rect.left - pan.x) / scale;
        // const y = (event.clientY - rect.top - pan.y) / scale;

        // Calculate row and column
        // const col = Math.floor(x / (SEAT_SIZE + GAP));
        // const row = Math.floor(y / (SEAT_SIZE + GAP));
        const col = Math.floor(coords.x / (SEAT_SIZE + GAP));
        const row = Math.floor(coords.y / (SEAT_SIZE + GAP));

        // Validate click is within bounds
        const maxRows = config[`${section.toLowerCase()}Rows`];
        const maxSeats = config[`${section.toLowerCase()}Seats`];

        if (row >= 0 && row < maxRows && col >= 0 && col < maxSeats) {
            const seatId = `${section}-R${row + 1}-S${col + 1}`;
            const category = seatCategories[seatId];

            // Create clicked seat object
            const clickedSeat = {
                id: seatId,
                category,
                price: sortedTickets.find(t => t.id === category)?.price || 'N/A'
            };

            // Only handle selection if seat is valid
            if (category && !disabledSeats.includes(seatId)) {
                handleSeatSelection(clickedSeat);
            }
        }
    };
    const RetriveTicketName = (id) => {
        let tname = sortedTickets?.find((ticket) => String(ticket?.id) === String(id)) || { name: 'Disabled' };
        return tname?.name
    }
    const handleCanvasMouseMove = (event) => {
        // Get the section from the canvas element
        const section = event.target.getAttribute('data-section');
        const canvas = event.target;
        const coords = getCanvasCoordinates(event, canvas);

        // Calculate position relative to the canvas

        const col = Math.floor(coords.x / (SEAT_SIZE + GAP));
        const row = Math.floor(coords.y / (SEAT_SIZE + GAP));

        // Validate if position is within bounds
        const maxRows = config[`${section.toLowerCase()}Rows`];
        const maxSeats = config[`${section.toLowerCase()}Seats`];

        if (row >= 0 && row < maxRows && col >= 0 && col < maxSeats) {
            const seatId = `${section}-R${row + 1}-S${col + 1}`;
            const category = seatCategories[seatId];

            // Create hovered seat object
            const hoveredSeatInfo = {
                id: seatId,
                category: category ? RetriveTicketName(category) : "General",
                price: sortedTickets.find(t => t.id === category)?.price || 'N/A'
            };

            // Check if we're in range selection mode and hovering over valid seat
            if (rangeStartSeat && category) {
                const startCategory = seatCategories[rangeStartSeat];
                if (category === startCategory && !disabledSeats.includes(seatId)) {
                    // Calculate potential range
                    const potentialRange = getSeatsInRange(rangeStartSeat, seatId);
                    // Only update if range is valid (<=10 seats)
                    if (potentialRange.length <= 10) {
                        setHoveredSeat(hoveredSeatInfo);
                        setTooltipTarget(event.target);
                        // Force redraw to show preview
                        drawSeats();
                        return;
                    }
                }
            }

            // Normal hover behavior if not in range selection or invalid range
            setHoveredSeat(hoveredSeatInfo);
            setTooltipTarget(event.target);
        } else {
            setHoveredSeat(null);
            setTooltipTarget(null);
        }

        // Force redraw to update colors
        drawSeats();
    };
    const ZoomControls = () => {
        return (
            <div className="zoom-controls">
                <button onClick={() => setScale(s => Math.min(s + 0.1, 2))}>+</button>
                <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))}>-</button>
                <button onClick={() => {
                    setScale(1);
                    setPan({ x: 0, y: 0 });
                }}>Reset</button>
            </div>
        );
    };
    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seatId) => {
            const category = seatCategories[seatId];
            const ticket = sortedTickets.find(t => t.id === category);
            return total + (ticket?.price || 0);
        }, 0);
    };

    //zoom-controls
    const [touchDistance, setTouchDistance] = useState(null);
    // Add these state variables at the top with your other states
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Add these new handlers
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3;

    // Update the handleWheel function
    const handleWheel = (e) => {
        // Only handle zoom if Ctrl key is pressed
        if (!e.ctrlKey) return;

        e.preventDefault();
        const scaleChange = e.deltaY > 0 ? -0.1 : 0.1;

        setScale(prevScale => {
            const newScale = prevScale + scaleChange;
            return Math.min(Math.max(newScale, MIN_ZOOM), MAX_ZOOM);
        });
    };

    const isMinZoom = scale <= MIN_ZOOM;
    const isMaxZoom = scale >= MAX_ZOOM;

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };
    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            setPan({ x: newX, y: newY });
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            setTouchDistance(distance);
        }
    };
    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && touchDistance !== null) {
            const newDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );

            const difference = newDistance - touchDistance;
            const scaleChange = difference > 0 ? 0.1 : -0.1;

            setScale(prevScale => {
                const newScale = prevScale + scaleChange;
                return Math.min(Math.max(newScale, MIN_ZOOM), MAX_ZOOM);
            });

            setTouchDistance(newDistance);
        }
    };
    const handleTouchEnd = () => {
        setTouchDistance(null);
    };
    // Add before the return statement
    const topCanvasProps = {
        ref: topCanvasRef,
        width: config.topSeats * (SEAT_SIZE + GAP),
        height: config.topRows * (SEAT_SIZE + GAP),
        onClick: handleCanvasClick,
        onMouseMove: handleCanvasMouseMove,
        style: { cursor: 'pointer' },
        'data-section': "Top"
    };

    const leftCanvasProps = {
        ref: leftCanvasRef,
        width: config.leftSeats * (SEAT_SIZE + GAP),
        height: config.leftRows * (SEAT_SIZE + GAP),
        onClick: handleCanvasClick,
        onMouseMove: handleCanvasMouseMove,
        style: { cursor: 'pointer' },
        'data-section': "Left"
    };

    const rightCanvasProps = {
        ref: rightCanvasRef,
        width: config.rightSeats * (SEAT_SIZE + GAP),
        height: config.rightRows * (SEAT_SIZE + GAP),
        onClick: handleCanvasClick,
        onMouseMove: handleCanvasMouseMove,
        style: { cursor: 'pointer' },
        'data-section': "Right"
    };

    const bottomCanvasProps = {
        ref: bottomCanvasRef,
        width: config.bottomSeats * (SEAT_SIZE + GAP),
        height: config.bottomRows * (SEAT_SIZE + GAP),
        onClick: handleCanvasClick,
        onMouseMove: handleCanvasMouseMove,
        style: { cursor: 'pointer' },
        'data-section': "Bottom"
    };

    const groundImageProps = {
        className: "img-fluid",
        style: {
            width: config.imageWidth,
            height: config.imageHeight,
            transform: zoomedSection ? 'scale(0.7)' : 'scale(1)',
            transition: 'transform 0.3s ease'
        },
        src: `https://placehold.co/${config.imageWidth}x${config.imageHeight}`,
        alt: "Ground"
    };
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <div className="d-flex justify-content-center flex-column">
                        <div className="position-relative">
                            {zoomedSection && <ZoomControls />}
                            <div
                                ref={containerRef}
                                className={`seating-layout-container
                                            ${isMinZoom ? 'min-zoom' : ''}
                                            ${isMaxZoom ? 'max-zoom' : ''}
                                            ${isDragging ? 'dragging' : ''}`}
                                onWheel={handleWheel}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                style={{
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    width: '100%',
                                    height: '100vh',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <div
                                    className="seating-layout position-static"
                                    style={{
                                        transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                                        transformOrigin: 'center',
                                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                                        position: 'relative',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '2rem'
                                    }}
                                >
                                    {/* Top section */}
                                    <div className="section-top">
                                        <canvas {...topCanvasProps} />
                                    </div>

                                    {/* Middle section */}
                                    <div className="section-middle d-flex align-items-center gap-4">
                                        <canvas {...leftCanvasProps} />
                                        <img {...groundImageProps} />
                                        <canvas {...rightCanvasProps} />
                                    </div>

                                    {/* Bottom section */}
                                    <div className="section-bottom">
                                        <canvas {...bottomCanvasProps} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tooltip and Total Info */}
                        {hoveredSeat && (
                            <Overlay target={tooltipTarget} show placement="top">
                                <Tooltip>
                                    <strong>Seat:</strong> {hoveredSeat.id}<br />
                                    <strong>Category:</strong> {hoveredSeat.category}<br />
                                    <strong>Price:</strong> ₹{hoveredSeat.price}
                                </Tooltip>
                            </Overlay>
                        )}
                        <div className="mt-3">
                            <h5>Total Seats: {selectedSeats.length}</h5>
                            <h5>Total Price: ₹{calculateTotalPrice()}</h5>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CanvasSeatingChart;