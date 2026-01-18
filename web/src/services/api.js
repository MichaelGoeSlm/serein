import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export async function analyzeUrl(url) {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, { url })
    return response.data
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Failed to connect to the server')
  }
}
