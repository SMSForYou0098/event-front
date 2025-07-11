import React from 'react';
import { Card, Container, Row, Col, Placeholder } from 'react-bootstrap';

const CommentsSectionSkeleton = () => {
  const renderPlaceholderComment = (_, index) => (
    <Card className="border-0 shadow-sm mb-3" key={index}>
      <Card.Body>
        <Placeholder as={Card.Title} animation="wave">
          <Placeholder xs={4} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="wave">
          <Placeholder xs={10} /> <Placeholder xs={8} /> <Placeholder xs={6} />
        </Placeholder>
        <div className="d-flex gap-2 mt-2">
          <Placeholder.Button variant="secondary" xs={2} />
          <Placeholder.Button variant="danger" xs={2} />
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Placeholder as="h4" animation="wave">
            <Placeholder xs={3} />
          </Placeholder>

          <div className="mb-3">
            <Placeholder.Button variant="primary" xs={2} />
          </div>

          {/* Simulate 3 skeleton comments */}
          {[...Array(3)].map(renderPlaceholderComment)}
        </Col>
      </Row>
    </Container>
  );
};

export default CommentsSectionSkeleton;
