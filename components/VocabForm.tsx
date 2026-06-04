'use client';

import { useState, useEffect } from 'react';
import { Vocabulary } from './VocabCard';

interface VocabFormProps {
  editingVocab: Vocabulary | null;
  onSaveVocab: (word: string, type: Vocabulary['type'], definition: string, example: string) => Promise<void>;
  onCancelEdit: () => void;
}

export default function VocabForm({ editingVocab, onSaveVocab, onCancelEdit }: VocabFormProps) {
  const [word, setWord] = useState<string>('');
  const [type, setType] = useState<Vocabulary['type']>('n');
  const [definition, setDefinition] = useState<string>('');
  const [example, setExample] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (editingVocab) {
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
  }, [editingVocab]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!word || !definition) return alert("Vui lòng điền đầy đủ thông tin!");

    setIsSubmitting(true);
    await onSaveVocab(word, type, definition, example);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`border rounded-lg p-5 mb-8 shadow-sm transition ${editingVocab ? 'bg-blue-50/50 border-blue-200' : 'bg-white border-slate-200'}`}>
      <h3 className="text-lg font-semibold text-slate-700 mb-4">
        {editingVocab ? '📝 Cập nhật từ vựng' : '✨ Thêm từ vựng mới'}
      </h3>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={word}
          placeholder={editingVocab ? "Chỉnh sửa từ vựng..." : "Từ vựng mới (Ví dụ: Asynchronous)"} // 👈 Placeholder động
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
          value={definition}
          placeholder="Định nghĩa, ý nghĩa chi tiết của từ vựng này..." // 👈 Thêm placeholder
          onChange={(e) => setDefinition(e.target.value)}
          className="w-full border border-slate-300 rounded p-2 text-slate-800 h-20 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={example}
          placeholder="Đặt một câu ví dụ để dễ nhớ ngữ cảnh áp dụng (Không bắt buộc)..." // 👈 Thêm placeholder
          onChange={(e) => setExample(e.target.value)}
          className="w-full border border-slate-300 rounded p-2 text-slate-800 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`font-medium py-2 px-4 rounded transition shadow text-white ${editingVocab ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {editingVocab ? 'Cập nhật ngay' : 'Thêm vào sổ tay'}
        </button>

        {editingVocab && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-slate-500 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded transition shadow"
          >
            Hủy sửa
          </button>
        )}
      </div>
    </form>
  );
}