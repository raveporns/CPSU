import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../component/navbar";
import Headers from "../component/header";
import Footer from "../component/footer";
import "../css/people_staff_detail.css";
import Breadcrumb from "../component/Breadcrumb";

const StaffDetail = () => {
  const { id } = useParams();
  const location = useLocation();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(null);

  // อ่าน type จาก query
  const params = new URLSearchParams(location.search);
  const type = params.get("type") || "สายสนับสนุนวิชาการ";

  useEffect(() => {
    let isMounted = true;

    const fetchPerson = async () => {
      try {
        const res = await api.get(`/personnel/${id}`);

        if (isMounted) {
          setPerson(res.data?.personnel || null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPerson();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // const handleCopyEmail = () => {
  //   if (!person?.email) return;

  //   navigator.clipboard.writeText(person.email);
  //   setCopied(true);

  //   setTimeout(() => setCopied(false), 2000);
  // };

  if (loading) {
    return (
      <>
        <Headers />
        <Navbar />

        <div className="container text-center my-5">
          <div className="spinner-border text-primary" />
          <p>กำลังโหลดข้อมูล...</p>
        </div>

        <Footer />
      </>
    );
  }

  if (error || !person) {
    return (
      <>
        <Headers />
        <Navbar />

        <div className="container my-5">
          <div className="alert alert-danger text-center">
            ไม่สามารถโหลดข้อมูลได้
          </div>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Headers />
      <Navbar />

      <Breadcrumb
        items={[
          { label: "บุคลากร", path: "/personnel" },

          {
            label: type,
            path: `/personnel?type=${type}`,
          },
        ]}
      />

      <h3>บุคลากร</h3>

      <div className="container my-1">
        <div className="teacher-card mx-auto bg-white shadow rounded p-4">
          <div className="row">
            {/* LEFT */}
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <img
                src={person.file_image || "/images/default-profile.png"}
                alt={person.thai_name}
                className="img-fluid img-profile"
              />

              {person.email && (
                <div className="mt-3">
                  {person.email
                    .split(/[,|\n| ]+/)
                    .filter((m) => m.trim())
                    .map((mail, i) => (
                      <div key={i} className="mb-2">
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <span>{mail.trim()}</span>

                          <button
                            className="btn btn-outline-light btn-sm p-2 "
                            onClick={() => {
                              navigator.clipboard.writeText(mail.trim());
                              setCopied(i);
                              setTimeout(() => setCopied(null), 1500);
                            }}
                          >
                            <i
                              className={`bi ${
                                copied === i
                                  ? "bi-check-lg text-success"
                                  : "bi-files text-secondary"
                              }`}
                            />
                          </button>
                        </div>

                        {/* {copied === i && (
                          <small className="text-success">คัดลอกแล้ว</small>
                        )} */}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="col-md-8 text-start">
              <h5 className="text-primary">
                {person.department_position_name}
              </h5>

              <hr />

              <h4 className="fw-bold mt-2">
                {person.thai_academic_position} {person.thai_name}
              </h4>

              <p className="text-muted">
                {person.eng_academic_position} {person.eng_name}
              </p>

              <hr />

              {/* {person.related_fields && (
                <>
                  <h5>หน้าที่รับผิดชอบ</h5>

                  <ul>
                    {person.related_fields
                      .split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                  </ul>

                  <hr />
                </>
              )} */}

              {/* {person.website && (
                <p>
                  <strong>เว็บไซต์ :</strong>{" "}
                  <a href={person.website} target="_blank" rel="noreferrer">
                    {person.website}
                  </a>
                </p>
              )} */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default StaffDetail;
