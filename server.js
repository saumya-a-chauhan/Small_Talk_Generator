import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 54321;

// Middleware
app.use(cors());
app.use(express.json());

// Mock the Supabase Edge Function
app.post('/functions/v1/generate-starters', async (req, res) => {
  try {
    const { 
      your_name, 
      your_info, 
      their_name, 
      their_info, 
      context
    } = req.body;

    // Process interests (simplified version)
    const yourInterests = your_info.split(',').map(i => i.trim()).filter(Boolean);
    const theirInterests = their_info.split(',').map(i => i.trim()).filter(Boolean);
    
    // Find common interests
    const commonInterests = yourInterests.filter(interest => 
      theirInterests.some(theirInterest => 
        theirInterest.toLowerCase().includes(interest.toLowerCase()) ||
        interest.toLowerCase().includes(theirInterest.toLowerCase())
      )
    );

    // Mock Gemini API response - this simulates what the real API would return
    const mockGeminiResponse = `Based on your interests in ${yourInterests.join(', ')} and ${their_name}'s interests in ${theirInterests.join(', ')}, here are some conversation starters for your ${context}:

**Based on their interests:**
1. "I noticed you're into ${theirInterests[0] || 'technology'}. What's the most exciting development you've seen in that field recently?"
2. "Your work in ${theirInterests[1] || 'innovation'} sounds fascinating. How did you get started in that area?"
3. "I'm curious about ${theirInterests[2] || 'your industry'}. What trends are you seeing that most people aren't talking about?"
4. "Your background in ${theirInterests[3] || 'this field'} is impressive. What's the biggest challenge you're facing right now?"
5. "I'd love to hear more about ${theirInterests[4] || 'your experience'}. What's something that surprised you recently?"

**Based on common interests:**
1. "We both seem interested in ${commonInterests[0] || 'learning'}. What's the most valuable thing you've discovered about it?"
2. "It's great that we share an interest in ${commonInterests[1] || 'growth'}. How do you stay updated in that area?"
3. "Our mutual interest in ${commonInterests[2] || 'development'} is exciting. What's your take on the current state of things?"
4. "Since we both care about ${commonInterests[3] || 'progress'}, what do you think is the next big thing to watch?"
5. "Our shared passion for ${commonInterests[4] || 'innovation'} is perfect for this ${context}. What's inspiring you lately?"`;

    // Return the response exactly as Gemini would (raw text, no JSON parsing)
    const result = {
      raw_response: mockGeminiResponse,
      based_on_their_interests: [`Raw AI Response: ${mockGeminiResponse}`],
      based_on_common_interests: [`Raw AI Response: ${mockGeminiResponse}`],
      metadata: {
        your_interests: yourInterests,
        their_interests: theirInterests,
        common_interests: commonInterests,
        context,
        raw_ai_response: mockGeminiResponse
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate conversation starters',
      details: error.message,
      raw_response: error.toString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Mock Supabase server running on http://localhost:${PORT}`);
  console.log(`Functions available at http://localhost:${PORT}/functions/v1/`);
});
