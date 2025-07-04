import React, { useEffect, useRef, useState } from 'react'
import { Card, Col ,Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import useDataTable from '../../../../components/hooks/useDatatable';
import $ from "jquery";
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import * as moment from 'moment';

const OnlineReport = () => {
    const { api, authToken } = useMyContext();
    const [report, setReport] = useState();
    const listtableRef = useRef(null);

    const GetBookings = async () => {
        await axios
            .get(`${api}pos-report`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            })
            .then((res) => {
                setReport(res.data.data);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        GetBookings();
    }, []);

    const [dynamicColumns, setDynamicColumns] = useState([]);
    const getLast7Days = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            dates.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
        }
        return dates;
    };
    useEffect(() => {
        const last7Days = getLast7Days();
        const dateColumns = last7Days.map((date) => ({
            data: date, // Assuming you have data keyed by date
            title: date,
            render: (data, type, row) => {
                return row.bookings[date] || 'No Data'; 
            }
        }));
        console.log(dynamicColumns)
        setDynamicColumns(dateColumns); // Update the state
    }, []);


    const columns = useRef([
        {
            data: null, // No direct data mapping
            orderable: false,
            title: "#",
            render: (data, type, row, meta) => meta.row + 1 // Use index + 1 as OrderId
        },
        {
            data: 'pos_user_name', // The name of the POS user
            title: "POS User Name",
        },
        {
            data: 'booking_count', // Total number of bookings made by the user
            title: "Total Bookings", 
        },
        {
            data: 'total_amount', // Total amount from all bookings for the user
            title: "Total Amount",
        },
        {
            data: 'total_discount', // Total discount given for the user's bookings
            title: "Total Discount",
        },
        ...dynamicColumns,
    ]);
    useDataTable({
        tableRef: listtableRef,
        columns: columns?.current,
        data: report,
    });
    if ($.fn.DataTable.isDataTable("#datatable-ecom")) {
        $("#datatable-ecom").DataTable().destroy();
    }
    $("#datatable-ecom").DataTable({
        createdRow: function (row, data, dataIndex) {
            $(row).find("td:eq(1), td:eq(3)").css("text-align", "center");
        },
    });
    return (
        <Row>
            <Col lg="12" md="12">
                <Card className="card-block">
                    <Card.Header>
                        <h4 className="">
                            POS Report
                        </h4>
                    </Card.Header>
                    <Card.Body className='px-0'>
                        <div className="table-responsive">
                            <table
                                id="datatable-ecom"
                                ref={listtableRef}
                                className="data-tables table custom-table movie_table"
                            ></table>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default OnlineReport
