'use client';

import VocabCard, { Vocabulary } from './VocabCard';

interface VocabListProps {
  vocabs: Vocabulary[];
  isLoading: boolean;
  onDeleteVocab: (id: number) => void;
  onEditVocab: (item: Vocabulary) => void; 
}

export default function VocabList({ vocabs, isLoading, onDeleteVocab, onEditVocab }: VocabListProps) {
  if (isLoading) return <div className="space-y-4 animate-pulse"><div className="h-28 bg-slate-200 rounded-lg"></div></div>;
  if (vocabs.length === 0) return <p className="text-slate-500 italic">Chưa có từ nào trong sổ tay.</p>;

  return (
    <div className="space-y-4">
      {vocabs.map((item) => (
        <VocabCard key={item.id} item={item} onDelete={onDeleteVocab} onEdit={onEditVocab} />
      ))}
    </div>
  );
}