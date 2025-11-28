# Usage Example: CollegeOverviewApis with ApplicationSaleAndConfTopSec

## How to Use the API in Your Container/Component

```jsx
import { useState, useEffect } from 'react';
import ApplicationSaleAndConfTopSec from '../../widgets/ApplicationSaleAndConTopSection/ApplicationSaleAndConfTopSec';
import { 
  getStudentAdmissionSaleByApplicationNo, 
  mapAdmissionDataToTopSection 
} from '../../hooks/CollegeOverviewApis';

function YourContainer() {
  const [topSectionData, setTopSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmissionData = async () => {
      try {
        setLoading(true);
        // Replace '2815502' with your dynamic application number
        const data = await getStudentAdmissionSaleByApplicationNo('2815502');
        
        // Map the API response to the component format
        const mappedData = mapAdmissionDataToTopSection(data);
        setTopSectionData(mappedData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch admission data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissionData();
  }, []); // Add dependencies as needed

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ApplicationSaleAndConfTopSec
        step={1}
        onBack={() => console.log('Back clicked')}
        title="College Sale & Confirmation"
        detailsObject={topSectionData}
      />
      {/* Rest of your component */}
    </div>
  );
}

export default YourContainer;
```

## API Response Structure Expected

The API should return an object with the following fields:

```json
{
  "academicYear": "2026-2027",
  "applicationNo": "2815502",
  "branch": "Kavuri hills _ 01",
  "zone": "Hyderabad_Central",
  "applicationFee": "500"
}
```

## What Was Updated

1. **CollegeOverviewApis.js**: Created axios GET request function and a mapping utility
2. **ApplicationSaleAndConfTopSec.jsx**: Updated to use dynamic data from `detailsObject` prop
3. The component now displays data from the API while falling back to default values if data is not available

## Testing

You can test the API by:
1. Ensuring your backend server is running on `http://localhost:8080`
2. Making sure the endpoint returns the expected data structure
3. Using the component in your container with the fetched data
