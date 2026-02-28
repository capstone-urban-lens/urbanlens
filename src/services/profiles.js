import supabase from './supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export function getProfilePicUrl(path, updatedAt) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = `${supabaseUrl}/storage/v1/object/public/profiles_pictures/${path}`;
  return updatedAt ? `${base}?t=${new Date(updatedAt).getTime()}` : base;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop();
  const filePath = `${userId}.${ext}`;

  console.log('Uploading file:', file, 'to path:', filePath);

  const { data, error: uploadError } = await supabase.storage
    .from('profiles_pictures')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Upload failed:', uploadError);
    throw uploadError;
  }

  console.log('Upload succeeded:', data);
  return filePath;
}
