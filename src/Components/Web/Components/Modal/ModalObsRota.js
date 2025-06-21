import { React, useState, useEffect } from 'react';
import ModalStyle from '../Modal/ModalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UPDATE_OBS_ROTA } from '../../../../api';

const ModalObsRota = ({ open, close, color, data, getObsRotas, obs }) => {
  const [loading, setLoading] = useState(false);
  const [observacoesAdicionais, setObservacoesAdicionais] = useState('');

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

  useEffect(() => {
    setObservacoesAdicionais(
      obs?.[0]?.obs_adicional || data?.obs_adicional || '',
    );
  }, [obs, data]);

  const obsRota = async () => {
    const { url, options } = UPDATE_OBS_ROTA(data, {
      observacoesAdicionais,
    });
    setLoading(true);
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        return;
      }

      const json = await response.json();

      if (json.success) {
        getObsRotas();
        close();
      } else {
        console.error('Erro ao atualizar a rota:', json.message);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <ModalStyle
        loading={loading}
        open={open}
        close={close}
        title={
          <Box sx={{ display: 'flex' }}>
            <Typography
              sx={{
                fontSize: 25,
                fontWeight: '700',
                color: 'white',
                mr: 4,
              }}
            >
              Adicionar Observações - {data?.cod_rota}
            </Typography>
          </Box>
        }
        color={color}
        content={
          <Box sx={{ width: '100%', height: '100%' }}>
            <ThemeProvider theme={darkTheme}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  mb: 2,
                }}
              >
                <Typography
                  sx={{ fontSize: 16, fontWeight: '500', color: 'white' }}
                >
                  Observações adicionais:
                </Typography>
                <TextField
                  sx={{
                    width: '100%',
                    backgroundColor: '#192038',
                    borderRadius: 3,
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#3e4a61',
                      },
                      '&:hover fieldset': {
                        borderColor: '#5e6e85',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8f9db5',
                      },
                    },
                  }}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={5}
                  value={observacoesAdicionais}
                  onChange={(e) => setObservacoesAdicionais(e.target.value)}
                />
              </Box>
            </ThemeProvider>
          </Box>
        }
        action={
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
              onClick={obsRota}
            >
              ADICIONAR
            </Button>
          </Box>
        }
      />
    </Box>
  );
};

export default ModalObsRota;
