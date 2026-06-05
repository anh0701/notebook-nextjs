'use client';

import VocabCard, { Vocabulary } from './VocabCard';
import { SearchCheck, FolderOpen } from 'lucide-react';

interface VocabListProps {
  vocabs: Vocabulary[];
  isLoading: boolean;
  onDeleteVocab: (id: number) => void;
  onEditVocab: (item: Vocabulary) => void; 
  isSearching: boolean;
}

export default function VocabList({ 
  vocabs, 
  isLoading, 
  onDeleteVocab, 
  onEditVocab, 
  isSearching 
}: VocabListProps) {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        <div className="h-32 bg-current opacity-10 rounded-2xl"></div>
        <div className="h-32 bg-current opacity-10 rounded-2xl"></div>
      </div>
    );
  }

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-h-100 content-start transition-all duration-75">
      {vocabs.length === 0 ? (

        <div className="col-span-full text-center h-full min-h-95 flex flex-col items-center justify-center border border-dashed border-current/15 rounded-2xl p-6 shadow-sm bg-current/[0.01] transition-all">
          {isSearching ? (
            <div className="flex flex-col items-center max-w-sm">
              <SearchCheck className="h-12 w-12 text-indigo-500 mb-4 shrink-0" />
              <p className="font-semibold text-lg">Không tìm thấy từ vựng nào khớp với từ khóa.</p>
              <p className="text-sm opacity-60 mt-2">Hãy thử kiểm tra lại chính tả hoặc tra cứu từ khác nhé!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center max-w-sm">
              <FolderOpen className="h-14 w-14 text-indigo-500 mb-4 shrink-0" />
              <p className="font-bold text-xl mb-2">Sổ tay của bạn đang trống</p>
              <p className="text-sm opacity-60">Hãy bấm nút "Thêm từ vựng mới" ở trên để bắt đầu tích lũy nhé!</p>
            </div>
          )}
        </div>
      ) : (
        vocabs.map((item) => (
          <VocabCard 
            key={item.id} 
            item={item} 
            onDelete={onDeleteVocab}
            onEdit={onEditVocab}
          />
        ))
      )}
    </div>
  );
}