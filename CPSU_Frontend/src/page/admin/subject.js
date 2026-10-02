import React, { useEffect, useState } from "react";
import "../../css/admin/subject.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

function Subject() {
  const [subject, setSubject] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  /* ================= Load Data ================= */

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await api.get("/admin/subject");

        const filtered = res.data.filter((item) => {
          const sid = item.subject_id?.trim();
          const name = item.thai_subject?.trim();

          return (
            sid !== "------" &&
            name !== "วิชาเลือกเสรี" &&
            name !== "วิชาเลือกในหมวดวิชาเฉพาะ" &&
            sid !== "SUxxx" &&
            sid !== "SUXXX"
          );
        });

        setSubject(filtered);
      } catch (err) {
        console.error("Error fetching subject", err);
      }
    };

    fetchSubject();
  }, []);

  /* ================= Search ================= */

  const filteredSubjects = subject.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.subject_id.toLowerCase().includes(term) ||
      item.thai_subject.toLowerCase().includes(term)
    );
  });

  /* ================= Group By Course ================= */

  const groupedByCourse = subject.reduce((acc, item) => {
    const courseId = item.course_id;

    if (!acc[courseId]) {
      acc[courseId] = [];
    }

    acc[courseId].push(item);
    return acc;
  }, {});

  /* ================= Navigate ================= */

  const handleSelect = (id) => {
    setShowDropdown(false);
    setSearchTerm("");
    navigate(`/admin/subject/${id}`);
  };

  /* ================= Render ================= */

  return (
    <AdminLayout>
      <div className="container-fluid">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>รายวิชาทั้งหมด</h3>
          <Link to="/admin/addsubject" className="btn-addcourse">
            + เพิ่มรายวิชาใหม่
          </Link>
        </div>

        {/* Search */}
        <div className="mb-4 position-relative" style={{ maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="ค้นหารหัสวิชา หรือ ชื่อวิชา..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onFocus={() => {
              if (searchTerm.length > 0) setShowDropdown(true);
            }}
            className="form-control"
          />

          {showDropdown && searchTerm && (
            <ul className="dropdown-menu show w-100">
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="dropdown-item"
                      onMouseDown={() => handleSelect(item.id)}
                    >
                      {item.subject_id} - {item.thai_subject}
                    </button>
                  </li>
                ))
              ) : (
                <li className="dropdown-item disabled">
                  ไม่พบผลลัพธ์
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Table */}
        {Object.keys(groupedByCourse).map((courseId) => (
          <div key={courseId} className="mb-4">
            <h6 className="fw-bold mb-3">หลักสูตร {courseId}</h6>

            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "15%" }}>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th style={{ width: "15%" }}>หน่วยกิต</th>
                  </tr>
                </thead>

                <tbody>
                  {groupedByCourse[courseId].map((subj) => (
                    <tr key={subj.id}>
                      <td>
                        <Link to={`/admin/subject/${subj.id}`}>
                          {subj.subject_id}
                        </Link>
                      </td>
                      <td>{subj.thai_subject}</td>
                      <td>{subj.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

      </div>
    </AdminLayout>
  );
}

export default Subject;
