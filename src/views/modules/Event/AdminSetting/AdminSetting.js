import React, { useEffect, useState } from 'react'
import { Card, Col, Row, Form, Button } from 'react-bootstrap'
import { useMyContext } from '../../../../Context/MyContextProvider'
import axios from 'axios'
import SiteSettings from './SettingComps/SiteSettings'
import SiteSeoFields from './SettingComps/SiteSeoFields'
import WelcomeModal from './SettingComps/WelcomeModal'

const AdminSetting = () => {
    const { api, successAlert, authToken } = useMyContext();
    const [appName, setAppName] = useState('');
    const [metaTitle, setMetaTitle] = useState('');
    const [metaTag, setMetaTag] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [logo, setLogo] = useState('');
    const [authLogo, setAuthLogo] = useState('');
    const [favicon, setFavicon] = useState('');
    const [copyright, setCopyright] = useState('');
    const [copyrightLink, setCopyrightLink] = useState('');
    const [missedCallNumber, setMissedCallNumber] = useState('');
    const [waNumber, setWaNumber] = useState('');
    const [notifyReq, setNotifyReq] = useState('');
    const [complimentaryValidation, setComplimentaryValidation] = useState(false);
    const [mobileLogo, setMobileLogo] = useState('');
    const [homeDividerData, setHomeDividerData] = useState({
        home_divider:'',
        home_divider_url:'',
        external_link:false,
        new_tab:false
    });
    const [agreementData,setAgreementData] = useState({
        agreement_pdf:"",
        e_signature:"",
    })
    

    const GetMailConfig = async () => {
        try {
            const res = await axios.get(`${api}settings`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });
            if (res.data.status) {
                const configData = res.data.data;
                setAppName(configData?.app_name || '');
                setMetaTitle(configData?.meta_title || '');
                setMetaTag(configData?.meta_tag || '');
                setMetaDescription(configData?.meta_description || '');
                setMissedCallNumber(configData?.missed_call_no || '');
                setLogo(configData?.logo || '');
                setAuthLogo(configData?.auth_logo || '');
                setMobileLogo(configData?.mo_logo)
                setFavicon(configData?.favicon || '');
                setCopyright(configData?.copyright || '');
                setCopyrightLink(configData?.copyright_link || '');
                setComplimentaryValidation(configData?.complimentary_attendee_validation === 1);
                setNotifyReq(configData?.notify_req || '');
                let parsedDividerUrl = {};
                parsedDividerUrl = configData?.home_divider_url
                  ? JSON.parse(configData.home_divider_url)
                  : {};
                setHomeDividerData({
                  home_divider: configData?.home_divider || "",
                  home_divider_url: parsedDividerUrl.url || "",
                  external_link: parsedDividerUrl.external_link || false,
                  new_tab: parsedDividerUrl.new_tab || false,
                });
                setAgreementData({
                    agreement_pdf:configData?.agreement_pdf,
                    e_signature:configData?.e_signature
                })
            }
        } catch (err) {
            // console.log(err);
        }
    };

    useEffect(() => {
        GetMailConfig()
    }, []);

    const changeFavicon = (newFaviconUrl) => {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = newFaviconUrl;
        } else {
            // Create a new link element for the favicon
            const newFavicon = document.createElement('link');
            newFavicon.rel = 'icon';
            newFavicon.href = newFaviconUrl;
            document.head.appendChild(newFavicon);
        }
    }

    const handleAppConfig = async (e) => {
        try {
            e.preventDefault()
            const formData = new FormData();
            formData.append('app_name', appName);
            formData.append('whatsapp_number', waNumber);
            formData.append('meta_title', metaTitle);
            formData.append('meta_tag', metaTag);
            formData.append('meta_description', metaDescription);
            formData.append('missed_call_no', missedCallNumber);
            formData.append('copyright', copyright);
            formData.append('copyright_link', copyrightLink);
            formData.append('logo', logo);
            formData.append('mo_logo', mobileLogo);
            formData.append('auth_logo', authLogo);
            formData.append('favicon', favicon);
            formData.append('home_divider',homeDividerData.home_divider)
            formData.append(
              "home_divider_url",
              JSON.stringify({
                url: homeDividerData.home_divider_url,
                external_link: homeDividerData.external_link,
                new_tab: homeDividerData.new_tab,
              })
            );
            formData.append('agreement_pdf', agreementData?.agreement_pdf);
            formData.append('e_signature', agreementData?.e_signature);

            formData.append('complimentary_attendee_validation', complimentaryValidation ? 1 : 0);
            formData.append('notify_req', notifyReq ? 1 : 0);
            const res = await axios.post(`${api}setting`, formData, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (res.data.status) {
                successAlert('Success', 'App Configuration Stored Successfully');
            }
        } catch (err) {
            // console.log(err);
        }
    };



        return (
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header>
                            <h4 className="card-title">Admin Settings</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Row>
                                    <SiteSettings
                                        logo={logo}
                                        authLogo={authLogo}
                                        setMobileLogo={setMobileLogo}
                                        setWaNumber={setWaNumber}
                                        waNumber={waNumber}
                                        favicon={favicon}
                                        appName={appName}
                                        setLogo={setLogo}
                                        setAuthLogo={setAuthLogo}
                                        setFavicon={setFavicon}
                                        setAppName={setAppName}
                                        complimentaryValidation={complimentaryValidation}
                                        setComplimentaryValidation={setComplimentaryValidation}
                                        missedCallNumber={missedCallNumber}
                                        setMissedCallNumber={setMissedCallNumber}
                                        setNotifyReq={setNotifyReq}
                                        notifyReq={notifyReq}
                                        homeDividerData={homeDividerData}
                                        setHomeDividerData={setHomeDividerData}
                                        agreementData={agreementData}
                                        setAgreementData={setAgreementData}
                                    />
                                    {/* -----------------SEO------------------ */}
                                    <hr className="hr-horizontal" />

                                    <SiteSeoFields
                                        setMetaTag={setMetaTag}
                                        metaTag={metaTag}
                                        setMetaTitle={setMetaTitle}
                                        metaTitle={metaTitle}
                                        metaDescription={metaDescription}
                                        copyright={copyright}
                                        copyrightLink={copyrightLink}
                                        setMetaDescription={setMetaDescription}
                                        setCopyright={setCopyright}
                                        setCopyrightLink={setCopyrightLink}
                                    />
                                    {/* ----------------------------------- */}
                                    <div className='d-flex justify-content-end'>
                                        <Button type="button" onClick={(e) => handleAppConfig(e)}>Submit</Button>
                                    </div>
                                    <hr className="hr-horizontal" />
                                    <WelcomeModal />
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>
        )
    }

    export default AdminSetting