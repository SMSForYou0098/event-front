import React, { memo, Fragment, useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { downloadTickets } from "../../../../Context/ticketDownloadUtils";
import TicketModal from "../TicketModal/TicketModal";
import CommonListing from "../CustomUtils/CommonListing";
import { Send, Ticket, CheckCircle, XCircle, CircleCheckBig, FileIcon, FileText } from 'lucide-react';
import { Button, Col } from 'react-bootstrap';
import { CustomTooltip } from "../CustomUtils/CustomTooltip";

const AgentBooking = memo(({ isSponser = false, isAccreditation = false }) => {
    const { api, UserData, formatDateTime, sendTickets, authToken, truncateString, isMobile, formatDateRange, convertTo12HourFormat, userRole } = useMyContext();

    const [bookings, setBookings] = useState([]);
    const [dateRange, setDateRange] = useState('');
    const getUrl = useCallback(() => {
        if (isSponser) {
            return `${api}sponsor/list/${UserData?.id}`;
        } else if (isAccreditation) {
            return `${api}accreditation/list/${UserData?.id}`;
        } else {
            return `${api}agents/list/${UserData?.id}`;
        }
    }, [api, UserData, isSponser, isAccreditation]);

    const GetBookings = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = dateRange ? `?date=${dateRange}` : '';
            const url = getUrl() + queryParams;
            const res = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const data = res.data.bookings;

                const filteredBookings = data.filter(booking =>
                    booking.bookings && Array.isArray(booking.bookings) && booking.bookings.length > 0
                );
                const normalBooking = data.filter(booking => !booking.bookings)
                const allBookings = [...filteredBookings, ...normalBooking];
                allBookings.sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return dateB.getTime() - dateA.getTime();
                });
                setBookings(allBookings);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [dateRange, api, UserData, authToken, setBookings, isAccreditation, isSponser, getUrl]);

    useEffect(() => {
        GetBookings();
    }, [dateRange, GetBookings, isAccreditation, isSponser]);
    useEffect(() => {
        GetBookings();
    }, [GetBookings]);

    const columns = [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'event_name',
            text: 'Event',
            formatter: (cell, row) => {
                const eventName = row?.bookings?.[0]?.ticket?.event?.name || row?.ticket?.event?.name || "";
                return <p title={eventName}>{truncateString(eventName)}</p>;
            },
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        ...(userRole === 'Organizor' || userRole === 'Admin' ? [{
            dataField: 'agent_name',
            text: 'Agent',
            formatter: (cell, row) => row?.bookings?.[0]?.agent_name || row?.agent_name || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        }] : []),
        ...(isAccreditation ? [
            {
                dataField: 'access_area_names',
                text: 'Access Area',
                formatter: (cell, row) => {
                    const accessArea = row?.access_area_names
                    return (
                        <Col xs={12} className="d-flex flex-wrap justify-content-center gap-1">
                            {accessArea?.map((item, index) => (
                                <span
                                    key={index}
                                    className="badge rounded-pill text-dark px-2 py-1 fs-7 shadow-sm d-flex align-items-center"
                                    style={{ fontWeight: 500, letterSpacing: 0.5, fontSize: '0.85rem' }}
                                >
                                    <CircleCheckBig size={14} className="me-1" color="limegreen" />
                                    {item}
                                </span>
                            ))}
                        </Col>
                    )
                },
                align: 'center',
                sort: true
            },
            {
                dataField: 'user.photo',
                text: "Image",
                formatter: (cell) => {
                    const photo = cell
                    if (photo) {
                        return (
                            <img
                                src={photo}
                                alt="User Query"
                                loading="lazy"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open(photo, '_blank')}
                            />
                        );
                    }
                    return <span className="text-muted">No Image</span>;
                },
                sort: true,
            },
            {
                dataField: 'user.doc',
                text: "Document",
                formatter: (cell) => {
                    const doc = cell;
                    if (!doc) {
                        return <span className="text-muted">No Document</span>;
                    }

                    const lowerDoc = doc.toLowerCase();
                    const isImage = lowerDoc.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/);

                    if (isImage) {
                        return (
                            <img
                                src={doc}
                                alt="User Document"
                                loading="lazy"
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                }}
                                onClick={() => window.open(doc, '_blank')}
                            />
                        );
                    }

                    let icon = <FileIcon size={28} className="text-secondary" />;
                    if (lowerDoc.endsWith('.pdf')) {
                        icon = <FileText size={28} className="text-danger" />;
                    } else if (lowerDoc.match(/\.(doc|docx)$/)) {
                        icon = <FileText size={28} className="text-primary" />;
                    }

                    return (
                        <span
                            style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                            onClick={() => window.open(doc, '_blank')}
                            title="Click to preview"
                        >
                            {icon}
                        </span>
                    );
                },
                sort: true,
            },
            {
                dataField: 'user.designation',
                text: 'Designation',
                formatter: (cell, row) => {
                    return row?.bookings?.[0]?.user?.designation || row?.user?.designation || "N/A";
                },
                headerAlign: 'center',
                align: 'center',
                sort: true
            },
            {
                dataField: 'user.company_name',
                text: 'Company Name',
                formatter: (cell, row) => {
                    return row?.bookings?.[0]?.user?.company_name || row?.user?.company_name || "N/A";
                },
                headerAlign: 'center',
                align: 'center',
                sort: true
            },
        ] : []),
        {
            dataField: 'user.name',
            text: 'User',
            formatter: (cell, row) => row?.bookings?.[0]?.user?.name || row?.user?.name || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'number',
            text: 'Number',
            formatter: (cell, row) => row?.bookings?.[0]?.user?.number || row?.user?.number || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'ticket.name',
            text: 'Ticket',
            formatter: (cell, row) => row?.bookings?.[0]?.ticket?.name || row?.ticket?.name || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        ...(!isAccreditation ? [
            {
                dataField: 'quantity',
                text: 'Qty',
                formatter: (cell, row) => row?.bookings?.length || 1,
                headerAlign: 'center',
                align: 'center',
                sort: true
            },
            {
                dataField: 'base_amount',
                text: 'B Amt',
                formatter: (cell, row) => `₹${(row?.bookings && row?.bookings[0]?.base_amount) || row?.base_amount || 0}`,
                headerAlign: 'center',
                align: 'center',
                sort: true
            },
            {
                dataField: 'discount',
                text: 'Disc',
                formatter: (cell, row) => `₹${row?.discount || (row?.bookings && row?.bookings[0]?.discount) || 0}`,
                headerAlign: 'center',
                align: 'center',
                sort: true
            },
            {
                dataField: 'amount',
                text: 'Total',
                formatter: (cell, row) => `₹${(row?.bookings && row?.bookings[0]?.amount) || row?.amount || 0}`,
                headerAlign: 'center',
                align: 'center',
                sort: true
            },
            {
                dataField: 'payment_method',
                text: 'Mode',
                formatter: (cell, row) => (row?.bookings && row?.bookings[0]?.payment_method) || row?.payment_method || 0,
                headerAlign: 'center',
                align: 'center',
                sort: true
            }] : []),
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => {
                const isDisabled = row?.is_deleted === true || (row?.bookings && row?.bookings[0]?.status) === "1";
                const actions = [
                    {
                        tooltip: "Resend Ticket",
                        onClick: () => HandleSendTicket(row.id),
                        variant: "success",
                        icon: <Send size={16} />,
                        disabled: isDisabled
                    },
                    {
                        tooltip: "Generate Ticket",
                        onClick: () => GenerateTicket(row.id),
                        variant: "danger",
                        icon: <Ticket size={16} />,
                        disabled: isDisabled
                    },
                    {
                        tooltip: row?.is_deleted ? "Enable Ticket" : "Disable Ticket",
                        onClick: () => DeleteBooking(row.id),
                        variant: row?.is_deleted ? "success" : "danger",
                        icon: row?.is_deleted ? <CheckCircle size={16} /> : <XCircle size={16} />,
                        disabled: false
                    }
                ];

                return (
                    <div className="d-flex gap-2 justify-content-center">
                        {actions.map((action, index) => (
                            <CustomTooltip key={index} text={action.tooltip}>
                                <Button
                                    variant={action.variant}
                                    className="btn-sm btn-icon"
                                    onClick={action.onClick}
                                    disabled={action.disabled}
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
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell, row) => {
                const status = row.status || (row.bookings && row.bookings[0]?.status);
                return (
                    <span className={`badge p-2 ${status === "0" ? "bg-warning" : "bg-success"}`}>
                        {status === "0" ? "Uncheck" : "Checked"}
                    </span>
                );
            },
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'created_at',
            text: 'Booking Date',
            formatter: (cell) => formatDateTime(cell),
            headerAlign: 'center',
            align: 'center',
            sort: true
        }
    ];

    const HandleSendTicket = useCallback(async (id) => {
        let data = bookings?.find((item) => item?.id === id);
        sendTickets(data, "old", true, "Booking Confirmation");
    },
        [bookings, sendTickets]
    );
    const DeleteBooking = useCallback(async (id) => {
        let data = bookings?.find((item) => item?.id === id);
        if (!data) return;
        const sponserEndpoint = data.is_deleted
            ? `${api}sponsor-restore-booking/${data?.token || data?.order_id}`
            : `${api}sponsor-delete-booking/${data?.token || data?.order_id}`;
        const accreditation = data.is_deleted
            ? `${api}accreditation-restore-booking/${data?.token || data?.order_id}`
            : `${api}accreditation-delete-booking/${data?.token || data?.order_id}`;
        const endpoint = data.is_deleted
            ? `${api}agent-restore-booking/${data?.token || data?.order_id}`
            : `${api}agent-delete-booking/${data?.token || data?.order_id}`;
        const request = data.is_deleted ? axios.get : axios.delete;
        const url = isAccreditation ? accreditation : (isSponser ? sponserEndpoint : endpoint);
        try {
            const res = await request(url, {
                headers: {
                    Authorization: "Bearer " + authToken,
                },
            });

            if (res.data.status) {
                GetBookings();
                Swal.fire({
                    icon: "success",
                    title: data.is_deleted ? "Ticket Enabled!" : "Ticket Disabled!",
                    text: `Ticket ${data.is_deleted ? "enabled" : "disabled"} successfully.`,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }, [bookings, api, authToken, GetBookings]);

    const [ticketData, setTicketData] = useState([]);
    const [ticketType, setTicketType] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const ticketRefs = useRef([]);


    const downloadTicket = () => {
        downloadTickets(ticketRefs, ticketType?.type, setLoading);
    }
    const showMultiAlert = useCallback(() => {
        Swal.fire({
            title: 'Select an Option',
            text: 'Would you like to combine the tickets or keep them individual?',
            icon: 'question',
            showCancelButton: true,
            showDenyButton: true,
            showCloseButton: true,
            confirmButtonText: 'Combine',
            denyButtonText: 'Individual',
            cancelButtonText: 'Zip', // Zip is now last
            allowOutsideClick: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setTicketType({ type: 'combine' });
                setShow(true);
            } else if (result.isDenied) {
                setTicketType({ type: 'individual' });
                setShow(true);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                setTicketType({ type: 'zip' });
                setShow(true);
            }
        });
    }, [setTicketType, setShow]);

    const showSingleAlert = useCallback(() => {
        Swal.fire({
            title: 'Select an Option',
            text: 'Would you like to combine the tickets?',
            icon: 'question',
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Combine',
        }).then((result) => {
            if (result.isConfirmed) {
                setTicketType({ type: 'combine' });
                setShow(true);
            }
        });
    }, [setTicketType, setShow]);

    const GenerateTicket = useCallback((id) => {
        let data = bookings?.find((item) => item?.id === id);
        setTicketData(data);
        data?.bookings?.length > 0 ? showMultiAlert() : showSingleAlert();
    }, [bookings, setTicketData, showMultiAlert, showSingleAlert]);

    function handleCloseModal() {
        setTicketData([])
        setTicketType()
        setShow(false)
    }

    return (
        <Fragment>
            <TicketModal
                show={show}
                handleCloseModal={handleCloseModal}
                ticketType={ticketType}
                ticketData={ticketData}
                ticketRefs={ticketRefs}
                loading={loading}
                isAccreditation={isAccreditation}
                showTicketDetails={isAccreditation}
                downloadTicket={downloadTicket}
                isMobile={isMobile}
                formatDateRange={formatDateRange}
                convertTo12HourFormat={convertTo12HourFormat}
            />
            <CommonListing
                tile={`${isAccreditation ? 'Accreditation' : isSponser ? "Sponsor" : "Agent"}`}
                bookings={bookings}
                dateRange={dateRange}
                exportPermisson={'Export Agent Bookings'}
                loading={loading}
                columns={columns}
                setDateRange={setDateRange}
                bookingLink={`new`}
                ButtonLable={'New Booking'}
                ignoredColumnsProp={['Image', 'Document']}
            />
        </Fragment>
    );
});

AgentBooking.displayName = "AgentBooking";
export default AgentBooking;
