'use client';

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
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 relative shadow-sm hover:shadow transition">
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={() => onEdit(item)}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded transition"
        >
          Sửa
        </button>
        <button 
          onClick={() => onDelete(item.id)}
          className="bg-rose-500 hover:bg-rose-600 text-white text-xs py-1 px-2 rounded transition"
        >
          Xóa
        </button>
      </div>
      
      <h4 className="text-lg font-bold text-blue-600 mb-1">
        {item.word} <span className="text-sm font-normal italic text-slate-500">({item.type})</span>
      </h4>
      <p className="text-slate-700 font-medium mb-2">👉 {item.definition}</p>
      {item.example && <div className="bg-white p-3 border-l-4 border-emerald-500 rounded text-sm italic text-slate-600">Example: {item.example}</div>}
    </div>
  );
}