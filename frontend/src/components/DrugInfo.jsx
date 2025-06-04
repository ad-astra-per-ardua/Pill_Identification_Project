import React from "react";

const DrugInfo = ({ data }) => {
  const drugs = Array.isArray(data) ? data : [data];

  return (
    <div className="space-y-4">
      {drugs.map((drug, index) => (
        <div key={index} className="bg-white p-4 rounded shadow">
          <img src="/pill-result-placeholder.png" alt="pill" className="rounded w-full mb-4" />
          <h2 className="font-bold text-lg">약물 판독 결과</h2>
          <p className="mt-2">{drug.name} ({drug.ingredient})</p>
          <p><strong>효능:</strong> {drug.function}</p>
          <p><strong>복용법:</strong> {drug.dosage}</p>
          <p><strong>부작용:</strong> {drug.side_effects}</p>
          <p><strong>제약사:</strong> {drug.manufacturer}</p>

          <div className="flex mt-4 justify-around">
            <button className="bg-gray-300 px-4 py-2 rounded">확인</button>
            <button className="bg-blue-400 text-white px-4 py-2 rounded">상담 예약</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DrugInfo;