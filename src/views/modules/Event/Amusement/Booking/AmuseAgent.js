import React, { memo, Fragment, useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import TicketModal from "../../TicketModal/TicketModal";
import CommonListing from "../../CustomUtils/CommonListing";
import { CheckCircle, Send, Ticket, XCircle } from "lucide-react";
import { CustomTooltip } from "../../CustomUtils/CustomTooltip";


const AmuseAgent = memo(() => {
    const { api, UserData, formatDateTime, sendTickets, authToken, truncateString, formatDateRange, userRole } = useMyContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('');

    const GetBookings = useCallback(async () => {
        const queryParams = dateRange ? `?date=${dateRange}` : '';
        const url = `${api}amusement-agents-bookings/${UserData?.id}${queryParams}`;
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                let data = res.data.bookings;
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
        }).catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [api, UserData, dateRange, authToken, setBookings]);


    useEffect(() => {
        if (dateRange?.length > 0) {
            GetBookings();
        }
    }, [dateRange]);

    useEffect(() => {
        GetBookings();
    }, []);

    const HandleSendTicket = useCallback((id) => {
        const data = bookings?.find((item) => item?.id === id);
        if (data) {
            sendTickets(data, "old",true,"Amusement Booking");
        }
    }, [bookings, sendTickets]);

    const DeleteBooking = useCallback(async (id) => {
        let data = bookings?.find((item) => item?.id === id);
        if (data?.is_deleted === true) {
            await axios
                .get(`${api}restore-booking/${data?.token || data?.order_id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                })
                .then((res) => {
                    if (res.data.status) {
                        GetBookings();
                        Swal.fire({
                            icon: "success",
                            title: "Ticket Enabled!",
                            text: "Ticket enabled succesfully.",
                        });
                    }
                })
                .catch((err) => console.log(err));
        } else {
            await axios
                .delete(`${api}delete-booking/${data?.token || data?.order_id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                })
                .then((res) => {
                    if (res.data.status) {
                        GetBookings();
                        Swal.fire({
                            icon: "success",
                            title: "Ticket Disabled!",
                            text: "Ticket disabled succesfully.",
                        });
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [bookings, authToken, api, GetBookings]);

    const [ticketData, setTicketData] = useState([]);
    const [ticketType, setTicketType] = useState();
    const [show, setShow] = useState(false);


    const showMultiAlert = useCallback(() => {
        Swal.fire({
            title: 'Select an Option',
            text: 'Would you like to combine the tickets or keep them individual?',
            icon: 'question',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: 'Combine',
            cancelButtonText: 'Individual',
            allowOutsideClick: true,
        }).then((result) => {
            if (result.isConfirmed) {
                setTicketType({ type: 'combine' });
                setShow(true);
            } else if (result.isDismissed && result.dismiss !== Swal.DismissReason.cancel) {
                return;
            } else {
                setTicketType({ type: 'individual' });
                setShow(true);
            }
        });
    }, []);

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
    }, []);

    const GenerateTicket = useCallback((id) => {
        const data = bookings?.find((item) => item?.id === id);
        if (data) {
            setTicketData(data);
            data?.bookings?.length > 0 ? showMultiAlert() : showSingleAlert();
        }
    }, [bookings, setTicketData, showMultiAlert, showSingleAlert]);

    function handleCloseModal() {
        setTicketData([])
        setTicketType()
        setShow(false)
    }
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
        },
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

    return (
        <Fragment>
            <TicketModal
                show={show}
                showTicketDetails={true}
                handleCloseModal={handleCloseModal}
                ticketType={ticketType}
                ticketData={ticketData}
                formatDateRange={formatDateRange}
            />
            <CommonListing
                tile={'Agent'}
                bookings={bookings}
                dateRange={dateRange}
                exportPermisson={'Export Agent Bookings'}
                loading={loading}
                columns={columns}
                setDateRange={setDateRange}
                bookingLink={"/dashboard/agent-bookings/new"}
                ButtonLable={'New Booking'}
            />
        </Fragment>
    );
});

AmuseAgent.displayName = "AmuseAgent";
export default AmuseAgent;
