import { Rect } from 'react-konva';

const Seat = ({ 
    x, 
    y, 
    size, 
    color, 
    isSelected, 
    isDisabled,
    isRangeStart,
    isHovered,
    displayId,
    onMouseEnter,
    onMouseLeave,
    onClick 
}) => {
    return (
        <Rect
            x={x}
            y={y}
            width={size}
            height={size}
            fill={color}
            cornerRadius={4}
            strokeWidth={1}
            stroke={isHovered ? '#000' : '#666'}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    );
};

export default Seat;