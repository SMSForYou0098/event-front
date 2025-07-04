import React from 'react'
import { Alert, Card, Col } from 'react-bootstrap'
import { AlertCircle, Calendar } from 'lucide-react'
import { SECONDARY } from '../../../CustomUtils/Consts'
import RenderUserSeats from './RenderUserSeats'
import { useMyContext } from '../../../../../../Context/MyContextProvider'


const UserSeatingChart = ({ error, event, isMobile, resetCounterTrigger, getTicketCount, selectedTickets, getCurrencySymbol, bookingdate }) => {
    const {successAlert,authToken,api,ErrorAlert} = useMyContext()
    return (
        <Col lg="8">
            {error &&
                <Alert variant="danger d-flex align-items-center" role="alert">
                    <AlertCircle />
                    <div>
                        {error}
                    </div>
                </Alert>
            }
            <Card>
                <Card.Header className="py-3">
                    <div className="row align-items-center">
                        <div className="col-md-6 col-12">
                            <h5 className="mb-0">{event?.name}</h5>
                        </div>
                        {bookingdate &&
                            <div className="col-md-6 col-12 text-md-end text-start mt-2 mt-md-0">
                                <span className="text-black d-flex align-items-center gap-1 justify-content-md-end">
                                    <Calendar size={16} color={SECONDARY} /> : {bookingdate}
                                </span>
                            </div>
                        }
                    </div>
                </Card.Header>

                <Card.Body className="p-0">
                    <RenderUserSeats 
                        eventId={event?.id}
                        api={api}
                        authToken={authToken}
                        ErrorAlert={ErrorAlert}
                        successAlert={successAlert}
                        tickets={event?.tickets}
                    />
                </Card.Body>
            </Card>
        </Col>
    )
}

export default UserSeatingChart