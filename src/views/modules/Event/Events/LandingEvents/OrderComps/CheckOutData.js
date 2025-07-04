import React from 'react'
import { Row } from 'react-bootstrap';
import BookingTickets from './BookingProcess.js/BookingTickets';
import BookingSummary from './BookingProcess.js/BookingSummary';
import DynamicAttendeeForm from './DynamicAttendeeForm';
import UserSeatingCanvas from '../UserSeatingChart/UserSeatingCanvas';
const CheckOutData = (props) => {
    const { event, selectedTickets, currentStep, error, isMobile, resetCounterTrigger, getTicketCount, getCurrencySymbol, code, setCode, applyPromode, discount, appliedPromoCode, ticketCurrency, subtotal, handleRemovePromocode, totalDiscount, baseAmount, centralGST, totalTax, grandTotal, handlePayment, categoryData, attendeeState, setAttendeeState, isAttendeeRequired, AttendyView, setAttendees, setDisable, disable, getAttendees, bookingdate, loading, tickets } = props
    return (
        <div id="checkout" className={`iq-product-tracker-card b-0 ${currentStep === 'checkout' ? 'show' : ''}`}>
            <Row>
                {attendeeState ?
                    <DynamicAttendeeForm
                        showAttendeeSuggetion={event?.online_att_sug === 0}
                        isAgent={false}
                        getAttendees={getAttendees}
                        category_id={categoryData?.categoryData?.id}
                        setDisable={setDisable}
                        disable={disable}
                        AttendyView={AttendyView}
                        event={event}
                        setAttendees={setAttendees}
                        apiData={categoryData?.customFieldsData}
                        setAttendeeState={setAttendeeState}
                        selectedTickets={selectedTickets}
                        quantity={selectedTickets?.quantity}
                    />
                    :
                    parseInt(event?.ticket_system) === 1 ?
                        <UserSeatingCanvas
                            bookingdate={bookingdate}
                            error={error}
                            event={event}
                            isMobile={isMobile}
                            resetCounterTrigger={resetCounterTrigger}
                            getTicketCount={getTicketCount}
                            selectedTickets={selectedTickets}
                            getCurrencySymbol={getCurrencySymbol}
                        />
                        :
                        <BookingTickets
                            event={event}
                            tickets={tickets}
                            bookingdate={bookingdate}
                            error={error}
                            isMobile={isMobile}
                            resetCounterTrigger={resetCounterTrigger}
                            getTicketCount={getTicketCount}
                            selectedTickets={selectedTickets}
                            getCurrencySymbol={getCurrencySymbol}
                        />
                }

                <BookingSummary
                    disable={disable}
                    code={code}
                    loading={loading}
                    isAttendeeRequired={isAttendeeRequired}
                    setCode={setCode}
                    applyPromode={applyPromode}
                    discount={discount}
                    appliedPromoCode={appliedPromoCode}
                    ticketCurrency={ticketCurrency}
                    subtotal={subtotal}
                    handleRemovePromocode={handleRemovePromocode}
                    totalDiscount={totalDiscount}
                    baseAmount={baseAmount}
                    centralGST={centralGST}
                    totalTax={totalTax}
                    grandTotal={grandTotal}
                    isMobile={isMobile}
                    handlePayment={handlePayment}
                />
            </Row>
        </div>
    )
}

export default CheckOutData