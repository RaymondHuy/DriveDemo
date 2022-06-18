import { PdfInfo } from '../models/pdf-info.model';
import api from './index';

const fetchPdfInfo = () => {
    return api.get<PdfInfo>('pdf/info');
}

export default {
    fetchPdfInfo
};