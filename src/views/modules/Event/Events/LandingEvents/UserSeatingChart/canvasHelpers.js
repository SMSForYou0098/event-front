const drawIcon = (ctx, x, y, size, pathData, color = '#FFF') => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke(new Path2D(pathData));
    ctx.restore();
};

// Lucide icon paths
const ICONS = {
    // X icon path from Lucide
    x: "M18 6L6 18M6 6l12 12",
    check: "M20 6L9 17l-5-5",
    // Ticket icon path from Lucide
    ticket: "M2 9c0-.6.4-1 1-1h18c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V9zm0 0c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2"
};

export const canvasHelpers = {
    drawSeat: (ctx, x, y, size, color, isSelected, isHovered, displayId) => {
        const radius = 4; // Border radius size

        // Draw main seat rectangle with rounded corners
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + size - radius, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
        ctx.lineTo(x + size, y + size - radius);
        ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
        ctx.lineTo(x + radius, y + size);
        ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();

        // Fill the rounded rectangle
        ctx.fillStyle = color;
        ctx.fill();

        // Draw border with same rounded corners
        ctx.strokeStyle = isHovered ? '#000' : '#666';
        ctx.lineWidth = 1;
        ctx.stroke();

        // If seat is disabled, draw X icon
        if (color === '#808080') {
            const iconSize = size * 0.7;
            const iconX = x + (size - iconSize) / 2;
            const iconY = y + (size - iconSize) / 2;
            drawIcon(ctx, iconX, iconY, iconSize, ICONS.x, '#FFF');
        } else {
            // For selected seats, draw check icon and outer border
            if (isSelected) {
                // Draw outer border with padding and rounded corners
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                const padding = 3;
                ctx.beginPath();
                ctx.moveTo(x - padding + radius, y - padding);
                ctx.lineTo(x - padding + size + padding * 2 - radius, y - padding);
                ctx.quadraticCurveTo(x - padding + size + padding * 2, y - padding, x - padding + size + padding * 2, y - padding + radius);
                ctx.lineTo(x - padding + size + padding * 2, y - padding + size + padding * 2 - radius);
                ctx.quadraticCurveTo(x - padding + size + padding * 2, y - padding + size + padding * 2, x - padding + size + padding * 2 - radius, y - padding + size + padding * 2);
                ctx.lineTo(x - padding + radius, y - padding + size + padding * 2);
                ctx.quadraticCurveTo(x - padding, y - padding + size + padding * 2, x - padding, y - padding + size + padding * 2 - radius);
                ctx.lineTo(x - padding, y - padding + radius);
                ctx.quadraticCurveTo(x - padding, y - padding, x - padding + radius, y - padding);
                ctx.closePath();
                ctx.stroke();

                // Draw check icon
                const iconSize = size * 0.7;
                const iconX = x + (size - iconSize) / 2;
                const iconY = y + (size - iconSize) / 2;
                drawIcon(ctx, iconX, iconY, iconSize, ICONS.check, '#FFF');
            } else {
                // Draw seat number for non-disabled, non-selected seats
                ctx.fillStyle = '#000';
                ctx.font = '10px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(displayId, x + size / 2, y + size / 2);
            }
        }
    }
};