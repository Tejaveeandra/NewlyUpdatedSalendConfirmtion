import React, { useState } from "react";
import CollegeOverviewContainer from "../college-overview-container/CollegeOverviewContainer";
import CollegeAppConfContainer from "../college-app_conf-container/CollegeAppConfContainer";
import CollegePaymentPopup from "../college-payment-popup-container/CollegePaymentPopup";
import { useAdmissionSaleData, useCollegeOverviewData } from "../../../hooks/college-apis/CollegeOverviewApis";

const CollegeSaleConfirmationContainer = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1 = Overview, 2 = Application Confirmation
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  
  // State to store form data and academic form data for submission
  const [formData, setFormData] = useState(null);
  const [academicFormData, setAcademicFormData] = useState(null);

  // Fetch data once at parent level
  const { data: detailsObject } = useAdmissionSaleData("2815502");
  const { overviewData } = useCollegeOverviewData("2815504");

  // Debug: Log the overview data at container level
  console.log('🏗️ CollegeSaleConfirmationContainer - overviewData:', overviewData);
  console.log('🏗️ CollegeSaleConfirmationContainer - overviewData type:', typeof overviewData);
  if (overviewData) {
    console.log('🏗️ CollegeSaleConfirmationContainer - overviewData keys:', Object.keys(overviewData));
    console.log('🏗️ CollegeSaleConfirmationContainer - concessions:', overviewData.concessions);
  }

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleProceedToPayment = (formDataFromChild, academicFormDataFromChild) => {
    // Store form data and academic form data when proceeding to payment
    setFormData(formDataFromChild);
    setAcademicFormData(academicFormDataFromChild);
    setShowPaymentPopup(true);
  };

  const handleClosePayment = () => {
    setShowPaymentPopup(false);
  };

  return (
    <div>
      <div>
        {currentStep === 1 && (
          <CollegeOverviewContainer 
            onNext={handleNext} 
            onEdit={handleEdit}
            detailsObject={detailsObject}
            overviewData={overviewData}
          />
        )}

        {currentStep === 2 && (
          <CollegeAppConfContainer
            onBack={handleBack}
            onProceedToPayment={handleProceedToPayment}
            detailsObject={detailsObject}
            overviewData={overviewData}
          />
        )}
      </div>

      {showPaymentPopup && (
        <CollegePaymentPopup 
          onClose={handleClosePayment}
          formData={formData}
          academicFormData={academicFormData}
          detailsObject={detailsObject}
        />
      )}
    </div>
  );
};

export default CollegeSaleConfirmationContainer;
