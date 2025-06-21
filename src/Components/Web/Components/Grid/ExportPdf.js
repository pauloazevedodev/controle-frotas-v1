import dayjs from "dayjs";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const openPdf = (ref) => {
  const params = {
    PDF_WITH_HEADER_DATE: true,
    PDF_WITH_HEADER_IMAGE: true,
    // PDF_LOGO: 'https://grupocimcal.net.br/img-ecommerce/VIVEZA_BELLAR.png',

    PDF_TITLE: ref.current.props.title,

    PDF_ROW_HEIGHT: 15,
    PDF_HEADER_HEIGHT: 25,
    PDF_HEADER_COLOR: "#f8f8f8",
    PDF_ODD_BKG_COLOR: "#fcfcfc",
    PDF_EVEN_BKG_COLOR: "#fff",

    PDF_INNER_BORDER_COLOR: "#dde2eb",
    PDF_OUTER_BORDER_COLOR: "#babfc7",
    PDF_PAGE_ORITENTATION: "landscape",

    PDF_WITH_FOOTER_PAGE_COUNT: true,
  };

  const pdfDefinition = getPdfDefinition(
    params,
    ref.current.api,
    ref.current.columnApi
  );

  pdfMake.createPdf(pdfDefinition).open({}, window.open("", "_blank"));
};

const getPdfDefinition = (printParams, agGridApi, agGridColumnApi) => {
  const {
    PDF_WITH_HEADER_DATE,
    PDF_WITH_HEADER_IMAGE,
    // PDF_LOGO,
    PDF_TITLE,
    PDF_ROW_HEIGHT,
    PDF_HEADER_HEIGHT,
    PDF_HEADER_COLOR,
    PDF_ODD_BKG_COLOR,
    PDF_EVEN_BKG_COLOR,
    PDF_INNER_BORDER_COLOR,
    PDF_OUTER_BORDER_COLOR,
    PDF_PAGE_ORITENTATION,
    PDF_WITH_FOOTER_PAGE_COUNT,
  } = printParams;

  const columnsToExport = getColumnsToExport(agGridColumnApi);
  const rowsToExport = getRowsToExport(agGridApi, columnsToExport);

  const widths = getExportedColumnsWidths(columnsToExport);
  const body = [columnsToExport, ...rowsToExport];

  const header = {
    columns: [
      // PDF_WITH_HEADER_IMAGE
      //   ? {
      //       // image: 'ag-grid-logo',
      //       margin: [300, 10, 0, 10],
      //       width: 250,
      //     }
      //   : {},
      PDF_WITH_HEADER_DATE
        ? {
            text: dayjs().format("DD/MM/YYYY HH:mm:ss"),
            alignment: "right",
            margin: [20, 20, 20, 0],
          }
        : {},
    ],
  };

  const footer = PDF_WITH_FOOTER_PAGE_COUNT
    ? (currentPage, pageCount) => ({
        margin: [20, 5, 20, 0],
        alignment: "right",
        text: currentPage.toString() + " de " + pageCount,
      })
    : null;

  const fillColor = (rowIndex, node) => {
    if (rowIndex < node.table.headerRows) return PDF_HEADER_COLOR;
    return rowIndex % 2 === 0 ? PDF_ODD_BKG_COLOR : PDF_EVEN_BKG_COLOR;
  };

  const hLineWidth = () => 1;

  const vLineWidth = (i, node) =>
    i === 0 || i === node.table.widths.length ? 1 : 0;

  const hLineColor = (i, node) =>
    i === 0 || i === node.table.body.length
      ? PDF_OUTER_BORDER_COLOR
      : PDF_INNER_BORDER_COLOR;

  const vLineColor = (i, node) =>
    i === 0 || i === node.table.widths.length
      ? PDF_OUTER_BORDER_COLOR
      : PDF_INNER_BORDER_COLOR;

  const tableHeader = {
    bold: true,
    margin: [0, PDF_HEADER_HEIGHT / 5, 0, PDF_HEADER_HEIGHT / 5],
  };

  const tableCell = {
    margin: [0, PDF_ROW_HEIGHT / 5, 0, PDF_ROW_HEIGHT / 5],
  };

  const pageMargins = [
    10,
    PDF_WITH_HEADER_IMAGE ? 70 : PDF_WITH_HEADER_DATE ? 40 : 20,
    10,
    PDF_WITH_FOOTER_PAGE_COUNT ? 40 : 10,
  ];

  const title = PDF_TITLE
    ? { fontSize: 18, bold: true, margin: [10, 0, 0, 10] }
    : {};

  const docDefintiion = {
    pageOrientation: PDF_PAGE_ORITENTATION,
    header,
    footer,
    content: [
      { style: "title", text: PDF_TITLE ? "Relatório " + PDF_TITLE : "" },
      {
        style: "myTable",
        table: { headerRows: 1, widths, body },
        layout: { fillColor, hLineWidth, vLineWidth, hLineColor, vLineColor },
      },
    ],
    // images: { 'ag-grid-logo': PDF_LOGO },
    styles: { title, tableHeader, tableCell },
    defaultStyle: { fontSize: 8 },
    pageMargins,
  };

  return docDefintiion;
};

const getColumnsToExport = (columnApi) => {
  let columnsToExport = [];

  columnApi.getAllDisplayedColumns().forEach((col) => {
    columnsToExport.push({
      text: col.colDef.headerName,
      colId: col.getColId(),
      width: col.getActualWidth(),
      valueFormatter: col.colDef.valueFormatter,
      exportOptions: col.colDef.exportOptions,
      style: "tableHeader",
    });
  });

  return columnsToExport.filter((col) => !col.exportOptions?.hide);
};

const getExportedColumnsWidths = (columnsToExport) => {
  let widthTotal = 0;

  let widthColumns = columnsToExport.map((col) => {
    widthTotal += col.width;
    return col.width;
  });

  return widthColumns.map((width) => (width / widthTotal) * 100 + "%");
};

const getRowsToExport = (api, columnsToExport) => {
  let rowsToExport = [];

  api.forEachNodeAfterFilterAndSort((node) => {
    let rowToExport = columnsToExport.map((col) => {
      let cellValue = api.getValue(col.colId, node);
      if (col.valueFormatter && cellValue)
        cellValue = col.valueFormatter({ value: cellValue });

      return {
        text: cellValue || "",
        colId: col.colId,
        style: "tableCell",
      };
    });

    rowsToExport.push(rowToExport);
  });

  return rowsToExport;
};

export { openPdf };
