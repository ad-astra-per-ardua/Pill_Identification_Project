import React from "react";
import { motion } from "framer-motion";

const SideMenu = ({ setMenuOpen }) => {
  return (
    <motion.aside
      className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-10 p-4"
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex justify-between mb-4 text-center">
        <div className="bg-gray-300 rounded-full w-16 h-16 mx-auto mb-2" />
        <p className="font-bold">약물 찾기</p>
        <button
          onClick={() => setMenuOpen(false)}
          className="text-xl font-bold text-gray-700 hover:text-red-500"
        >
          X
        </button>
      </div>

      <ul className="text-sm text-gray-600 space-y-1">
        <li>성분별</li>
        <li>제약회사별</li>
        <li>증상 입력별</li>
        <li>부작용별</li>
      </ul>

      <div className="border-t pt-4">
        <p className="font-bold mb-2">주변약국 찾기</p>
        <div className="flex gap-4 justify-center text-2xl">
          <span>G</span><span>💬</span><span>@</span>
        </div>
      </div>
    </motion.aside>
  );
};

export default SideMenu;
