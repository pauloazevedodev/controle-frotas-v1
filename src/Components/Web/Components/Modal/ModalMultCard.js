import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const ModalMultCard = ({ loading = false, open, close, children, sx }) => {
  return loading ? (
    <Backdrop open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
    <Modal open={open} onClose={close}>
      <Box sx={style}>
        <IconButton
          sx={{
            position: 'fixed',
            top: '-30px',
            right: '-30px',
            zIndex: 2,
            backgroundColor: '#1a2035',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1a2035',
              color: 'white ',
            },
          }}
          onClick={close}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowX: 'auto',
            overflowY: 'auto',
            display: 'flex',
            gap: 2,
            ...sx,
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
};
ModalMultCard.propTypes = {
  children: PropTypes.node,
};

export default ModalMultCard;

// OK
