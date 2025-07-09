import React from 'react'
import { Alert, Card, Col } from 'react-bootstrap'
import CheckOutTickets from '../../../../TicketModal/CheckOutTickets'
import { AlertCircle, Calendar } from 'lucide-react'
import { SECONDARY } from '../../../../CustomUtils/Consts'
import { useMyContext } from '../../../../../../../Context/MyContextProvider'

const BookingTickets = (props) => {
    const {
        event,
        selectedTickets,
        error,
        isMobile,
        resetCounterTrigger,
        getTicketCount,
        bookingdate,
        getCurrencySymbol,
        tickets
    } = props
    const {formatDateRange} = useMyContext()
    return (
        <Col lg="12">
            {error &&
                <Alert variant="danger d-flex gap-2 align-items-center" role="alert">
                    <AlertCircle />  {error}
                </Alert>
            }
            <Card>
                <Card.Header className="py-3">
                    <div className="row align-items-center">
                        <div className="col-md-6 col-12">
                            <h5 className="mb-0">{event?.name}</h5>
                        </div>
                        {(bookingdate || event?.date_range) &&
                            <div className="col-md-6 col-12 text-md-end text-start mt-2 mt-md-0">
                                <span className="text-black d-flex align-items-center gap-1 justify-content-md-end">
                                    {/* <button >
                                    </button> */}
                                        <Calendar size={16} color={SECONDARY} />
                                    : {bookingdate || formatDateRange(event?.date_range)}
                                </span>
                            </div>
                        }
                    </div>
                </Card.Header>


                <Card.Body className="p-0">
                    <CheckOutTickets
                        event={event}
                        tickets={tickets}
                        isMobile={isMobile}
                        resetCounterTrigger={resetCounterTrigger}
                        getTicketCount={getTicketCount}
                        selectedTickets={selectedTickets}
                        getCurrencySymbol={getCurrencySymbol}
                    />
                </Card.Body>
            </Card>
        </Col>
    )
}

export default BookingTickets