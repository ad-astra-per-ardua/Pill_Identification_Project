import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDrug } from '../api';
import { HistoryContext } from '../contexts/HistoryContext';

export default function InputPage() {
  const [drug, setDrug] = useState('');
  const navigate = useNavigate();
  const { addDrug } = useContext(HistoryContext);

  const handleSubmit = async () => {
    if (!drug.trim()) return;
    const items = await searchDrug(drug);
    if (items.length > 0) {
      const first = items[0];
      addDrug(first);
      navigate(`/detail/${first.itemSeq}`);
    } else {
      alert('검색 결과가 없습니다.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">복용할 약을 검색하세요</h1>
      <div>
        <label>약 이름</label>
        <input
          value={drug}
          onChange={e => setDrug(e.target.value)}
          placeholder="예: 아스피린"
          className="border px-2 py-1 w-full"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        검색
      </button>
    </div>
  );
}
