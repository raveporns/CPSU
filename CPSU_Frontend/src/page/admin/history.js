import React, { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.roles?.includes("rootadmin");

  useEffect(() => {
    if (isAdmin) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/admin/logs");

      setHistory(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("โหลดประวัติการใช้งานไม่สำเร็จ");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) =>
    new Date(date).toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [history]);

  const filteredHistory = useMemo(() => {
    if (selectedAction === "all") return sortedHistory;

    return sortedHistory.filter(
      (h) => h.action.toLowerCase() === selectedAction.toLowerCase(),
    );
  }, [selectedAction, sortedHistory]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = filteredHistory.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const uniqueActions = useMemo(() => {
    return [...new Set(history.map((h) => h.action))];
  }, [history]);

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>ประวัติการเข้าใช้งานระบบ</h3>

          <select
            className="form-select w-auto"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="all">ทั้งหมด</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light text-center">
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Action</th>
                    <th>Resource</th>
                    <th>ResourceID</th>
                    <th>Description</th>
                    <th>วันเวลา</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        กำลังโหลด...
                      </td>
                    </tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        ไม่มีข้อมูล
                      </td>
                    </tr>
                  ) : (
                    currentData.map((h) => (
                      <tr key={h.id}>
                        <td>{h.username}</td>
                        <td>{h.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              h.action === "login"
                                ? "bg-success"
                                : h.action === "delete"
                                  ? "bg-danger"
                                  : h.action === "update"
                                    ? "bg-warning"
                                    : h.action === "assign_role"
                                      ? "btn-info"
                                      : "bg-primary"
                            }`}
                          >
                            {h.action}
                          </span>
                        </td>
                        <td>{h.resource}</td>
                        <td>{h.resource_id}</td>
                        <td>{h.description}</td>
                        <td>{formatDateTime(h.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="d-flex justify-content-center mt-3 gap-2">
                <button
                  className="btn btn-sm btn-secondary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  ◀
                </button>

                <span className="align-self-center">
                  หน้า {currentPage} / {totalPages || 1}
                </span>

                <button
                  className="btn btn-sm btn-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default History;
