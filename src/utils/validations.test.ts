import { loginSchema, phoneLoginSchema } from './validations';

describe('login validation', () => {
  it('uses a phone-specific required message for an empty phone number', () => {
    const result = phoneLoginSchema.safeParse({ username: '', password: 'password' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.username?.[0]).toBe('Phone number is required');
    }
  });

  it('keeps the username required message for an empty User ID', () => {
    const result = loginSchema.safeParse({ username: '', password: 'password' });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.username?.[0]).toBe('Please Enter Username');
    }
  });
});
