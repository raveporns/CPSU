import React, { useEffect, useState } from "react";
import "../../css/admin/course.css";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

const Admission = () => {
  const [admission, setAdmission] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/admin/admission")
      .then((res) => {
        setAdmission(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("ไม่สามารถโหลดข้อมูลการรับสมัครได้");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบข้อมูลรอบนี้ใช่หรือไม่?")) return;

    try {
      await api.delete(`/admin/admission/${id}`);
      setAdmission((prev) => prev.filter((item) => item.admission_id !== id));
    } catch (error) {
      console.error(error);
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 >
          การรับสมัคร
        </h3>
        <Link to="/admin/admission/add" className="btn-addcourse">
          เพิ่มข้อมูล
        </Link>
      </div>

      {loading && <p>กำลังโหลดข้อมูลการรับสมัคร...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && admission.length === 0 && (
        <p>ยังไม่มีข้อมูลการรับสมัคร</p>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          {admission.map((item) => (
            <div key={item.admission_id} className="mb-5 border-bottom pb-4">
              <h2>{item.round}</h2>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-0">{item.title}</h4>
                <div className="action-buttons">
                  <Link
                    to={`/admin/admission/edit/${item.admission_id}`}
                    className="btn-edit"
                  >
                    แก้ไข
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item.admission_id)}
                  >
                    ลบ
                  </button>
                </div>
              </div>

              <div
                className="d-flex align-items-start"
                style={{ gap: "20px", marginTop: "15px", flexWrap: "wrap" }}
              >
                {item.file_image && (
                  <div style={{ flex: "0 0 auto" }}>
                    <img
                      src={item.file_image}
                      alt={item.title || item.round}
                      style={{
                        maxWidth: "500px",
                        width: "100%",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                )}

                <div style={{ flex: "1 1 0", minWidth: "200px" }}>
                  <div
                    className="admission-detail"
                    dangerouslySetInnerHTML={{ __html: item.detail }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admission;
