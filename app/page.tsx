'use client';

import { useState, useEffect, useCallback } from 'react';
import VocabForm from '@/components/VocabForm';
import VocabList from '@/components/VocabList';
import { Vocabulary } from '@/components/VocabCard';
import { X, Search, Plus, BookOpenCheck } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/vocab';

interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  data: Vocabulary | null;
}

export default function HomePage() {
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isApiSearching, setIsApiSearching] = useState<boolean>(false); 

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
    data: null
  });

  const fetchVocabs = useCallback(async (searchKey: string = '', showSkeleton: boolean = false): Promise<void> => {
    if (showSkeleton) setIsLoading(true); 
    if (searchKey) setIsApiSearching(true); 

    try {
      const url = searchKey 
        ? `${API_URL}?search=${encodeURIComponent(searchKey)}` 
        : API_URL;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Không thể kết nối đến server Backend CI4');
      const data: Vocabulary[] = await response.json();
      
      setVocabs(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách từ vựng từ CI4:", error);
    } finally {
      setIsLoading(false);
      setIsApiSearching(false);
    }
  }, []);


  useEffect(() => {
    fetchVocabs('', true);
  }, [fetchVocabs]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    
    if (!trimmedQuery) {
      setIsSearching(false);
      fetchVocabs('');
      return;
    }

    setIsSearching(true);

    const delayDebounceFn = setTimeout(() => {
      fetchVocabs(trimmedQuery);
    }, 350);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchVocabs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveVocab = async (word: string, type: Vocabulary['type'], definition: string, example: string): Promise<void> => {
    try {
      if (modalState.mode === 'edit' && modalState.data) {
        const response = await fetch(`${API_URL}/${modalState.data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word, type, definition, example })
        });
        if (!response.ok) throw new Error('Lỗi khi cập nhật từ vựng');

        setVocabs(prevVocabs =>
          prevVocabs.map(item =>
            item.id === modalState.data!.id
              ? { ...item, word, type, definition, example }
              : item
          )
        );
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word, type, definition, example })
        });
        if (!response.ok) throw new Error('Lỗi khi thêm từ vựng mới');

        fetchVocabs(searchQuery);
      }

      setModalState({ isOpen: false, mode: 'create', data: null });
    } catch (error) {
      console.error("Lỗi khi lưu từ vựng:", error);
    }
  };

  const handleDeleteVocab = async (id: number): Promise<void> => {
    if (confirm("Bạn có chắc chắn muốn xóa từ này khỏi sổ tay?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Lỗi khi xóa từ vựng');
        fetchVocabs(searchQuery); 
      } catch (error) {
        console.error("Lỗi khi xóa từ vựng:", error);
      }
    }
  };

  return (
    <div className="w-5xl mx-auto p-4 sm:p-8 font-sans transition-all duration-300">

      <div className="mb-6 border-b border-current/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
          <BookOpenCheck className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-500 shrink-0" />
          <span>Sổ Ngữ Vựng</span>
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 mb-6">
        <div className="relative w-full sm:flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 opacity-50" />
          </span>
          <input
            type="text"
            placeholder="Gõ từ vựng hoặc ý nghĩa để tìm nhanh ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-current opacity-80 rounded-xl py-2.5 pl-10 pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-transparent transition shadow-sm font-medium text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setModalState({ isOpen: true, mode: 'create', data: null })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl transition shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto shrink-0 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm từ mới</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 px-0.5 opacity-80">
        <h3 className="text-sm sm:text-base font-bold">
          {searchQuery ? 'Kết quả tìm kiếm từ server' : 'Danh sách từ hiện có'} ({vocabs.length})
        </h3>
      </div>

      <div className={`w-full min-h-[50vh] transition-all duration-200 relative block ${isApiSearching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        <VocabList
          vocabs={vocabs} 
          isLoading={isLoading} 
          onDeleteVocab={handleDeleteVocab}
          isSearching={isSearching}
          onEditVocab={(item) => setModalState({ isOpen: true, mode: 'edit', data: item })}
        />
      </div>

      {modalState.isOpen && (
        <VocabForm
          mode={modalState.mode}
          editingVocab={modalState.data}
          onSaveVocab={handleSaveVocab}
          onCancelEdit={() => setModalState({ isOpen: false, mode: 'create', data: null })}
        />
      )}
    </div>
  );
}