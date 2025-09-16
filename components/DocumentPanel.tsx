
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface DocumentPanelProps {
  onProcessDocument: (content: string) => void;
  isProcessing: boolean;
}

export const DocumentPanel: React.FC<DocumentPanelProps> = ({ onProcessDocument, isProcessing }) => {
  const [textContent, setTextContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleProcessClick = () => {
    if (textContent.trim()) {
      onProcessDocument(textContent);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
     if (file && (file.type === 'text/plain' || file.type === 'text/markdown')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="flex flex-col flex-grow space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-200 mb-2">1. Provide Context</h2>
        <p className="text-sm text-slate-400">
          Upload a .txt or .md file, or paste your notes into the text box below. This content will be used by the AI to answer your questions.
        </p>
      </div>
      
      <div className="flex-grow flex flex-col space-y-4">
        <label
            htmlFor="file-upload"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-slate-800/70 border-2 border-slate-600/50 border-dashed rounded-md cursor-pointer hover:bg-slate-700/50 hover:border-cyan-400/50"
        >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-8 h-8 mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-slate-500">TXT, MD (MAX. 5MB)</p>
            </div>
            <input id="file-upload" type="file" className="hidden" accept=".txt, .md" onChange={handleFileChange} />
        </label>
        
        {fileName && <p className="text-sm text-center text-slate-400">Loaded: <span className="font-medium text-cyan-400">{fileName}</span></p>}
        
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Or paste your text here..."
          className="flex-grow w-full p-3 text-sm bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-cyan-500 focus:outline-none resize-none"
          rows={10}
        />
      </div>

      <button
        onClick={handleProcessClick}
        disabled={!textContent.trim() || isProcessing}
        className="w-full py-3 px-4 font-semibold text-slate-900 bg-cyan-400 rounded-md transition-colors duration-200 hover:bg-cyan-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Process Document'
        )}
      </button>
    </div>
  );
};
