import React, { useContext } from 'react';
import { HistoryContext } from '../contexts/HistoryContext';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  const { history } = useContext(HistoryContext);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">복약 내역</h1>
      {history.map((d,i) => (
        <Link key={i} to={`/detail/${d.itemSeq}`} className="block p-2 border-b">
          {d.ITEM_NAME}
        </Link>
      ))}
    </div>
  );
}
