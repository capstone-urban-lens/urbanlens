import supabase from './supabase';

function normalizeName(name = "") {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

export async function signUp(email, password, fname, lname) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        fname: normalizeName(fname),
        lname: normalizeName(lname)
      }
    }
  })

  if (error) throw error
  return data
}

export async function logIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}