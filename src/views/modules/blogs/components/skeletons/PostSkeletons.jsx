import React from 'react';
import { Container, Row, Col, Card, Placeholder } from 'react-bootstrap';

const PostSkeleton = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="border-0 shadow-sm">
            <div style={{ height: '300px', background: '#e9ecef' }}></div>
            <Card.Body className="p-4">
              <Placeholder as="h1" animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
              <div className="d-flex gap-2 mb-3">
                <Placeholder.Button variant="secondary" xs={2} />
                <Placeholder.Button variant="secondary" xs={2} />
              </div>
              <Placeholder as="div" animation="glow">
                <Placeholder xs={3} /> <Placeholder xs={2} />
              </Placeholder>
              <Placeholder as="p" animation="glow" className="mt-4">
                <Placeholder xs={12} /> <Placeholder xs={10} /> <Placeholder xs={11} />
                <Placeholder xs={9} /> <Placeholder xs={8} /> <Placeholder xs={12} />
              </Placeholder>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PostSkeleton;
