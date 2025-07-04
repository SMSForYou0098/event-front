import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import axios from 'axios';
import partyImage from "../../../../../assets/modules/e-commerce/images/product/party3.jpg";
import { useMyContext } from '../../../../../Context/MyContextProvider';
import Skeleton from './Skeleton';
import EventCard from './EventCard/EventCard';
const EventsContainer = () => {
  const { api, authToken } = useMyContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState();
  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${api}events`, {
        headers: {
          'Authorization': 'Bearer ' + authToken,
        },
      });

      if (response.data.status) {
        const fetchedEvents = response.data?.events;
        setEvents(fetchedEvents);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error fetching events:', error);
    }
  }
  useEffect(() => {
    fetchEvents()
  }, []);


  return (
    <Row className="row-cols-3 row-cols-md-3 row-cols-lg-6">
      {
        loading ?
          [...Array(6)].map((_, index) => (
            <div className="key" key={index}>
              <Skeleton />
            </div>
          ))
          :
          events?.length > 0 && events?.map((item, index) =>
            <Col xs={6} lg={2} key={index} className='p-2'>
              <EventCard
                className="animate:hover-media"
                productName={item.name}
                city={item.city}
                userName={item.user?.organisation}
                productImage={item?.thumbnail ? item?.thumbnail : partyImage}
                id={item?.event_key}
                productRating="3.5"
                isSoldOut={item?.booking_close}
                isNotStart={item?.booking_not_start}
                statusColor="primary"
                productPrice={item?.lowest_ticket_price}
                salePrice={item?.lowest_sale_price}
                statusDetails={item?.on_sale || ''}
              />
            </Col>
          )
      }
    </Row>
  )
}

export default EventsContainer