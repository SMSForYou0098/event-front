// components/RelatedPosts.js
import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import BlogCard from './BlogCard';
import RelatedPostsSkeleton from './skeletons/RelatedPostsSkeleton';
import BlogListSkeleton from './skeletons/BlogListSkeleton';

const RelatedPosts = ({ posts = [], loading }) => {
  if (loading) return <BlogListSkeleton />;

  return (
    <div className="mt-5">
      <h4 className="mb-4">Related Posts</h4>

      {posts.length === 0 ? (
        <Alert variant="info">No related posts found.</Alert>
      ) : (
        <Row className="g-4">
          {posts.map((post) => (
            <Col key={post.id} xs={12} md={6} lg={4}>
              <BlogCard post={post} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default RelatedPosts;
