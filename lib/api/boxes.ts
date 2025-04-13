import { supabase, createBrowserSupabaseClient } from '../supabase';
import { Box, BoxWithItems } from '../types';
import { generateQRCodeId } from '../qrcode';

// Get all boxes
export const getBoxes = async (): Promise<Box[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('boxes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching boxes:', error);
    throw error;
  }

  return data || [];
};

// Get a box by ID
export const getBoxById = async (id: string): Promise<BoxWithItems | null> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return null;
  }
  
  const { data, error } = await client
    .from('boxes')
    .select(`
      *,
      items:items(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error(`Error fetching box with ID ${id}:`, error);
    return null;
  }

  return data as BoxWithItems;
};

// Get a box by QR code ID
export const getBoxByQRCodeId = async (qrCodeId: string): Promise<BoxWithItems | null> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return null;
  }
  
  const { data, error } = await client
    .from('boxes')
    .select(`
      *,
      items:items(*)
    `)
    .eq('qr_code_id', qrCodeId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error(`Error fetching box with QR code ID ${qrCodeId}:`, error);
    return null;
  }

  return data as BoxWithItems;
};

// Create a new box
export const createBox = async (box: Omit<Box, 'id' | 'created_at' | 'qr_code_id' | 'user_id'>): Promise<Box | null> => {
  const qrCodeId = generateQRCodeId();
  
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await client
    .from('boxes')
    .insert([{ ...box, qr_code_id: qrCodeId, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating box:', error);
    throw error;
  }

  return data;
};

// Update a box
export const updateBox = async (id: string, updates: Partial<Box>): Promise<Box | null> => {
  // Get the current user to verify ownership
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await client
    .from('boxes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating box with ID ${id}:`, error);
    throw error;
  }

  return data;
};

// Delete a box
export const deleteBox = async (id: string): Promise<void> => {
  // Get the current user to verify ownership
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  const { error } = await client
    .from('boxes')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error(`Error deleting box with ID ${id}:`, error);
    throw error;
  }
};

// Search boxes
export const searchBoxes = async (query: string): Promise<Box[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('boxes')
    .select('*')
    .eq('user_id', userId)
    .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching boxes:', error);
    throw error;
  }

  return data || [];
};

// Filter boxes by location
export const filterBoxesByLocation = async (location: string): Promise<Box[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('boxes')
    .select('*')
    .eq('user_id', userId)
    .eq('location', location)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error filtering boxes by location ${location}:`, error);
    throw error;
  }

  return data || [];
};

// Filter boxes by category
export const filterBoxesByCategory = async (category: string): Promise<Box[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('boxes')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error filtering boxes by category ${category}:`, error);
    throw error;
  }

  return data || [];
};
