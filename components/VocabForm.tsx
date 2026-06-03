'use client';

import { useState } from 'react';
import { Vocabulary } from './VocabCard';

interface VocabFormProps {
  onAddVocab: (word: string, type: Vocabulary['type'], definition: string, example: string) => Promise<void>;
}

export default function VocabForm({ onAddVocab }: VocabFormProps) {
  const [word, setWord] = useState<string>('');
  const [type, setType] = useState<Vocabulary['type']>('n');
  const [definition, setDefinition] = useState<string>('');
  const [example, setExample] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word || !definition) {
      alert("Vui lòng điền đầy đủ Từ vựng và Định nghĩa!");
      return;
    }

    setIsSubmitting(true);
   
    await onAddVocab(word, type, definition, example);
    setIsSubmitting(false);

    setWord('');
    setDefinition('');
    setExample('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-5 mb-8 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Thêm từ vựng mới</h3>
      
      <div className="flex gap-4 mb-4">
        <input 
          type="text" 
          placeholder="Từ vựng (Ví dụ: Asynchronous)" 
          value={word} 
          onChange={(e) => setWord(e.target.value)}
          className="flex-1 border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-blue-500"
        />
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value as Vocabulary['type'])}
          className="border border-slate-300 rounded p-2 text-slate-800 bg-white"
        >
          <option value="n">Danh từ (n)</option>
          <option value="v">Động từ (v)</option>
          <option value="adj">Tính từ (adj)</option>
          <option value="adv">Trạng từ (adv)</option>
        </select>
      </div>

      <div className="mb-4">
        <textarea 
          placeholder="Định nghĩa ý nghĩa của từ..." 
          value={definition} 
          onChange={(e) => setDefinition(e.target.value)}
          className="w-full border border-slate-300 rounded p-2 text-slate-800 h-20 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Ví dụ câu áp dụng..." 
          value={example} 
          onChange={(e) => setExample(e.target.value)}
          className="w-full border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-blue-500"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded transition shadow"
      >
        {isSubmitting ? 'Đang lưu...' : 'Thêm vào sổ tay'}
      </button>
    </form>
  );
}