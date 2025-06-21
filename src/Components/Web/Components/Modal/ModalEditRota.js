import React, { useEffect, useState, useCallback } from 'react';
import ModalStyle from '../Modal/ModalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  EDIT_ROTAS,
  GET_CEP,
  GET_MOTORISTAS,
  GET_VEICULOS,
  GET_VEICULOS_DISPONIVEIS,
} from '../../../../api';
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';

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

const ModalEditRota = ({ open, close, data, color, getRotas }) => {
  const [loading, setLoading] = useState(false);
  const [loadingCepChegada, setLoadingCepChegada] = useState(false);
  const [loadingCepParada, setLoadingCepParada] = useState({});

  const [cepChegada, setCepChegada] = useState('');
  const [numeroChegada, setNumeroChegada] = useState('');
  const [descricaoChegada, setDescricaoChegada] = useState('');
  const [complementoChegada, setComplementoChegada] = useState('');
  const [enderecoChegada, setEnderecoChegada] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const [paradas, setParadas] = useState([]);

  const [selectMotoristas, setSelectMotoristas] = useState([]);
  const [motorista, setMotorista] = useState('');
  const [selectVeiculos, setSelectVeiculos] = useState([]);
  const [veiculo, setVeiculo] = useState('');

  const clearFields = () => {
    setCepChegada('');
    setNumeroChegada('');
    setDescricaoChegada('');
    setComplementoChegada('');
    setEnderecoChegada({ rua: '', bairro: '', cidade: '', estado: '' });
    setParadas([]);
    setMotorista('');
    setVeiculo('');
    setLoadingCepChegada(false);
    setLoadingCepParada({});
  };

  const fetchEndereco = useCallback(
    async (cep, setEndereco, setLoadingState) => {
      if (setLoadingState) setLoadingState(true);
      try {
        const cepFormatado = cep.replace(/\D/g, '');
        if (cepFormatado.length !== 8) {
          if (cepFormatado.length > 0)
            toast.warn('CEP deve conter 8 dígitos para busca automática.');
          setEndereco({ rua: '', bairro: '', cidade: '', estado: '' });
          if (setLoadingState) setLoadingState(false);
        }
        const { url, options } = GET_CEP(cepFormatado);
        const response = await fetch(url, options);
        const json = await response.json();
        if (response.ok && !json.erro) {
          setEndereco({
            rua: json.logradouro || '',
            bairro: json.bairro || '',
            cidade: json.localidade || '',
            estado: json.uf || '',
          });
        } else {
          toast.error('CEP não encontrado ou inválido.');
          setEndereco({ rua: '', bairro: '', cidade: '', estado: '' });
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        toast.error('Erro ao buscar CEP. Verifique sua conexão.');
        setEndereco({ rua: '', bairro: '', cidade: '', estado: '' });
      } finally {
        if (setLoadingState) setLoadingState(false);
      }
    },
    [],
  );

  const handleCepChangeChegada = (cep) => {
    setCepChegada(cep);
    const cepFormatado = cep.replace(/\D/g, '');
    if (cepFormatado.length === 8) {
      fetchEndereco(cepFormatado, setEnderecoChegada, setLoadingCepChegada);
    } else if (cepFormatado.length === 0) {
      setEnderecoChegada({ rua: '', bairro: '', cidade: '', estado: '' });
    }
  };

  const addParada = () => {
    setParadas((prevParadas) => [
      ...prevParadas,
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
    setParadas((prevParadas) => prevParadas.filter((_, i) => i !== index));
    setLoadingCepParada((prev) => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleParadaChange = (index, field, value) => {
    setParadas((prevParadas) =>
      prevParadas.map((parada, i) =>
        i === index ? { ...parada, [field]: value } : parada,
      ),
    );
    if (field === 'cep') {
      const cepFormatado = value.replace(/\D/g, '');
      if (cepFormatado.length === 8) {
        const setLoadingSpecificParada = (isLoading) => {
          setLoadingCepParada((prev) => ({ ...prev, [index]: isLoading }));
        };
        fetchEndereco(
          cepFormatado,
          (endereco) => {
            setParadas((prevParadas) =>
              prevParadas.map((parada, i) =>
                i === index ? { ...parada, endereco } : parada,
              ),
            );
          },
          setLoadingSpecificParada,
        );
      } else if (cepFormatado.length === 0) {
        setParadas((prevParadas) =>
          prevParadas.map((parada, i) =>
            i === index
              ? {
                  ...parada,
                  endereco: { rua: '', bairro: '', cidade: '', estado: '' },
                }
              : parada,
          ),
        );
      }
    }
  };

  const editRota = async () => {
    const payload = {
      cod_rota: data?.cod_rota,
      cod_motorista: motorista || null,
      cod_veiculo: veiculo || null,
      chegada: {
        cep: cepChegada.replace(/\D/g, ''),
        numero: numeroChegada,
        rua: enderecoChegada.rua,
        bairro: enderecoChegada.bairro,
        cidade: enderecoChegada.cidade,
        estado: enderecoChegada.estado,
        descricao: descricaoChegada || null,
        complemento: complementoChegada || null,
      },
      paradas: paradas.map((parada) => ({
        cod_parada: parada.cod_parada || undefined,
        cep: parada.cep.replace(/\D/g, ''),
        numero: parada.numero,
        rua: parada.endereco.rua,
        bairro: parada.endereco.bairro,
        cidade: parada.endereco.cidade,
        estado: parada.endereco.estado,
        descricao: parada.descricao || null,
        complemento: parada.complemento || null,
      })),
    };

    const { url, options } = EDIT_ROTAS(payload);
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        toast.success('Rota editada com sucesso!');
        if (getRotas) getRotas();
        close();
      } else {
        toast.error(
          json.message || 'Erro ao editar a rota. Verifique os dados enviados.',
        );
        console.error('Erro da API:', json);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast.error('Erro de comunicação ao salvar a rota.');
    } finally {
      setLoading(false);
    }
  };
  const getMotoristas = useCallback(async () => {
    try {
      const { url, options } = GET_MOTORISTAS();
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) setSelectMotoristas(json || []);
      else {
        console.error('Erro ao buscar motoristas:', json);
        setSelectMotoristas([]);
      }
    } catch (error) {
      console.error('Erro de rede ao buscar motoristas:', error);
      setSelectMotoristas([]);
    }
  }, []);

  const getVeiculos = useCallback(async () => {
    console.log('entrou no getVeiculos');
    try {
      const { url, options } = GET_VEICULOS_DISPONIVEIS();
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) setSelectVeiculos(json || []);
      else {
        console.error('Erro ao buscar veículos:', json);
        setSelectVeiculos([]);
      }
    } catch (error) {
      console.error('Erro de rede ao buscar veículos:', error);
      setSelectVeiculos([]);
    }
  }, []);

  useEffect(() => {
    console.log('entrou no useEffect');
    getMotoristas();
    getVeiculos();
  }, [getMotoristas, getVeiculos]);

  useEffect(() => {
    if (data) {
      setMotorista(data.motorista?.cod_motorista || '');
      setVeiculo(data.veiculo?.cod_veiculo || '');
      setCepChegada(data.chegada?.cep || '');
      setNumeroChegada(data.chegada?.numero || '');
      setDescricaoChegada(data.chegada?.descricao || '');
      setComplementoChegada(data.chegada?.complemento || '');
      setEnderecoChegada({
        rua: data.chegada?.rua || '',
        bairro: data.chegada?.bairro || '',
        cidade: data.chegada?.cidade || '',
        estado: data.chegada?.estado || '',
      });
      setParadas(
        data.paradas?.map((parada) => ({
          cod_parada: parada.cod_parada,
          cep: parada.cep || '',
          numero: parada.numero || '',
          descricao: parada.descricao || '',
          complemento: parada.complemento || '',
          endereco: {
            rua: parada.rua || '',
            bairro: parada.bairro || '',
            cidade: parada.cidade || '',
            estado: parada.estado || '',
          },
        })) || [],
      );
      setLoadingCepChegada(false);
      setLoadingCepParada({});
    } else {
      clearFields();
    }
  }, [data]);

  return (
    <ThemeProvider theme={darkTheme}>
      <ModalStyle
        loading={loading}
        open={open}
        close={close}
        sx={{ width: '45%' }}
        title={
          <Typography sx={{ fontSize: 25, fontWeight: '700', color: 'white' }}>
            {' '}
            Editar Rota - {data?.cod_rota}
          </Typography>
        }
        color={color}
        content={
          <Box
            sx={{
              width: '100%',
              height: '100%',
              maxHeight: '70vh',
              overflowY: 'auto',
              pr: 1,
            }}
          >
            <Typography
              sx={{ fontSize: 20, fontWeight: '700', color: 'white', mb: 2 }}
            >
              Motorista da Rota:
            </Typography>
            <FormControl sx={{ width: '59%', mb: 2 }}>
              {' '}
              <Select
                value={motorista}
                onChange={(e) => setMotorista(e.target.value)}
                sx={{ color: '#FFFFFF', backgroundColor: '#192038' }}
                displayEmpty
                inputProps={{ 'aria-label': 'Selecionar motorista' }}
              >
                <MenuItem value="" disabled>
                  <em>
                    {selectMotoristas.length > 0
                      ? 'Selecione um motorista'
                      : 'Carregando...'}
                  </em>
                </MenuItem>
                {selectMotoristas.map((mot) => (
                  <MenuItem
                    key={mot?.cod_motorista || mot?.cod_usur}
                    value={mot?.cod_motorista || mot?.cod_usur}
                  >
                    {mot?.cod_motorista || mot?.cod_usur} - {mot?.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography
              sx={{
                fontSize: 20,
                fontWeight: '700',
                color: 'white',
                mb: 2,
                mt: 1,
              }}
              com
              margem
            >
              Veículo da Rota:
            </Typography>
            <FormControl sx={{ width: '59%', mb: 3 }}>
              {' '}
              <Select
                value={veiculo}
                onChange={(e) => setVeiculo(e.target.value)}
                sx={{ color: '#FFFFFF', backgroundColor: '#192038' }}
                displayEmpty
                inputProps={{ 'aria-label': 'Selecionar veículo' }}
              >
                <MenuItem value="" disabled>
                  <em>
                    {selectVeiculos.length > 0
                      ? 'Selecione um veículo'
                      : 'Carregando...'}
                  </em>
                </MenuItem>
                {selectVeiculos.map((veic) => (
                  <MenuItem key={veic?.cod_veiculo} value={veic?.cod_veiculo}>
                    {veic?.placa} - {veic?.modelo} ({veic?.ano})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Seção Paradas */}
            <Typography
              sx={{ fontSize: 20, fontWeight: '700', color: 'white', mb: 2 }}
            >
              Paradas:
            </Typography>
            {paradas.map((parada, index) => (
              <Box
                key={`parada-${parada.cod_parada || index}`}
                sx={{ mb: 3, borderBottom: '1px solid gray', pb: 2 }}
              >
                <Typography sx={{ color: 'white', mb: 1 }}>
                  {' '}
                  Parada {index + 1}{' '}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="CEP"
                    variant="outlined"
                    value={parada.cep}
                    onChange={(e) =>
                      handleParadaChange(index, 'cep', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: loadingCepParada[index] ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null,
                    }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Número"
                    variant="outlined"
                    value={parada.numero}
                    onChange={(e) =>
                      handleParadaChange(index, 'numero', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
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
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                    InputLabelProps={{ shrink: !!parada.endereco.rua }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Bairro"
                    variant="outlined"
                    value={parada.endereco.bairro}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: !!parada.endereco.bairro }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Cidade"
                    variant="outlined"
                    value={parada.endereco.cidade}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: !!parada.endereco.cidade }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Estado"
                    variant="outlined"
                    value={parada.endereco.estado}
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: !!parada.endereco.estado }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '60%',
                    }}
                    label="Descrição (Opcional)"
                    variant="outlined"
                    value={parada.descricao}
                    onChange={(e) =>
                      handleParadaChange(index, 'descricao', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    sx={{
                      backgroundColor: '#192038',
                      borderRadius: 3,
                      width: '40%',
                    }}
                    label="Complemento (Opcional)"
                    variant="outlined"
                    value={parada.complemento}
                    onChange={(e) =>
                      handleParadaChange(index, 'complemento', e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
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
                  size="small"
                >
                  Remover Parada {index + 1}
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
              sx={{ fontSize: 20, fontWeight: '700', color: 'white', mb: 2 }}
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
                label="CEP"
                variant="outlined"
                value={cepChegada}
                onChange={(e) => handleCepChangeChegada(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: loadingCepChegada ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null,
                }}
              />
              <TextField
                sx={{
                  backgroundColor: '#192038',
                  borderRadius: 3,
                  width: '40%',
                }}
                label="Número"
                variant="outlined"
                value={numeroChegada}
                onChange={(e) => setNumeroChegada(e.target.value)}
                InputLabelProps={{ shrink: true }}
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
                variant="outlined"
                value={enderecoChegada.rua}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: !!enderecoChegada.rua }}
              />
              <TextField
                sx={{
                  backgroundColor: '#192038',
                  borderRadius: 3,
                  width: '40%',
                }}
                label="Bairro"
                variant="outlined"
                value={enderecoChegada.bairro}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: !!enderecoChegada.bairro }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                sx={{
                  backgroundColor: '#192038',
                  borderRadius: 3,
                  width: '60%',
                }}
                label="Cidade"
                variant="outlined"
                value={enderecoChegada.cidade}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: !!enderecoChegada.cidade }}
              />
              <TextField
                sx={{
                  backgroundColor: '#192038',
                  borderRadius: 3,
                  width: '40%',
                }}
                label="Estado"
                variant="outlined"
                value={enderecoChegada.estado}
                InputProps={{ readOnly: true }}
                InputLabelProps={{ shrink: !!enderecoChegada.estado }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                sx={{
                  backgroundColor: '#192038',
                  borderRadius: 3,
                  width: '60%',
                }}
                label="Descrição (Opcional)"
                variant="outlined"
                value={descricaoChegada}
                onChange={(e) => setDescricaoChegada(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                sx={{
                  backgroundColor: '#192038',
                  borderRadius: 3,
                  width: '40%',
                }}
                label="Complemento (Opcional)"
                variant="outlined"
                value={complementoChegada}
                onChange={(e) => setComplementoChegada(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        }
        action={
          <Box sx={{ width: '100%', display: 'flex', gap: 2, p: 1 }}>
            <Button
              sx={{
                textTransform: 'none',
                color: 'red',
                borderColor: 'red',
                width: '50%',
                height: 40,
                '&:hover': { color: '#e00000', border: '2px solid #e00000' },
              }}
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={close}
              disabled={loading}
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
                '&:hover': { color: '#00c500', border: '2px solid #00c500' },
                '&.Mui-disabled': { borderColor: 'grey', color: 'grey' },
              }}
              variant="outlined"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <CheckIcon />
                )
              }
              onClick={editRota}
              disabled={loading}
            >
              {loading ? 'SALVANDO...' : 'SALVAR ROTA'}
            </Button>
          </Box>
        }
      />
    </ThemeProvider>
  );
};

export default ModalEditRota;
