import React from 'react';
import { Row, Col, Card, Placeholder } from 'react-bootstrap';

const BlogListSkeleton = ({ count = 6 }) => {
  const skeletonCards = Array.from({ length: count });

  return (
    <Row>
      {skeletonCards.map((_, index) => (
        <Col key={index} md={4} className="mb-4">
          <Card>
            <div style={{ height: '200px', backgroundColor: '#e0e0e0' }} />
            <Card.Body>
              <Placeholder as={Card.Title} animation="glow">
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={4} />{' '}
                <Placeholder xs={6} />
              </Placeholder>
              <div className="d-flex flex-wrap gap-2">
                <Placeholder.Button xs={3} variant="secondary" />
                <Placeholder.Button xs={4} variant="secondary" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default BlogListSkeleton;
