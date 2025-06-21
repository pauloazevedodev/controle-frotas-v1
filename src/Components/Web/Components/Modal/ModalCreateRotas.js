import React, { useEffect, useRef, useState } from 'react';
import ModalStyle from '../Modal/ModalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Divider, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  CREATE_VEICULOS,
  GET_MOTORISTAS,
  GET_ROTAS,
  INSERT_ROTA,
} from '../../../../api';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '../../../Web/Components/Grid/Grid';

const columns = [
  { field: 'partida', headerName: 'LOCAL DE PARTIDA', flex: 1 },
  { field: 'local_chegada', headerName: 'LOCAL DE CHEGADA', flex: 1 },
];

const ModalCreateRotas = ({ open, close, color, data }) => {
  const [loading, setLoading] = useState(false);
  const [localPartida, setLocalPartida] = useState('');
  const [localChegada, setLocalChegada] = useState('');
  const [rows, setRows] = useState([]);

  const gridRef = useRef(null);

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
    setLocalChegada('');
    setLocalPartida('');
  };

  const insertRota = async () => {
    const { url, options } = INSERT_ROTA({
      localPartida,
      localChegada,
    });
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        // toast.success("Veículo cadastrado com sucesso!");
        // getVeiculos();
        clearFields();
        close();
      } else {
        toast.error('Erro ao cadastrar o veículo');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRotas = async () => {
    const { url, options } = GET_ROTAS();
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        setRows(json);
      } else {
        console.log('Erro ao buscar veículos');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  useEffect(() => {
    getRotas();
  }, []);

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
                }}
              >
                {data?.modelo} - {data?.placa}
              </Typography>
            </Box>
          </>
        }
        color={color}
        content={
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
                <Typography sx={{ fontSize: 15 }}>
                  Adicionar uma rota para o veículo
                </Typography>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
                <ThemeProvider theme={darkTheme}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '50%',
                      fontSize: '1rem',
                    }}
                    id="partida"
                    label="Local de Partida:"
                    variant="outlined"
                    value={localPartida}
                    onChange={(e) => setLocalPartida(e.target.value)}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '50%',
                      fontSize: '1rem',
                    }}
                    id="chegada"
                    label="Local de Chegada:"
                    variant="outlined"
                    value={localChegada}
                    onChange={(e) => setLocalChegada(e.target.value)}
                  />
                </ThemeProvider>
              </Box>
              <Divider />
              <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
                <Typography sx={{ fontSize: 15 }}>
                  Adicionar uma rota para o veículo
                </Typography>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
                <Grid ref={gridRef} columns={columns} rows={rows} />
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
                onClick={insertRota}
              >
                ADICIONAR
              </Button>
            </Box>
          </>
        }
      />
    </Box>
  );
};

export default ModalCreateRotas;
