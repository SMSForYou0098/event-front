import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';

const CommentModal = ({ show, onHide, id, parentId = null, onCommentAdded }) => {
  const [formData, setFormData] = useState({ text: '' });
  const [error, setError] = useState(null);
  const { api, authToken } = useMyContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    if (!formData.text.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    try {
      await axios.post(
        `${api}blog-comment-store/${id}`,
        {
          comment: formData.text,
          id: parentId, // reply ID or null
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      onCommentAdded?.(); // refresh parent
      setFormData({ text: '' });
      onHide();
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError(
        `${err.response?.data?.message} Login To comment` ||
          'An unexpected error occurred. Please try again later.'
      );
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{parentId ? 'Reply to Comment' : 'Write a Comment'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>{parentId ? 'Reply' : 'Comment'}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={formData.text}
              onChange={(e) => setFormData({ text: e.target.value })}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CommentModal;
