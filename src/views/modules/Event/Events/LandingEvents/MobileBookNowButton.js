import { ShoppingCart } from 'lucide-react';
import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MobileBookNowButton = ({ isMobile, handleBooking, disable }) => {
    if (!isMobile) return null; 

    return (
        <div className='w-100'
            style={{
                position: 'fixed',
                background: '#cc2a4d',
                left: '0',
                zIndex: '99',
                bottom: '0',
            }}
        >
            <Row className='py-5'>
                <Col xs={12} className="p-0">
                    <Link
                        style={{ background: disable ? '#E57C93' : '', }}
                        onClick={() => !disable && handleBooking()}
                        className={`${!disable ? 'bg-secondary' : ''} w-100  text-white d-flex align-items-center justify-content-center p-0`}
                    >
                        <ShoppingCart />&nbsp;Book Now
                    </Link>
                </Col>
            </Row>
        </div>
    );
};
export default MobileBookNowButton
