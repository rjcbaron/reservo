import { createClient } from '@supabase/supabase-js'
import router from '@/router' // adjust path if needed

// Create a single supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
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

// Optional: get current user (if any)
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user', error.message)
    return null
  }
  return data.user
}

// Watch auth state globally (e.g. for logout or login)
export const watchAuthState = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      router.push('/login') // auto-redirect if logged out
    }
  })
}
