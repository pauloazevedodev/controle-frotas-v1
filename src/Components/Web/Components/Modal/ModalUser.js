import { React, useEffect, useState } from "react";
import ModalStyle from "../Modal/ModalStyle";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

const ModalUser = ({ open, close, color }) => {
  const [novidades, setNovidades] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Box>
      <ModalStyle
        loading={loading}
        open={open}
        close={close}
        title={
          <>
            <Typography
              sx={{
                fontSize: 25,
                pt: 0,
                pb: 0,
                fontWeight: "700",
                color: "white",
              }}
            >
              Perfil - Mateus Oliveira Barreto
            </Typography>
          </>
        }
        color={color}
        content={
          <>
            <Box
              sx={{
                width: "60vw",
                height: "40vh",
                "& li": {
                  listStyle: "inside !important",
                },
              }}
            ></Box>
          </>
        }
        action={<></>}
      />
    </Box>
  );
};

export default ModalUser;
