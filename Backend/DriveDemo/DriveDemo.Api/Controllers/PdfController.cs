using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace DriveDemo.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PdfController : ControllerBase
    {
        [HttpGet("info")]
        public PdfInfo GetPdfInfo()
        {
            return new PdfInfo()
            {
                Name = "pdf",
                NumberOfPages = 3
            };
        }

        [HttpGet("{pageNumber}")]
        public FileContentResult DownloadContent(int pageNumber)
        {
            var pdf = System.IO.File.ReadAllBytes(Path.Combine(Directory.GetCurrentDirectory(), "Pdfs", $"pdf_{pageNumber}.pdf"));
            return new FileContentResult(pdf, "application/pdf");
        }
    }

    public class PdfInfo
    {
        public string Name { get; set; }

        public int NumberOfPages { get; set; }
    }
}
