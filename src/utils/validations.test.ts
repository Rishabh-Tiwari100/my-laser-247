import { loginSchema, phoneLoginSchema } from './validations';

describe('login validation', () => {
  it('allows login page and header credentials with password symbols and short usernames', () => {
    expect(loginSchema.safeParse({ username: 'a', password: 'Password@123!' }).success).toBe(true);
  });

  it.each([
    { username: '', password: 'Password@123!' },
    { username: 'user', password: '' },
  ])('requires both login credentials before submitting: %j', (credentials) => {
    expect(loginSchema.safeParse(credentials).success).toBe(false);
  });

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
