import React, { useEffect, useState } from "react";
import "../../css/admin/course.css";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import AdminLayout from "../../layout/AdminLayout";

const EditAdmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [round, setRound] = useState("");
  const [detail, setDetail] = useState("");

  const [fileImage, setFileImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/admin/admission/${id}`);
        const data = res.data;

        setRound(data.round || "");
        setDetail(data.detail || "");
        setPreviewNewImage(data.file_image || "");
      } catch {
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!round.trim()) {
      alert("กรุณาใส่รอบการรับสมัคร");
      return;
    }

    if (
      !detail ||
      detail === "<p>&nbsp;</p>" ||
      detail === "<p></p>" ||
      detail.replace(/<[^>]*>/g, "").trim() === ""
    ) {
      alert("กรุณากรอกรายละเอียดการรับสมัคร");
      return;
    }

    if (!fileImage && !previewNewImage) {
      alert("กรุณาใส่รูปภาพ");
      return;
    }

    const formData = new FormData();
    formData.append("round", round);
    formData.append("detail", detail);

    let imageFile = fileImage;

    if (!fileImage && previewNewImage) {
      const res = await fetch(previewNewImage);
      const blob = await res.blob();
      imageFile = new File([blob], "old_image.jpg", { type: blob.type });
    }

    if (imageFile) {
      formData.append("file_image", imageFile);
    }

    try {
      setSaving(true);
      await api.put(`/admin/admission/${id}`, formData);

      alert("บันทึกการแก้ไขสำเร็จ");
      navigate("/admin/admission");
    } catch (error) {
      console.error(error);
      alert("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="m-4">กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="m-4 text-danger">{error}</p>;

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h3 className="mb-4">แก้ไขข้อมูลการรับสมัคร</h3>
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* รอบ */}
              <div className="mb-3">
                <label className="form-label">
                  รอบการรับสมัคร <span className="text-danger">*</span>
                </label>
                <input
                  required
                  className="form-control"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                />
              </div>

              {/* รายละเอียด */}
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

              {/* รูป */}
              <div className="mb-3">
                <label className="form-label">
                  รูปภาพ <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setFileImage(file);
                    setPreviewNewImage(URL.createObjectURL(file));
                  }}
                />
              </div>

              {/* Preview */}
              {previewNewImage && (
                <div className="mb-4">
                  <p>ตัวอย่างรูปภาพ</p>
                  <img
                    src={previewNewImage}
                    alt="preview"
                    className="img-fluid rounded"
                    style={{ maxWidth: "60%" }}
                  />
                </div>
              )}
              <div className="d-flex justify-content-center mt-4">
                <button
                  type="submit"
                  className="btn btn-primary me-2"
                  disabled={saving}
                >
                  {saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/admission")}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditAdmission;
