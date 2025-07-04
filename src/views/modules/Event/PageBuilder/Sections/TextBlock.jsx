import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const TextBlock = ({ content, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  return (
    <div className="p-4 border rounded-md mb-4">
      {isEditing ? (
        <>
          <Form.Control
            as="textarea"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mb-2"
          />
          <Button onClick={() => {
            onEdit(editedContent)
            setIsEditing(false)
          }}>Save</Button>
        </>
      ) : (
        <>
          <p>{content}</p>
          <Button variant="outline-secondary" onClick={() => setIsEditing(true)}>Edit</Button>
        </>
      )}
    </div>
  )
}

export default TextBlock
