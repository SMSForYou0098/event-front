import React from 'react';
import { Col, Row } from 'react-bootstrap';
import FooterData from './FooterData';
import FooterMenuAndGroups from './FooterMenuAndGroups';
const FooterGroups = () => {
    return (
        <Row>
            <Col md={8}>
                <FooterData/>
            </Col>
            <Col md={4}>
            <FooterMenuAndGroups/>
            </Col>
        </Row>
    )
}

export default FooterGroups