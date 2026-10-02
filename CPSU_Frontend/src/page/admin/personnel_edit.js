import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/admin/personnel.css";
import AdminLayout from "../../layout/AdminLayout";

function EditPersonnel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const academicPositions = useMemo(
    () => [
      { id: 1, thai: "ศ.ดร", eng: "Prof.Dr." },
      { id: 2, thai: "ศ.", eng: "Prof." },
      { id: 3, thai: "รศ.ดร.", eng: "Assoc.Prof.Dr." },
      { id: 4, thai: "รศ.", eng: "Assoc.Prof." },
      { id: 5, thai: "ผศ.ดร.", eng: "Asst.Prof.Dr." },
      { id: 6, thai: "ผศ.", eng: "Asst.Prof." },
      { id: 7, thai: "อ.ดร.", eng: "Dr." },
      { id: 8, thai: "ดร.", eng: "Dr." },
      { id: 9, thai: "อ.", eng: "" },
    ],
    [],
  );

  const [formData, setFormData] = useState({
    type_personnel: "",
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
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");
  const [departmentPositions, setDepartmentPositions] = useState([]);

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

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const res = await api.get(`/admin/personnel/${id}`);
        const p = res.data.personnel;

        const academic = academicPositions.find(
          (a) => a.id === p.academic_position_id,
        );

        setFormData({
          type_personnel: p.type_personnel || "",
          department_position_name: p.department_position_name || "",
          academic_position_id: academic ? academic.id : "",
          thai_academic_position: p.thai_academic_position || "",
          eng_academic_position: p.eng_academic_position || "",
          thai_name: p.thai_name || "",
          eng_name: p.eng_name || "",
          education: p.education || "",
          related_fields: p.related_fields || "",
          email: p.email || "",
          website: p.website || "",
          scopus_id: p.scopus_id || "",
          file_image: null,
        });

        if (p.file_image) {
          setPreviewImage(p.file_image);
        }
      } catch {
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, [academicPositions, id]);

  // ===== change =====

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // เปลี่ยนประเภท
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

      return;
    }

    // รูป
    if (name === "file_image") {
      const file = files[0];

      setFormData((prev) => ({
        ...prev,
        file_image: file,
      }));

      setPreviewImage(URL.createObjectURL(file));

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===== submit =====

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("type_personnel", formData.type_personnel);

    data.append("department_position_name", formData.department_position_name);

    data.append("thai_name", formData.thai_name);
    data.append("eng_name", formData.eng_name);
    data.append("email", formData.email);

    if (formData.type_personnel === "สายวิชาการ") {
      data.append("academic_position_id", formData.academic_position_id);

      data.append("education", formData.education);

      data.append("related_fields", formData.related_fields);

      data.append("website", formData.website);

      data.append("scopus_id", formData.scopus_id);
    }

    // ✅ แก้ตรงนี้

    if (formData.file_image instanceof File) {
      data.append("file_image", formData.file_image);
    } else if (previewImage) {
      const res = await fetch(previewImage);
      const blob = await res.blob();

      const file = new File([blob], "personnel.jpg", { type: blob.type });

      data.append("file_image", file);
    }

    try {
      await api.put(`/admin/personnel/${id}`, data);

      alert("บันทึกสำเร็จ");

      navigate("/admin/personnel");
    } catch {
      setError("บันทึกไม่สำเร็จ");
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <AdminLayout>
      <div className="container">
        <div className="mb-4">
          <h4>แก้ไขบุคลากร</h4>
        </div>
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* ประเภท */}

                <div className="col-12 mb-3">
                  <label>ประเภทบุคลากร</label>
                  <input
                    className="form-control"
                    value={formData.type_personnel}
                    readOnly
                  />
                </div>

                {/* ตำแหน่ง */}

                <div className="col-12 mb-3">
                  <label>ตำแหน่งในภาควิชา</label>

                  <input
                    type="text"
                    className="form-control"
                    name="department_position_name"
                    list="departmentPositionList"
                    value={formData.department_position_name}
                    onChange={handleChange}
                  />

                  <datalist id="departmentPositionList">
                    {[
                      ...new Set(
                        departmentPositions.map((pos) =>
                          pos.department_position_name?.trim(),
                        ),
                      ),
                    ].map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>

                {/* ===== วิชาการ ===== */}

                {formData.type_personnel === "สายวิชาการ" && (
                  <>
                    <div className="col-12 mb-3">
                      <label>ตำแหน่งวิชาการ</label>

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

                    <div className="col-md-6 mb-3">
                      <label>คำนำหน้าทางวิชาการ (TH)</label>
                      <input
                        className="form-control"
                        value={formData.thai_academic_position}
                        readOnly
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>Academic Title (EN)</label>
                      <input
                        className="form-control"
                        value={formData.eng_academic_position}
                        readOnly
                      />
                    </div>
                  </>
                )}

                {/* ===== ทุกสาย ===== */}

                <div className="col-md-6 mb-3">
                  <label>
                    ชื่อ-นามสกุล (TH) <span className="text-danger">*</span>
                  </label>

                  <input
                    name="thai_name"
                    className="form-control"
                    value={formData.thai_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>
                    Name (EN) <span className="text-danger">*</span>
                  </label>

                  <input
                    name="eng_name"
                    className="form-control"
                    value={formData.eng_name}
                    onChange={handleChange}
                  />
                </div>

                {/* ===== วิชาการ ===== */}

                {formData.type_personnel === "สายวิชาการ" && (
                  <>
                    <div className="col-12 mb-3">
                      <label>ประวัติการศึกษา</label>

                      <textarea
                        name="education"
                        className="form-control"
                        rows={3}
                        value={formData.education}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label>สาขาที่เชี่ยวชาญ</label>

                      <textarea
                        name="related_fields"
                        className="form-control"
                        rows={2}
                        value={formData.related_fields}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>Website</label>

                      <input
                        name="website"
                        className="form-control"
                        value={formData.website}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label>Scopus ID</label>

                      <input
                        name="scopus_id"
                        className="form-control"
                        value={formData.scopus_id}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {/* ===== ทุกสาย ===== */}

                <div className="col-md-10 mb-3">
                  <label>
                    Email <span className="text-danger">*</span>
                  </label>

                  <input
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-10 mb-3">
                  <label>อัปโหลดรูปภาพ</label>

                  <input
                    type="file"
                    name="file_image"
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                {previewImage && (
                  <div className="col-3">
                    <img src={previewImage} className="img-fluid" alt="" />
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-center gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/personnel")}
                >
                  ยกเลิก
                </button>

                <button type="submit" className="btn btn-primary">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditPersonnel;
