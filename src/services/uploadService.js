import { supabase } from '../lib/supabase';

/**
 * Upload avatar to Supabase Storage
 */
export const uploadAvatar = async (file, userId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;
    const filePath = fileName;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload project logo to Supabase Storage
 */
export const uploadProjectLogo = async (file, userId, projectId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${projectId}.${fileExt}`;
    const filePath = fileName;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('project-logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage
      .from('project-logos')
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (error) {
    console.error('Error uploading project logo:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload project file (private)
 */
export const uploadProjectFile = async (file, userId, projectId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const fileName = `${userId}/${projectId}/${timestamp}_${file.name}`;
    const filePath = fileName;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    return { success: true, path: filePath };
  } catch (error) {
    console.error('Error uploading project file:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete file from storage
 */
export const deleteFile = async (bucket, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { success: false, error: error.message };
  }
};

export default {
  uploadAvatar,
  uploadProjectLogo,
  uploadProjectFile,
  deleteFile,
};