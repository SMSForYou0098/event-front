import React, { memo, Fragment, useRef, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { downloadTickets } from "../../../../Context/ticketDownloadUtils";
import TicketModal from "../TicketModal/TicketModal";
import CommonListing from "../CustomUtils/CommonListing";
import { Button, Form } from "react-bootstrap";
import { SendIcon, TicketIcon } from "lucide-react";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";

const ExhibitionBookings = memo(() => {
    const { api, UserData, formatDateTime, sendTickets, authToken, isMobile, formatDateRange, convertTo12HourFormat, ErrorAlert } = useMyContext();

    const [bookings, setBookings] = useState([]);
    const [dateRange, setDateRange] = useState('');
    const [ticketData, setTicketData] = useState([]);
    const [ticketType, setTicketType] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const ticketRefs = useRef([]);

    const GetBookings = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = dateRange ? `?date=${dateRange}` : '';
            const url = `${api}exhibition-bookings/${UserData?.id}${queryParams}`;
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
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.log(err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, [dateRange, api, UserData, authToken, setBookings]);

    useEffect(() => {
        GetBookings();
    }, [dateRange, GetBookings]);

    useEffect(() => {
        GetBookings();
    }, [GetBookings]);

    const HandleSendTicket = useCallback(async (id) => {
        let data = bookings?.find((item) => item?.id === id);
        await sendTickets(data, "old");
    },
        [bookings, sendTickets]
    );

    const DeleteBooking = useCallback(async (id) => {
        let data = bookings?.find((item) => item?.id === id);
        if (!data) return;

        const endpoint = data.is_deleted
            ? `${api}exihibition/restore-booking/${data?.token || data?.order_id}`
            : `${api}exihibition/delete-booking/${data?.token || data?.order_id}`;

        const request = data.is_deleted ? axios.get : axios.delete;

        try {
            const res = await request(endpoint, {
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

    const downloadTicket = () => {
        downloadTickets(ticketRefs, ticketType?.type, setLoading);
    }
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
                // If the modal was dismissed in any way other than by clicking the cancel button or the close button, do not set the type
                return;
            } else {
                setTicketType({ type: 'individual' });
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
    const HandleExportAgentReport = async () => {
        try {
            const response = await axios.get(`${api}export-agentBooking`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                },
                responseType: 'blob',
            });
            if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'AgentBookings.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                ErrorAlert("No data received from the API.");
            }
        } catch (error) {
            ErrorAlert('An error occurred while exporting the data')
        }
    };
    const actions = useMemo(() => [
        { tooltip: "Resend", variant: "success", onClick: HandleSendTicket, Icon: SendIcon },
        { tooltip: "Generate Ticket", variant: "danger", onClick: GenerateTicket, Icon: TicketIcon }
    ], [HandleSendTicket, GenerateTicket]);

    const formatter = useCallback((cell, row) => {
        const isDisabled = row?.is_deleted || row?.bookings?.[0]?.status === "1";

        return (
            <div className="d-flex gap-2 justify-content-center">
                {actions.map(({ tooltip, variant, onClick, Icon }, index) => (
                    <CustomTooltip key={index} text={tooltip}>
                        <Button
                            variant={variant}
                            className="btn-sm btn-icon"
                            onClick={() => onClick(row.id)}
                            disabled={isDisabled}
                        >
                            <Icon size={16} />
                        </Button>
                    </CustomTooltip>
                ))}
            </div>
        );
    }, [actions]);

    const columns = useMemo(() => [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            sort: true
        },
        {
            dataField: 'ticket.event.name',
            text: 'Event',
            sort: true
        },
        {
            dataField: 'ticket.name',
            text: 'Ticket',
            sort: true
        },
        {
            dataField: 'quantity',
            text: 'Quantity',
            sort: true
        },
        {
            dataField: 'discount',
            text: 'Discount',
            formatter: (cell) => (
                <p className="text-danger">{cell}</p>
            ),
            sort: true
        },
        {
            dataField: 'amount',
            text: 'Amount',
            sort: true
        },
        {
            dataField: 'status',
            text: 'Status',
            formatter: (cell) => (
                <span className={`badge p-1 bg-${cell === "0" ? 'warning' : 'success'}`}>
                    {cell === "0" ? 'Uncheck' : 'Checked'}
                </span>
            ),
            sort: true
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter,
        },
        {
            dataField: 'created_at',
            text: 'Purchase Date',
            formatter: (cell) => formatDateTime(cell),
            sort: true
        },
        {
            dataField: 'is_deleted',
            text: 'Disable',
            formatter: (cell, row) => (
                <div className="form-check form-switch">
                    <Form.Check
                        type="switch"
                        checked={row.is_deleted === true}
                        onChange={() => DeleteBooking(row.id)}
                    />
                </div>
            ),
            sort: true
        }
    ], [DeleteBooking, formatDateTime, formatter]);

    return (
        <Fragment>
            <TicketModal
                show={show}
                showTicketDetails={true}
                showPrintButton={true}
                handleCloseModal={handleCloseModal}
                ticketType={ticketType}
                ticketData={ticketData}
                ticketRefs={ticketRefs}
                loading={loading}
                downloadTicket={downloadTicket}
                isMobile={isMobile}
                formatDateRange={formatDateRange}
                convertTo12HourFormat={convertTo12HourFormat}
            />
            <CommonListing
                tile={'Exhibition'}
                bookings={bookings}
                dateRange={dateRange}
                loading={loading}
                columns={columns}
                setDateRange={setDateRange}
                exportPermisson={'Export Exhibition Bookings'}
                bookingLink={'new'}
                ButtonLable={'New Booking'}
            />
        </Fragment>
    );
});

ExhibitionBookings.displayName = "ExhibitionBookings";
export default ExhibitionBookings;
