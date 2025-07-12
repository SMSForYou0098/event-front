import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import CommonDateRange from '../../../Event/CustomHooks/CommonDateRange';



const BlogDashboardFilters= ({ filters, setFilters }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Row className="g-3 align-items-end mb-3">
      <Col md={4}>
        <Form.Label>Search by Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter title..."
          value={filters.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </Col>
      <Col md={4}>
        <Form.Label>Status</Form.Label>
        <Form.Select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="all">All</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </Form.Select>
      </Col>
      <Col md={4}>
        <Form.Label>Date Range</Form.Label>
        <CommonDateRange
          setState={(val) => handleChange('date', val)}
          showSwitch={false}
        />
      </Col>
    </Row>
  );
};

export default BlogDashboardFilters;
