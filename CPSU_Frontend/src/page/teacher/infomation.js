import React, { useState, useEffect } from "react";
import Footer from "../../component/footer";
import Header from "../../component/header";
import Navbar from "../../component/navbar";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const TeacherInformation = () => {
  const navigate = useNavigate();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [user] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (!user || !user.roles?.includes("teacher")) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user?.email) return;

    const fetchPerson = async () => {
      try {
        const res = await api.get("/personnel");

        const teacher = res.data.find((p) => {
          if (!p.email) return false;

          const emails = p.email
            .split(/[,|\n| ]+/)
            .map((e) => e.trim().toLowerCase())
            .filter(Boolean);

          return emails.includes(user.email.trim().toLowerCase());
        });

        // console.log("teacher:", teacher);

        if (!teacher) {
          setError(true);
          return;
        }

        setPerson(teacher);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [user]);

  const handleEdit = () => {
    navigate("/teacher/informationedit", {
      state: { personnelId: person.personnel_id },
    });
  };

  /* loading */
  if (loading) {
    return (
      <>
        <Header />
        <Navbar />
        <div className="container text-center my-5">
          <div className="spinner-border text-primary" />
          <p className="mt-3">กำลังโหลดข้อมูล...</p>
        </div>
        <Footer />
      </>
    );
  }

  /* error */
  if (error || !person) {
    return (
      <>
        <Header />
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
      <Header />
      <Navbar />

      <h4 className="text-center my-4">ข้อมูลอาจารย์ของฉัน</h4>

      <div className="container my-5">
        <div className="teacher-card mx-auto bg-white shadow rounded p-4 position-relative">
          <button
            onClick={handleEdit}
            className="btn btn-outline-secondary position-absolute top-0 end-0 m-3"
          >
            <i className="bi bi-pencil"></i> แก้ไข
          </button>

          <div className="row">
            {/* Profile */}
            <div className="col-md-4 text-center">
              <img
                src={person.file_image || "/images/default-profile.png"}
                onError={(e) => (e.target.src = "/images/default-profile.png")}
                alt={person.thai_name}
                className="img-fluid rounded-circle img-profile"
              />

              <div className="mt-3">
                <p className="form-label">อีเมล </p>
                {person.email
                  ?.split(/[,\s]+/)
                  .filter(Boolean)
                  .map((email, index) => (
                    <div className="mt-1" key={index}>{email}</div>
                  ))}
              </div>
            </div>

            {/* Info */}
            <div className="col-md-8 text-start">
              <h5 className="text-primary">
                {person.department_position_name}
              </h5>

              <hr />

              <h4>
                {person.thai_academic_position} {person.thai_name}
              </h4>

              <p className="text-muted">
                {person.eng_academic_position} {person.eng_name}
              </p>

              <hr />

              <h5>
                {/* <i className="bi bi-mortarboard me-2"></i> */}
                ประวัติการศึกษา
              </h5>

              <ul>
                {(person.education || "")
                  .split("\n")
                  .filter(Boolean)
                  .map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
              </ul>

              <hr />

              <h5>
                {/* <i className="bi bi-lightbulb me-2"></i> */}
                สาขาที่เชี่ยวชาญ
              </h5>

              <ul>
                {(person.related_fields || "")
                  .split("\n")
                  .filter(Boolean)
                  .map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TeacherInformation;
