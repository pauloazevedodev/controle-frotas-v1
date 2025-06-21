import { Workbook } from "exceljs";
import dayjs from "dayjs";

const openExcel = (ref) => {
  const excelDefinition = getExcelDefinition(
    ref.current.props.title,
    ref.current.api,
    ref.current.columnApi
  );

  excelDefinition.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    if (blob instanceof Blob) {
      let link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download =
        (ref.current.props.title ? ref.current.props.title + "-" : "") +
        `${dayjs().format("DD-MM-YYYY HH:mm:ss")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
};

const getExcelDefinition = (title, agGridApi, agGridColumnApi) => {
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(title);

  const columnsToExport = getColumnsToExport(agGridColumnApi);
  const rowsToExport = getRowsToExport(agGridApi, columnsToExport);

  worksheet.columns = columnsToExport;
  worksheet.addRows(rowsToExport);

  for (let rowIndex = 1; rowIndex <= worksheet.rowCount; rowIndex++) {
    worksheet.getRow(rowIndex).alignment = {
      vertical: "top",
      horizontal: "left",
      wrapText: true,
    };
  }

  worksheet.getRow(1).eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "000000" },
      bgColor: { argb: "000000" },
    };
    cell.font = { color: { argb: "ffffff" }, bold: true };
  });

  worksheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: columnsToExport.length },
  };

  return workbook;
};

const getColumnsToExport = (columnApi) => {
  let columnsToExport = [];

  columnApi.getAllDisplayedColumns().forEach((col) => {
    columnsToExport.push({
      colId: col.getColId(),
      key: col.getColId(),
      header: col.colDef.headerName,
      width: col.getActualWidth() / 5,
      valueFormatter: ["date", "datetime"].includes(col.colDef.cellDataType)
        ? col.colDef.valueFormatter
        : null,
      exportOptions: col.colDef.exportOptions,
    });
  });

  return columnsToExport.filter((col) => !col.exportOptions?.hide);
};

const getRowsToExport = (api, columnsToExport) => {
  let rowsToExport = [];

  api.forEachNodeAfterFilterAndSort((node) => {
    let rowToExport = columnsToExport.map((col) => {
      let cellValue = api.getValue(col.colId, node);
      if (col.valueFormatter && cellValue)
        cellValue = col.valueFormatter({ value: cellValue });

      return cellValue;
    });
    rowsToExport.push(rowToExport);
  });

  return rowsToExport;
};

export { openExcel };
