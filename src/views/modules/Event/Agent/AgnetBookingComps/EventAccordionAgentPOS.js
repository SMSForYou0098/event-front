import React, { useState } from 'react'
import { Accordion, Card, Col, Form, Row } from 'react-bootstrap'
import PosEvents from '../../POS/PosEvents'
import { SearchIcon } from 'lucide-react'

const EventAccordionAgentPOS = ({ handleButtonClick, activeKey, setActiveKey }) => {
    const [searchTerm, setSearchTerm] = useState('')
    return (
        <Card>
            <Card.Body className="py-0">
                <Accordion flush className="p-0" activeKey={activeKey} onSelect={(e) => setActiveKey(e)}>
                    <Accordion.Item eventKey="0" className="bg-transparent">
                        <Accordion.Header>Events</Accordion.Header>
                        <Accordion.Body className="bg-transparent p-0 pt-3">
                            <Row>
                                <Col lg="12">
                                    <Form>
                                        <Row>
                                            <Col lg="12">
                                                <Form.Group className="mb-3 form-group input-group search-input w-100">
                                                    <input
                                                        type="search"
                                                        className="form-control"
                                                        placeholder="Search Your Event..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                    <SearchIcon size={16} />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                                <Col lg="12">
                                    <PosEvents searchTerm={searchTerm} handleButtonClick={handleButtonClick} />
                                </Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
        </Card>
    )
}

export default EventAccordionAgentPOS
