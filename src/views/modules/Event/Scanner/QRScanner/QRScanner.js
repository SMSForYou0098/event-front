import React, { useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import PropTypes from 'prop-types';

const QRScanner = ({ onScan, scanMode = 'camera', styles = {} }) => {
    const videoElementRef = useRef(null);
    

    useEffect(() => {
        if (scanMode === 'camera' && videoElementRef.current) {
            const qrScanner = new QrScanner(
                videoElementRef.current,
                (result) => {
                    if (result?.data) {
                        onScan(result.data);
                    }
                },
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                }
            );
            qrScanner.start();

            return () => {
                qrScanner.stop();
                qrScanner.destroy();
            };
        }
    }, [scanMode, onScan]);

    const defaultStyles = {
        qrVideo: {
            objectFit: 'cover',
            height: '70vh',
            borderRadius: '10px',
            ...styles
        }
    };

    return (
        <video 
            style={defaultStyles.qrVideo} 
            ref={videoElementRef}
        />
    );
};

QRScanner.propTypes = {
    onScan: PropTypes.func.isRequired,
    scanMode: PropTypes.oneOf(['camera', 'manual']),
    styles: PropTypes.object
};

export default QRScanner;