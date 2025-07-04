import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import DOMPurify from 'dompurify';
import { useParams } from 'react-router-dom';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { Helmet } from 'react-helmet';
import axios from 'axios';
const PageIndex = () => {
    const { api } = useMyContext()
    const { name } = useParams()
    const [data, setData] = useState();
    const convertSlugToTitle = (slug) => {
        return slug
            .replace(/-/g, ' ') // Replace hyphens with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
    };
    useEffect(() => {
        const getData = async () => {
            try {
                // Decode 'name' from URL and call the API
                const decodedName = convertSlugToTitle(name);
                const res = await axios.get(`${api}pages-title/${decodedName}`);

                if (res.data.status) {
                    const pageData = res.data.pagesData;
                    setData(pageData);
                } else {
                    console.error('Error: No valid data received from API');
                }
            } catch (err) {
                console.error('API call failed:', err);
            }
        };

        getData();
    }, [name]);
    return (
        <div>
            <Helmet>
                <title>{data?.title || 'Default Title'}</title>
                <meta name="description" content={data?.description || 'Default description'} />
                <meta property="og:title" content={data?.title || 'Default Title'} />
                <meta property="og:description" content={data?.description || 'Default description'} />
                <meta property="og:image" content={data?.image || 'default-image-url.jpg'} />
                {/* Add more meta tags as needed */}
            </Helmet>
            <Container style={{marginTop:'6rem'}}>
                <h2>{data?.pages?.title}</h2>
                {data?.pages?.content && (
                    <span
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data?.pages?.content) }}
                    />
                )}
            </Container>
        </div>
    )
}

export default PageIndex