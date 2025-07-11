import React from 'react';
import { Container, Row, Col, Badge, Card } from 'react-bootstrap';
import parse from 'html-react-parser';
import MetaTags from './MetaTags';
import PostSkeleton from './skeletons/PostSkeletons';

const PostById = ({ post, categories,loading }) => {
    if (loading) return <PostSkeleton />;
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="border-0 shadow-sm">
            {post?.thumbnail && (
              <Card.Img
                variant="top"
                src={post?.thumbnail}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  backgroundColor: '#f8f9fa',
                }}
              />
            )}
            <Card.Body className="p-4">
              <h1 className="mb-3 fw-bold">{post?.title}</h1>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {categories.map((cat) => (
                  <Badge key={cat?.id} bg="secondary">
                    {cat?.title}
                  </Badge>
                ))}
              </div>
              <div className="text-muted mb-4 d-flex align-items-center gap-3 flex-wrap">
                <div>
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(post?.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                {post?.user_data?.name && (
                  <div>
                    <i className="bi bi-person-circle me-1"></i>
                    {post.user_data.name}
                  </div>
                )}
              </div>
              <div className="post-content">
                {post?.content ? parse(post?.content) : <p>No content available.</p>}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <MetaTags
          title={post?.meta_title || post?.title}
          description={
            post?.meta_description ||
            post?.content?.replace(/<[^>]+>/g, '').slice(0, 160)
          }
          image={post?.thumbnail}
          keywords={[
            ...(post?.meta_keyword ? post.meta_keyword.split(',') : []),
            ...(post?.tags || []),
          ]}
        />
      </Row>
    </Container>
  );
};

export default PostById;
