import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function DrugSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handleSearch = async () => {
    const res = await axios.get('/api/search', { params: { name: query } });
    setResults(res.data);
    setSelectedIdx(0);
  };

  return (
    <div>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="약이름 입력" />
      <button onClick={handleSearch}>검색</button>

      {results.length>0 && (
        <div>
          <Swiper onSlideChange={({activeIndex})=>setSelectedIdx(activeIndex)}>
            {results.map((d,i)=><SwiperSlide key={i}><img src={d.img} alt={d.name} /></SwiperSlide>)}
          </Swiper>
          <div>
            <h2>{results[selectedIdx].name}</h2>
            <p>성분: {results[selectedIdx].ingr}</p>
            <p>코드: {results[selectedIdx].itemSeq}</p>
          </div>
        </div>
      )}
    </div>
  );
}