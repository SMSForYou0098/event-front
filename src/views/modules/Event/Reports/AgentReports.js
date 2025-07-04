import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
import CommonDateRange from '../CustomHooks/CommonDateRange';
import CustomDataTable from '../Wallet/CustomDataTable';

const AgentReports = memo(() => {
    const { api, authToken, ErrorAlert } = useMyContext();
    const [report, setReport] = useState([]);
    const [dateRange, setDateRange] = useState('');
    const [loading, setLoading] = useState(true);

    const GetBookings = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = dateRange ? `?date=${dateRange}` : '';
            const response = await axios.get(`${api}agent-report${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                }
            });
            
            if (response.data.data) {
                setReport(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching agent reports:', error);
            ErrorAlert('Failed to fetch agent reports');
        } finally {
            setLoading(false);
        }
    }, [api, authToken, dateRange, ErrorAlert]);

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
            dataField: 'agent_name',
            text: 'Name',
            sort: true
        },
        //changed by hp
        {
            dataField: 'total_bookings',
            text: 'Total',
            sort: true
        },
        {
            dataField: 'today_booking_count',
            text: 'Today',
            sort: true
        },
        {
            dataField: 'today_total_amount',
            text: 'Today AMT',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'total_UPI_bookings',
            text: 'UPI',
            sort: true
        },
        {
            dataField: 'total_Cash_bookings',
            text: 'Cash',
            sort: true
        },
        {
            dataField: 'total_Net_Banking_bookings',
            text: 'Net',
            sort: true
        },
        {
            dataField: 'total_UPI_amount',
            text: 'UPI AMT',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'total_Cash_amount',
            text: 'Cash AMT',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'total_Net_Banking_amount',
            text: 'Net AMT',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'total_discount',
            text: 'Total Disc',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        },
        {
            dataField: 'total_amount',
            text: 'Total AMT',
            formatter: (cell) => `₹${Number(cell || 0).toFixed(2)}`,
            sort: true
        }
    ], []);

    return (
        <Row>
            <Col lg="12" md="12">
                <Card className="card-block">
                    <Card.Header>
                        <h4 className="">Agents Report</h4>
                    </Card.Header>
                    <div className="py-2">
                    <CommonDateRange setState={setDateRange} />
                    </div>
                        <CustomDataTable
                            data={report}
                            columns={columns}
                            loading={loading}
                            keyField="id"
                            searchPlaceholder="Search agents..."
                        />
                </Card>
            </Col>
        </Row>
    );
});

AgentReports.displayName = "AgentReports";
export default AgentReports;