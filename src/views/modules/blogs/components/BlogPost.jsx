import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { 
  Button, 
  Modal, 
  Form, 
  Card, 
  Row, 
  Col, 
  Container,
  Alert,
  Spinner
} from 'react-bootstrap';
import MetaFields from './MetaFields';

const BlogPostEditor = ({ 
  initialContent = '', 
  initialTitle = '', 
  initialFeaturedImage = null,
  initialStatus = '',
  onSave, 
  onCancel,
  isEditing = false,
  metaFields,
  setMetaFields,
}) => {
  const [content, setContent] = useState(initialContent);
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editor = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setContent(initialContent);
    }
  }, [initialContent, initialTitle, initialFeaturedImage, isEditing]);

const [formData, setFormData] = useState({
    title: initialTitle,
    featuredImageFile: initialFeaturedImage,
    previewFeaturedImage: initialFeaturedImage,
    status: initialStatus, // false = draft, true = published
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        featuredImageFile: file,
        previewFeaturedImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImageFile: null,
      previewFeaturedImage: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: !prev.status,
    }));
  };

  const handleSave = async () => {
  setIsSubmitting(true);
  setError(null);
  
  try {
    // Get the latest content directly from the editor instance
    const latestContent = editor.current?.value || content;
    
    // Prepare all images to be uploaded with the post
   

    await onSave({
      title:formData?.title,
      content: latestContent,
      thumbnail:formData?.featuredImageFile,
      status:formData?.status
      // contentImages,
      // metaFields,
    });
  } catch (err) {
    console.error('Error saving post:', err);
    setError('Failed to save post. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const config = {
    readonly: false,
    autofocus: false,
    uploader: {
      insertImageAsBase64URI: true, // Store images as base64 for preview
      url: '', // We'll handle uploads on save
    },
    image: {
      edit: true,
      resize: true,
      width: '100%',
      height: 'auto'
    },
    buttons: [
      'source', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize', 'preview'
    ],
    height: 500,
    events: {
      afterInit: (editor) => {
        editor.events.on('preview', () => {
          setPreviewMode(true);
        });
      }
    }
  };

  return (
    <Container className="blog-post-editor mt-4">
      <Card>
        <Card.Body>
          <Row>
            {/* Left Column */}
            <Col md={4}>
              {/* Featured Image Upload */}
              {/* Post Title */}
              <Form.Group className="mb-3">
        <Form.Label>Post Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          placeholder="Enter post title"
          value={formData.title}
          onChange={handleChange}
          size="lg"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Featured Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFeaturedImageChange}
          ref={fileInputRef}
        />
      </Form.Group>

      {formData.previewFeaturedImage && (
        <div className="mb-3">
          <Card>
            <Card.Img
              variant="top"
              src={formData.previewFeaturedImage}
              style={{
                height: '150px',
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() =>{  setImagePreview(true)}}
              // onClick={() => setFormData((prev) => ({
              //   ...prev,
              //   imagePreview: prev.previewFeaturedImage
              // }))}
            />
            <Card.Body className="text-center">
              <Button variant="danger" size="sm" onClick={handleRemoveImage}>
                Remove Featured Image
              </Button>
            </Card.Body>
          </Card>
        </div>
      )}

      <Form.Group className="mb-3 d-flex align-items-center">
        <Form.Label className="me-3 mb-0">Status:</Form.Label>
        <Form.Check
          type="switch"
          id="status-switch"
          // label={formData.status ? 'Published' : 'Draft'}
          checked={formData.status}
          onChange={toggleStatus}
        />
      </Form.Group>

              {/* SEO Meta Fields */}
              <MetaFields
                meta={metaFields}
                onChange={(key, value) =>
                  setMetaFields((prev) => ({ ...prev, [key]: value }))
                }
              />
            </Col>
            {/* Right Column */}

            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <div style={{ minHeight: "60vh" }}>
                  <JoditEditor
                    ref={editor}
                    value={content}
                    config={{
                      ...config,
                      height: "100%", // Important to let it fill the wrapper div
                    }}
                    onChange={setContent}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* Error Message */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <Button variant="danger" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="success"
              onClick={handleSave}
              disabled={isSubmitting || !formData?.title}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {isEditing ? "Updating..." : "Publishing..."}
                </>
              ) : isEditing ? (
                "Update Post"
              ) : (
                "Publish Post"
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Image Modal Preview */}
      <Modal
        show={!!imagePreview}
        onHide={() => setImagePreview(null)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={formData.previewFeaturedImage}
            alt="Preview"
            style={{ maxWidth: "100%", maxHeight: "70vh" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setImagePreview(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BlogPostEditor;