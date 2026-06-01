import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PageComponent = React.forwardRef<HTMLDivElement, { pageNumber: number, width: number, height: number, isVisible: boolean }>((props, ref) => {
  return (
    <div className="bg-white overflow-hidden shadow-lg flex items-center justify-center" ref={ref} style={{ width: props.width, height: props.height }}>
      {props.isVisible ? (
        <Page 
          pageNumber={props.pageNumber} 
          width={props.width} 
          renderTextLayer={false} 
          renderAnnotationLayer={false} 
          className="flex items-center justify-center"
          loading={<div className="text-zinc-400 text-xs">Loading page {props.pageNumber}...</div>}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 opacity-20">
          <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-500 rounded-full animate-spin" />
          <span className="text-[10px] font-mono uppercase tracking-widest">Page {props.pageNumber}</span>
        </div>
      )}
    </div>
  );
});
PageComponent.displayName = 'PageComponent';

interface PDFViewerProps {
  url: string;
  onClose: () => void;
}

export function PDFViewer({ url, onClose }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 450, height: 636 });
  const [zoom, setZoom] = useState(1);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth < 768;
      
      // Available space (leave some padding)
      const paddingX = isMobile ? 32 : 64;
      const paddingY = 120; // Space for close button and some margin
      
      const availableWidth = window.innerWidth - paddingX;
      const availableHeight = window.innerHeight - paddingY;

      // NCERT books are typically A4 size (aspect ratio ~ 1:1.414)
      const aspectRatio = 1.414;

      // If mobile, show 1 page. If desktop, show 2 pages side-by-side.
      const numPagesShown = isMobile ? 1 : 2;
      
      // Calculate max width and height for a single page
      let pageHeight = availableHeight;
      let pageWidth = pageHeight / aspectRatio;

      // If the total width exceeds available width, scale down based on width
      if (pageWidth * numPagesShown > availableWidth) {
        pageWidth = availableWidth / numPagesShown;
        pageHeight = pageWidth * aspectRatio;
      }

      setDimensions({ width: Math.floor(pageWidth), height: Math.floor(pageHeight) });
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!bookRef.current) return;
      if (e.key === 'ArrowRight') {
        bookRef.current.pageFlip().flipNext();
      } else if (e.key === 'ArrowLeft') {
        bookRef.current.pageFlip().flipPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError(error.message);
    setLoading(false);
  }

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  const proxiedUrl = `/api/proxy-pdf?url=${encodeURIComponent(url)}`;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950/95 backdrop-blur-sm p-4 md:p-8">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button 
          onClick={handleZoomOut}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button 
          onClick={handleResetZoom}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw size={20} />
        </button>
        <button 
          onClick={handleZoomIn}
          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <span className="flex items-center text-zinc-400 text-sm ml-2">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-4">
        <button 
          onClick={() => window.open(url, '_blank')}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
        >
          Open Original PDF
        </button>
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
        >
          Close Viewer
        </button>
      </div>

      {loading && (
        <div className="text-white text-xl animate-pulse">Loading PDF...</div>
      )}

      {error && (
        <div className="text-red-400 text-center max-w-md">
          <p className="text-xl font-bold mb-2">Failed to load PDF</p>
          <p className="text-sm opacity-80">{error}</p>
          <button 
            onClick={() => window.open(url, '_blank')}
            className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Try opening original PDF instead
          </button>
        </div>
      )}

      {!error && (
        <div className="w-full h-full flex items-center justify-center overflow-auto relative">
          {numPages && (
            <>
              <button 
                className="fixed left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full backdrop-blur-sm transition-all"
                onClick={() => bookRef.current?.pageFlip().flipPrev()}
                title="Previous Page (Left Arrow)"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                className="fixed right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full backdrop-blur-sm transition-all"
                onClick={() => bookRef.current?.pageFlip().flipNext()}
                title="Next Page (Right Arrow)"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          
          <div 
            style={{ 
              transform: `scale(${zoom})`, 
              transition: 'transform 0.2s ease-out',
              transformOrigin: 'center center'
            }}
            className="flex items-center justify-center"
          >
            <Document 
              file={proxiedUrl} 
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex justify-center items-center"
              loading={null}
            >
            {numPages && (
              // @ts-ignore
              <HTMLFlipBook 
                ref={bookRef}
                key={`${dimensions.width}-${dimensions.height}`}
                width={dimensions.width} 
                height={dimensions.height} 
                size="fixed"
                showCover={true}
                mobileScrollSupport={true}
                className="shadow-2xl"
                style={{ margin: '0 auto' }}
                usePortrait={window.innerWidth < 768}
                onFlip={(e) => setCurrentPage(e.data)}
              >
                {Array.from(new Array(numPages), (el, index) => {
                  // Windowing: only render current page and +/- 2 pages
                  const isVisible = Math.abs(index - currentPage) <= 3;
                  return (
                    <PageComponent 
                      key={`page_${index + 1}`} 
                      pageNumber={index + 1} 
                      width={dimensions.width} 
                      height={dimensions.height}
                      isVisible={isVisible}
                    />
                  );
                })}
              </HTMLFlipBook>
            )}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
}
