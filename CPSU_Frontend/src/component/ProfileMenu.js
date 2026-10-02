import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const navigate = useNavigate();

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  const user = JSON.parse(userStr);
  const roles = Array.isArray(user.roles) ? user.roles : [];

  const roleLabel = () => {
    if (roles.includes("admin")) return "แอดมิน";
    if (roles.includes("teacher")) return "อาจารย์";
    if (roles.includes("rootadmin")) return "แอดมินสูงสุด";
    return "ผู้ใช้";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex align-items-center gap-3 text-white">
      {/* ชื่อ + role */}
      <span>
        {user.username} <small>({roleLabel()})</small>
      </span>

      {/* ปุ่ม Logout */}
      <button
        onClick={handleLogout}
        className="btn btn-outline-light btn-sm d-flex align-items-center"
        title="ออกจากระบบ"
      >
        <i className="fas fa-door-open"></i>
      </button>
    </div>
  );
};

export default ProfileMenu;
