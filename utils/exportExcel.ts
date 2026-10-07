import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const exportToExcel = async (items: any[], userEmail: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ABIC Inventory Report');

  // 1. ABIC Corporate Header Banner
  worksheet.mergeCells('A1:D1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'ABIC, INC. — ENTERPRISE ASSET LEDGER';
  titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A192F' } }; // Corporate Navy
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 36;

  // 2. Metadata Sub-header Bar
  worksheet.mergeCells('A2:D2');
  const metaCell = worksheet.getCell('A2');
  metaCell.value = `Authorized User: ${userEmail} | Generated: ${new Date().toLocaleString()} | Total Assets: ${items.length}`;
  metaCell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF4B5563' } };
  metaCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
  metaCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(2).height = 20;

  worksheet.addRow([]);

  // 3. Table Column Headers
  const headers = ['ITEM DETAILS', 'SERIAL / TAG', 'DATE REGISTERED', 'STATUS'];
  const headerRow = worksheet.addRow(headers);
  headerRow.height = 26;

  headerRow.eachCell((cell) => {
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }; // Corporate Blue
    cell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  });

  // 4. Data Rows with Zebra Striping
  items.forEach((item, index) => {
    const row = worksheet.addRow([
      item.item_name || item.title || 'N/A',
      item.serial_number || item.tag || 'N/A',
      item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A',
      'Active Sync'
    ]);

    row.height = 22;
    const isEven = index % 2 === 0;

    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Segoe UI', size: 10 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: isEven ? 'FFFFFFFF' : 'FFF9FAFB' }
      };
      cell.alignment = { 
        vertical: 'middle', 
        horizontal: colNumber === 2 ? 'center' : 'left', 
        indent: 1 
      };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
        right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
      };
    });
  });

  worksheet.columns = [
    { width: 38 },
    { width: 22 },
    { width: 22 },
    { width: 18 }
  ];

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `ABIC_Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
};
