import React, { useEffect, useState } from "react";
import "../../css/admin/course.css";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

const DocumentAdmin = () => {
  const [document, setDocument] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type_id: "",
    file: null,
  });

  const fetchDocument = async () => {
    try {
      const res = await api.get("/admin/document");
      setDocument(res.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError("ไม่สามารถโหลดข้อมูลเอกสารได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocument();
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setSelectedDoc(null);
    setFormData({
      title: "",
      description: "",
      type_id: "",
      file: null,
    });
    setShowModal(true);
  };

  const openEditModal = (doc) => {
    setModalMode("edit");
    setSelectedDoc(doc);
    setFormData({
      title: doc.title || "",
      description: doc.description || "",
      type_id: doc.type_id || "",
      file: null,
    });
    setShowModal(true);
  };

  const openDeleteModal = (doc) => {
    setModalMode("delete");
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("type_id", formData.type_id);

      if (formData.file) {
        data.append("file", formData.file);
      }

      if (modalMode === "add") {
        await api.post("/admin/document", data);
      } else if (modalMode === "edit") {
        await api.put(`/admin/document/${selectedDoc.document_id}`, data);
      }

      setShowModal(false);
      fetchDocument();
    } catch (err) {
      console.error("Error saving document:", err);
      alert("บันทึกข้อมูลเอกสารไม่สำเร็จ");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/document/${selectedDoc.document_id}`);
      setDocument((prev) =>
        prev.filter((item) => item.document_id !== selectedDoc.document_id),
      );
      setShowModal(false);
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("ลบเอกสารไม่สำเร็จ");
    }
  };

  const filteredDocument = document.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const typeName = item.type_name?.toLowerCase() || "";
    const description = item.description?.toLowerCase() || "";
    const keyword = searchTerm.toLowerCase();

    return (
      title.includes(keyword) ||
      typeName.includes(keyword) ||
      description.includes(keyword)
    );
  });

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 id="course-title">เอกสารทั้งหมด</h3>

          <button className="btn-addcourse" onClick={openAddModal}>
            + เพิ่มเอกสาร
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="ค้นหาเอกสาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>กำลังโหลดข้อมูลเอกสาร...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ชื่อเอกสาร</th>
                  <th>ประเภท</th>
                  <th>คำอธิบาย</th>
                  <th width="120" className="text-center">
                    ไฟล์
                  </th>
                  <th width="180" className="text-center">
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody className="text-start">
                {filteredDocument.length > 0 ? (
                  filteredDocument.map((item, index) => (
                    <tr key={item.document_id}>
                      <td>{item.title}</td>
                      <td>{item.type_name || "-"}</td>
                      <td>{item.description || "-"}</td>
                      <td className="text-center">
                        <a
                          href={item.file}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          เปิด
                        </a>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => openEditModal(item)}
                        >
                          แก้ไข
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => openDeleteModal(item)}
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      {searchTerm ? "ไม่พบเอกสารที่ค้นหา" : "ไม่มีข้อมูลเอกสาร"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ zIndex: 1055 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "add" && "เพิ่มเอกสาร"}
                  {modalMode === "edit" && "แก้ไขเอกสาร"}
                  {modalMode === "delete" && "ลบเอกสาร"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {modalMode === "delete" ? (
                  <p>
                    ต้องการลบเอกสาร <strong>{selectedDoc?.title}</strong>{" "}
                    ใช่หรือไม่?
                  </p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label className="form-label">ชื่อเอกสาร</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">ประเภทเอกสาร</label>
                      <select
                        className="form-select"
                        value={formData.type_id}
                        onChange={(e) =>
                          setFormData({ ...formData, type_id: e.target.value })
                        }
                      >
                        <option value="">เลือกประเภท</option>
                        <option value="1">แบบฟอร์มทั่วไป</option>
                        <option value="2">
                          แบบฟอร์มโครงงานปริญญานิพนธ์(1)
                        </option>
                        <option value="3">
                          แบบฟอร์มโครงงานปริญญานิพนธ์(2)
                        </option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">คำอธิบาย</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">ไฟล์เอกสาร</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            file: e.target.files[0],
                          })
                        }
                      />

                      {modalMode === "edit" && selectedDoc?.file && (
                        <small className="text-muted d-block mt-2">
                          ไฟล์เดิม:{" "}
                          <a
                            href={selectedDoc.file}
                            target="_blank"
                            rel="noreferrer"
                          >
                            เปิดไฟล์เดิม
                          </a>
                        </small>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  ยกเลิก
                </button>

                {modalMode === "delete" ? (
                  <button className="btn btn-danger" onClick={handleDelete}>
                    ยืนยันลบ
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    บันทึก
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* <div className="modal-backdrop fade show"></div> */}
        </div>
      )}
    </AdminLayout>
  );
};

export default DocumentAdmin;
