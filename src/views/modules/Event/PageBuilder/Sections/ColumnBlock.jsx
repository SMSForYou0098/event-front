// src/components/ColumnBlock.jsx
import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Plus } from 'lucide-react'

const ColumnBlock = ({ content, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [columns, setColumns] = useState(content.length)
  const [showModal, setShowModal] = useState(false)

  const updateColumnContent = (columnIndex, newBlocks) => {
    const newContent = [...content]
    newContent[columnIndex] = newBlocks
    onEdit(newContent)
  }

  const addBlockToColumn = (columnIndex, blockType) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: blockType === 'text' ? 'New text block' : '/placeholder.svg'
    }
    const newColumn = [...content[columnIndex], newBlock]
    updateColumnContent(columnIndex, newColumn)
    setShowModal(false)
  }

  return (
    <div className="p-4 border rounded-md mb-4">
      {isEditing ? (
        <>
          <Form.Select
            value={columns?.toString()}
            onChange={(e) => {
              const newColumns = parseInt(e.target.value)
              setColumns(newColumns)
              const newContent = [...content]
              while (newContent.length < newColumns) {
                newContent.push([])
              }
              while (newContent.length > newColumns) {
                newContent.pop()
              }
              onEdit(newContent)
            }}
            className="mb-2"
          >
            <option value="2">2 Columns</option>
            <option value="3">3 Columns</option>
            <option value="4">4 Columns</option>
          </Form.Select>
          <Button onClick={() => setIsEditing(false)}>Save</Button>
        </>
      ) : (
        <>
          <div className={`grid grid-cols-${columns} gap-4`}>
            {content?.map((column, columnIndex) => (
              <div key={columnIndex} className="border p-2">
                <h3 className="font-bold mb-2">Column {columnIndex + 1}</h3>
                {column.map((block, blockIndex) => (
                  <div key={block.id} className="mb-2">
                    {/* Render block content here */}
                  </div>
                ))}
                <Button variant="outline-secondary" onClick={() => setShowModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />Add Block
                </Button>
              </div>
            ))}
          </div>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Block</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Button onClick={() => addBlockToColumn(0, 'text')}>Add Text Block</Button>
              <Button onClick={() => addBlockToColumn(0, 'image')}>Add Image Block</Button>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  )
}

export default ColumnBlock
