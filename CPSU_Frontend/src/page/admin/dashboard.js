import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import "../../css/admin/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = user?.role || user?.roles?.[0];

  const isAuthorized = ["admin", "rootadmin"].includes(role);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/unauthorized", { replace: true });
    }
  }, [isAuthorized, navigate]);

  if (!isAuthorized) return null;

  const menuItems = [
    {
      path: "/admin/news",
      label: "ข่าวสาร",
      icon: "fas fa-newspaper",
      color: "primary",
    },
    {
      path: "/admin/personnel",
      label: "บุคลากร",
      icon: "fas fa-user-tie",
      color: "warning",
    },
    {
      path: "/admin/research",
      label: "ผลงานวิจัย",
      icon: "fas fa-file-alt",
      color: "success",
    },
    {
      path: "/admin/course",
      label: "หลักสูตร",
      icon: "fas fa-book-open",
      color: "info",
    },
    {
      path: "/admin/subject",
      label: "รายวิชา",
      icon: "fas fa-book",
      color: "secondary",
    },
    {
      path: "/admin/calendar",
      label: "ปฏิทินกิจกรรม",
      icon: "fas fa-calendar-alt",
      color: "dark",
    },
    {
      path: "/admin/admission",
      label: "การรับสมัคร",
      icon: "fas fa-bullhorn",
      color: "danger",
    },
     {
      path: "/admin/document",
      label: "เอกสาร",
      icon: "fas fa-file",
      color: "orange",
    },

    ...(role === "rootadmin"
      ? [
          {
            path: "/admin/userpermissions",
            label: "กำหนดสิทธิ์ผู้ใช้",
            icon: "fas fa-user-shield",
            color: "purple",
          },
          {
            path: "/admin/history",
            label: "ประวัติการเข้าใช้งาน",
            icon: "fas fa-clock-rotate-left",
            color: "teal",
          },
        ]
      : []),
  ];

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h2 className="mb-4">Dashboard</h2>

        <div className="row">
          {menuItems.map((item) => (
            <div className="col-md-3 mb-3" key={item.path}>
              <Link to={item.path} style={{ textDecoration: "none" }}>
                <div
                  className={`card text-white bg-${item.color} shadow-sm h-100`}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card-body text-center">
                    <i
                      className={`${item.icon} mb-3`}
                      style={{ fontSize: "40px" }}
                    ></i>
                    <h6>{item.label}</h6>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;