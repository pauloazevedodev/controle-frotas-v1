import { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import CampaignIcon from '@mui/icons-material/Campaign';
import { Breadcrumbs, Button, Icon, Menu, Tooltip } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NavLink, useLocation, matchPath } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { isMobileOnly } from 'react-device-detect';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ModalUser from '../../Components/Modal/ModalUser';
import { toast } from 'react-toastify';

const routes = [
  { name: 'Login Alfa ID', path: '/login' },
  { name: 'Controle de Frotas', path: '/veiculos' },
  { name: 'Historico de Frotas', path: '/historico' },
  { name: 'Usuários', path: '/usuarios' },
  { name: '404', path: '*' },
];

const settings = ['Logout'];

const useMatchedRoute = () => {
  const { pathname } = useLocation();
  for (let route of routes) {
    if (matchPath({ path: route.path }, pathname)) {
      return route;
    }
  }
};

const ToolbarCustom = ({ setIsAuthenticated }) => {
  const route = useMatchedRoute();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const open = Boolean(anchorElUser);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

  useEffect(() => {
    const curTitle = routes.find((item) => item.path === route.path);
    if (curTitle && route.name) {
      document.title = `Alfa ID │ ${curTitle.name}`;
    }
  }, [route]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // toast.success("Logout bem-sucedido!");
  };

  return (
    <>
      <Toolbar
        sx={{
          pr: '24px',
          display: 'flex',
          gap: 1,
        }}
      >
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" sx={{ color: 'white' }} />
          }
          aria-label="breadcrumb"
          sx={{ flexGrow: 1 }}
        >
          <Typography
            variant="h6"
            color={'white'}
            sx={{ fontWeight: '700', letterSpacing: 0.5 }}
          >
            Alfa ID
          </Typography>
          <Typography
            variant="h6"
            color={'white'}
            sx={{ fontWeight: '700', letterSpacing: 0.5, wordSpacing: 2.5 }}
          >
            {route.name}
          </Typography>
        </Breadcrumbs>
        <Button
          sx={{
            textTransform: 'none',
            color: '#3366FF',
            borderColor: '#3366FF',
            mr: 2,
          }}
          variant="outlined"
          startIcon={<QuestionAnswerIcon />}
        >
          CHAMADOS TI / ALFAID
        </Button>
        <Typography
          variant="h6"
          color={'white'}
          sx={{ fontWeight: '700', letterSpacing: 0.5 }}
        >
          Mateus Barreto
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Menu">
            <IconButton
              color="inherit"
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorElUser}
            open={open}
            onClose={handleCloseUserMenu}
            sx={{ mt: 1, '& ul': { p: 0 } }}
          >
            <Box
              sx={{
                width: isMobileOnly ? '20vw' : '10vw',
                backgroundColor: '#222b45',
              }}
            >
              {settings.map((setting) => (
                <Button
                  sx={{ color: 'white' }}
                  component="label"
                  fullWidth
                  key={setting}
                  onClick={handleLogout}
                >
                  {setting}
                </Button>
              ))}
            </Box>
          </Menu>
        </Box>
      </Toolbar>

      <ModalUser open={openModal} close={handleCloseModal} />
    </>
  );
};

export default ToolbarCustom;
