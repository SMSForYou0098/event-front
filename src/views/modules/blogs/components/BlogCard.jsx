import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const toSlug = (text) =>
  text?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const BlogCard = ({ post }) => {
  const navigate = useNavigate();


  const handleClick = () => {
    const slug = toSlug(post?.title);
  navigate(`/blogs/${slug}/${post?.id}`);
  };

  return (
    <Card className="h-100 border-0 shadow-sm overflow-hidden hover-shadow transition-all">
      {/* Thumbnail */}
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <Card.Img
          variant="top"
          src={post?.thumbnail}
          className="h-100 w-100 object-cover transition-all hover-scale"
          alt={post?.title}
        />
        <div className="position-absolute bottom-0 start-0 p-3">
          <div className="d-flex flex-wrap gap-1">
            {post?.categories?.map((cat) => (
              <span
                key={cat?.id}
                className="badge bg-white text-dark opacity-90 fw-normal"
              >
                {cat?.title}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <Card.Body style={{padding:"1rem",height:'auto'}} className="">
        <Card.Title className="fs-5 fw-bold mb-2">{post?.title}</Card.Title>
        <div className="d-flex flex-column text-muted small gap-1">
          <div className="d-flex align-items-center">
            <Calendar size={14} className="me-2" />
            <span>
              {new Date(post?.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>

            <div className="d-flex align-items-center">
              <User size={14} className="me-2" />
              <span>{post?.user_data?.name || post?.user_name}</span>
            </div>

        </div>
      </Card.Body>

      {/* Footer */}
      <Card.Footer className="bg-white border-0 pt-0 pb-4 px-4">
        <Button
          variant="outline-primary"
          size="sm"
          className="rounded-pill px-3"
          onClick={handleClick}
        >
          Read More <ArrowRight size={16} className="ms-1" />
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default BlogCard;
