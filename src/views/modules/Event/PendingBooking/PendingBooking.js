import React, { memo, Fragment, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { Button } from "react-bootstrap";
import { CreditCard } from "lucide-react";
import Swal from "sweetalert2";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import CommonListing from "../CustomUtils/CommonListing";


const PendingBookings = memo(() => {
    const { api, UserData, formatDateTime, authToken, truncateString, ErrorAlert, successAlert } = useMyContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('');

    const GetBookings = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = dateRange ? `?date=${dateRange}` : '';
            const url = `${api}pendding-booking/list/${UserData?.id}${queryParams}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                let data = response.data.bookings;
                const filteredBookings = data.filter(booking =>
                    booking.bookings && Array.isArray(booking.bookings) && booking.bookings.length > 0
                );
                const normalBooking = data.filter(booking => !booking.bookings);
                const allBookings = [...filteredBookings, ...normalBooking];
                allBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setBookings(allBookings);
            }
        } catch (error) {
            ErrorAlert('Failed to fetch bookings')
        } finally {
            setLoading(false);
        }
    }, [api, UserData?.id, dateRange, authToken, ErrorAlert]);


    useEffect(() => {
        if (dateRange?.length > 0) {
            GetBookings();
        }
    }, [dateRange]);

    useEffect(() => {
        GetBookings();
    }, []);

    const HandlePay = useCallback(async (id) => {
        try {
            const booking = bookings?.find(booking => booking?.id === id);
            const session_id = booking?.session_id;

            // Add confirmation dialog
            const { isConfirmed } = await Swal.fire({
                title: 'Confirm Payment',
                text: `Do you want to confirm payment for this booking?`,
                icon: 'warning',
                confirmButtonText: 'Yes, confirm it!',
                showCancelButton: true
            });

            if (!isConfirmed) {
                return;
            }

            const response = await axios.post(`${api}booking-confirm/${session_id}`, '', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                await GetBookings();
                successAlert('Success', 'Booking confirmed successfully.')
            } else {
                ErrorAlert(response.data.message || 'Something went wrong.')
            }
        } catch (error) {
            ErrorAlert('Failed to confirm booking')
        }
    }, [bookings, api, authToken, GetBookings, ErrorAlert, successAlert]);

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
            dataField: 'user.name',
            text: 'User Name',
            formatter: (cell, row) => row?.bookings?.[0]?.user?.name || row?.user?.name || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: null,
            text: 'Transaction Id',
            formatter: (cell, row) => row?.bookings?.[0]?.payment_id || row?.payment_id || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: null,
            text: 'Gateway',
            formatter: (cell, row) => row?.bookings?.[0]?.gateway || row?.gateway || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'payment_method',
            text: 'Mode',
            formatter: (cell, row) =>  row?.bookings?.[0]?.payment_log?.mode || row?.payment_log?.mode ||row?.payment_method || "",
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'payment_status',
            text: 'Status',
            formatter: (cell, row) => {
                // const status = JSON.stringify(row) || '';
                const status = row?.bookings?.[0]?.payment_log?.status || row?.payment_log?.status || row?.payment_status || "";
                return status 
            },
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'created_at',
            text: 'Purchase Date',
            formatter: (cell) => formatDateTime(cell),
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'event_name',
            text: 'Event Name',
            formatter: (cell, row) => {
                const eventName = row?.bookings?.[0]?.event_name || row?.event_name || "";
                return <p title={eventName}>{truncateString(eventName)}</p>;
            },
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => (
                <div className="d-flex gap-2 justify-content-center">
                    <CustomTooltip text="Pay Now">
                        <Button
                            variant="success"
                            className="btn-sm btn-icon"
                            onClick={() => HandlePay(row.id)}
                        >
                            <CreditCard size={16} />
                        </Button>
                    </CustomTooltip>
                </div>
            ),
            headerAlign: 'center',
            align: 'center'
        },
        {
            dataField: 'number',
            text: 'Number',
            formatter: (cell, row) => row?.bookings?.[0]?.number || row?.number || "",
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
            dataField: 'amount',
            text: 'Total',
            formatter: (cell, row) => `₹${(row?.bookings && row?.bookings[0]?.amount) || row?.amount || 0}`,
            headerAlign: 'center',
            align: 'center',
            sort: true
        }
    ], [HandlePay, formatDateTime, truncateString]);

    return (
        <Fragment>
            <CommonListing
                tile={'Pending Bookings'}
                bookings={bookings}
                dateRange={dateRange}
                loading={loading}
                columns={columns}
                setDateRange={setDateRange}
                exportPermisson={'Export POS Bookings'}
                bookingLink={'/'}
                ButtonLable={'New Booking'}
            />
        </Fragment>
    );
});

PendingBookings.displayName = "PendingBookings";
export default PendingBookings;
