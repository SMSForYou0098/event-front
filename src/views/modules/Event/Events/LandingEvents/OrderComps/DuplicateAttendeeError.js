import { AlertCircle, MailX, SpellCheck2, UserRoundPen } from 'lucide-react'
import React from 'react'
import { Alert, Button, Modal } from 'react-bootstrap'

const DuplicateAttendeeError = ({showErrorModal,errorMessages,setShowErrorModal}) => {
    const handleCloseErrorModal = () => setShowErrorModal(false);
    const getIconForError = (message) => {
        if (message.includes('email')) {
            return <MailX size={18} color="#dc3545" className="mr-2" />;
        } else if (message.toLowerCase().includes('name')) {
            return <SpellCheck2 size={18} color="#dc3545" className="mr-2" />;
        } else if (message.toLowerCase().includes('contact number')) {
            return <UserRoundPen size={18} color="#dc3545" className="mr-2" />
        }
        return null; // Default case (no icon)
    };
    return (
        <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <AlertCircle size={20} color="#dc3545" /> Validation Errors
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessages.length > 0 ? (
                    <div className="error-list">
                        {errorMessages.map((message, index) => (
                            <Alert key={index} variant="danger" className="d-flex align-items-center gap-2">
                                {getIconForError(message)}
                                {message}
                            </Alert>
                        ))}
                    </div>
                ) : (
                    <p>No errors</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseErrorModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DuplicateAttendeeError
