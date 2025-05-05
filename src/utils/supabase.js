import { createClient } from '@supabase/supabase-js'
import router from '@/router' // adjust path if needed

// Create a single supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

// Form action utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}

// Check if there's an active session
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session', error.message)
    return false
  }

  return !!data.session
}

// Protect a page by checking session and redirecting to login if needed
export const checkAuthAndRedirect = async () => {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    router.push('/login') // redirect if not logged in
  }
}

// Get current user (if any) - enhanced with better error handling
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user', error.message)
      return null
    }
    return data.user
  } catch (error) {
    console.error('Unexpected error getting user:', error)
    return null
  }
}

// Watch auth state globally (e.g. for logout or login)
export const watchAuthState = () => {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (!session && router.currentRoute.value.meta.requiresAuth) {
      router.push('/login') // auto-redirect if logged out and on protected page
    }
  })
}

// Get user's reservations
export const getUserReservations = async (userId) => {
  if (!userId) return []

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .order('reserved_start', { ascending: false })

    if (error) {
      console.error('Error fetching user reservations:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error fetching user reservations:', error)
    return []
  }
}

// Helper to store user data in localStorage for improved persistence
export const storeUserData = (userData) => {
  if (!userData) return

  try {
    // Don't store sensitive data, just enough to identify the user
    const storableData = {
      id: userData.id,
      email: userData.email,
      metadata: userData.user_metadata,
    }
    localStorage.setItem('userProfile', JSON.stringify(storableData))
  } catch (error) {
    console.error('Error storing user data:', error)
  }
}

// Helper to get stored user data
export const getStoredUserData = () => {
  try {
    const userData = localStorage.getItem('userProfile')
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error retrieving stored user data:', error)
    return null
  }
}

// Clear stored user data on logout
export const clearStoredUserData = () => {
  try {
    localStorage.removeItem('userProfile')
  } catch (error) {
    console.error('Error clearing stored user data:', error)
  }
}
