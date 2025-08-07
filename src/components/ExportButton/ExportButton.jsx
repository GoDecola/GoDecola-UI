import { Box, IconButton, Tooltip } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportButtons = ({ data, columns, onlyPdf = false, targetRef }) => {
  const exportPDF = async () => {
    if (!targetRef?.current) return;
    const canvas = await html2canvas(targetRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("exportado.pdf");
  };

  const exportExcel = () => {
    if (!data || !columns) return;

    const rows = data.map((row) =>
      columns.reduce((acc, col) => {
        acc[col.label] = row[col.key];
        return acc;
      }, {})
    );

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "exportado.xlsx");
  };

  return (
    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", mb: 2, alignSelf: "flex-end" }}>
      <Tooltip title="Exportar PDF">
        <IconButton onClick={exportPDF} color="error">
          <PictureAsPdfIcon />
        </IconButton>
      </Tooltip>
      {!onlyPdf && (
        <Tooltip title="Exportar Excel">
          <IconButton onClick={exportExcel} color="success">
            <TableViewIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ExportButtons;
