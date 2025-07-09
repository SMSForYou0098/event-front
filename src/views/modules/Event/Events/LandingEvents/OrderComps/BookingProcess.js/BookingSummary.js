import { ArrowLeft } from 'lucide-react';
import React from 'react'
import { Alert, Badge, Button, Card, Col, TabPane } from 'react-bootstrap'

const BookingSummary = ({
    code,
    setCode,
    applyPromode,
    discount,
    appliedPromoCode,
    ticketCurrency,
    subtotal,
    handleRemovePromocode,
    totalDiscount,
    baseAmount,
    centralGST,
    totalTax,
    grandTotal,
    isMobile,
    handlePayment,
    isAttendeeRequired,
    disable,
    loading,
    setIsProceed,
    isProceed
}) => {
    return (
<Col lg="4" className="mx-auto text-center">
            {
                !isAttendeeRequired && isProceed &&
                <Card className="position-relative">
                <Button
    variant="light"
    onClick={() => setIsProceed(false)}
    className="position-absolute start-0 top-0 m-2 d-flex align-items-center gap-1"
  >
    <ArrowLeft size={16} />
    
  </Button>
                <div className="card-header">
                    <h4 className="mb-0">Booking Summary</h4>
                </div>
                <Card.Body>
                    
                    <div className="border-bottom mt-4">
                        {
                            discount !== 0 &&
                            <div className="d-flex justify-content-end  mb-4">
                                <TabPane id="alerts-disimissible-component" className=" tab-pane tab-example-result fade active show " role="tabpanel" aria-labelledby="alerts-disimissible-component-tab">
                                    <Alert className="d-flex align-content-center justify-content-between gap-2 alert-success alert-dismissible fade show mb-0" role="alert">
                                        <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.94118 10.7474V20.7444C5.94118 21.0758 5.81103 21.3936 5.57937 21.628C5.3477 21.8623 5.0335 21.994 4.70588 21.994H2.23529C1.90767 21.994 1.59347 21.8623 1.36181 21.628C1.13015 21.3936 1 21.0758 1 20.7444V11.997C1 11.6656 1.13015 11.3477 1.36181 11.1134C1.59347 10.879 1.90767 10.7474 2.23529 10.7474H5.94118ZM5.94118 10.7474C7.25166 10.7474 8.50847 10.2207 9.43512 9.28334C10.3618 8.34594 10.8824 7.07456 10.8824 5.74887V4.49925C10.8824 3.83641 11.1426 3.20071 11.606 2.73201C12.0693 2.26331 12.6977 2 13.3529 2C14.0082 2 14.6366 2.26331 15.0999 2.73201C15.5632 3.20071 15.8235 3.83641 15.8235 4.49925V10.7474H19.5294C20.1847 10.7474 20.8131 11.0107 21.2764 11.4794C21.7397 11.9481 22 12.5838 22 13.2466L20.7647 19.4947C20.5871 20.2613 20.25 20.9196 19.8045 21.3704C19.3589 21.8211 18.8288 22.04 18.2941 21.994H9.64706C8.6642 21.994 7.72159 21.599 7.0266 20.896C6.33162 20.1929 5.94118 19.2394 5.94118 18.2451" stroke="currentColor" />
                                        </svg>
                                        <h6 className="p-0 m-0"><Badge bg="danger">{appliedPromoCode}</Badge></h6>
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>Success!</strong> Promocode applied succesfully!
                                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => handleRemovePromocode()}></button>
                                            </div>
                                        </div>
                                    </Alert>
                                </TabPane>
                            </div>
                        }
                        <div className="d-flex justify-content-between mb-4">
                            <h6>Sub Total</h6>
                            <h6 className="text-primary">{ticketCurrency}{subtotal}</h6>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <h6>Discount</h6>
                            <h6 className="text-success">{ticketCurrency}{totalDiscount}</h6>
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
                    </div>
                    <div className="border-bottom">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="PROMO CODE"
                                aria-label="Promo Code"
                                aria-describedby="PromoCode"
                                value={code}
                                onChange={(e) => {
                                    const sanitizedValue = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                                    setCode(sanitizedValue);
                                }}
                            />
                            <Button
                                className="btn btn-primary"
                                type="button"
                                id="CouponCode"
                                onClick={() => applyPromode()}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="d-flex justify-content-between mb-4">
                            <h6 className="mb-0">Order Total</h6>
                            <h5 className="text-primary mb-0">
                                {ticketCurrency}{grandTotal}
                            </h5>

                        </div>
                        <div className="alert border-primary rounded border-1 mb-4">
                            <div className="d-flex justify-content-between align-items-center ">
                                <h6 className="text-primary mb-0">
                                    Total Savings on this order
                                </h6>
                                <h6 className="text-primary mb-0">
                                    <b>{ticketCurrency}{subtotal * discount / 100}</b>
                                </h6>
                            </div>
                        </div>
                    </div>
                </Card.Body>
            </Card>
            }
                        {
                            !isMobile && isAttendeeRequired &&
                            <div className="d-flex">
                                <Button
                                    id="place-order"
                                    to="#"
                                    disabled={disable || loading}
                                    // onClick={handleBooking}
                                    onClick={() => handlePayment()}
                                    variant="primary d-block mt-3 next w-100"
                                >
                                    Next
                                </Button>
                            </div>
                        }
                        {
                            !isMobile && isProceed && <div className="d-flex">
                                <Button
                                    id="place-order"
                                    to="#"
                                    disabled={disable || loading}
                                    // onClick={handleBooking}
                                    onClick={() => handlePayment()}
                                    variant="primary d-block mt-3 next w-100"
                                >
                                    CheckOut
                                </Button>
                            </div>
                        }
        </Col>
    )
}

export default BookingSummary