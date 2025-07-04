import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChair } from '@fortawesome/free-solid-svg-icons';

const SeatingChart = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const eventGround = {
    sections: [
      {
        id: 'A',
        name: 'Section A',
        blocks: [
          {
            id: 'A1', rows: [
              { id: 'A1-1', seats: [1, 2, 3, 4, 5, 6] },
              { id: 'A1-2', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-3', seats: [1, 2, 3, 4] },
              { id: 'A1-4', seats: [1, 2, 3,] }
            ]
          },
          {
            id: 'A2', rows: [
              { id: 'A1-1', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-2', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-3', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-4', seats: [1, 2, 3, 4, 5] }
            ]
          },
          {
            id: 'A3', rows: [
              { id: 'A1-1', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-2', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-3', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-4', seats: [1, 2, 3, 4, 5] }
            ]
          },
          {
            id: 'A4', rows: [
              { id: 'A1-1', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-2', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-3', seats: [1, 2, 3, 4, 5] },
              { id: 'A1-4', seats: [1, 2, 3, 4, 5] }
            ]
          },
        ],
      },
      {
        id: 'B',
        name: 'Section B',
        blocks: [
          { id: 'B1', rows: [{ id: 'B1-1', seats: [1, 2, 3, 4, 5] }, { id: 'B1-2', seats: [1, 2, 3, 4, 5] }] },
          { id: 'B2', rows: [{ id: 'B2-1', seats: [1, 2, 3, 4, 5] }, { id: 'B2-2', seats: [1, 2, 3, 4, 5] }] },
          { id: 'B3', rows: [{ id: 'B3-1', seats: [1, 2, 3, 4, 5] }, { id: 'B3-2', seats: [1, 2, 3, 4, 5] }] },
        ],
      },
      // More sections...
    ],
  };

  const handleSeatClick = (sectionId, blockId, rowId, seatNumber) => {
    const seatId = `${sectionId}-${blockId}-${rowId}-${seatNumber}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((seat) => seat !== seatId) : [...prev, seatId]
    );
  };

  const styles = {
    seatingChart: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      alignItems: 'center',
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #ccc',
      padding: '10px',
      marginBottom: '10px',
      width: 'fit-content',
    },
    blocks: {
      display: 'flex',
      gap: '20px',
    },
    block: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    row: {
      display: 'flex',
      gap: '10px',
      marginBottom: '5px',
    },
    seat: {
      width: '30px',
      height: '30px',
      backgroundColor: '#eee',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      borderRadius: '4px',
    },
    selectedSeat: {
      backgroundColor: '#f00',
    },
    stage: {
      width: '100%',
      height: '50px',
      backgroundColor: '#333',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px',
    },
  };

  return (
    <div>
      <div style={styles.stage}>STAGE</div>
      {eventGround.sections.map((section) => (
        <div key={section.id} style={styles.section}>
          <h3>{section.name}</h3>
          <div style={styles.blocks}>
            {section.blocks.map((block) => (
              <div key={block.id} style={styles.block}>
                {block.rows.map((row) => (
                  <div key={row.id} style={styles.row}>
                    {row.seats.map((seat) => (
                      <div
                        key={seat}
                        style={{
                          ...styles.seat,
                          ...(selectedSeats.includes(`${section.id}-${block.id}-${row.id}-${seat}`)
                            ? styles.selectedSeat
                            : {}),
                        }}
                        onClick={() => handleSeatClick(section.id, block.id, row.id, seat)}
                      >
                        <FontAwesomeIcon icon={faChair} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeatingChart;