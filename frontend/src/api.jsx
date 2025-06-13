import axios from "axios";
const BASE_URL = "/api";

export async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axios.post(`${BASE_URL}/recognize`, formData);
  return response.data;
}

export async function searchDrug(name) {
  const res = await axios.get('/api/search', {
    params: { name }
  });
  return res.data;
}

export async function fetchDetail(itemSeq) {
  const res = await axios.get(`${BASE_URL}/detail`, {
    params: { itemSeq }
  });
  return res.data;
}

export async function fetchDUR(itemSeq) {
  const res = await axios.get(`${BASE_URL}/dur`, {
    params: { itemSeq }
  });a
  return res.data;
}
