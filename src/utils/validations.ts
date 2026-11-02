import { z } from 'zod';
import { parsePhoneNumber } from 'react-phone-number-input';

export const hasMinimumNationalPhoneLength = (phone: string, minimumLength = 10): boolean => {
  try {
    const internationalPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const parsedPhone = parsePhoneNumber(internationalPhone);

    return (parsedPhone?.nationalNumber.length ?? 0) >= minimumLength;
  } catch {
    return false;
  }
};

// Register Validation Schema
export const otpSchema = z.object({
  phone: z
    .string({
      required_error: 'Phone number is required',
      invalid_type_error: 'Phone number is required',
    })
    .nonempty('Phone number is required')
    .regex(/^\+[1-9]\d{9,14}$/, 'Please enter a valid mobile number')
    .refine(hasMinimumNationalPhoneLength, 'Please enter a valid mobile number'),
});

export const registerSchema = z
  .object({
    mobile: z
      .string()
      .min(1, 'Phone number is required')
      .min(10, 'Please enter a valid mobile number')
      .max(15, 'Please enter a valid mobile number')
      .regex(/^\d+$/, 'Please enter a valid mobile number')
      .refine(hasMinimumNationalPhoneLength, 'Please enter a valid mobile number'),

    username: z
      .string()
      .max(16, 'Username can contain only 16 characters')
      .regex(
        /^[a-zA-Z0-9-_.]*$/,
        'Username can only contain letters, numbers, hyphens, underscores, and dots'
      )
      .optional()
      .or(z.literal('')),

    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d{6}$/, 'OTP must be a valid 6-digit number')
      .optional()
      .or(z.literal('')),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password')
      .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),

    referralCode: z
      .string()
      .max(15, 'Referral code must be at most 15 characters')
      .regex(/^[a-zA-Z0-9]*$/, 'Only alphanumeric characters are allowed')
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type RegisterFormData = z.infer<typeof registerSchema>;

export const profileValidationSchema = z.object({
  firstname: z
    .string()
    .min(2, 'First name must be at least 2 characters long')
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),

  lastname: z
    .string()
    .min(2, 'Last name must be at least 2 characters long')
    .max(50)
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),

  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),

  mobile: z
    .string()
    .nonempty('Phone number is required')
    .regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid mobile number')
    .refine(hasMinimumNationalPhoneLength, 'Please enter a valid mobile number'),

  email: z.string().email().optional().or(z.literal('')),

  dialCode: z.string().regex(/^\+\d+$/, 'Dial code must be like +1, +91'),

  // country: z
  //   .string()
  //   .min(1, "Country is required")

  otp: z.string().length(6, 'OTP must be 6 digits').optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileValidationSchema>;

// Login Validation Schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Please Enter Username')
    .min(3, 'Username must be at least 3 characters long'),
  password: z
    .string()
    .min(1, 'Please enter a password')
    .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),
});

export const phoneLoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Please enter a valid mobile number')
    .max(15, 'Please enter a valid mobile number')
    .regex(/^\d+$/, 'Please enter a valid mobile number')
    .refine(hasMinimumNationalPhoneLength, 'Please enter a valid mobile number'),
  password: z
    .string()
    .min(1, 'Please enter a password')
    .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),
});

export type LoginFormData = {
  username: string;
  password: string;
};

// Forgot Password Validation Schema
export const forgotPasswordSchema = otpSchema
  .extend({
    phone: z
      .string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number is required',
      })
      .nonempty('Phone number is required')
      .regex(/^\+[1-9]\d{9,14}$/, 'Please enter a valid mobile number')
      .refine(hasMinimumNationalPhoneLength, 'Please enter a valid mobile number'),

    otp: z
      .string()
      .length(6, 'OTP must be exactly 6 digits')
      .regex(/^\d{6}$/, 'OTP must be a valid 6-digit number'),

    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),

    confirmPassword: z
      .string()
      .min(1, 'Confirm Password is required')
      .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Change Password Validation Schema
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),

    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(20, 'Password must not exceed 20 characters')
      .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),

    confirmPassword: z
      .string()
      .min(1, 'Confirm Password is required')
      .regex(/^[a-zA-Z0-9]+$/, 'Password can contain only letters and numbers'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Stakes Validation Schema
export const stakeSchema = z.object({
  stakes: z.array(
    z.object({
      label: z
        .string()
        .trim()
        .min(1, 'Label is required')
        .max(8, 'Label must not exceed 8 characters')
        .regex(/^[a-zA-Z0-9]+$/, 'Label must be alphanumeric'),

      value: z
        .number()
        .min(1, 'Value must be greater than 0')
        .max(500000, 'Value must not be greater than 500000'),
    })
  ),
});

export type StakeFormValues = z.infer<typeof stakeSchema>;
