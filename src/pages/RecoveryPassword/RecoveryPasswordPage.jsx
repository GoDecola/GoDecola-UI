import './RecoveryPasswordPage.css';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Input from '@mui/material/Input';
import LockIcon from '@mui/icons-material/Lock';
import { useEffect, useState } from 'react';
import { baseURL } from '../../utils/baseURL';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function RecoveryPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();
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
    <div className="container-pwd">
      <h2>RECUPERE SUA SENHA</h2>
      <form className="edit-form-password" onSubmit={handleSubmit}>
        {/* Campo de senha com ícone de visibilidade e ícone do cadeado */}
        <Box sx={{ label: { color: 'var(--primary-text-color)' }, display: 'flex', alignItems: 'flex-end', width: '94%', ml: 1, mb: 2 }}>
          <LockIcon sx={{ color: 'var(--primary-text-color)', mr: 1, my: 0.5 }} />
          <FormControl sx={{ width: '100%' }} variant="standard">
            <InputLabel htmlFor="new-password"> Digite sua nova Senha </InputLabel>
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    sx={{ color: 'var(--primary-text-color)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        {/* Campo de confirmar senha com ícone de visibilidade e ícone do cadeado */}
        <Box sx={{ label: { color: 'var(--primary-text-color)' }, display: 'flex', alignItems: 'flex-end', width: '94%', ml: 1, mb: 2 }}>
          <LockIcon sx={{ color: 'var(--primary-text-color)', mr: 1, my: 0.5 }} />
          <FormControl sx={{ width: '100%'}} variant="standard">
            <InputLabel htmlFor="confirm-password">Repita sua nova senha</InputLabel>
            <Input
              id="confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    edge="end"
                    sx={{ color: 'var(--primary-text-color)'}}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

      <div className='button-wrapper'>
        <button type="submit" className="btn-recovery" disabled={loading || !!message}>
          {loading ? 'ENVIANDO...' : 'ENVIAR'}
        </button>
      </div>
      </form>
    </div>
  );
}