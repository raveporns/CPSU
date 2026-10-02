import React from "react";
import { useNavigate } from "react-router-dom";
import Headers from "../component/header";
import Navbar from "../component/navbar";
import Footer from "../component/footer";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      
      {/* Header */}
      <Headers />
      <Navbar />

      {/* Content */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center p-4 bg-white shadow rounded-4">

          {/* Icon */}
          <div className="mb-3 d-flex justify-content-center">
            <i
              className="fas fa-lock text-danger"
              style={{ fontSize: "60px" }}
            ></i>
          </div>

          {/* Title */}
          <h2 className="fw-bold text-danger">403</h2>
          <h5 className="mb-3">ไม่มีสิทธิ์เข้าถึงหน้านี้</h5>

          {/* Description */}
          <p className="text-muted mb-4">
            คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
            <br />
            กรุณาติดต่อผู้ดูแลระบบ
          </p>

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/")}
            >
              กลับหน้าแรก
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              ย้อนกลับ
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Unauthorized;