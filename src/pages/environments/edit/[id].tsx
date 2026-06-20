import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Paper, Typography, TextField, Button, Alert, MenuItem, Stack } from '@mui/material'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.74.42.88:8081'

const regions = ['us-east-1', 'us-west-2', 'eu-central-1', 'eu-west-1', 'ap-southeast-1']

export default function EditEnvironment() {
  const router = useRouter()
  const { id } = router.query
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [region, setRegion] = useState('eu-central-1')
  const [status, setStatus] = useState('draft')

  useEffect(() => {
    if (!id) return
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    fetch(`${API_URL}/api/v1/environments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.environment) {
          setName(data.environment.name)
          setDescription(data.environment.description || '')
          setRegion(data.environment.region)
          setStatus(data.environment.status)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load environment')
        setLoading(false)
      })
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/api/v1/environments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, region, status }),
      })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update')
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Typography>Loading...</Typography>
    </Box>
  )

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={0} sx={{ p: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
          Edit Environment
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            select
            label="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            margin="normal"
          >
            {regions.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
          <TextField
            fullWidth
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            margin="normal"
          >
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button fullWidth variant="outlined" onClick={() => router.push('/dashboard')}>
              Cancel
            </Button>
            <Button fullWidth type="submit" variant="contained" disabled={saving} sx={{ bgcolor: '#1a1a2e' }}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}