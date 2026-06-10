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
    <div className="w-full h-full border border-current opacity-90 rounded-xl p-6 relative shadow-sm hover:shadow-md transition-all duration-200 flex flex-col  min-h-[220px]">

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

      <div className="mt-4">
        {item.example ? (
          <div className="border-l-4 border-emerald-500 bg-emerald-500/10 px-4 py-3 rounded-r-lg h-full">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              Ví dụ
            </div>

            <p className="italic leading-relaxed text-current/90">
              {item.example}
            </p>
          </div>
        ) : (
          <div className="h-full border-l-4 border-transparent" />
        )}
      </div>
    </div>
  );
}