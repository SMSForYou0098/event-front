import React from 'react';
import { Row, Col, InputGroup, Form } from 'react-bootstrap';
import Select from 'react-select';

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    border: '1px solid #dee2e6',
    borderRadius: '12px',
    minHeight: '46px',
    paddingLeft: '4px',
    paddingRight: '4px',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : 'none',
    transition: 'box-shadow 0.2s ease',
    backgroundColor: '#fff',
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: '0.95rem',
    color: '#6c757d',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#f1f3f5',
    borderRadius: '8px',
  }),
};

const BlogFilterControls = ({
  searchTerm,
  setSearchTerm,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortOptions,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <Row className="g-3 align-items-center mb-4">
      <Col md={4}>
        <InputGroup className="shadow-sm rounded-3 overflow-hidden">
          <Form.Control
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 py-2 px-3"
            style={{
              borderRadius: '12px 0 0 12px',
              fontSize: '0.95rem',
              backgroundColor: '#f8f9fa',
            }}
          />
          <InputGroup.Text
            className="bg-white border-0"
            style={{
              borderRadius: '0 12px 12px 0',
              backgroundColor: '#f8f9fa',
            }}
          >
            <i className="bi bi-search text-muted"></i>
          </InputGroup.Text>
        </InputGroup>
      </Col>

      <Col md={4}>
        <Select
          isMulti
          options={categoryOptions}
          placeholder="Filter by categories"
          value={selectedCategories}
          onChange={setSelectedCategories}
          styles={customSelectStyles}
        />
      </Col>

      <Col md={4}>
        <Select
          options={sortOptions}
          value={sortOrder}
          onChange={setSortOrder}
          placeholder="Sort by"
          styles={customSelectStyles}
        />
      </Col>
    </Row>
  );
};

export default BlogFilterControls;
