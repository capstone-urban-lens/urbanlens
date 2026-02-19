import supabase from './supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export function getCityImageUrl(slug, num) {
  return `${supabaseUrl}/storage/v1/object/public/city-images/${slug}-${num}.jpg`;
}

export async function getCities() {
  const { data, error } = await supabase.from('cities').select('*');
  if (error) throw error;
  return data;
}

export async function getCityBySlug(slug) {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) throw error;
  return data;
}
