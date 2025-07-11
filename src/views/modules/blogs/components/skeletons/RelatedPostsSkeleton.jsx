// components/skeletons/RelatedPostsSkeleton.js
import React from 'react';
import { Row, Col, Card, Placeholder } from 'react-bootstrap';

const RelatedPostsSkeleton = () => {
  return (
    <div className="mt-5">
      <h4 className="mb-4">Related Posts</h4>
      <Row className="g-4">
        {[...Array(3)].map((_, idx) => (
          <Col key={idx} xs={12} md={6} lg={4}>
            <Card className="shadow-sm border-0">
              <Placeholder as='div' animation="wave" bg="light" style={{ height: '200px' }} />
              <Card.Body>
                <Placeholder as='div' animation="wave" bg="dark" className="w-75" />
                <Placeholder as='div' animation="wave" bg="dark" className="w-50 mt-2" />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RelatedPostsSkeleton;