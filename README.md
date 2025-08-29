# Small Talk Generator

A React-based application that generates conversation starters using AI. Built with React, TypeScript, Vite, and Supabase.

## Features

- Generate conversation starters based on interests
- AI-powered suggestions using Gemini API
- Modern React + TypeScript frontend
- Supabase Edge Functions for backend
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase Edge Functions
- **AI**: Google Gemini API
- **Deployment**: Netlify (Frontend), Supabase (Backend)

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase CLI (for backend development)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/saumya-a-chauhan/Small_Talk_Generator.git
   cd Small_Talk_Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Start local Supabase (optional)**
   ```bash
   supabase start
   ```

## Deployment

### Frontend Deployment (Netlify)

1. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Sign up/Login with your GitHub account
   - Click "New site from Git"
   - Select your repository: `saumya-a-chauhan/Small_Talk_Generator`

2. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Set environment variables**
   In Netlify dashboard, go to Site settings > Environment variables:
   ```
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Deploy**
   - Netlify will automatically build and deploy your site
   - Your site will be available at `https://your-site-name.netlify.app`

### Backend Deployment (Supabase)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link your project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Deploy Edge Functions**
   ```bash
   supabase functions deploy generate-starters
   ```

5. **Set environment variables in Supabase**
   In Supabase dashboard, go to Settings > Edge Functions:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Manual Deployment Steps

#### Step 1: Set up Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note down your project URL and anon key
4. Enable Edge Functions in your project settings

#### Step 2: Deploy Backend Function
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project (replace with your project ref)
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy generate-starters

# Set environment variable
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
```

#### Step 3: Deploy Frontend to Netlify
1. **Build the project locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify, OR
   - Connect your GitHub repository for automatic deployments

3. **Configure environment variables**
   In Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add your Supabase URL and anon key

## Environment Variables

### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (Supabase Secrets)
```env
GEMINI_API_KEY=your_gemini_api_key
```

## API Endpoints

### Generate Conversation Starters
- **URL**: `/functions/v1/generate-starters`
- **Method**: POST
- **Body**:
  ```json
  {
    "your_name": "string",
    "your_info": "string",
    "their_name": "string", 
    "their_info": "string",
    "context": "string"
  }
  ```

## Project Structure

```
├── src/                    # Frontend source code
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── supabase/
│   └── functions/
│       └── generate-starters/  # Backend function
├── netlify.toml           # Netlify configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

MIT License

## Support

For support, please open an issue on GitHub or contact the maintainers.
