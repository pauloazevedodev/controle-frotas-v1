import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#222b45",
  borderRadius: "8px",
  px: 3,
  pb: 2,
  pt: 1,
};

const ModalTitlePDF = ({
  open,
  close,
  title,
  color = "#ffffff",
  content,
  action,
  sx,
}) => {
  return (
    <Modal open={open} onClose={close}>
      <Box sx={{ ...style, ...sx }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" sx={{ pt: 2, pb: 1, color: color }}>
            {title}
          </Typography>
          <IconButton
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
            minWidth: 300,
            maxWidth: "85vw",
            maxHeight: "75vh",
            overflow: "auto",
            py: 2,
          }}
        >
          {content}
        </Box>
        {action && (
          <>
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
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

export default ModalTitlePDF;
