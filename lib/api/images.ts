import { supabase, createBrowserSupabaseClient } from '../supabase';
import { Image } from '../types';

// Get images by item ID
export const getImagesByItemId = async (itemId: string): Promise<Image[]> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    return [];
  }
  
  const { data, error } = await client
    .from('images')
    .select('*')
    .eq('item_id', itemId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching images for item ${itemId}:`, error);
    throw error;
  }

  return data || [];
};

// Upload an image for an item
export const uploadItemImage = async (
  itemId: string,
  file: File
): Promise<Image | null> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  // Generate a unique file name
  const fileName = `${userId}/${itemId}_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
  const filePath = `item-images/${fileName}`;

  // Upload the file to Supabase Storage
  const { error: uploadError } = await client.storage
    .from('item-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  // Get the public URL for the uploaded file
  const { data: publicUrlData } = client.storage
    .from('item-images')
    .getPublicUrl(filePath);

  // Create a record in the images table
  const { data, error } = await client
    .from('images')
    .insert([
      {
        item_id: itemId,
        storage_path: filePath,
        user_id: userId
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating image record:', error);
    throw error;
  }

  return data;
};

// Delete an image
export const deleteImage = async (id: string, storagePath: string): Promise<void> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  // Delete the file from storage
  const { error: storageError } = await client.storage
    .from('item-images')
    .remove([storagePath]);

  if (storageError) {
    console.error(`Error deleting image file at ${storagePath}:`, storageError);
    throw storageError;
  }

  // Delete the record from the images table
  const { error } = await client
    .from('images')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error(`Error deleting image record with ID ${id}:`, error);
    throw error;
  }
};

// Get the public URL for an image
export const getImageUrl = (storagePath: string): string => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data } = client.storage
    .from('item-images')
    .getPublicUrl(storagePath);
  
  return data.publicUrl;
};

// Generate and upload a QR code image for a box
export const uploadBoxQRCode = async (
  boxId: string,
  qrCodeId: string,
  qrCodeBlob: Blob
): Promise<string> => {
  // Get the current user
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const { data: userData } = await client.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    console.error('User not authenticated');
    throw new Error('User not authenticated');
  }
  
  const filePath = `box-qrcodes/${userId}/${boxId}_${qrCodeId}.png`;

  // Upload the QR code image to Supabase Storage
  const { error: uploadError } = await client.storage
    .from('box-qrcodes')
    .upload(filePath, qrCodeBlob);

  if (uploadError) {
    console.error('Error uploading QR code image:', uploadError);
    throw uploadError;
  }

  // Get the public URL for the uploaded QR code
  const { data: publicUrlData } = client.storage
    .from('box-qrcodes')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

// Get the public URL for a box's QR code
export const getBoxQRCodeUrl = (boxId: string, qrCodeId: string, userId: string): string => {
  const client = typeof window !== 'undefined' ? createBrowserSupabaseClient() : supabase;
  const filePath = `box-qrcodes/${userId}/${boxId}_${qrCodeId}.png`;
  const { data } = client.storage
    .from('box-qrcodes')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};
