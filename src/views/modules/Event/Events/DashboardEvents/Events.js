import React, { memo, Fragment, useState, useEffect } from "react";
import { Button, Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import Swal from "sweetalert2";
import { Eye, PenSquare, Ticket, Trash2 } from "lucide-react";
import { CustomTooltip } from "../../CustomUtils/CustomTooltip";
import CommonListing from "../../CustomUtils/CommonListing";
import { GiGate } from "react-icons/gi";
import EventGates from "./EventGates";
import { BsThreeDotsVertical } from "react-icons/bs";
const Events = memo(() => {
    const { api, formatDateTime, UserData, authToken, UserPermissions } = useMyContext();
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [modalId, setModalId] = useState(false);
    const [isAreaModal, setIsAreaModal] = useState(false);

    const GetEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${api}event-list/${UserData?.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                setEvents(res.data.events);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };
    const getStatusBadge = (status) => {
        let badgeClass = '';
        let badgeText = '';
        switch (status) {
            case 1:
                badgeClass = 'bg-success';
                badgeText = 'Ongoing';
                break;
            case 2:
                badgeClass = 'bg-info';
                badgeText = 'Upcoming';
                break;
            case 3:
                badgeClass = 'bg-warning';
                badgeText = 'Finished';
                break;
            default:
                badgeClass = 'bg-secondary';
                badgeText = 'Unknown';
        }
        return <span className={`badge p-1 ${badgeClass}`}>{badgeText}</span>;
    };
    useEffect(() => {
        GetEvents()
    }, [])

    const formatDateRange = (dateRange) => {
        if (!dateRange) return '';

        const dates = dateRange.split(',');
        if (dates.length !== 2) return dateRange; // Fallback if the format is unexpected

        const [startDate, endDate] = dates;
        return `${startDate} to ${endDate}`;
    };

    const HandleGateModal = (id,isAreaModal) => {
        setIsAreaModal(isAreaModal);
        setModalId(id);
        setShow(true);
        // Optionally, fetch gates for this event from backend here
    };

    const HandleDelete = async (id) => {
        if (id) {
            const { isConfirmed } = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!'
            });

            if (isConfirmed) {
                await axios.delete(`${api}delete-event/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                }).then((res) => {
                    if (res.data.status) {
                        GetEvents();
                        Swal.fire(
                            'Deleted!',
                            'Your event has been deleted.',
                            'success'
                        );
                    }
                }).catch((err) => {
                    // console.log(err);
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the event.',
                        'error'
                    );
                });
            }
        }
    }
    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            headerAlign: 'center',
            sort: true
        },
        {
            dataField: 'category.title',
            text: 'Category',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'user.name',
            text: 'Organizer',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'date_range',
            text: 'Event Dates',
            formatter: formatDateRange,
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'event_type',
            text: 'Ticket Type',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'event_status',
            text: 'Status',
            formatter: getStatusBadge,
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'created_at',
            text: 'Created At',
            formatter: formatDateTime,
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
                        tooltip: "View Event",
                        to: `/events/${row?.city}/${row?.user?.name}/${(row?.name)?.replace(/\s+/g, '-')}/${row.event_key}`,
                        variant: "success",
                        icon: <Eye size={16} />,
                        external: true,
                        permission: null
                    },
                    {
                        tooltip: "Edit Event",
                        to: `edit/${row?.event_key}`,
                        variant: "warning",
                        icon: <PenSquare size={16} />,
                        permission: "Edit Event"
                    },
                    {
                        tooltip: "Manage Tickets",
                        to: `ticket/${row?.id}/${row?.name}`,
                        variant: "secondary",
                        icon: <Ticket size={16} />,
                        permission: null
                    },
                    {
                        tooltip: "More Actions",
                        isButton: true,
                        variant: "secondary",
                        icon: <BsThreeDotsVertical size={16} />,
                        render: (row) => (
                            <OverlayTrigger
                                trigger="click"
                                placement="bottom"
                                rootClose
                                overlay={
                                    <Popover id={`popover-${row?.id}`}>
                                        <Popover.Body className="p-2">
                                            <Button
                                                variant="link"
                                                style={{ padding: "4px 0", width: "100%", textAlign: "left" }}
                                                onClick={() => HandleGateModal(row?.id)}
                                            >
                                                Manage Gates
                                            </Button>
                                            <Button
                                                variant="link"
                                                style={{ padding: "4px 0", width: "100%", textAlign: "left" }}
                                                onClick={() => HandleGateModal(row?.id, true)}
                                            >
                                                Manage Access Areas
                                            </Button>
                                        </Popover.Body>
                                    </Popover>
                                }
                            >
                                <Button
                                    variant="primary"
                                    className="btn-sm btn-icon"
                                    style={{ padding: 0, border: "none" }}
                                >
                                    <BsThreeDotsVertical size={16} />
                                </Button>
                            </OverlayTrigger>
                        ),
                        permission: null
                    },
                    {
                        tooltip: "Delete Event",
                        onClick: () => HandleDelete(row?.id),
                        variant: "danger",
                        icon: <Trash2 size={16} />,
                        isButton: true,
                        permission: "Edit Event"
                    }
                ];
                return (
                    <div className="d-flex gap-2 justify-content-center">
                        {actions.map((action, index) => {
                            // Check if action requires permission and if user has it
                            if (action.permission && !UserPermissions?.includes(action.permission)) {
                                return null;
                            }
                            if (action.render) {
                                return (
                                    <CustomTooltip key={index} text={action.tooltip}>
                                        {action.render(row)}
                                    </CustomTooltip>
                                );
                            }
                            return action.isButton ? (
                                <CustomTooltip key={index} text={action.tooltip}>
                                    <Button
                                        variant={action.variant}
                                        className="btn-sm btn-icon"
                                        onClick={action.onClick}
                                    >
                                        {action.icon}
                                    </Button>
                                </CustomTooltip>
                            ) : (
                                <CustomTooltip key={index} text={action.tooltip}>
                                    <Link to={action.to} target={action.external ? "_blank" : "_self"}>
                                        <Button variant={action.variant} className="btn-sm btn-icon">
                                            {action.icon}
                                        </Button>
                                    </Link>
                                </CustomTooltip>
                            );
                        })}
                    </div>
                );
            },
            headerAlign: 'center',
            align: 'center'
        }
    ];
    return (
        <Fragment>
            <EventGates
                show={show}
                isAreaModal={isAreaModal}
                id={modalId}
                setShow={setShow}
                setModalId={setModalId}
            />
            <CommonListing
                tile={'Events'}
                bookings={events}
                loading={loading}
                columns={columns}
                searchPlaceholder={'Search Events'}
                exportPermisson={'Export Events'}
                ButtonLable={'Create Event'}
                ShowReportCard={false}
                bookingLink={"new"}
            />
        </Fragment>
    );
});

Events.displayName = "Events";
export default Events;
