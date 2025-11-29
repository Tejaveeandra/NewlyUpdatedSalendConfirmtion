import { useCallback } from "react";

/**
 * Custom hook to capitalize the first letter of each word in a name
 * Example: "rvi kirn" -> "Ravi Kiran"
 * 
 * @returns {Function} A function that takes an event and returns a modified event with capitalized value
 */
export default function useNameCapitalization() {
  /**
   * Capitalizes the first letter of each word
   * @param {string} text - The text to capitalize
   * @returns {string} - The capitalized text
   */
  const capitalizeWords = useCallback((text) => {
    if (!text || typeof text !== "string") return text;
    
    // Split by spaces, capitalize first letter of each word, then join
    return text
      .split(/\s+/)
      .map((word) => {
        if (!word) return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }, []);

  /**
   * Handler function that processes the input event and capitalizes the name
   * @param {Event} e - The input event
   * @param {Function} originalOnChange - The original onChange handler
   * @returns {void}
   */
  const handleNameChange = useCallback(
    (e, originalOnChange) => {
      if (!e || !e.target) return;
      
      const { name, value } = e.target;
      
      // First, filter to only alphabets and spaces (existing logic)
      const alphabetsOnly = value.replace(/[^a-zA-Z\s]/g, "");
      
      // Then capitalize each word
      const capitalizedValue = capitalizeWords(alphabetsOnly);
      
      // Create a new event with the capitalized value
      const filteredEvent = {
        ...e,
        target: {
          ...e.target,
          name,
          value: capitalizedValue,
        },
      };
      
      // Call the original onChange handler
      if (originalOnChange) {
        originalOnChange(filteredEvent);
      }
    },
    [capitalizeWords]
  );

  return {
    capitalizeWords,
    handleNameChange,
  };
}

