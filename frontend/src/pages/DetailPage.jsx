import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDetail, fetchDUR } from '../api';
import SlideCarousel from '../components/SlideCarousel';

export default function DetailPage() {
  const { itemSeq } = useParams();
  const [info, setInfo] = useState(null);
  const [dur, setDur] = useState(null);
  const [tab, setTab] = useState('summary');

  useEffect(() => {
    fetchDetail(itemSeq).then(setInfo);
    fetchDUR(itemSeq).then(setDur);
  }, [itemSeq]);

  if (!info) return <div>로딩 중...</div>;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">{info.ITEM_NAME}</h1>
      <SlideCarousel images={info.images} />
      <div className="flex space-x-2 mt-4">
        {['summary','props','indications'].map(t=>(
          <button
            key={t}
            onClick={()=>setTab(t)}
            className={tab===t?'border-b-2 border-orange-500':''}
          >{t==='summary'?'요약설명':t==='props'?'약제특성':'처방질병'}</button>
        ))}
      </div>
      <div className="mt-4">
        {tab==='summary' && <p>{info.summary}</p>}
        {tab==='props' && <p>{info.properties}</p>}
        {tab==='indications' && <p>{info.indications}</p>}
      </div>
      {dur && dur.forbid && (
        <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
          ⚠️ 상호금기: {dur.forbid.join(', ')}
        </div>
      )}
    </div>
  );
}
