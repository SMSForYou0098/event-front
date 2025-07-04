import React from 'react';
import { Container, Row, Col, Accordion, ListGroup } from 'react-bootstrap';

export default function PrivacyPolicy() {
  return (
    <Container>
      <Row>
        <Col>
          <h2 className="my-5">
            Privacy{" "}
            <span className="text-primary">
              Policy
            </span>
          </h2>
          <p>
            Get Your Ticket from https://getyourticket.in/ one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Get Your Ticket and how we use it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>
          <p>
            This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in Taste of Vadodara. This policy is not applicable to any information collected offline or via channels other than this website.
          </p>

          <Accordion className="mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Consent</Accordion.Header>
              <Accordion.Body>
                <p>
                  By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>Information we collect</Accordion.Header>
              <Accordion.Body>
                <p>
                  The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                </p>
                <p>
                  If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                </p>
                <p>
                  When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>How we use your information</Accordion.Header>
              <Accordion.Body>
                <p>We use the information we collect in various ways, including to:</p>
                <ListGroup variant="flush">
                  <ListGroup.Item>Provide, operate, and maintain our website</ListGroup.Item>
                  <ListGroup.Item>Improve, personalize, and expand our website</ListGroup.Item>
                  <ListGroup.Item>Understand and analyse how you use our website</ListGroup.Item>
                  <ListGroup.Item>Develop new products, services, features, and functionality</ListGroup.Item>
                  <ListGroup.Item>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</ListGroup.Item>
                  <ListGroup.Item>Send you emails</ListGroup.Item>
                  <ListGroup.Item>Find and prevent fraud</ListGroup.Item>
                </ListGroup>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>Log Files</Accordion.Header>
              <Accordion.Body>
                <p>
                  Get Your Ticket follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analysing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>Cookies and Web Beacons</Accordion.Header>
              <Accordion.Body>
                <p>
                  Like any other website, Get Your Ticket uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>Advertising Partners Privacy Policies</Accordion.Header>
              <Accordion.Body>
                <p>
                  You may consult this list to find the Privacy Policy for each of the advertising partners of Get Your Ticket.
                </p>
                <p>
                  Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Taste of Vadodara, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                </p>
                <p>
                  Note that Get Your Ticket has no access to or control over these cookies that are used by third-party advertisers.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>Third Party Privacy Policies</Accordion.Header>
              <Accordion.Body>
                <p>
                  Get Your Ticket, Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                </p>
                <p>
                  You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>CCPA Privacy Rights (Do Not Sell My Personal Information)</Accordion.Header>
              <Accordion.Body>
                <p>Under the CCPA, among other rights, California consumers have the right to:</p>
                <ListGroup variant="flush">
                  <ListGroup.Item>Request that a business that collects a consumer's personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</ListGroup.Item>
                  <ListGroup.Item>Request that a business delete any personal data about the consumer that a business has collected.</ListGroup.Item>
                  <ListGroup.Item>Request that a business that sells a consumer's personal data, not sell the consumer's personal data.</ListGroup.Item>
                </ListGroup>
                <p className="mt-3">
                  If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="8">
              <Accordion.Header>GDPR Data Protection Rights</Accordion.Header>
              <Accordion.Body>
                <p>We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
                <ListGroup variant="flush">
                  <ListGroup.Item>The right to access – You have the right to request copies of your personal data. We may charge you a small fee for this service.</ListGroup.Item>
                  <ListGroup.Item>The right to rectification – You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</ListGroup.Item>
                  <ListGroup.Item>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</ListGroup.Item>
                  <ListGroup.Item>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</ListGroup.Item>
                  <ListGroup.Item>The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions.</ListGroup.Item>
                  <ListGroup.Item>The right to data portability – You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</ListGroup.Item>
                </ListGroup>
                <p className="mt-3">
                  If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
                </p>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="9">
              <Accordion.Header>Children's Information</Accordion.Header>
              <Accordion.Body>
                <p>
                  Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                </p>
                <p>
                  Get Your Ticket does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <h2 className="mb-3">Event Venue</h2>
          <p>
            <strong>Address:</strong> Get Your Ticket Trust Plot No. 131, First & Second Floor, Gayatri Nagar Society, Opp. Gayatri Mandir, Dabholi Char Rasta, Katargam, Surat. - 395 004
          </p>
          <p>
            <strong>For Ticket Booking:</strong>
          </p>
          <p>
            Call: 80004-08888
          </p>
        </Col>
      </Row>
    </Container>
  );
}