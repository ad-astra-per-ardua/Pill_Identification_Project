import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDrug } from '../api';
import { HistoryContext } from '../contexts/HistoryContext';

export default function InputPage() {
  const [disease, setDisease] = useState('');
  const [hospital, setHospital] = useState('');
  const [drug, setDrug] = useState('');
  const navigate = useNavigate();
  const { addDrug } = useContext(HistoryContext);

  const handleSubmit = async () => {
    const items = await searchDrug(drug);
    if (items.length) {
      const first = items[0];
      addDrug(first); // 히스토리에 임시 저장
      navigate(`/detail/${first.itemSeq}`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">처방전 없이도 복약을 시작할 수 있어요!</h1>
      <div>
        <label>질병</label>
        <input value={disease} onChange={e=>setDisease(e.target.value)} placeholder="질병 입력" />
      </div>
      <div>
        <label>병원</label>
        <input value={hospital} onChange={e=>setHospital(e.target.value)} placeholder="병원 입력" />
      </div>
      <div>
        <label>약</label>
        <input value={drug} onChange={e=>setDrug(e.target.value)} placeholder="약 입력" />
      </div>
      <button onClick={handleSubmit} className="bg-orange-500 text-white px-4 py-2 rounded">저장</button>
    </div>
  );
}
