import React, { memo, Fragment, useRef, useState, useEffect, useCallback } from "react";
import { Row, Col, Card } from "react-bootstrap";
import $ from "jquery";
import useDataTable from "../../../../components/hooks/useDatatable";
import axios from "axios";
import Swal from "sweetalert2";
import { useMyContext } from "../../../../Context/MyContextProvider";
import { downloadTickets } from "../../../../Context/ticketDownloadUtils";
import TicketModal from "../TicketModal/TicketModal";
import CommonDateRange from "../CustomHooks/CommonDateRange";
import BookingCount from "../Events/Bookings/BookingCount";
import TableWithLoader from "../TableComp/TableWithLoader";
import MobBookingButton from "../CustomUtils/BookingUtils/MobBookingButton";
import CommonHeader from "../CustomUtils/CommonHeader";
// import * as XLSX from 'xlsx';

const AgentBookingBKp = memo(() => {
    const { api, UserData, formatDateTime, sendTickets, authToken, truncateString, isMobile, formatDateRange, convertTo12HourFormat, userRole } = useMyContext();

    const [bookings, setBookings] = useState([]);
    const [dateRange, setDateRange] = useState('');
    const GetBookings = useCallback(async () => {
        const queryParams = dateRange ? `?date=${dateRange}` : '';
        const url = `${api}agents/list/${UserData?.id}${queryParams}`;
        await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
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
        }).catch((err) => console.log(err));
    }, [dateRange, api, UserData, authToken, setBookings]);

    useEffect(() => {
        GetBookings();
    }, [dateRange, GetBookings]);
    useEffect(() => {
        GetBookings();
    }, [GetBookings]);

    const listtableRef = useRef(null);
    const columns = useRef([
        {
            data: null,
            orderable: false,
            title: "#",
            render: (data, type, row, meta) => meta.row + 1
        },
        {
            data: null,
            title: "Event Name",
            render: function (row) {
                return `<p title=${row?.bookings?.[0]?.ticket?.event?.name || row?.ticket?.event?.name || ""}>${truncateString(row?.bookings?.[0]?.ticket?.event?.name || row?.ticket?.event?.name || "")}</p>`;
            },
        },
        ...(userRole === 'Organizor' || userRole === 'Admin'
            ? [
                {
                    data: null,
                    title: "Agent Name",
                    render: function (row) {
                        return row?.bookings?.[0]?.agent_name || row?.agent_name || "";
                    },
                },
            ]
            : []),
        {
            data: null,
            title: "User Name",
            render: function (row) {
                return row?.bookings?.[0]?.user?.name || row?.user?.name || "";
            },
        },
        {
            data: null,
            title: "Number",
            render: function (row) {
                return row?.bookings?.[0]?.user?.number || row?.user?.number || "";
            },
        },
        {
            data: null,
            title: "Ticket",
            render: function (row) {
                return row?.bookings?.[0]?.ticket?.name || row?.ticket?.name || "";
            },
        },
        {
            data: null,
            title: "Qty",
            render: function (row) {
                return row?.bookings?.length || 1;
            },
        },
        {
            data: null,
            title: "B Amt",
            render: function (row) {
                return (row?.bookings && row?.bookings[0]?.base_amount) || row?.base_amount || 0;
            },
        },
        {
            data: null,
            title: "Disc",
            render: function (row) {
                return (
                    row?.discount || (row?.bookings && row?.bookings[0]?.discount) || 0
                );
            },
        },
        {
            data: null,
            title: "Total",
            render: function (row) {
                return (row?.bookings && row?.bookings[0]?.amount) || row?.amount || 0;
            },
        },
        {
            data: null,
            title: "Mode",
            render: function (row) {
                return (row?.bookings && row?.bookings[0]?.payment_method) || row?.payment_method || 0;
            },
        },
        {
            data: null,
            orderable: false,
            searchable: false,
            title: "Action",
            render: function (data) {
                const isDisabled =
                    data?.is_deleted === true || (data.bookings && data.bookings[0]?.status) === "1"
                        ? "disabled"
                        : "";
                return `
                        <div class="flex align-items-center list-user-action">
                            <button class="btn btn-sm btn-icon btn-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Send Ticket" data-id=${data?.id} data-method="Send" data-table="action" ${isDisabled}>
                                <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" height="20"><path d="M21.4274 2.5783C20.9274 2.0673 20.1874 1.8783 19.4974 2.0783L3.40742 6.7273C2.67942 6.9293 2.16342 7.5063 2.02442 8.2383C1.88242 8.9843 2.37842 9.9323 3.02642 10.3283L8.05742 13.4003C8.57342 13.7163 9.23942 13.6373 9.66642 13.2093L15.4274 7.4483C15.7174 7.1473 16.1974 7.1473 16.4874 7.4483C16.7774 7.7373 16.7774 8.2083 16.4874 8.5083L10.7164 14.2693C10.2884 14.6973 10.2084 15.3613 10.5234 15.8783L13.5974 20.9283C13.9574 21.5273 14.5774 21.8683 15.2574 21.8683C15.3374 21.8683 15.4274 21.8683 15.5074 21.8573C16.2874 21.7583 16.9074 21.2273 17.1374 20.4773L21.9074 4.5083C22.1174 3.8283 21.9274 3.0883 21.4274 2.5783Z" fill="currentColor"></path><path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M3.01049 16.8079C2.81849 16.8079 2.62649 16.7349 2.48049 16.5879C2.18749 16.2949 2.18749 15.8209 2.48049 15.5279L3.84549 14.1619C4.13849 13.8699 4.61349 13.8699 4.90649 14.1619C5.19849 14.4549 5.19849 14.9299 4.90649 15.2229L3.54049 16.5879C3.39449 16.7349 3.20249 16.8079 3.01049 16.8079ZM6.77169 18.0003C6.57969 18.0003 6.38769 17.9273 6.24169 17.7803C5.94869 17.4873 5.94869 17.0133 6.24169 16.7203L7.60669 15.3543C7.89969 15.0623 8.37469 15.0623 8.66769 15.3543C8.95969 15.6473 8.95969 16.1223 8.66769 16.4153L7.30169 17.7803C7.15569 17.9273 6.96369 18.0003 6.77169 18.0003ZM7.02539 21.5683C7.17139 21.7153 7.36339 21.7883 7.55539 21.7883C7.74739 21.7883 7.93939 21.7153 8.08539 21.5683L9.45139 20.2033C9.74339 19.9103 9.74339 19.4353 9.45139 19.1423C9.15839 18.8503 8.68339 18.8503 8.39039 19.1423L7.02539 20.5083C6.73239 20.8013 6.73239 21.2753 7.02539 21.5683Z" fill="currentColor"></path></svg>
                            </button>
                            <button class="btn btn-sm btn-icon btn-danger" data-bs-toggle="tooltip" data-bs-placement="top" title="Download Ticket" data-id=${data?.id} data-method="GenerateTicket" data-table="action" ${isDisabled}>
                                <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" height="20"><path opacity="0.4" d="M13.7505 9.70303V7.68318C13.354 7.68318 13.0251 7.36377 13.0251 6.97859V4.57356C13.0251 4.2532 12.764 4.00049 12.4352 4.00049H5.7911C3.70213 4.00049 2 5.653 2 7.68318V10.1155C2 10.3043 2.07737 10.4828 2.21277 10.6143C2.34816 10.7449 2.53191 10.8201 2.72534 10.8201C3.46035 10.8201 4.02128 11.3274 4.02128 11.9944C4.02128 12.6905 3.45068 13.2448 2.73501 13.2533C2.33849 13.2533 2 13.5257 2 13.9203V16.3262C2 18.3555 3.70213 19.9995 5.78143 19.9995H12.4352C12.764 19.9995 13.0251 19.745 13.0251 19.4265V17.3963C13.0251 17.0027 13.354 16.6917 13.7505 16.6917V14.8701C13.354 14.8701 13.0251 14.5497 13.0251 14.1655V10.4076C13.0251 10.0224 13.354 9.70303 13.7505 9.70303Z" fill="currentColor"></path><path d="M19.9787 11.9948C19.9787 12.69 20.559 13.2443 21.265 13.2537C21.6615 13.2537 22 13.5262 22 13.9113V16.3258C22 18.3559 20.3075 20 18.2186 20H15.0658C14.7466 20 14.4758 19.7454 14.4758 19.426V17.3967C14.4758 17.0022 14.1567 16.6921 13.7505 16.6921V14.8705C14.1567 14.8705 14.4758 14.5502 14.4758 14.1659V10.4081C14.4758 10.022 14.1567 9.70348 13.7505 9.70348V7.6827C14.1567 7.6827 14.4758 7.36328 14.4758 6.9781V4.57401C14.4758 4.25366 14.7466 4 15.0658 4H18.2186C20.3075 4 22 5.64406 22 7.6733V10.0407C22 10.2286 21.9226 10.4081 21.7872 10.5387C21.6518 10.6702 21.4681 10.7453 21.2747 10.7453C20.559 10.7453 19.9787 11.31 19.9787 11.9948Z" fill="currentColor"></path></svg>
                            </button>
                        </div>`
                    ;
            },
        },
        {
            data: null,
            orderable: false,
            searchable: false,

            title: "Disable",
            render: function (data) {
                const Checked = data?.is_deleted === true && "checked";
                return `<div class="flex align-items-center list-user-action">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" data-table="action" data-id=${data?.id} data-method="disable" ${Checked}>
                            </div>
                        </div>`;
            },
        },
        {
            data: "created_at",
            title: "Purchase Date",
            render: function (data) {
                return formatDateTime(data);
            },
        },
        {
            data: null,
            title: "Status",
            render: function (data) {
                const status = data.status || (data.bookings && data.bookings[0]?.status);
                return `<span 
                        class="badge 
                        p-1 
                        bg-${status === "0" ? "warning" : "success"}">
                        ${status === "0" ? "Uncheck" : "Checked"}
                    </span>`;
            },
        },

    ]);

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
            ? `${api}restore-booking/${data?.token || data?.order_id}`
            : `${api}delete-booking/${data?.token || data?.order_id}`;

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


    const handleActionCallback = useCallback((data) => {
        switch (data?.method) {
            case "Send":
                HandleSendTicket(data?.id);
                break;
            case "GenerateTicket":
                GenerateTicket(data?.id);
                break;
            case "edit":
                break;
            case "disable":
                DeleteBooking(data?.id);
                break;
            default:
                break;
        }
    }, [HandleSendTicket, GenerateTicket, DeleteBooking])

    useDataTable({
        tableRef: listtableRef,
        columns: columns.current,
        data: bookings,
        actionCallback: handleActionCallback
    });

    if ($.fn.DataTable.isDataTable("#datatable-ecom")) {
        $("#datatable-ecom").DataTable().destroy();
    }
    $("#datatable-ecom").DataTable({
        createdRow: function (row, data, dataIndex) {
            $(row).find("td:eq(1), td:eq(3)").css("text-align", "center");
        },
    })
    // const HandleExportAgentReport = () => {
    //     // Map the data to the same structure as the table columns
    //     const dataForExport = bookings.map((booking, index) => ({
    //         "#": index + 1,
    //         "Event Name": booking?.bookings?.[0]?.ticket?.event?.name || booking?.ticket?.event?.name || "",
    //         "Agent Name": (userRole === 'Organizor' || userRole === 'Admin') ? (booking?.bookings?.[0]?.agent_name || booking?.agent_name || "") : undefined,
    //         "User  Name": booking?.bookings?.[0]?.user?.name || booking?.user?.name || "",
    //         "Number": booking?.bookings?.[0]?.user?.number || booking?.user?.number || "",
    //         "Ticket": booking?.bookings?.[0]?.ticket?.name || booking?.ticket?.name || "",
    //         "Qty": booking?.bookings?.length || 1,
    //         "B Amt": (booking?.bookings && booking?.bookings[0]?.base_amount) || booking?.base_amount || 0,
    //         "Disc": booking?.discount || (booking?.bookings && booking?.bookings[0]?.discount) || 0,
    //         "Total": (booking?.bookings && booking?.bookings[0]?.amount) || booking?.amount || 0,
    //         "Mode": (booking?.bookings && booking?.bookings[0]?.payment_method) || booking?.payment_method || 0,
    //         "Purchase Date": formatDateTime(booking.created_at),
    //         "Status": booking.status || (booking.bookings && booking.bookings[0]?.status) === "0" ? "Uncheck" : "Checked",
    //     }));

    //     // Filter out undefined values (e.g., "Agent Name" if not applicable)
    //     const filteredData = dataForExport.map(row => {
    //         const filteredRow = {};
    //         for (const key in row) {
    //             if (row[key] !== undefined) {
    //                 filteredRow[key] = row[key];
    //             }
    //         }
    //         return filteredRow;
    //     });

    //     // Create a worksheet
    //     const ws = XLSX.utils.json_to_sheet(filteredData);

    //     // Create a workbook
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, "AgentBookings");

    //     // Export the file
    //     XLSX.writeFile(wb, "AgentBookings.xlsx");
    // };


    const HandleExportAgentReport = async () => {
        try {
            // Make the API request with responseType as 'blob'
            const response = await axios.get(`${api}export-agentBooking`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                },
                responseType: 'blob', // Important for handling binary data
            });

            // Check if the response contains data
            if (response.data) {
                // Create a URL for the blob
                const url = window.URL.createObjectURL(new Blob([response.data]));

                // Create a link element
                const link = document.createElement('a');
                link.href = url;

                // Set the file name for the download
                link.setAttribute('download', 'AgentBookings.xlsx'); // You can customize the file name here

                // Append the link to the DOM (required for Firefox)
                document.body.appendChild(link);

                // Trigger the download
                link.click();

                // Remove the link from the DOM
                document.body.removeChild(link);

                // Revoke the blob URL to free up memory
                window.URL.revokeObjectURL(url);
            } else {
                console.error("No data received from the API.");
            }
        } catch (error) {
            console.error("Error exporting agent bookings:", error);
            Swal.fire({
                icon: "error",
                title: "Export Failed",
                text: "An error occurred while exporting the data.",
            });
        }
    };
    return (
        <Fragment>
            <TicketModal
                show={show}
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
            {isMobile &&
                <MobBookingButton to={"new"} />
            }
            <Row>
                <Col sm="12">
                    <Card>
                       <CommonHeader tile={'Agent'} setDateRange={setDateRange} bookingLink={'new'} />
                        <Row className={`d-flex align-items-center ${isMobile && 'mt-2'}`}>
                            {!isMobile &&
                                <Col sm="2">
                                    <CommonDateRange setState={setDateRange} removeClass={true} />
                                </Col>
                            }
                            <BookingCount data={bookings} date={dateRange} type="agent" />
                            
                            {/* <Col sm="2">
                                <Button className="btn-secondary" onClick={HandleExportAgentReport}>
                                    <FileDown />
                                </Button>
                            </Col> */}
                        </Row>
                        <Card.Body className="px-0">
                            <TableWithLoader
                                ref={listtableRef}
                                loading={loading}
                                columns={columns.current}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
        </Fragment>
    );
});

AgentBookingBKp.displayName = "AgentBookingBKp";
export default AgentBookingBKp;
