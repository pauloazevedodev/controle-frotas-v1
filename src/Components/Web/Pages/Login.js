import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { LOGIN } from '../../../api';
import { toast, ToastContainer } from 'react-toastify';
import Logo from '../../../Assets/alfaid_nova_logo_branca.png';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

const Login = ({ setIsAuthenticated }) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  const handleLogin = async () => {
    const { url, options } = LOGIN(usuario, senha);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('isAuthenticated', 'true');
        // toast.success("Login bem-sucedido!");
      } else {
        toast.error('Usuário ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={7000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          backgroundColor: '#192038',
          color: '#FFFFFF',
        }}
      />

      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          backgroundColor: '#151a30',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#222b45',
            height: '92%',
            width: '96%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2,
            boxSizing: 'border-box',
            borderRadius: '8px',
            border: '1px solid #101426',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              width: '25vw',
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: '300px', marginBottom: '16px' }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
                Seja bem-vindo ao ALFAID!
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                Faça o login para acessar o sistema
              </Typography>
            </Box>
            <TextField
              label="Insira o seu nome"
              variant="outlined"
              fullWidth
              margin="normal"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              sx={{
                input: { color: '#fff' },
                label: { color: '#fff' },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff',
                },
                '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                  { borderColor: '#fff' },
              }}
            />
            <TextField
              label="Insira a sua senha"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              margin="normal"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              sx={{
                input: { color: '#fff' },
                label: { color: '#fff' },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff',
                },
                '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline':
                  { borderColor: '#fff' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#fff' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              sx={{
                backgroundColor: '#233054',
                textTransform: 'none',
                color: '#3366FF',
                border: '2px solid #3366ff',
                height: 40,
                fontSize: 16,
                '&:hover': {
                  color: 'white',
                  border: '2px solid white',
                  backgroundColor: '#233054',
                },
                mt: 2,
              }}
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
            >
              ENTRAR
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
