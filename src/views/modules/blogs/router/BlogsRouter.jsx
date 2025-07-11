import BlogsLayout from '../layouts/BlogsLayout';
import HomePage from '../pages/HomePage';
import BlogPost from '../components/BlogPost';
import BlogsDashboardLayout from '../layouts/BlogsDashboardLayout';
import Dashboard from '../dashboard/Dashboard';
import Posts from '../dashboard/Posts';
import DefaultLayout from '../../Event/layouts/default-layout';
import NewPost from '../dashboard/NewPost';
import ProtectedRoutesForBlog from '../../../../router/ProtectedRouts/ProtectedRoutesForBlog';
import EditPost from '../dashboard/EditPost';
import PostPage from '../pages/PostPage';

export const BlogsRouter = [
  {
    path: "blogs/",
    element: <DefaultLayout header2="true" />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: ":slug/:id",
        element: <PostPage />,
      },
    ]
  },
  {
    path: "blogs/dashboard/",
    element: (
      <ProtectedRoutesForBlog allowedRoles={['Admin']}>
        <BlogsDashboardLayout />
      </ProtectedRoutesForBlog>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "create-post",
        element: <NewPost />,
      },
      {
        path: "edit-post/:id",
        element: <EditPost />,
      },
      {
        path: "posts",
        element: <Posts />,
      },
      // Add other protected routes here
    ]
  }
];
