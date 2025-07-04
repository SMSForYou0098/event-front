import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

const ImageBlock = ({ content, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)

  return (
    <div className="p-4 border rounded-md mb-4">
      {isEditing ? (
        <>
          <Form.Control
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Enter image URL"
            className="mb-2"
          />
          <Button onClick={() => {
            onEdit(editedContent)
            setIsEditing(false)
          }}>Save</Button>
        </>
      ) : (
        <>
          <img src={content} alt="Block content" className="max-w-full h-auto" />
          <Button variant="outline-secondary" onClick={() => setIsEditing(true)}>Edit</Button>
        </>
      )}
    </div>
  )
}

export default ImageBlock
