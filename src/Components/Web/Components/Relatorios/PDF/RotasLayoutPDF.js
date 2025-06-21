import { useState } from 'react';
import {
  Document,
  Page,
  View,
  Text,
  Font,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';
import { Box, Button } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ModalTitlePDF from './ModalTitlePDF';
import { GET_RELATORIO_ROTAS } from '../../../../../api';
import dayjs from 'dayjs';

const RelatorioRotasLayoutPDF = ({ cod_veiculo }) => {
  const [documentGenerated, setDocumentGenerated] = useState(false);
  const [data, setData] = useState([]);

  const handlePrint = async () => {
    const { url, options } = GET_RELATORIO_ROTAS(cod_veiculo);
    const response = await fetch(url, options);
    if (response.ok) {
      const json = await response.json();
      if (json) {
        setData(json);
        setDocumentGenerated(true);
      }
    }
  };

  Font.register({
    family: 'Poppins',
    src: 'https://grupocimcal.net.br/img-ecommerce/Poppins-Regular.ttf',
  });

  const styles = StyleSheet.create({
    viewer: { width: '100%', height: '100%' },
    page: {
      fontFamily: 'Poppins',
      backgroundColor: '#fff',
      color: '#000',
      fontSize: 9,
      padding: 30,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: { fontSize: 18, fontWeight: 'bold' },
    smallText: { fontSize: 8 },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
    },
    divider: {
      marginVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    infoItem: { width: '50%', marginBottom: 4 },
    rotaContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 10,
      marginBottom: 12,
    },
    subSection: { marginTop: 6 },
    enderecoBlock: {
      marginTop: 4,
      padding: 6,
      backgroundColor: '#f5f5f5',
      borderRadius: 4,
    },
    paradaItem: { marginTop: 2, paddingLeft: 8 },
  });

  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Rotas</Text>
          <View>
            <Text style={styles.smallText}>
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short',
              }).format(new Date())}
            </Text>
            <Text
              style={styles.smallText}
              render={({ pageNumber, totalPages }) =>
                `Página ${pageNumber} de ${totalPages}`
              }
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View>
          <Text style={styles.sectionTitle}>Informações do Veículo</Text>
          {data.length > 0 && (
            <View style={styles.infoGrid}>
              <Text style={styles.infoItem}>Placa: {data[0]?.placa}</Text>
              <Text style={styles.infoItem}>
                Modelo: {data[0]?.modelo} ({data[0]?.tipo_veiculo})
              </Text>
              <Text style={styles.infoItem}>Ano: {data[0]?.ano}</Text>
              <Text style={styles.infoItem}>
                KM Atual: {data[0]?.quilometragem} km
              </Text>
              <Text style={styles.infoItem}>
                Status: {data[0]?.status_veiculo}
              </Text>
              <Text style={styles.infoItem}>
                Última Manutenção:{' '}
                {data[0]?.dt_ultim_manu
                  ? dayjs(data[0].dt_ultim_manu).format('DD/MM/YYYY')
                  : 'Não informada'}
              </Text>
              <Text style={styles.infoItem}>
                Próxima Manutenção:{' '}
                {data[0]?.dt_prox_manu
                  ? dayjs(data[0].dt_prox_manu).format('DD/MM/YYYY')
                  : 'Não informada'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View>
          <Text style={styles.sectionTitle}>Rotas Registradas</Text>
          {data.map((rota, index) => (
            <View key={index} style={styles.rotaContainer}>
              <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                Rota #{rota.cod_rota} - Status: {rota.status_rota}
              </Text>

              <View style={styles.subSection}>
                <Text style={{ fontWeight: 'bold' }}>
                  Motorista Responsável:
                </Text>
                <Text>Nome: {rota.nome}</Text>
                <Text>CPF: {rota.cpf}</Text>
                <Text>Email: {rota.email}</Text>
              </View>

              <View style={styles.subSection}>
                <Text style={{ fontWeight: 'bold' }}>Partida:</Text>
                <View style={styles.enderecoBlock}>
                  <Text>
                    Data/Hora:{' '}
                    {dayjs(rota.data_hora_partida).format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <Text>
                    Endereço:{' '}
                    {`${rota.rua_partida}, ${rota.numero_partida}, ${rota.bairro_partida} - ${rota.cidade_partida}/${rota.estado_partida}`}
                  </Text>
                  <Text>CEP: {rota.cep_partida}</Text>
                  {rota.descricao_partida && (
                    <Text>Descrição: {rota.descricao_partida}</Text>
                  )}
                </View>
              </View>

              {rota.paradas && rota.paradas.length > 0 && (
                <View style={styles.subSection}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    Paradas:
                  </Text>
                  {rota.paradas.map((parada, idx) => (
                    <View key={idx} style={styles.enderecoBlock}>
                      <Text style={{ fontWeight: 'bold' }}>
                        Parada {idx + 1}:
                      </Text>
                      <Text>
                        Endereço:{' '}
                        {`${parada.rua_parada}, ${parada.numero_parada}, ${parada.bairro_parada} - ${parada.cidade_parada}/${parada.estado_parada}`}
                      </Text>
                      <Text>CEP: {parada.cep_parada}</Text>
                      {parada.complemento_parada && (
                        <Text>Complemento: {parada.complemento_parada}</Text>
                      )}
                      {parada.descricao_parada && (
                        <Text>Descrição: {parada.descricao_parada}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.subSection}>
                <Text style={{ fontWeight: 'bold' }}>Chegada:</Text>
                <View style={styles.enderecoBlock}>
                  <Text>
                    Data/Hora:{' '}
                    {dayjs(rota.data_hora_chegada).format('DD/MM/YYYY HH:mm')}
                  </Text>
                  <Text>
                    Endereço:{' '}
                    {`${rota.rua_chegada}, ${rota.numero_chegada}, ${rota.bairro_chegada} - ${rota.cidade_chegada}/${rota.estado_chegada}`}
                  </Text>
                  <Text>CEP: {rota.cep_chegada}</Text>
                  {rota.descricao_chegada && (
                    <Text>Descrição: {rota.descricao_chegada}</Text>
                  )}
                </View>
              </View>

              {rota.obs_rota && (
                <View style={styles.subSection}>
                  <Text style={{ fontWeight: 'bold' }}>Observações:</Text>
                  <Text>{rota.obs_rota}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      {!documentGenerated ? (
        <Button
          onClick={handlePrint}
          variant="outlined"
          startIcon={<PictureAsPdfIcon sx={{ fontSize: '1.5vw' }} />}
          sx={{
            fontSize: 15,
            textTransform: 'none',
            color: '#e30809',
            height: 40,
            borderColor: '#e30809',
            '&:hover': {
              color: '#FFFFFF',
              border: '2px solid #FFFFFF',
            },
          }}
        >
          Gerar Relatório PDF
        </Button>
      ) : (
        <ModalTitlePDF
          open={documentGenerated}
          close={() => setDocumentGenerated(false)}
          title="Relatório de Rotas"
          content={
            <Box sx={{ width: '70vw', height: 670 }}>
              <PDFViewer style={styles.viewer}>
                <MyDocument />
              </PDFViewer>
            </Box>
          }
        />
      )}
    </>
  );
};

export default RelatorioRotasLayoutPDF;
