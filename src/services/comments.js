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

export async function postComment(cityId, userId, msg) {
    const {data, error } = await supabase.from('comments')
    .insert({city_id: cityId, user_id: userId, msg: msg})
    .select('*, profiles(fname, lname, profile_pic)')
    .single()
    if (error) throw error;
    return data;
}

export async function deleteComment(commentId) {
    const { error } = await supabase.from('comments')
    .delete()
    .eq('comment_id', commentId);
    if (error) throw error;
}