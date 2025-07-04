import React, { useRef, useState } from 'react'
import { Button, Card, Col, Modal, Row } from 'react-bootstrap'
import { downloadTickets } from '../../../../Context/ticketDownloadUtils';
import TicketCanvas from '../Events/Tickets/Ticket_canvas';

const GenerateTicket = ({ticketData,ticketType,show,setShow,isMobile,formatDateRange,convertTo12HourFormat}) => {
    const ticketRefs = useRef([]);
    const [loading, setLoading] = useState(false);
    const downloadTicket = () => {
        downloadTickets(ticketRefs, ticketType?.type, setLoading);
    }
    // const TicketComponent = isMobile ? MobileTicket : Ticket3;
    const TicketComponent = TicketCanvas
  return (
    <div>
       {/* print model  */}
       <Modal show={show} onHide={() => setShow(false)} size="xl">
                <Modal.Header closeButton>
                    {ticketType?.type &&
                        <Button
                            variant="primary"
                            className="d-flex align-align-items-center gap-3"
                            onClick={() => downloadTicket()}
                            disabled={loading}
                        >
                            <span className="p-0 m-0">
                                {loading ? 'Please Wait...' : 'Download Tickets'}
                            </span>
                            <div>
                                <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon-24" height="32"><path opacity="0.4" d="M2 7.916V16.084C2 19.623 4.276 22 7.665 22H16.335C19.724 22 22 19.623 22 16.084V7.916C22 4.378 19.723 2 16.334 2H7.665C4.276 2 2 4.378 2 7.916Z" fill="currentColor"></path><path d="M7.72033 12.8555L11.4683 16.6205C11.7503 16.9035 12.2493 16.9035 12.5323 16.6205L16.2803 12.8555C16.5723 12.5615 16.5713 12.0865 16.2773 11.7945C15.9833 11.5025 15.5093 11.5025 15.2163 11.7965L12.7493 14.2735V7.91846C12.7493 7.50346 12.4133 7.16846 11.9993 7.16846C11.5853 7.16846 11.2493 7.50346 11.2493 7.91846V14.2735L8.78333 11.7965C8.63633 11.6495 8.44433 11.5765 8.25133 11.5765C8.06033 11.5765 7.86833 11.6495 7.72233 11.7945C7.42933 12.0865 7.42833 12.5615 7.72033 12.8555Z" fill="currentColor"></path></svg>
                            </div>

                        </Button>
                    }
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col lg="12">
                            <Card>
                                <Card.Body className={isMobile && 'p-0'}>
                                    {ticketType?.type === 'individual' ?
                                        ticketData?.bookings?.length > 0 &&
                                        <>
                                            <div className="d-flex gap-2 flex-column">
                                                {ticketData.bookings?.map((item, index) => (
                                                    <Col lg={12} md={12} xl={12} key={index}>
                                                        <div ref={el => ticketRefs.current[index] = el}>
                                                            <TicketComponent
                                                                category={item?.ticket?.event?.category}
                                                                title={item?.ticket?.event?.name}
                                                                ticketBG={item?.ticket?.event?.ticket_template_id}
                                                                ticketName={item?.ticket?.name}
                                                                date={formatDateRange(item?.ticket?.event?.date_range)}
                                                                city={item?.ticket?.event?.city}
                                                                address={item?.ticket?.event?.address}
                                                                time={convertTo12HourFormat(item?.ticket?.event?.start_time)}
                                                                OrderId={item?.order_id || item?.token}
                                                                quantity={1}
                                                            />
                                                        </div>
                                                    </Col>
                                                ))}
                                            </div>
                                        </>
                                        :
                                        ticketType?.type === 'combine' &&
                                        Object.entries(ticketData)?.length > 0 &&
                                        <>
                                            <div className="d-flex gap-2 flex-column">
                                                <Col lg={12} md={12} xl={12}>
                                                    <div ref={el => ticketRefs.current[1] = el}>
                                                        <TicketComponent
                                                            ticketName={ticketData?.ticket?.name || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.name)}
                                                            category={ticketData?.ticket?.event?.category || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.event?.category)}
                                                            ticketBG={ticketData?.ticket?.event?.ticket_template_id || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.event?.ticket_template_id)}
                                                            title={ticketData?.ticket?.event?.name || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.event?.name)}
                                                            date={formatDateRange(ticketData?.ticket?.event?.date_range || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.event?.date_range))}
                                                            city={ticketData?.ticket?.event?.city || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.event?.city)}
                                                            address={ticketData?.ticket?.event?.address || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.event?.address)}
                                                            time={convertTo12HourFormat(ticketData?.ticket?.event?.start_time || (ticketData?.bookings[0] && ticketData?.bookings[0]?.ticket?.event?.start_time))}
                                                            OrderId={ticketData?.order_id || ticketData?.token}
                                                            quantity={ticketData?.bookings?.length || 1}
                                                        />
                                                    </div>
                                                </Col>
                                            </div>
                                        </>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
            {/* print model end */}
    </div>
  )
}

export default GenerateTicket
