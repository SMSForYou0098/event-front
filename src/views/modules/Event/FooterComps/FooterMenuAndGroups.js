import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import AccordionItemCard from './AccordionItemCard';

const FooterMenuAndGroups = () => {
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
            const res = await axios.get(`${api}footer-group`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const data = res.data.GroupData;
                setActiveKeys(data.map((_, index) => String(index)));
                setgroupList(data)
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
            let apiUrl = editState ? `${api}footer-group-update/${editId}` : `${api}footer-group-store`;
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
    const [menuID, setMenuID] = useState();
    const [name, setName] = useState();
    const [attachedPage, setAttachedPage] = useState('');
    const handleEdit = async (data) => {
        if (data) {
            setLinkTitle(data?.title)
            setAttachedPage(data?.page_id)
            setGroupID(data?.footer_group_id)
            setMenuID(data?.id)
            setEditLinkState(true)
            setModelShow(true)
        }
    }

    const handleSave = async () => {
        let url = editLinkState ? `${api}footer-menu-update/${menuID}` : `${api}footer-menu-store`;
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

    const HandleEditGroup = (data) => {
        setEditState(true)
        setEidtId(data?.id)
        setTitle(data?.title)
        setShow(true)
    }

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${api}footer-menu-destroy/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                successAlert('Group deleted successfully');
                GetGroups();
            }
        } catch (error) {
            console.error('Error occurred while deleting the group:', error);
        }
    };

    const handleDeleteMenuItem = async (id) => {
        try {
            const response = await axios.delete(`${api}nav-menu-destroy/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                successAlert('Menu item deleted successfully');
                GetGroups();
            }
        } catch (error) {
            console.error('Error occurred while deleting the menu item:', error);
        }
    };
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
                        {editState ? 'Update' : 'Save'}
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
                <Card className="text-center">
                    <Card.Header className="d-flex justify-content-between align-items-center p-0 py-2">
                        <h5 className="card-title mb-0">Footer Groups & Menu</h5>
                        <Button
                            className="hvr-curl-top-right border-0 p-1 px-2"
                            onClick={() => setShow(true)}
                        >
                            Add New Group
                        </Button>
                    </Card.Header>
                </Card>

                <Row className="g-3">
                    {groupList?.map((category, catIndex) => (
                        <Col key={catIndex} md={6}>
                            <AccordionItemCard
                                key={catIndex}
                                catIndex={catIndex}
                                ChildIkey={'footer_menu'}
                                title={category?.title}
                                HandleParentEdit={HandleEditGroup}
                                HandleParentDelete={handleDelete}
                                HandleChildDelete={handleDeleteMenuItem}
                                HandleChildEdit={handleEdit}
                                ParentData={category}
                                HandleAddChild={handleAdd}
                            />
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    )
}

export default FooterMenuAndGroups
