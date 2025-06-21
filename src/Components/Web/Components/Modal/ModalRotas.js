import { React, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Divider } from '@mui/material';
import dayjs from 'dayjs';
import ModalMultCard from './ModalMultCard';
import ModalAprovarRota from './ModalAprovarRota';
import ModalReprovarRota from './ModalReprovarRota';
import ModalObsRota from './ModalObsRota';
import BoxStyleCard from '../Box/BoxStyleCard';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { GET_OBS_ROTAS, GET_STATUS_ROTAS } from '../../../../api';
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api';

const ModalRotas = ({ open, close, data, getRotas }) => {
  const [openAprovar, setOpenAprovar] = useState(false);
  const [openReprovar, setOpenReprovar] = useState(false);
  const [openObs, setOpenObs] = useState(false);
  const [obs, setObs] = useState(false);
  const [status, setStatus] = useState(false);
  const [directions, setDirections] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDBwpZs8ef-S4luuIvphLWNSSs5XCga_kc',
    libraries: ['geometry', 'drawing'],
  });
  const openAprovarRota = () => setOpenAprovar(true);

  const closeAprovar = () => setOpenAprovar(false);

  const openReprovarRota = () => setOpenReprovar(true);

  const closeReprovar = () => setOpenReprovar(false);

  const openObsRota = () => setOpenObs(true);

  const closeObs = () => setOpenObs(false);

  const getObsRotas = async () => {
    const { url, options } = GET_OBS_ROTAS(
      data?.veiculo.cod_veiculo,
      data?.cod_rota,
    );
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        setObs(json);
      } else {
        console.log('Erro ao buscar veículos');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };
  const getStatusRotas = async () => {
    const { url, options } = GET_STATUS_ROTAS(
      data?.veiculo.cod_veiculo,
      data?.cod_rota,
    );
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        setStatus(json);
      } else {
        console.log('Erro ao buscar veículos');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };
  const location = {
    lat: -23.55052,
    lng: -46.633308,
  };

  const getCoordinatesFromCEP = async (cep) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${cep}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`,
    );
    const data = await response.json();
    if (data.results.length > 0) {
      return data.results[0].geometry.location;
    }
    return null;
  };

  const fetchRoute = async () => {
    const start = await getCoordinatesFromCEP(data?.partida.cep);
    const end = await getCoordinatesFromCEP(data?.chegada.cep);

    const waypoints = await Promise.all(
      data.paradas?.map(async (parada) => {
        const coords = await getCoordinatesFromCEP(parada.cep);
        return coords ? { location: coords, stopover: true } : null;
      }),
    ).then((res) => res.filter((wp) => wp !== null));

    if (start && end) {
      setStartLocation(start);
      setEndLocation(end);

      const directionsService = new window.google.maps.DirectionsService();
      const request = {
        origin: start,
        destination: end,
        waypoints: waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error('Erro ao traçar a rota:', status);
        }
      });
    }
  };

  const calculateRealTimeSpent = () => {
    if (data?.partida?.data_hora && data?.chegada?.data_hora) {
      const partida = dayjs(data.partida.data_hora);
      const chegada = dayjs(data.chegada.data_hora);

      const diffInMinutes = chegada.diff(partida, 'minute');

      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;

      if (hours > 0) {
        return `${hours}h ${minutes}min`;
      } else {
        return `${minutes} minutos`;
      }
    }
    return 'Em andamento';
  };
  useEffect(() => {
    getObsRotas();
    getStatusRotas();
    if (open) {
      setDirections(null);
      fetchRoute();
    }
  }, [open]);

  return (
    <>
      {open && (
        <ModalMultCard
          open={open}
          close={close}
          sx={{
            flexDirection: 'column',
            width: '100vw',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <BoxStyleCard sx={{ flex: 1, minWidth: '24%' }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#FFFFFF' }}>
                Informações de Partida
              </Typography>
              <Divider sx={{ mb: 1, backgroundColor: '#FFFFFF', height: 2 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  CEP: {data?.partida?.cep || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Número: {data?.partida?.numero || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Rua: {data?.partida?.rua || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Bairro: {data?.partida?.bairro || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Cidade: {data?.partida?.cidade || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Estado: {data?.partida?.estado || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Data e Hora:{' '}
                  {data?.partida?.data_hora
                    ? dayjs(data.partida.data_hora).format('DD/MM/YYYY - HH:mm')
                    : 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Complemento: {data?.partida?.complemento || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Descrição: {data?.partida?.descricao || 'Não informado'}
                </Typography>
              </Box>
            </BoxStyleCard>

            <BoxStyleCard sx={{ flex: 1, minWidth: '24%' }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#FFFFFF' }}>
                Informações de Chegada
              </Typography>
              <Divider sx={{ mb: 1, backgroundColor: '#FFFFFF', height: 2 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  CEP: {data?.chegada.cep || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Número: {data?.chegada.numero || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Rua: {data?.chegada.rua || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Bairro: {data?.chegada.bairro || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Cidade: {data?.chegada.cidade || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Estado: {data?.chegada.estado || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Data e Hora:{' '}
                  {dayjs(data?.chegada.data_hora).format('DD/MM/YYYY - HH:mm')}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Complemento: {data?.chegada.complemento || 'Não informado'}
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Descrição: {data?.chegada.descricao || 'Não informado'}
                </Typography>
              </Box>
            </BoxStyleCard>

            <BoxStyleCard sx={{ flex: 1, minWidth: '24%' }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#FFFFFF' }}>
                Paradas:
              </Typography>
              <Divider sx={{ mb: 1, backgroundColor: '#FFFFFF', height: 2 }} />
              {data?.paradas && data.paradas.length > 0 ? (
                data.paradas.map((item, index) => (
                  <Box key={index} sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                      Parada: {item.cod_parada || 'Não informado'}
                    </Typography>
                    <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                      CEP Parada: {item.cep || 'Não informado'}
                    </Typography>
                    <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                      Número: {item.numero || 'Não informado'}
                    </Typography>
                    <Divider
                      sx={{ mb: 1, mt: 1, backgroundColor: '#FFFFFF' }}
                    />
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Nenhuma parada registrada.
                </Typography>
              )}
            </BoxStyleCard>
            <BoxStyleCard sx={{ flex: 1, minWidth: '24%' }}>
              <Typography variant="h4" sx={{ mb: 2, color: '#FFFFFF' }}>
                Obs Rotas:
              </Typography>
              <Divider sx={{ mb: 1, backgroundColor: '#FFFFFF', height: 2 }} />
              <Box sx={{ textAlign: 'left' }}>
                {status && status.length > 0 && (
                  <>
                    <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                      Status: {status[0].status} - {status[0].desc_status}
                    </Typography>
                  </>
                )}
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Distância Percorrida: {data?.km_percorrido || 'Não informado'}{' '}
                  km
                </Typography>
                <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                  Tempo Gasto: {calculateRealTimeSpent() || 'Não informado'}
                </Typography>
                {obs && obs.length > 0 && (
                  <>
                    <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                      Desvios de rota: {obs[0].desvios || 'Não informado'}
                    </Typography>
                    <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                      Paradas não programadas:{' '}
                      {obs[0].paradas || 'Não informado'}
                    </Typography>
                    <Typography sx={{ fontSize: 18, color: '#FFFFFF' }}>
                      Incidentes: {obs[0].incidentes || 'Não informado'}
                    </Typography>
                  </>
                )}
                <Divider sx={{ mb: 1, mt: 1, backgroundColor: '#FFFFFF' }} />
              </Box>
            </BoxStyleCard>
          </Box>

          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={startLocation || location}
              zoom={10}
            >
              {startLocation && <Marker position={startLocation} />}
              {endLocation && <Marker position={endLocation} />}
              {data.paradas?.map((parada, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: parseFloat(parada.latitude),
                    lng: parseFloat(parada.longitude),
                  }}
                />
              ))}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          )}
          <Box>
            <BoxStyleCard
              sx={{
                flex: 1,
                minWidth: '30%',
                display: 'flex',
                flexDirection: 'column',
                px: 4,
                py: 2.5,
                gap: 2,
                height: '100%',
              }}
            >
              <Divider sx={{ backgroundColor: '#FFFFFF', height: 2 }} />
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'rows',
                  gap: 2,
                }}
              >
                <Button
                  sx={{
                    textTransform: 'none',
                    color: 'red',
                    borderColor: 'red',
                    width: '100%',
                    height: 40,
                    '&:hover': {
                      color: '#e00000',
                      border: '2px solid #e00000',
                    },
                  }}
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={openReprovarRota}
                >
                  REPROVAR ROTA
                </Button>
                <Button
                  sx={{
                    textTransform: 'none',
                    color: 'green',
                    borderColor: 'green',
                    width: '100%',
                    height: 40,
                    '&:hover': {
                      color: '#00c500',
                      border: '2px solid #00c500',
                    },
                  }}
                  variant="outlined"
                  startIcon={<CheckIcon />}
                  onClick={openAprovarRota}
                >
                  APROVAR ROTA
                </Button>
                <Button
                  sx={{
                    textTransform: 'none',
                    color: '#3366FF',
                    borderColor: '#3366FF',
                    width: '100%',
                    height: 40,
                    '&:hover': {
                      color: '#00ABFF',
                      border: '2px solid #00ABFF',
                    },
                  }}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={openObsRota}
                >
                  ADICIONAR OBSERVAÇÕES
                </Button>
              </Box>
              <Divider sx={{ backgroundColor: '#FFFFFF', height: 2 }} />
            </BoxStyleCard>
          </Box>
        </ModalMultCard>
      )}

      <ModalAprovarRota
        open={openAprovar}
        close={closeAprovar}
        data={data}
        getRotas={getRotas}
        getStatusRotas={getStatusRotas}
      />
      <ModalReprovarRota
        open={openReprovar}
        close={closeReprovar}
        data={data}
        getRotas={getRotas}
        getStatusRotas={getStatusRotas}
      />
      <ModalObsRota
        open={openObs}
        close={closeObs}
        data={data}
        getObsRotas={getObsRotas}
        obs={obs}
      />
    </>
  );
};

export default ModalRotas;
