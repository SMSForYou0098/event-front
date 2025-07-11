import React, { useEffect, useState } from "react";
import { Form, Row, Col, Badge } from "react-bootstrap";
import { useMyContext } from "../../../../Context/MyContextProvider";
import axios from "axios";
import Select from "react-select";

const MetaFields = ({ meta, onChange }) => {
  const { authToken, api } = useMyContext();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState([]);

  const [tagInput, setTagInput] = useState("");
  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !meta.tags.includes(newTag)) {
      const updatedTags = [...meta.tags, newTag];
      onChange("tags", updatedTags);
    }
    setTagInput("");
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${api}category`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to fetch categories");
      }

      const fetchedOptions = response.data.categoryData.map((cat) => ({
        label: cat.title,
        value: cat.id,
      }));

      setCategoryOptions(fetchedOptions);

      // Sync meta.categories into selected options
      if (meta?.categories?.length) {
        const selected = fetchedOptions.filter((opt) =>
          meta.categories.some((cat) => cat.id === opt.value)
        );
        setSelectedCategoryOptions(selected);
        setSelectedCategoryOptions(selected);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Initialize tag input with current tags when meta changes

  const removeTag = (indexToRemove) => {
    const newTags = meta.tags.filter((_, index) => index !== indexToRemove);
    onChange("tags", newTags);
    setTagInput(newTags.join(", "));
  };

  return (
    <>
    <Form.Group className="mb-3">
        <Form.Label>Select Categories</Form.Label>
        <Select
          isMulti
          options={categoryOptions}
          value={selectedCategoryOptions}
          onChange={(selectedOptions) => {
            setSelectedCategoryOptions(selectedOptions);
            onChange(
              "categories",
              selectedOptions.map((opt) => opt.value)
            );
          }}
          placeholder="Choose categories..."
        />
      </Form.Group>
    <div className="border p-3 rounded mb-4">
      
      <h5 className="mb-3 text-primary">SEO Meta Fields</h5>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Meta Title</Form.Label>
            <Form.Control
              type="text"
              value={meta?.metaTitle || ""}
              onChange={(e) => onChange("metaTitle", e.target.value)}
              placeholder="Enter Meta Title"
            />
          </Form.Group>
        </Col>
      </Row>


      <Form.Group className="mb-3">
        <Form.Label>Meta Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={meta?.metaDescription || ""}
          onChange={(e) => onChange("metaDescription", e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Meta Keywords (comma separated)</Form.Label>
        <Form.Control
          type="text"
          value={meta?.metaKeywords || ""}
          onChange={(e) => onChange("metaKeywords", e.target.value)}
          placeholder="blog, react, seo, nextjs"
        />
      </Form.Group>

      <hr />
      <Form.Group className="mb-3">
        <Form.Label>Tags</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            type="text"
            placeholder="Enter tag and click Add"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>
        <div className="mt-2">
          {meta?.tags?.map((tag, index) => (
            <Badge
              key={index}
              bg="secondary"
              className="me-2 mb-2"
              style={{ cursor: "pointer" }}
              onClick={() => removeTag(index)}
            >
              {tag} &times;
            </Badge>
          ))}
        </div>
      </Form.Group>
    </div>
    </>
  );
};

export default MetaFields;
