import FormValidator, { ValidationErrors, ValidationSchema } from "@/utils/validation";
import React from "react";

export const useFormValidation = <T extends Record<string, any>>(
  schema: ValidationSchema,
  initialFormData: T
) => {
  const [formData, setFormData] = React.useState<T>(initialFormData);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  
  const validator = React.useMemo(
    () => new FormValidator(schema, formData),
    [schema, formData]
  );

  // Update form data
  const updateField = React.useCallback((field: keyof T, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      validator.updateFormData(newData);
      return newData;
    });

    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors, validator]);

  // Validate single field
  const validateField = React.useCallback((field: keyof T) => {
    const error = validator.validateField(field, formData[field] as string);
    setErrors(prev => ({ ...prev, [field as string]: error }));
    return !error;
  }, [formData, validator]);

  // Validate entire form
  const validateForm = React.useCallback(() => {
    const { isValid, errors: validationErrors } = validator.validateForm();
    setErrors(validationErrors);
    return isValid;
  }, [validator]);

  // Clear all errors
  const clearErrors = React.useCallback(() => {
    setErrors({});
  }, []);

  // Clear specific field error
  const clearFieldError = React.useCallback((field: keyof T) => {
    setErrors(prev => ({ ...prev, [field as string]: '' }));
  }, []);

  return {
    formData,
    errors,
    updateField,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
    setFormData,
    setErrors,
  };
};
