import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Category1 from '../../../../assets/event/stock/Other/1.jpg'
import Category2 from '../../../../assets/event/stock/Other/2.jpg'
import Category3 from '../../../../assets/event/stock/Other/3.jpg'
import Category4 from '../../../../assets/event/stock/Other/4.jpg'
import Category5 from '../../../../assets/event/stock/Other/5.jpg'
import Category6 from '../../../../assets/event/stock/Other/6.jpg'
import Category7 from '../../../../assets/event/stock/Other/7.jpg'
import { CONTAINER_STYLES } from './CustomMarqee/constants/continer_style'
import useMarquee from './CustomMarqee/Hooks/useMarquee'
import useResponsiveSlides from './CustomMarqee/Hooks/useResponsiveSlides'
import MarqueeTrack from './CustomMarqee/MarqueeTrack'
const EventsCategoryPC = ({speed = 30}) => {
    const images = [Category1, Category2, Category3, Category4, Category5, Category6, Category7]
  
    const { isPaused, handleMouseEnter, handleMouseLeave } = useMarquee();
    const { slidesToShow } = useResponsiveSlides();
  

    return (
        <Container fluid className="px-5">
            <Row className="align-items-center">
                <Col md={12} className="text-center">
                    <h4 className="text-secondary pb-2 text-capitalize">Events <span className="text-primary">Category</span></h4>
                </Col>
                <div
                    className="marquee-container slider-circle-btn"
                    style={CONTAINER_STYLES}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <MarqueeTrack
                        images={images}
                        speed={speed}
                        isPaused={isPaused}
                        slidesToShow={slidesToShow}
                    />
                </div>
            </Row>
        </Container>
    )
}

export default EventsCategoryPC
