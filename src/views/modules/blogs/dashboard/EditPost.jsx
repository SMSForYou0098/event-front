import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMyContext } from '../../../../Context/MyContextProvider';
import BlogPostEditor from '../components/BlogPost';
import { Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BlogPostEditorSkeleton } from '../components/skeletons/BlogPostEditorSkeleton';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authToken, api } = useMyContext();
const [meta, setMeta] = useState({
  metaTitle: '',
  canonicalUrl: '',
  metaDescription: '',
  metaKeywords: '',
  metaRobots: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: null,
  categories: [],
  tags: [],
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [postData, setPostData] = useState(null);

  const getData = async () => {
    setLoading(true);
    try {
      // const response = await axios.get(`${api}blog/${id}/[9]`, {
      //   headers: { Authorization: `Bearer ${authToken}` },
      // });
      const response = await axios.get(`${api}blog-show/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data?.status && response.data.data) {
        setPostData(response.data.data);
        const metaPayload = {
        metaTitle: response.data.data.meta_title || '',
        canonicalUrl: response.data.data.canonical_url || '',
        metaDescription: response.data.data.meta_description || '',
        metaKeywords: response.data.data.meta_keyword || '',
        metaRobots: response.data.data.meta_robots || '',
        ogTitle: response.data.data.og_title || '',
        ogDescription: response.data.data.og_description || '',
        ogImage: response.data.data.og_image || null,
        categories: response.data.categories || [],
        tags: response.data.data.tags || [],
      };

      setMeta(metaPayload);
      } else {
        setError('Invalid response format.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch blog post.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async ({ title, content, thumbnail,status }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('status', status);

  // Create a copy of meta to safely modify before appending
  const normalizedMeta = { ...meta };

  // ✅ Ensure categories only contain IDs
  if (Array.isArray(normalizedMeta.categories)) {
    normalizedMeta.categories = normalizedMeta.categories.map((cat) =>
      typeof cat === 'object' && cat.id ? cat.id : cat
    );
  }

  Object.entries(normalizedMeta).forEach(([key, value]) => {
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value)); // array → string
      } else if (key === 'ogImage' && typeof value === 'object') {
        formData.append(key, value); // File or Blob
      } else {
        formData.append(key, value); // Primitive
      }
    }
  });

  if (thumbnail) {
    formData.append('thumbnail', thumbnail);
  }

  try {
    const response = await axios.post(`${api}blog-update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success(response.data.message || 'Blog updated successfully');
    navigate('/blogs/dashboard');
  } catch (error) {
    console.error('❌ Error updating blog post:', error);
    toast.error(error.response?.data?.message || 'Failed to update post');
  }
};


  useEffect(() => {
    getData();
  }, []);

  if (loading) return <div className="text-center my-4"><BlogPostEditorSkeleton /></div>;
  if (error) return <Alert variant="danger" className="text-center">{error}</Alert>;
  return (
    <div>
      <BlogPostEditor
        initialTitle={postData?.title}
        initialStatus={postData?.status}
        initialContent={postData?.content}
        initialFeaturedImage={postData?.thumbnail}
        isEditing={true}
        onSave={handleSave}
        onCancel={() => navigate('/blogs/dashboard')}
        metaFields={meta}
        setMetaFields={setMeta}
      />
    </div>
  );
};

export default EditPost;
