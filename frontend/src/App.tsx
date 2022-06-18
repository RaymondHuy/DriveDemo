import { useCallback, useEffect, useState } from 'react';
import './App.css';
import PdfService from './services/PdfService';
import { Viewer, Worker } from '@react-pdf-viewer/core'
import { ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

import '@react-pdf-viewer/default-layout/lib/styles/index.css';

function App() {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  const fetchPdfInfo = useCallback(async () => {
    const info = await PdfService.fecthPdfInfo();
    setTotalPages(info.numberOfPages);
  }, []);

  useEffect(() => {
    fetchPdfInfo();
  }, [fetchPdfInfo])

  const onNextPage = useCallback(() => {
    if (currentPage == totalPages) {
      return;
    }

    setCurrentPage(prevCurrentPage => prevCurrentPage + 1);
  }, [currentPage])

  const onPreviousPage = useCallback(() => {
    if (currentPage == 1) {
      return;
    }
    setCurrentPage(prevCurrentPage => prevCurrentPage - 1);
  }, [currentPage])

  return (
    <div className="App">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
        <div
          style={{
            alignItems: 'center',
            backgroundColor: '#eeeeee',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            padding: '4px',
          }}
        >
          <Toolbar>
            {(props: ToolbarSlot) => {
              const {
                GoToNextPage,
                GoToPreviousPage,
                NumberOfPages,
                CurrentPageLabel
              } = props;
              return (
                <div style={{display: 'flex'}}>
                  <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
                    <GoToPreviousPage children={(props) => <button onClick={onPreviousPage} disabled={currentPage == 1}>Previous</button>}/>
                  </div>
                  <div style={{ padding: '0px 2px', width: '1rem' }}>
                    <CurrentPageLabel children={(props) => <span>{currentPage}</span>}/>
                  </div>
                  <div style={{ padding: '0px 2px' }}>
                    / <NumberOfPages children={(props) => <span>{totalPages}</span>} />
                  </div>
                  <div style={{ padding: '0px 2px' }}>
                    <GoToNextPage children={(props) => <button onClick={onNextPage} disabled={currentPage == totalPages}>Next</button>} />
                  </div>
                </div>
              );
            }}
          </Toolbar>
        </div>
        <Viewer fileUrl={`https://localhost:5001/pdf/${currentPage}`} plugins={[toolbarPluginInstance]} />
      </Worker>
    </div>
  );
}

export default App;
