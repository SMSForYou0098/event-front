import React, { memo, useState, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import useSound from 'use-sound';

import beepSound from '../../../../assets/event/stock/tik.mp3';
import errorSound from '../../../../assets/event/stock/error.mp3';
import { useMyContext } from '../../../../Context/MyContextProvider';
import MobileScan from './MobileScanButton';
import ScanedUserData from './ScanedUserData';
import TickeScanFeilds from './TickeScanFeilds';
import AdminActionModal from './AdminActionModal';
import ShopKeeperModal from './ShopKeeperModal';
import { capitilize } from '../Wallet/Transactions';
import TransactionReceiptModal from './TransactionReceiptModal';

const TicketVerification = memo(({
    scanMode = 'manual',
}) => {
    const { api, userRole, formatDateTime, authToken, UserData, fetchCategoryData, isMobile, handleWhatsappAlert, ErrorAlert,successAlert } = useMyContext();
    const [QRdata, setQRData] = useState('');
    const [type, setType] = useState('');
    const [show, setShow] = useState(false);
    const [ticketData, setTicketData] = useState([]);
    const [event, setEvent] = useState();

    const [autoCheck, setAutoCheck] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAttendeee, setShowAttendee] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [categoryData, setCategoryData] = useState(null);
    const [tokenLength, setTokenLength] = useState(8);
    const [play] = useSound(beepSound);
    const [error] = useSound(errorSound);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [pendingQRData, setPendingQRData] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [resData, setResData] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [scanType, setScanType] = useState('verify'); 
    // Handle admin actions
    const handleAdminAction = async (actionType,data) => {
        let token = pendingQRData ?? data;
        try {
            setIsProcessing(true);
            setSelectedAction(actionType);
            switch (actionType) {
                case 'verify':
                    await getTicketDetail(token);
                    break;
                case 'shopkeeper':
                    await handleShopKeeperVerification(token);
                    break;
                case 'cancel':
                    setShowAdminModal(false);
                    break;
                default:
                    break;
            }
        } catch (err) {
            SweetalertError(err?.response?.data?.message);
        } finally {
            setShowAdminModal(false);
            setPendingQRData(null);
            setIsProcessing(false);
        }
    };

    const getTokenLength = async () => {
        try {
            const res = await axios.get(`${api}scanner-token-length/${UserData?.id}`, {
                headers: { 'Authorization': 'Bearer ' + authToken }
            });

            if (res.data.status) {
                setTokenLength(res.data.tokenLength);
            }
        } catch (err) {
            // SweetalertError(err.response.data.message);
        } finally {
            // setIsProcessing(false);
        }
    };

    useEffect(() => {
        getTokenLength();
    }, []);

    // Get ticket details when QR data is complete
    const getTicketDetail = async (data) => {
        try {
            const res = await axios.post(`${api}verify-ticket/${data}`,
                { user_id: UserData?.reporting_user },
                { headers: { 'Authorization': 'Bearer ' + authToken } }
            );
            if (res.data.status) {
                play();
                const mainBookings = res?.data?.bookings
                setTicketData(mainBookings);
                setEvent(res?.data?.event)
                setType(res?.data?.type);
                const event = res.data?.event
                getCategoryData(event)
                setShowAttendee(res.data?.attendee_required === 1);
                if (res.data?.is_master) {
                    const combinedAttendees = mainBookings?.bookings
                        ?.map(booking => { return booking?.attendee })
                        ?.flat();

                    setAttendees(combinedAttendees)
                } else if (mainBookings?.attendee) {
                    setAttendees([mainBookings?.attendee])
                }
                setShow(true);
            }
        } catch (err) {
            setQRData('');
            const formattedTime = formatDateTime(err?.response?.data?.time);
            const message = err?.response?.data?.time
                ? `Check In: <strong>${formattedTime}</strong>`
                : '';

            Swal.fire({
                icon: 'error',
                title: err?.response?.data?.message,
                html: message,
                timer: 1000
            });
            error();
        }
    };


    const getCategoryData = async (event) => {
        if (event) {
            let data = await fetchCategoryData(event?.category?.id)
            setCategoryData(data)
        }
    }

    const handleShopKeeperVerification = async (data) => {
        try {
            const res = await axios.post(`${api}wallet-user/${data}`, {},
                { headers: { 'Authorization': 'Bearer ' + authToken } }
            );
            if (res.data.status) {
                play();
                setShow(true);
                setTicketData(res.data);
            }
        } catch (err) {
            setQRData('');
            error();
            SweetalertError(err?.response?.data?.message ?? err.response.data.error);
        }
    };
    // Trigger ticket detail fetch when QR data reaches correct length
    useEffect(() => {
        if (QRdata?.length === tokenLength) {
            if (userRole === 'Admin') {
                if (scanType === 'verify' || scanType === 'shopkeeper') {
                    handleAdminAction(scanType,QRdata);
                } else {
                    // Show modal only if no scan type is selected
                    setPendingQRData(QRdata);
                    setShowAdminModal(true);
                }
            } else if (userRole === 'Shop Keeper') {
                handleShopKeeperVerification(QRdata);
            } else {
                getTicketDetail(QRdata);
            }
        }
    }, [QRdata,type]);


    // Verify ticket
    const handleVerify = async () => {
        if (QRdata && !isProcessing) {
            setIsProcessing(true);
            try {
                const res = await axios.get(`${api}chek-in/${QRdata}`, {
                    headers: { 'Authorization': 'Bearer ' + authToken }
                });

                if (res.data.status) {
                    successAlert('Ticket Scanned Successfully!');
                    setQRData('');
                    setShow(false);
                }
            } catch (err) {
                SweetalertError(err.response.data.message);
            } finally {
                setIsProcessing(false);
            }
        }
    };
    const handleDebit = async (amount, remarks) => {
        //console.log(amount, remarks);return
        try {
            setIsProcessing(true);
            const res = await axios.post(
                `${api}debit-wallet`,
                {
                    amount,
                    description: remarks,
                    token: QRdata,
                    shopKeeper_id: UserData?.id,
                    session_id: ticketData.session_id,
                    user_id: ticketData.user?.id
                },
                { headers: { 'Authorization': 'Bearer ' + authToken } }
            );

            if (res.data.status) {
                const transactionData = res.data?.data;
                setShowReceipt(true);
                setResData(transactionData);
                setShow(false);
                setQRData('');
                successAlert('success','Amount Debited Successfully!');
                HandleSendAlerts(transactionData).catch(err => {
                    console.error('Failed to send alert:', err);
                });
            }
        } catch (err) {
            SweetalertError(err?.response?.data?.message);
        } finally {
            setIsProcessing(false);
        }
    };


    // Error alert
    const SweetalertError = (data) => {
        Swal.fire({
            icon: "error",
            title: data,
            timer: 1000,
            willClose: () => setIsProcessing(false)
        });
    };

    // Auto-check mechanism
    useEffect(() => {
        if (show && autoCheck) {
            const timer = setTimeout(handleVerify, 900);
            return () => clearTimeout(timer);
        }
    }, [show, autoCheck]);

    const HandleSendAlerts = async (transactionData) => {
        if (!transactionData) {
            ErrorAlert('Transaction data is missing');
            return;
        }
        const template = 'Transaction Dedit';
        const {
            total_credits = 0,
            user_number = '',
            shop_name = '',
            user_name = '',
            credits = 0,
            shop_user_name = '',
            shop_user_number = ''
        } = transactionData;

        if (!user_number) {
            ErrorAlert('User phone number is missing in:', transactionData);
            return;
        }

        const values = {
            name: capitilize(user_name),
            credits: credits,
            ctCredits: total_credits,
            shopName: shop_name,
            shopKeeperName: capitilize(shop_user_name),
            shopKeeperNumber: shop_user_number,
        };

        if (user_number && credits) {
            await handleWhatsappAlert(user_number, values, template);
        } else {
            ErrorAlert('Missing required data for WhatsApp alert');
        }
    };

    return (
        <>
            <AdminActionModal
                show={showAdminModal}
                onHide={() => {
                    setShowAdminModal(false);
                    setQRData('');
                    setPendingQRData(null);
                }}
                onActionSelect={handleAdminAction}
            />
            <TransactionReceiptModal
                show={showReceipt}
                onHide={() => setShowReceipt(false)}
                transactionId={resData?.id}
            />
            {(userRole === 'Shop Keeper' || selectedAction === 'shopkeeper') && (
                <ShopKeeperModal
                    show={show}
                    onHide={() => {
                        setShow(false);
                        setQRData('');
                    }}
                    ticketData={ticketData}
                    handleDebit={handleDebit}
                />
            )}
            {(userRole === 'Scanner' || selectedAction === 'verify') && (
                <ScanedUserData
                    show={show}
                    event={event}
                    ticketData={ticketData}
                    type={type}
                    setShow={setShow}
                    showAttendeee={showAttendeee}
                    attendees={attendees}
                    categoryData={categoryData}
                    handleVerify={handleVerify}
                />
            )}
            {/* Event Statistics */}
            <Row>
                {isMobile && <MobileScan />}
                <Row>
                    {isMobile && <MobileScan />}
                    <TickeScanFeilds
                        scanMode={scanMode}
                        QRdata={QRdata}
                        setQRData={setQRData}
                        autoCheck={autoCheck}
                        setAutoCheck={setAutoCheck}
                        scanType={scanType}
                        setScanType={setScanType}
                        userRole={userRole}
                    />
                </Row>
            </Row>
        </>
    );
});

export default TicketVerification;