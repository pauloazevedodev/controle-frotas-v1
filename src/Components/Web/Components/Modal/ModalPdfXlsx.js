import { Box, Button, FormControl } from '@mui/material';
import TableViewIcon from '@mui/icons-material/TableView';
import ModalStyle from './ModalStyle';
import RotasLayoutPDF from '../Relatorios/PDF/RotasLayoutPDF';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { GET_RELATORIO_ROTAS } from '../../../../api';
import { toast } from 'react-toastify';

const ModalPdfXlsx = ({
  open,
  close,
  cod_veiculo,
  color = 'detail4',
  placa,
}) => {
  const handleGenerateExcel = async () => {
    try {
      const { url, options } = GET_RELATORIO_ROTAS(cod_veiculo);
      const response = await fetch(url, options);

      if (!response.ok) {
        toast.error('Erro ao buscar os dados do relatório. Tente novamente.');
        return;
      }

      const data = await response.json();
      console.log('🚀 ~ handleGenerateExcel ~ data:', data);

      if (data.length === 0) {
        toast.error('Nenhum dado retornado para o relatório.');
        return;
      }

      const formattedData = data.map((item) => ({
        'Código da Rota': item.cod_rota,
        'Data e Hora de Início': item.data_hora_partida,
        'Data e Hora de Chegada': item.data_hora_chegada,
        'Tempo gasto (horas)': dayjs(item.data_hora_chegada).diff(
          dayjs(item.data_hora_partida),
          'hour',
        ),
        'Km Percorrido': item.km_percorrido ? `${item.km_percorrido} Km` : '',
        'Quilometragem Atual': item.quilometragem
          ? `${item.quilometragem} Km`
          : '',
        'Qtd. Paradas': item.num_paradas,
        'Modelo do Veículo': item.modelo,
        'Placa do Veículo': item.placa,
        'Nome do Motorista': item.nome,
        'CPF do Motorista': item.cpf,
        'E-mail do Motorista': item.email,
        'Cidade Partida': item.cidade_partida,
        'Cidade Chegada': item.cidade_chegada,
        'Status da Rota': item.status_rota,
      }));

      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      const columnWidths = formattedData.reduce((widths, row) => {
        Object.values(row).forEach((val, idx) => {
          const contentLength = val ? val.toString().length : 10;
          widths[idx] = Math.max(widths[idx] || 10, contentLength);
        });
        return widths;
      }, []);

      worksheet['!cols'] = columnWidths.map((w) => ({ wch: w + 5 }));

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório de Rotas');

      const today = dayjs().format('YYYY-MM-DD');
      const placaSemEspaco = placa.replace(/\s+/g, '');
      const fileName = `relatorio_rotas_${today}_${placaSemEspaco}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error('Erro ao gerar o relatório:', error);
      toast.error(
        'Erro ao gerar o relatório. Veja o console para mais detalhes.',
      );
    }
  };

  return (
    <ModalStyle
      open={open}
      close={close}
      title="Gerar relatório de rotas"
      color={color}
      content={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <RotasLayoutPDF cod_veiculo={cod_veiculo} />
            <Button
              onClick={handleGenerateExcel}
              variant="outlined"
              startIcon={<TableViewIcon sx={{ fontSize: '1.5vw' }} />}
              sx={{
                mt: 2,
                fontSize: 15,
                textTransform: 'none',
                color: '#2d7930',
                height: 40,
                borderColor: '#2d7930',
                '&:hover': {
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                },
              }}
            >
              Gerar Relatório EXCEL
            </Button>
          </FormControl>
        </Box>
      }
      action={<></>}
    />
  );
};

export default ModalPdfXlsx;
