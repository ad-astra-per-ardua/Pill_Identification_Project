import React, { useState } from "react";
import axios from "axios";
import DrugInfo from "./DrugInfo";

const SearchForm = () => {
  const [name, setName] = useState("");
  const [data, setData] = useState(null);

  const onSearch = async () => {
    try {
      const res = await axios.get("/api/search", { params: { name } });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="약 이름 입력"
        className="border p-2 mr-2"
      />
      <button onClick={onSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
        검색
      </button>
      {data && <DrugInfo data={data} />}
    </div>
  );
};

export default SearchForm;
