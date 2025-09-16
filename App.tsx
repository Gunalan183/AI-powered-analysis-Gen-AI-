
import React, { useState, useCallback } from 'react';
import { DocumentPanel } from './components/DocumentPanel';
import { ChatPanel } from './components/ChatPanel';
import type { Message } from './types';
import { askWithContext } from './services/geminiService';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [isDocumentProcessed, setIsDocumentProcessed] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcessDocument = (content: string) => {
    setDocumentContent(content);
    setIsDocumentProcessed(true);
    setMessages([
      {
        id: 'initial-message',
        role: 'model',
        content: 'Your document has been processed. You can now ask me questions about it.',
      },
    ]);
    setError(null);
  };

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!documentContent) {
      setError('Please process a document before asking questions.');
      return;
    }

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userInput,
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const responseText = await askWithContext(documentContent, userInput);
      const newModelMessage: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: responseText,
      };
      setMessages((prev) => [...prev, newModelMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get response from AI: ${errorMessage}`);
      const errorModelMessage: Message = {
        id: `model-error-${Date.now()}`,
        role: 'model',
        content: `Sorry, I encountered an error. ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorModelMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [documentContent]);

  return (
    <div className="flex h-screen font-sans bg-slate-900 text-slate-100">
      <aside className="w-1/3 max-w-sm p-6 bg-slate-800/50 border-r border-slate-700/50 flex flex-col h-full overflow-y-auto">
        <header className="flex items-center mb-8">
          <LogoIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold ml-3">AI Learning Assistant</h1>
        </header>
        <DocumentPanel onProcessDocument={handleProcessDocument} isProcessing={isLoading} />
      </aside>

      <main className="flex-1 flex flex-col h-screen">
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          isDocumentProcessed={isDocumentProcessed}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
