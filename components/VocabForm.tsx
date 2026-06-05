'use client';

import { useState, useEffect } from 'react';
import { Vocabulary } from './VocabCard';
import { X, Sparkles, PencilLine } from 'lucide-react';

interface VocabFormProps {
  mode: 'create' | 'edit';
  editingVocab: Vocabulary | null;
  onSaveVocab: (word: string, type: Vocabulary['type'], definition: string, example: string) => Promise<void>;
  onCancelEdit: () => void;
}

export default function VocabForm({ mode, editingVocab, onSaveVocab, onCancelEdit }: VocabFormProps) {
  const [word, setWord] = useState<string>('');
  const [type, setType] = useState<Vocabulary['type']>('n');
  const [definition, setDefinition] = useState<string>('');
  const [example, setExample] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (mode === 'edit' && editingVocab) {
      setWord(editingVocab.word);
      setType(editingVocab.type);
      setDefinition(editingVocab.definition);
      setExample(editingVocab.example || '');
    } else {
      setWord('');
      setType('n');
      setDefinition('');
      setExample('');
    }
  }, [mode, editingVocab]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word || !definition) return alert("Vui lòng điền đầy đủ thông tin!");

    setIsSubmitting(true);
    await onSaveVocab(word, type, definition, example);
    setIsSubmitting(false);
  };

  const isEdit = mode === 'edit';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`bg-white border rounded-xl p-6 w-full max-w-lg shadow-2xl relative transition-all ${isEdit ? 'border-blue-200' : 'border-emerald-200'}`}>
        
        <button 
          type="button"
          onClick={onCancelEdit}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className={`text-xl font-bold mb-5 flex items-center gap-2 ${isEdit ? 'text-blue-700' : 'text-emerald-700'}`}>
          {isEdit ? <PencilLine className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          {isEdit ? 'Chỉnh sửa từ vựng' : 'Thêm từ vựng mới'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Từ vựng</label>
              <input 
                type="text" 
                value={word} 
                placeholder={isEdit ? "Chỉnh sửa từ..." : "Ví dụ: Synchronous"} 
                onChange={(e) => setWord(e.target.value)}
                className={`w-full border rounded-lg p-2.5 text-slate-800 focus:outline-none font-medium ${isEdit ? 'focus:border-blue-500' : 'focus:border-emerald-500'}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Từ loại</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as Vocabulary['type'])}
                className={`border rounded-lg p-2.5 text-slate-800 bg-white focus:outline-none h-[42px] ${isEdit ? 'focus:border-blue-500' : 'focus:border-emerald-500'}`}
              >
                <option value="n">Danh từ (n)</option>
                <option value="v">Động từ (v)</option>
                <option value="adj">Tính từ (adj)</option>
                <option value="adv">Trạng từ (adv)</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Định nghĩa</label>
            <textarea 
              value={definition} 
              placeholder="Ý nghĩa chi tiết..." 
              onChange={(e) => setDefinition(e.target.value)}
              className={`w-full border rounded-lg p-2.5 text-slate-800 h-24 focus:outline-none ${isEdit ? 'focus:border-blue-500' : 'focus:border-emerald-500'}`}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Ví dụ đặt câu (Không bắt buộc)</label>
            <input 
              type="text" 
              value={example} 
              placeholder="Đặt câu để nhớ ngữ cảnh..." 
              onChange={(e) => setExample(e.target.value)}
              className={`w-full border rounded-lg p-2.5 text-slate-800 focus:outline-none ${isEdit ? 'focus:border-blue-500' : 'focus:border-emerald-500'}`}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <button 
              type="button" 
              onClick={onCancelEdit}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-lg transition"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`font-medium py-2 px-5 rounded-lg transition shadow text-white ${isEdit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật ngay' : 'Thêm vào sổ tay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}