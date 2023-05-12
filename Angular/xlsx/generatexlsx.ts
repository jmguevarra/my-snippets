
  downloadSiteListTemplate(){
    const fileName = 'Group site list template.xlsx';
    const blob = this.generateTemplateXlsx();

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  private generateTemplateXlsx(): Blob{
    const siteListColumns = [
      [
        'Market classification',
        'Trading name (from Invoice)',
        'Company / Trust name',
        'Start date',
        'NMI',
        'ABN',
        'ACN',
        'Site address',
        'Suburb',
        'State',
        'Postcode',
        'Outgoing retailer',
        'No. of Meters'
      ],
    ];
  
    const columnWidths = [
      { wch: 25 }, 
      { wch: 40 },
      { wch: 40 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 40 },
      { wch: 30 },
      { wch: 15 },
      { wch: 10 },
      { wch: 30 },
      { wch: 15 },
    ];
  
    const worksheet = XLSX.utils.aoa_to_sheet(siteListColumns);
  
    // Set the width of each column
    worksheet['!cols'] = columnWidths.map((columnWidth) => ({ width: columnWidth.wch }));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sites');
  
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
  }
