import React, { useEffect, useState } from 'react'
import { Card, Modal } from 'react-bootstrap'
import BookingsAttendee from '../LandingEvents/OrderComps/BookingsAttendee'
import { useMyContext } from '../../../../../Context/MyContextProvider'

// write code for react bootstrap modal 
const AttendeeModal = ({ handleCloseModal, data, show, category,Slider }) => {
    const { fetchCategoryData } = useMyContext()
    const [attendeeKeys, setAttendeeKeys] = useState([])

    useEffect(() => {
        if (data) {
            getCategoryData()
        }
    }, [data]);

    const getCategoryData = async () => {
        let data = await fetchCategoryData(category?.id)
        setAttendeeKeys(data?.customFieldsData)
    }
    return (
        <Modal show={show} onHide={() => handleCloseModal()} size='xl'>
            <Modal.Header closeButton>
                <h4>Attendees</h4>
            </Modal.Header>
            <Modal.Body>
                <Card>
                    <BookingsAttendee attendeeList={data} apiData={attendeeKeys} Slider={Slider}/>
                </Card>
            </Modal.Body>
        </Modal>

    )
}

export default AttendeeModal
