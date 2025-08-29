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

    // Gemini prompt (FULL CONTENT KEPT)
    const prompt = `
You are **The Ultimate Conversation Strategist**.  
Your job is to generate conversation openers that make first-time interactions smooth, engaging, and meaningful.  

The goal:  
- Break the ice naturally.  
- Build comfort and trust.  
- Spark curiosity so the other person wants to keep talking.  
- Respect the setting (formal vs. informal).  
- Make ${your_name} appear confident, thoughtful, and genuinely interested in ${their_name}.  

---

📥 INPUTS:  
- **You**: ${your_name}, interests: ${yourInterests.join(', ')}.  
- **Person you're meeting**: ${their_name}, interests: ${theirInterests.join(', ')}.  
- **Meeting Context**: ${context} (examples: networking event, job interview, coffee chat, tech conference, exhibition, meeting senior leader).  
- **Common Interests**: ${commonInterests.join(', ') || 'None detected'}.  

---

⚡ CRITICAL RULES:  

1. **NEVER ask users to fill in information** - All conversation starters must be complete and self-contained  
2. **Use current knowledge and trends** - Reference real, recent developments in their fields of interest  
3. **Focus on what's provided** - Only use the interests and context given, don't assume additional information  
4. **Make it actionable immediately** - Users should be able to use these starters right away without preparation  

---

📌 TASKS:  

1. **based_on_their_interests**  
   - Generate 10 conversation starters focused on ${their_name}'s specific interests: ${theirInterests.join(', ')}  
   - Use current knowledge about these fields  
   - Reference real trends, recent developments, or industry insights  
   - Make each starter complete and ready to use immediately  

2. **based_on_common_interests**  
   - Generate 10 conversation starters highlighting shared passions between ${your_name} and ${their_name}  
   - Focus on the common interests: ${commonInterests.join(', ') || 'technology and innovation'}  
   - Create natural bonding points around shared knowledge areas  
   - Encourage collaboration and knowledge exchange  

---

🎯 OUTPUT:  
Return ONLY valid JSON in the format:  

{
  "based_on_their_interests": [
    "string 1", "string 2", ..., "string 10"
  ],
  "based_on_common_interests": [
    "string 1", "string 2", ..., "string 10"
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

    // ✅ Strip Markdown code fences
    outputText = outputText.replace(/```json|```/g, '').trim()

    // ✅ Parse JSON or fallback
    let result
    try {
      result = JSON.parse(outputText)
    } catch {
      result = {
        based_on_their_interests: [],
        based_on_common_interests: [],
        raw_response: outputText
      }
    }

    return new Response(
      JSON.stringify({
        ...result,
        metadata: {
          your_interests: yourInterests,
          their_interests: theirInterests, 
          common_interests: commonInterests,
          context,
          // ✅ Ensure raw_ai_response is always plain string, not JSON
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
