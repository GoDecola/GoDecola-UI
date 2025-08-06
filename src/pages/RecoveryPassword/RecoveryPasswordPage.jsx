import './RecoveryPasswordPage.css';
import { Box, Typography, Button, Container, Alert, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { baseURL } from '../../utils/baseURL';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CustomPasswordField } from '../../components/CustomInputs/CustomPasswordField';

export default function RecoveryPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      setError('Link de redefinição inválido ou expirado.')
    }
  }, [token, email]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!token || !email) {
      setError('Link de redefinição inválido. Por favor, solicite um novo link');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(`${baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          token: token,
          newPassword: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Senha redefinida com sucesso!');
        setTimeout(() => {
          navigate('/login');
        }, 3000)
      } else {
        setError(data.message || 'Não foi possível redefinir a senha. Solicite um novo link.')
        return;
      }
    } catch (err) {
      setError('Não foi possível conectar ao servidor', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" backgroundColor="var(--surface-bg)" sx={{ padding: '24px' }}>
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'var(--surface-bg)',
          padding: { xs: 2, md: 4 },
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'background-color 0.25s ease-in-out',
        }}
      >
        <Typography 
          component="h1" 
          variant="h5" 
          sx={{ color: 'var(--orange-avanade-invert)', fontWeight: 'bold' }}
        >
          RECUPERE SUA SENHA
        </Typography>
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          noValidate 
          sx={{ mt: 3, width: '100%' }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <CustomPasswordField
              label="Digite sua nova senha"
              name="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <CustomPasswordField
              label="Repita sua nova senha"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
          
          {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{message}</Alert>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !!message}
            sx={{
              mt: 4,
              mb: 2,
              padding: '0.8rem 4rem',
              borderRadius: '15px',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #f15a29, #e94e1b)',
              '&:hover': {
                background: 'linear-gradient(to right, #e94e1b, #f15a29)',
                transform: 'scale(1.02)'
              },
              transition: 'transform 0.2s ease-in-out, background 0.3s',
            }}
          >
            {loading ? <CircularProgress size={24} sx={{color: 'white'}} /> : 'ENVIAR'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}