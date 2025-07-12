import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import {
  BiNews,
  BiCommentDetail,
  BiUser,
  BiTime,
  BiCategory,
  BiCalendarEvent,
  BiBlock
} from 'react-icons/bi';

const StatCard = ({
  icon,
  title,
  value,
  color = 'primary'
}) => (
  <Card className="shadow-sm rounded-4 h-100">
    <Card.Body className="d-flex align-items-center gap-3">
      <div className={`text-${color}`} style={{ fontSize: '2rem' }}>
        {icon}
      </div>
      <div>
        <h6 className="mb-0 text-muted">{title}</h6>
        <h5 className="mb-0">{value}</h5>
      </div>
    </Card.Body>
  </Card>
);

const DashboardStatsCards = ({
  totalPosts,
  totalComments,
  newUsers,
  activeEvents,
  categories,
  inactiveBlogs,
  lastUpdated
}) => {
  return (
    <>
      <Row xs={1} sm={2} md={3} lg={4} className="g-3 mb-4">
        <Col>
          <StatCard
            icon={<BiNews />}
            title="Total Posts"
            value={totalPosts}
          />
        </Col>
        <Col>
          <StatCard
            icon={<BiCommentDetail />}
            title="Total Comments"
            value={totalComments}
            color="info"
          />
        </Col>
        <Col>
          <StatCard
            icon={<BiUser />}
            title="Users"
            value={newUsers}
            color="success"
          />
        </Col>
        <Col>
          <StatCard
            icon={<BiCalendarEvent />}
            title="Active Events"
            value={activeEvents}
            color="warning"
          />
        </Col>
        <Col>
          <StatCard
            icon={<BiCategory />}
            title="Blog Categories"
            value={categories}
            color="secondary"
          />
        </Col>
        <Col>
          <StatCard
            icon={<BiBlock />}
            title="Inactive Blogs"
            value={inactiveBlogs}
            color="danger"
          />
        </Col>
        {lastUpdated && (
          <Col lg={4}>
            <StatCard
              icon={<BiTime />}
              title="Last Updated"
              value={lastUpdated}
              color="dark"
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default DashboardStatsCards;
