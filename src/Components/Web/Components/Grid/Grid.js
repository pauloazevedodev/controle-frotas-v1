import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine-dark.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './Grid.css';
import HeaderGrid from './HeaderGrid';
import { toast } from 'react-toastify';

const localeTextPTBR = {
  page: 'Página',
  more: 'Mais',
  to: 'até',
  of: 'de',
  next: 'Próximo',
  last: 'Último',
  first: 'Primeiro',
  previous: 'Anterior',
  loadingOoo: 'Carregando...',
  noRowsToShow: 'Nenhum dado disponível',
  selectAll: 'Selecionar Todos',
  searchOoo: 'Pesquisar...',
  blanks: 'Em branco',
  filterOoo: 'Filtrar...',
  applyFilter: 'Aplicar Filtro...',
  equals: 'Igual a',
  notEqual: 'Diferente de',
  lessThan: 'Menor que',
  greaterThan: 'Maior que',
  lessThanOrEqual: 'Menor ou igual a',
  greaterThanOrEqual: 'Maior ou igual a',
  inRange: 'No intervalo',
  contains: 'Contém',
  notContains: 'Não contém',
  startsWith: 'Começa com',
  endsWith: 'Termina com',
};

const Grid = forwardRef(
  (
    { columns, rows, loading, blockNavigate = false, preferences, ...props },
    ref,
  ) => {
    const params = useLocation();
    const [alterPreference, setAlterPreference] = useState(0);
    const [columnsOrder, setColumnsOrder] = useState(columns);

    useEffect(() => {
      let newColumns = [];

      columns.map((col) => {
        let existe = newColumns.find((state) => state.field === col.field);
        if (!existe) {
          if (['int', 'moeda', 'numero'].includes(col.cellDataType)) {
            col.comparator = (valueA, valueB) =>
              Number(valueA) - Number(valueB);
          }
          newColumns.push(col);
        }
      });

      setColumnsOrder(newColumns);
    }, [columns]);

    useEffect(() => {
      if (loading) ref?.current?.api?.showLoadingOverlay();
    }, [loading]);

    const defaultColDef = useMemo(() => {
      return {
        resizable: true,
        cellDataType: 'text',
        sortable: true,
        flex: props.columnFlex ? 1 : 0,
        visible: false,
        autoSize: true,
        ...props.defaultColDef,
      };
    }, []);

    const components = useMemo(() => {
      return {
        agColumnHeader: (props) => <HeaderGrid ref={ref} {...props} />,
      };
    }, []);

    const dataTypeDefinitions = useMemo(() => {
      return {
        date: {
          baseDataType: 'dateString',
          extendsDataType: 'dateString',
          valueFormatter: (params) =>
            params.value && moment(params.value).format('DD/MM/YYYY'),
        },
        datetime: {
          baseDataType: 'dateString',
          extendsDataType: 'dateString',
          valueFormatter: (params) =>
            params.value && moment(params.value).format('DD/MM/YYYY HH:mm:ss'),
        },
        moeda: {
          baseDataType: 'text',
          extendsDataType: 'text',
          valueFormatter: (params) =>
            params.value &&
            parseFloat(params.value).toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL',
            }),
        },
        numero: {
          baseDataType: 'text',
          extendsDataType: 'text',
          valueFormatter: (params) =>
            params.value &&
            parseFloat(params.value).toLocaleString('pt-BR', {
              maximumFractionDigits: 2,
            }),
        },
        porcent: {
          baseDataType: 'text',
          extendsDataType: 'text',
          valueFormatter: (params) =>
            params.value &&
            `${parseFloat(params.value).toLocaleString('pt-BR', {
              maximumFractionDigits: 2,
            })}%`,
        },
        celular: {
          baseDataType: 'text',
          extendsDataType: 'text',
          valueFormatter: (params) => {
            const v = params.value ? params.value.replace(/\D/g, '') : '';

            return v.length === 11
              ? `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
              : `${v.slice(0, 5)}-${v.slice(5)}`;
          },
        },
      };
    }, []);

    const navigateToNextCell = (params) => {
      const nextCell = params.nextCellPosition;
      if (nextCell && !blockNavigate) {
        if (params.key !== 'ArrowDown' && params.key !== 'ArrowUp')
          return nextCell;

        params.api.forEachNode((node) => {
          if (node.rowIndex === nextCell.rowIndex) node.setSelected(true);
        });
        return nextCell;
      }
    };

    const setPreference = (e) => {
      if (
        [
          'columnVisible',
          'sortChanged',
          'columnPinned',
          'columnRowGroupChanged',
          'columnValueChanged',
          'columnPivotChanged',
        ].includes(e.type) ||
        (e.finished && preferences && /ui.*/.test(e.source))
      ) {
        setAlterPreference((state) => state + 1);
      }
    };

    const copyTextToClipboard = (text) => {
      if (!navigator.clipboard) {
        fallBackCopyClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(
        () =>
          toast.success('Texto copiado com sucesso!', {
            hideProgressBar: true,
            autoClose: 500,
          }),
        () => fallBackCopyClipboard(text),
      );
    };

    const onCellKeyDown = useCallback((e) => {
      if (e.event.ctrlKey && e.event.key === 'c') {
        const text = e.value;
        copyTextToClipboard(text);
      }
    }, []);

    const fallBackCopyClipboard = (text) => {
      let textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        let successful = document.execCommand('copy');
        successful
          ? toast.success('Texto copiado com sucesso!', {
              hideProgressBar: true,
              autoClose: 500,
            })
          : toast.error('Erro ao copiar texto!', {
              hideProgressBar: true,
              autoClose: 500,
            });
      } catch (err) {
        toast.error('Erro ao copiar texto!', {
          hideProgressBar: true,
          autoClose: 500,
        });
      }
      document.body.removeChild(textarea);
    };

    return (
      <div
        className="ag-theme-quartz-dark"
        style={{ height: '100%', width: '100%' }}
      >
        <AgGridReact
          ref={ref}
          rowData={rows}
          columnDefs={columnsOrder}
          defaultColDef={defaultColDef}
          navigateToNextCell={navigateToNextCell}
          components={components}
          pagination={true}
          localeText={localeTextPTBR}
        />
      </div>
    );
  },
);

export default Grid;
