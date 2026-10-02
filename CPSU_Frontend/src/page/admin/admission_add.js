import React, { useState, useEffect } from "react";
import "../../css/admin/course.css";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AdminLayout from "../../layout/AdminLayout";

const AddAdmission = () => {
  const [round, setRound] = useState("");
  const [detail, setDetail] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const validateForm = () => {
    if (!round.trim()) {
      alert("กรุณาใส่รอบการรับสมัคร");
      return false;
    }

    if (
      !detail ||
      detail === "<p>&nbsp;</p>" ||
      detail === "<p></p>" ||
      detail.replace(/<[^>]*>/g, "").trim() === ""
    ) {
      alert("กรุณากรอกรายละเอียดการรับสมัคร");
      return false;
    }

    if (!file) {
      alert("กรุณาใส่รูปภาพ");
      return false;
    }

    if (file && !file.type.startsWith("image/")) {
      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("round", round);
    formData.append("detail", detail);

    if (file) {
      formData.append("file_image", file);
    }

    try {
      setLoading(true);
      await api.post("/admin/admission", formData);
      navigate("/admin/admission");
    } catch (error) {
      console.error(error.response?.data || error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3>เพิ่มข้อมูลการรับสมัคร</h3>

        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* รอบการรับสมัคร */}
              <div className="mb-3">
                <label className="form-label">
                  รอบการรับสมัคร <span className="text-danger">*</span>
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                  placeholder="เช่น รอบที่ 1"
                />
              </div>

              {/* CKEditor */}
              <div className="mb-3">
                <label className="form-label">
                  รายละเอียดการรับสมัคร <span className="text-danger">*</span>
                </label>
                <div style={{ minHeight: "220px" }}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={detail}
                    onChange={(event, editor) => setDetail(editor.getData())}
                  />
                </div>
              </div>

              {/* รูปภาพ */}
              <div className="mb-3">
                <label className="form-label">
                  รูปภาพ <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files[0];
                    if (!selected) return;

                    if (!selected.type.startsWith("image/")) {
                      alert("กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น");
                      return;
                    }

                    setFile(selected);
                    setPreview(URL.createObjectURL(selected));
                  }}
                />
              </div>

              {/* Preview */}
              {preview && (
                <div className="mb-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxWidth: "250px" }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddAdmission;
