// Configuration for different environments
const config = {
  // Supabase configuration
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  // API endpoints
  apiEndpoint: import.meta.env.DEV 
    ? '/api/generate-starters' // Development: use local proxy
    : `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-starters`, // Production: use Supabase
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
