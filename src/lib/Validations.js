import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string({ message: 'Email is required.' }).email().min(5).max(50),
  password: z
    .string({ message: 'Password is required.' })
    .min(8, { message: 'Password must be atleast 8 characters.' })
    .regex(/[A-Z]/, 'Password should have least One Uppercase')
    .regex(/[a-z]/, 'Password should have atleast One Lowercase')
    .regex(/[0-9]/, 'Password should have atleast One Number.')
    .regex(/[@#$%^&*]/, 'Password should have atleast One Special Character.'),
});

export const SignUpSchema = z
  .object({
    name: z.string({ message: 'Name is required' }).min(3),
    email: z.string({ message: 'Email is required' }).email().min(5).max(50),
    password: z
      .string({ message: 'Password is required' })
      .min(8, { message: 'Password must at least 8 characters' })
      .regex(/[A-Z]/, 'Password at least One Uppercase')
      .regex(/[a-z]/, 'Password at least One Lowercase')
      .regex(/[0-9]/, 'Password at least One Number')
      .regex(/[@#$%^&*]/, 'Password at least One Special Character'),
    confirmPassword: z.string({ message: 'Confirm password is required' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password and confirm password must be same',
    path: ['confirmPassword'],
  });

export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ message: 'Password is required' })
      .min(8, { message: 'Password must at least 8 characters' })
      .regex(/[A-Z]/, 'Password at leat One Uppercase')
      .regex(/[a-z]/, 'Password at least one lowercase')
      .regex(/[0-9]/, 'Password at least one number')
      .regex(/[@#$%^&*]/, 'Password at least one special character'),
    confirmPassword: z.string({ message: 'Confirm password is required' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Password and confirm password must be same',
    path: ['confirmPassword'],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string({ message: 'Email is required.' }).email().min(5).max(50),
});

export const QuestionsSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).min(15)).min(1).max(3),
});
