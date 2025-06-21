import React, { useEffect, useRef, useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { useLocation, useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ModalCadastroRotas from '../../Components/Modal/ModalCadastroRotas';
import ModalRotas from '../../Components/Modal/ModalRotas';
import Grid from '../../Components/Grid/Grid';
import { GET_ROTAS } from '../../../../api';
import CircleIcon from '@mui/icons-material/Circle';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import dayjs from 'dayjs';
import ModalPdfXlsx from '../../Components/Modal/ModalPdfXlsx';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import ModalQrCode from '../../Components/Modal/ModalQrCode';
import ModalEditRota from '../../Components/Modal/ModalEditRota';

const Historico = () => {
  const columns = [
    {
      field: 'cod_rota',
      headerName: 'CÓD ROTA',
      flex: 0.6,
      cellStyle: { textAlign: 'center' },
      headerClass: 'header-center',
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.4,
      cellRenderer: ({ data }) => {
        const statusConfig = (status) => {
          switch (status) {
            case 'Aprovado':
              return { color: '#03ef55', tooltip: 'Rota Aprovada' };
            case 'Reprovado':
              return { color: '#ff3d71', tooltip: 'Rota Reprovada' };
            default:
              return { color: '#ffc107', tooltip: 'Rota Não Verificada' };
          }
        };

        const { color, tooltip } = statusConfig(data.status);

        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Tooltip title={tooltip} arrow>
              <IconButton sx={{ color }}>
                <CircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: 'partida.data_hora',
      headerName: 'DATA INÍCIO',
      flex: 1,
      valueGetter: (params) => params.data.partida?.data_hora || null,
      valueFormatter: (params) => {
        return params.value
          ? dayjs(params.value).format('DD/MM/YYYY - HH:mm')
          : 'Não informado';
      },
    },
    {
      field: 'partida.cidade',
      headerName: 'CIDADE ORIGEM',
      flex: 1,
      valueGetter: (params) => params.data.partida?.cidade || 'Não informada',
    },
    {
      field: 'partida.estado',
      headerName: 'UF',
      flex: 0.3,
      valueGetter: (params) => params.data.partida?.estado || 'UF',
    },
    {
      field: 'chegada.data_hora',
      headerName: 'DATA TÉRMINO',
      flex: 1,
      valueGetter: (params) => params.data.chegada?.data_hora || null,
      valueFormatter: (params) => {
        return params.value
          ? dayjs(params.value).format('DD/MM/YYYY - HH:mm')
          : 'Não informado';
      },
    },
    {
      field: 'chegada.cidade',
      headerName: 'CIDADE DESTINO',
      flex: 1,
      valueGetter: (params) => params.data.chegada?.cidade || 'Não informada',
    },
    {
      field: 'chegada.estado',
      headerName: 'UF',
      flex: 0.3,
      valueGetter: (params) => params.data.chegada?.estado || 'UF',
    },
    {
      field: 'tempo_gasto',
      headerName: 'TEMPO GASTO',
      flex: 1,
      valueGetter: (params) => {
        const partida = params.data.partida?.data_hora;
        const chegada = params.data.chegada?.data_hora;

        if (!partida || !chegada) return null;

        const inicio = dayjs(partida);
        const fim = dayjs(chegada);

        return fim.diff(inicio, 'minute');
      },
      valueFormatter: (params) => {
        if (params.value === null || params.value === undefined) {
          return 'Indefinido';
        }

        const hours = Math.floor(params.value / 60);
        const minutes = params.value % 60;

        return `${hours}h ${minutes}m`;
      },
    },
    {
      field: 'qrCode',
      headerName: 'QR CODE',
      flex: 0.5,
      cellRenderer: ({ data }) => (
        <Button
          sx={{ border: '1px solid #ffff', width: '100%' }}
          onClick={() => handleOpenModalQrCode(data)}
        >
          <IconButton size="large" sx={{ p: 0, width: '100%', color: '#ffff' }}>
            <QrCodeScannerOutlinedIcon fontSize="small" />
          </IconButton>
        </Button>
      ),
    },
    {
      field: 'rota',
      headerName: 'OBS ROTA',
      flex: 0.5,
      cellRenderer: ({ data }) => (
        <Button
          sx={{ border: '1px solid #00FF57', width: '100%' }}
          onClick={() => handleOpenModalRotas(data)}
        >
          <IconButton
            size="large"
            sx={{ p: 0, width: '100%', color: '#00FF57' }}
          >
            <AltRouteIcon fontSize="small" />
          </IconButton>
        </Button>
      ),
    },
    {
      field: 'edtiarRota',
      headerName: 'EDITAR',
      flex: 0.5,
      cellRenderer: ({ data }) => {
        const isDisabled = !!data.chegada?.data_hora;
        const yellowColor = '#FFAA00';

        return (
          <IconButton
            size="large"
            onClick={() => handleOpenModalEditRotas(data)}
            disabled={isDisabled}
            aria-label="Editar Rota"
            sx={{
              width: '100%',
              border: `1px solid ${yellowColor}`,
              borderRadius: 1,
              color: yellowColor,
              padding: '6px',

              '&.Mui-disabled': {
                color: alpha(yellowColor, 0.4),
                borderColor: alpha(yellowColor, 0.3),
              },

              '&:hover': {
                backgroundColor: alpha(yellowColor, 0.08),
                '&.Mui-disabled': {
                  backgroundColor: 'transparent',
                },
              },
            }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        );
      },
    },
  ];

  const location = useLocation();
  const veiculo = location.state?.veiculo;
  const gridRef = useRef(null);
  const [openRotas, setOpenRotas] = useState(false);
  const [openCadastro, setOpenCadastro] = useState(false);
  const [openRelatorio, setOpenRelatorio] = useState(false);
  const [openInfoRota, setOpenInfoRota] = useState(false);
  const [rows, setRows] = useState(false);
  console.log('🚀 ~ Historico ~ rows:', rows);
  const [openQr, setQr] = useState(false);
  const [openEditRotas, setOpenEditRotas] = useState(false);
  const [selectedRota, setSelectedRota] = useState(null);
  const closeRotas = () => setOpenRotas(false);

  const closeEditRotas = () => setOpenEditRotas(false);

  const closeQr = () => setQr(false);

  const handleClick = (e) => {
    setOpenCadastro(true);
  };

  const handleCloseModal = () => {
    setOpenCadastro(false);
  };
  const handleOpenRelatorio = (e) => {
    setOpenRelatorio(true);
  };

  const handleCloseRelatorio = () => {
    setOpenRelatorio(false);
  };
  const handleOpenModalRotas = (rota) => {
    setSelectedRota({ ...rota, veiculo });
    setOpenRotas(true);
  };
  const handleOpenModalEditRotas = (rota) => {
    setSelectedRota({ ...rota, veiculo });
    setOpenEditRotas(true);
  };

  const handleOpenModalQrCode = (rota) => {
    setSelectedRota({ ...rota, veiculo });
    setQr(true);
  };

  const getRotas = async () => {
    const { url, options } = GET_ROTAS(veiculo.cod_veiculo);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        setRows(json.rotas);
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

  const onRowClick = (event) => {
    setSelectedRota(event.data);
  };
  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          sx={{
            color: '#FFFFFF',
            textTransform: 'uppercase',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          {veiculo ? `${veiculo.modelo} / ${veiculo.placa}` : 'Veículo'}{' '}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            width: '50%',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            sx={{
              textTransform: 'none',
              color: '#3366FF',
              borderColor: '#3366FF',
              width: '35%',
              height: 40,
              '&:hover': {
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
              },
            }}
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleOpenRelatorio}
          >
            GERAR RELATÓRIO
          </Button>
          <Button
            sx={{
              textTransform: 'none',
              color: '#3366FF',
              borderColor: '#3366FF',
              width: '35%',
              height: 40,
              '&:hover': {
                color: '#FFFFFF',
                border: '2px solid #FFFFFF',
              },
            }}
            variant="outlined"
            startIcon={<AddRoadIcon />}
            onClick={handleClick}
          >
            CADASTRAR ROTA
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <ModalCadastroRotas
        open={openCadastro}
        close={handleCloseModal}
        getRotas={getRotas}
        veiculo={veiculo}
      />
      <Box sx={{ height: 670, width: '100%', color: 'white' }}>
        <Grid
          ref={gridRef}
          columns={columns}
          rows={rows}
          onRowClick={onRowClick}
        />
      </Box>
      {/* <MapComponent /> */}
      <ModalRotas
        open={openRotas}
        close={closeRotas}
        data={selectedRota}
        getRotas={getRotas}
      />
      <ModalQrCode open={openQr} close={closeQr} data={selectedRota} />
      <ModalEditRota
        open={openEditRotas}
        close={closeEditRotas}
        data={selectedRota}
        getRotas={getRotas}
        veiculo={veiculo}
      />
      <ModalPdfXlsx
        open={openRelatorio}
        close={handleCloseRelatorio}
        cod_veiculo={veiculo.cod_veiculo}
        placa={veiculo.placa}
      />
    </>
  );
};

export default Historico;
