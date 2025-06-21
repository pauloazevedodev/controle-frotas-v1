import React, { useState } from 'react';
import ModalStyle from './ModalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CREATE_USUARIO } from '../../../../api';
import { toast, ToastContainer } from 'react-toastify';
import InputDate from '../Input/InputDate';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputMask from 'react-input-mask';

const ModalCadastroUsuario = ({ open, close, color, getUsuarios }) => {
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#192038',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B0B0B0',
      },
    },
  });

  const clearFields = () => {
    setNome('');
    setCpf('');
    setTipoUsuario('');
    setStatus('');
    setEmail('');
  };

  const createUsuario = async () => {
    if (loading) return;

    if (!nome || !cpf || !tipoUsuario || !status || !email) {
      toast.error('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const { url, options } = CREATE_USUARIO({
      nome,
      cpf,
      tipoUsuario,
      status,
      email,
    });
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        getUsuarios();
        clearFields();
        // toast.success("Usuário cadastrado com sucesso!");
        close();
      } else {
        console.log('Erro ao cadastrar o usuário:', json);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <ModalStyle
          loading={loading}
          open={open}
          close={close}
          title={
            <>
              <Box sx={{ display: 'flex' }}>
                <Typography
                  sx={{
                    fontSize: 25,
                    fontWeight: '700',
                    color: 'white',
                    mr: 42,
                  }}
                >
                  Cadastrar novo usuário
                </Typography>
                <ThemeProvider theme={darkTheme}>
                  <FormControl sx={{ width: 200 }}>
                    <InputLabel
                      id="demo-simple-select-label"
                      sx={{ color: '#FFFFFF' }}
                    >
                      Tipo de Usuário
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={tipoUsuario}
                      onChange={(e) => setTipoUsuario(e.target.value)}
                      label="Tipo de Usuário"
                      sx={{
                        color: '#FFFFFF',
                        backgroundColor: '#192038',
                        borderRadius: 1,
                      }}
                    >
                      <MenuItem value="1">Supervisor</MenuItem>
                      <MenuItem value="2">Motorista</MenuItem>
                    </Select>
                  </FormControl>
                </ThemeProvider>
              </Box>
            </>
          }
          color={color}
          content={
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
                  <ThemeProvider theme={darkTheme}>
                    <TextField
                      sx={{
                        backgroundColor: '#192038',
                        borderRadius: 3,
                        width: '75%',
                        fontSize: '1rem',
                      }}
                      id="nome"
                      label="Insira o nome do funcionário:"
                      variant="outlined"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                    <InputMask
                      mask="999.999.999-99"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder=""
                    >
                      {() => (
                        <TextField
                          sx={{
                            backgroundColor: '#192038',
                            borderRadius: 3,
                            width: '25%',
                            fontSize: '1rem',
                          }}
                          id="cpf"
                          label="CPF"
                          variant="outlined"
                        />
                      )}
                    </InputMask>
                  </ThemeProvider>
                </Box>

                <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
                  <ThemeProvider theme={darkTheme}>
                    <TextField
                      sx={{
                        backgroundColor: '#192038',
                        borderRadius: 3,
                        width: '75%',
                        fontSize: '1rem',
                      }}
                      id="email"
                      label="E-MAIL"
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormControl sx={{ width: '25%' }}>
                      <InputLabel
                        id="demo-simple-select-label"
                        sx={{ color: '#FFFFFF' }}
                      >
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        label="Status"
                        sx={{
                          color: '#FFFFFF',
                          backgroundColor: '#192038',
                          borderRadius: 1,
                        }}
                      >
                        <MenuItem value="ativo">Ativo</MenuItem>
                        <MenuItem value="inativo">Inativo</MenuItem>
                      </Select>
                    </FormControl>
                  </ThemeProvider>
                </Box>
              </Box>
            </LocalizationProvider>
          }
          action={
            <>
              <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                <Button
                  sx={{
                    textTransform: 'none',
                    color: 'red',
                    borderColor: 'red',
                    width: '50%',
                    height: 40,
                    '&:hover': {
                      color: '#e00000',
                      border: '2px solid #e00000',
                    },
                  }}
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={close}
                >
                  CANCELAR
                </Button>

                <Button
                  sx={{
                    textTransform: 'none',
                    color: 'green',
                    borderColor: 'green',
                    width: '50%',
                    height: 40,
                    '&:hover': {
                      color: '#00c500',
                      border: '2px solid #00c500',
                    },
                  }}
                  variant="outlined"
                  startIcon={<CheckIcon />}
                  onClick={createUsuario}
                >
                  CADASTRAR
                </Button>
              </Box>
            </>
          }
        />
      </Box>
    </>
  );
};

export default ModalCadastroUsuario;
