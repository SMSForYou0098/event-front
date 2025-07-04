import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CountCard from '../../Dashboard/CountCard'
import { Col } from 'react-bootstrap'
import axios from 'axios';
import { useMyContext } from '../../../../../Context/MyContextProvider';
import { Swiper, SwiperSlide } from "swiper/react";

const BookingCount = ({ type, date, showGatewayAmount }) => {
    const { api, authToken, isMobile } = useMyContext()
    const [counts, setCounts] = useState({
        totalDiscount: 0,
        totalAmount: 0,
        totalQuantity: 0,
    });
    useEffect(() => {
        if (type) {
            calculateTotals(type)
        }
    }, [type, date]);
    const getTypeParam = (bookingType) => {
        // First check if the type contains 'online' (case insensitive)
        const currentPath = window.location.pathname;
        const bookingTypeLower = bookingType.toLowerCase();
        if (currentPath.includes('amusement')) {
            if (bookingTypeLower.includes('online')) return 'amusement-online';
            if (bookingTypeLower.includes('agent')) return 'amusement-agent';
            if (bookingTypeLower.includes('pos')) return 'amusement-pos';
        }
        if (bookingTypeLower.includes('online')) {
            return 'online';
        }

        const typeMap = {
            'Agent': 'agent',
            'Exhibition': 'exhibition',
            'POS': 'pos'
        };

        return typeMap[bookingType] || bookingType.toLowerCase();
    };


    const calculateTotals = useCallback(async () => {
        if (!type) return; // Prevent execution if type is not provided
        try {
            const typeParam = getTypeParam(type);
            const url = `${api}getDashboardSummary/${typeParam}?date=${date}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            const data = response.data;
            if (data) {
                setCounts({
                    totalDiscount: data.totalDiscount,
                    totalAmount: data.totalAmount,
                    totalBookings: data.totalBookings,
                    totalTickets: data.totalTickets,
                    instamojoTotalAmount: data.instamojoTotalAmount,
                    easebuzzTotalAmount: data.easebuzzTotalAmount,
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, [api, authToken, type, date]);

    const countCardData = useMemo(() => {
    
        const baseData = [
            { title: "Amount", amount: Number(counts.totalAmount) },
            { title: "Discount", amount: Number(counts.totalDiscount) },
            { title: "Bookings", amount: Number(counts.totalBookings), hideCurrency: true },
            { title: "Tickets", amount: Number(counts.totalTickets), hideCurrency: true },
        ];
    
        const gatewayData = showGatewayAmount ? [
            { title: "InstaMojo", amount: Number(counts.instamojoTotalAmount), hideCurrency: false },
            { title: "Easebuzz", amount: Number(counts.easebuzzTotalAmount), hideCurrency: false },
        ] : [];
    
        return [...gatewayData,...baseData];
    }, [counts, showGatewayAmount]);

    const renderContent = () => {
        if (isMobile) {
            return (
                <Swiper
                    slidesPerView={2}
                    spaceBetween={10}
                    grabCursor={true}
                    loop={true}
                // touchEventsTarget="container"
                >
                    {countCardData.map((data, index) => (
                        <SwiperSlide key={index}>
                            <CountCard
                                title={data.title}
                                amount={data.amount}
                                hideCurrency={data.hideCurrency}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            );
        }

        return (
            <>
                {countCardData.map((data, index) => (
                    <Col key={index} sm="2">
                        <CountCard
                            title={data.title}
                            amount={data.amount}
                            hideCurrency={data.hideCurrency}
                        />
                    </Col>
                ))}
            </>
        );
    };

    return (
        <>
            {renderContent()}
        </>
    );
}

export default BookingCount