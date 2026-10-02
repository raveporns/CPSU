import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import "../../css/admin/subject.css";

const SubjectAdd = () => {
  const navigate = useNavigate();
  const [courseOptions, setCourseOptions] = useState([]);

  const [formData, setFormData] = useState({
    subject_id: "",
    thai_subject: "",
    eng_subject: "",
    credits: "",
    semester: "",
    compulsory_subject: "",
    condition: "",
    description_thai: "",
    description_eng: "",
    clo: "",
    course_id: "",
    plan_type: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= Load Course ================= */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/admin/course");
        setCourseOptions(response.data);
      } catch (error) {
        console.error("Error loading courses", error);
      }
    };

    fetchCourses();
  }, []);

  /* ================= Handle Change ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= Submit ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const cleanData = {
        subject_id: formData.subject_id,
        thai_subject: formData.thai_subject,
        eng_subject: formData.eng_subject,
        credits: formData.credits,
        course_id: formData.course_id,
        semester: formData.semester,
        compulsory_subject:
          formData.compulsory_subject.trim() === ""
            ? "-"
            : formData.compulsory_subject,
        condition: formData.condition.trim() === "" ? "-" : formData.condition,
        description_thai: formData.description_thai,
        description_eng: formData.description_eng,
        clo: formData.clo.trim() === "" ? "-" : formData.clo,
        plan_type: formData.plan_type,
      };

      await api.post("/admin/subject", cleanData);

      setSuccess("เพิ่มรายวิชาสำเร็จ!");

      setFormData({
        subject_id: "",
        thai_subject: "",
        eng_subject: "",
        credits: "",
        semester: "",
        compulsory_subject: "",
        condition: "",
        description_thai: "",
        description_eng: "",
        clo: "",
        course_id: "",
        plan_type: "",
      });

      alert("เพิ่มรายวิชาสำเร็จ");
      navigate("/admin/subject");
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเพิ่มรายวิชา");
    }
  };

  /* ================= Render ================= */

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="mb-4">เพิ่มรายวิชาใหม่</h4>

            <form onSubmit={handleSubmit}>
              {/* หลักสูตร */}
              <div className="mb-3">
                <label>หลักสูตร (Course) <span className="text-danger">*</span></label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">-- เลือกหลักสูตร --</option>
                  {courseOptions.map((course) => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.thai_course}
                    </option>
                  ))}
                </select>
              </div>

              {/* รหัสวิชา */}
              <div className="mb-3">
                <label>รหัสรายวิชา <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="subject_id"
                  value={formData.subject_id}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="เช่น XXXXXX , SUXXX"
                />
              </div>

              {/* ชื่อไทย */}
              <div className="mb-3">
                <label>ชื่อรายวิชา (ภาษาไทย) <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="thai_subject"
                  value={formData.thai_subject}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              {/* ชื่ออังกฤษ */}
              <div className="mb-3">
                <label>ชื่อรายวิชา (ภาษาอังกฤษ)</label>
                <input
                  type="text"
                  name="eng_subject"
                  value={formData.eng_subject}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* หน่วยกิต */}
              <div className="mb-3">
                <label>หน่วยกิต <span className="text-danger">*</span></label>
                <input
                  type="text"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  className="form-control"
                  required
                  placeholder="เช่น X , X(X-X-X)"
                />
              </div>

              {/* ภาคการศึกษา */}
              <div className="mb-3">
                <label>ชั้นปีและภาคการศึกษา <span className="text-danger">*</span></label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">-- เลือกภาคการศึกษา --</option>

                  <option value="ปีที่ 1 ภาคการศึกษาที่ 1">ปี 1 เทอม 1</option>
                  <option value="ปีที่ 1 ภาคการศึกษาที่ 2">ปี 1 เทอม 2</option>

                  <option value="ปีที่ 2 ภาคการศึกษาที่ 1">ปี 2 เทอม 1</option>
                  <option value="ปีที่ 2 ภาคการศึกษาที่ 2">ปี 2 เทอม 2</option>

                  <option value="ปีที่ 3 ภาคการศึกษาที่ 1">ปี 3 เทอม 1</option>
                  <option value="ปีที่ 3 ภาคการศึกษาที่ 2">ปี 3 เทอม 2</option>

                  <option value="ปีที่ 4 ภาคการศึกษาที่ 1">ปี 4 เทอม 1</option>
                  <option value="ปีที่ 4 ภาคการศึกษาที่ 2">ปี 4 เทอม 2</option>
                </select>
              </div>

              {/* แผนการศึกษา */}
              <div className="mb-3">
                <label>แผนการศึกษา <span className="text-danger">*</span></label>
                <select
                  name="plan_type"
                  value={formData.plan_type}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">-- เลือกแผนการศึกษา --</option>
                  <option value="โครงงานวิจัย">โครงงานวิจัย</option>
                  <option value="สหกิจศึกษา">สหกิจศึกษา</option>
                </select>
              </div>

              {/* อื่น ๆ */}
              <div className="mb-3">
                <label>วิชาบังคับ</label>
                <input
                  type="text"
                  name="compulsory_subject"
                  value={formData.compulsory_subject}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>เงื่อนไข</label>
                <input
                  type="text"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label>คำอธิบายรายวิชา (TH)</label>
                <textarea
                  name="description_thai"
                  value={formData.description_thai}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                />
              </div>

              <div className="mb-3">
                <label>Course Description (EN)</label>
                <textarea
                  name="description_eng"
                  value={formData.description_eng}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                />
              </div>

              <div className="mb-3">
                <label>CLOs</label>
                <textarea
                  name="clo"
                  value={formData.clo}
                  onChange={handleChange}
                  className="form-control"
                  rows={5}
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <button type="submit" className="btn btn-primary">
                บันทึกรายวิชา
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubjectAdd;
