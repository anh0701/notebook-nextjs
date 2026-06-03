'use client';

import { useState, useEffect } from 'react';
import VocabForm from '@/components/VocabForm';
import VocabList from '@/components/VocabList';
import { Vocabulary } from '@/components/VocabCard';

const API_URL = 'http://localhost:8080/api/vocab';

export default function HomePage() {
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchVocabs = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Không thể kết nối đến server Backend');
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

  const handleAddVocab = async (word: string, type: Vocabulary['type'], definition: string, example: string): Promise<void> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, type, definition, example })
      });
      if (!response.ok) throw new Error('Lỗi khi thêm từ vựng mới');
      fetchVocabs(); 
    } catch (error) {
      console.error("Lỗi khi thêm từ vựng:", error);
    }
  };

  const handleDeleteVocab = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa từ này khỏi sổ tay?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Lỗi khi xóa từ vựng');
        fetchVocabs();
      } catch (error) {
        console.error("Lỗi khi xóa từ vựng:", error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
        📚 Sổ Tay Từ Vựng
      </h1>

      <VocabForm onAddVocab={handleAddVocab} />

      <h3 className="text-xl font-bold text-slate-700 mb-4">Danh sách từ hiện có ({vocabs.length})</h3>
      
      <VocabList vocabs={vocabs} isLoading={isLoading} onDeleteVocab={handleDeleteVocab} />
    </div>
  );
}