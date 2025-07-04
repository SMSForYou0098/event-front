import React, { useState } from 'react'
import CustomIconButton from '../CustomComponents/CustomIconButton'
import { DleteIcon, EditIcon } from '../CustomHooks/CustomIcon'
import { Accordion, Card, Form } from 'react-bootstrap'
const AccordionItemCard = (props) => {
    const { ChildIkey, catIndex, title, HandleParentEdit, HandleChildEdit, HandleParentDelete, HandleChildDelete, ParentData, HandleAddChild } = props;
    const [activeKeys, setActiveKeys] = useState([]);
    const handleAccordionToggle = (key) => {
        const isActive = activeKeys.includes(key);
        if (isActive) {
            setActiveKeys(activeKeys.filter((k) => k !== key));
        } else {
            setActiveKeys([...activeKeys, key]);
        }
    };
    return (
        <Card>
            <Accordion activeKey={activeKeys}>
                <Accordion.Item eventKey={String(catIndex)} className="bg-transparent border-0">
                    <Accordion.Header onClick={() => handleAccordionToggle(String(catIndex))}>
                        <div style={{ width: '92%' }} className="d-flex align-items-center justify-content-between">
                            {title}
                            <div className='d-flex gap-2 align-items-center'>
                                <div style={{ cursor: 'pointer' }} onClick={() => HandleParentEdit(ParentData)}>
                                    <EditIcon />
                                </div>
                                <div style={{ cursor: 'pointer' }} onClick={() => HandleParentDelete(ParentData?.id)}>
                                    <DleteIcon />
                                </div>
                            </div>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="bg-transparent p-0 ">
                        <Card.Body>
                            <div className="overflow-scroll pe-5" style={{ maxHeight: '16.5rem' }}>
                                {ParentData?.[ChildIkey]?.map((item, index) => (
                                    <div className="d-flex align-items-center justify-content-between mb-2" key={index}>
                                        <Form.Label htmlFor={`checkbox-${item?.id}`} className='m-0 h6'>{item.title}</Form.Label>
                                        <div className='d-flex gap-2 align-items-center'>
                                            <div style={{ cursor: 'pointer' }} onClick={() => HandleChildEdit(item)}>
                                                <EditIcon />
                                            </div>
                                            <div style={{ cursor: 'pointer' }} onClick={() => HandleChildDelete(item?.id)}>
                                                <DleteIcon />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{ cursor: 'pointer', border: '1px dashed #8A92A6', width: '92%' }}
                                className='d-flex justify-content-center flex-column rounded-3 py-3'
                                onClick={() => HandleAddChild(ParentData?.id, ParentData?.title)}
                            >
                                <CustomIconButton
                                    buttonClasses={'m-0 p-0'}
                                    iconclass={'m-0 p-0'}
                                    type="add"
                                />
                                <span className='text-grey text-center'>Click To Add More Links</span>
                            </div>
                        </Card.Body>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Card>
    )
}

export default AccordionItemCard
