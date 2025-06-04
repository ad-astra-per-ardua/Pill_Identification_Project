import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(`${BASE_URL}/recognize`, formData);
  return response.data;
}
