import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import JoditEditor from 'jodit-react';
import DOMPurify from 'dompurify';
import { Edit, Eye } from 'lucide-react';
import { CustomTooltip } from '../CustomUtils/CustomTooltip';
import CustomDataTable from '../Wallet/CustomDataTable';
const Pages = () => {
    const { api, successAlert, ErrorAlert, authToken } = useMyContext();
    const [title, setTitle] = useState();
    const [show, setShow] = useState();
    const [content, setContent] = useState();
    const [pageList, setPageList] = useState();
    const [editState, setEditState] = useState(false)
    const [status, setStatus] = useState();
    const [editId, setEidtId] = useState('');
    const [templatePreview, setTemplatePreview] = useState('')
    const [preview, setPreview] = useState(false);
    const [loading, setLoading] = useState(true);

    const handlePreviewClose = () => {
        setPreview(false);
    }



    ///sms config
    const GetPages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}pages-list`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (response.data.status) {
                setPageList(response.data.pagesData);
            }
        } catch (error) {
            console.error('Error fetching pages:', error);
            ErrorAlert('Failed to fetch pages');
        } finally {
            setLoading(false);
        }
    }, [api, authToken, ErrorAlert]);

    useEffect(() => {
        GetPages();
    }, [GetPages]);


    const HandleSubmit = async () => {
        try {
            const payload = {
                title: title,
                content: content,
                status: status === true ? 1 : 0,
            };
            let apiUrl = editState ? `${api}pages-update/${editId}` : `${api}pages-store`;
            const response = await axios.post(apiUrl, payload, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                GetPages()
                handleClose()
                successAlert(response.data?.message)
            }
        } catch (error) {
            // console.log(error);
        }
    }
    const handleClose = useCallback(() => {
        try {
            setEditState(false);
            setContent('');
            setTitle('');
            setEidtId('');
            setStatus(false);
            setShow(false);
            setTemplatePreview('');
        } catch (error) {
            ErrorAlert('Failed to close form properly');
        }
    }, [ErrorAlert]);

    const HandlePreview = useCallback((id) => {
        try {
            const template = pageList?.find((item) => item?.id === id);
            if (!template) {
                ErrorAlert('Page not found');
            }
    
            const sanitizedHTML = DOMPurify.sanitize(template.content);
            setTemplatePreview(sanitizedHTML);
            setPreview(true);
        } catch (error) {
            ErrorAlert('Failed to preview page');
            setPreview(false);
            setTemplatePreview('');
        }
    }, [pageList, ErrorAlert]);

    const handleEdit = useCallback(async (id) => {
        try {
            const data = pageList?.find((item) => item?.id === id);
            if (!data) {
                throw new Error('Page not found');
            }
    
            setEditState(true);
            setContent(data.content || '');
            setTitle(data.title || '');
            setEidtId(data.id);
            setStatus(data.status === 1);
            setShow(true);
        } catch (error) {
            console.error('Error editing page:', error);
            ErrorAlert('Failed to edit page');
            handleClose(); // Reset form state on error
        }
    }, [pageList, ErrorAlert, handleClose]);

    const columns = useMemo(() => [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            // headerAlign: 'center',
            // align: 'center',
            sort: true
        },
        {
            dataField: 'title',
            text: 'Page Title',
            // headerAlign: 'center',
            // align: 'center',
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell) => (
                <span className={`badge ${cell === 1 ? 'bg-success' : 'bg-danger'}`}>
                    {cell === 1 ? 'Active' : 'Inactive'}
                </span>
            ),
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        // Update the action formatter in columns definition
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => {
                const actions = [
                    {
                        tooltip: "Edit Page",
                        onClick: () => handleEdit(row.id),
                        variant: "primary",
                        icon: <Edit size={16} />
                    },
                    {
                        tooltip: "Preview Page",
                        onClick: () => HandlePreview(row.id),
                        variant: "secondary",
                        icon: <Eye size={16} />
                    },
                    // {
                    //     tooltip: "Delete Page",
                    //     onClick: () => handleDelete(row.id),
                    //     variant: "danger",
                    //     icon: <Trash2 size={16} />
                    // }
                ];

                return (
                    <div className="d-flex gap-2 justify-content-center">
                        {actions.map((action, index) => (
                            <CustomTooltip key={index} text={action.tooltip}>
                                <Button
                                    variant={action.variant}
                                    className="btn-sm btn-icon"
                                    onClick={action.onClick}
                                >
                                    {action.icon}
                                </Button>
                            </CustomTooltip>
                        ))}
                    </div>
                );
            },
            headerAlign: 'center',
            align: 'center'
        }
    ], [handleEdit, HandlePreview]);
    return (
        <Row>
            <Modal show={preview} onHide={handlePreviewClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {preview && templatePreview && (
                        // templatePreview
                        <div
                            dangerouslySetInnerHTML={{ __html: templatePreview }}
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger"
                        onClick={handlePreviewClose}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show} onHide={() => handleClose()} size='xl'>
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
                            <Col lg="12">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label className="custom-file-input">Body</Form.Label>
                                    <JoditEditor
                                        tabIndex={1}
                                        value={content}
                                        onChange={(newContent) => setContent(newContent)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col lg="6">
                                <Form.Label className="custom-file-input">Page Status</Form.Label>
                                <Row>
                                    <Col lg="6" className='d-flex gap-3'>
                                        <div className="form-radio form-check">
                                            <Form.Check.Input
                                                type="radio"
                                                id="customRadio8"
                                                name="payment"
                                                className="me-2"
                                                checked={status === true}
                                                value={true}
                                                onChange={(e) => setStatus(true)}
                                            />
                                            <Form.Label
                                                className="custom-control-label"
                                                htmlFor="customRadio8"
                                            >
                                                {" "}
                                                Live
                                            </Form.Label>
                                        </div>
                                        <div className="form-radio form-check">
                                            <Form.Check.Input
                                                type="radio"
                                                id="customRadio8"
                                                name="payment"
                                                className="me-2"
                                                value={false}
                                                checked={status === false}
                                                onChange={(e) => setStatus(false)}
                                            />
                                            <Form.Label
                                                className="custom-control-label"
                                                htmlFor="customRadio8"
                                            >
                                                {" "}
                                                Disabled
                                            </Form.Label>
                                        </div>
                                    </Col>
                                </Row>
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
            <Col lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                            <h4 className="card-title">Pages</h4>
                        </div>
                        <div className="button">
                            <h4 className="card-title">
                                <Button className="me-4 hvr-curl-top-right border-0" onClick={() => setShow(true)}>
                                    Add New Page
                                </Button>
                            </h4>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <CustomDataTable
                            data={pageList}
                            columns={columns}
                            loading={loading}
                            keyField="id"
                            searchPlaceholder="Search pages..."
                        />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Pages