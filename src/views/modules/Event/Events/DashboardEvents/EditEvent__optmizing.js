import React, { useCallback, useEffect, useState } from "react";
import { Row, Col, Image, Button } from "react-bootstrap";
import Card from "../../../../../components/bootstrap/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useMyContext } from "../../../../../Context/MyContextProvider";
import * as moment from "moment";
import Swal from "sweetalert2";
import EventFormTabs from "./EventComponent/EventFormTabs";
import Detail from "./EventComponent/Forms/Detail";
import TimingFieldset from "./EventComponent/Forms/TimingFieldset";
import LocationFieldset from "./EventComponent/Forms/LocationFieldset";
import MediaFieldset from "./EventComponent/Forms/MediaFieldset";
import PublishFieldset from "./EventComponent/Forms/PublishFieldset";
import TicketFieldset from "./EventComponent/Forms/TicketFieldset";
import { customStyles } from "../../CustomComponents/select2";
import { initialFormState } from "./EventUtils/initialFormState";

export const scanOption = [
    { value: 0, label: 'User Detail Only' },
    { value: 1, label: 'Attendee Detail Only' },
    { value: 2, label: 'Both' },
]
const EditEvent = () => {

    const { api, UserList, authToken, userRole, UserData, EventCategory, createSlug, loader, ErrorAlert } = useMyContext();
    const { id } = useParams();
    const [show, AccountShow] = useState("Detail");
    const [loading, setLoading] = useState(true);
    const [validated, setValidated] = useState(false);
    const [validate, setValidate] = useState({
        form1: false,
        form2: false,
        form3: false,
        form4: false,
        form5: false,
        form6: false,
    });
    const [MainId, setMainId] = useState();
    const [categoryList, setCategoryList] = useState();

    // Single form data state
    const [formData, setFormData] = useState({
        ...initialFormState,
        users: [],  // Initialize as empty array
        countries: [{ label: 'India', value: 'India' }],
        states: [{ label: 'Gujarat', value: 'Gujarat' }],
        cities: []
    });
    useEffect(() => {
        if (UserList?.length > 0) {
            const currentUserId = getValue('userId')?.value;
            if (currentUserId) {
                // If we have a userId but no matched user, try to match again
                const matchedUser = UserList.find(option => 
                    parseInt(option.value) === parseInt(currentUserId)
                );
                if (matchedUser) {
                    handleFormChange('userId', matchedUser);
                }
            }
            handleFormChange('users', UserList);
        }
    }, [UserList]);
    

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const getValue = (field) => formData[field];
    const setValue = (field, value) => handleFormChange(field, value);
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
    }, []);


    const GetEventDetail = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${api}event-detail/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + authToken,
                }
            });

            if (response.data.status) {
                const event = response.data.events;

                // Handle date range parsing
                let dateRangeValue = null;
                if (event?.date_range) {
                    const [startDate, endDate] = event.date_range.split(',');
                    dateRangeValue = [new Date(startDate), new Date(endDate)];
                }

                // Parse images
                const parsedImages = event?.images ? JSON.parse(event.images) : [];
                const currentCities = getValue('cities') || [];
                const matchedUser = UserList?.find(option =>
                    parseInt(option.value) === parseInt(event?.user_id)
                );
                // Create new form state
                const updatedFormState = {
                    ...initialFormState,
                    users: UserList || [],
                    userId: matchedUser || null,
                    category: categoryList?.find(option => option.value === event?.category?.id) || '',
                    city: currentCities?.find(option => option.value === event?.city) || '',
                    scanDetail: scanOption?.find(option => parseInt(option.value) === parseInt(event?.scan_detail)) || { label: 'Both', value: 2 },

                    // Basic Details
                    address: event?.address || '',
                    name: event?.name || '',
                    description: event?.description || '',
                    customerCareNumber: event?.customer_care_number || '',
                    eventFeature: Boolean(parseInt(event?.event_feature)),
                    status: Boolean(parseInt(event?.status)),
                    houseFull: Boolean(parseInt(event?.house_full)),
                    smsOtpCheckout: Boolean(parseInt(event?.sms_otp_checkout)),
                    ticketSystem: Boolean(parseInt(event?.ticket_system)),

                    // Scan Settings
                    multiScan: Boolean(parseInt(event?.multi_scan)),
                    onlineAttSug: Boolean(parseInt(event?.online_att_sug)),
                    offlineAttSug: Boolean(parseInt(event?.offline_att_sug)),

                    // Timing
                    dateRange: dateRangeValue,
                    startTime: event?.start_time || '',
                    endTime: event?.end_time || '',
                    eventType: event?.event_type === 'season',

                    // Media
                    mapCode: event?.map_code || '',
                    thumbnail: event?.thumbnail || '',
                    youtubeUrl: event?.youtube_url || '',
                    images: parsedImages,

                    // SEO
                    metaTitle: event?.meta_title || '',
                    metaDescription: event?.meta_description || '',
                    keywords: event?.meta_keyword || '',
                    metaTag: event?.meta_tag || '',

                    // Ticket
                    ticketTerms: event?.ticket_terms || '',
                    ticketBG: event?.ticket_template_id || ''
                };
                setFormData(updatedFormState);
                setMainId(event?.id);
            } else {
                ErrorAlert('Failed to fetch event details');
            }
        } catch (err) {
            ErrorAlert('Error fetching event details:', err);
        } finally {
            setLoading(false);
        }
    }, [api, id, ErrorAlert,authToken, UserList, categoryList, getValue, scanOption, setFormData, setMainId, setLoading]);


    useEffect(() => {
        const state = getValue('state');
        const country = getValue('country');

        if (state?.value && country?.value) {
            axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`, {
                "country": country.value,
                "state": state.value
            })
                .then((res) => {
                    const transformedData = res.data.data.map(city => ({
                        label: city,
                        value: city,
                    }));
                    setValue('cities', [
                        { label: 'Select City', value: 'Select City', isDisabled: true },
                        ...transformedData
                    ]);
                })
                .catch((err) => console.log(err));
        }
    }, [getValue('state')]);


    useEffect(() => {
        if (show !== 'Detail' && id) {
            GetEventDetail();
        }
    }, []);

    // Remove this useEffect entirely and replace with:
    useEffect(() => {
        if (show === 'Detail' && categoryList?.length > 0) {
            GetEventDetail();
            handleFormChange('users', UserList);
        }
    }, [categoryList]);


    useEffect(() => {
        const currentState = getValue('state');
        const currentCountry = getValue('country');

        if (currentState?.value) {
            // Set initial cities array
            handleFormChange('cities', [{ label: 'Select City', value: 'Select City', isDisabled: true }]);

            axios.post(`https://countriesnow.space/api/v0.1/countries/state/cities`, {
                "country": currentCountry?.value,
                "state": currentState?.value
            })
                .then((res) => {
                    const transformedData = res.data.data.map(city => ({
                        label: city,
                        value: city,
                    }));

                    // Update cities in formData
                    handleFormChange('cities', [
                        { label: 'Select City', value: 'Select City', isDisabled: true },
                        ...transformedData
                    ]);
                })
                .catch((err) => {
                    console.error('Error fetching cities:', err);
                    // Reset cities on error
                    handleFormChange('cities', [{
                        label: 'Select City',
                        value: 'Select City',
                        isDisabled: true
                    }]);
                });
        }
    }, [getValue('state')?.value]);



    useEffect(() => {
        if (show === 'Detail' && categoryList?.length > 0) {
            GetEventDetail();
            handleFormChange('users', UserList);
        }
    }, [categoryList]);

    const handleInputChange = (event) => {
        const iframeCode = event.target.value;
        const parser = new DOMParser();
        const doc = parser.parseFromString(iframeCode, 'text/html');
        const iframe = doc.querySelector('iframe');

        if (iframe) {
            handleFormChange('mapCode', iframe.src);
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



    useEffect(() => {
        const currentCity = getValue('city');
        const currentState = getValue('state');

        if (currentCity?.value && currentState?.value) {
            setLoading(false);
        }
    }, [getValue('city')?.value, getValue('state')?.value]);

    const validateForm1 = () => {
        const user = getValue('userId')?.value ||
            (userRole === 'Organizer' ? UserData?.id : UserData?.reporting_user);

        return user &&
            getValue('address') &&
            getValue('category') &&
            getValue('name') &&
            getValue('country') &&
            getValue('state') &&
            getValue('city') &&
            getValue('description') &&
            getValue('customerCareNumber') &&
            getValue('eventFeature') &&
            getValue('status') &&
            getValue('houseFull') &&
            getValue('smsOtpCheckout');
    };

    const validateForm2 = () => {
        return getValue('dateRange') &&
            getValue('startTime') &&
            getValue('endTime') &&
            getValue('eventType') &&
            validate?.form1;
    };
    useEffect(() => {
        if (validateForm1()) {
            setValidate(prevState => ({ ...prevState, form1: true }));
        }
    }, [
        getValue('userId'),
        userRole,
        UserData,
        getValue('address'),
        getValue('category'),
        getValue('name'),
        getValue('country'),
        getValue('state'),
        getValue('city'),
        getValue('description'),
        getValue('customerCareNumber'),
        getValue('eventFeature'),
        getValue('status'),
        getValue('houseFull'),
        getValue('smsOtpCheckout')
    ]);

    useEffect(() => {
        if (validateForm2()) {
            setValidate(prevState => ({ ...prevState, form2: true }));
        }
    }, [
        getValue('dateRange'),
        getValue('startTime'),
        getValue('endTime'),
        getValue('eventType'),
        validate?.form1
    ]);

    useEffect(() => {
        if (getValue('ticketTerms')) {
            setValidate(prevState => ({ ...prevState, form3: true }));
        }
    }, [getValue('ticketTerms')]);


    useEffect(() => {
        if (validate?.form1 && validate?.form2 && validate?.form3) {
            setValidate(prevState => ({
                ...prevState,
                form4: true,
                form5: true
            }));
        }
    }, [validate?.form1, validate?.form2, validate?.form3]);

    useEffect(() => {
        if (getValue('thumbnail')) {
            setValidate(prevState => ({ ...prevState, form6: true }));
        }
    }, [getValue('thumbnail')]);

    useEffect(() => {
        const dateRange = getValue('dateRange');
        const startTime = getValue('startTime');
        const endTime = getValue('endTime');
        const eventType = getValue('eventType');

        if (dateRange && startTime && endTime && eventType) {
            setValidate(prevState => ({ ...prevState, form2: true }));
        }
    }, [
        getValue('dateRange'),
        getValue('startTime'),
        getValue('endTime'),
        getValue('eventType')
    ]);


    const navigate = useNavigate()
    const UpdateEvent = async (event) => {
        const form = event.currentTarget;
        event.preventDefault();

        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            const formData = new FormData();
            const user = getValue('userId')?.value ||
                (userRole === 'Organizer' ? UserData?.id : UserData?.reporting_user);

            // Prepare form data based on current tab
            switch (show) {
                case 'Detail':
                    formData.append('user_id', user);
                    formData.append('address', getValue('address'));
                    formData.append('category', getValue('category')?.value);
                    formData.append('name', getValue('name'));
                    formData.append('country', getValue('country').value);
                    formData.append('state', getValue('state').value);
                    formData.append('city', getValue('city').value);
                    formData.append('description', getValue('description'));
                    formData.append('customer_care_number', getValue('customerCareNumber'));

                    // Boolean values
                    const booleanFields = [
                        'eventFeature', 'status', 'houseFull', 'multiScan',
                        'smsOtpCheckout', 'offlineAttSug', 'onlineAttSug', 'ticketSystem'
                    ];
                    booleanFields.forEach(field => {
                        formData.append(field.toLowerCase(), getValue(field) ? 1 : 0);
                    });

                    formData.append('scan_detail', getValue('scanDetail')?.value);
                    break;

                case 'Timing':
                    formData.append('date_range', handleDateChange(getValue('dateRange')));
                    formData.append('start_time', getValue('startTime'));
                    formData.append('end_time', getValue('endTime'));
                    formData.append('event_type', getValue('eventType') ? 'season' : 'daily');
                    break;

                case 'Ticket':
                    formData.append('ticket_terms', getValue('ticketTerms'));
                    formData.append('ticket_template_id', getValue('ticketBG'));
                    break;

                case 'Location':
                    formData.append('map_code', getValue('mapCode'));
                    break;

                case 'Media':
                    formData.append('name', getValue('name'));
                    formData.append('thumbnail', getValue('thumbnail'));
                    formData.append('youtube_url', getValue('youtubeUrl'));
                    formData.append('layout_image', getValue('layoutImage'));

                    const images = getValue('images');
                    if (images?.length > 0) {
                        ['images_1', 'images_2', 'images_3', 'images_4'].forEach((key, index) => {
                            if (images[index]) {
                                formData.append(key, images[index]);
                            }
                        });
                    }
                    break;

                case 'Publish':
                    formData.append('meta_title', getValue('metaTitle'));
                    formData.append('meta_description', getValue('metaDescription'));
                    formData.append('meta_keyword', getValue('keywords'));
                    formData.append('meta_tag', getValue('metaTag'));
                    break;
            }

            if (id) {
                const response = await axios.post(`${api}update-event/${id}`, formData, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    }
                });

                if (response.data.status) {
                    // Handle successful update
                    setValidated(false);

                    // Update validation states and navigate based on current tab
                    const tabTransitions = {
                        'Detail': { nextTab: 'Timing', form: 'form1' },
                        'Timing': { nextTab: 'Ticket', form: 'form2' },
                        'Ticket': { nextTab: 'Location', form: 'form3' },
                        'Location': { nextTab: 'Media', form: 'form4' },
                        'Media': { nextTab: 'Publish', form: 'form5' },
                        'Publish': null
                    };

                    const transition = tabTransitions[show];
                    if (transition) {
                        setValidate(prev => ({ ...prev, [transition.form]: true }));
                        AccountShow(transition.nextTab);
                    } else {
                        // Handle final publish
                        navigate(`/events/${getValue('city')?.value}/${getValue('userId')?.label}/${createSlug(getValue('name'))}/${id}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error updating event:', error);
            ErrorAlert('Error updating event. Please try again.');
        }
    };

    return (
        <Row>
            <Col sm="12" lg="12">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className="header-title d-flex justify-content-between align-items-center w-100">
                            <h4 className="card-title">Edit Event - {getValue('name')}</h4>
                            <Link to={'/dashboard/events'}>
                                <Button variant="secondary">Go To Events</Button>
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <EventFormTabs validate={validate} show={show} AccountShow={AccountShow} ErrorAlert={ErrorAlert} />
                        {loading || !UserList?.length ? (
                            <fieldset>
                                <div className="loading text-center">
                                    <Image src={loader} width={300} />
                                    <p>Please Wait, Fetching Event Detail</p>
                                </div>
                            </fieldset>
                        ) : (
                        <>
                            <Detail
                                show={show}
                                validated={validated}
                                UpdateEvent={UpdateEvent}
                                userRole={userRole}
                                customStyles={customStyles}
                                categoryList={categoryList}
                                handleFormChange={handleFormChange}
                                getValue={getValue}
                                formData={formData}
                                // Data props
                                users={getValue('users')}
                                userId={getValue('userId')}
                                category={getValue('category')}
                                multiScan={getValue('multiScan')}
                                scanDetail={getValue('scanDetail')}
                                name={getValue('name')}
                                offlineAttSug={getValue('offlineAttSug')}
                                onlineAttSug={getValue('onlineAttSug')}
                                countries={getValue('countries')}
                                country={getValue('country')}
                                states={getValue('states')}
                                state={getValue('state')}
                                cities={getValue('cities')}
                                city={getValue('city')}
                                address={getValue('address')}
                                description={getValue('description')}
                                customerCareNumber={getValue('customerCareNumber')}
                                eventFeature={getValue('eventFeature')}
                                status={getValue('status')}
                                houseFull={getValue('houseFull')}
                                smsOtpCheckout={getValue('smsOtpCheckout')}
                                ticketSystem={getValue('ticketSystem')}
                            />
                            {/* <TimingFieldset
                                    validated={validated}
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
                                    setThumbnail={setThumbnail}
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
                                /> */}
                        </>)
                        }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default EditEvent;
