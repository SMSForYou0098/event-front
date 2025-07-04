import React, { useState, memo, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useMyContext } from '../../../../../Context/MyContextProvider'
import { Minus, Plus } from 'lucide-react'

const CustomCounter = memo((props) => {

    const { getTicketCount, category, price, limit, ticketID, disabled, selectedTickets, resetCounterTrigger } = props
    const { ErrorAlert } = useMyContext()
    const [counter, setCount] = useState(0);

    useEffect(() => {
        if (resetCounterTrigger) {
            setCount(0)
        }
    }, [resetCounterTrigger]);

    useEffect(() => {
        if (selectedTickets?.id === ticketID) {
            setCount(selectedTickets?.quantity || 0);
        } else {
            setCount(0);
        }
    }, [selectedTickets, ticketID]);

    const increase = () => {
        if (parseInt(counter) === parseInt(limit)) {
            ErrorAlert(`You can select max ${limit} tickets`)
            return;
        }
        const newCount = counter < limit ? counter + 1 : counter;
        setCount(newCount);
        // Call getTicketCount after state update
        setTimeout(() => {
            getTicketCount(newCount, category, price, ticketID);
        }, 0);
    };

    const decrease = () => {
        const newCount = counter > 0 ? counter - 1 : 0;
        setCount(newCount);
        // Call getTicketCount after state update
        setTimeout(() => {
            getTicketCount(newCount, category, price, ticketID);
        }, 0);
    };

    return (
        <div className='d-flex justify-content-center'>
            <div className={`btn-group iq-qty-btn  ${props.class}`} data-qty="btn" role="group">
                <Button variant="outline-light iq-quantity-minus py-0 px-2" size="md" onClick={decrease} disabled={disabled}>
                    <Minus color='black' size={20} />
                </Button>
                <input
                    type="text"
                    data-qty="input"
                    className="btn btn-md btn-outline-light input-display text-black p-0"
                    style={{ minWidth: '40px', fontSize: '1.5rem' }}
                    readOnly
                    value={counter}
                    title="Qty"
                    placeholder=""
                />
                <Button variant="outline-light iq-quantity-plus py-0 px-2" size="md" onClick={increase} disabled={disabled}>
                    <Plus color='black' size={20} />
                </Button>
            </div>
        </div>
    )
})

CustomCounter.displayName = "CustomCounter"
export default CustomCounter