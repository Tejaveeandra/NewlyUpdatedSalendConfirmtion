import React, { useState } from "react";
import styles from "./PaymentPopup.module.css";
import PopupHeader from "../popup-headerpart/PopupHeader";
import PopupNavTabs from "../popup-navtabs/PopupNavTabs";
import CashForms from "../popup-formspart/CashForms";
import DDForms from "../popup-formspart/DDForms";
import ChequeForms from "../popup-formspart/ChequeForms";
import CardForms from "../popup-formspart/CardForms";
import Button from "../../Button/Button";
import { submitSchoolApplicationSale, mapFormDataToPayload } from "../../../hooks/school-apis/SchoolSubmissionApi";
import { submitCollegeApplicationConfirmation, mapCollegeFormDataToPayload } from "../../../hooks/college-apis/CollegeSubmissionApi";

const PaymentPopup = ({ 
  onClose, 
  title, 
  formData: schoolFormData, 
  siblings, 
  detailsObject,
  type = "school", // "school" or "college"
  collegeFormData, // For college: concession form data
  collegeAcademicFormData // For college: academic form data (orientation info)
}) => {
  const [activeTab, setActiveTab] = useState("cash");
  const [paymentFormData, setPaymentFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFinishSale = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      let payload;
      let response;

      if (type === "college") {
        // Log form data before mapping
        console.log('🔍 ===== COLLEGE FORM DATA BEFORE MAPPING (PaymentPopup) =====');
        console.log('collegeFormData:', collegeFormData);
        console.log('collegeAcademicFormData:', collegeAcademicFormData);
        console.log('paymentFormData:', paymentFormData);
        console.log('detailsObject:', detailsObject);
        console.log('activeTab:', activeTab);
        console.log('==============================================================');
        
        // Map college form data to API payload
        payload = mapCollegeFormDataToPayload(
          collegeFormData || {},
          collegeAcademicFormData || {},
          paymentFormData,
          detailsObject || {},
          activeTab
        );

        // Log the complete payload object to console in a readable format
        console.log("===========================================");
        console.log("📤 SUBMITTING COLLEGE PAYLOAD TO BACKEND");
        console.log("===========================================");
        console.log("📋 Complete Payload Object:");
        console.log(payload);
        console.log("===========================================");
        console.log("📄 Payload as JSON (formatted):");
        console.log(JSON.stringify(payload, null, 2));
        console.log("===========================================");
        console.log("📊 Payload Summary:");
        console.log("  - studAdmsNo:", payload.studAdmsNo);
        console.log("  - academicYearId:", payload.academicYearId);
        console.log("  - joiningClassId:", payload.joiningClassId);
        console.log("  - branchId:", payload.branchId);
        console.log("  - studentTypeId:", payload.studentTypeId);
        console.log("  - cityId:", payload.cityId);
        console.log("  - courseNameId:", payload.courseNameId);
        console.log("  - Concessions count:", payload.concessions?.length || 0);
        console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
        console.log("  - Payment Amount:", payload.paymentDetails?.amount);
        console.log("===========================================");

        // Submit to college API
        response = await submitCollegeApplicationConfirmation(payload);
      } else {
        // Map school form data to API payload
        payload = mapFormDataToPayload(
          schoolFormData || {},
          siblings || [],
          paymentFormData,
          detailsObject || {},
          activeTab
        );

        // Log the complete payload object to console in a readable format
        console.log("===========================================");
        console.log("📤 SUBMITTING SCHOOL PAYLOAD TO BACKEND");
        console.log("===========================================");
        console.log("📋 Complete Payload Object:");
        console.log(payload);
        console.log("===========================================");
        console.log("📄 Payload as JSON (formatted):");
        console.log(JSON.stringify(payload, null, 2));
        console.log("===========================================");
        console.log("📊 Payload Summary:");
        console.log("  - studAdmsNo:", payload.studAdmsNo);
        console.log("  - foodTypeId:", payload.foodTypeId);
        console.log("  - bloodGroupId:", payload.bloodGroupId);
        console.log("  - casteId:", payload.casteId);
        console.log("  - religionId:", payload.religionId);
        console.log("  - orientationId:", payload.orientationId);
        console.log("  - Parents count:", payload.parents?.length || 0);
        console.log("  - Siblings count:", payload.siblings?.length || 0);
        console.log("  - Languages count:", payload.languages?.length || 0);
        console.log("  - Concessions count:", payload.concessions?.length || 0);
        console.log("  - Payment Mode ID:", payload.paymentDetails?.paymentModeId);
        console.log("  - Payment Amount:", payload.paymentDetails?.amount);
        console.log("===========================================");

        // Submit to school API
        response = await submitSchoolApplicationSale(payload);
      }
      
      console.log("✅ Submission successful:", response);
      setSubmitSuccess(true);
      
      // Close popup after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setSubmitError(error.response?.data?.message || error.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashFinishSale = () => {
    handleFinishSale();
  };

  const handleCardFinishSale = () => {
    handleFinishSale();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <PopupHeader step={3} onClose={onClose} title={title} />

        <PopupNavTabs onChange={handleTabChange} />

        <div className={styles.modalContent}>
          {submitError && (
            <div style={{ padding: '10px', margin: '10px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px' }}>
              Error: {submitError}
            </div>
          )}
          {submitSuccess && (
            <div style={{ padding: '10px', margin: '10px', backgroundColor: '#efe', color: '#0c0', borderRadius: '4px' }}>
              Success! Form submitted successfully.
            </div>
          )}

          {activeTab === "cash" && (
            <CashForms formData={paymentFormData} onChange={handleFormChange} />
          )}

          {activeTab === "dd" && (
            <>
              <DDForms formData={paymentFormData} onChange={handleFormChange} />
              <div className={styles.footer}>
                <Button
                  buttonname={isSubmitting ? "Submitting..." : "Finish Sale & Confirmation"}
                  righticon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 10H16M16 10L10 4M16 10L10 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  variant="primary"
                  onClick={handleFinishSale}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {activeTab === "cheque" && (
            <>
              <ChequeForms formData={paymentFormData} onChange={handleFormChange} />
              <div className={styles.footer}>
                <Button
                  buttonname={isSubmitting ? "Submitting..." : "Finish Sale & Confirmation"}
                  righticon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 10H16M16 10L10 4M16 10L10 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                  variant="primary"
                  onClick={handleFinishSale}
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {activeTab === "card" && (
            <CardForms formData={paymentFormData} onChange={handleFormChange} />
          )}
        </div>

        {activeTab === "cash" && (
          <div className={styles.footer}>
            <Button
              buttonname={isSubmitting ? "Submitting..." : "Finish Sale & Confirmation"}
              righticon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10H16M16 10L10 4M16 10L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              variant="primary"
              onClick={handleCashFinishSale}
              disabled={isSubmitting}
            />
          </div>
        )}

        {activeTab === "card" && (
          <div className={styles.footer}>
            <Button
              buttonname={isSubmitting ? "Submitting..." : "Finish Sale & Confirmation"}
              righticon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 10H16M16 10L10 4M16 10L10 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              variant="primary"
              onClick={handleCardFinishSale}
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPopup;
