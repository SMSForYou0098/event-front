import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from 'react-bootstrap';
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import BlogListSkeleton from './skeletons/BlogListSkeleton';
import PaginationComponent from './PaginationComponent';
import BlogCard from './BlogCard';
import BlogFilterControls from './BlogFilterControls';

export const sortOptions = [
  { label: 'Latest', value: 'desc' },
  { label: 'Oldest', value: 'asc' },
];

const ITEMS_PER_PAGE = 12;

const PublicBlogList = () => {
  const { authToken, api } = useMyContext();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [sortOrder, setSortOrder] = useState(sortOptions[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getCategories = async () => {
    try {
      const response = await axios.get(`${api}category`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data?.status) {
        const options = response.data.categoryData.map((cat) => ({
          label: cat.title,
          value: cat.id,
        }));
        setCategoryOptions(options);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}blog-status`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.data?.status && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
        setFilteredPosts(response.data.data);
      } else {
        setError('Invalid response format.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let data = [...posts];

    if (searchTerm) {
      data = data.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      const selectedIds = selectedCategories.map((opt) => opt.value);
      data = data.filter((post) =>
        post.categories?.some((cat) => selectedIds.includes(cat.id))
      );
    }

    data.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder.value === 'desc'
        ? dateB - dateA
        : dateA - dateB;
    });

    setFilteredPosts(data);
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, posts, sortOrder]);

  useEffect(() => {
    const calculatePagination = () => {
      const totalItems = filteredPosts.length;
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
      setTotalPages(totalPages);

      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
      setDisplayedPosts(filteredPosts.slice(startIndex, endIndex));
    };

    calculatePagination();
  }, [filteredPosts, currentPage]);

  useEffect(() => {
    getCategories();
    getData();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="my-5">
      <BlogFilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryOptions={categoryOptions}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        sortOptions={sortOptions}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {loading ? (
        <div className="text-center py-5">
          <BlogListSkeleton/>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded shadow-sm">
          {error}
        </Alert>
      ) : displayedPosts.length === 0 ? (
        <Alert variant="info" className="rounded shadow-sm">
          No blog posts found.
        </Alert>
      ) : (
        <>
          <Row className="g-4">
            {displayedPosts.map((post) => (
              <Col key={post.id} xs={12} md={6} lg={4}>
                <BlogCard post={post} />
              </Col>
            ))}
          </Row>
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};

export default PublicBlogList;