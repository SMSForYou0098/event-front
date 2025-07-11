import React from 'react';
import { Row, Col, InputGroup, Form } from 'react-bootstrap';
import Select from 'react-select';

const BlogFilterControls = ({
  searchTerm,
  setSearchTerm,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  sortOptions,
  sortOrder,
  setSortOrder
}) => {
  return (
    <Row className="mb-4 align-items-end">
      <Col md={4}>
        <InputGroup className="shadow-sm">
          <Form.Control
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 py-2"
          />
          <InputGroup.Text className="bg-white border-0">
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
          className="shadow-sm"
          styles={{
            control: (base) => ({
              ...base,
              border: 'none',
              minHeight: '44px',
              boxShadow: 'none'
            })
          }}
        />
      </Col>
      <Col md={4}>
        <Select
          options={sortOptions}
          value={sortOrder}
          onChange={(opt) => setSortOrder(opt)}
          placeholder="Sort by"
          className="shadow-sm"
          styles={{
            control: (base) => ({
              ...base,
              border: 'none',
              minHeight: '44px',
              boxShadow: 'none'
            })
          }}
        />
      </Col>
    </Row>
  );
};

export default BlogFilterControls;