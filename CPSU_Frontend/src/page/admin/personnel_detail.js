import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../css/admin/news.css";
import AdminLayout from "../../layout/AdminLayout";
import { FaEdit, FaTrash } from "react-icons/fa";

function DetailPersonnel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดข้อมูล
  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const res = await api.get(`/admin/personnel/${id}`);
        setPerson(res.data.personnel);
      } catch (err) {
        console.error("Error fetching personnel detail:", err);
        setError("ไม่สามารถโหลดข้อมูลบุคลากรได้");
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  // ===== ลบ =====
  const handleDelete = async () => {
    const confirmDelete = window.confirm("ต้องการลบบุคลากรนี้หรือไม่ ?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/personnel/${id}`);

      alert("ลบบุคลากรสำเร็จ");

      navigate("/admin/personnel");
    } catch (err) {
      console.error(err);
      alert("ลบไม่สำเร็จ");
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        {loading && (
          <div className="text-center mt-5">
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center mt-5">
            <p className="text-danger">{error}</p>
          </div>
        )}

        {!loading && !error && person && (
          <>
            {/* ปุ่ม */}
            <div className="d-flex justify-content-end gap-2 mb-3">
              <Link
                to={`/admin/editpersonnel/${id}`}
                className="btn btn-warning"
              >
                <FaEdit className="me-2" />
                แก้ไข
              </Link>

              <button className="btn btn-danger" onClick={handleDelete}>
                <FaTrash className="me-2" />
                ลบ
              </button>
            </div>

            <div className="card shadow-sm p-4">
              <div className="d-flex align-items-center mb-3">
                <h4 className="mb-0">
                  <Link
                    to="/admin/personnel"
                    className="me-2 text-decoration-none"
                  >
                    &lt;
                  </Link>
                  รายละเอียดข้อมูลบุคลากร
                </h4>
              </div>

              <div className="row">
                <div className="row">
                  {/* รูป */}
                  <div className="col-md-3 text-center">
                    {person.file_image && (
                      <img
                        src={person.file_image}
                        alt="personnel"
                        className="img-fluid rounded shadow-sm"
                      />
                    )}

                    <div className="mt-3">
                      <div>
                        <strong>อีเมล</strong>
                        <br />

                        {person.email
                          ? person.email.split(/[;,]/).map((mail, i) => (
                              <div key={i}>
                                <a href={`mailto:${mail.trim()}`}>
                                  {mail.trim()}
                                </a>
                              </div>
                            ))
                          : "-"}
                      </div>

                      {person.type_personnel === "สายวิชาการ" && (
                        <p>
                          <strong>เว็บไซต์</strong>
                          <br />
                          {person.website ? (
                            <a
                              href={person.website}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {person.website}
                            </a>
                          ) : (
                            "-"
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ข้อมูล */}
                  <div className="col-md-8 text-start">
                    <h4>
                      {person.type_personnel === "สายวิชาการ" &&
                        person.thai_academic_position}{" "}
                      {person.thai_name}
                    </h4>

                    <p className="text-muted">
                      {person.type_personnel === "สายวิชาการ" &&
                        person.eng_academic_position}{" "}
                      {person.eng_name}
                    </p>

                    <p>
                      <strong>ตำแหน่งในภาควิชา :</strong>{" "}
                      {person.department_position_name || "-"}
                    </p>

                    <p>
                      <strong>ประเภทบุคลากร :</strong> {person.type_personnel}
                    </p>

                    <hr />

                    {/* แสดงเฉพาะสายวิชาการ */}

                    {person.type_personnel === "สายวิชาการ" && (
                      <>
                        <h5>ประวัติการศึกษา</h5>

                        {person.education ? (
                          <ul>
                            {person.education.split("\n").map((line, i) => (
                              <li key={i}>{line.trim()}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>-</p>
                        )}

                        <h5 className="mt-3">สาขาที่เชี่ยวชาญ</h5>

                        {person.related_fields ? (
                          <ul>
                            {person.related_fields
                              .split("\n")
                              .map((line, i) => (
                                <li key={i}>{line.trim()}</li>
                              ))}
                          </ul>
                        ) : (
                          <p>-</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default DetailPersonnel;
