import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Box, Typography, Button, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'

const Hero = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  background: '#f7f9fc',
  padding: '2rem',
})

const Logo = styled('div')({
  fontSize: '3rem',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  color: '#1a1a2e',
  marginBottom: '0.5rem',
  '& span': {
    color: '#6b7280',
  },
})

const Subtitle = styled(Typography)({
  fontSize: '1.125rem',
  color: '#6b7280',
  maxWidth: '480px',
  marginBottom: '2.5rem',
  lineHeight: 1.6,
})

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <Container disableGutters maxWidth={false}>
      <Hero>
        <Logo>
          Cloud<span>Ops</span>
        </Logo>
        <Typography variant="h2" sx={{ fontWeight: 300, fontSize: '1.25rem', color: '#6b7280', mb: 1 }}>
          Infrastructure as Code · Kubernetes · Cost Management
        </Typography>
        <Subtitle>
          Modern cloud infrastructure management platform.
          Deploy, scale, and monitor your cloud resources with ease.
        </Subtitle>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/login')}
            sx={{ bgcolor: '#1a1a2e', '&:hover': { bgcolor: '#2d2d44' } }}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push('/register')}
            sx={{ borderColor: '#1a1a2e', color: '#1a1a2e' }}
          >
            Get Started
          </Button>
        </Stack>
        <Box sx={{ mt: 4, fontSize: '0.75rem', color: '#b0b8c4', letterSpacing: '0.05em' }}>
          — powered by Python · Flask · AWS —
        </Box>
      </Hero>
    </Container>
  )
}
