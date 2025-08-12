# HeyBot - AI Conversation Starter Generator 🚀

HeyBot is an AI-powered conversation starter generator designed to help you break the ice at networking events, conferences, and meetings. It generates personalized conversation starters based on your interests and the other person's interests.

## ✨ Features

- **AI-Powered**: Uses Gemini AI to generate contextual conversation starters
- **Personalized**: Tailors suggestions based on both people's interests
- **Context-Aware**: Considers the meeting context (conference, networking event, etc.)
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Real-time**: Instant generation of conversation starters

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Express.js (mock server for development)
- **AI**: Google Gemini API (integrated in Supabase Edge Functions)
- **Deployment**: Supabase Edge Functions (production)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd project-bolt-sb1-ypbrprno/project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Servers

```bash
npm run dev:all
```

This command starts both:
- **Frontend**: React app (usually on http://localhost:5173)
- **Backend**: Mock Supabase server (on http://localhost:54321)

### 4. Open Your Browser

Navigate to the URL shown in your terminal (typically `http://localhost:5173`)

## 🎯 How to Use

### 1. Fill Out the Form

- **Your Name**: Enter your name
- **Your Interests**: List your interests separated by commas (e.g., "AI, machine learning, coffee, travel")
- **Their Name**: Enter the other person's name
- **Their Interests**: List their interests separated by commas (e.g., "blockchain, fintech, hiking, photography")
- **Meeting Context**: Select where you're meeting (conference, networking event, etc.)

### 2. Generate Conversation Starters

Click "Generate Conversation Starters" and wait for the AI to create personalized suggestions.

### 3. View Results

The app will display:
- **Based on Their Interests**: 5 conversation starters focused on the other person's interests
- **Based on Common Interests**: 5 conversation starters based on shared interests
- **Context Summary**: Overview of interests and common ground
- **Raw AI Response**: The complete AI-generated content

## 🔧 Development

### Available Scripts

```bash
# Start both frontend and backend servers
npm run dev:all

# Start only the frontend (Vite dev server)
npm run dev

# Start only the mock backend server
npm run server

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Project Structure

```
project/
├── src/                    # React frontend source code
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── supabase/              # Supabase Edge Functions
│   └── functions/
│       └── generate-starters/  # Main API function
├── server.js              # Local development mock server
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

### Local Development Setup

The project uses a mock server for local development:

1. **Mock Server** (`server.js`): Simulates the Supabase Edge Function
2. **Vite Proxy**: Routes `/api/*` requests to the mock server
3. **Real Supabase**: Can be used by deploying the Edge Function

## 🚀 Production Deployment

### Option 1: Deploy to Supabase

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Link to your Supabase project**:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

3. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy generate-starters
   ```

4. **Update the frontend** to call your live Supabase function instead of the local mock server.

### Option 2: Deploy to Vercel/Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting platform.

## 🔑 Environment Variables

For production, you'll need to set up:

- **GEMINI_API_KEY**: Your Google Gemini API key
- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_ANON_KEY**: Your Supabase anonymous key

## 🐛 Troubleshooting

### Common Issues

1. **"Unexpected end of JSON input" Error**
   - Ensure both servers are running (`npm run dev:all`)
   - Check that the mock server is accessible at `http://localhost:54321`

2. **Port Already in Use**
   - The app will automatically try different ports
   - Check the terminal output for the correct URL

3. **Dependencies Not Found**
   - Run `npm install` to install all required packages

4. **Mock Server Not Starting**
   - Check that port 54321 is available
   - Ensure Express and CORS are properly installed

### Debug Mode

To see detailed logs:
1. Check the terminal output for both servers
2. Open browser DevTools to see network requests
3. Check the Console tab for any JavaScript errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI-powered conversation generation
- **Supabase** for backend infrastructure
- **Tailwind CSS** for beautiful styling
- **React** for the frontend framework

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the console logs and terminal output
3. Ensure all dependencies are properly installed
4. Verify both servers are running

---

**Happy networking! 🎉**

*HeyBot - Your AI Wingman for Breaking the Ice*
