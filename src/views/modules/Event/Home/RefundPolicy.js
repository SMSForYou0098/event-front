import React from 'react'
import { Card, Container } from 'react-bootstrap'

const RefundPolicy = () => {
    return (
        <div>
            <Container>
                <Card className="pt-5 mb-3">
                    <Card.Header as="h5">Return, Refund, & Cancellation Policy</Card.Header>
                    <Card.Body>
                        <Card.Title>Booking of Tickets</Card.Title>
                        <Card.Text>
                            The user must provide Get Your Ticket with the correct information pertaining to the cardholder's name, card type, the card number, the card expiry date, and the security code on the back of the card (if any) to make a payment to Get Your Ticket. The user shall be responsible for the correctness of the information provided and shall not be indemnified if the information is wrongly entered, whether intentional or unintentional.
                        </Card.Text>
                        <Card.Text>
                            The user must ensure the correctness of all details of the booking before finally booking their tickets as Get Your Ticket will accept no responsibility and will not issue a refund for wrong bookings that are the fault of the user. If the user experiences problems with the booking process, they are to call the helpline number of Get Your Ticket specified on the booking page. The Portal shall not cancel any bookings once the transaction is completed.
                        </Card.Text>
                        <Card.Text>
                            Once the booking has been processed, the user will receive a confirmation email and mobile number to their email address or mobile number with all the relevant details of their booking. Get Your Ticket is not responsible and will not issue a refund to the user for selecting the wrong tickets or if the user does not meet the minimum age requirements for that particular event. The online booking is non-transferable and cannot be further sold.
                        </Card.Text>
                        <Card.Text>
                            To collect the tickets, the user must present the credit/debit card that was used to book the tickets in that particular event. The user has to carry the printout of the confirmation email. The user may procure the ticket from the automatic ticket collection points or they can present the printout to the Get Your Ticket representative at the ticket counter of the concerned venue. The user shall also carry proof of age for events certified ‘A’.
                        </Card.Text>
                        <Card.Text>
                            Unless specified otherwise, the user is subscribed to Get Your Ticket partner promotions related to communication through SMS & email.
                        </Card.Text>
                        <Card.Text>
                            <strong>Outside Food is not allowed.</strong>
                        </Card.Text>
                    </Card.Body>

                    <Card.Body>
                        <Card.Title>Cancellation of Tickets</Card.Title>
                        <Card.Text>
                            The booking shall be deemed to be canceled in the following circumstances:
                        </Card.Text>
                        <ul>
                            <li>
                                If, in the opinion of a representative of Get Your Ticket, the user is in breach of these Online Booking Terms or is under the influence of drugs or alcohol, or that it is necessary for the safety, comfort, or security of other customers or for the protection of property, the representative reserves the right to refuse entry or request the customer to leave the venue and may if necessary physically remove the customer from the venue or physically restrain the customer.
                            </li>
                            <li>
                                Get Your Ticket is required to abide by and enforce the age restrictions as specified by the law for the time being in force. In the event that an authorized Get Your Ticket representative is of the opinion that the user does not meet the minimum age requirement and the user cannot provide photographic proof that they are of the required age, Get Your Ticket will not permit entry to that performance or event.
                            </li>
                            <li>
                                Users can contact Get Your Ticket customer care for authentication to get their profiles unlocked.
                            </li>
                            <li>No cancellation will be allowed.</li>
                            <li>No refund will be given for booking done through or amount paid by M-coupon/Gift card/Star Pass/Voucher/Promo. Also, ticket cancellation cannot be applied/clubbed on a booking done through or an offer given by us or facilitated for a business partner.</li>
                            <li>No partial cancellation is allowed. The patron will have to cancel the complete transaction.</li>
                            <li>Convenience fee and taxes applicable thereon will not be refunded in case of cancellation.</li>
                            <li>This is an offer/facility given by the company, which can be withdrawn anytime without giving prior intimation to the participant.</li>
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}

export default RefundPolicy
