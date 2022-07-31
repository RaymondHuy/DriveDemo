using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf.IO;
using PdfSharpCore.Pdf;

namespace GenerationTool
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string fileNameWithExtension = "Old_Street_Complete_Application.pdf";
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), fileNameWithExtension);
            string newFileGeneration = $"{Path.GetFileNameWithoutExtension(fileNameWithExtension)}_Generate.pdf";
            string newFileGenerationPath = Path.Combine(Directory.GetCurrentDirectory(), newFileGeneration);

            if (File.Exists(newFileGenerationPath))
            {
                File.Delete(newFileGenerationPath);
            }
            File.Copy(filePath, newFileGenerationPath);

            using (var inputDocument = PdfReader.Open(filePath, PdfDocumentOpenMode.Modify))
            {
                for (int idx = 0; idx < inputDocument.PageCount; idx++)
                {
                    string watermark = Guid.NewGuid().ToString();
                    var page = inputDocument.Pages[idx];
                    // Create new document

                    PdfDocument outputDocument = new PdfDocument();

                    outputDocument.Version = inputDocument.Version;

                    outputDocument.Info.Creator = inputDocument.Info.Creator;

                    // Add the page and save it
                    var gfx = XGraphics.FromPdfPage(inputDocument.Pages[idx], XGraphicsPdfPageOptions.Append);

                    int emSize = 100;
                    double angle = -Math.Atan(page.Height / page.Width) * 180 / Math.PI;
                    while (emSize > 0)
                    {
                        XFont tempFont = new XFont("Times New Roman", emSize, XFontStyle.BoldItalic);
                        var tempSize = gfx.MeasureString(watermark, tempFont);

                        var width = Math.Abs(tempSize.Width * Math.Cos(angle * Math.PI / 180));
                        var height = Math.Abs(tempSize.Width * Math.Sin(angle * Math.PI / 180));

                        if (width < page.Width - 20 && height < page.Height - 20)
                        {
                            break;
                        }

                        emSize--;
                    }

                    if (emSize == 0)
                    {
                        throw new Exception("Can not set size watermark");
                    }

                    XFont font = new XFont("Times New Roman", emSize, XFontStyle.Regular);

                    var size = gfx.MeasureString(watermark, font);
                    gfx.TranslateTransform(page.Width / 2, page.Height / 2);
                    gfx.RotateTransform(-Math.Atan(page.Height / page.Width) * 180 / Math.PI);
                    //gfx.RotateTransform(angle);
                    gfx.TranslateTransform(-page.Width / 2, -page.Height / 2);
                    var format = new XStringFormat();
                    format.Alignment = XStringAlignment.Near;
                    format.LineAlignment = XLineAlignment.Near;

                    // Create a dimmed red brush.
                    XBrush brush = new XSolidBrush(XColor.FromArgb(10, 255, 0, 0));
                    var point = new XPoint((page.Width - size.Width) / 2, (page.Height - size.Height) / 2);
                    // Draw the string.
                    gfx.DrawString(watermark, font, brush, point, format);

                }

                inputDocument.Save(newFileGenerationPath);
            }
        }
    }
}