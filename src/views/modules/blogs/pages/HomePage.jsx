import React from 'react';
import BlogsLayout from '../layouts/BlogsLayout';
import BlogPost from '../components/BlogPost';
import PublicBlogList from '../components/PublicBlogList';


const HomePage = () => {
  return (
    <div style={{height:'100vh',marginTop:'4.75rem'}}>
      <PublicBlogList/>
    </div>
  )
}

export default HomePage
