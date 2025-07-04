import React, { useEffect, useRef, useState } from 'react'
import { Accordion, Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'

import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import CustomIconButton from '../CustomComponents/CustomIconButton';
import Swal from 'sweetalert2';
import { DleteIcon, EditIcon } from '../CustomHooks/CustomIcon';
const MenuGroups = () => {
    const { api, successAlert, authToken } = useMyContext();
    const [title, setTitle] = useState();
    const [groupList, setgroupList] = useState([]);
    const [editState, setEditState] = useState(false)
    const [status, setStatus] = useState();
    const [editId, setEidtId] = useState('');
    const [pages, setPages] = useState([])
    const [activeKeys, setActiveKeys] = useState([]);
    useEffect(() => {
        const accordionButtons = document.querySelectorAll('.accordion-button');
        accordionButtons.forEach(button => {
            button.style.backgroundColor = 'transparent';
        });
    }, []);

    ///sms config
    const GetGroups = async () => {
        try {
            const res = await axios.get(`${api}menu-group`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const data = res.data.MenuGroupData;
                setgroupList(data)
                //  setActiveKeys(data.map((_, index) => String(index)));
            }
        } catch (err) {
            console.log(err);
        }
    };
    const fetchPages = async () => {
        try {
            const response = await axios.get(`${api}pages-get-title`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            const menus = response.data.pagesData;
            setPages(menus)
        } catch (error) {
            console.error('Failed to fetch payment gateways:', error);
        }
    };
    useEffect(() => {
        GetGroups()
        fetchPages()
    }, []);


    const HandleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: title,
            };
            let apiUrl = editState ? `${api}menu-group-update/${editId}` : `${api}menu-group-store`;
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                GetGroups()
                handleClose()
                successAlert(response.data?.message)
            }
        } catch (error) {
            // console.log(error);
        }
    }
    const handleClose = () => {
        setEditState(false)
        setTitle('');
        setEidtId('');
        setStatus()
        setShow(false)
    }
    const [show, setShow] = useState();


    // link code 
    const [modelShow, setModelShow] = useState();
    const [linkTitle, setLinkTitle] = useState('');
    const [editLinkState, setEditLinkState] = useState('');
    const [groupID, setGroupID] = useState([]);
    const [name, setName] = useState();
    const [attachedPage, setAttachedPage] = useState('');
    const handleEdit = async (data) => {
        if (data) {
            setLinkTitle(data?.title)
            setAttachedPage(data?.page_id)
            setGroupID(data?.id)
            setEditLinkState(true)
            setModelShow(true)
        }
    }

    const handleSave = async () => {
        let url = editLinkState ? `${api}footer-menu-update/${groupID}` : `${api}footer-menu-store`;
        const payload = {
            title: linkTitle,
            footer_group_id: groupID,
            page_id: attachedPage,
        };

        try {
            const response = await axios.post(url, payload);
            if (response.data.status) {
                successAlert('Link' + editLinkState ? 'Update Successfully' : "Added Successfully")
                handleModelClose()
                GetGroups()
            }
        } catch (error) {
            console.error('Error occurred while making the POST request:', error);
            // Handle error appropriately, e.g., display a notification to the user
        }
    };

    const handleModelClose = () => {
        setModelShow(false);
        setEditLinkState(false);
        setLinkTitle('');
        setAttachedPage('');
    };
    const handleAdd = (id, name) => {
        setName(name)
        setGroupID(id)
        setModelShow(true);
    }
    // Handle accordion toggle
    const handleAccordionToggle = (key) => {

        const isActive = activeKeys.includes(key);
        if (isActive) {
            setActiveKeys(activeKeys.filter((k) => k !== key));
        } else {
            setActiveKeys([...activeKeys, key]);
        }
    };



    const DeleteGroup = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
            let url = `${api}menu-group-destroy/${id}`;
            try {
                const response = await axios.delete(url, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });
                if (response.data.status) {
                    Swal.fire('Deleted!', 'Group Deleted Successfully', 'success');
                    GetGroups();
                }
            } catch (error) {
                Swal.fire('Error!', 'An error occurred while deleting the group.', 'error');
            }
        }
    };

    const [statusList, setStatusList] = useState({});
    const handleStatusChange = (checked, catIndex) => {
        if (checked) {
            setStatusList({
                [catIndex]: true,
            });
        } else {
            setStatusList(prevStatus => ({
                ...prevStatus,
                [catIndex]: false,
            }));
        }
    };
    useEffect(() => {
        if (groupList.length > 0) {
            const initialStatus = {};
            const activeAccordions = [];

            groupList.forEach((category, index) => {
                initialStatus[index] = category.status === 1;
                if (category.status === 1) {
                    activeAccordions.push(String(index)); // Open accordions where status is active
                }
            });

            setStatusList(initialStatus);
            setActiveKeys(activeAccordions);
        }
    }, [groupList]);
    return (
        <Row>
            {/* create group  */}
            <Modal show={show} onHide={() => handleClose()}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100">{editState ? 'Edit' : 'New'} Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="custom-file-input">Name</Form.Label>
                                    <Form.Control type="text" value={title} placeholder="" onChange={(e) => setTitle(e.target.value)} />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger"
                        onClick={handleClose}
                    >
                        Discard Changes
                    </Button>
                    <Button variant="primary" onClick={HandleSubmit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* group list  */}
            <Modal show={modelShow} onHide={() => handleModelClose()}>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{`${editLinkState ? 'Update ' : ' Add '}`}Link To {name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Link Title Input */}
                        <Form.Group className="mb-3">
                            <Form.Label>Link Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter link title"
                                value={linkTitle}
                                onChange={(e) => setLinkTitle(e.target.value)}
                            />
                        </Form.Group>

                        {/* Attach Page Dropdown */}
                        <Form.Group className="mb-3">
                            <Form.Label>Attach page with this link</Form.Label>
                            <Form.Select
                                value={attachedPage}
                                onChange={(e) => setAttachedPage(e.target.value)}
                            >
                                <option>Select a page</option>
                                {pages && pages?.map((page) => (
                                    <option key={page.id} value={page.id}>
                                        {page.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            <Col lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                            <h4 className="card-title">Menus</h4>
                            <small className="text-muted">(Note: Only one menu can be active at a time)</small>
                        </div>
                        <div className="button" onClick={() => setShow(true)}>
                            <h4 className="card-title mb-3">
                                <Button className="me-4 hvr-curl-top-right border-0" >
                                    Add New Menu
                                </Button>
                            </h4>
                        </div>
                    </Card.Header>
                </Card>

                {/* //groups render */}
                <Row className="g-3">
                    {groupList?.map((category, catIndex) => (
                        <Col key={catIndex} md={3}>
                            <Card>
                                <Accordion activeKey={activeKeys}>
                                    <Accordion.Item eventKey={String(catIndex)} className="bg-transparent border-0">
                                        <Accordion.Header onClick={() => handleAccordionToggle(String(catIndex))}>
                                            <div style={{ width: '92%' }} className="d-flex align-items-center justify-content-between">
                                                {category.title}
                                                <div className='d-flex gap-2 align-items-center'>
                                                    <div style={{ cursor: 'pointer' }}>
                                                        <Form.Check className="form-switch">
                                                            <Form.Check.Input
                                                                type="checkbox"
                                                                className="me-2"
                                                                id={`flexSwitchCheckDefault-${catIndex}`}
                                                                checked={statusList[catIndex] || false}
                                                                onChange={(e) => handleStatusChange(e.target.checked, catIndex)}
                                                            />
                                                        </Form.Check>
                                                    </div>
                                                    <div style={{ cursor: 'pointer' }}
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        <EditIcon/>
                                                    </div>
                                                    <div style={{ cursor: 'pointer' }}
                                                        onClick={() => DeleteGroup(category?.id)}
                                                    >
                                                        <DleteIcon/>
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body className="bg-transparent p-0 ">
                                            <Card.Body>
                                                <div className="overflow-scroll pe-5" style={{ maxHeight: '16.5rem' }}>
                                                    {category?.navigation_menu?.map((item, index) => (
                                                        <div className="d-flex align-items-center justify-content-between mb-2" key={index}>
                                                            <Form.Label htmlFor={`checkbox-${item?.id}`} className='m-0 h6'>{item.title}</Form.Label>
                                                            <div className='d-flex gap-2 align-items-center'>
                                                                <div style={{ cursor: 'pointer' }} onClick={() => handleEdit(item)}>
                                                                    <EditIcon/>
                                                                </div>
                                                                <div style={{ cursor: 'pointer' }} onClick={() => handleEdit(item)}>
                                                                   <DleteIcon/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div
                                                    style={{ cursor: 'pointer', border: '1px dashed #8A92A6', width: '92%' }}
                                                    className='d-flex justify-content-center flex-column rounded-3 py-3'
                                                    onClick={() => handleAdd(category?.id, category?.title)}
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
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    )
}

export default MenuGroups