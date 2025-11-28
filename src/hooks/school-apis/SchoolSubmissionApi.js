import axios from 'axios';

// Use full URL - CORS needs to be configured on the backend
// For development: http://localhost:8080/api
// For production: Use environment variable REACT_APP_API_BASE_URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Submit school application sale and confirmation data
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitSchoolApplicationSale = async (payload) => {
  try {
    const endpoint = '/application-confirmation/confirm-school';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting school application sale:', error);
    console.error('📡 Request URL:', `${BASE_URL}/application-confirmation/confirm-school`);
    
    // Log detailed error information
    if (error.response) {
      // Server responded with error status
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // If 500 error, show backend error details
      if (error.response.status === 500) {
        console.error('⚠️ 500 Internal Server Error - Backend processing failed:');
        console.error('   Check backend server logs for detailed error message');
        console.error('   Common causes:');
        console.error('   1. Payload structure doesn\'t match backend expectations');
        console.error('   2. Missing required fields in the payload');
        console.error('   3. Database constraint violations');
        console.error('   4. Null pointer exceptions in backend code');
        console.error('   Backend error details:', error.response.data);
      }
      
      // If 404, suggest checking the endpoint path
      if (error.response.status === 404) {
        console.error('⚠️ 404 Not Found - Please verify:');
        console.error('   1. Backend server is running on http://localhost:8080');
        console.error('   2. Endpoint path is correct: /api/application-confirmation/confirm-school');
        console.error('   3. Backend controller has @PostMapping("/confirm-school") or equivalent');
        console.error('   4. Check if endpoint needs different path');
      }
      
      // If 400 Bad Request
      if (error.response.status === 400) {
        console.error('⚠️ 400 Bad Request - Payload validation failed:');
        console.error('   Check if all required fields are present and correctly formatted');
        console.error('   Backend validation errors:', error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('📊 Network Error - No response from server:', {
        message: error.message,
        code: error.code
      });
      
      // If CORS error
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
        console.error('⚠️ CORS Error - Backend needs CORS configuration:');
        console.error('   Your CORS config looks correct, but verify it\'s being applied');
        console.error('   Make sure the CORS config bean is being loaded');
      }
    } else {
      // Something else happened
      console.error('📊 Request Setup Error:', error.message);
    }
    
    throw error;
  }
};

/**
 * Map form data to API payload structure
 * @param {Object} formData - Form data from SchoolSaleConfFormsCont
 * @param {Array} siblings - Siblings array
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from overview (contains studAdmsNo, applicationNo, etc.)
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapFormDataToPayload = (formData, siblings, paymentData, detailsObject, activeTab) => {
  // Helper function to convert value to number or return 0
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Helper function to convert value to string
  const toString = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to convert date string to ISO format
  const toISODate = (dateString) => {
    if (!dateString) return new Date().toISOString();
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  // Get payment mode ID based on active tab
  const getPaymentModeId = () => {
    switch (activeTab) {
      case 'cash': return 1; // Assuming 1 = Cash
      case 'dd': return 2; // Assuming 2 = DD
      case 'cheque': return 3; // Assuming 3 = Cheque
      case 'card': return 4; // Assuming 4 = Card
      default: return 0;
    }
  };

  // Map parents array
  const parents = [];
  
  // Father - relationTypeId: 1
  if (formData.fatherName || formData.fatherPhone || formData.fatherEmail) {
    parents.push({
      name: toString(formData.fatherName),
      relationTypeId: 1, // Father
      occupation: toString(formData.fatherOccupation),
      otherOccupation: toString(formData.fatherOtherOccupation),
      mobileNo: toNumber(formData.fatherPhone),
      email: toString(formData.fatherEmail),
      createdBy: 0, // Update with actual user ID
      sectorId: toNumber(formData.fatherSector)
    });
  }

  // Mother - relationTypeId: 2
  if (formData.motherName || formData.motherPhone || formData.motherEmail) {
    parents.push({
      name: toString(formData.motherName),
      relationTypeId: 2, // Mother
      occupation: toString(formData.motherOccupation),
      otherOccupation: toString(formData.motherOtherOccupation),
      mobileNo: toNumber(formData.motherPhone),
      email: toString(formData.motherEmail),
      createdBy: 0, // Update with actual user ID
      sectorId: toNumber(formData.motherSector)
    });
  }

  // Map siblings array
  const mappedSiblings = siblings
    .filter(sibling => sibling.siblingName || sibling.siblingSchool || sibling.siblingClass)
    .map(sibling => ({
      fullName: toString(sibling.siblingName),
      schoolName: toString(sibling.siblingSchool),
      classId: toNumber(sibling.siblingClass),
      relationTypeId: toNumber(sibling.siblingRelation),
      genderId: 0, // Add gender field if available in form
      createdBy: 0 // Update with actual user ID
    }));

  // Map languages array
  const languages = [];
  if (formData.firstLanguage) {
    languages.push({
      langId: toNumber(formData.firstLanguage),
      languageName: toString(formData.firstLanguage) // You may need to get the name from ID
    });
  }
  if (formData.secondLanguage) {
    languages.push({
      langId: toNumber(formData.secondLanguage),
      languageName: toString(formData.secondLanguage)
    });
  }
  if (formData.thirdLanguage) {
    languages.push({
      langId: toNumber(formData.thirdLanguage),
      languageName: toString(formData.thirdLanguage)
    });
  }

  // Map concessions array
  const concessions = [];
  
  // Admission Fee Concession
  if (formData.admissionConcession && formData.admissionConcessionTypeId) {
    concessions.push({
      concessionTypeId: toNumber(formData.admissionConcessionTypeId),
      concessionAmount: toNumber(formData.admissionConcession),
      givenById: 0, // Add if available
      authorizedById: toNumber(formData.authorizedBy),
      reasonId: toNumber(formData.concessionReason),
      comments: toString(formData.concessionDescription),
      createdBy: 0, // Update with actual user ID
      concReferedBy: toNumber(formData.referredBy)
    });
  }

  // Tuition Fee Concession
  if (formData.tuitionConcession && formData.tuitionConcessionTypeId) {
    concessions.push({
      concessionTypeId: toNumber(formData.tuitionConcessionTypeId),
      concessionAmount: toNumber(formData.tuitionConcession),
      givenById: 0, // Add if available
      authorizedById: toNumber(formData.authorizedBy),
      reasonId: toNumber(formData.concessionReason),
      comments: toString(formData.concessionDescription),
      createdBy: 0, // Update with actual user ID
      concReferedBy: toNumber(formData.referredBy)
    });
  }

  // Map payment details based on active tab
  const paymentDetails = {
    paymentModeId: getPaymentModeId(),
    paymentDate: toISODate(paymentData.paymentDate || paymentData.card_paymentDate),
    amount: toNumber(paymentData.amount || paymentData.card_amount || paymentData.dd_amount || paymentData.cheque_amount),
    prePrintedReceiptNo: toString(paymentData.prePrinted || paymentData.card_receiptNo || paymentData.dd_receiptNo || paymentData.cheque_receiptNo),
    remarks: toString(paymentData.remarks || paymentData.card_remarks || paymentData.dd_remarks || paymentData.cheque_remarks),
    createdBy: 0, // Update with actual user ID
    transactionNumber: toString(paymentData.dd_transactionNo || paymentData.cheque_transactionNo || ''),
    transactionDate: toISODate(paymentData.dd_transactionDate || paymentData.cheque_transactionDate),
    organisationId: toNumber(paymentData.dd_org || paymentData.cheque_org || 0),
    bankId: toNumber(paymentData.dd_bank || paymentData.cheque_bank || 0),
    branchId: toNumber(paymentData.dd_branch || paymentData.cheque_branch || 0),
    ifscCode: toString(paymentData.dd_ifsc || paymentData.cheque_ifsc || ''),
    cityId: toNumber(paymentData.dd_city || paymentData.cheque_city || 0)
  };

  // Build the complete payload
  // Debug: Log form data values before conversion
  console.log('🔍 Form Data Values Before Mapping:');
  console.log('  foodType:', formData.foodType, 'Type:', typeof formData.foodType);
  console.log('  bloodGroup:', formData.bloodGroup, 'Type:', typeof formData.bloodGroup);
  console.log('  caste:', formData.caste, 'Type:', typeof formData.caste);
  console.log('  religion:', formData.religion, 'Type:', typeof formData.religion);
  console.log('  orientationName:', formData.orientationName, 'Type:', typeof formData.orientationName);
  console.log('  scoreAppNo:', formData.scoreAppNo);
  console.log('  scoreMarks:', formData.scoreMarks);
  console.log('  Parents - Father:', formData.fatherName, 'Mother:', formData.motherName);
  console.log('  Siblings count:', siblings?.length || 0);
  console.log('  Languages:', formData.firstLanguage, formData.secondLanguage, formData.thirdLanguage);
  console.log('  Concessions - Admission:', formData.admissionConcession, 'Tuition:', formData.tuitionConcession);
  
  const payload = {
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0),
    createdBy: 0, // Update with actual user ID
    appConfDate: new Date().toISOString(),
    foodTypeId: toNumber(formData.foodType),
    bloodGroupId: toNumber(formData.bloodGroup),
    casteId: toNumber(formData.caste),
    religionId: toNumber(formData.religion),
    htNo: toString(formData.htNo || ''), // Add if available in form
    orientationId: toNumber(formData.orientationName),
    orientationBatchId: 0, // Add if available
    orientationDate: toISODate(formData.orientationDate || ''), // Add if available
    schoolStateId: 0, // Add if available
    schoolDistrictId: 0, // Add if available
    schoolTypeId: 0, // Add if available
    schoolName: toString(formData.schoolName || ''), // Add if available
    scoreAppNo: toString(formData.scoreAppNo || ''),
    marks: toNumber(formData.scoreMarks),
    parents: parents,
    siblings: mappedSiblings,
    languages: languages,
    concessions: concessions,
    paymentDetails: paymentDetails
  };

  // Log the final payload structure
  console.log('✅ Payload Created Successfully:');
  console.log('  - Total fields:', Object.keys(payload).length);
  console.log('  - Parents array:', payload.parents.length, 'items');
  console.log('  - Siblings array:', payload.siblings.length, 'items');
  console.log('  - Languages array:', payload.languages.length, 'items');
  console.log('  - Concessions array:', payload.concessions.length, 'items');
  console.log('  - Payment details:', Object.keys(payload.paymentDetails).length, 'fields');

  return payload;
};

