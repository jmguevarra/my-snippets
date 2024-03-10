using (SpreadsheetDocument document = SpreadsheetDocument.Open("C:\\Users\\JaimeGuevarraJr\\Source\\Repos\\BrokerHubAPI\\BrokerHubApi\\BrokerHubApi\\api\\Group Site list - Test Groupsdafasd.xlsx", true))
            {
                WorkbookPart workbookPart = document.WorkbookPart;
                Sheet sheet = workbookPart.Workbook.Sheets.GetFirstChild<Sheet>();
                WorksheetPart worksheetPart = (WorksheetPart)workbookPart.GetPartById(sheet.Id);
                Worksheet worksheet = worksheetPart.Worksheet;

                string[] cellRefs = {"AF", "AG", "AH", "AI"};
                List<Cell> cells = worksheet.Descendants<Cell>().Where(c => {
                    var cellRef = c.CellReference != null && c.CellReference.InnerText != null ? Regex.Replace(c.CellReference.InnerText, @"\d", "") : null;
                    if (cellRefs.Contains(cellRef) && c.CellFormula != null && c.CellFormula.InnerText.Contains("HYPERLINK")) return true;
                    return false;
                }).ToList();

                if (workbookPart.WorkbookStylesPart == null)
                {
                    workbookPart.AddNewPart<WorkbookStylesPart>();
                    workbookPart.WorkbookStylesPart.Stylesheet = new Stylesheet();
                }
                Stylesheet stylesheet = workbookPart.WorkbookStylesPart.Stylesheet;
                Font blueUnderlineFont = new Font(
                    new Color() { Rgb = new HexBinaryValue() { Value = "0000FF" } });
                var fonts = stylesheet.Fonts ?? new Fonts();
                var existingFont = fonts.Elements<Font>()
                    .FirstOrDefault(f => f.Color != null && f.Color.Rgb.Value == "0000FF" && f.Underline != null);

                uint fontId;
                if (existingFont == null)
                {
                    fonts.Append(blueUnderlineFont);
                    fontId = (uint)fonts.Count++;
                    stylesheet.Fonts = fonts;
                }
                else
                {
                    fontId = (uint)fonts.ToList().IndexOf(existingFont);
                }

                CellFormat cellFormat = new CellFormat() { FontId = fontId, ApplyFont = true };
                var cellFormats = stylesheet.CellFormats ?? new CellFormats();
                cellFormats.Append(cellFormat);
                uint formatId = (uint)cellFormats.Count++;
                stylesheet.CellFormats = cellFormats;

                stylesheet.Save();
                foreach (var cell in cells)
                {
                    cell.StyleIndex = formatId;
                }
                worksheet.Save();

            }
            
