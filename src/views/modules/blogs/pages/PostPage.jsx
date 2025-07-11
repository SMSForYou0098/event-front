import React, { useEffect, useState } from 'react';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostById from '../components/PostById';
import { Container, Alert } from 'react-bootstrap';
import RelatedPosts from '../components/RelatedPosts';
import CommentsSection from '../components/comments/CommentSection';

const PostPage = () => {
  const { authToken, api } = useMyContext();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      const response = await axios.get(`${api}blog-comment-show/${id}`, { headers });
      
      if (response.data?.status) {
        // Transform the flat comments array into a nested structure
        const commentsData = response.data.data || [];
        const commentsWithReplies = transformComments(commentsData);
        setComments(commentsWithReplies);
      } else {
        setComments([]);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    }
  };

  // Helper function to transform flat comments into nested replies structure
  const transformComments = (commentsData) => {
    const commentMap = {};
    const rootComments = [];

    // First pass: create a map of all comments
    commentsData.forEach(comment => {
      commentMap[comment.id] = {
        ...comment,
        replies: []
      };
    });

    // Second pass: build the hierarchy
    commentsData.forEach(comment => {
      if (comment.replier_id) {
        const parent = commentMap[comment.replier_id];
        if (parent) {
          parent.replies.push(commentMap[comment.id]);
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  const getData = async () => {
    setLoading(true);
    setError('');
    const headers = { Authorization: `Bearer ${authToken}` };

    try {
      // Fetch post and related blogs in parallel
      const [postRes, relatedRes] = await Promise.all([
        axios.get(`${api}blog-show/${id}`, { headers }),
        axios.get(`${api}related-blogs/${id}`, { headers }),
      ]);

      if (postRes.data?.status && postRes.data.data) {
        setPost(postRes.data.data);
        setCategories(postRes.data.categories || []);
        setRelatedPosts(relatedRes.data?.data || []);
      } else {
        throw new Error(postRes.data?.message || 'Invalid post data format.');
      }

      // Fetch comments separately
      await fetchComments();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch post.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      getData();
    }
  }, [id]);


  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div style={{ padding: '4rem' }}>
      <PostById post={post} categories={categories} loading={loading} />
      <CommentsSection 
        comments={comments} 
        id={id} 
        refreshComments={fetchComments}
        loading={loading}
      />
      <RelatedPosts posts={relatedPosts} loading={loading} />
    </div>
  );
};

export default PostPage;