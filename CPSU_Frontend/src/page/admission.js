import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar";
import Headers from "../component/header";
import Footer from "../component/footer";
import axios from "axios";
import "../css/admission.css";
import Breadcrumb from "../component/Breadcrumb";

const Admission = () => {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/admission")
      .then((res) => {
        setAdmissions(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลข่าวการรับสมัครได้");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="m-4">กำลังโหลดข้อมูล...</p>;
  if (error) return <p className="m-4 text-danger">{error}</p>;

  return (
    <>
      <Headers />
      <Navbar />

      <Breadcrumb items={[{ label: "ข่าวการรับสมัคร", path: "/admission" }]} />

      <div className="container admission-page">

        {admissions.map((item) => (
          <div key={item.admission_id} className="admission-card">

            {/* หัวข้อ */}
            <h2 className="admission-round">{item.round}</h2>
            <h4 className="admission-title">{item.title}</h4>

            {/* เนื้อหา */}
            <div className="admission-content">

              {item.file_image && (
                <div className="admission-image">
                  <img src={item.file_image} alt={item.title} />
                </div>
              )}

              <div
                className="admission-detail"
                dangerouslySetInnerHTML={{ __html: item.detail }}
              />

            </div>

          </div>
        ))}

      </div>

      <Footer />
    </>
  );
};

export default Admission;