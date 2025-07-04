import React, { useCallback, useRef, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import $ from "jquery";
import { useMyContext } from '../../../../Context/MyContextProvider';
import useDataTable from '../../../../components/hooks/useDatatable';
import Swal from 'sweetalert2';
const BatchDataModel = ({ show, onHide, batchData }) => {
    const listtableRef = useRef(null);
    const { handleWhatsappAlert, extractDetails, HandleSendSMS, sendMail,loader } = useMyContext();
    const [currentNumber, setCurrentNumber] = useState();


    const columns = useRef([
        {
            data: null,
            orderable: false,
            title: "#",
            render: (data, type, row, meta) => meta.row + 1
        },
        { data: "name", title: "Name" },
        { data: "number", title: "Number" },
        { data: "email", title: "Email" },
        {
            data: null,
            orderable: false,
            searchable: false,
            title: "Status",
            render: function (data) {
                const badgeClass = data === 1 ? 'badge bg-success' : 'badge bg-danger';
                const badgeText = data === 1 ? 'Checked' : 'Unchecked';
                
                return `
                    <span class="text-normal ${badgeClass}">${badgeText}</span>`;
            },
        },
        {
            data: null,
            orderable: false,
            searchable: false,
            title: "Action",
            render: function (data) {
                return `<div class="flex align-items-center list-user-action">
                          <button class=" btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="WhatsApp" data-id=${data?.id} data-method="whatsApp" data-table="action">
                            <p style="font-size:1.4rem">
                                <i class="fa-brands fa-whatsapp"></i>
                            </p>
                          </button>
                          <button class=" btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="SMS" data-id=${data?.id} data-method="sms" data-table="action">
                            <p style="font-size:1.3rem"> 
                                <i class="fa-regular fa-message"></i>
                            </p>
                          </button>
                          <button class=" btn btn-sm btn-icon" data-bs-toggle="tooltip" data-bs-placement="top" title="Mail" data-id=${data?.id} data-method="mail" data-table="action">
                            <p style="font-size:1.4rem">
                                <i class="fa-regular fa-envelope"></i>
                            </p>
                          </button>
                    </div>`;
            },
        },
    ]);
    const actionCallback = useCallback(
        ({ id, method }) => {
            switch (method) {
                case "whatsApp":
                    HandleWhatsApp(id);
                    break;
                case "sms":
                    HandleSMS(id);
                    break;
                case "mail":
                    HandleMail(id);
                    break;
                default:
                    console.warn(`Unknown method: ${method}`);
            }
        },
        []
    );
    useDataTable({
        tableRef: listtableRef,
        columns: columns.current,
        data: batchData,
        actionCallback
    });

    if ($.fn.DataTable.isDataTable("#datatable-ecom")) {
        $("#datatable-ecom").DataTable().destroy();
    }
    $("#datatable-ecom").DataTable({
        createdRow: function (row, data, dataIndex) {
            $(row).find("td:eq(1), td:eq(3)").css("text-align", "center");
        },
    });


    const FetchData = (id) => {
        const booking = batchData?.find((elm) => elm?.id === id)
        return booking
    }


    const HandleWhatsApp = async (id) => {
        const booking = FetchData(id);
        HandleMessageProcess(booking, handleSweetAlertProcess, sendWhatsappTicket, 'WhatsApp')

    };
    const HandleSMS = (id) => {
        const booking = FetchData(id)
        HandleMessageProcess(booking, handleSweetAlertProcess, sendSMSTicket, 'SMS')
    }
    const HandleMail = (id) => {
        const booking = FetchData(id)
        HandleMessageProcess(booking, handleSweetAlertProcess, sendEmailTicket, 'Email')
    }



    const HandleMessageProcess = async (booking, SendFunction, TypeFunction, AlertMessage) => {
        if (booking) {
            await SendFunction(AlertMessage, async () => {
                await TypeFunction(booking);
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to fetch booking details.",
            });
        }
    }


    const sendWhatsappTicket = async (booking) => {
        const { eventName, category, location, DateTime, thumbnail } = extractDetails(booking?.data);
        const values = [booking?.name, eventName, 1, category, location, DateTime];
        setCurrentNumber(booking?.number);
        await handleWhatsappAlert(booking?.number, 'bookingconfirmed2', values, thumbnail);
    };
    const sendSMSTicket = async (booking) => {
        const { eventName, organizerSenderId, organizerApiKey, config_status, ticketName } = extractDetails(booking?.data);
        setCurrentNumber(booking?.number);
        await HandleSendSMS(
            booking?.number,
            null,
            organizerApiKey,
            organizerSenderId,
            config_status,
            booking?.name,
            1,
            ticketName,
            eventName
        );
    };
    const sendEmailTicket = async (booking, index, total) => {
        const { eventName, thumbnail, category, eventDate, eventTime, DateTime, address, location } = extractDetails(booking?.data);
        const data = {
            email: booking?.email,
            number: booking?.number,
            thumbnail,
            category,
            qty: 1,
            name: booking?.name,
            eventName,
            eventDate,
            eventTime,
            DateTime,
            address,
            location,
            price: 0,
            convenience_fee: 0,
            total: 0
        };
        setCurrentNumber(booking?.number);
        await sendMail([data]);
    };

    const showLoading = (processName) => {
        return Swal.fire({
            title: `${processName} in Progress`,
            html: `
                <div style="text-align: center;">
                    <img src=${loader} style="width: 10rem; display: block; margin: 0 auto;"/>
                    <div class="spinner-border text-primary mt-4" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
            customClass: {
                htmlContainer: 'swal2-html-container-custom'
            },
        });
    };
    const handleSweetAlertProcess = async (processName, processFunction) => {
        let loader;
        try {
            loader = showLoading(processName);
            await processFunction();
            Swal.fire({
                icon: "success",
                title: `${processName} Successful`,
                text: `Your ${processName.toLowerCase()} has been successfully completed.`,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: `${processName} Failed`,
                text: `An error occurred while processing your ${processName.toLowerCase()}.`,
            });
            console.error(error);
        } finally {
            if (loader) {
                loader.close();
            }
        }
    }
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Send Tickets</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="table-responsive">
                    <table
                        id="datatable-ecom"
                        ref={listtableRef}
                        className="data-tables table custom-table movie_table"
                    ></table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BatchDataModel
