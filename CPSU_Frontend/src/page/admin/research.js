import React, { useEffect, useState, useRef, useCallback } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";
import "../../css/admin/research.css";

const Research = () => {
  const [research, setResearch] = useState([]);
  const [, setLoading] = useState(true);
  const [loadingSync, setLoadingSync] = useState(false);
  const [search, setSearch] = useState("");
  const [lastSync, setLastSync] = useState(null);
  const hasShownError = useRef(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (loadingSync) {
        e.preventDefault();
        e.returnValue = "กำลัง Sync Scopus อยู่ ห้ามออกจากหน้านี้";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loadingSync]);

  useEffect(() => {
    const handlePopState = () => {
      if (loadingSync) {
        alert("กำลัง Sync อยู่ ห้ามออกจากหน้านี้");

        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loadingSync]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!loadingSync) return;

      const link = e.target.closest("a");

      if (link) {
        e.preventDefault();
        alert("กำลัง Sync อยู่ ห้ามเปลี่ยนหน้า");
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [loadingSync]);

  const fetchResearch = useCallback(async () => {
    try {
      const res = await api.get("/admin/personnel/research");
      setResearch(res.data || []);

      if (res.data.length > 0) {
        const latest = [...res.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        )[0];

        setLastSync(latest.created_at);
      }
    } catch (err) {
      console.error(err);

      if (!hasShownError.current) {
        alert("โหลดข้อมูลงานวิจัยไม่สำเร็จ");
        hasShownError.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearch();
  }, [fetchResearch]);

  const fetchScopus = async () => {
    if (!window.confirm("ต้องการอัปเดตข้อมูลจาก Scopus ใช่หรือไม่?")) return;

    setLoadingSync(true);

    try {
      await api.get("/admin/personnel/scopus");

      alert("อัปเดตข้อมูลจาก Scopus สำเร็จ");

      await fetchResearch();
    } catch (err) {
      console.error(err);
      alert("อัปเดต Scopus ไม่สำเร็จ");
    } finally {
      setLoadingSync(false);
    }
  };

  // =========================
  // filter
  // =========================

  const filteredResearch = research.filter((r) => {
    const authorText = Array.isArray(r.author) ? r.author.join(" ") : r.author;

    return `${r.thai_name} ${r.title} ${authorText} ${r.year}`
      .toLowerCase()
      .includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredResearch.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentData = filteredResearch.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatAuthorsIEEE = (authors) => {
    if (!authors) return "";

    const formatted = authors.map((a) => {
      const parts = a.split(" ");
      if (parts.length < 2) return a;

      const lastName = parts[0];

      const initials = parts[1]
        .replace(/\./g, "")
        .split("")
        .map((i) => `${i}.`)
        .join("");

      return `${initials} ${lastName}`;
    });

    if (formatted.length === 1) return formatted[0];
    if (formatted.length === 2) return formatted.join(" and ");

    return (
      formatted.slice(0, -1).join(", ") +
      ", and " +
      formatted[formatted.length - 1]
    );
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        {loadingSync && (
          <div className="alert alert-danger text-center">
            ⚠ กำลัง Sync Scopus อยู่ ห้ามออกจากหน้านี้
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>ผลงานวิจัย</h3>

          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="ค้นหา..."
              style={{ width: "250px" }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />

            <p className="text-muted small mb-0">
              ล่าสุด:{" "}
              {lastSync ? new Date(lastSync).toLocaleDateString("th-TH") : "-"}
            </p>

            <button
              className="btn btn-outline-primary btn-lg"
              onClick={fetchScopus}
              disabled={loadingSync}
            >
              {loadingSync ? "กำลัง Sync..." : "Sync Scopus"}
            </button>
          </div>
        </div>

        {/* table */}

        <div className="card shadow-sm">
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th width="200">ชื่อ</th>
                  <th>งานวิจัย</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((r) => (
                  <tr key={r.id}>
                    <td>{r.thai_name}</td>
                    <td>
                      {formatAuthorsIEEE(r.authors)}, “{r.title},”{" "}
                      <i>{r.journal}</i>, {r.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination shadow-sm">
                {/* Previous */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    {"<"}
                  </button>
                </li>

                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </button>
                    </li>
                    {currentPage > 4 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                  </>
                )}

                {/* Middle pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page >= currentPage - 1 && page <= currentPage + 1,
                  )
                  .map((page) => (
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <li className="page-item disabled">
                        <span className="page-link">...</span>
                      </li>
                    )}
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </button>
                    </li>
                  </>
                )}

                {/* Next */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    {">"}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Research;
