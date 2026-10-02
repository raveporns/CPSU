import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/navbar";
import Headers from "../component/header";
import Footer from "../component/footer";
import "../css/people.css";
import { Link, useLocation } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";

const Personnel = () => {
  const location = useLocation();

  const [personnelList, setPersonnelList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ อ่าน type จาก query
  const getTypeFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("type") || "สายวิชาการ";
  };

  const [activeTab, setActiveTab] = useState(getTypeFromQuery());

  const personnelTypes = ["สายวิชาการ", "สายสนับสนุนวิชาการ"];

  // โหลดข้อมูล
  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/personnel"
        );

        setPersonnelList(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    };

    fetchPersonnel();
  }, []);

  // ✅ sync tab กับ URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get("type");

    if (type) {
      setActiveTab(type);
    }
  }, [location.search]);

  const filteredPersonnel = personnelList.filter(
    (person) => person.type_personnel === activeTab
  );

  if (loading || error) {
    return (
      <>
        <Headers />
        <Navbar />
        <div className="container text-center my-5">
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : (
            <p>เกิดข้อผิดพลาด</p>
          )}
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
        ]}
      />

      <div className="container my-1">

        {/* Tabs */}
        <ul className="nav nav-tabs justify-content-center mb-4">

          {personnelTypes.map((type) => (
            <li key={type} className="nav-item">

              <button
                className={`nav-link ${
                  activeTab === type ? "active" : ""
                }`}
                onClick={() => setActiveTab(type)}
              >
                {type}
              </button>

            </li>
          ))}

        </ul>

        {/* cards */}

        <div className="row">

          {filteredPersonnel.map((person) => {

            const detailPath =
              person.type_personnel === "สายวิชาการ"
                ? `/teacher/${person.personnel_id}?type=สายวิชาการ`
                : `/staff/${person.personnel_id}?type=สายสนับสนุนวิชาการ`;

            return (

              <div
                key={person.personnel_id}
                className="col-lg-3 col-md-4 col-sm-6 mb-4"
              >

                <Link
                  to={detailPath}
                  className="text-decoration-none text-dark"
                >

                  <div className="card person-card shadow-sm h-100">

                    <img
                      src={person.file_image}
                      className="card-img-top"
                      alt=""
                      onError={(e) =>
                        (e.target.src =
                          "/images/default-profile.png")
                      }
                    />

                    <div className="card-body text-center">

                      <h5>
                        {person.thai_academic_position}{" "}
                        {person.thai_name}
                      </h5>

                      <p>
                        {person.department_position_name}
                      </p>

                    </div>

                  </div>

                </Link>

              </div>

            );
          })}

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Personnel;