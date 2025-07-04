// src/App.jsx
import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import ImageBlock from './Sections/ImageBlock'
import CustomBlock from './Sections/CustomBlock'
import ColumnBlock from './Sections/ColumnBlock'
import TextBlock from './Sections/TextBlock'


const getDefaultContent = (type) => {
  switch (type) {
    case 'text':
      return 'New text block'
    case 'image':
      return '/placeholder.svg'
    case 'custom':
      return '<div>Custom block</div>'
    default:
      return ''
  }
}

const Builder = () => {
  const [blocks, setBlocks] = useState([])

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: getDefaultContent(type)
    }
    setBlocks([...blocks, newBlock])
  }

  const renderBlock = (block, onEdit) => {
    switch (block.type) {
      case 'text':
        return <TextBlock content={block.content} onEdit={onEdit} />
      case 'image':
        return <ImageBlock content={block.content} onEdit={onEdit} />
      case 'custom':
        return <CustomBlock content={block.content} onEdit={onEdit} />
      case 'column':
        return <ColumnBlock content={block.content} onEdit={onEdit} />
      default:
        return null
    }
  }

  return (
    <div className="container">
      <h1>Page Builder</h1>
      <div>
        <button onClick={() => addBlock('text')}>Add Text Block</button>
        <button onClick={() => addBlock('image')}>Add Image Block</button>
        <button onClick={() => addBlock('column')}>Add Column Block</button>
        <button onClick={() => addBlock('custom')}>Add Custom Block</button>
      </div>
      <DragDropContext>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {renderBlock(block, (newContent) => {
                        const updatedBlocks = [...blocks]
                        updatedBlocks[index] = { ...block, content: newContent }
                        setBlocks(updatedBlocks)
                      })}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default Builder
