import { Group } from 'react-konva';
import Seat from './Seat';

const Section = ({
    section,
    rows,
    cols,
    seatSize,
    gap,
    seatCategories,
    selectedSeats,
    rangeStartSeat,
    hoveredSeat,
    disabledSeats,
    getSeatColor,
    onSeatClick,
    onSeatHover,
    onSeatLeave
}) => {
    return (
        <Group>
            {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => {
                    const seatId = `${section}-R${row + 1}-S${col + 1}`;
                    const displayId = `${section[0]}${row + 1}-${col + 1}`;
                    const category = seatCategories[seatId];
                    const isSelected = selectedSeats.includes(seatId);
                    const isRangeStart = seatId === rangeStartSeat;
                    const isHovered = hoveredSeat?.id === seatId;
                    const isDisabled = disabledSeats.includes(seatId);

                    return (
                        <Seat
                            key={seatId}
                            x={col * (seatSize + gap)}
                            y={row * (seatSize + gap)}
                            size={seatSize}
                            color={getSeatColor(category, seatId, isRangeStart)}
                            isSelected={isSelected}
                            isDisabled={isDisabled}
                            isRangeStart={isRangeStart}
                            isHovered={isHovered}
                            displayId={displayId}
                            onClick={() => onSeatClick(seatId, category)}
                            onMouseEnter={() => onSeatHover(seatId, category)}
                            onMouseLeave={onSeatLeave}
                        />
                    );
                })
            )}
        </Group>
    );
};

export default Section;