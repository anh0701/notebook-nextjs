'use client';

import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/vocab';

interface Vocabulary {
  id: number;
  word: string;
  type: 'n' | 'v' | 'adj' | 'adv';
  definition: string;
  example: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function HomePage() {

  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const [word, setWord] = useState<string>('');
  const [type, setType] = useState<Vocabulary['type']>('n');
  const [definition, setDefinition] = useState<string>('');
  const [example, setExample] = useState<string>('');

  const fetchVocabs = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Không thể kết nối đến server Backend');
      }
      const data: Vocabulary[] = await response.json();
      setVocabs(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách từ vựng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabs();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!word || !definition) {
      alert("Vui lòng điền đầy đủ Từ vựng và Định nghĩa!");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ word, type, definition, example }) 
      });

      if (!response.ok) {
        throw new Error('Lỗi khi thêm từ vựng mới');
      }

      setWord(''); 
      setDefinition(''); 
      setExample('');

      fetchVocabs();
    } catch (error) {
      console.error("Lỗi khi thêm từ vựng:", error);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa từ này khỏi sổ tay?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Lỗi khi xóa từ vựng');
        }

        fetchVocabs();
      } catch (error) {
        console.error("Lỗi khi xóa từ vựng:", error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
        📚 Sổ Tay Từ Vựng (Next.js TS - Secure Fetch)
      </h1>

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
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded transition shadow"
        >
          Thêm vào sổ tay
        </button>
      </form>


      <h3 className="text-xl font-bold text-slate-700 mb-4">Danh sách từ hiện có ({vocabs.length})</h3>
      
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 bg-slate-200 rounded-lg"></div>
          <div className="h-28 bg-slate-200 rounded-lg"></div>
        </div>
      ) : vocabs.length === 0 ? (
        <p className="text-slate-500 italic">Chưa có từ nào trong sổ tay của bạn.</p>
      ) : (
        <div className="space-y-4">
          {vocabs.map((item) => (
            <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-lg p-5 relative shadow-sm hover:shadow transition">
              <button 
                onClick={() => handleDelete(item.id)}
                className="absolute top-4 right-4 bg-rose-500 hover:bg-rose-600 text-white text-xs py-1 px-2 rounded transition"
              >
                Xóa
              </button>
              
              <h4 className="text-lg font-bold text-blue-600 mb-1">
                {item.word} <span className="text-sm font-normal italic text-slate-500">({item.type})</span>
              </h4>
              
              <p className="text-slate-700 font-medium mb-2">👉 {item.definition}</p>
              
              {item.example && (
                <div className="bg-white p-3 border-l-4 border-emerald-500 rounded text-sm italic text-slate-600">
                  Example: {item.example}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}