import React, { useState } from 'react';
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import BlogPostEditor from '../components/BlogPost';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NewPost = () => {
  // Example onSave handler
  const {api,authToken} = useMyContext();
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
  const navigate = useNavigate();
  const handleSave = async ({ title, content, thumbnail,status }) => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('status', status);
    // Normalize meta before appending
    const normalizedMeta = { ...meta };
    // ✅ Ensure categories contains only IDs
    if (Array.isArray(normalizedMeta.categories)) {
      normalizedMeta.categories = normalizedMeta.categories.map(cat =>
        typeof cat === 'object' && cat.id ? cat.id : cat
      );
    }

    // ✅ Append meta fields to formData
    Object.entries(normalizedMeta).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value)); // Store arrays as JSON
        } else if (key === 'ogImage' && typeof value === 'object') {
          formData.append(key, value); // File or Blob
        } else {
          formData.append(key, value); // String, number, etc.
        }
      }
    });

    // ✅ Append thumbnail if available
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    const response = await axios.post(`${api}blog-store`, formData, {
      headers: {
        Authorization: 'Bearer ' + authToken,
        'Content-Type': 'multipart/form-data',
      },
    });

    // ✅ Success feedback
    toast.success(response.data?.message || 'Blog saved successfully!');
    navigate(-1)
    // navigate('/blogs/dashboard'); // Or redirect if needed
  } catch (error) {
    console.error('❌ Error saving blog post:', error);
    toast.error(error.response?.data?.message || 'Failed to save blog post');
  }
};




  return (
    <div>
      <BlogPostEditor
        initialTitle=""
        initialContent=""
        initialThumbnail={null}
        isEditing={false}
        onSave={handleSave}
        onCancel={() => { /* handle cancel if needed */ }}
        metaFields={meta}
        setMetaFields={setMeta}
      />
    </div>
  );
};

export default NewPost;