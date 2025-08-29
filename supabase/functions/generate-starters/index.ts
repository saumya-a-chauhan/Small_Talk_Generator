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

🎯 CONVERSATION STARTER GUIDELINES:  

**DO:**
- Reference specific, recent trends in their field (AI breakthroughs, market changes, new technologies)
- Ask about their personal journey or experiences with their interests
- Connect to current events or industry developments
- Use the actual interests provided without requiring more details
- Make starters that work immediately without additional research

**DON'T:**
- Ask "if you know about X" or "mention if you have experience with Y"
- Require users to research or look up information
- Use placeholder text like "[mention a startup]" or "[if you know about]"
- Assume information not provided in the inputs

---

📌 TASKS:  

1. **based_on_their_interests**  
   - Generate 10 conversation starters focused on ${their_name}'s specific interests: ${theirInterests.join(', ')}
   - Use current knowledge about these fields (AI, blockchain, fintech, etc.)
   - Reference real trends, recent developments, or industry insights
   - Make each starter complete and ready to use immediately

2. **based_on_common_interests**  
   - Generate 10 conversation starters highlighting shared passions between ${your_name} and ${their_name}
   - Focus on the common interests: ${commonInterests.join(', ') || 'technology and innovation'}
   - Create natural bonding points around shared knowledge areas
   - Encourage collaboration and knowledge exchange

---

💡 EXAMPLE STYLES (Context: ${context}):  

**For Tech/Professional Contexts:**
- "The recent developments in [specific technology] have been fascinating. What's your take on how it's evolving?"
- "I've been following the [industry trend] closely. How do you see it impacting your work?"
- "What's the most exciting project you've worked on recently in [their field]?"

**For Casual Contexts:**
- "I love how [interest] combines creativity with technical skills. What drew you to it initially?"
- "What's the most rewarding aspect of working in [their field]?"
- "How do you stay updated with all the rapid changes in [their industry]?"

---

🎯 OUTPUT:  
Return ONLY valid JSON in the format:  

{
  "based_on_their_interests": [
    "string 1",
    "string 2",
    "string 3",
    "string 4",
    "string 5",
    "string 6",
    "string 7",
    "string 8",
    "string 9",
    "string 10"
  ],
  "based_on_common_interests": [
    "string 1", 
    "string 2",
    "string 3",
    "string 4",
    "string 5",
    "string 6",
    "string 7",
    "string 8",
    "string 9",
    "string 10"
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