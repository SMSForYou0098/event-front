import React, { useState } from 'react';
import { Button, Badge, Card, Container, Row, Col, Image } from 'react-bootstrap';
import CommentModal from './CommentModal';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import CommentsSectionSkeleton from '../skeletons/CommentsSectionSkeleton';
import { ChevronDown, ChevronUp, Reply, Trash2 } from 'lucide-react';

const MAX_COMMENT_DEPTH = 1; // Prevent replying to replies
const MAX_COMMENTS_LIMIT = 100; // Maximum comments allowed

const CommentsSection = ({ comments = [], id, refreshComments, loading }) => {
  const [showModal, setShowModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const { api, authToken, UserData } = useMyContext();

  const handleOpenComment = () => {
    if (comments.length >= MAX_COMMENTS_LIMIT) {
      Swal.fire('Limit Reached', `Maximum of ${MAX_COMMENTS_LIMIT} comments allowed.`, 'info');
      return;
    }
    setReplyTo(null);
    setShowModal(true);
  };

  const handleReply = (commentId, depth) => {
    if (depth >= MAX_COMMENT_DEPTH) {
      Swal.fire('Cannot Reply', 'You cannot reply to a reply.', 'info');
      return;
    }
    if (comments.length >= MAX_COMMENTS_LIMIT) {
      Swal.fire('Limit Reached', `Maximum of ${MAX_COMMENTS_LIMIT} comments allowed.`, 'info');
      return;
    }
    setReplyTo(commentId);
    setShowModal(true);
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleDelete = async (commentId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This comment will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${api}blog-comment-destroy/${commentId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        Swal.fire('Deleted!', 'The comment has been deleted.', 'success');
        refreshComments();
      } catch (error) {
        console.error('Delete failed:', error);
        Swal.fire('Error', 'Failed to delete the comment.', 'error');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[parts.length - 1][0]}` 
      : `${name[0]}`;
  };

  const renderComment = (comment, depth = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const marginLeft = depth * 20;
    const showReplies = expandedReplies[comment.id];
    const userPhoto = comment?.user_data?.photo;
    const userName = comment?.user_data?.name || 'Anonymous';

    return (
      <div key={comment.id} style={{ marginLeft: `${marginLeft}px` }} className="mb-3">
        <Card className="border-0 shadow-sm rounded-3">
      <Card.Body>
        <div className="d-flex gap-3">
          <div className="flex-shrink-0">

              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                style={{ width: 50, height: 50, fontWeight: '600', fontSize: '1.2rem' }}
              >
                {getInitials(userName)}
              </div>
            
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="fs-5 fw-bold mb-1 text-primary">
                  {userName}
                </Card.Title>
                <Card.Text className="mb-2 fs-6 text-secondary">
                  {comment?.comment}
                </Card.Text>
              </div>
              <Badge bg="light" text="dark" className="ms-2 fs-7">
                {new Date(comment?.created_at).toLocaleString()}
              </Badge>
            </div>

            <div className="d-flex gap-2 flex-wrap mt-2">
              {depth < MAX_COMMENT_DEPTH && (
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleReply(comment.id, depth)}
                  disabled={depth >= MAX_COMMENT_DEPTH}
                  className="d-flex align-items-center gap-1"
                >
                  <Reply size={16} /> Reply
                </Button>
              )}

              {comment?.user_id === UserData?.id && (
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDelete(comment.id)}
                  className="d-flex align-items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </Button>
              )}

              {hasReplies && (
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() => toggleReplies(comment.id)}
                  className="d-flex align-items-center gap-1"
                >
                  {showReplies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {showReplies ? 'Hide Replies' : `View Replies (${comment.replies.length})`}
                </Button>
              )}
            </div>

            {hasReplies && showReplies && (
              <div className="mt-3 ps-3 border-start border-2 border-primary">
                {comment.replies.map((reply) => renderComment(reply, depth + 1))}
              </div>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
      </div>
    );
  };

  if (loading) {
    return <CommentsSectionSkeleton />;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Comments ({comments.length})</h4>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleOpenComment}
              disabled={comments.length >= MAX_COMMENTS_LIMIT}
            >
              Add Comment
            </Button>
          </div>
          
          {comments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No comments yet. Be the first to comment!</p>
              <Button variant="outline-primary" onClick={handleOpenComment}>
                Add Comment
              </Button>
            </div>
          ) : (
            <div className="comment-tree">
              {comments.map((comment) => renderComment(comment))}
            </div>
          )}

          {comments.length >= MAX_COMMENTS_LIMIT && (
            <div className="alert alert-info mt-3">
              This post has reached the maximum comment limit ({MAX_COMMENTS_LIMIT}).
            </div>
          )}

          <CommentModal
            show={showModal}
            onHide={() => setShowModal(false)}
            id={id}
            parentId={replyTo}
            onCommentAdded={refreshComments}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CommentsSection;