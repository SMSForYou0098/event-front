import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Form, Row, Spinner, Table } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import useDataTable from '../../../../../components/hooks/useDatatable';
import AddFields from './AddFields';
import DraggableList from 'react-draggable-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { DleteIcon, EditIcon } from '../../CustomHooks/CustomIcon';
import Swal from 'sweetalert2';

const AttendeeFields = () => {
    const { api, authToken, ErrorAlert } = useMyContext();

    const [pageList, setPageList] = useState();
    const [editData, setEditData] = useState();
    const [editState, setEditState] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const columns = [
        { data: "title", title: "Label" },
        {
            data: null,
            orderable: false,
            searchable: false,
            title: "Action",
            render: function (data) {
                return `<div class="flex align-items-center list-user-action">
                                  <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Print" data-id=${data?.id} data-method="Edit" data-table="action">
                                     <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M11.4925 2.78906H7.75349C4.67849 2.78906 2.75049 4.96606 2.75049 8.04806V16.3621C2.75049 19.4441 4.66949 21.6211 7.75349 21.6211H16.5775C19.6625 21.6211 21.5815 19.4441 21.5815 16.3621V12.3341" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.82812 10.921L16.3011 3.44799C17.2321 2.51799 18.7411 2.51799 19.6721 3.44799L20.8891 4.66499C21.8201 5.59599 21.8201 7.10599 20.8891 8.03599L13.3801 15.545C12.9731 15.952 12.4211 16.181 11.8451 16.181H8.09912L8.19312 12.401C8.20712 11.845 8.43412 11.315 8.82812 10.921Z" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M15.1655 4.60254L19.7315 9.16854" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                                  </button>
                                  <button class="btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete" data-id=${data?.id} data-method="Delete" data-table="action">
                                     <svg fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" width="20" height="32" viewBox="0 0 24 24"><path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path><path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" stroke-linecap="round" strokeLinejoin="round"></path></svg>
                                  </button>
                                  </div>
                              `;
            },
        },
    ];
    const tableRef = useRef(null);
    useDataTable({
        tableRef: tableRef,
        columns: columns,
        data: pageList,
        actionCallback: (data) => {
            switch (data.method) {
                case "Edit":
                    handleEdit(data?.id);
                    break;
                case "Delete":
                    HandleDelete(data?.id);
                    break;
                default:
                    break;
            }
        },
        // isFooter: true,
    });

    const handleEdit = async (data) => {
        setEditData(data)
        setEditState(true)
        setShow(true)
    }


    ///sms config
    const GetPages = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${api}fields-list`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const data = res.data.customFields;
                setPageList(data)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        GetPages()
    }, []);





    const [show, setShow] = useState();
    const containerRef = useRef(null)


    const DraggableListItem = ({ item, itemSelected, dragHandleProps, index }) => {
        const { onMouseDown, onTouchStart } = dragHandleProps;

        return (
            <div
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                className="w-100 custom-dotted-border rounded-3"
            >
                <div className="d-flex align-items-center w-100 py-1" style={{ minHeight: '40px' }}>
                    {/* Grip Column - 5% */}
                    <div className="ps-3" style={{ width: '5%' }}>
                        <FontAwesomeIcon
                            icon={faGripVertical}
                            className="text-secondary"
                            style={{ cursor: 'grab' }}
                        />
                    </div>

                    {/* Field Name Column - 40% */}
                    <div style={{ width: '40%' }} className="px-2 text-capitalize">
                        {item.field_name}
                    </div>

                    {/* Field Type Column - 40% */}
                    <div style={{ width: '40%' }} className="px-2 text-capitalize text-capitalize">
                        {item.field_type}
                    </div>
                    {/* Action Column - 15% */}
                    {item?.fixed !== 1 &&
                        <div style={{ width: '15%' }} className="pe-3 d-flex justify-content-end gap-3">
                            <button
                                className="btn btn-link p-0"
                                onClick={() => handleEdit(item)}
                            >
                                <EditIcon />
                            </button>
                            <button
                                className="btn btn-link p-0"
                                onClick={() => HandleDelete(item?.id)}
                            >
                                <DleteIcon />
                            </button>
                        </div>
                    }
                </div>
                <div className="border-bottom w-100"></div>
            </div>
        );
    };



    const HandleRearrange = async (data) => {
        try {
            let url = `${api}rearrange-CustomField`;
            try {
                const response = await axios.post(url, { data }, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });
                if (response.data.status) {
                    Swal.fire('Success!', 'Menu Items Rearranged', 'success');
                }
            } catch (error) {
                Swal.fire('Error!', 'An error occurred while deleting the group.', 'error');
            }
        } catch (error) {

        }
    }

    const onListChange = (newList) => {
        setPageList(newList)
        const updatedList = newList.map((item, index) => ({
            id: item.id,
            sr_no: index + 1
        }));
        HandleRearrange(updatedList)
    };


    const HandleDelete = async (fieldId) => {
        try {

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                const apiUrl = `${api}field-delete/${fieldId}`;
                const response = await axios.delete(apiUrl, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                });

                if (response.data.status) {
                    Swal.fire('Deleted!', 'The field has been deleted.', 'success');
                    setPageList((prevList) => prevList.filter(item => item?.id !== fieldId));
                } else {
                    console.error("Error deleting field:", response?.data?.message);
                    ErrorAlert("Error deleting field.");
                }
            }
        } catch (error) {
            console.error("Error:", error.response?.data?.message || error.message);
            ErrorAlert(error.response?.data?.message || "An error occurred while deleting the field.");
        }
    };

    return (
        <Row>

            <AddFields
                show={show}
                setEditState={setEditState}
                setShow={setShow}
                editData={editData}
                editState={editState}
                GetPages={GetPages}
            />
            <Col lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                            <h4 className="card-title">Attendee Fields</h4>
                        </div>
                        <div className="button">
                            <h4 className="card-title">
                                <Button className="me-4 hvr-curl-top-right border-0" onClick={() => setShow(true)}>
                                    Add New Field
                                </Button>
                            </h4>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {/* Header */}
                        <div className="d-flex align-items-center w-100 py-3">
                            {/* Grip Column - 5% */}
                            <div className="ps-3" style={{ width: '5%' }}></div>

                            {/* Field Name Column - 40% */}
                            <div style={{ width: '40%' }} className="px-2 fw-bold text-black">
                                Field Name
                            </div>

                            {/* Field Type Column - 40% */}
                            <div style={{ width: '40%' }} className="px-2 fw-bold text-black">
                                Field Type
                            </div>

                            {/* Action Column - 15% */}
                            <div style={{ width: '15%' }} className="pe-3 text-end fw-bold text-black">
                                Action
                            </div>
                        </div>
                        <div className="overflow-auto" style={{ maxHeight: '40rem' }}>
                            {
                                isLoading ?
                                    <div className="text-center text-primary">
                                        <Spinner animation="grow" role="secondary">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                    :
                                    pageList && pageList.length > 0 ? (
                                        <DraggableList
                                            itemKey="id"
                                            template={DraggableListItem}
                                            list={pageList}
                                            onMoveEnd={onListChange}
                                            container={() => containerRef.current}
                                        />
                                    ) : (
                                        <div className="p-4 text-center text-muted">
                                            No items to display
                                        </div>
                                    )}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default AttendeeFields