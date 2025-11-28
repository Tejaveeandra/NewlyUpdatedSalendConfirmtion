import React, { useState } from 'react'
import SchoolSaleOverviewCont from "../school-sale-overview-container/SchoolSaleOverviewCont";
import SchoolSaleConfFormsCont from "../school-sale&conf-forms-container/SchoolSaleConfFormsCont";
import PaymentPopupContainer from "../scool-payment-popup-container/PaymentPopupContainer";
import { useAdmissionSaleData } from "../../../hooks/college-apis/CollegeOverviewApis";
import { useSchoolOverviewData } from "../../../hooks/school-apis/SchoolOverviewApis";

const SchoolSaleConfirmationContainer = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1 = Overview, 2 = Forms
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  
  // State to store form data and siblings for submission
  const [formData, setFormData] = useState(null);
  const [siblings, setSiblings] = useState([]);

  // Fetch data once at parent level
  const { data: detailsObject } = useAdmissionSaleData('2815502');
  
  // Fetch overview data to get branchId and joiningClassId
  const studentId = "1880007"; // You can make this dynamic
  const { overviewData } = useSchoolOverviewData(studentId);

  const handleNext = () => {
    setCurrentStep(2);
  };

  const handleEdit = () => {
    console.log("Edit clicked");
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleProceedToPayment = (formDataFromChild, siblingsFromChild) => {
    // Store form data and siblings when proceeding to payment
    setFormData(formDataFromChild);
    setSiblings(siblingsFromChild || []);
    setShowPaymentPopup(true);
  };

  const handleClosePayment = () => {
    setShowPaymentPopup(false);
  };

  return (
    <div>
      <div>
        {currentStep === 1 && (
          <SchoolSaleOverviewCont 
            onNext={handleNext}
            onEdit={handleEdit}
            detailsObject={detailsObject}
            studentId={studentId}
          />
        )}
        
        {currentStep === 2 && (
          <SchoolSaleConfFormsCont 
            onBack={handleBack}
            onProceedToPayment={handleProceedToPayment}
            detailsObject={detailsObject}
            overviewData={overviewData}
          />
        )}
      </div>

      {showPaymentPopup && (
        <PaymentPopupContainer 
          onClose={handleClosePayment}
          formData={formData}
          siblings={siblings}
          detailsObject={detailsObject}
        />
      )}
    </div>
  )
}

export default SchoolSaleConfirmationContainer