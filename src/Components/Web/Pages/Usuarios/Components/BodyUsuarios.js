import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Grid from '../../../Components/Grid/Grid';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModalEditUsuario from '../../../Components/Modal/ModalEditUsuario';
import ModalDeleteUsuario from '../../../Components/Modal/ModalDeleteUsuario';
import ModalCadastroUsuario from '../../../Components/Modal/ModalCadastroUsuario';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CircleIcon from '@mui/icons-material/Circle';
import { GET_USUARIOS } from '../../../../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const BodyFrotas = () => {
  const columns = [
    {
      field: 'cod_usur',
      headerName: 'CÓDIGO',
      flex: 0.4,
      cellStyle: { textAlign: 'center' },
      headerClass: 'header-center',
    },
    {
      field: 'status',
      headerName: 'STATUS',
      flex: 0.4,
      cellRenderer: ({ data }) => {
        const iconColor = data.status === 'ativo' ? '#03ef55' : '#ff3d71';
        const tooltipText =
          data.status === 'ativo' ? 'Usuário Ativo' : 'Usuário Inativo';

        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <Tooltip title={tooltipText} arrow>
              <IconButton sx={{ color: iconColor }}>
                <CircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
    { field: 'nome', headerName: 'NOME', flex: 1 },
    { field: 'cpf', headerName: 'CPF', flex: 1 },
    { field: 'email', headerName: 'EMAIL', flex: 1 },
    {
      field: 'descricao',
      headerName: 'TIPO',
      flex: 1,
    },
    {
      field: 'editar',
      headerName: 'EDITAR',
      flex: 1,
      cellRenderer: ({ data }) => (
        <Button
          sx={{ border: '1px solid #FFAA00', width: '50%' }}
          onClick={() => {
            setOpenEdit(true);
            setSelectedRow(data);
          }}
        >
          <IconButton
            size="large"
            sx={{ p: 0, width: '100%', color: '#FFAA00' }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Button>
      ),
    },
    {
      field: 'apagar',
      headerName: 'APAGAR',
      flex: 1,
      cellRenderer: ({ data }) => (
        <Button
          sx={{ border: '1px solid #FF3D71', width: '50%' }}
          onClick={() => {
            setDelete(true);
            setSelectedRow(data);
          }}
        >
          <IconButton
            size="large"
            sx={{ p: 0, width: '100%', color: '#FF3D71' }}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Button>
      ),
    },
  ];

  const gridRef = useRef(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const closeEdit = () => setOpenEdit(false);
  const closeDelete = () => setDelete(false);
  const [openCadastroUsuario, setOpenCadastroUsuario] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getUsuarios = async (searchTerm) => {
    const { url, options } = GET_USUARIOS(searchTerm);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        setRows(json);
      } else {
        toast.error('Erro ao buscar usuários');
      }
    } catch (error) {
      toast.error('Erro na requisição: ' + error.message);
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  const handleClick = () => {
    setOpenCadastroUsuario(true);
  };

  const handleCloseModal = () => {
    setOpenCadastroUsuario(false);
  };

  const handleSearchUser = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchBlur = () => {
    getUsuarios(searchTerm);
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
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <TextField
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: '#FFFFFF',
                fontSize: '15px',
              }}
            >
              <SearchIcon sx={{ marginRight: 1 }} />
              Insira o nome, CPF ou e-mail do funcionário para buscar.
            </Box>
          }
          variant="filled"
          sx={{
            backgroundColor: '#192038',
            borderRadius: 3,
            color: '#FFFFFF',
            width: '40%',
          }}
          InputProps={{
            style: {
              color: '#FFFFFF',
              fontSize: '15px',
            },
          }}
          value={searchTerm}
          onChange={handleSearchUser}
          onBlur={handleSearchBlur}
        />
        <Button
          sx={{
            textTransform: 'none',
            color: '#3366FF',
            borderColor: '#3366FF',
            width: '30%',
            height: 40,
            '&:hover': {
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
            },
          }}
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClick}
        >
          CADASTRAR USUÁRIO
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ height: 670, width: '100%', color: 'white' }}>
        <Grid ref={gridRef} columns={columns} rows={rows} />
      </Box>

      <ModalCadastroUsuario
        open={openCadastroUsuario}
        close={handleCloseModal}
        getUsuarios={getUsuarios}
      />
      <ModalEditUsuario
        open={openEdit}
        close={closeEdit}
        data={selectedRow}
        getUsuarios={getUsuarios}
      />
      <ModalDeleteUsuario
        open={openDelete}
        close={closeDelete}
        data={selectedRow}
        getUsuarios={getUsuarios}
      />
    </>
  );
};

export default BodyFrotas;
