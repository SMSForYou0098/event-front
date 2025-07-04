import React, { useState, useEffect, useRef } from 'react';
import { Seatmap } from '@alisaitteke/seatmap-canvas-react';
import axios from 'axios';
import { Armchair, BedDouble, Sofa, Ticket } from 'lucide-react';

const SatMapSeats = ({ eventId, api, authToken, ErrorAlert, successAlert, tickets }) => {
    const seatmapRef = useRef(null);
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
    const [groundImage, setGroundImage] = useState(null);
    const [hoveredSeat, setHoveredSeat] = useState(null);
    const [tooltipTarget, setTooltipTarget] = useState(null);
    const [rangeStartSeat, setRangeStartSeat] = useState(null);
    const [assignedSeats, setAssignedSeats] = useState([]);
    const [seatConfig, setSeatConfig] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const seatColors = ["gold", "blue", "green", '#641e16', "gray"];
    const selectionColors = {
        available: "#E8E8E8",
        hover: "#B8E6FF",
        selected: "#FF4B4B",
        rangeStart: "#8B4FFF",
        inRange: "#FFB84D",
        assigned: "#808080"
    };
    const seatIcons = {
        VIP: <Sofa size={20} color="#fff" />,
        Standard: <Armchair size={20} color="#fff" />,
        Lounge: <Armchair size={20} color="#fff" />,
        Bed: <BedDouble size={20} color="#fff" />,
        Reserved: <Ticket size={20} color="#fff" />
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading to true
            try {
                if (tickets?.length) {
                    const sorted = [...tickets].sort((a, b) => b.price - a.price);
                    setSortedTickets(sorted);
                }
                await getExistingSeatConfig();
                const img = new Image();
                img.onload = () => setGroundImage(img);
                img.src = `https://placehold.co/${config.imageWidth}x${config.imageHeight}`;
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false); // Set loading to false on error
            }

        };

        fetchData();
    }, [tickets, config.imageWidth, config.imageHeight, eventId, api, authToken]);

    useEffect(() => {
        if (Object.keys(seatCategories).length > 0 && groundImage) {
            setSeatConfig(getSeatConfig());
            setIsLoading(false); // Set loading to false when seatConfig is ready
        }
    }, [seatCategories, config, groundImage]);

    const getExistingSeatConfig = async () => {
        try {
            if (!eventId) {
                ErrorAlert("Missing required parameters: config or eventId");
            }
            const response = await axios.get(`${api}seat-config/${eventId}`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            if (response.data?.status) {
                const seatData = response.data?.seats || [];
                const formattedSeats = seatData.reduce((acc, seat) => {
                    acc[seat?.seat_id] = seat?.category;
                    return acc;
                }, {});
                const disabledSeatsList = seatData.filter(seat => seat?.disabled === 1).map(seat => seat?.seat_id);
                setDisabledSeats(disabledSeatsList);
                setSeatCategories(formattedSeats);
                setConfig(JSON.parse(response.data?.configData?.config));
            }
        } catch (error) {
            ErrorAlert("Error updating seat config:", error.response?.data || error.message);
        }
    };

    const onRender = (ctx) => {
        if (groundImage) {
            const imageX = (ctx.canvas.width - config.imageWidth) / 2;
            const imageY = (ctx.canvas.height - config.imageHeight) / 2;
            ctx.drawImage(groundImage, imageX, imageY, config.imageWidth, config.imageHeight);
        }
    };

    const getSeatConfig = () => {
        const allSeats = [];
        const sections = [
            { name: "Top", rows: config.topRows, cols: config.topSeats, offsetX: (ctx) => (ctx.canvas.width - config.topSeats * 34) / 2, offsetY: 0 },
            { name: "Left", rows: config.leftRows, cols: config.leftSeats, offsetX: 0, offsetY: config.topRows * 34 },
            { name: "Right", rows: config.rightRows, cols: config.rightSeats, offsetX: (ctx) => ctx.canvas.width - config.rightSeats * 34, offsetY: config.topRows * 34 },
            { name: "Bottom", rows: config.bottomRows, cols: config.bottomSeats, offsetX: (ctx) => (ctx.canvas.width - config.bottomSeats * 34) / 2, offsetY: config.topRows * 34 + Math.max(config.leftRows, config.rightRows) * 34 }
        ];

        sections.forEach(section => {
            for (let row = 0; row < section.rows; row++) {
                for (let col = 0; col < section.cols; col++) {
                    const seatId = `${section}-R${row + 1}-S${col + 1}`;
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

    const RetriveTicketName = (id) => {
        let tname = sortedTickets?.find((ticket) => String(ticket?.id) === String(id)) || { name: 'Disabled' };
        return tname?.name
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

        if (start.section !== end.section) {
            return [startSeat];
        }

        const selectedSeats = [];
        const isHorizontal = start.absoluteRow === end.absoluteRow;
        const isVertical = start.originalSeat === end.originalSeat;

        if (!isHorizontal && !isVertical) {
            return [startSeat];
        }

        if (isHorizontal) {
            const minSeat = Math.min(start.originalSeat, end.originalSeat);
            const maxSeat = Math.max(start.originalSeat, end.originalSeat);

            for (let seat = minSeat; seat <= maxSeat; seat++) {
                const seatId = `${start.section}-R${start.originalRow}-S${seat}`;
                if (!isSeatValid(start.section, start.originalRow, seat)) {
                    return [startSeat];
                }
                selectedSeats.push(seatId);
            }
        }

        if (isVertical) {
            const minRow = Math.min(start.originalRow, end.originalRow);
            const maxRow = Math.max(start.originalRow, end.originalRow);

            for (let row = minRow; row <= maxRow; row++) {
                const seatId = `${start.section}-R${row}-S${start.originalSeat}`;
                if (!isSeatValid(start.section, row, start.originalSeat)) {
                    return [startSeat];
                }
                selectedSeats.push(seatId);
            }
        }

        return selectedSeats.length ? selectedSeats : [startSeat];
    };

    const isSeatValid = (section, row, seat) => {
        const seatId = `${section}-R${row}-S${seat}`;
        return seatCategories[seatId] && seatCategories[seatId] !== "Disabled";
    };

    const isSeatAssigned = (seatId) => {
        return assignedSeats.includes(seatId);
    };

    const handleMouseLeave = () => {
        setHoveredSeat(null);
        setTooltipTarget(null);
    };

    const handleSeatClick = (seatId) => {
        const category = seatCategories[seatId];
        if (!category) return;

        if (selectedSeats.length > 0) {
            const firstSelectedCategory = seatCategories[selectedSeats[0]];
            if (category !== firstSelectedCategory) {
                setSelectedSeats([seatId]);
                setRangeStartSeat(seatId);
                return;
            }
        }

        if (!rangeStartSeat || !selectedSeats.includes(rangeStartSeat)) {
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

    const handleMouseEnter = (event, seatId, category) => {
        setHoveredSeat({
            id: seatId,
            category: category ? RetriveTicketName(category) : "General",
            price: tickets.find(ticket => parseInt(ticket.id) === parseInt(category))?.price || "N/A"
        });
        setTooltipTarget(event.target);

        if (rangeStartSeat) {
            const previewRange = getSeatsInRange(rangeStartSeat, seatId);

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

            if (previewRange.length > 1) {
                previewRange.forEach(id => {
                    const elem = document.querySelector(`[data-seat-id="${id}"]`);
                    if (elem && !isSeatAssigned(id) && !selectedSeats.includes(id) && id !== rangeStartSeat) {
                        const seatCategory = seatCategories[id];
                        if (seatCategory && seatCategory !== "Disabled" &&
                            seatCategory === seatCategories[rangeStartSeat]) {
                            elem.style.backgroundColor = selectionColors.inRange;
                            elem.style.opacity = "0.8";
                        }
                    }
                });
            }
        }
    };

    const totalSeats = selectedSeats.length;
    const totalPrice = selectedSeats.reduce((sum, seatId) => {
        const category = seatCategories[seatId];
        const price = sortedTickets.find(ticket => ticket.id === category)?.price || 0;
        return sum + price;
    }, 0);
    if (isLoading) {
        return <div>Loading...</div>; // Or a loading spinner
    }
    return (
        <div>
            <Seatmap
                ref={seatmapRef}
                seats={seatConfig}
                width={500}
                height={500}
                onRender={onRender}
                onError={(error) => {
                    console.error('Seatmap Error:', error);
                    ErrorAlert('Failed to render seat map');
                }}
            />
            <div>
                <h5>Total Seats: {totalSeats}</h5>
                <h5>Total Price: ₹{totalPrice}</h5>
            </div>
        </div>
    );
};

export default SatMapSeats;