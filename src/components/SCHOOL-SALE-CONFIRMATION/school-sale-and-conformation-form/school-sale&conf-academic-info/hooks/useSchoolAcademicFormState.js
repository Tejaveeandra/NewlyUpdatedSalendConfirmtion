import { useEffect } from "react";
import {
  useOrientations,
  getOrientationFee,
  useFoodTypes,
  useBloodGroups,
  useCastes,
  useReligions,
} from "../hooks/SchoolAcedemic";
import { extractFeeValue, getDisplayValue } from "../utils/academicHelpers";

export default function useSchoolAcademicFormState({ formData, onChange, overviewData }) {
  const branchId = overviewData?.branchId;
  const joiningClassId = overviewData?.joiningClassId;

  // Dropdowns
  const {
    orientationOptions,
    getOrientationIdByLabel,
    getOrientationLabelById,
    loading: orientationsLoading,
  } = useOrientations(joiningClassId, branchId);
  const {
    foodTypeOptions,
    getFoodTypeIdByLabel,
    getFoodTypeLabelById,
    loading: foodTypesLoading,
  } = useFoodTypes();
  const {
    bloodGroupOptions,
    getBloodGroupIdByLabel,
    getBloodGroupLabelById,
    loading: bloodGroupsLoading,
  } = useBloodGroups();
  const {
    casteOptions,
    getCasteIdByLabel,
    getCasteLabelById,
    loading: castesLoading,
  } = useCastes();
  const {
    religionOptions,
    getReligionIdByLabel,
    getReligionLabelById,
    loading: religionsLoading,
  } = useReligions();

  // Handlers
  const handleOrientationChange = async (e) => {
    const selectedLabel = e.target.value;
    const orientationId = getOrientationIdByLabel(selectedLabel);
    onChange({
      target: {
        name: "orientationName",
        value: orientationId !== undefined ? orientationId : selectedLabel,
      },
    });
    if (orientationId !== undefined) {
      try {
        const feeResponse = await getOrientationFee(orientationId);
        const feeValue = extractFeeValue(feeResponse);
        onChange({ target: { name: "orientationFee", value: feeValue } });
      } catch {
        onChange({ target: { name: "orientationFee", value: "" } });
      }
    } else {
      onChange({ target: { name: "orientationFee", value: "" } });
    }
  };

  useEffect(() => {
    const fetchOrientationFeeOnLoad = async () => {
      if (
        formData.orientationName &&
        !formData.orientationFee &&
        !orientationsLoading &&
        orientationOptions.length > 0
      ) {
        const orientationId = getOrientationIdByLabel(formData.orientationName);
        if (orientationId !== undefined) {
          try {
            const feeResponse = await getOrientationFee(orientationId);
            const feeValue = extractFeeValue(feeResponse);
            onChange({ target: { name: "orientationFee", value: feeValue } });
          } catch {}
        }
      }
    };
    fetchOrientationFeeOnLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.orientationName, formData.orientationFee, orientationsLoading, orientationOptions]);

  const handleFoodTypeChange = (e) => {
    const selectedLabel = e.target.value;
    const foodTypeId = getFoodTypeIdByLabel(selectedLabel);
    onChange({
      target: {
        name: "foodType",
        value: foodTypeId !== undefined ? foodTypeId : selectedLabel,
      },
    });
  };
  const handleBloodGroupChange = (e) => {
    const selectedLabel = e.target.value;
    const bloodGroupId = getBloodGroupIdByLabel(selectedLabel);
    onChange({
      target: {
        name: "bloodGroup",
        value: bloodGroupId !== undefined ? bloodGroupId : selectedLabel,
      },
    });
  };
  const handleCasteChange = (e) => {
    const selectedLabel = e.target.value;
    const casteId = getCasteIdByLabel(selectedLabel);
    onChange({
      target: {
        name: "caste",
        value: casteId !== undefined ? casteId : selectedLabel,
      },
    });
  };
  const handleReligionChange = (e) => {
    const selectedLabel = e.target.value;
    const religionId = getReligionIdByLabel(selectedLabel);
    onChange({
      target: {
        name: "religion",
        value: religionId !== undefined ? religionId : selectedLabel,
      },
    });
  };

  // Display value helpers
  const getOrientationDisplayValue = (value) => getDisplayValue(value, orientationOptions, getOrientationLabelById);
  const getFoodTypeDisplayValue = (value) => getDisplayValue(value, foodTypeOptions, getFoodTypeLabelById);
  const getBloodGroupDisplayValue = (value) => getDisplayValue(value, bloodGroupOptions, getBloodGroupLabelById);
  const getCasteDisplayValue = (value) => getDisplayValue(value, casteOptions, getCasteLabelById);
  const getReligionDisplayValue = (value) => getDisplayValue(value, religionOptions, getReligionLabelById);

  return {
    orientationOptions,
    orientationsLoading,
    getOrientationDisplayValue,
    handleOrientationChange,
    foodTypeOptions,
    foodTypesLoading,
    getFoodTypeDisplayValue,
    handleFoodTypeChange,
    bloodGroupOptions,
    bloodGroupsLoading,
    getBloodGroupDisplayValue,
    handleBloodGroupChange,
    casteOptions,
    castesLoading,
    getCasteDisplayValue,
    handleCasteChange,
    religionOptions,
    religionsLoading,
    getReligionDisplayValue,
    handleReligionChange,
    branchId,
    joiningClassId,
  };
}
