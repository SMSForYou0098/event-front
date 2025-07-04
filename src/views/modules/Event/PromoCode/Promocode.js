import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Col, Row, Form, Button, Modal, } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../Context/MyContextProvider';
import { Edit, PlusIcon, Trash2 } from 'lucide-react';
import CustomDataTable from '../Wallet/CustomDataTable';
import Swal from 'sweetalert2';
import { CustomTooltip } from '../CustomUtils/CustomTooltip';
const Promocode = memo(() => {

    const { api, successAlert, UserData, authToken, ErrorAlert } = useMyContext();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleShow = () => setShow(true);

    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [discountType, setDiscountType] = useState("");
    const [discountValue, setDiscountValue] = useState('percentage');
    const [minimumSpend, setMinimumSpend] = useState();
    const [usageLimit, setUsageLimit] = useState();
    const [usagePerUser, setUsagePerUser] = useState();
    const [status, setStatus] = useState();
    const [promocodes, setPromocodes] = useState([]);

    const getPromocodes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}promo-list/${UserData?.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (response.data.promoCodes) {
                setPromocodes(response.data.promoCodes.reverse());
            }
        } catch (error) {
            console.error('Error fetching promocodes:', error);
            ErrorAlert('Failed to fetch promocodes');
        } finally {
            setLoading(false);
        }
    }, [api, UserData?.id, authToken, ErrorAlert]);

    useEffect(() => {
        getPromocodes()
    }, [getPromocodes]);


    const handleClose = () => {
        setShow(false);
        setEditState(false)
        setPromocodeId('')
        setCode("");
        setDescription("");
        setDiscountType("");
        setDiscountValue("");
        setMinimumSpend("");
        setUsageLimit("");
        setUsagePerUser("");
        setStatus();
    }

    //template
    const [editState, setEditState] = useState('')
    const [promocodeId, setPromocodeId] = useState('')


    const handleEdit = useCallback(
        async (id) => {
            const data = promocodes?.find((item) => item?.id === id);

            if (data) {
                setPromocodeId(id);
                setEditState(true);
                setCode(data.code || "");
                setDescription(data.description || "");
                setDiscountType(data.discount_type || "percentage");
                setDiscountValue(data.discount_value || "");
                setMinimumSpend(data.minimum_spend || "");
                setUsageLimit(data.usage_limit || "");
                setUsagePerUser(data.usage_per_user || "");
                setStatus(data.status === 1 ? true : false);
                setShow(true);
            }
        },
        [promocodes] // Dependency array for useCallback
    );
    const handleDelete = useCallback(async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const response = await axios.delete(`${api}promo-destroy/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    }
                });

                if (response.data.status) {
                    await getPromocodes();
                    successAlert('Success', 'Promo code deleted successfully');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            ErrorAlert('Failed to delete promo code');
        }
    }, [api, authToken, getPromocodes, successAlert, ErrorAlert]);

    const HandleSubmit = async (e) => {
        try {
            e.preventDefault();
            const discountData = {
                code,
                description,
                discount_type: discountType,
                discount_value: discountValue,
                minimum_spend: minimumSpend,
                usage_limit: usageLimit,
                usage_per_user: usagePerUser,
                status: status === ('true' || true) ? 1 : 0,
            };
            if (editState) {
                discountData.id = promocodeId;
            }
            let url = editState ? `${api}promo-update` : `${api}promo-store`;
            let method = editState ? 'put' : 'post';
            const response = await axios[method](url, discountData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (response.data.status) {
                getPromocodes()
                handleClose()
                successAlert('success', editState ? 'Promocode updated successfully' : 'Promocode added successfully')
            }
        } catch (error) {
            console.log(error);
        }
    }

    const columns = useMemo(() => [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'code',
            text: 'Code',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'description',
            text: 'Description',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'discount_type',
            text: 'Discount Type',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'discount_value',
            text: 'Discount Value',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'minimum_spend',
            text: 'Minimum Spend',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'usage_limit',
            text: 'Usage Limit',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'remaining_count',
            text: 'Remaining Limit',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'usage_per_user',
            text: 'Usage Per User',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell) => (
                <div className="d-flex justify-content-center">
                    {cell === 1 ? (
                        <span className="badge bg-success">Active</span>
                    ) : (
                        <span className="badge bg-danger">Inactive</span>
                    )}
                </div>
            ),
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => {
                const actions = [
                    {
                        tooltip: "Edit",
                        onClick: () => handleEdit(row.id),
                        variant: "primary",
                        icon: <Edit size={16} />
                    },
                    {
                        tooltip: "Delete",
                        onClick: () => handleDelete(row.id),
                        variant: "danger",
                        icon: <Trash2 size={16} />
                    }
                ];

                return (
                    <div className="d-flex gap-2 justify-content-center">
                        {actions.map((action, index) => (
                            <CustomTooltip key={index} text={action.tooltip}>
                                <Button
                                    variant={action.variant}
                                    className="btn-sm btn-icon rounded"
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
    ], [handleEdit, handleDelete]);
    return (
        <>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title as="h5">{`${editState ? 'Update ' : ' Add New '}`} Promocode</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Code</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Discount Type</Form.Label>
                                    <Form.Select
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value)}
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Discount Value</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Minimum Spend</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={minimumSpend}
                                        onChange={(e) => setMinimumSpend(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Usage Limit</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={usageLimit}
                                        onChange={(e) => setUsageLimit(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Usage Per User</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={usagePerUser}
                                        onChange={(e) => setUsagePerUser(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>

                            <Col lg="6">
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value={true}>Active</option>
                                        <option value={false}>Inactive</option>
                                    </Form.Control>
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

            <Card>
                <Card.Header>
                    <div className='d-flex justify-content-between'>
                        <h4 className="card-title">Promo Codes</h4>
                        <div className='d-flex justify-content-end items'>
                            <Button type="button" className=""
                                onClick={() => handleShow()}
                            ><PlusIcon size={18}/>Add New</Button>
                        </div>
                    </div>
                </Card.Header>
                <Card.Body>
                    <CustomDataTable
                        data={promocodes}
                        columns={columns}
                        loading={loading}
                        keyField="id"
                        searchPlaceholder="Search promocodes..."
                    />
                </Card.Body>
            </Card>
        </>
    )
})

export default Promocode