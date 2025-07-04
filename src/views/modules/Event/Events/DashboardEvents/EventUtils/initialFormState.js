export const initialFormState = {
    // Basic Details
    userId: null,
    address: '',
    category: '',
    name: '',
    description: '',
    customerCareNumber: '',
    eventFeature: false,
    status: false,
    houseFull: false,
    smsOtpCheckout: false,
    ticketSystem: false,
    
    // Location
    country: { label: 'India', value: 'India' },
    state: { label: 'Gujarat', value: 'Gujarat' },
    city: '',
    
    // Scan Settings
    multiScan: false,
    scanDetail: { label: 'Both', value: 2 },
    onlineAttSug: false,
    offlineAttSug: false,
    
    // Timing
    dateRange: '',
    startTime: '',
    endTime: '',
    eventType: '',
    
    // Media
    mapCode: '',
    thumbnail: '',
    youtubeUrl: '',
    images: [],
    imagepreview: [],
    layoutImage: '',
    layoutImagePreview: '',
    
    // SEO
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    metaTag: '',
    
    // Ticket
    ticketTerms: '',
    ticketBG: ''
  };