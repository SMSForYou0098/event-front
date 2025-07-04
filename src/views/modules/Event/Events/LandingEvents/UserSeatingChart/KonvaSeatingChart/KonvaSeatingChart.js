import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage, Group } from 'react-konva';
import { Container, Row, Col, Tooltip, Overlay } from 'react-bootstrap';
import Section from './Section';
import { PRIMARY, SECONDARY } from '../../../../CustomUtils/Consts';
import axios from 'axios';
import './konvachart.css';

const KonvaSeatingChart = ({ eventId, api, authToken, ErrorAlert, successAlert, tickets }) => {
    // State management
    const containerRef = useRef(null);
    const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [rangeStartSeat, setRangeStartSeat] = useState(null);
    const [seatCategories, setSeatCategories] = useState({});
    const [disabledSeats, setDisabledSeats] = useState([]);
    const [groundImageObj, setGroundImageObj] = useState(null);
    const [config, setConfig] = useState({
        topRows: 5,
        topSeats: 10,
        leftRows: 8,
        leftSeats: 6,
        rightRows: 8,
        rightSeats: 6,
        bottomRows: 5,
        bottomSeats: 10,
        imageWidth: 300,
        imageHeight: 200
    });
    useEffect(() => {
        const image = new window.Image();
        image.src = `https://placehold.co/${config.imageWidth}x${config.imageHeight}`;
        image.onload = () => {
            setGroundImageObj(image);
        };
    }, [config.imageWidth, config.imageHeight]);
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                const { offsetWidth, offsetHeight } = containerRef.current;
                setStageSize({
                    width: offsetWidth,
                    height: offsetHeight
                });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Constants
    // First, update the constants for better layout control
    const SEAT_SIZE = 30;
    const GAP = 5;
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3;
    const SECTION_SPACING = 50;

    // Calculate the layout dimensions
    const layoutWidth = Math.max(
        config.imageWidth,
        (config.leftSeats + config.rightSeats) * (SEAT_SIZE + GAP) + config.imageWidth + SECTION_SPACING * 2
    );

    const layoutHeight = Math.max(
        config.imageHeight,
        (config.topRows + config.bottomRows) * (SEAT_SIZE + GAP) + config.imageHeight + SECTION_SPACING * 2
    );

    // Update the Layer content in the return statement
    // Sort tickets by price
    const sortedTickets = [...tickets].sort((a, b) => b.price - a.price);

    useEffect(() => {
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

        getExistingSeatConfig();
    }, [eventId, api, authToken]);

    // Zoom handlers
    const handleWheel = (e) => {
        e.evt.preventDefault();

        if (!e.evt.ctrlKey) return;

        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        const scaleBy = 1.1;
        const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        if (newScale < MIN_ZOOM || newScale > MAX_ZOOM) return;
        setScale(newScale);
        setPosition({
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        });
    };

    // Drag handlers
    const handleDragStart = () => {
        // Optional: Add drag start logic
    };

    const handleDragEnd = (e) => {
        setPosition({
            x: e.target.x(),
            y: e.target.y()
        });
    };
    // Seat color and selection handlers
    const getSeatColor = (category, seatId, isRangeStart) => {
        if (!category || category === "Disabled") return '#808080';

        if (rangeStartSeat && seatId) {
            const startCategory = seatCategories[rangeStartSeat];

            if (hoveredSeat?.id && category === startCategory) {
                const previewRange = getSeatsInRange(rangeStartSeat, hoveredSeat.id);
                if (previewRange.includes(seatId)) {
                    return PRIMARY;
                }
            }

            if (seatId === rangeStartSeat) {
                return '#FF4444';
            }

            if (selectedSeats.includes(seatId)) {
                return SECONDARY;
            }
        }

        if (isRangeStart) return '#FF4444';
        if (selectedSeats.includes(seatId)) return SECONDARY;

        const colorIndex = sortedTickets.findIndex(t => t.id === parseInt(category));
        const seatColors = ["gold", "blue", "green", '#641e16', "gray"];
        return colorIndex >= 0 ? seatColors[colorIndex] : '#CCCCCC';
    };

    const handleSeatSelection = (seatId, category) => {
        if (!category || category === "Disabled") return;

        if (selectedSeats.length > 0) {
            const firstSelectedCategory = seatCategories[selectedSeats[0]];
            if (category !== firstSelectedCategory) {
                setSelectedSeats([seatId]);
                setRangeStartSeat(seatId);
                return;
            }
        }

        if (!rangeStartSeat) {
            setRangeStartSeat(seatId);
            setSelectedSeats([seatId]);
            return;
        }

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

        if (startSection !== endSection) return [startSeat];

        const range = [];
        const startR = Math.min(startRow, endRow);
        const endR = Math.max(startRow, endRow);
        const startC = Math.min(startCol, endCol);
        const endC = Math.max(startCol, endCol);

        for (let row = startR; row <= endR; row++) {
            for (let col = startC; col <= endC; col++) {
                const seatId = `${startSection}-R${row}-S${col}`;
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

    const handleSeatHover = (seatId, category) => {
        if (!category || category === "Disabled") return;

        const ticket = sortedTickets.find(t => t.id === parseInt(category));
        setHoveredSeat({
            id: seatId,
            category: ticket?.name || 'Unknown',
            price: ticket?.price || 0
        });
    };

    const handleSeatLeave = () => {
        setHoveredSeat(null);
    };
    // Calculate total price
    const calculateTotalPrice = () => {
        return selectedSeats.reduce((total, seatId) => {
            const category = seatCategories[seatId];
            const ticket = sortedTickets.find(t => t.id === parseInt(category));
            return total + (ticket?.price || 0);
        }, 0);
    };
    const commonSectionProps = {
        rows: config.topRows,
        cols: config.topSeats,
        seatSize: SEAT_SIZE,
        gap: GAP,
        seatCategories,
        selectedSeats,
        rangeStartSeat,
        hoveredSeat,
        disabledSeats,
        getSeatColor,
        onSeatClick: handleSeatSelection,
        onSeatHover: handleSeatHover,
        onSeatLeave: handleSeatLeave
    };

    // Update the Stage and Group positioning
    // First, update the Stage and Layer structure with just ground and top section
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <div
                        ref={containerRef}
                        className="seating-layout-container"
                        style={{
                            height: '80vh',
                            width: '100%',
                            position: 'relative',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Stage
                            width={stageSize.width}
                            height={stageSize.height}
                            scaleX={scale}
                            scaleY={scale}
                            x={position.x}
                            y={position.y}
                            draggable
                            onWheel={handleWheel}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                       
                            <Layer>
                                <Group x={stageSize.width / 2} y={stageSize.height / 2}>
                                    {/* Ground Image - centered */}
                                    <KonvaImage
                                        // x={-config.imageWidth / 2}
                                        // y={-config.imageHeight / 2}
                                        width={config.imageWidth}
                                        height={config.imageHeight}
                                        image={groundImageObj}
                                    />

                                    {/* Top Section - centered and above ground */}
                                    <Section
                                        section="Top"
                                        // x={-((config.topSeats * (SEAT_SIZE + GAP)) / 2)}  // Center horizontally
                                        // y={-(config.imageHeight / 2 + config.topRows * (SEAT_SIZE + GAP) + 50)}  // Position above ground
                                        {...{
                                            ...commonSectionProps,
                                            rows: config.topRows,
                                            cols: config.topSeats
                                        }}
                                    />
                                </Group>
                            </Layer>
                        </Stage>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default KonvaSeatingChart;