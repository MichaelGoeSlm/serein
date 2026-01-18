function ResultCard({ result }) {
  if (!result) return null

  return (
    <div className="result-card">
      <h2>Analysis Result</h2>
      <p className="url">{result.url}</p>
      <div className="analysis">
        {result.analysis}
      </div>
    </div>
  )
}

export default ResultCard
