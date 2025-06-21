import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import { isMobileOnly } from 'react-device-detect';

const ModalStyle = ({
  loading = false,
  open,
  close,
  title,
  color = 'primary',
  content,
  action,
  sx,
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 3,
    backgroundColor: '#222b45',
    color: 'white',
    px: 4,
    pb: 2,
    pt: 1,
    minWidth: isMobileOnly ? '75vw' : '25%',
    ...sx,
  };
  return loading ? (
    <Backdrop open={loading && open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
    <Modal open={open} onClose={close}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              pt: 2,
              pb: 1,
              fontSize: 18,
              fontWeight: '700',
              color: '#ffffff',
            }}
          >
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={close}
            sx={{
              mb: 1,
              ml: 1.4,
              mt: 1.4,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            py: 2,
            maxWidth: '85vw',
            maxHeight: '75vh',
            overflow: 'auto',
          }}
        >
          {content}
        </Box>
        {action && (
          <>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                pt: 2,
              }}
            >
              {action}
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ModalStyle;

// OK
