import React, { useState } from 'react'
import { Sparkles, Users, MessageCircle, Zap, Copy, ExternalLink, Heart, Rocket } from 'lucide-react'

interface ConversationStarters {
  based_on_their_interests: string[]
  based_on_common_interests: string[]
  raw_response?: string
  metadata?: {
    your_interests: string[]
    their_interests: string[]
    common_interests: string[]
    context: string
    raw_ai_response?: string
  }
}

function App() {
  const [formData, setFormData] = useState({
    your_name: '',
    your_info: '',
    their_name: '',
    their_info: '',
    context: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ConversationStarters | null>(null)
  const [error, setError] = useState('')
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/generate-starters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      // Check if response has content before parsing
      const responseText = await response.text()
      console.log('Raw response:', responseText)
      
      let data
      try {
        data = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        // If JSON parsing fails, create a fallback response with the raw text
        data = {
          error: 'Invalid JSON response from server',
          raw_response: responseText,
          based_on_their_interests: [`Raw server response: ${responseText}`],
          based_on_common_interests: [`Raw server response: ${responseText}`]
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      setResult(data)
    } catch (err) {
      console.error('Full error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong! Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, index: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const contexts = [
    'Networking event',
    'Tech conference', 
    'Industry meetup',
    'Workshop/seminar',
    'Coffee break',
    'Lunch break',
    'After-party',
    'Casual meeting'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Sparkles className="w-16 h-16 text-yellow-400 animate-spin" />
              <Heart className="absolute top-2 left-2 w-6 h-6 text-pink-400 animate-ping" />
            </div>
          </div>
          
          <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            HeyBot
          </h1>
          
          <p className="text-2xl font-bold text-white mb-2">
            Your AI Wingman for Breaking the Ice 🧊➡️💬
          </p>
          
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-6">
            <Users className="w-5 h-5" />
            <span>Perfect for conferences, networking events & awkward moments</span>
            <Rocket className="w-5 h-5" />
          </div>

          <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-2xl p-4 max-w-2xl mx-auto">
            <p className="text-yellow-100 font-medium">
              ⚡ We all know that 30-second window to impress industry leaders... 
              Don't waste it with "So... nice weather, huh?" 
            </p>
          </div>
        </div>

        {!result ? (
          /* Form */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Your Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-pink-400" />
                      About You
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.your_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, your_name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        placeholder="Alex"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Your Interests
                      </label>
                      <input
                        type="text"
                        value={formData.your_info}
                        onChange={(e) => setFormData(prev => ({ ...prev, your_info: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        placeholder="AI, machine learning, startups, coffee, travel"
                        required
                      />
                    </div>
                  </div>

                  {/* Their Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-cyan-400" />
                      About Them
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Their Name
                      </label>
                      <input
                        type="text"
                        value={formData.their_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, their_name: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="Jordan"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Their Interests
                      </label>
                      <input
                        type="text"
                        value={formData.their_info}
                        onChange={(e) => setFormData(prev => ({ ...prev, their_info: e.target.value }))}
                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                        placeholder="blockchain, fintech, investing, hiking, photography"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Context */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Where are you meeting?
                  </label>
                  <select
                    value={formData.context}
                    onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    required
                  >
                    <option value="">Select context...</option>
                    {contexts.map(ctx => (
                      <option key={ctx} value={ctx} className="bg-gray-800">{ctx}</option>
                    ))}
                  </select>
                </div>


                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                    <p className="text-red-200">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Generating magic...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate Conversation Starters
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🎉 Your Conversation Starters Are Ready!
              </h2>
              <button
                onClick={() => setResult(null)}
                className="text-cyan-400 hover:text-cyan-300 underline"
              >
                ← Generate new ones
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Based on Their Interests */}
              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-3xl p-6 border border-pink-500/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-pink-400" />
                  Based on {formData.their_name}'s Interests
                </h3>
                
                <div className="space-y-3">
                  {result.based_on_their_interests.map((starter, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 group hover:bg-white/20 transition-all duration-300"
                    >
                      <p className="text-white mb-3">{starter}</p>
                      <button
                        onClick={() => copyToClipboard(starter, `their-${index}`)}
                        className="text-pink-400 hover:text-pink-300 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedIndex === `their-${index}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Based on Common Interests */}
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-lg rounded-3xl p-6 border border-cyan-500/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  Based on Common Interests
                </h3>
                
                <div className="space-y-3">
                  {result.based_on_common_interests.map((starter, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 group hover:bg-white/20 transition-all duration-300"
                    >
                      <p className="text-white mb-3">{starter}</p>
                      <button
                        onClick={() => copyToClipboard(starter, `common-${index}`)}
                        className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedIndex === `common-${index}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metadata */}
            {result.metadata && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">Context Summary</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-300 mb-1">Your Interests:</p>
                    <p className="text-pink-300">{result.metadata.your_interests.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 mb-1">Their Interests:</p>
                    <p className="text-cyan-300">{result.metadata.their_interests.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-gray-300 mb-1">Common Ground:</p>
                    <p className="text-yellow-300">{result.metadata.common_interests.join(', ') || 'None detected'}</p>
                  </div>
                </div>
                {result.metadata.raw_ai_response && (
                  <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Raw AI Response:</p>
                    <p className="text-xs text-gray-300 font-mono">{result.metadata.raw_ai_response}</p>
                  </div>
                )}
              </div>
            )}

            {/* Pro Tips */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Pro Tips for Maximum Impact
              </h4>
              <ul className="space-y-2 text-yellow-100">
                <li>• Smile and make eye contact when delivering these lines 😊</li>
                <li>• Listen actively to their response - that's where the magic happens</li>
                <li>• Be genuine - these are conversation starters, not pickup lines</li>
                <li>• Follow up with related questions to keep the momentum going</li>
                <li>• Remember: Everyone loves talking about their passions! 🔥</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>Made with ❤️ for awkward engineers and networking ninjas everywhere</p>
          <p className="text-sm mt-2">Your conversations will never be the same 🚀</p>
        </div>
      </div>
    </div>
  )
}

export default App