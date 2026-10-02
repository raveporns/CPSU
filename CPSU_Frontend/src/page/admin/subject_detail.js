import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";
import "../../css/admin/subject.css";

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= Load Data ================= */

  useEffect(() => {
    const fetchSubjectDetail = async () => {
      try {
        const res = await api.get(`/admin/subject/${id}`);
        setSubject(res.data);
      } catch (err) {
        setError("ไม่พบข้อมูลรายวิชา หรือเกิดข้อผิดพลาดในการดึงข้อมูล");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectDetail();
  }, [id]);

  /* ================= Delete ================= */

  const handleDelete = async () => {
    if (!subject) return;

    const confirmDelete = window.confirm(
      `คุณต้องการลบรายวิชา ${subject.subject_id} ใช่หรือไม่?`,
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/subject/${id}`);
      alert("ลบรายวิชาสำเร็จ");
      navigate("/admin/subject");
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบรายวิชา");
      console.error(err);
    }
  };

  /* ================= Loading ================= */

  if (loading) {
    return (
      <AdminLayout>
        <div className="container-fluid text-center mt-5">
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container-fluid mt-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  if (!subject) {
    return (
      <AdminLayout>
        <div className="container-fluid mt-4">
          <p>ไม่พบข้อมูลรายวิชา</p>
        </div>
      </AdminLayout>
    );
  }

  /* ================= Render ================= */

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="card shadow-sm">
          <div className="card-body">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0 fw-bold">
                <Link
                  to={`/admin/subject/`}
                  className="  mb-4 back-button"
                  id="btn-back-to-course"
                >
                  &lt; กลับ
                </Link>
                {subject.subject_id} {subject.thai_subject}
              </h4>

              <div className="d-flex justify-content-end gap-2 mb-3">
                <Link
                  to={`/admin/editsubject/${subject.id}`}
                  className="btn-warning"
                  id="btn-edit-subject"
                >
                  แก้ไข
                </Link>

                <button
                  className="btn-danger"
                  id="btn-delete-subject"
                  onClick={handleDelete}
                >
                  ลบ
                </button>
              </div>
            </div>

            <hr />

            {/* Detail */}
            <div className="text-start">
              <p>
                <strong>หลักสูตร :</strong> {subject.thai_course}
              </p>

              <p>
                <strong>ภาคการศึกษา :</strong> {subject.semester}
              </p>

              <p>
                <strong>หน่วยกิต :</strong> {subject.credits}
              </p>

              <p>
                <strong>วิชาบังคับ :</strong>{" "}
                {subject.compulsory_subject || "-"}
              </p>

              <p>
                <strong>เงื่อนไข :</strong> {subject.condition || "-"}
              </p>

              <hr />

              <h6 className="fw-bold">คำอธิบายรายวิชา (ภาษาไทย)</h6>
              <p>{subject.description_thai || "-"}</p>

              <h6 className="fw-bold mt-3">Course Description (English)</h6>
              <p>{subject.description_eng || "-"}</p>

              <hr />

              <h6 className="fw-bold">CLOs</h6>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  backgroundColor: "#f8f9fa",
                  padding: "15px",
                  borderRadius: "6px",
                }}
              >
                {subject.clo || "-"}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubjectDetail;
