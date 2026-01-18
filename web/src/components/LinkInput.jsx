import { useState } from 'react'

function LinkInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  return (
    <form className="link-input" onSubmit={handleSubmit}>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a URL to analyze..."
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading || !url.trim()}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  )
}

export default LinkInput
