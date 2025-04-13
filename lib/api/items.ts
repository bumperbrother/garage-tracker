import { supabase, createBrowserSupabaseClient } from '../supabase';
import { Item, ItemWithImages } from '../types';

// Get all items
export const getItems = async (): Promise<Item[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }

  return data || [];
};

// Get items by box ID
export const getItemsByBoxId = async (boxId: string): Promise<Item[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('items')
    .select('*')
    .eq('box_id', boxId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching items for box ${boxId}:`, error);
    throw error;
  }

  return data || [];
};

// Get an item by ID
export const getItemById = async (id: string): Promise<ItemWithImages | null> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return null;
  }
  
  const { data, error } = await client
    .from('items')
    .select(`
      *,
      images:images(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    return null;
  }

  return data as ItemWithImages;
};

// Create a new item
export const createItem = async (item: Omit<Item, 'id' | 'created_at' | 'user_id'>): Promise<Item | null> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await client
    .from('items')
    .insert([{ ...item, user_id: userId }])
    .select()
    .single();

  if (error) {
    console.error('Error creating item:', error);
    throw error;
  }

  return data;
};

// Update an item
export const updateItem = async (id: string, updates: Partial<Item>): Promise<Item | null> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await client
    .from('items')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error(`Error updating item with ID ${id}:`, error);
    throw error;
  }

  return data;
};

// Delete an item
export const deleteItem = async (id: string): Promise<void> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  const { error } = await client
    .from('items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error(`Error deleting item with ID ${id}:`, error);
    throw error;
  }
};

// Search items
export const searchItems = async (query: string): Promise<Item[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,barcode.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching items:', error);
    throw error;
  }

  return data || [];
};

// Filter items by category
export const filterItemsByCategory = async (category: string): Promise<Item[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error filtering items by category ${category}:`, error);
    throw error;
  }

  return data || [];
};

// Get items by barcode
export const getItemsByBarcode = async (barcode: string): Promise<Item[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .eq('barcode', barcode)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching items with barcode ${barcode}:`, error);
    throw error;
  }

  return data || [];
};
