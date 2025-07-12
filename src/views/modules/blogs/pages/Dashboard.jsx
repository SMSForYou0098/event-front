import React, { useEffect, useState } from 'react';
import { Card, Table, Spinner, Container } from 'react-bootstrap';
import DashboardStatsCards from '../components/dashboards/DashboardStatsCards';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

const Dashboard = () => {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Container className="px-3">
      <Card className="mb-4 shadow-sm rounded-4">
        <Card.Body>
          <DashboardStatsCards
            totalPosts={10}
            totalComments={250}
            newUsers={34}
            activeEvents={4}
            categories={12}
            inactiveBlogs={blogs.filter((b) => b.status === 0).length}
            lastUpdated={new Date().toLocaleString()}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
