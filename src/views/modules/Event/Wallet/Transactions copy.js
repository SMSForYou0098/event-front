import React, { useEffect, useRef, useState } from 'react'
import { useMyContext } from '../../../../Context/MyContextProvider';
import useDataTable from '../../../../components/hooks/useDatatable';
import $ from "jquery";
import { Card } from 'react-bootstrap';
import TableWithLoader from '../TableComp/TableWithLoader';
import useFetchTransactions from '../User/Transaction/fetchTransactions';
export const capitilize = (name) => {
    return name?.replace(/\b\w/g, (char) => char?.toUpperCase()) ?? 'N/A';
}
const Transactions = () => {
    const { UserData, api, authToken, userRolem, formatDateTime } = useMyContext();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchTransactions = useFetchTransactions(api, UserData?.id, authToken, setTransactions, setLoading)
    useEffect(() => {
        if (UserData && authToken) {
            setLoading(true);
            fetchTransactions();
        }
    }, [UserData, authToken, api]);
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
            title: "User Name",
            render: function (row) {
                return capitilize(row?.user?.name);
            },
        },
        {
            data: null,
            title: "Number",
            render: function (row) {
                return row?.user?.number || "";
            },
        },
        {
            data: null,
            title: "Amount",
            render: function (row) {
                return row?.new_credit || "";
            },
        },
        {
            data: null,
            title: "Date & Time",
            render: function (row) {
                return formatDateTime(row?.created_at) || '';
            },
        },
        {
            data: null,
            title: "Transferred  By",
            render: function (row) {
                return capitilize(row?.assign_by?.name);
            },
        },
        {
            data: null,
            title: "Payment Method",
            render: function (row) {
                return capitilize(row?.payment_method);
            },
        },
        {
            data: null,
            title: "Used At",
            render: function (row) {
                return capitilize(row?.shop_data?.shop_name);
            },
        },
        {
            data: null,
            title: "Transaction Id",
            render: function (row) {
                return row?.transaction_id;
            },
        },
        {
            data: null,
            title: "Payment Type",
            render: function (row) {
                return row?.payment_type === "credit" ? (
                    `<span className="text-success">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 1.5a.5.5 0 0 1 .5.5v10.793l3.146-3.147a.5.5 0 1 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.708L7.5 12.293V2a.5.5 0 0 1 .5-.5"
                            />
                        </svg>
                        Credit
                    </span>`
                ) : (
                    `<span className="text-danger">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 14.5a.5.5 0 0 1-.5-.5V3.707L4.354 6.854a.5.5 0 1 1-.708-.708l4-4a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1-.708.708L8.5 3.707V14a.5.5 0 0 1-.5.5"
                            />
                        </svg>
                        Debit
                    </span>`
                );
            },
        },
        {
            data: null,
            orderable: false,
            searchable: false,
            title: "Action",
            render: function (data) {
                return `
                        <div class="flex align-items-center list-user-action">
                            <button class="btn btn-sm btn-icon btn-success" data-bs-toggle="tooltip" data-bs-placement="top" title="Send Receipt" data-id=${data?.id} data-method="Send" data-table="action">
                                <svg width="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-20" height="20"><path d="M21.4274 2.5783C20.9274 2.0673 20.1874 1.8783 19.4974 2.0783L3.40742 6.7273C2.67942 6.9293 2.16342 7.5063 2.02442 8.2383C1.88242 8.9843 2.37842 9.9323 3.02642 10.3283L8.05742 13.4003C8.57342 13.7163 9.23942 13.6373 9.66642 13.2093L15.4274 7.4483C15.7174 7.1473 16.1974 7.1473 16.4874 7.4483C16.7774 7.7373 16.7774 8.2083 16.4874 8.5083L10.7164 14.2693C10.2884 14.6973 10.2084 15.3613 10.5234 15.8783L13.5974 20.9283C13.9574 21.5273 14.5774 21.8683 15.2574 21.8683C15.3374 21.8683 15.4274 21.8683 15.5074 21.8573C16.2874 21.7583 16.9074 21.2273 17.1374 20.4773L21.9074 4.5083C22.1174 3.8283 21.9274 3.0883 21.4274 2.5783Z" fill="currentColor"></path><path opacity="0.4" fillRule="evenodd" clipRule="evenodd" d="M3.01049 16.8079C2.81849 16.8079 2.62649 16.7349 2.48049 16.5879C2.18749 16.2949 2.18749 15.8209 2.48049 15.5279L3.84549 14.1619C4.13849 13.8699 4.61349 13.8699 4.90649 14.1619C5.19849 14.4549 5.19849 14.9299 4.90649 15.2229L3.54049 16.5879C3.39449 16.7349 3.20249 16.8079 3.01049 16.8079ZM6.77169 18.0003C6.57969 18.0003 6.38769 17.9273 6.24169 17.7803C5.94869 17.4873 5.94869 17.0133 6.24169 16.7203L7.60669 15.3543C7.89969 15.0623 8.37469 15.0623 8.66769 15.3543C8.95969 15.6473 8.95969 16.1223 8.66769 16.4153L7.30169 17.7803C7.15569 17.9273 6.96369 18.0003 6.77169 18.0003ZM7.02539 21.5683C7.17139 21.7153 7.36339 21.7883 7.55539 21.7883C7.74739 21.7883 7.93939 21.7153 8.08539 21.5683L9.45139 20.2033C9.74339 19.9103 9.74339 19.4353 9.45139 19.1423C9.15839 18.8503 8.68339 18.8503 8.39039 19.1423L7.02539 20.5083C6.73239 20.8013 6.73239 21.2753 7.02539 21.5683Z" fill="currentColor"></path></svg>
                            </button>
                        </div>`
                    ;
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
                        bg-${parseInt(status) === 0 ? "warning" : "success"}">
                        ${parseInt(status) === 0 ? "Cancelled" : "Paid"}
                    </span>`;
            },
        },
    ]);

    // const HandleSendReceipt = useCallback(async (id) => { })

    // const handleActionCallback = useCallback((data) => {
    //     switch (data?.method) {
    //         case "Send":
    //             HandleSendReceipt(data?.id);
    //             break;
    //         default:
    //             break;
    //     }
    // }, [HandleSendReceipt])

    useDataTable({
        tableRef: listtableRef,
        columns: columns.current,
        data: transactions,
        // actionCallback: handleActionCallback
    });

    if ($.fn.DataTable.isDataTable("#datatable-ecom")) {
        $("#datatable-ecom").DataTable().destroy();
    }
    $("#datatable-ecom").DataTable({
        createdRow: function (row, data, dataIndex) {
            $(row).find("td:eq(1), td:eq(3)").css("text-align", "center");
        },
    })
    return (
        <Card>
            <Card.Header>
                <Card.Title>Transactions</Card.Title>
            </Card.Header>
            <Card.Body className="px-0">
                <TableWithLoader
                    ref={listtableRef}
                    loading={loading}
                    columns={columns.current}
                />
            </Card.Body>

        </Card>
    )
}

export default Transactions
