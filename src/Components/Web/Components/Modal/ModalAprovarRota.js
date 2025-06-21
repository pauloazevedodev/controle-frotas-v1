import { React, useState } from 'react';
import ModalStyle from '../Modal/ModalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UPDATE_STATUS_ROTA } from '../../../../api';

const ModalAprovarRota = ({
  open,
  close,
  color,
  data,
  getRotas,
  getStatusRotas,
}) => {
  const [loading, setLoading] = useState(false);
  const [descAprovado, setDescAprovado] = useState('');
  const status = 'Aprovado';

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

  const aprovarRota = async () => {
    const { url, options } = UPDATE_STATUS_ROTA(data, status, descAprovado);
    setLoading(true);
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro do servidor:', errorText);
        return;
      }

      const json = await response.json();

      if (json.status === 'success') {
        getRotas();
        getStatusRotas();
        close();
      } else {
        console.error('Erro ao aprovar a rota:', json.message);
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
                Aprovar Rota - {data?.cod_rota}
              </Typography>
            </Box>
          </>
        }
        color={color}
        content={
          <>
            <Box
              sx={{
                width: '100%',
                height: '100%',
              }}
            >
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    }}
                  >
                    <TextField
                      sx={{
                        backgroundColor: '#192038',
                        borderRadius: 3,
                      }}
                      variant="outlined"
                      label="Se necessário, adicione uma descrição:"
                      fullWidth
                      onChange={(e) => setDescAprovado(e.target.value)}
                    />
                  </Box>
                </Box>
              </ThemeProvider>
            </Box>
          </>
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
                onClick={aprovarRota}
              >
                OK
              </Button>
            </Box>
          </>
        }
      />
    </Box>
  );
};

export default ModalAprovarRota;
