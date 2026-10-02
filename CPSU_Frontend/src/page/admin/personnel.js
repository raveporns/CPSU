import React, { useEffect, useState } from "react";
import "../../css/admin/personnel.css";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

function PersonnelAdmin() {
  const [personnel, setPersonnel] = useState([]);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      const res = await api.get("/admin/personnel");
      setPersonnel(res.data);
    } catch (err) {
      console.error("Error fetching personnel", err);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>บุคลากรทั้งหมด</h3>

          <Link to="/admin/addpersonnel" className="btn-addcourse">
            + เพิ่มบุคลากร
          </Link>
        </div>

        <div className="row row-cols-1 row-cols-md-4 g-4">
          {personnel.map((item) => (
            <div className="col" key={item.personnel_id}>
              <Link
                to={`/admin/personnel/${item.personnel_id}`}
                className="text-decoration-none text-dark"
              >
                <div className="card h-200 shadow-sm">
                  <img
                    src={
                      item.file_image && item.file_image.trim() !== ""
                        ? item.file_image
                        : "/images/default-profile.png"
                    }
                    className="card-img-top personnel-img"
                    alt={item.thai_name}
                  />
                  <div className="card-body">
                    <h5 className="card-title name-title">
                      {item.thai_academic_position} {item.thai_name}
                    </h5>

                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default PersonnelAdmin;
