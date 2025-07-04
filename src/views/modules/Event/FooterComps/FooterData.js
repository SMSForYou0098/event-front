import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import FooterSettingComp from '../AdminSetting/SettingComps/FooterSettingComp';
import { useMyContext } from '../../../../Context/MyContextProvider';
import axios from 'axios';
const FooterData = () => {
    const { api, successAlert, authToken } = useMyContext();
    const [footerLogo, setFooterLogo] = useState('');
    const [footerBG, setFooterBG] = useState('');
    const [footerAddress, setFooterAddress] = useState('');
    const [footerContact, setFooterContact] = useState('');
    const [siteCredit, setSiteCredit] = useState('');
    const [footerWaNumber, setFooterWaNumber] = useState('');
    const [footerEmail, setFooterEmail] = useState('');
    const [facebookData, setFacebookData] = useState("");
    const [instagramData, setInstagramData] = useState("");
    const [youtubeData, setYoutubeData] = useState("");
    const [twitterData, setTwitterData] = useState("");

    const GetSocialMediaData = async () => {
        try {
            const res = await axios.get(`${api}socialMedia`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const data = res.data.SocialMediaData;
                setInstagramData(data?.instagram || '');
                setFacebookData(data?.facebook || '');
                setYoutubeData(data?.youtube || '');
                setTwitterData(data?.twitter || '');
            }
        } catch (err) {
            console.log(err);
        }
    };
    const GetMailConfig = async () => {
        try {
            const res = await axios.get(`${api}settings`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const configData = res.data.data;
                // Set new states
                setFooterLogo(configData?.footer_logo || '');
                setFooterAddress(configData?.footer_address || '');
                setFooterContact(configData?.footer_contact || '');
                setSiteCredit(configData?.site_credit || '');
                setFooterEmail(configData?.footer_email || '');
                setFooterWaNumber(configData?.footer_whatsapp_number || '');
            }
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        GetSocialMediaData()
        GetMailConfig()
    }, []);

    const handleAppConfig = async (e) => {
        try {
            e.preventDefault()
            const formData = new FormData();
            formData.append('footer_logo', footerLogo);
            formData.append('footer_bg', footerBG);
            formData.append('footer_address', footerAddress);
            formData.append('footer_contact', footerContact);
            formData.append('site_credit', siteCredit);
            formData.append('footer_whatsapp_number', footerWaNumber);
            formData.append('footer_email', footerEmail);
            const res = await axios.post(`${api}setting`, formData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'multipart/form-data'
                }
            });
            await SaveSocialMedia()
            //
            if (res.data.status) {
                successAlert('Success', 'App Configuration Stored Successfully');
            }
        } catch (err) {
            console.log(err);
        }
    };
    const SaveSocialMedia = async () => {
        try {
            const formData = new FormData();
            formData.append('facebook', facebookData);
            formData.append('instagram', instagramData);
            formData.append('youtube', youtubeData);
            formData.append('twitter', twitterData);
            const res = await axios.post(`${api}socialMedia-store`, formData, {
                headers: {
                    'Authorization': 'Bearer' + authToken,
                }
            });
            if (res.data.status) {
                successAlert('Success', 'Social Media Configuration Stored Successfully');
            }
        } catch (err) {
            console.log(err);

        }
    }



    return (
        <Card>
            <Card.Body>
                <FooterSettingComp
                    handleAppConfig={handleAppConfig}
                    setFooterBG={setFooterBG}
                    footerWaNumber={footerWaNumber}
                    setFooterWaNumber={setFooterWaNumber}
                    setFooterEmail={setFooterEmail}
                    footerEmail={footerEmail}
                    instagramData={instagramData}
                    setInstagramData={setInstagramData}
                    setFacebookData={setFacebookData}
                    facebookData={facebookData}
                    setYoutubeData={setYoutubeData}
                    youtubeData={youtubeData}
                    setTwitterData={setTwitterData}
                    twitterData={twitterData}
                    footerLogo={footerLogo}
                    setFooterLogo={setFooterLogo}
                    footerAddress={footerAddress}
                    setFooterAddress={setFooterAddress}
                    footerContact={footerContact}
                    setFooterContact={setFooterContact}
                    siteCredit={siteCredit}
                    setSiteCredit={setSiteCredit}
                />
            </Card.Body>
        </Card>
    )
}

export default FooterData
