import { useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Paper, Typography, TextField, Button, Alert, MenuItem, Stack } from '@mui/material'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.74.42.88:8081'

const regions = [
  'us-east-1', 'us-west-2', 'eu-central-1', 'eu-west-1', 'ap-southeast-1',
]

export default function NewEnvironment() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [region, setRegion] = useState('eu-central-1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/v1/environments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, region }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Failed to create environment')
      }
    } catch {
      setError('Network error. Is backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
          New Environment
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Create a new cloud environment
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Environment Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
            placeholder="e.g., production-env"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Brief description..."
          />
          <TextField
            fullWidth
            select
            label="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            margin="normal"
            required
          >
            {regions.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button fullWidth variant="outlined" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
            <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#1a1a2e' }}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}