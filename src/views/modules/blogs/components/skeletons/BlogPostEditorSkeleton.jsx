const { Placeholder, Card, Col, Form, Container, Row } = require("react-bootstrap");

export const BlogPostEditorSkeleton = () => {
  return (
    <Container className="blog-post-editor mt-4">
      <Card>
        <Card.Body>
          <Row>
            {/* Left Column */}
            <Col md={4}>
              <Placeholder as={Form.Label} animation="wave">
                <Placeholder xs={6} />
              </Placeholder>
              <Placeholder className="w-100 mb-3" style={{ height: "38px" }} />

              <Placeholder as={Form.Label} animation="wave">
                <Placeholder xs={8} />
              </Placeholder>
              <Placeholder className="w-100 mb-3" style={{ height: "38px" }} />

              {/* Image Preview Skeleton */}
              <Card className="mb-3">
                <Placeholder
                  as={Card.Img}
                  animation="wave"
                  style={{ height: "150px", backgroundColor: "#e0e0e0" }}
                />
                <Card.Body className="text-center">
                  <Placeholder.Button variant="danger" xs={6} />
                </Card.Body>
              </Card>

              {/* Meta Fields Skeleton */}
              <h5 className="text-primary">
                <Placeholder xs={4} animation="wave" />
              </h5>
              {[1, 2, 3].map((_, i) => (
                <Placeholder className="w-100 mb-2" style={{ height: "38px" }} key={i} />
              ))}
            </Col>

            {/* Right Column */}
            <Col md={8}>
              <Placeholder as={Form.Label} animation="wave">
                <Placeholder xs={3} />
              </Placeholder>
              <Placeholder className="w-100" style={{ height: "60vh" }} />
            </Col>
          </Row>

          {/* Footer Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <Placeholder.Button variant="danger" xs={2} />
            <Placeholder.Button variant="success" xs={2} />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};