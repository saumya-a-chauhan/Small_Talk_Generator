const config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

  apiEndpoint: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-starters`,

  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
