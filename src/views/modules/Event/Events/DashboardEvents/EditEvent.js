import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Image, Button } from "react-bootstrap";
import Card from "../../../../../components/bootstrap/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import * as moment from "moment";
import EventFormTabs from "./EventComponent/EventFormTabs";
import Detail from "./EventComponent/Forms/Detail";
import TimingFieldset from "./EventComponent/Forms/TimingFieldset";
import LocationFieldset from "./EventComponent/Forms/LocationFieldset";
import MediaFieldset from "./EventComponent/Forms/MediaFieldset";
import PublishFieldset from "./EventComponent/Forms/PublishFieldset";
import TicketFieldset from "./EventComponent/Forms/TicketFieldset";
import { customStyles } from "../../CustomComponents/select2";

export const scanOption = [
    { value: 0, label: 'User Detail Only' },
    { value: 1, label: 'Attendee Detail Only' },
    { value: 2, label: 'Both' },
]
const EditEvent = () => {

    const { api, UserList, authToken, userRole, UserData, EventCategory, createSlug, loader, ErrorAlert } = useMyContext();
    const { id } = useParams();

    const [show, AccountShow] = useState("Detail");
    const [userId, setUserId] = useState();
    const [instaUrl, setInstaUrl] = useState('');
    const [instaThumb, setInstaThumb] = useState(null);
    const [users, setUsers] = useState(UserList);
    const [countries, setCountries] = useState([{ label: 'India', value: 'India' }]);
    const [country, setCountry] = useState({ label: 'India', value: 'India' });

    const [states, setStates] = useState([{ label: 'Gujarat', value: 'Gujarat' }]);
    const [state, setState] = useState({ label: 'Gujarat', value: 'Gujarat' });

    const [cities, setCities] = useState([]);
    const [city, setCity] = useState('');

    const [mutiScan, setMultiScan] = useState('');
    const [tickets, setTickets] = useState([]);
    const [eventId, setEventId] = useState('');
    // Event states 
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [customerCareNumber, setCustomerCareNumber] = useState('');
    const [eventFeature, setEventFeature] = useState('');
    const [status, setStatus] = useState('');
    const [houseFull, setHouseFull] = useState('');
    const [smsOtpCheckout, setSmsOtpCheckout] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [startTime, setStartTime] = useState('');
    const [entryTime, setEntryTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [mapCode, setMapCode] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [images, setImages] = useState([]);
    const [imagepreview, setImagepreview] = useState([]);
    const [idCard,setIdCard] = useState('')
    const [isCircle, setIsCircle] = useState(false);


    // seo states 
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [metaTag, setMetaTag] = useState('');

    const [ticketTerms, setTicketTerms] = useState('');
    const [eventType, setEventType] = useState('');
    const [validated, setValidated] = useState(false);
    const [ticketSystem, setTicketSystem] = useState(false);
    //other
    const [validate, setValidate] = useState({
        form1: false,
        form2: false,
        form3: false,
        form4: false,
        form5: false,
        form6: false,
    });
    const [loading, setLoading] = useState(true);
    const [ticketBG, setTicketBG] = useState('');
    const [MainId, setMainId] = useState();
    const [categoryList, setCategoryList] = useState();
    const [onlineAttSug, setOnlineAttSug] = useState("");
    const [scanDetail, setScanDetail] = useState({ label: 'Both', value: 2 });
    const [offlineAttSug, setOfflineAttSug] = useState("");
    const [layoutImage, setLayoutImage] = useState("");
    const [layoutImagePreview, setLayoutImagePreview] = useState("");

    // saving layout data
    const [layoutData, setLayoutData] = useState({});

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const categories = await EventCategory(setCategoryList);
                setCategoryList(categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategoryData();
        setUsers(UserList);
    }, []);


    const GetEventDetail = useCallback(async () => {
        await axios.get(`${api}event-detail/${id}`, {
            headers: {
                'Authorization': 'Bearer ' + authToken,
            }
        }).then((res) => {
            if (res.data.status) {
                const event = res.data.events;
                setMainId(event?.id)
                if (UserList?.length > 0) {
                    const matchedUser = UserList.find(option => parseInt(option.value) === parseInt(event?.user_id));
                    setUserId(matchedUser);
                }
                if (scanOption?.length > 0) {
                    const matchedOption = scanOption.find(option => parseInt(option.value) === parseInt(event?.scan_detail));
                    setScanDetail(matchedOption);
                }
                if (categoryList?.length > 0) {
                    const matchedCategory = categoryList?.find(option => option.value === event?.category?.id);
                    setCategory(matchedCategory);
                }

                setAddress(event?.address);
                setName(event?.name);
                const cityValue = {
                    label: event.city,
                    value: event.city
                };
                if (event?.city) {
                    setCity(cityValue);
                }
                setDescription(event?.description);
                setCustomerCareNumber(event?.customer_care_number);
                setEventFeature(parseInt(event?.event_feature) === 1 ? true : false);
                setStatus(parseInt(event?.status) === 1 ? true : false);
                setMultiScan(parseInt(event?.multi_scan) === 1 ? true : false);
                setHouseFull(parseInt(event?.house_full) === 1 ? true : false);

                setOnlineAttSug(parseInt(event?.online_att_sug) === 1 ? true : false);
                setTicketSystem(parseInt(event?.ticket_system) === 1 ? true : false);
                setOfflineAttSug(parseInt(event?.offline_att_sug) === 1 ? true : false);
                setTicketTerms(event?.ticket_terms);
                setSmsOtpCheckout(event?.sms_otp_checkout);
                setTicketBG(event?.ticket_template_id)
                if (event?.date_range) {
                    const [startDate, endDate] = event?.date_range?.split(',');
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    setDateRange([start, end]);
                }
                setStartTime(event.start_time);
                setEntryTime(event.entry_time);
                setEndTime(event.end_time);
                setEventType(event?.event_type === 'season' ? true : false);
                if (event?.map_code) {
                    setMapCode(event?.map_code);
                }
                setThumbnail(event?.thumbnail);
                setIdCard(event?.card_url);
                setYoutubeUrl(event?.youtube_url);
                setImages(event?.images ? JSON.parse(event?.images) : []);

                setMetaTitle(event.meta_title || '');
                setMetaDescription(event.meta_description || '');
                setKeywords(event.meta_keyword || '');
                setMetaTag(event.meta_tag || '');

                const parsed = event.event_layout || {};

          const transformedLayout = {
            userPhoto: JSON.parse(parsed.user_photo || "{}"),
            textValue_0: JSON.parse(parsed.text_1 || "{}"),
            textValue_1: JSON.parse(parsed.text_2 || "{}"),
            textValue_2: JSON.parse(parsed.text_3 || "{}"),
            qrCode: JSON.parse(parsed.qr_code || "{}"),
            zoneGroup: JSON.parse(parsed.zones || "{}"),
          };

          setLayoutData(transformedLayout);
          setIsCircle(transformedLayout.userPhoto?.isCircle || false);
            }
        }).catch((err) =>
            console.log(err)
        )
    }, [api, id, authToken, UserList, scanOption, categoryList]);

    useEffect(() => {
        if (state?.value && country?.value) {
            setCities([{ label: 'Select City', value: 'Select City', isDisabled: true }]);
            axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`, {
                "country": country.value,
                "state": state.value
            })
                .then((res) => {
                    let data = res.data.data;
                    const transformedData = data.map(city => ({
                        label: city,
                        value: city,
                    }));
                    setCities([{ label: 'Select City', value: 'Select City', isDisabled: true }, ...transformedData]);
                }).catch((err) => {
                    console.log(err);
                });
        }
    }, [state?.value, country?.value]);

    useEffect(() => {
        setEventId(id)
        if (show !== 'Detail') {
            GetEventDetail();
        }
    }, [id])

    useEffect(() => {
        if (show === 'Detail' && categoryList?.length > 0 && cities?.length > 0) {
            GetEventDetail();
            setUsers(UserList);
        }
    }, [show, categoryList, cities]);


    useEffect(() => {
        if (state) {
            setCities([{ label: 'Select City', value: 'Select City' }])
            axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`, { "country": country?.value, "state": state?.value })
                .then((res) => {
                    let data = res.data.data;
                    const transformedData = data.map(city => ({
                        label: city,
                        value: city,
                    }))
                    setCities([{ label: 'Select City', value: 'Select City', isDisabled: true }, ...transformedData])
                }).catch((err) => {
                    console.log(err)
                })
        }
    }, [state])



    useEffect(() => {
        if (show === 'Detail') {
            GetEventDetail();
        }
    }, [users]);
    const handleInputChange = (event) => {
        const iframeCode = event.target.value;
        const parser = new DOMParser();
        const doc = parser.parseFromString(iframeCode, 'text/html');
        const iframe = doc.querySelector('iframe');
        if (iframe) {
            setMapCode(iframe.src);
        }
    };

    const handleDateChange = (dates) => {
        let formattedDates = [];

        if (dates.length === 1 && moment(dates[0]).isValid()) {
            formattedDates = moment(dates[0]).format('YYYY-MM-DD');
        } else if (dates.length === 2 && moment(dates[0]).isSame(dates[1], 'day')) {
            if (moment(dates[0]).isValid()) {
                formattedDates = [moment(dates[0]).format('YYYY-MM-DD')];
            }
        } else if (dates.length > 1) {
            formattedDates = dates
                .filter(date => moment(date).isValid())
                .map(date => moment(date).format('YYYY-MM-DD'));
        }

        // console.log(formattedDates);
        return formattedDates;
    };

    const handleSelectValue = (value, state) => {
        state(value)
    }

    useEffect(() => {
        if (city && state) {
            setLoading(false)
        }
    }, [country, city, state]);

    const validateForm1 = () => {
        const user = userId?.value || (userRole === 'Organizer' ? UserData?.id : UserData?.reporting_user);
        return user && address && category && name && country && state && city && description && customerCareNumber && eventFeature && status && houseFull && smsOtpCheckout;
    };

    const validateForm2 = () => {
        return dateRange && startTime && endTime && eventType && validate?.form1;
    };
    useEffect(() => {
        if (validateForm1()) {
            setValidate(prevState => ({ ...prevState, form1: true }));
        }
    }, [userId, userRole, UserData, address, category, name, country, state, city, description, customerCareNumber, eventFeature, status, houseFull, smsOtpCheckout]);

    useEffect(() => {
        if (validateForm2()) {
            setValidate(prevState => ({ ...prevState, form2: true }));
        }
    }, [dateRange, startTime, endTime, eventType, validate?.form1]);

    useEffect(() => {
        if (ticketTerms) {
            setValidate(prevState => ({ ...prevState, form3: true }));
        }
    }, [ticketTerms]);


    useEffect(() => {
        if (validate?.form1 && validate?.form2 && validate?.form3) {
            setValidate(prevState => ({ ...prevState, form4: true }));
            setValidate(prevState => ({ ...prevState, form5: true }));
        }
    }, [ticketTerms]);

    useEffect(() => {
        if (thumbnail) {
            setValidate(prevState => ({ ...prevState, form6: true }));
        }
    }, [thumbnail]);

    useEffect(() => {
        if (dateRange && startTime && endTime && eventType) {
            setValidate(prevState => ({ ...prevState, form2: true }));
        }

    }, [dateRange, startTime, endTime, eventType]);



    const navigate = useNavigate()
    const UpdateEvent = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            // let user = userId?.value || (userRole === 'Organizer' ? UserData?.id : UserData?.reporting_user);
            const formData = new FormData();
            if (show === 'Detail') {
                // formData.append('user_id', user);
                formData.append('address', address);
                formData.append('category', category?.value);
                formData.append('name', name);
                formData.append('country', country.value);
                formData.append('state', state.value);
                formData.append('city', city.value);
                formData.append('description', description);
                // formData.append('customer_care_number', customerCareNumber);

                formData.append('event_feature', eventFeature === true ? 1 : 0);
                formData.append('status', status === true ? 1 : 0);
                formData.append('house_full', houseFull === true ? 1 : 0);
                formData.append('multi_scan', mutiScan === true ? 1 : 0);
                formData.append('sms_otp_checkout', smsOtpCheckout === true ? 1 : 0);
                formData.append('offline_att_sug', offlineAttSug === true ? 1 : 0);
                formData.append('online_att_sug', onlineAttSug === true ? 1 : 0);
                formData.append('ticket_system', ticketSystem === true ? 1 : 0);

                formData.append('scan_detail', scanDetail?.value);
            }
            else if (show === 'Timing') {
                formData.append('date_range', handleDateChange(dateRange));
                formData.append('start_time', startTime);
                formData.append('end_time', endTime);
                formData.append('entry_time', entryTime);
                formData.append('event_type', eventType ? 'season' : 'daily');
            }
            else if (show === 'Ticket') {
                formData.append('ticket_terms', ticketTerms);
                formData.append('ticket_template_id', ticketBG);
            }
            else if (show === 'Location') {
                formData.append('map_code', mapCode);
            }
            else if (show === 'Media') {
                formData.append('name', name);
                formData.append('thumbnail', thumbnail);
                formData.append('youtube_url', youtubeUrl);
                formData.append('layout_image', layoutImage);
                formData.append('insta_url', instaUrl);
                formData.append('insta_thumb', instaThumb);
                formData.append('card_url', idCard);
                formData.append("layout", JSON.stringify(layoutData));


                if (images.length > 0) {
                    formData.append('images_1', images[0]);
                    formData.append('images_2', images[1]);
                    formData.append('images_3', images[2]);
                    formData.append('images_4', images[3]);
                }
            } else {
                formData.append('meta_title', metaTitle);
                formData.append('meta_description', metaDescription);
                formData.append('meta_keyword', keywords);
                formData.append('meta_tag', metaTag);
            }
            if (eventId) {
                await axios.post(`${api}update-event/${eventId}`, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + authToken,
                    }
                })
                    .then((res) => {
                        //setEventId(res.data.event?.id)
                        if (res.data.status) {
                            setTickets(res.data.event?.tickets)
                            if (show === 'Detail') {
                                setValidate(prevState => ({ ...prevState, form1: true }));
                                setValidated(false)
                                AccountShow('Timing')
                            } else if (show === 'Timing') {
                                setValidate(prevState => ({ ...prevState, form2: true }));
                                setValidated(false)
                                AccountShow('Ticket')
                            } else if (show === 'Ticket') {
                                setValidate(prevState => ({ ...prevState, form3: true }));
                                setValidated(false)
                                AccountShow('Location')
                            } else if (show === 'Location') {
                                setValidate(prevState => ({ ...prevState, form4: true }));
                                setValidated(false)
                                AccountShow('Media')
                            } else if (show === 'Media') {
                                setValidate(prevState => ({ ...prevState, form5: true }));
                                setValidated(false)
                                AccountShow('Publish')
                            } else {
                                navigate(`/events/${city?.value}/${userId?.label}/${createSlug(name)}/${id}`)
                            }
                        }
                    }).catch((err) =>
                        console.log(err)
                    )
            }
            setValidated(true);
        }
    };

    return (
        <Row>
            <Col sm="12" lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title d-flex justify-content-between align-items-center w-100">
                            <h4 className="card-title">Edit Event - {name}</h4>
                            <Link to={'/dashboard/events'}>
                                <Button variant="secondary">Go To Events</Button>
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <EventFormTabs validate={validate} show={show} AccountShow={AccountShow} ErrorAlert={ErrorAlert} />
                        {loading ?
                            <fieldset>
                                <div className="loading text-center">
                                    <Image src={loader} width={300} />
                                    <p>Please Wait, Fetching Event Detail</p>
                                </div>
                            </fieldset>
                            :
                            <>
                                <Detail
                                    show={show}
                                    validated={validated}
                                    UpdateEvent={UpdateEvent}
                                    userRole={userRole}
                                    users={users}
                                    userId={userId}
                                    customStyles={customStyles}
                                    setUserId={setUserId}
                                    categoryList={categoryList}
                                    category={category}
                                    setMultiScan={setMultiScan}
                                    mutiScan={mutiScan}
                                    setScanDetail={setScanDetail}
                                    scanDetail={scanDetail}
                                    setCategory={setCategory}
                                    handleSelectValue={handleSelectValue}
                                    name={name}
                                    offlineAttSug={offlineAttSug}
                                    setOfflineAttSug={setOfflineAttSug}
                                    setOnlineAttSug={setOnlineAttSug}
                                    onlineAttSug={onlineAttSug}
                                    setName={setName}
                                    countries={countries}
                                    country={country}
                                    // setCountry={setCountry}
                                    // handleSelectCounty={handleSelectCounty}
                                    states={states}
                                    state={state}
                                    setState={setState}
                                    cities={cities}
                                    city={city}
                                    setCity={setCity}
                                    address={address}
                                    setAddress={setAddress}
                                    description={description}
                                    setDescription={setDescription}
                                    customerCareNumber={customerCareNumber}
                                    setCustomerCareNumber={setCustomerCareNumber}
                                    eventFeature={eventFeature}
                                    setEventFeature={setEventFeature}
                                    status={status}
                                    setStatus={setStatus}
                                    houseFull={houseFull}
                                    setHouseFull={setHouseFull}
                                    smsOtpCheckout={smsOtpCheckout}
                                    setSmsOtpCheckout={setSmsOtpCheckout}
                                    ticketSystem={ticketSystem}
                                    setTicketSystem={setTicketSystem}
                                />
                                <TimingFieldset
                                    validated={validated}
                                    setEntryTime={setEntryTime}
                                    entryTime={entryTime}
                                    UpdateEvent={UpdateEvent}
                                    dateRange={dateRange}
                                    setDateRange={setDateRange}
                                    startTime={startTime}
                                    setStartTime={setStartTime}
                                    endTime={endTime}
                                    setEndTime={setEndTime}
                                    eventType={eventType}
                                    setEventType={setEventType}
                                    show={show}
                                    handleDateChange={handleDateChange}
                                />
                                <TicketFieldset
                                    validated={validated}
                                    UpdateEvent={UpdateEvent}
                                    MainId={MainId}
                                    name={name}
                                    ticketTerms={ticketTerms}
                                    setTicketTerms={setTicketTerms}
                                    ticketBG={ticketBG}
                                    setTicketBG={setTicketBG}
                                    show={show}
                                    AccountShow={AccountShow}
                                />
                                <LocationFieldset
                                    validated={validated}
                                    UpdateEvent={UpdateEvent}
                                    mapCode={mapCode}
                                    handleInputChange={handleInputChange}
                                    show={show}
                                />
                                <MediaFieldset
                                    instaUrl={instaUrl}
                                    setInstaUrl={setInstaUrl}
                                    instaThumb={instaThumb}
                                    setInstaThumb={setInstaThumb}

                                    setThumbnail={setThumbnail}
                                    setIdCard={setIdCard}
                                    idCard={idCard}
                                    setImagepreview={setImagepreview}
                                    validated={validated}
                                    setImages={setImages}
                                    UpdateEvent={UpdateEvent}
                                    images={images}
                                    layoutImagePreview={layoutImagePreview}
                                    setLayoutImagePreview={setLayoutImagePreview}
                                    layoutImage={layoutImage}
                                    setLayoutImage={setLayoutImage}
                                    // handleImageChange={handleImageChange}
                                    imagepreview={imagepreview}
                                    youtubeUrl={youtubeUrl}
                                    setYoutubeUrl={setYoutubeUrl}
                                    show={show}
                                    isCircle={isCircle}
                                    setIsCircle={setIsCircle}
                                    setLayoutData={setLayoutData}
                                    savedLayout={layoutData}
                                />
                                <PublishFieldset
                                    metaTitle={metaTitle}
                                    setMetaTitle={setMetaTitle}
                                    metaDescription={metaDescription}
                                    setMetaDescription={setMetaDescription}
                                    keywords={keywords}
                                    setKeywords={setKeywords}
                                    metaTag={metaTag}
                                    setMetaTag={setMetaTag}
                                    name={name}
                                    id={MainId}
                                    validated={validated}
                                    UpdateEvent={UpdateEvent}
                                    show={show}
                                />
                            </>
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default EditEvent;
