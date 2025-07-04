import React, { memo, Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useMyContext } from "../../../../Context/MyContextProvider";
import QRGenerator from "../Events/Tickets/QRGenerator";
import generateQRCodeZip from "../Events/Tickets/generateQRCodeZip";
import BatchDataModel from "./BatchDataModel";
import { CheckCircle, FileArchive, Send, Trash, XCircle } from "lucide-react";
import { CustomTooltip } from "../CustomUtils/CustomTooltip";
import CommonListing from "../CustomUtils/CommonListing";
const CbList = memo(() => {
    const { api, UserData, formatDateTime, authToken, ErrorAlert, successAlert, loader } = useMyContext();
    const [bookings, setBookings] = useState([]);
    const [batchData, setBatchData] = useState([]);
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false);

    const GetBookings = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${api}complimentary-bookings/${UserData?.id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            if (response.data.status) {
                setBookings(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            ErrorAlert('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    }, [api, UserData?.id, authToken, ErrorAlert]);

    useEffect(() => {
        GetBookings();
    }, [GetBookings]);

    const fetchBookings = useCallback(async (data) => {
        try {
            setLoading(true);
            const res = await axios.post(
                `${api}fetch-batch-cb/${UserData?.id}`,
                { batch_id: data },
                {
                    headers: {
                        Authorization: 'Bearer ' + authToken,
                    },
                }
            );

            if (res.data.status) {
                let bk = res.data.tokens;
                let qrCodeIds = bk?.map((item) => ({
                    token: item?.token,
                    name: item?.name,
                    email: item?.email,
                    number: item?.number,
                }));
                return { bk, qrCodeIds };
            } else {
                ErrorAlert('Failed to fetch batch data');
                return null;
            }
        } catch (error) {
            ErrorAlert('Failed to fetch bookings');
            return null;
        } finally {
            setLoading(false);
        }
    }, [api, UserData?.id, authToken, ErrorAlert]);

    const generateZip = async (data) => {
        console.log(data);
        await generateQRCodeZip({
            bookings: data,
            QRGenerator: QRGenerator,
            loader: loader
        });
    };

    const onHide = () => {
        setShow(false);
        setBatchData([]);
    }
    const DeleteBooking = useCallback(async (id) => {
        try {
            const data = bookings?.find((item) => item?.id === id);
            if (!data) return;

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: `Do you want to ${data?.is_deleted ? 'enable' : 'disable'} this ticket?`,
                icon: 'warning',
                showCancelButton: true,
                // confirmButtonColor: data?.is_deleted ? '#28a745' : '#dc3545',
                // cancelButtonColor: '#6c757d',
                confirmButtonText: data?.is_deleted ? 'Yes, enable it!' : 'Yes, disable it!'
            });

            if (!result.isConfirmed) return;

            const method = data?.is_deleted ? 'get' : 'delete';
            const endpoint = data?.is_deleted ? 'complimatory/restore-booking' : 'complimatory/delete-booking';
            const tokenId = data?.batch_id;

            const response = await axios[method](`${api}${endpoint}/${tokenId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.status) {
                await GetBookings();
                successAlert(
                    `Ticket ${data?.is_deleted ? 'Enabled' : 'Disabled'}!`,
                    `Ticket ${data?.is_deleted ? 'enabled' : 'disabled'} successfully.`
                );
            }
        } catch (error) {
            console.error('Error:', error);
            ErrorAlert('Failed to process your request');
        }
    }, [api, authToken, bookings, GetBookings, ErrorAlert, successAlert]);

    const HandleResend = useCallback(async (id) => {
        try {
            setLoading(true);
            const data = await fetchBookings(id);
            if (data?.bk) {
                setBatchData(data.bk);
                setShow(true);
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            console.error('Error in HandleResend:', error);
            ErrorAlert('Failed to fetch booking data');
        } finally {
            setLoading(false);
        }
    }, [fetchBookings, ErrorAlert]);

    const AskAlert = useCallback(async (title, buttonText, data) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: title,
            icon: "warning",
            showCancelButton: true,
            backdrop: `rgba(60,60,60,0.8)`,
            confirmButtonText: buttonText,
        });

        if (result.isConfirmed) {
            setLoading(true);
            const bks = await fetchBookings(data);
            generateZip(bks?.qrCodeIds);
        }
    }, [fetchBookings]);

    const HandleModel = useMemo(() => (data) => {
        AskAlert("Do you want to make a zip again?", "Yes, Make A Zip", data);
    }, [AskAlert]);

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
            dataField: 'name',
            text: 'Name',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'number',
            text: 'Number',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'event_name',
            text: 'Event Name',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'ticket_name',
            text: 'Ticket Type',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'booking_count',
            text: 'Total Bookings',
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        // {
        //     dataField: 'is_deleted',
        //     text: 'Status',
        //     formatter: (cell, row) => (
        //         <div className="d-flex justify-content-center">
        //             <CustomTooltip text={cell ? 'Enable' : 'Disable'}>
        //                 <Button
        //                     variant={cell ? "danger" : "success"}
        //                     className="btn-sm btn-icon"
        //                     onClick={() => DeleteBooking(row.id)}
        //                 >
        //                     {cell ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
        //                 </Button>
        //             </CustomTooltip>
        //         </div>
        //     ),
        //     headerAlign: 'center',
        //     align: 'center'
        // },
        {
            dataField: 'booking_date',
            text: 'Generate Date',
            formatter: (cell) => formatDateTime(cell),
            headerAlign: 'center',
            align: 'center',
            sort: true
        },
        {
            dataField: 'action',
            text: 'Action',
            formatter: (cell, row) => {
                const actions = [
                    ...(row.type === 1 ? [{
                        tooltip: "Resend",
                        onClick: () => HandleResend(row.batch_id),
                        variant: "primary",
                        icon: <Send size={16} />,
                        disabled: row?.is_deleted
                    }] : []),
                    {
                        tooltip: "Download ZIP",
                        onClick: () => HandleModel(row.batch_id),
                        variant: "success",
                        icon: <FileArchive size={16} />,
                        disabled: row?.is_deleted
                    },
                    {
                        tooltip: row?.is_deleted ? "Enable Tickets" : "Disable Tickets",
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
                                    disabled={action.disabled}
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
    ], [DeleteBooking, HandleResend, HandleModel, formatDateTime]);
    return (
        <Fragment>
            {!loading &&
                <BatchDataModel show={show} onHide={onHide} batchData={batchData} />
            }
            <CommonListing
                tile={'Complimentary Bookings'}
                bookings={bookings}
                ShowReportCard={false}
                // dateRange={dateRange}
                loading={loading}
                columns={columns}
                // setDateRange={setDateRange}
                // exportPermisson={'Export POS Bookings'}
                bookingLink={'new'}
                ButtonLable={'New Booking'}
            />

        </Fragment>
    );
});

CbList.displayName = "CbList";
export default CbList;
