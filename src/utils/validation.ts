import {
  validateEmail,
  validatePassword,
  validateName,
} from './helpers';

// Types for validation system
export interface ValidationRule {
  validate: (value: any, formData?: any) => boolean;
  message: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

// Validation schemas for different forms
export const createLoginValidationSchema = (t: (key: string) => string): ValidationSchema => ({
  email: [
    {
      validate: (value: string) => !!value.trim(),
      message: t('errors.emailRequired'),
    },
    {
      validate: (value: string) => validateEmail(value),
      message: t('errors.invalidEmail'),
    },
  ],
  password: [
    {
      validate: (value: string) => !!value,
      message: t('errors.passwordRequired'),
    },
    {
      validate: (value: string) => validatePassword(value),
      message: t('errors.passwordTooShort'),
    },
  ],
});

export const createRegisterValidationSchema = (t: (key: string) => string): ValidationSchema => ({
  firstName: [
    {
      validate: (value: string) => !!value.trim(),
      message: t('errors.nameRequired'),
    },
    {
      validate: (value: string) => validateName(value),
      message: 'First name must be 2-50 characters',
    },
  ],
  lastName: [
    {
      validate: (value: string) => !!value.trim(),
      message: t('errors.nameRequired'),
    },
    {
      validate: (value: string) => validateName(value),
      message: 'Last name must be 2-50 characters',
    },
  ],
  email: [
    {
      validate: (value: string) => !!value.trim(),
      message: t('errors.emailRequired'),
    },
    {
      validate: (value: string) => validateEmail(value),
      message: t('errors.invalidEmail'),
    },
  ],
  password: [
    {
      validate: (value: string) => !!value,
      message: t('errors.passwordRequired'),
    },
    {
      validate: (value: string) => validatePassword(value),
      message: t('errors.passwordTooShort'),
    },
  ],
  confirmPassword: [
    {
      validate: (value: string) => !!value,
      message: t('errors.passwordRequired'),
    },
    {
      validate: (value: string, formData: any) =>
        value === formData?.password,
      message: t('errors.passwordsDoNotMatch'),
    },
  ],
});

// Generic validation hook
export class FormValidator<T extends Record<string, any>> {
  private schema: ValidationSchema;
  private formData: T;

  constructor(schema: ValidationSchema, formData: T) {
    this.schema = schema;
    this.formData = formData;
  }

  // Validate a single field
  validateField(fieldName: keyof T, value: string): string {
    const rules = this.schema[fieldName as string];
    if (!rules) return '';

    for (const rule of rules) {
      if (!rule.validate(value, this.formData)) {
        return rule.message;
      }
    }
    return '';
  }

  // Validate entire form
  validateForm(): { isValid: boolean; errors: ValidationErrors } {
    const errors: ValidationErrors = {};

    (Object.keys(this.formData) as Array<keyof T>).forEach((field) => {
      const error = this.validateField(field, this.formData[field] as string);
      if (error) {
        errors[field as string] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Update form data for validation context
  updateFormData(newFormData: T) {
    this.formData = newFormData;
  }
}

export default FormValidator;