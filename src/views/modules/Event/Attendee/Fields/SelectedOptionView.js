import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const SelectedOptionView = ({ item, HandleClick, closable }) => {
    return (

        <ListGroup>
            <ListGroupItem className='p-1 d-flex justify-content-between align-items-center px-2' action variant="gray">
                <span style={{ fontSize: '0.8rem' }}>{item}</span>
                {closable &&
                    <div className="cursor-pointer" onClick={HandleClick}>
                        <FontAwesomeIcon icon={faClose} />
                    </div>
                }
            </ListGroupItem>
        </ListGroup>
    )
}

export default SelectedOptionView