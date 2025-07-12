import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Container,
  Spinner,
  Alert
} from 'react-bootstrap';
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import PaginationComponent from '../components/PaginationComponent';
import PostTableSkeletons from '../components/skeletons/PostTableSkeletons';
import BlogDashboardFilters from '../components/dashboards/BlogDashboardFilters';
import { filter } from 'lodash';
import { useDebounce } from './Dashboard';

const Posts = () => {
  const { authToken, api } = useMyContext();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    status: 'all',
    date: ''
  });
  const debouncedTitle = useDebounce(filters.title, 400);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}blog-list`, {
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the blog post.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${api}blog-destroy/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const updated = posts.filter((post) => post.id !== id);
        setPosts(updated);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The blog post has been deleted.',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to delete the post.', 'error');
      }
    }
  };

useEffect(() => {
  const filtered = posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(debouncedTitle.toLowerCase());
    const statusMatch =
      filters.status === 'all' || String(post.status) === filters.status;

    let dateMatch = true;

    if (filters.date) {
      const [startStr, endStr] = filters.date.split(',');
      const start = startStr ? new Date(startStr) : null;
      const end = endStr ? new Date(endStr) : null;
      const createdAt = new Date(post.created_at);

      dateMatch =
        (!start || createdAt >= start) &&
        (!end || createdAt <= new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59));
    }

    return titleMatch && statusMatch && dateMatch;
  });

  setFilteredPosts(filtered);
  setCurrentPage(1);
}, [debouncedTitle, filters.status, filters.date, posts]);



  const paginate = (items) => {
    const start = (currentPage - 1) * postsPerPage;
    return items.slice(start, start + postsPerPage);
  };

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  useEffect(() => {
    getData();
  }, []);

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">All Blog Posts</h4>
        <Button variant="primary" onClick={() => navigate('/blogs/dashboard/create-post')}>
          + Create Post
        </Button>
      </div>

      <BlogDashboardFilters filters={filters} setFilters={setFilters} />

      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr className="text-center">
                <th>#</th>
                <th>Title</th>
                <th>Created At</th>
                <th>Thumbnail</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <PostTableSkeletons />
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <Alert variant="info" className="mb-0">
                      No blog posts found.
                    </Alert>
                  </td>
                </tr>
              ) : (
                paginate(filteredPosts).map((post, index) => (
                  <tr key={post.id} className="align-middle text-center">
                    <td>{(currentPage - 1) * postsPerPage + index + 1}</td>
                    <td className="text-start">{post.title}</td>
                    <td>{new Date(post.created_at).toLocaleString()}</td>
                    <td>
                      <img
                        src={post.thumbnail}
                        alt="thumbnail"
                        style={{
                          height: '60px',
                          width: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </td>
                    <td>{post?.user_data?.name}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-info"
                        className="me-2"
                        onClick={() => navigate(`/blogs/dashboard/edit-post/${post.id}`)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(post.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {!loading && filteredPosts.length > 0 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default Posts;
