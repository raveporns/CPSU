import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";
import "../../css/admin/personnel.css";

function PersonnelAdd() {
  const navigate = useNavigate();

  const academicPositions = [
    { id: 1, thai: "ศ.ดร", eng: "Prof.Dr." },
    { id: 2, thai: "ศ.", eng: "Prof." },
    { id: 3, thai: "รศ.ดร.", eng: "Assoc.Prof.Dr." },
    { id: 4, thai: "รศ.", eng: "Assoc.Prof." },
    { id: 5, thai: "ผศ.ดร.", eng: "Asst.Prof.Dr." },
    { id: 6, thai: "ผศ.", eng: "Asst.Prof." },
    { id: 7, thai: "อ.ดร.", eng: "Dr." },
    { id: 8, thai: "ดร.", eng: "Dr." },
    { id: 9, thai: "อ.", eng: "" },
  ];

  const [formData, setFormData] = useState({
    type_personnel: "",
    department_position_id: "",
    department_position_name: "",
    academic_position_id: "",
    thai_academic_position: "",
    eng_academic_position: "",
    thai_name: "",
    eng_name: "",
    education: "",
    related_fields: "",
    email: "",
    website: "",
    scopus_id: "",
    file_image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departmentPositions, setDepartmentPositions] = useState([]);

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await api.get("/admin/personnel");
        setDepartmentPositions(res.data);
      } catch (err) {
        console.error("โหลดตำแหน่งไม่สำเร็จ", err);
      }
    };

    fetchPositions();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "type_personnel") {
      if (value === "สายสนับสนุนวิชาการ") {
        setFormData((prev) => ({
          ...prev,
          type_personnel: value,
          academic_position_id: "",
          thai_academic_position: "",
          eng_academic_position: "",
          education: "",
          related_fields: "",
          website: "",
          scopus_id: "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          type_personnel: value,
        }));
      }

      setPreviewImage(null);
      setError("");
      return;
    }

    if (name === "academic_position_id") {
      const selected = academicPositions.find((p) => p.id === Number(value));

      setFormData((prev) => ({
        ...prev,
        academic_position_id: Number(value),
        thai_academic_position: selected?.thai || "",
        eng_academic_position: selected?.eng || "",
      }));
      return;
    }

    if (name === "department_position_name") {
      const found = departmentPositions.find(
        (p) =>
          p.department_position_name?.trim().toLowerCase() ===
          value.trim().toLowerCase(),
      );

      setFormData((prev) => ({
        ...prev,
        department_position_name: value,
        department_position_id: found ? found.department_position_id : "",
      }));

      return;
    }

    if (name === "file_image") {
      const file = files?.[0];

      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }

      setFormData((prev) => ({
        ...prev,
        file_image: file || null,
      }));

      setPreviewImage(file ? URL.createObjectURL(file) : null);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.type_personnel) {
      setError("กรุณาเลือกประเภทบุคลากร");
      return;
    }

    if (
      formData.type_personnel === "สายวิชาการ" &&
      !formData.academic_position_id
    ) {
      setError("กรุณาเลือกตำแหน่งวิชาการ");
      return;
    }

    if (!formData.file_image) {
      setError("กรุณาอัปโหลดรูปภาพบุคลากร");
      return;
    }

    const data = new FormData();

    data.append("type_personnel", formData.type_personnel);

    data.append("department_position_id", formData.department_position_id);

    data.append("department_position_name", formData.department_position_name);

    data.append("thai_name", formData.thai_name);
    data.append("eng_name", formData.eng_name);
    data.append("email", formData.email);

    if (formData.type_personnel === "สายวิชาการ") {
      data.append("academic_position_id", formData.academic_position_id || "");

      data.append("education", formData.education || "");
      data.append("related_fields", formData.related_fields || "");
      data.append("website", formData.website || "");
      data.append("scopus_id", formData.scopus_id || "");
    } else {
      data.append("academic_position_id", "");
    }

    if (formData.file_image) {
      data.append("file_image", formData.file_image);
    }

    try {
      setLoading(true);

      await api.post("/admin/personnel", data);

      alert("บันทึกข้อมูลบุคลากรสำเร็จ!");
      navigate("/admin/personnel");
    } catch (err) {
      console.error(err.response?.data || err);
      setError("เกิดข้อผิดพลาดในการเพิ่มบุคลากร");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="mb-4">
          <h4>เพิ่มบุคลากร</h4>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">
                  ประเภทบุคลากร <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  name="type_personnel"
                  value={formData.type_personnel}
                  onChange={handleChange}
                  required
                >
                  <option value="">เลือกประเภท</option>
                  <option value="สายวิชาการ">สายวิชาการ</option>
                  <option value="สายสนับสนุนวิชาการ">สายสนับสนุนวิชาการ</option>
                </select>
              </div>

              <div className="mb-4 text-start">
                <label className="form-label">
                  ตำแหน่งในภาควิชา <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="department_position_name"
                  list="departmentPositionList"
                  value={formData.department_position_name}
                  onChange={handleChange}
                  required
                  disabled={!formData.type_personnel}
                />

                <datalist id="departmentPositionList">
                  {[
                    ...new Set(
                      departmentPositions.map((pos) =>
                        pos.department_position_name.trim(),
                      ),
                    ),
                  ].map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              {formData.type_personnel === "สายวิชาการ" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">
                      ตำแหน่งวิชาการ <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="academic_position_id"
                      value={formData.academic_position_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">เลือกตำแหน่ง</option>
                      {academicPositions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.thai} {p.eng && `(${p.eng})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        คำนำหน้าทางวิชาการ (TH)
                      </label>
                      <input
                        className="form-control"
                        value={formData.thai_academic_position}
                        readOnly
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Academic Title (EN)</label>
                      <input
                        className="form-control"
                        value={formData.eng_academic_position}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        ชื่อ-นามสกุล (TH) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="thai_name"
                        value={formData.thai_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Name (EN) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="eng_name"
                        value={formData.eng_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">ประวัติการศึกษา</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">สาขาที่เชี่ยวชาญ</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      name="related_fields"
                      value={formData.related_fields}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">เว็บไซต์ส่วนตัว</label>
                      <input
                        type="text"
                        className="form-control"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label">Scopus ID</label>
                      <input
                        type="text"
                        className="form-control"
                        name="scopus_id"
                        value={formData.scopus_id}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <ImageUploadPreview
                    previewImage={previewImage}
                    handleChange={handleChange}
                  />
                </>
              )}

              {formData.type_personnel === "สายสนับสนุนวิชาการ" && (
                <>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        ชื่อ-นามสกุล (TH) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="thai_name"
                        value={formData.thai_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Name (EN) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="eng_name"
                        value={formData.eng_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <ImageUploadPreview
                    previewImage={previewImage}
                    handleChange={handleChange}
                  />
                </>
              )}

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/personnel")}
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
}

function ImageUploadPreview({ previewImage, handleChange }) {
  return (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label className="form-label">
          อัปโหลดรูปภาพ <span className="text-danger">*</span>
        </label>
        <input
          type="file"
          className="form-control"
          name="file_image"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <div className="col-md-6 mb-3 text-center">
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="img-fluid rounded shadow"
            style={{ maxHeight: "200px" }}
          />
        )}
      </div>
    </div>
  );
}

export default PersonnelAdd;
