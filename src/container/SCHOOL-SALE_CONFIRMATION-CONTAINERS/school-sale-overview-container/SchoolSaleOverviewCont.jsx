import React from "react";
import SchoolOverviewTopSection from "../../../widgets/ApplicationSaleAndConTopSection/ApplicationSaleAndConfTopSec";
import SchoolOverviewPersonalInformation from "../../../components/SCHOOL-SALE-CONFIRMATION/school-confirmation-overview-components/school-overview-personal-information/SchoolOverviewPersonalInformation";
import SchoolOverviewParentInformation from "../../../components/SCHOOL-SALE-CONFIRMATION/school-confirmation-overview-components/school-overview-parent-information/SchoolOverviewParentInformation";
import SchoolOverviewAddressInformation from "../../../components/SCHOOL-SALE-CONFIRMATION/school-confirmation-overview-components/school-overview-address-information/SchoolOverviewAddressInformation";
import SchoolOverviewOrientationInformation from "../../../components/SCHOOL-SALE-CONFIRMATION/school-confirmation-overview-components/school-overview-orientation-information/SchoolOverviewOrientationInformation";
import SchoolOverviewAcadameciInfo from "../../../components/SCHOOL-SALE-CONFIRMATION/school-confirmation-overview-components/school-overview-academic-info/SchoolOverviewAcadameciInfo";
import Button from "../../../widgets/Button/Button";
import styles from "./SchoolSaleOverviewCont.module.css";
import EditIcon from "../../../assets/school-sale-conf-assets/EditIcon";
import ButtonRightArrow from "../../../assets/school-sale-conf-assets/ButtonRightArrow";
import { useSchoolOverviewData } from "../../../hooks/school-apis/SchoolOverviewApis";

const SchoolSaleOverviewCont = ({ onNext, onEdit, detailsObject, studentId }) => {
  // Fetch school overview data using the custom hook
  const { overviewData, loading, error } = useSchoolOverviewData(studentId);

  console.log('Container - overviewData:', overviewData);
  console.log('Container - loading:', loading);
  console.log('Container - error:', error);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error loading data: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <SchoolOverviewTopSection
        step={1}
        title="Application Sale & Confirmation"
        detailsObject={detailsObject}
      />

      <div className={styles.contentContainer}>
        <SchoolOverviewPersonalInformation overviewData={overviewData} />
        <SchoolOverviewParentInformation overviewData={overviewData} />
        <SchoolOverviewOrientationInformation overviewData={overviewData} />
        {/* <SchoolOverviewAcadameciInfo overviewData={overviewData} /> */}
        <SchoolOverviewAddressInformation overviewData={overviewData} />
      </div>
      {/* Bottom Action Buttons */}
      <div className={styles.bottomActions}>
        <Button
          buttonname="Edit"
          variant="secondary"
          onClick={onEdit}
          lefticon={<EditIcon/>}
        />
        <Button
          buttonname="Next"
          righticon={<ButtonRightArrow />}
          variant="primary"
          onClick={onNext}
        />
      </div>
    </div>
  );
};

export default SchoolSaleOverviewCont;
