import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

// Hardcoded API key
const GEMINI_API_KEY = 'AIzaSyApzKkyPifrPGh1AB9LQbcMuEPLsIB9dqI'

// Function to extract info from URL (converted from Python)
async function extractInfoFromUrl(url: string): Promise<string[]> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    const response = await fetch(url, { 
      headers,
      signal: AbortSignal.timeout(10000)
    })
    
    if (!response.ok) return []
    
    const text = await response.text()
    
    // Simple text extraction (removing HTML tags)
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')
    
    // Extract capitalized words (similar to Python regex)
    const words = cleanText.match(/\b[A-Z][a-zA-Z]{2,}\b/g) || []
    
    // Remove duplicates and filter length
    const keywords = [...new Set(words)]
      .filter(w => w.length > 2 && w.length < 20)
      .slice(0, 10)
    
    return keywords
  } catch (error) {
    console.error('URL extraction error:', error)
    return []
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      your_name, 
      your_info, 
      their_name, 
      their_info, 
      context
    } = await req.json()

    // Process your interests
    let yourInterests: string[] = []
    if (your_info.match(/^https?:\/\//)) {
      yourInterests = await extractInfoFromUrl(your_info)
    } else {
      yourInterests = your_info.split(',').map((i: string) => i.trim()).filter(Boolean)
    }

    // Process their interests  
    let theirInterests: string[] = []
    if (their_info.match(/^https?:\/\//)) {
      theirInterests = await extractInfoFromUrl(their_info)
    } else {
      theirInterests = their_info.split(',').map((i: string) => i.trim()).filter(Boolean)
    }

    // Find common interests
    const commonInterests = yourInterests.filter(interest => 
      theirInterests.some(theirInterest => 
        theirInterest.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(theirInterest.toLowerCase())
      )
    )

    // Gemini prompt
    const prompt = `
You are a friendly and witty conversation starter generator for networking events and conferences.

TASK:
You are ${your_name} with interests: ${yourInterests.join(', ')}.
You are meeting ${their_name} with interests: ${theirInterests.join(', ')}.
Meeting Context: ${context}

Generate two types of conversation starters:

1. "based_on_their_interests" → ONLY based on ${their_name}'s interests and recent relevant trends in those areas.
2. "based_on_common_interests" → Based on overlapping/common interests between both people.

Rules:
- Exactly 5 suggestions in each category.
- Avoid politics, controversial or sensitive topics.
- Keep them short, friendly, and natural to say out loud.
- Make them engaging so the person will want to continue the conversation.
- Use casual, modern language that feels authentic.

CRITICAL: You MUST return ONLY valid JSON in exactly this format with no extra text, no markdown, no code blocks:
{
  "based_on_their_interests": [
    "string 1",
    "string 2",
    "string 3",
    "string 4",
    "string 5"
  ],
  "based_on_common_interests": [
    "string 1", 
    "string 2",
    "string 3",
    "string 4",
    "string 5"
  ]
}

Do not include any other text, explanations, or formatting. Just the JSON object.
`

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    )

    const geminiData = await geminiResponse.json()
    
    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API')
    }

    let outputText = geminiData.candidates[0].content.parts[0].text.trim()
    
    // Always return the raw response from Gemini exactly as it comes
    const result = {
      raw_response: outputText,
      based_on_their_interests: [`Raw AI Response: ${outputText}`],
      based_on_common_interests: [`Raw AI Response: ${outputText}`]
    }

    return new Response(
      JSON.stringify({
        ...result,
        metadata: {
          your_interests: yourInterests,
          their_interests: theirInterests, 
          common_interests: commonInterests,
          context,
          raw_ai_response: outputText
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate conversation starters',
        details: error.message,
        raw_response: error.toString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})