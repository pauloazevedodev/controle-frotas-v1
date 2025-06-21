import { React, useRef } from 'react';
import ModalStyle from '../Modal/ModalStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { QRCodeCanvas } from 'qrcode.react';

const ModalQrCode = ({ open, close, color, data }) => {
  const qrRef = useRef();
  const qrCodeData = JSON.stringify({
    linkDriver: [
      {
        cod_rota: data?.cod_rota,
      },
    ],
  });

  const handlePrint = () => {
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas não encontrado!');
      return;
    }

    const qrImage = canvas.toDataURL('image/png');
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-1000px';
    iframe.style.left = '-1000px';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100%;
              margin: 0;
            }
            h1 {
              font-size: 18px;
              margin-bottom: 10px;
            }
            img {
              width: 70mm;
              height: 70mm;
            }
          </style>
        </head>
        <body>
          <h1>QR CODE - Rota ${data?.cod_rota}</h1> 
          <img src="${qrImage}" alt="QR Code" />
        </body>
      </html>
    `);

    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };

  return (
    <Box>
      <ModalStyle
        open={open}
        close={close}
        title={
          <>
            <Typography
              sx={{
                fontSize: 25,
                pt: 0,
                pb: 0,
                fontWeight: '700',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              QR CODE - Rota {data?.cod_rota}
            </Typography>
          </>
        }
        color={color}
        content={
          <>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '90%',
                  height: '39vh',
                  backgroundColor: '#ffffff',
                  borderRadius: 4,
                  margin: 'auto',
                }}
                ref={qrRef}
              >
                <QRCodeCanvas
                  value={qrCodeData}
                  size={350}
                  bgColor={'#ffffff'}
                  fgColor={'#000000'}
                  level={'H'}
                />
              </Box>
            </Box>
          </>
        }
        action={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePrint}
              sx={{
                width: '70%',
                backgroundColor: '#222b45',
                border: '1px solid #3263f7',
                color: '#3263f7',
                '&:hover': { border: '1px solid #ffffff', color: '#ffffff' },
              }}
            >
              Imprimir QR Code
            </Button>
          </Box>
        }
      />
    </Box>
  );
};

export default ModalQrCode;
