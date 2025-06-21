import { React, useState } from "react";
import ModalStyle from "./ModalStyle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DELETE_USUARIOS } from "../../../../api";

const ModalDeleteUsuario = ({ open, close, color, data, getUsuarios }) => {
  const [loading, setLoading] = useState(false);

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212",
        paper: "#192038",
      },
      text: {
        primary: "#FFFFFF",
        secondary: "#B0B0B0",
      },
    },
  });

  const deleteUsuario = async () => {
    const { url, options } = DELETE_USUARIOS(data);
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      if (response.ok) {
        getUsuarios();
        close();
      } else {
        console.log("Erro ao deletar o usuário:", json);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <ModalStyle
        loading={loading}
        open={open}
        close={close}
        title={
          <>
            <Box sx={{ display: "flex" }}>
              <Typography
                sx={{
                  fontSize: 25,

                  fontWeight: "700",
                  color: "white",
                  mr: 42,
                }}
              >
                Excluir Usuário
              </Typography>
            </Box>
          </>
        }
        color={color}
        content={
          <>
            <Box
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              <Box sx={{ width: "100%", display: "flex", gap: 2, mb: 2 }}>
                <ThemeProvider theme={darkTheme}>
                  <Typography>
                    Tem certeza que deseja excluir o usuário {data?.nome} -{" "}
                    {data?.cpf}
                  </Typography>
                </ThemeProvider>
              </Box>
            </Box>
          </>
        }
        action={
          <>
            <Box sx={{ width: "100%", display: "flex", gap: 2 }}>
              <Button
                sx={{
                  textTransform: "none",
                  color: "red",
                  borderColor: "red",
                  width: "50%",
                  height: 40,
                  "&:hover": {
                    color: "#e00000",
                    border: "2px solid #e00000",
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
                  textTransform: "none",
                  color: "green",
                  borderColor: "green",
                  width: "50%",
                  height: 40,
                  "&:hover": {
                    color: "#00c500",
                    border: "2px solid #00c500",
                  },
                }}
                variant="outlined"
                startIcon={<CheckIcon />}
                onClick={deleteUsuario}
              >
                DELETAR
              </Button>
            </Box>
          </>
        }
      />
    </Box>
  );
};

export default ModalDeleteUsuario;
