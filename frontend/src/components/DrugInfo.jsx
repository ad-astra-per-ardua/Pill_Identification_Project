import React from "react";

const DrugInfo = ({ data }) => {
  const drugs = Array.isArray(data) ? data : [data];

  return (
    <div className="space-y-4">
      {drugs.map((drug, index) => {
        // 병용금기 표시용 카드 스타일
        const cardClasses = [
          "p-4 rounded shadow",
          drug.isContraindicated
            ? "bg-red-50 border border-red-500"
            : "bg-white"
        ].join(" ");

        return (
          <div key={index} className={cardClasses}>
            <img
              src={drug.img || "/pill-result-placeholder.png"}
              alt="pill"
              className="rounded w-full mb-4"
            />

            <h2 className="font-bold text-lg">약물 판독 결과</h2>

            {/* DUR 배지 */}
            {drug.durTypes && drug.durTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {drug.durTypes.map((type) => (
                  <span
                    key={type}
                    className="border border-red-500 text-red-500 bg-black px-2 py-1 text-xs rounded"
                  >
                    {type}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-2">
              {drug.name}{" "}
              <span className="text-gray-500">({drug.ingr})</span>
            </p>
            <p>
              <strong>효능:</strong> {drug.function}
            </p>
            <p>
              <strong>복용법:</strong> {drug.dosage}
            </p>
            <p>
              <strong>부작용:</strong> {drug.side_effects}
            </p>
            <p>
              <strong>제약사:</strong> {drug.manufacturer}
            </p>

            <div className="flex mt-4 justify-around">
              <button className="bg-gray-300 px-4 py-2 rounded">확인</button>
              <button className="bg-blue-400 text-white px-4 py-2 rounded">
                상담 예약
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DrugInfo;
