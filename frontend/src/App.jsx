import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import DrugInfo from "./components/DrugInfo";
import SideMenu from "./components/SideMenu";

function App() {
  const [drugData, setDrugData] = useState(null);
  const [image, setImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full bg-white p-4 shadow-md flex items-center justify-between">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">☰</button>
        <h1 className="text-xl font-bold">약물 인식 시스템</h1>
        <div className="w-6" />
      </header>

      {menuOpen && <SideMenu />}

      <main className="w-full max-w-md p-4">
        <UploadForm image={image} setImage={setImage} setDrugData={setDrugData} />

        <section className="my-4">
          <div className="bg-green-200 p-4 text-center rounded">Banner</div>
        </section>

        {drugData && <DrugInfo data={drugData} />}
      </main>

      <footer className="w-full bg-white shadow-inner p-2 flex justify-around text-gray-700">
        <button>📍</button>
        <button>⭐</button>
        <button>📷</button>
        <button>⚙️</button>
      </footer>
    </div>
  );
}

export default App;
