'use client';

import { Hand } from "lucide-react";

export interface Vocabulary {
  id: number;
  word: string;
  type: 'n' | 'v' | 'adj' | 'adv';
  definition: string;
  example: string | null;
}

interface VocabCardProps {
  item: Vocabulary;
  onDelete: (id: number) => void;
  onEdit: (item: Vocabulary) => void;
}

export default function VocabCard({ item, onDelete, onEdit }: VocabCardProps) {
  return (
    <div className="w-full h-full border border-current opacity-90 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200">

      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onEdit(item)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 px-2.5 rounded-lg transition font-medium shadow-sm"
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="bg-rose-500 hover:bg-rose-600 text-white text-xs py-1.5 px-3 rounded-lg transition font-medium shadow-sm"
        >
          Xóa
        </button>
      </div>

      <h4 className="text-2xl font-bold text-indigo-500 mb-2 pr-16">
        {item.word} <span className="text-xs font-normal italic opacity-60">({item.type})</span>
      </h4>

      <p className="font-medium mb-3 flex items-start gap-2 text-lg">
        <Hand className="h-4 w-4 text-indigo-500 shrink-0 mt-1" />
        <span>{item.definition}</span>
      </p>

      {item.example && (
        <div className="relative mt-3 p-3 pl-4 border-l-4 border-emerald-500 rounded-r-lg bg-emerald-500/10 text-base italic">
          <span className="font-semibold not-italic text-emerald-600 dark:text-emerald-400 mr-1.5">
            Ví dụ:
          </span>
          <span className="opacity-90">
            {item.example}
          </span>
        </div>
      )}
    </div>
  );
}