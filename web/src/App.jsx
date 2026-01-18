import { useState } from 'react'
import LinkInput from './components/LinkInput'
import ResultCard from './components/ResultCard'
import { analyzeUrl } from './services/api'

function App() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async (url) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeUrl(url)
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred during analysis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Serein</h1>
        <p>Analyze any web page with AI</p>
      </header>

      <main className="main">
        <LinkInput onSubmit={handleAnalyze} loading={loading} />

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            Analyzing...
          </div>
        )}

        {result && <ResultCard result={result} />}
      </main>

      <footer className="footer">
        <p>Powered by Claude AI</p>
      </footer>
    </div>
  )
}

export default App
