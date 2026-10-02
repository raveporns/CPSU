import React from "react";
import "../css/menu.css";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || user?.roles?.[0];

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "fas fa-chart-line" },
    { path: "/admin/news", label: "ข่าวสาร", icon: "fas fa-newspaper" },
    { path: "/admin/personnel", label: "บุคลากร", icon: "fas fa-user-tie" },
    {
      path: "/admin/research",
      label: "ผลงานวิจัย",
      icon: "fas fa-file-alt",
    },
    { path: "/admin/course", label: "หลักสูตร", icon: "fas fa-book-open" },
    { path: "/admin/subject", label: "รายวิชา", icon: "fas fa-book" },
    {
      path: "/admin/calendar",
      label: "ปฏิทินกิจกรรม",
      icon: "fas fa-calendar-alt",
    },
    {
      path: "/admin/admission",
      label: "ข่าวการรับสมัคร",
      icon: "fas fa-bullhorn",
    },

    {
      path: "/admin/document",
      label: "เอกสาร",
      icon: "fas fa-file",
    },

    ...(role === "rootadmin"
      ? [
          {
            path: "/admin/userpermissions",
            label: "กำหนดสิทธิ์ผู้ใช้",
            icon: "fas fa-user-shield",
          },
          {
            path: "/admin/history",
            label: "ประวัติการเข้าใช้งาน",
            icon: "fas fa-clock-rotate-left",
          },
        ]
      : []),
    // {
    //   path: "/admin/manual",
    //   label: "คู่มือการใช้งาน",
    //   icon: "fas fa-circle-question",
    // },
  ];

  return (
    <ul className="list-group">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`list-group-item ${
            currentPath === item.path ? "active" : ""
          }`}
          id="btn-menu"
        >
          <i className={`${item.icon} me-2`} />
          {item.label}
        </Link>
      ))}
    </ul>
  );
};

export default Menu;
