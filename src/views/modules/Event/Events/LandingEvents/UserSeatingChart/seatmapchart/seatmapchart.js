import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Button, Spinner } from "react-bootstrap";

const sections = [
  { id: "A", label: "A", angle: -90, color: "#a3d977" },
  { id: "B", label: "B", angle: -75, color: "#a3d977" },
  { id: "C", label: "C", angle: -60, color: "#a3d977" },
  { id: "D", label: "D", angle: -45, color: "#a3d977" },
  { id: "E", label: "E", angle: -30, color: "#a3d977" },
  { id: "F", label: "F", angle: -15, color: "#a3d977" },
  { id: "G", label: "G", angle: 0, color: "#a3d977" },
  { id: "H", label: "H", angle: 15, color: "#a3d977" },
  { id: "I", label: "I", angle: 30, color: "#74c0fc" },
  { id: "J", label: "J", angle: 45, color: "#74c0fc" },
  { id: "K", label: "K", angle: 60, color: "#74c0fc" },
  { id: "L", label: "L", angle: 75, color: "#74c0fc" },
  { id: "M", label: "M", angle: 90, color: "#74c0fc" },
];

const generateSeats = (sectionId) => {
  const data = [];
  let seatId = 1;
  for (let i = 0; i < 5000; i++) {
    const row = Math.floor(i / 50) + 1;
    const number = (i % 50) + 1;
    const status = Math.random() < 0.1 ? "booked" : "available";
    data.push({ id: seatId++, section: sectionId, row, number, status });
  }
  return data;
};

const StadiumView = ({ onSelect }) => {
  return (
    <motion.svg width="100%" height="600" viewBox="0 0 500 500" className="bg-light rounded shadow">
      <circle cx="250" cy="250" r="180" fill="#e7f5ff" stroke="#74c0fc" strokeWidth="4" />
      {sections.map((section) => (
        <motion.path
          key={section.id}
          d={describeArc(250, 250, 180, section.angle, section.angle + 20)}
          fill={section.color}
          stroke="#000"
          strokeWidth="1"
          whileHover={{ scale: 1.1 }}
          onClick={() => onSelect(section)}
          style={{ cursor: "pointer" }}
        />
      ))}
    </motion.svg>
  );
};

const SectionSeatView = ({ section, seats, onBack }) => {
  return (
    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="position-relative">
      <motion.svg width="100%" height="600" viewBox="0 0 500 500" className="bg-white rounded shadow">
        {seats.map((seat) => {
          const angle = ((seat.number % 50) / 50) * Math.PI * 2;
          const radius = 120 + (seat.row % 10) * 8;
          const x = 250 + radius * Math.cos(angle);
          const y = 250 + radius * Math.sin(angle);
          return (
            <circle key={seat.id} cx={x} cy={y} r="5" fill={seat.status === "booked" ? "#fa5252" : "#40c057"} />
          );
        })}
        <text x="250" y="40" textAnchor="middle" fontSize="18" fill="#333" fontWeight="bold">
          {section.label} - Seat Selection
        </text>
      </motion.svg>
      <Button variant="secondary" className="mt-3" onClick={onBack}>
        Back to Stadium
      </Button>
    </motion.div>
  );
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  let start = polarToCartesian(x, y, radius, endAngle);
  let end = polarToCartesian(x, y, radius, startAngle);
  let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${x} ${y} Z`;
};

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export default function StadiumSeating() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [seatData, setSeatData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectSection = (section) => {
    setLoading(true);
    setTimeout(() => {
      setSeatData(generateSeats(section.id));
      setSelectedSection(section);
      setLoading(false);
    }, 500);
  };

  return (
    <Container className="py-4 text-center">
      <h2 className="mb-4">Cricket Stadium Seating</h2>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <AnimatePresence mode="wait">
          {!selectedSection ? (
            <StadiumView key="stadium" onSelect={handleSelectSection} />
          ) : (
            <SectionSeatView key="section" section={selectedSection} seats={seatData} onBack={() => setSelectedSection(null)} />
          )}
        </AnimatePresence>
      )}
    </Container>
  );
}
