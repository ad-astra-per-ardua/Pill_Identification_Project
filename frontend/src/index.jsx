import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import DrugSearch from "./components/DrugSearch";

const container = document.getElementById("root");
const root = createRoot(container);
<DrugSearch />
root.render(<App />);