import React from 'react'
import { Card } from 'react-bootstrap'
import AgentCredit from '../User/AgentCredit'
import { useMyContext } from '../../../../Context/MyContextProvider';

const AsignBalance = () => {
    return (
        <Card>
            <Card.Header>
                <h5>Assign Credits to User</h5>
            </Card.Header>
            <Card.Body>
                <AgentCredit/>
            </Card.Body>
        </Card>
    )
}

export default AsignBalance
