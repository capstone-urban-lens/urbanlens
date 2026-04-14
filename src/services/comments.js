import supabase from './supabase';


export async function getComments(cityId) {
    const { data, error } = await supabase.from('comments').select('*, profiles(fname, lname, profile_pic)')
    .eq('city_id', cityId)
    .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

export async function getUserComments(userId) {
    const { data, error } = await supabase.from('comments')
    .select('*')
    .eq('user_id', userId)
    if (error) throw error;
    return data;
}

export async function postComment(cityId, userId, msg, parentId = null) {
    const payload = { city_id: cityId, user_id: userId, msg };
    if (parentId) payload.parent_id = parentId;
    const {data, error } = await supabase.from('comments')
    .insert(payload)
    .select('*, profiles(fname, lname, profile_pic)')
    .single()
    if (error) throw error;
    return data;
}

export async function updateComment(commentId, msg) {
    const { data, error } = await supabase.from('comments')
    .update({ msg })
    .eq('comment_id', commentId)
    .select('*, profiles(fname, lname, profile_pic)')
    .single();
    if (error) throw error;
    return data;
}

export async function deleteComment(commentId) {
    const { error } = await supabase.from('comments')
    .delete()
    .eq('comment_id', commentId);
    if (error) throw error;
}