import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Typography, Card, Grid, Button, CircularProgress, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import CloudIcon from '@mui/icons-material/Cloud'
import StorageIcon from '@mui/icons-material/Storage'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://3.74.42.88:8081'

const StatCard = styled(Card)({
  padding: '1.5rem',
  borderRadius: 16,
  border: '1px solid rgba(0,0,0,0.04)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
})

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [environments, setEnvironments] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))

    fetch(`${API_URL}/api/v1/environments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEnvironments(data.environments || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#1a1a2e' }} />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, letterSpacing: '-0.02em' }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user?.firstName || 'User'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => router.push('/environments/new')}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#2d2d44' } }}
          >
            + New Environment
          </Button>
          <Button variant="outlined" onClick={handleLogout} sx={{ borderColor: '#e0e0e0', color: '#6b7280' }}>
            Logout
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CloudIcon sx={{ color: '#1a1a2e' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Environments</Typography>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>{environments.length}</Typography>
              </Box>
            </Box>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <StorageIcon sx={{ color: '#1a1a2e' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">Status</Typography>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#10b981' }}>● Active</Typography>
              </Box>
            </Box>
          </StatCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon sx={{ color: '#1a1a2e' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">API</Typography>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#10b981' }}>Connected</Typography>
              </Box>
            </Box>
          </StatCard>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>Environments</Typography>
      {environments.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#fafafa' }}>
          <Typography color="text.secondary">No environments yet. Create your first one!</Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {environments.map((env: any) => (
            <Grid size={{ xs: 12, md: 4 }} key={env.id}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>{env.name}</Typography>
                <Typography variant="body2" color="text.secondary">{env.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">{env.region}</Typography>
                  <Typography variant="caption" sx={{ color: '#10b981' }}>{env.status}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
   )
}