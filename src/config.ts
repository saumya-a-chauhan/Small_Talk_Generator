// Configuration for different environments
const config = {
  // Supabase configuration
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  // API endpoints
  apiEndpoint: process.env.NODE_ENV === 'development'
    ? '/api/generate-starters' // Development: use Next.js API route or proxy
    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-starters`, // Production: use Supabase deployed function

  // Environment flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

export default config
