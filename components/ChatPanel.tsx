
import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { UserIcon, BotIcon, SendIcon, WarningIcon } from './icons';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (input: string) => void;
  isDocumentProcessed: boolean;
  error: string | null;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isModel = message.role === 'model';
    const contentWithBreaks = message.content.replace(/\n/g, '<br />');

    return (
        <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
            {isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><BotIcon className="w-5 h-5 text-cyan-400" /></div>}
            <div className={`max-w-xl p-4 rounded-xl shadow-md ${isModel ? 'bg-slate-700/50 text-slate-200 rounded-tl-none' : 'bg-cyan-500/80 text-white rounded-br-none'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: contentWithBreaks }}></p>
            </div>
            {!isModel && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-200" /></div>}
        </div>
    );
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading, onSendMessage, isDocumentProcessed, error }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (input.trim() && !isLoading && isDocumentProcessed) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/80">
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center"><BotIcon className="w-5 h-5 text-cyan-400" /></div>
              <div className="max-w-xl p-4 rounded-xl shadow-md bg-slate-700/50 text-slate-200 rounded-tl-none flex items-center space-x-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
         {!isDocumentProcessed && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                <h2 className="text-lg font-medium">Welcome!</h2>
                <p>Please upload or paste a document to begin your learning session.</p>
            </div>
        )}
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700/50">
        {error && (
            <div className="flex items-center p-2 mb-3 text-sm text-red-400 bg-red-900/30 rounded-md">
                <WarningIcon className="w-4 h-4 mr-2"/> {error}
            </div>
        )}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isDocumentProcessed ? "Ask a question about your document..." : "Please process a document first"}
            disabled={!isDocumentProcessed || isLoading}
            className="w-full py-3 pl-4 pr-12 text-sm bg-slate-800 border border-slate-600 rounded-full focus:ring-2 focus:ring-cyan-500 focus:outline-none disabled:bg-slate-700 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!isDocumentProcessed || isLoading || !input.trim()}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
