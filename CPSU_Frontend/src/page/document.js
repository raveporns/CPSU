import React, { useEffect, useState } from "react";
import Navbar from "../component/navbar";
import Headers from "../component/header";
import Footer from "../component/footer";
import "../css/document.css";
import Breadcrumb from "../component/Breadcrumb";
import axios from "axios";


const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/document");
        setDocuments(res.data);
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("ไม่สามารถโหลดข้อมูลเอกสารได้");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const title = doc.title?.toLowerCase() || "";
    const description = doc.description?.toLowerCase() || "";
    const typeName = doc.type_name?.toLowerCase() || "";

    return (
      title.includes(searchTerm) ||
      description.includes(searchTerm) ||
      typeName.includes(searchTerm)
    );
  });

  const groupedDocuments = filteredDocuments.reduce((groups, doc) => {
    const groupName = doc.type_name || "ไม่ระบุประเภท";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(doc);
    return groups;
  }, {});

  const groupOrder = [
    "แบบฟอร์มทั่วไป",
    "แบบฟอร์มโครงงานปริญญานิพนธ์(1)",
    "แบบฟอร์มโครงงานปริญญานิพนธ์(2)",
  ];

  return (
    <>
      <Headers />
      <Navbar />
      <Breadcrumb items={[{ label: "เอกสาร", path: "/document" }]} />

      <div className="container document-container my-5">
        <div className="document-search mb-5">
          <input
            type="text"
            className="form-control search-input"
            placeholder="🔍 ค้นหาเอกสาร..."
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>

        {loading && (
          <p className="text-center text-muted">กำลังโหลดข้อมูลเอกสาร...</p>
        )}

        {error && <p className="text-center text-danger">{error}</p>}

        {!loading &&
          !error &&
          Object.entries(groupedDocuments)
            .sort(([a], [b]) => {
              const indexA = groupOrder.indexOf(a);
              const indexB = groupOrder.indexOf(b);

              if (indexA === -1 && indexB === -1) {
                return a.localeCompare(b, "th");
              }

              if (indexA === -1) return 1;
              if (indexB === -1) return -1;

              return indexA - indexB;
            })
            .map(([groupName, docs]) => (
              <section key={groupName} className="mb-5">
                <div className="document-card">
                  <h4 className="document-title">{groupName}</h4>

                  <ul className="document-list">
                    {docs.map((doc) => (
                      <li
                        key={doc.document_id}
                        className="document-item text-start"
                      >
                        <span className="doc-icon">📄</span>

                        <a
                          href={doc.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.title}
                          {doc.description ? ` ${doc.description}` : ""}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}

        {!loading && !error && Object.keys(groupedDocuments).length === 0 && (
          <p className="text-center text-muted">ไม่พบเอกสารที่ตรงกับคำค้นหา</p>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Document;
