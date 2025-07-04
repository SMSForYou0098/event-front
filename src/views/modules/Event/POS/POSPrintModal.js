import { QRCodeSVG } from 'qrcode.react';
import React, { useRef } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useReactToPrint } from 'react-to-print';
import { useMyContext } from '../../../../Context/MyContextProvider';
import styled from 'styled-components';
const PrintWrapper = styled.div`
  @media print {
    width: 100%;
    padding: 20px;
    
    h5 {
      font-size: 20px !important;
      margin-bottom: 15px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    .qr {
      margin: 20px auto;
      max-width: 200px;
    }
    
    table {
      width: 100% !important;
      margin: 15px 0;
      table-layout: fixed;
    }
    
    th, td {
      font-size: 14px !important;
      padding: 6px !important;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 150px;
    }
    
    .ticket-name {
      width: 50%;
    }
    
    .qty-column {
      width: 20%;
    }
    
    .price-column {
      width: 30%;
    }
    
    p {
      font-size: 14px !important;
      margin: 10px 0;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    
    .footer-text {
      font-size: 16px !important;
      margin-top: 20px;
    }
  }
`;
const POSPrintModal = (props) => {
    const { showPrintModel, closePrintModel, event, bookingData, subtotal, totalTax, discount, grandTotal } = props;
    const { formatDateTime } = useMyContext();
    const printRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        // Add print specific styling
        pageStyle: `
            @page {
                size: 80mm 297mm;
                margin: 10mm;
            }
        `
    });
    return (
        <Modal show={showPrintModel} onHide={() => closePrintModel()} size="sm" >
            {/* <Modal.Header closeButton>
                <Modal.Title>Invoice</Modal.Title>
            </Modal.Header> */}
            <Modal.Body ref={printRef}>
                <PrintWrapper ref={printRef}>
                    <div style={{ textAlign: 'center', color: "black", fontWeight: 'bold' }}>
                        <h5>{event?.name}</h5>
                        <div className='qr'>
                            <QRCodeSVG
                                size={150}
                                style={{ height: "auto" }}
                                className=''
                                value={bookingData?.token}
                            />
                        </div>
                        {/* <span>{bookingData?.id}</span> */}
                        <p>
                            {formatDateTime(bookingData?.created_at)}
                        </p>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text-black">Qty</th>
                                    <th className="text-black">Ticket Name</th>
                                    <th className="text-black">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-black">{bookingData?.quantity}</td>
                                    <td className="text-black text-wrap">{bookingData?.ticket?.name}</td>
                                    <td className="text-black">{subtotal}</td>
                                </tr>
                            </tbody>

                        </table>
                        {/* <hr /> */}
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className="text-black p-0 text-end">SUBTOTAL</td>
                                    <td className="text-black py-0 text-end">₹{subtotal}</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td className="text-black p-0 text-end">TOTAL TAX</td>
                                    <td className="text-black py-0 text-end">₹{totalTax}</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>
                                    <td className="text-black p-0 text-end">DISCOUNT</td>
                                    <td className="text-black py-0 text-end">₹{discount}</td>
                                </tr>
                            </tbody>
                            <tbody>
                                <tr>

                                    <td className="text-black text-end pe-0">TOTAL</td>
                                    <td className="text-black text-end">₹{grandTotal}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style={{ fontSize: '14px' }}>
                            Thank You for Payment<br />
                            {/* Please Come Again */}
                        </p>
                        <p style={{ fontSize: '14px' }}>
                            www.getyourticket.co.in
                        </p>
                        {/* <hr /> */}
                        {/* <p>- - - - - - - - - -</p> */}
                    </div>
                </PrintWrapper>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => closePrintModel()}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handlePrint()}>
                    Print Invoice
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default POSPrintModal
