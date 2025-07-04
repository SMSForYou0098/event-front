import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import CommonDateRange from '../CustomHooks/CommonDateRange';
import CustomDataTable from '../Wallet/CustomDataTable';

const EventReports = memo(() => {
    const { api, UserData, authToken, ErrorAlert } = useMyContext();
    const [report, setReport] = useState([]);
    const [dateRange, setDateRange] = useState('');
    const [type, setType] = useState('active');
    const [loading, setLoading] = useState(true);

    const GetBookings = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = [];
            if (dateRange) queryParams.push(`date=${dateRange}`);
            if (type) queryParams.push(`type=${type}`);

            const url = `${api}event-reports/${UserData?.id}${queryParams.length ? `?${queryParams.join('&')}` : ''}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });

            if (response.data.data) {
                setReport(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            ErrorAlert('Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    }, [api, UserData?.id, authToken, dateRange, type, ErrorAlert]);

    useEffect(() => {
        GetBookings();
    }, [GetBookings]);

    const columns = useMemo(() => [
        {
            dataField: 'id',
            text: '#',
            formatter: (cell, row, rowIndex) => rowIndex + 1,
            sort: true
        },
        {
            dataField: 'event_name',
            text: 'Event',
            sort: true
        },

        {
            dataField: 'non_agent_bookings',
            text: 'Online',
            sort: true
        }, {
            dataField: 'online_base_amount',
            text: 'Online',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'easebuzz_total_amount',
            text: 'Easebuzz',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'instamojo_total_amount',
            text: 'Instamojo',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'agent_bookings',
            text: 'Agent',
            sort: true
        },
        {
            dataField: 'agent_base_amount',
            text: 'Agent Sale',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'pos_bookings_quantity',
            text: 'POS',
            sort: true
        },
        {
            dataField: 'pos_base_amount',
            text: 'POS Sale',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'total_bookings',
            text: 'Total T',
            formatter: (cell, row) =>
                (row.non_agent_bookings || 0) +
                (row.agent_bookings || 0) +
                (row.pos_bookings_quantity || 0),
            sort: true
        },
        {
            dataField: 'total_discount',
            text: 'Disc',
            formatter: (cell, row) =>
                `₹${(
                    (row.online_discount || 0) +
                    (row.pos_discount || 0) +
                    (row.agent_discount || 0)
                ).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'organizer',
            text: 'Organizer',
            sort: true
        },
        {
            dataField: 'ticket_quantity',
            text: 'Avail Ticket',
            sort: true
        },
        {
            dataField: 'total_ins',
            text: 'Check-ins',
            sort: true
        },
        {
            dataField: 'total_convenience_fee',
            text: 'Con Fees',
            formatter: (cell, row) =>
                `₹${(
                    (row.online_convenience_fee || 0) +
                    (row.pos_convenience_fee || 0)
                ).toFixed(2)}`,
            sort: true
        },

    ], []);

    return (
        <Row>
            <Col lg="12" md="12">
                <Card className="card-block">
                    <Card.Header>
                        <h4 className="">Events Report</h4>
                    </Card.Header>
                    <CommonDateRange
                        setState={setDateRange}
                        showSwitch={true}
                        setType={setType}
                        type={type}
                    />
                    <CustomDataTable
                        data={report}
                        columns={columns}
                        loading={loading}
                        keyField="id"
                        searchPlaceholder="Search reports..."
                    />
                </Card>
            </Col>
        </Row>
    );
});

EventReports.displayName = "EventReports";
export default EventReports;