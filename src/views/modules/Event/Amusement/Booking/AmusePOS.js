import React, { memo, Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import CommonListing from "../../CustomUtils/CommonListing";
import { CheckCircle, Printer, XCircle } from "lucide-react";
import { CustomTooltip } from "../../CustomUtils/CustomTooltip";
import POSPrintModal from "../../POS/POSPrintModal";


const AmusePOS = memo(() => {
    const { api, UserData, formatDateTime, authToken, ErrorAlert, formatDateRange } = useMyContext();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('');
    const [bookingData, setBookingData] = useState([])
    const [showPrintModel, setShowPrintModel] = useState(false);
    const closePrintModel = () => {
        setShowPrintModel(false)
    }
    const GetBookings = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = dateRange ? `?date=${dateRange}` : '';
            const url = `${api}amusement-pos-bookings/${UserData?.id}${queryParams}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                setBookings(response.data.bookings);
            }else{
                setBookings([]);
            }
        } catch (error) {
            ErrorAlert('Failed to fetch bookings');
        } finally {
           
            setLoading(false);
        }
    }, [api, UserData?.id, dateRange, authToken]);


    useEffect(() => {
        if (dateRange?.length > 0) {
            GetBookings();
        }
    }, [dateRange]);

    useEffect(() => {
        GetBookings();
    }, []);

    const handleDeleteBooking = useCallback(async (id) => {
        let data = bookings?.find((item) => item?.id === id)
        if (data?.is_deleted === true) {
            await axios.get(`${api}amusement-restore-pos-booking/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            })
                .then((res) => {
                    if (res.data.status) {
                        GetBookings()
                        Swal.fire({
                            icon: "success",
                            title: "Ticket Enabled!",
                            text: "Ticket enabled succesfully.",
                        });
                    }
                }).catch((err) =>
                    console.log(err)
                )
        } else {
            await axios.delete(`${api}amusement-delete-pos-booking/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            }).then((res) => {
                if (res.data.status) {
                    GetBookings()
                    Swal.fire({
                        icon: "success",
                        title: "Ticket Disabled!",
                        text: "Ticket disabled succesfully.",
                    });
                }
            }).catch((err) =>
                console.log(err)
            )
        }
    }, [api, authToken, bookings, GetBookings]);

    const handleFetchBooking = useCallback((id) => {
        const data = bookings?.find((item) => item?.id === id);
        setBookingData(data);
        setShowPrintModel(true);
    }, [bookings]);
    const columns = useMemo(() => {
        const commonProps = {
            headerAlign: 'center',
            align: 'center',
            sort: true
        };
        return [
            {
                dataField: 'id',
                text: '#',
                formatter: (cell, row, rowIndex) => rowIndex + 1,
                ...commonProps
            },
            {
                dataField: 'ticket.event.name',
                text: 'Event',
                ...commonProps
            },
            {
                dataField: 'ticket.event.date_range',
                text: 'Event Dates',
                formatter: (cell) => formatDateRange(cell),
                ...commonProps
            },
            {
                dataField: 'user_name',
                text: 'POS User',
                ...commonProps
            },
            {
                dataField: 'reporting_user_name',
                text: 'Organizer',
                ...commonProps
            },
            {
                dataField: 'ticket.name',
                text: 'Ticket',
                ...commonProps
            },
            {
                dataField: 'quantity',
                text: 'Quantity',
                ...commonProps
            },
            {
                dataField: 'discount',
                text: 'Discount',
                formatter: (cell) => <span className="text-danger">₹{cell}</span>,
                ...commonProps
            },
            {
                dataField: 'amount',
                text: 'Amount',
                formatter: (cell) => `₹${cell}`,
                ...commonProps
            },
            {
                dataField: 'status',
                text: 'Status',
                formatter: (cell) => (
                    <span className={`badge p-2 ${cell === "0" ? "bg-warning" : "bg-success"}`}>
                        {cell === "0" ? "Uncheck" : "Checked"}
                    </span>
                ),
                ...commonProps
            },
            {
                dataField: "action",
                text: "Action",
                formatter: (cell, row) => {
                    const isDisabled = row?.is_deleted === true || row?.status === "1";

                    const actions = [
                        {
                            tooltip: "Print Ticket",
                            onClick: () => handleFetchBooking(row.id),
                            variant: "success",
                            icon: <Printer size={16} />,
                            disabled: isDisabled,
                        },
                        {
                            tooltip: row?.is_deleted ? "Enable Ticket" : "Disable Ticket",
                            onClick: () => handleDeleteBooking(row.id),
                            variant: row?.is_deleted ? "success" : "danger",
                            icon: row?.is_deleted ? <CheckCircle size={16} /> : <XCircle size={16} />,
                            disabled: false,
                        },
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
                ...commonProps
            },
            {
                dataField: 'created_at',
                text: 'Purchase Date',
                formatter: (cell) => formatDateTime(cell),
                ...commonProps
            },
            {
                dataField: 'name',
                text: 'Customer',
                ...commonProps
            },
            {
                dataField: 'number',
                text: 'Contact',
                ...commonProps
            }
        ];
    }, [handleFetchBooking, handleDeleteBooking]);

    return (
        <Fragment>
            <POSPrintModal
                showPrintModel={showPrintModel}
                closePrintModel={closePrintModel}
                event={bookingData?.ticket?.event}
                bookingData={bookingData}
                subtotal={bookingData?.ticket?.price * bookingData?.quantity}
                totalTax={Math.max(0, ((bookingData?.amount - -bookingData?.discount) - (bookingData?.ticket?.price * bookingData?.quantity))).toFixed(2)}
                discount={bookingData?.discount}
                grandTotal={bookingData?.amount}
            />
            <CommonListing
                tile={'POS Bookings'}
                bookings={bookings}
                dateRange={dateRange}
                loading={loading}
                columns={columns}
                setDateRange={setDateRange}
                exportPermisson={'Export POS Bookings'}
                bookingLink={'/dashboard/pos'}
                ButtonLable={'New Booking'}
            />
        </Fragment>
    );
});

AmusePOS.displayName = "AmusePOS";
export default AmusePOS;
