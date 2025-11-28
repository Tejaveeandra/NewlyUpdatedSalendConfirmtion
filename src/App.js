import React from "react";
import "./App.css";

import SchoolSaleConfirmationContainer from "./container/SCHOOL-SALE_CONFIRMATION-CONTAINERS/school-sale&confirmation-container/SchoolSaleConfirmationContainer";
import CollegeSaleConfirmationContainer from "./container/COLLEGE-SALE_CONFIRMATION-CONTAINER/college-saleAndConf-Container/CollegeSaleConfirmationContainer";
function App() {
  return (
    <div className="whole_container">
      <div className="header"></div>

      <aside></aside>

      <div className="main_content">
        {/* <SchoolSaleConfirmationContainer /> */}
        <CollegeSaleConfirmationContainer/> 
      </div>
    </div>
  );
}

export default App;
