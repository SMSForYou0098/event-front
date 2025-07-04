import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Row, Col, Card, Image, Form, InputGroup } from 'react-bootstrap';
import { CustomCheckbox } from '../../../../CustomComponents/CustomFormFields';
import { useMyContext } from '../../../../../../../Context/MyContextProvider';
import { Search } from 'lucide-react';
const AttendySugettion = (props) => {
    const { requiredFields, data, showAddAttendeeModal, setShowAddAttendeeModal, setAttendeesList, quantity, openAddModal, totalAttendee } = props;
    const [selectedAttendees, setSelectedAttendees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { ErrorAlert, isMobile } = useMyContext()
    const handleSelectAttendee = (e, attendee, index) => {
        const isChecked = e.target.checked;
        const missingFields = requiredFields
            .filter(field => attendee[field] == null)
            .map(field => field);
        setSelectedAttendees((prevSelected) => {
            if (isChecked) {
                if (prevSelected.length < quantity) {
                    const updatedSelected = [...prevSelected, attendee];
                    setAttendeesList((prevList) => [
                        ...prevList,
                        { ...attendee, missingFields, index }
                    ]);

                    return updatedSelected;
                } else {
                    ErrorAlert('Maximum number of attendees reached');
                    return prevSelected;
                }
            } else if (!isChecked) {
                const updatedSelected = prevSelected?.filter((item) => item !== attendee);
                setAttendeesList((prevList) =>
                    prevList?.filter((item) => item?.index !== index)
                );

                return updatedSelected;
            }
            return prevSelected;
        });
    };
    const handleConfirmAttendees = () => {
        setShowAddAttendeeModal(false);
    };
    const HandleClose = () => {
        if (quantity !== totalAttendee) {
            openAddModal(true)
        }
        setShowAddAttendeeModal(false);
    }
    const filteredAttendees = useMemo(() => {
        if (!searchTerm.trim()) return data;
        const searchLower = searchTerm.toLowerCase();
        return data.filter(attendee => 
          ["Name", "Mo", "Email"].some(key => 
            String(attendee[key] || "")
              ?.toLowerCase()
              ?.includes(searchLower)
          )
        );
      }, [searchTerm, data]);
      
    return (
        <Modal show={showAddAttendeeModal} onHide={() => HandleClose()} size='xl'>
            <Modal.Header>
                <div className="d-flex justify-content-between w-100">
                    <div>
                        {/* <Modal.Title>Suggested Attendees</Modal.Title> */}
                        <Modal.Title className='d-flex flex-column align-items-start w-100'>
                            <div className='d-flex align-items-center'>
                                <p className='m-0 p-0'>Attendees</p>
                                <span className='text-muted h6 m-0 p-0'>&nbsp;(select max {quantity})</span>
                            </div>

                            {/* Search Input for Attendees */}
                            <Form.Group className="mt-2" controlId="searchAttendees">
                                <InputGroup>
                                    <Form.Control type="text" placeholder="Search Attendees..." onChange={(e) => setSearchTerm(e.target.value)}/>
                                    <InputGroup.Text>
                                        <Search size={18} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Modal.Title>


                    </div>
                    <div className='text-end'>
                        <Button variant="secondary" className={`${isMobile ?'mb-2' : 'me-2'}`} onClick={() => HandleClose()} disabled={quantity === selectedAttendees?.length}>
                            Add {!isMobile && 'New Attendee'}
                        </Button>
                        <Button variant="primary" onClick={handleConfirmAttendees}>
                            Confirm {!isMobile && 'Selection'}
                        </Button>
                    </div>
                </div>

            </Modal.Header>
            <Modal.Body className="overflow-auto" style={{ maxHeight: '50rem' }}>
                <Row>
                    {filteredAttendees?.map((attendee, index) => (
                        <Col md={4} key={index}>
                            <Card>
                                <Card.Body className='p-0'>
                                    <label className="inner-set p-2 rounded-3 d-flex align-items-center gap-3 custom-dotted-border cursor-pointer">
                                        <CustomCheckbox
                                            disabled={
                                                selectedAttendees.length >= quantity &&
                                                !selectedAttendees.includes(attendee)
                                            }
                                            validationMessage="Checkbox is required"
                                            onChange={(e) => handleSelectAttendee(e, attendee, index)}
                                        />
                                        <div className="custom-checkbox-label">
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="d-flex">
                                                    {attendee?.Photo &&
                                                        <Image
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                            src={attendee?.Photo}
                                                            alt='attendee Image'
                                                        />
                                                    }
                                                </div>
                                                <div className="flex flex-column">
                                                    <p>
                                                        <strong>Name:</strong> {attendee?.Name}
                                                    </p>
                                                    <p>
                                                        <strong>Number:</strong> {attendee?.Mo}
                                                    </p>
                                                    <p>
                                                        <strong>Name:</strong> {attendee?.Email}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </label>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}

                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default AttendySugettion