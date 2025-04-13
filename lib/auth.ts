import { supabase, createBrowserSupabaseClient } from './supabase';

// Sign up a new user
export const signUp = async (email: string, password: string) => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }

  return data;
};

// Sign in a user
export const signIn = async (email: string, password: string) => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }

  return data;
};

// Sign out the current user
export const signOut = async () => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { error } = await client.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get the current user
export const getCurrentUser = async () => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data, error } = await client.auth.getUser();

  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }

  return data?.user || null;
};

// Check if a user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

// Reset password
export const resetPassword = async (email: string) => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Update password
export const updatePassword = async (newPassword: string) => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { error } = await client.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};
