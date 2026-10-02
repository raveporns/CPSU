import React, { useState } from "react";
import "../../css/admin/course_add.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";

const AddCourse = () => {
  const [structureFile, setStructureFile] = useState(null);
  const [roadmapFile, setRoadmapFile] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    course_id: "",
    degree: "",
    major: "",
    year: "",
    thai_course: "",
    eng_course: "",
    thai_degree: "",
    eng_degree: "",
    admission_req: "",
    graduation_req: "",
    philosophy: "",
    objective: "",
    tuition: "",
    credits: "",
    career_paths: "",
    plo: "",
    detail_url: "",
    status: "แสดง",
  });

  const handleFileChange = (e) => {
    const { files } = e.target;
    setRoadmapFile(files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.major.trim()) {
      alert("กรุณากรอกสาขาก่อนบันทึก");
      return;
    }

    const payload = {
      ...formData,
      year: Number(formData.year),
    };

    let courseId = null;

    try {
      setLoading(true);

      const courseRes = await api.post("/admin/course", payload);
      courseId = courseRes.data.course_id;

      if (structureFile) {
        const form = new FormData();
        form.append("course_id", courseId);
        form.append("detail", structureFile);

        await api.post("/admin/structure", form);
      }

      if (roadmapFile) {
        const form = new FormData();
        form.append("course_id", courseId);
        form.append("roadmap_url", roadmapFile);

        await api.post("/admin/roadmap", form);
      }

      alert("บันทึกข้อมูลหลักสูตรสำเร็จ");
      navigate("/admin/course");
    } catch (err) {
      console.error(err);

      if (courseId) {
        try {
          await api.delete(`/admin/course/${courseId}`);
        } catch (deleteErr) {
          console.error("Rollback failed:", deleteErr);
        }
      }

      alert("เกิดข้อผิดพลาด ระบบได้ยกเลิกการบันทึกแล้ว");
    } finally {
      setLoading(false);
    }
  };

  const handleStructureFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("กรุณาอัปโหลดไฟล์ Excel (.xlsx หรือ .xls)");
      e.target.value = "";
      return;
    }

    setStructureFile(file);
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">เพิ่มหลักสูตร</h3>

        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Status */}
              <div className="mb-3">
                <label className="form-label">
                  สถานะ <span className="text-danger">*</span>
                </label>
                <select
                  required
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="แสดง">แสดง</option>
                  <option value="ไม่แสดง">ไม่แสดง</option>
                </select>
              </div>

              {/* Course ID */}
              <div className="mb-3">
                <label className="form-label">
                  รหัสหลักสูตร <span className="text-danger">*</span>
                </label>
                <input
                  className="form-control"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Degree */}
              <div className="mb-3">
                <label className="form-label">
                  ระดับปริญญา <span className="text-danger">*</span>
                </label>
                <select
                  required
                  className="form-control"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                >
                  <option value="">-- เลือกระดับปริญญา --</option>
                  <option value="ปริญญาตรี">ปริญญาตรี</option>
                  <option value="ปริญญาโท">ปริญญาโท</option>
                  <option value="ปริญญาเอก">ปริญญาเอก</option>
                </select>
              </div>

              {/* Year */}
              <div className="mb-3">
                <label className="form-label">
                  หลักสูตรของปี <span className="text-danger">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  name="year"
                  type="number"
                  min="1"
                  value={formData.year}
                  onChange={handleChange}
                />
              </div>

              {/* Major */}
              <div className="mb-3">
                <label className="form-label">
                  สาขา <span className="text-danger">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                />
              </div>

              {/* Course Name */}
              <div className="mb-3">
                <label className="form-label">
                  ชื่อหลักสูตร (ไทย) <span className="text-danger">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  name="thai_course"
                  value={formData.thai_course}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  ชื่อหลักสูตร (อังกฤษ) <span className="text-danger">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  name="eng_course"
                  value={formData.eng_course}
                  onChange={handleChange}
                />
              </div>

              {/* Degree Name */}
              <div className="mb-3">
                <label className="form-label">
                  ชื่อปริญญา (ไทย) <span className="text-danger">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  name="thai_degree"
                  value={formData.thai_degree}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  ชื่อปริญญา (อังกฤษ) <span className="text-danger">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  name="eng_degree"
                  value={formData.eng_degree}
                  onChange={handleChange}
                />
              </div>

              {/* Admission */}
              <div className="mb-3">
                <label className="form-label">เกณฑ์การเข้าศึกษา</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="admission_req"
                  value={formData.admission_req}
                  onChange={handleChange}
                />
              </div>

              {/* Graduation */}
              <div className="mb-3">
                <label className="form-label">เกณฑ์สำเร็จการศึกษา</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="graduation_req"
                  value={formData.graduation_req}
                  onChange={handleChange}
                />
              </div>

              {/* Philosophy */}
              <div className="mb-3">
                <label className="form-label">ปรัชญาของหลักสูตร</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="philosophy"
                  value={formData.philosophy}
                  onChange={handleChange}
                />
              </div>

              {/* Objective */}
              <div className="mb-3">
                <label className="form-label">วัตถุประสงค์ของหลักสูตร</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="objective"
                  value={formData.objective}
                  onChange={handleChange}
                />
              </div>

              {/* PLO */}
              <div className="mb-3">
                <label className="form-label">
                  PLOs <span className="text-danger">*</span>
                </label>
                <textarea
                  required
                  className="form-control"
                  rows="4"
                  name="plo"
                  value={formData.plo}
                  onChange={handleChange}
                />
              </div>

              {/* Career */}
              <div className="mb-3">
                <label className="form-label">อาชีพที่ประกอบได้</label>
                <textarea
                  className="form-control"
                  rows="4"
                  name="career_paths"
                  value={formData.career_paths}
                  onChange={handleChange}
                />
              </div>

              {/* Tuition */}
              <div className="mb-3">
                <label className="form-label">ค่าใช้จ่าย</label>
                <input
                  className="form-control"
                  name="tuition"
                  value={formData.tuition}
                  onChange={handleChange}
                />
              </div>

              {/* Credits */}
              <div className="mb-3">
                <label className="form-label">หน่วยกิต</label>
                <input
                  className="form-control"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                />
              </div>

              {/* Detail URL */}
              <div className="mb-3">
                <label className="form-label">รายละเอียดเพิ่มเติม</label>
                <input
                  className="form-control"
                  name="detail_url"
                  value={formData.detail_url}
                  onChange={handleChange}
                />
              </div>

              {/* Structure */}
              <div className="mb-4">
                <label className="form-label">โครงสร้างหลักสูตร (Excel)</label>

                <input
                  type="file"
                  className="form-control"
                  accept=".xlsx,.xls"
                  onChange={handleStructureFileChange}
                />
                {structureFile && (
                  <p className="text-success text-start mt-2">
                    ไฟล์ที่เลือก : {structureFile.name}
                  </p>
                )}

                <a
                  href="/structure_template.xlsx"
                  download
                  className="form-label ms-1"
                >
                  <p className="text-start">ดาวน์โหลด Template Excel</p>
                </a>
              </div>

              {/* Roadmap */}
              <div className="mb-4">
                <label className="form-label">แผนการศึกษา</label>
                <input
                  type="file"
                  className="form-control"
                  name="roadmap"
                  onChange={handleFileChange}
                />
              </div>

              <div className="d-flex justify-content-center gap-2 mt-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/course")}
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddCourse;
