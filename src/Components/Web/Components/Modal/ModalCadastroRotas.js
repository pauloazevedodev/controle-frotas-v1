import React, { useEffect, useState } from 'react';
import ModalStyle from '../Modal/ModalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Button,
  Divider,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CREATE_ROTAS, GET_CEP, GET_MOTORISTAS } from '../../../../api';
import { toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';

const ModalCadastroVeiculo = ({ open, close, color, getRotas, veiculo }) => {
  const [loading, setLoading] = useState(false);
  // const [cepPartida, setCepPartida] = useState('');
  const [cepChegada, setCepChegada] = useState('');
  // const [numeroPartida, setNumeroPartida] = useState('');
  const [numeroChegada, setNumeroChegada] = useState('');
  // const [descricaoPartida, setDescricaoPartida] = useState('');
  const [descricaoChegada, setDescricaoChegada] = useState('');
  // const [complementoPartida, setComplementoPartida] = useState('');
  const [complementoChegada, setComplementoChegada] = useState('');
  // const [enderecoPartida, setEnderecoPartida] = useState({
  //   rua: '',
  //   bairro: '',
  //   cidade: '',
  //   estado: '',
  // });
  const [enderecoChegada, setEnderecoChegada] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [paradas, setParadas] = useState([]);
  const [selectMotoristas, setSelectMotoristas] = useState([]);
  const [motorista, setMotorista] = useState('');

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
    // setCepPartida('');
    setCepChegada('');
    // setNumeroPartida('');
    setNumeroChegada('');
    // setDescricaoPartida('');
    setDescricaoChegada('');
    // setComplementoPartida('');
    setComplementoChegada('');
    // setEnderecoPartida({ rua: '', bairro: '', cidade: '', estado: '' });
    setEnderecoChegada({ rua: '', bairro: '', cidade: '', estado: '' });
    setParadas([]);
  };

  const [loadingCep, setLoadingCep] = useState(false);

  const fetchEndereco = async (cep, setEndereco) => {
    setLoadingCep(true);
    try {
      const { url, options } = GET_CEP(cep);
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        setEndereco({
          rua: json.logradouro,
          bairro: json.bairro,
          cidade: json.localidade,
          estado: json.uf,
        });
      } else {
        toast.error('CEP inválido');
      }
    } catch (error) {
      console.error('Erro ao buscar endereço:', error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (cep, setCep, setEndereco) => {
    setCep(cep);
    if (cep.length === 8) {
      fetchEndereco(cep, setEndereco);
    }
  };

  const addParada = () => {
    setParadas([
      ...paradas,
      {
        cep: '',
        numero: '',
        descricao: '',
        complemento: '',
        endereco: { rua: '', bairro: '', cidade: '', estado: '' },
      },
    ]);
  };

  const removeParada = (index) => {
    const updatedParadas = paradas.filter((_, i) => i !== index);
    setParadas(updatedParadas);
  };

  const handleParadaChange = (index, field, value) => {
    setParadas((prevParadas) =>
      prevParadas.map((parada, i) =>
        i === index
          ? {
              ...parada,
              [field]: value,
            }
          : parada,
      ),
    );

    if (field === 'cep' && value.length === 8) {
      fetchEndereco(value, (endereco) => {
        setParadas((prevParadas) =>
          prevParadas.map((parada, i) =>
            i === index
              ? {
                  ...parada,
                  endereco,
                }
              : parada,
          ),
        );
      });
    }
  };

  const validarCampos = () => {
    const camposObrigatorios = [
      // { campo: cepPartida, nome: 'CEP de Partida' },
      // { campo: numeroPartida, nome: 'Número de Partida' },
      { campo: cepChegada, nome: 'CEP de Chegada' },
      { campo: numeroChegada, nome: 'Número de Chegada' },
    ];
    const camposVazios = camposObrigatorios.filter(({ campo }) => !campo);
    if (camposVazios.length) {
      toast.error(
        `Por favor, preencha os seguintes campos: ${camposVazios
          .map(({ nome }) => nome)
          .join(', ')}`,
      );
      return false;
    }
    return true;
  };
  const createRota = async () => {
    if (!validarCampos()) return;

    const { url, options } = CREATE_ROTAS({
      motorista,
      veiculo,
      // cepPartida,
      cepChegada,
      // numeroPartida,
      numeroChegada,
      // descricaoPartida,
      descricaoChegada,
      // complementoPartida,
      complementoChegada,
      // enderecoPartida,
      enderecoChegada,
      paradas,
    });

    setLoading(true);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        toast.success('Rota cadastrada com sucesso!');
        getRotas();
        clearFields();
        close();
      } else {
        toast.error('Erro ao cadastrar a rota');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMotoristas = async () => {
    const { url, options } = GET_MOTORISTAS();
    const response = await fetch(url, options);
    const json = await response.json();
    if (response.ok) setSelectMotoristas(json);
    else console.log('Erro ao buscar motoristas:', json);
  };

  useEffect(() => {
    getMotoristas();
  }, []);
  return (
    <Box>
      <ModalStyle
        loading={loading}
        open={open}
        close={close}
        sx={{ width: '45%' }}
        title={
          <Typography sx={{ fontSize: 25, fontWeight: '700', color: 'white' }}>
            Cadastrar Rota
          </Typography>
        }
        color={color}
        content={
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ width: '100%', height: '100%' }}>
              <ThemeProvider theme={darkTheme}>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: 'white',
                    mb: 2,
                  }}
                >
                  Defina um motorista para a rota:
                </Typography>
                <FormControl sx={{ width: '59%', mb: 2 }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={motorista}
                    onChange={(e) => setMotorista(e.target.value)}
                    sx={{
                      color: '#FFFFFF',
                      backgroundColor: '#192038',
                    }}
                  >
                    {selectMotoristas.map((motorista) => (
                      <MenuItem value={motorista?.cod_usur}>
                        {motorista?.cod_usur} - {motorista?.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: 'white',
                    mb: 2,
                  }}
                >
                  Local de Partida:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="CEP:"
                    variant="outlined"
                    value={cepPartida}
                    onChange={(e) =>
                      handleCepChange(
                        e.target.value,
                        setCepPartida,
                        setEnderecoPartida,
                      )
                    }
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Número:"
                    variant="outlined"
                    value={numeroPartida}
                    onChange={(e) => setNumeroPartida(e.target.value)}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Rua:"
                    variant="outlined"
                    value={enderecoPartida.rua}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Bairro:"
                    variant="outlined"
                    value={enderecoPartida.bairro}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Cidade:"
                    variant="outlined"
                    value={enderecoPartida.cidade}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Estado:"
                    variant="outlined"
                    value={enderecoPartida.estado}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Descrição:"
                    variant="outlined"
                    value={descricaoPartida}
                    onChange={(e) => setDescricaoPartida(e.target.value)}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Complemento:"
                    variant="outlined"
                    value={complementoPartida}
                    onChange={(e) => setComplementoPartida(e.target.value)}
                  />
                </Box> */}
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: 'white',
                    mb: 2,
                  }}
                >
                  Paradas:
                </Typography>
                {paradas.map((parada, index) => (
                  <Box
                    key={index}
                    sx={{ mb: 3, borderBottom: '1px solid gray', pb: 2 }}
                  >
                    <Typography sx={{ color: 'white', mb: 1 }}>
                      Parada {index + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      {/* cep de parada */}
                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '60%',
                        }}
                        label="CEP:"
                        variant="outlined"
                        value={parada.cep}
                        onChange={(e) =>
                          handleParadaChange(index, 'cep', e.target.value)
                        }
                      />

                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '40%',
                        }}
                        label="Número:"
                        variant="outlined"
                        value={parada.numero}
                        onChange={(e) =>
                          handleParadaChange(index, 'numero', e.target.value)
                        }
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '60%',
                        }}
                        label="Rua"
                        value={parada.endereco.rua}
                        InputProps={{
                          readOnly: true,
                          endAdornment: loadingCep ? (
                            <CircularProgress size={20} />
                          ) : null,
                        }}
                      />
                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '40%',
                        }}
                        label="Bairro:"
                        variant="outlined"
                        value={parada.endereco.bairro}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '60%',
                        }}
                        label="Cidade:"
                        variant="outlined"
                        value={parada.endereco.cidade}
                        InputProps={{ readOnly: true }}
                      />
                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '40%',
                        }}
                        label="Estado:"
                        variant="outlined"
                        value={parada.endereco.estado}
                        InputProps={{ readOnly: true }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '60%',
                        }}
                        label="Descrição:"
                        variant="outlined"
                        value={parada.descricao}
                        onChange={(e) =>
                          handleParadaChange(index, 'descricao', e.target.value)
                        }
                      />
                      <TextField
                        sx={{
                          backgroundColor: '#192038',
                          borderRadius: 3,
                          width: '40%',
                        }}
                        label="Complemento:"
                        variant="outlined"
                        value={parada.complemento}
                        onChange={(e) =>
                          handleParadaChange(
                            index,
                            'complemento',
                            e.target.value,
                          )
                        }
                      />
                    </Box>
                    <Button
                      startIcon={<DeleteIcon />}
                      sx={{
                        textTransform: 'none',
                        width: '30%',
                        '&:hover': {
                          color: '#e00000',
                          border: '2px solid #e00000',
                        },
                        border: '2px solid',
                        height: 40,
                      }}
                      onClick={() => removeParada(index)}
                      variant="outlined"
                    >
                      Remover Parada - {index + 1}
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  sx={{
                    textTransform: 'none',
                    width: '30%',
                    mb: 2,
                    border: '2px solid',
                    '&:hover': {
                      color: '#00c500',
                      border: '2px solid #00c500',
                    },
                  }}
                  onClick={addParada}
                >
                  Adicionar Parada
                </Button>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: 'white',
                    mb: 2,
                  }}
                >
                  Local de Chegada:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="CEP:"
                    variant="outlined"
                    value={cepChegada}
                    onChange={(e) =>
                      handleCepChange(
                        e.target.value,
                        setCepChegada,
                        setEnderecoChegada,
                      )
                    }
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Número:"
                    variant="outlined"
                    value={numeroChegada}
                    onChange={(e) => setNumeroChegada(e.target.value)}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Rua:"
                    variant="outlined"
                    value={enderecoChegada.rua}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Bairro:"
                    variant="outlined"
                    value={enderecoChegada.bairro}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Cidade:"
                    variant="outlined"
                    value={enderecoChegada.cidade}
                    InputProps={{ readOnly: true }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Estado:"
                    variant="outlined"
                    value={enderecoChegada.estado}
                    InputProps={{ readOnly: true }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Descrição:"
                    variant="outlined"
                    value={descricaoChegada}
                    onChange={(e) => setDescricaoChegada(e.target.value)}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Complemento:"
                    variant="outlined"
                    value={complementoChegada}
                    onChange={(e) => setComplementoChegada(e.target.value)}
                  />
                </Box>
              </ThemeProvider>
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
                onClick={createRota}
              >
                {loading ? 'Salvando...' : 'Salvar Rota'}
              </Button>
            </Box>
          </>
        }
      />
    </Box>
  );
};

export default ModalCadastroVeiculo;
