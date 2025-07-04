import React from 'react';
import { Container, Row, Col, Accordion, ListGroup } from 'react-bootstrap';

export default function TermsAndConditions() {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="mb-4">Terms and Conditions</h1>
          <p>
            By accessing and using this website, the user accepts and agrees to be bound by these Terms and Conditions. Users should check for current Terms and Conditions as these can be updated and changed from time to time. For avoidance of any doubt, these Terms and Conditions shall be applicable to all activities and services provided by Get Your Ticket Trust.
          </p>

          <Accordion className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Definitions</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>Get Your Ticket Trust:</strong> Refers to the entity responsible for providing educational and charitable services and activities.</ListGroup.Item>
                  <ListGroup.Item><strong>User:</strong> The person accessing the website, app, or platform and/or availing of our products and/or services.</ListGroup.Item>
                  <ListGroup.Item><strong>Customer:</strong> Includes all the patrons of Get Your Ticket Trust and also includes the user defined above.</ListGroup.Item>
                  <ListGroup.Item><strong>Website:</strong> Refers to <a target='__blank' href="https://getyourticket.in">sevaktrust.org</a> and any other web address deemed fit by Get Your Ticket Trust.</ListGroup.Item>
                  <ListGroup.Item><strong>Platform:</strong> Refers to Get Your Ticket Trust's website, mobile application, and/or any other digital means made available by the Trust from time to time.</ListGroup.Item>
                  <ListGroup.Item><strong>Data:</strong> Refers to personal information, including sensitive personal information and special category personal data (as defined under Data Protection Laws) about the user, which we collect, receive, or otherwise process in connection with the user's use of our website/app/platform and/or otherwise provided by the user in accordance with our Privacy Policy.</ListGroup.Item>
                  <ListGroup.Item><strong>Cookies:</strong> Small files placed on the user's device by our website/app or the platform when the user visits or uses certain features. A cookie generally allows a website or mobile application to remember the user's actions or preferences for a certain period.</ListGroup.Item>
                  <ListGroup.Item><strong>Data Protection Laws:</strong> Any applicable law for the time being in force relating to the processing of data.</ListGroup.Item>
                  <ListGroup.Item><strong>Partners:</strong> Select third parties with whom we have contracts for improving our products and/or services from time to time.</ListGroup.Item>
                  <ListGroup.Item><strong>Service Providers:</strong> Entities that provide services to Get Your Ticket Trust and to whom we may disclose the user's data for a specific purpose pursuant to a written contract.</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Purchasing Services Online</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Users aged 3 years and above may require separate registration for certain services. Specific services might have different age requirements.</ListGroup.Item>
                  <ListGroup.Item>Items like laptops, cameras, knives, lighters, matchboxes, cigarettes, firearms, and all types of inflammable objects are strictly prohibited in certain areas.</ListGroup.Item>
                  <ListGroup.Item>Users must abide by the policies laid down by the management of Get Your Ticket Trust.</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>Booking of Services</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>The user must provide Get Your Ticket Trust with the correct information for registration and payment purposes. The user is responsible for the accuracy of the information provided.</ListGroup.Item>
                  <ListGroup.Item>The user must ensure the correctness of all details before finalizing the booking, as Get Your Ticket Trust will not issue a refund for wrong bookings caused by the user's error.</ListGroup.Item>
                  <ListGroup.Item>Once the booking has been processed, the user will receive a confirmation email with all relevant details.</ListGroup.Item>
                  <ListGroup.Item>To avail of the services, the user must present the relevant confirmation email and any required identification documents.</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Data/Information Protection and Privacy Policy</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>We care about data privacy and security. Please review our Privacy Policy. By using the website/app/platform, you agree to be bound by our Privacy Policy and the product/service-specific terms and conditions, which are incorporated into these Terms and Conditions.</ListGroup.Item>
                  <ListGroup.Item>If you access the website/app/platform from outside India, you are transferring your data to India and expressly consent to have your data transferred to and processed in India.</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Cancellation of Services</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Bookings are valid only for the specified date and time. If not used on the specified date, the booking will become valueless and non-refundable.</ListGroup.Item>
                  <ListGroup.Item>Users in breach of these Terms or under the influence of drugs or alcohol may be refused entry or asked to leave.</ListGroup.Item>
                  <ListGroup.Item>Age restrictions must be adhered to, and proof of age may be required.</ListGroup.Item>
                  <ListGroup.Item>The user has the option to cancel services booked online under specific terms. Cancellations are not allowed once the service has been availed.</ListGroup.Item>
                  <ListGroup.Item>Users can contact customer care for assistance with cancellations. Unlocking of profiles may take up to 7 business days.</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>Terms of Cancellation</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Transactions can be canceled only after 10 minutes of booking.</ListGroup.Item>
                  <ListGroup.Item>No cancellation will be allowed within 20 minutes of the service start time.</ListGroup.Item>
                  <ListGroup.Item>Refunds will be processed as per the specified timelines and percentages.</ListGroup.Item>
                  <ListGroup.Item>No partial cancellations are allowed. The entire transaction must be canceled.</ListGroup.Item>
                  <ListGroup.Item>The convenience fee and applicable taxes will not be refunded in case of cancellation.</ListGroup.Item>
                  <ListGroup.Item>The refund will be processed within a minimum of 7 working days.</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>General Conditions</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>Get Your Ticket Trust will strive to ensure that the service times are accurate but reserves the right to change or cancel services due to unforeseen circumstances. In such cases, the user may be entitled to a refund of the service fee only.</ListGroup.Item>
                  <ListGroup.Item>Users must provide relevant proof of entitlement when availing of age-restricted services.</ListGroup.Item>
                  <ListGroup.Item>The Trust reserves the right to modify, add, alter, revise, withdraw, or carry out any necessary changes to these terms and conditions and/or the cancellation feature (either wholly or in part).</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>Warranties and Indemnification</Accordion.Header>
              <Accordion.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>The user represents that they are of sufficient legal age to use this service and possess the legal right to create binding obligations.</ListGroup.Item>
                  <ListGroup.Item>The user is financially responsible for all uses of this service by them and those using their login information.</ListGroup.Item>
                  <ListGroup.Item>The user warrants that all information supplied by them is true and accurate.</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>Changes to the Terms and Conditions</Accordion.Header>
              <Accordion.Body>
                <p>
                  We may change these terms and conditions from time to time. If we make any changes, we will update the "Last Updated" date above. The user's continued use of our website/app/platform after such changes have been published will constitute acceptance of the revised terms and conditions. We will notify the user and seek additional consent before using the user's personal data for a new purpose that is inconsistent with the original purpose for which it was collected.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <h2 className="mb-3">Contact Information</h2>
          <p>
            For any questions or concerns regarding these Terms and Conditions, please contact us at:
          </p>
          <p>
            <strong>Get Your Ticket Trust</strong><br />
            Email: <a href="mailto:contact@getyourticket.in">contact@getyourticket.in</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
}