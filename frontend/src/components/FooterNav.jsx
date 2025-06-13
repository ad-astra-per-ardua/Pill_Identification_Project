import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function FooterNav() {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname === path ? "text-orange-500 font-bold" : "text-gray-500";

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t flex justify-around py-2 text-sm">
      <Link to="/input" className={isActive("/input")}>입력</Link>
      <Link to="/history" className={isActive("/history")}>내역</Link>
    </nav>
  );
}