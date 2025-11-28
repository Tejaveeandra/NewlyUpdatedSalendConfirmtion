import React from "react";
import PaymentPopup from "../../../widgets/PaymentPopup/whole-payment-popup/PaymentPopup";

const SchoolPaymentPopup = ({ onClose, formData, siblings, detailsObject }) => {
  return (
    <PaymentPopup 
      onClose={onClose} 
      title="Complete Application Sale & Confirmation"
      formData={formData}
      siblings={siblings}
      detailsObject={detailsObject}
    />
  );
};

export default SchoolPaymentPopup;
