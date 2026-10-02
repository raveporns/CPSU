import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../component/navbar";
import Headers from "../component/header";
import Footer from "../component/footer";
import "../css/course_detail.css";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";

const Course_detail = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(null);
  const [structure, setStructure] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // ดึงข้อมูลหลักสูตร
        const courseRes = await axios.get(
          "http://localhost:8080/api/v1/course",
        );
        const courses = Array.isArray(courseRes.data) ? courseRes.data : [];
        const foundCourse = courses.find((c) => c.course_id === course_id);
        setCourse(foundCourse || null);

        // ดึงข้อมูลโครงสร้างหลักสูตร
        const structureRes = await axios.get(
          "http://localhost:8080/api/v1/structure",
        );

        const structures = Array.isArray(structureRes.data)
          ? structureRes.data
          : [];

        const parseStructure = (detail) => {
          const lines = detail
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l && !l.startsWith("Program"));

          const root = [];

          lines.forEach((line) => {
            const creditMatch = line.match(
              /(ไม่น้อยกว่า\s*\d+\s*หน่วยกิต|\d+\s*หน่วยกิต)/,
            );

            let credit = "";
            if (creditMatch) {
              credit = creditMatch[0];
              line = line.replace(credit, "").trim();
            }

            const parts = line.split(/\s+/);
            parts.shift(); // remove IT

            let currentLevel = root;

            parts.forEach((part, index) => {
              let node = currentLevel.find((n) => n.name === part);

              if (!node) {
                node = {
                  name: part,
                  credit: index === parts.length - 1 ? credit : "",
                  children: [],
                };

                currentLevel.push(node);
              }

              currentLevel = node.children;
            });
          });

          return root;
        };
        const foundStructure = structures.find(
          (s) => s.course_id?.trim() === course_id?.trim(),
        );
        if (foundStructure && foundStructure.detail) {
          const parsed = parseStructure(foundStructure.detail);
          setStructure(parsed);
        }

        // ดึง roadmap
        const roadmapRes = await axios.get(
          "http://localhost:8080/api/v1/roadmap",
        );
        const roadmaps = Array.isArray(roadmapRes.data) ? roadmapRes.data : [];

        const foundRoadmap = roadmaps.find(
          (r) => r.course_id?.trim() === course_id?.trim(),
        );

        setRoadmap(foundRoadmap || null);

        // ดึงรายวิชา
        const subjectsRes = await axios.get(
          "http://localhost:8080/api/v1/subject",
        );

        const subjectsData = Array.isArray(subjectsRes.data)
          ? subjectsRes.data
          : [];

        const filteredSubjects = subjectsData.filter(
          (subj) => subj.course_id === course_id,
        );

        setSubjects(filteredSubjects);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("ไม่พบข้อมูลหลักสูตรที่ต้องการ");
        setLoading(false);
      }
    };

    fetchData();
  }, [course_id]);

  const filteredSubjects = subjects.filter((subj) => {
    const keyword = searchTerm.toLowerCase();

    return (
      subj.subject_id?.toLowerCase().includes(keyword) ||
      subj.thai_subject?.toLowerCase().includes(keyword)
    );
  });

  const groupSubjectsByYearSemesterAndPlan = (subjects) => {
    const grouped = {};

    subjects.forEach((subj) => {
      const semesterText = subj.semester || "";

      const yearMatch = semesterText.match(/ปีที่\s*(\d+)/);
      const semesterMatch = semesterText.match(/ภาคการศึกษาที่\s*(\d+)/);

      const year = yearMatch ? `ปีที่ ${yearMatch[1]}` : "ปีไม่ระบุ";
      const semester = semesterMatch
        ? `เทอม ${semesterMatch[1]}`
        : "เทอมไม่ระบุ";
      const plan = subj.plan_type || "ทั่วไป";

      if (!grouped[year]) grouped[year] = {};
      if (!grouped[year][semester]) grouped[year][semester] = {};
      if (!grouped[year][semester][plan]) grouped[year][semester][plan] = [];

      grouped[year][semester][plan].push(subj);
    });

    return grouped;
  };

  const groupedSubjects = groupSubjectsByYearSemesterAndPlan(filteredSubjects);
  
  const tabs = [
    { key: "overview", label: "ภาพรวมหลักสูตร", show: course !== null },
    {
      key: "structure",
      label: "โครงสร้างหลักสูตร",
      show: structure.length > 0,
    },
    {
      key: "roadmap",
      label: "แผนผังหลักสูตร",
      show: roadmap && roadmap.roadmap_url,
    },
    { key: "subjects", label: "รายวิชา", show: subjects.length > 0 },
  ].filter((tab) => tab.show);

  useEffect(() => {
    if (!tabs.find((tab) => tab.key === activeTab)) {
      setActiveTab(tabs[0]?.key || "overview");
    }
  }, [tabs, activeTab]);

  if (loading)
    return (
      <>
        <Headers />
        <Navbar />
        <div className="container text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">กำลังโหลดข้อมูลหลักสูตร...</p>
        </div>
        <Footer />
      </>
    );

  if (!course)
    return (
      <>
        <Headers />
        <Navbar />
        <div className="container text-center my-5">
          <h3>{error || "ไม่พบหลักสูตรที่คุณเลือก"}</h3>
          <Link to="/course">กลับไปหน้ารายการหลักสูตร</Link>
        </div>
        <Footer />
      </>
    );

  const TreeNode = ({ node }) => {
    return (
      <li>
        <div className="tree-node">
          <span className="node-name">{node.name}</span>
          {node.credit && <span className="node-credit">{node.credit}</span>}
        </div>

        {node.children && node.children.length > 0 && (
          <ul>
            {node.children.map((child, i) => (
              <TreeNode key={i} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <Headers />
      <Navbar />
      <Breadcrumb
        items={[
          { label: "หลักสูตร", path: "/course" },
          { label: course?.thai_course || "รายละเอียดหลักสูตร" },
        ]}
      />
      <div className="container my-5">
        <h2>
          {course.thai_course} ({course.year})
        </h2>
        <h4>{course.eng_course}</h4>
        <h5>{course.degree}</h5>

        {/* Tab navigation */}
        <div>
          <ul className="nav nav-tabs justify-content-center">
            {tabs.map((tab) => (
              <li className="nav-item" key={tab.key}>
                <button
                  className={`nav-link ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="tab-content mt-3">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-4">ข้อมูลหลักสูตร</h4>

                <div className="row mb-3">
                  <div className="col-md-3 fw-bold">ชื่อหลักสูตร (ไทย)</div>
                  <div className="col-md-9">{course.thai_course}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3 fw-bold">ชื่อหลักสูตร (อังกฤษ)</div>
                  <div className="col-md-9">{course.eng_course}</div>
                </div>

                <hr />

                <h5 className="mb-3">ชื่อปริญญา</h5>

                <div className="row mb-3">
                  <div className="col-md-3 fw-bold">ภาษาไทย</div>
                  <div className="col-md-9">{course.thai_degree}</div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-3 fw-bold">ภาษาอังกฤษ</div>
                  <div className="col-md-9">{course.eng_degree}</div>
                </div>

                <hr />

                <h5 className="text-start">เกณฑ์การเข้าศึกษา</h5>
                <p className="ms-5 mt-3 text-start">{course.admission_req}</p>

                <h5 className="text-start">เกณฑ์การสำเร็จการศึกษา</h5>
                <p className="ms-5 mt-3 text-start">{course.graduation_req}</p>

                <hr />

                <h5 className="text-start">ปรัชญาของหลักสูตร</h5>
                <p className="ms-5 mt-3 text-start">{course.philosophy}</p>

                <hr />

                <h5 className="text-start">วัตถุประสงค์ของหลักสูตร</h5>
                <p className="ms-5 mt-3 text-start">{course.objective}</p>

                <hr />

                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">ค่าใช้จ่าย</h6>
                    <p className="text-center mt-2">{course.tuition}</p>
                  </div>

                  <div className="col-md-6">
                    <h6 className="fw-bold">หน่วยกิต</h6>
                    <p className="text-center mt-2">{course.credits}</p>
                  </div>
                </div>

                <hr />

                <h5>อาชีพหลังสำเร็จการศึกษา</h5>
                <ul className="list-unstyled ms-3 mt-4">
                  {course.career_paths?.split("\n").map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <hr />

                <h5>PLOs</h5>
                <ul className="list-unstyled ms-3">
                  {course.plo?.split("\n").map((item, index) => (
                    <li key={index} className="mb-2">
                      {item}
                    </li>
                  ))}
                </ul>

                <hr />

                <h5>รายละเอียดเพิ่มเติม</h5>
                {course.detail_url && (
                  <a
                    href={course.detail_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className=" btn btn-primary"
                  >
                    ดูรายละเอียด
                  </a>
                )}
              </div>
            </div>
          )}

          {activeTab === "structure" && structure.length > 0 && (
            <div className="card shadow-sm">
              <div className="card-body">
                <h4 className="mb-4">โครงสร้างหลักสูตร</h4>

                {structure.length === 0 ? (
                  <p>ไม่มีข้อมูลโครงสร้างหลักสูตร</p>
                ) : (
                  <div className="tree-container">
                    <ul className="tree">
                      {structure.map((node, i) => (
                        <TreeNode key={i} node={node} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "roadmap" && roadmap && roadmap.roadmap_url && (
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h4 className="mb-4">แผนผังหลักสูตร</h4>

                <img
                  src={roadmap.roadmap_url}
                  alt="roadmap"
                  className="img-fluid rounded border"
                />
              </div>
            </div>
          )}

          {/* Subjects */}
          {activeTab === "subjects" && subjects.length > 0 && (
            <div>
              <h4 className="mb-4">รายวิชาในหลักสูตร</h4>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="ค้นหารหัสวิชา หรือ ชื่อวิชา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {Object.entries(groupedSubjects).map(([year, semesters]) => (
                <div key={year} className="mb-5">
                  <h5 className="text-primary">{year}</h5>

                  {Object.entries(semesters).map(([semester, plans]) => (
                    <div key={semester} className="mb-3">
                      <h6 className="fw-bold">{semester}</h6>

                      {Object.entries(plans).map(([plan, subs]) => (
                        <div key={plan} className="mb-4">
                          <h6 className="text-secondary">{plan}</h6>

                          <table className="table table-bordered table-hover">
                            <thead className="table-light">
                              <tr>
                                <th style={{ width: "150px" }}>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th style={{ width: "100px" }}>หน่วยกิต</th>
                              </tr>
                            </thead>

                            <tbody>
                              {subs.map((subj, index) => (
                                <tr key={`${subj.subject_id}-${index}`}>
                                  <td>
                                    {["SUxxx", "SUXXX", "------"].includes(
                                      subj.subject_id,
                                    ) ? (
                                      subj.subject_id
                                    ) : (
                                      <Link to={`/subject/${subj.subject_id}`}>
                                        {subj.subject_id}
                                      </Link>
                                    )}
                                  </td>

                                  <td>{subj.thai_subject || "-"}</td>
                                  <td>{subj.credits || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Course_detail;
