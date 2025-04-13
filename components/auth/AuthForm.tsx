import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn, signUp, resetPassword } from '../../lib/auth';
import {
  Form,
  FormSection,
  FormField,
  FormActions,
  Input,
  Button,
  ErrorMessage
} from '../ui';

type AuthFormType = 'login' | 'signup' | 'reset-password';

interface AuthFormProps {
  type: AuthFormType;
  onSuccess?: () => void;
}

// Define the form validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const AuthForm: React.FC<AuthFormProps> = ({ type, onSuccess }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  // Signup form
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupErrors }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  // Reset password form
  const {
    register: registerResetPassword,
    handleSubmit: handleSubmitResetPassword,
    formState: { errors: resetPasswordErrors }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema)
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signIn(data.email, data.password);

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signUp(data.email, data.password);

      setSuccessMessage('Account created successfully! Please check your email to confirm your account.');

      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Failed to create account. This email may already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetPasswordSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await resetPassword(data.email);

      setSuccessMessage('Password reset email sent! Please check your inbox.');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'login':
        return (
          <Form onSubmit={handleSubmitLogin(onLoginSubmit)}>
            <FormSection>
              <FormField
                label="Email"
                htmlFor="email"
                error={loginErrors.email?.message}
                required
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  fullWidth
                  {...registerLogin('email')}
                />
              </FormField>

              <FormField
                label="Password"
                htmlFor="password"
                error={loginErrors.password?.message}
                required
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  fullWidth
                  {...registerLogin('password')}
                />
              </FormField>
            </FormSection>

            <div className="mb-4 text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => router.push('/reset-password')}
              >
                Forgot password?
              </button>
            </div>

            <FormActions>
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </FormActions>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => router.push('/signup')}
                >
                  Sign up
                </button>
              </p>
            </div>
          </Form>
        );

      case 'signup':
        return (
          <Form onSubmit={handleSubmitSignup(onSignupSubmit)}>
            <FormSection>
              <FormField
                label="Email"
                htmlFor="email"
                error={signupErrors.email?.message}
                required
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  fullWidth
                  {...registerSignup('email')}
                />
              </FormField>

              <FormField
                label="Password"
                htmlFor="password"
                error={signupErrors.password?.message}
                required
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  fullWidth
                  {...registerSignup('password')}
                />
              </FormField>

              <FormField
                label="Confirm Password"
                htmlFor="confirmPassword"
                error={signupErrors.confirmPassword?.message}
                required
              >
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  fullWidth
                  {...registerSignup('confirmPassword')}
                />
              </FormField>
            </FormSection>

            <FormActions>
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
              >
                Create Account
              </Button>
            </FormActions>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => router.push('/login')}
                >
                  Sign in
                </button>
              </p>
            </div>
          </Form>
        );

      case 'reset-password':
        return (
          <Form onSubmit={handleSubmitResetPassword(onResetPasswordSubmit)}>
            <FormSection>
              <p className="text-sm text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <FormField
                label="Email"
                htmlFor="email"
                error={resetPasswordErrors.email?.message}
                required
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  fullWidth
                  {...registerResetPassword('email')}
                />
              </FormField>
            </FormSection>

            <FormActions>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/login')}
              >
                Back to Login
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                Reset Password
              </Button>
            </FormActions>
          </Form>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        {type === 'login' ? 'Sign In' : type === 'signup' ? 'Create Account' : 'Reset Password'}
      </h1>

      {error && (
        <div className="mb-6">
          <ErrorMessage title="Error" message={error} />
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          <p>{successMessage}</p>
        </div>
      )}

      {renderForm()}
    </div>
  );
};

export default AuthForm;
