import React from 'react'
import { Button, Card } from 'react-bootstrap'
import DiscoutFIeldGroup from '../../CustomUtils/BookingUtils/DiscoutFIeldGroup'
import { MoveLeft } from 'lucide-react'

const AgentBookingSummary = (props) => {
    const { bookings, ticketCurrency, subtotal, discount, baseAmount,
        centralGST, totalTax, discountType, setDiscountType, discountValue,
        setDiscountValue, disableChoice, handleDiscount, grandTotal, HandleBookingModel,
        isMobile, disabled, isAttendeeRequired, UserData, ticketCount, setIsProceed, isProceed } = props

    const SummaryCard = () => (
        <Card>
            <div className="d-flex justify-content-between align-items-center px-3 pt-3">
                {
                    isMobile && <Button
                    variant="light"
                    onClick={() => setIsProceed(false)}
                    className="d-flex align-items-center gap-1"
                    size="sm"
                >
                    <MoveLeft />
                </Button>
                }
                <h5 className="mb-0 flex-grow-1 text-center w-100 me-5">
                    Booking Summary
                </h5>
            </div>
            
            <Card.Body>
                <div className="d-flex gap-2 justify-content-center">
                    <div className="d-flex gap-2">
                        <div>
                            Bookings :<span className="text-secondary"> {bookings?.allbookings?.length ?? 0}</span>
                        </div>
                        <div>
                            Amt :<span className="text-danger"> ₹{(parseInt(bookings?.amount) ?? 0).toFixed(2)}</span>
                        </div>
                        <div>
                            Disc :<span className="text-primary"> ₹{(parseInt(bookings?.discount) ?? 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div className="border-bottom">
                </div>
                <div className="mt-4">
                    <div className="d-flex justify-content-between mb-4">
                        <h6>Sub Total</h6>
                        <h6 className="text-primary">{ticketCurrency}{subtotal}</h6>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <h6>Total Tickets</h6>
                        <h6 className="text-primary">{ticketCount}</h6>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <h6>Discount</h6>
                        <h6 className="text-success">{ticketCurrency}{discount}</h6>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <h6>Base Amount</h6>
                        <h6 className="text-success">{ticketCurrency}{baseAmount}</h6>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <h6>Central GST (CGST) @ 9%</h6>
                        <h6 className="text-success">{ticketCurrency}{centralGST}</h6>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <h6>State GST (SGST) @ 9%</h6>
                        <h6 className="text-success">{ticketCurrency}{centralGST}</h6>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <h6>Convenience fees</h6>
                        <h6 className="text-success">{ticketCurrency}{totalTax}</h6>
                    </div>
                    {UserData?.agent_disc === 1 &&
                        <DiscoutFIeldGroup
                            discountType={discountType}
                            setDiscountType={setDiscountType}
                            discountValue={discountValue}
                            setDiscountValue={setDiscountValue}
                            disableChoice={disableChoice}
                            handleDiscount={handleDiscount}
                        />
                    }
                </div>
                <div className="mt-4">
                    <div className="d-flex justify-content-between mb-4">
                        <h6 className="mb-0">Order Total</h6>
                        <h5 className="text-primary mb-0">
                            {ticketCurrency}{grandTotal}
                        </h5>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )

    return (
        <div className="mx-auto text-center">
            {(isMobile && (!isAttendeeRequired && isProceed)) && (
                <SummaryCard />
            )}
            
            {!isMobile && (
                <>
                    <SummaryCard />
                    <div className="d-flex">
                        <Button
                            id="place-order"
                            to="#"
                            disabled={disabled}
                            onClick={() => HandleBookingModel()}
                            variant="primary d-block mt-3 next w-100"
                        >
                            {isAttendeeRequired ? 'Next' : 'Checkout'}
                        </Button>
                    </div>
                </>
            )}
        </div>
    )
}

export default AgentBookingSummary