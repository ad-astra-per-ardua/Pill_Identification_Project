import React from "react";
import { uploadImage } from "../api";

const ImagePreview = ({ image }) => {
  return (
    <img src={URL.createObjectURL(image)} alt="preview" className="mb-2 rounded shadow" />
  );
};

const UploadForm = ({ image, setImage, setDrugData }) => {
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    try {
      const data = await uploadImage(image);
      setDrugData(data);
    } catch (err) {
      alert("약물 정보를 불러올 수 없습니다.");
    }
  };

  return (
    <div className="my-4">
      <input type="file" accept="image/*" capture="environment" onChange={handleChange} className="mb-2" />
      {image && <ImagePreview image={image} />}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">약물 분석</button>
    </div>
  );
};

export default UploadForm;