import PdfApi from "../api/PdfApi";

const fecthPdfInfo = async () => {
    const { data } = await PdfApi.fetchPdfInfo();
    return data;
}

export default {
    fecthPdfInfo
};