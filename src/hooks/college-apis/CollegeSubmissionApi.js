import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Submit college application confirmation data
 * @param {Object} payload - The complete payload matching the API structure
 * @returns {Promise} - Axios response
 */
export const submitCollegeApplicationConfirmation = async (payload) => {
  try {
    const endpoint = '/student_fast_sale/college-confirmation';
    const fullUrl = `${BASE_URL}${endpoint}`;
    console.log('🌐 Submitting to:', fullUrl);
    console.log('📦 Payload size:', JSON.stringify(payload).length, 'bytes');
    
    const response = await apiClient.post(endpoint, payload);
    console.log('✅ Response received:', response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error('❌ Error submitting college application confirmation:', error);
    console.error('📡 Request URL:', `${BASE_URL}/student_fast_sale/college-confirmation`);
    
    // Log detailed error information
    if (error.response) {
      console.error('📊 Server Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
      
      if (error.response.status === 500) {
        console.error('⚠️ 500 Internal Server Error - Backend processing failed:');
        console.error('   Check backend server logs for detailed error message');
        console.error('   Backend error details:', error.response.data);
      }
    }
    
    throw error;
  }
};

/**
 * Map college form data to API payload structure
 * @param {Object} formData - Form data from CollegeAppConfContainer
 * @param {Object} academicFormData - Academic form data (from CollegeOrientInfoForms)
 * @param {Object} paymentData - Payment form data
 * @param {Object} detailsObject - Details object from overview
 * @param {String} activeTab - Active payment tab (cash, dd, cheque, card)
 * @returns {Object} - Mapped payload matching API structure
 */
export const mapCollegeFormDataToPayload = (formData, academicFormData, paymentData, detailsObject, activeTab) => {
  // Helper function to convert value to number or return 0
  const toNumber = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    
    // If value is a string in "name - id" format, extract the ID
    if (typeof value === 'string' && value.includes(' - ')) {
      const parts = value.split(' - ');
      if (parts.length >= 2) {
        const extractedId = parts[parts.length - 1].trim();
        const num = Number(extractedId);
        if (!isNaN(num)) {
          return num;
        }
      }
    }
    
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
      case 'cash': return 1;
      case 'dd': return 2;
      case 'cheque': return 3;
      case 'card': return 4;
      default: return 0;
    }
  };

  // Map concessions array
  const concessions = [];
  
  // Log all form data before processing
  console.log('🔍 ===== COLLEGE FORM DATA BEFORE MAPPING =====');
  console.log('Full formData object:', formData);
  console.log('  - firstYearConcession:', formData.firstYearConcession, 'Type:', typeof formData.firstYearConcession);
  console.log('  - firstYearConcessionTypeId:', formData.firstYearConcessionTypeId, 'Type:', typeof formData.firstYearConcessionTypeId);
  console.log('  - secondYearConcession:', formData.secondYearConcession, 'Type:', typeof formData.secondYearConcession);
  console.log('  - secondYearConcessionTypeId:', formData.secondYearConcessionTypeId, 'Type:', typeof formData.secondYearConcessionTypeId);
  console.log('  - concessionReason:', formData.concessionReason, 'Type:', typeof formData.concessionReason);
  console.log('  - authorizedBy:', formData.authorizedBy, 'Type:', typeof formData.authorizedBy);
  console.log('  - referredBy:', formData.referredBy, 'Type:', typeof formData.referredBy);
  console.log('  - description:', formData.description);
  console.log('===============================================');
  
  // First Year Concession - Only add if reasonId is provided (required by database)
  if (formData.firstYearConcession && formData.firstYearConcessionTypeId) {
    console.log('✅ First Year Concession found - checking reasonId...');
    console.log('  - Raw concessionReason value:', formData.concessionReason, 'Type:', typeof formData.concessionReason);
    
    // Extract reasonId - handle both ID format and "name - id" format
    let reasonId = 0;
    if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        // Extract ID from "name - id" format
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          const extractedId = parts[parts.length - 1].trim();
          reasonId = Number(extractedId);
          console.log('  - Extracted ID from "name - id" format:', extractedId, '->', reasonId);
        }
      } else {
        // Try to convert directly
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted directly to number:', reasonId);
      }
    }
    
    console.log('  - Final reasonId:', reasonId, 'from:', formData.concessionReason);
    
    if (reasonId > 0) { // Only add if reasonId is valid (not 0 or null)
      // Extract authorizedBy and referredBy IDs (handle "name - id" format)
      const authorizedById = toNumber(formData.authorizedBy);
      const referredById = toNumber(formData.referredBy);
      
      const concession = {
        concessionTypeId: toNumber(formData.firstYearConcessionTypeId),
        concessionAmount: toNumber(formData.firstYearConcession),
        givenById: 0, // Add if available
        authorizedById: authorizedById,
        reasonId: reasonId, // Required field - must not be null
        comments: toString(formData.description),
        createdBy: 0, // Update with actual user ID
        concReferedBy: referredById
      };
      concessions.push(concession);
      console.log('✅ First Year Concession added:', concession);
    } else {
      console.warn('⚠️ First Year Concession SKIPPED: reasonId is required but not provided or is 0');
      console.warn('   - reasonId value:', reasonId);
      console.warn('   - concessionReason from formData:', formData.concessionReason);
    }
  } else {
    console.log('ℹ️ First Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.firstYearConcession);
    console.log('   - Has typeId?', !!formData.firstYearConcessionTypeId);
  }

  // Second Year Concession - Only add if reasonId is provided (required by database)
  if (formData.secondYearConcession && formData.secondYearConcessionTypeId) {
    console.log('✅ Second Year Concession found - checking reasonId...');
    console.log('  - Raw concessionReason value:', formData.concessionReason, 'Type:', typeof formData.concessionReason);
    
    // Extract reasonId - handle both ID format and "name - id" format
    let reasonId = 0;
    if (formData.concessionReason) {
      if (typeof formData.concessionReason === 'string' && formData.concessionReason.includes(' - ')) {
        // Extract ID from "name - id" format
        const parts = formData.concessionReason.split(' - ');
        if (parts.length >= 2) {
          const extractedId = parts[parts.length - 1].trim();
          reasonId = Number(extractedId);
          console.log('  - Extracted ID from "name - id" format:', extractedId, '->', reasonId);
        }
      } else {
        // Try to convert directly
        reasonId = toNumber(formData.concessionReason);
        console.log('  - Converted directly to number:', reasonId);
      }
    }
    
    console.log('  - Final reasonId:', reasonId, 'from:', formData.concessionReason);
    
    if (reasonId > 0) { // Only add if reasonId is valid (not 0 or null)
      // Extract authorizedBy and referredBy IDs (handle "name - id" format)
      const authorizedById = toNumber(formData.authorizedBy);
      const referredById = toNumber(formData.referredBy);
      
      const concession = {
        concessionTypeId: toNumber(formData.secondYearConcessionTypeId),
        concessionAmount: toNumber(formData.secondYearConcession),
        givenById: 0, // Add if available
        authorizedById: authorizedById,
        reasonId: reasonId, // Required field - must not be null
        comments: toString(formData.description),
        createdBy: 0, // Update with actual user ID
        concReferedBy: referredById
      };
      concessions.push(concession);
      console.log('✅ Second Year Concession added:', concession);
    } else {
      console.warn('⚠️ Second Year Concession SKIPPED: reasonId is required but not provided or is 0');
      console.warn('   - reasonId value:', reasonId);
      console.warn('   - concessionReason from formData:', formData.concessionReason);
    }
  } else {
    console.log('ℹ️ Second Year Concession not added - missing amount or typeId');
    console.log('   - Has amount?', !!formData.secondYearConcession);
    console.log('   - Has typeId?', !!formData.secondYearConcessionTypeId);
  }
  
  // Log final concession mapping details
  console.log('🔍 ===== CONCESSION MAPPING SUMMARY =====');
  console.log('  - Total Concessions Created:', concessions.length);
  console.log('  - Concessions Array:', concessions);
  console.log('=========================================');

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
  console.log('🔍 College Form Data Values Before Mapping:');
  console.log('  academicYearId:', formData.academicYearId || detailsObject?.academicYearId);
  console.log('  joiningClassId:', academicFormData?.joiningClassId);
  console.log('  branchId:', academicFormData?.branchId);
  console.log('  studentTypeId:', academicFormData?.studentTypeId);
  console.log('  cityId:', academicFormData?.cityId);
  console.log('  courseNameId:', academicFormData?.courseNameId);
  console.log('  studAdmsNo:', detailsObject?.applicationNo);
  console.log('  Concessions - First Year:', formData.firstYearConcession, 'Second Year:', formData.secondYearConcession);

  const payload = {
    academicYearId: toNumber(formData.academicYearId || detailsObject?.academicYearId || 0),
    joiningClassId: toNumber(academicFormData?.joiningClassId || 0),
    branchId: toNumber(academicFormData?.branchId || 0),
    studentTypeId: toNumber(academicFormData?.studentTypeId || 0),
    cityId: toNumber(academicFormData?.cityId || 0),
    courseNameId: toNumber(academicFormData?.courseNameId || academicFormData?.orientationId || 0),
    studAdmsNo: toNumber(detailsObject?.applicationNo || detailsObject?.studAdmsNo || 0),
    createdBy: 0, // Update with actual user ID
    concessions: concessions, // Always include concessions array (even if empty)
    paymentDetails: paymentDetails
  };
  
  // Final payload validation
  console.log('🔍 ===== FINAL PAYLOAD VALIDATION =====');
  console.log('  - concessions array length:', payload.concessions.length);
  console.log('  - concessions array:', JSON.stringify(payload.concessions, null, 2));
  console.log('  - Is concessions array empty?', payload.concessions.length === 0);
  console.log('======================================');

  // Log the final payload structure
  console.log('✅ College Payload Created Successfully:');
  console.log('  - Total fields:', Object.keys(payload).length);
  console.log('  - Concessions array:', payload.concessions.length, 'items');
  console.log('  - Payment details:', Object.keys(payload.paymentDetails).length, 'fields');

  return payload;
};

