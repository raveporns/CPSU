import React, { useEffect, useState } from "react";
import "../../css/admin/course_detail.css";
import api from "../../api/axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import { FaEdit, FaTrash } from "react-icons/fa";

const DetailCourse = () => {
  const { id } = useParams();
  const [courseDetail, setCourseDetail] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [structures, setStructures] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const navigate = useNavigate();

  const deleteCourse = async () => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตรนี้?")) return;

    try {
      await api.delete(`/admin/course/${id}`);
      navigate("/admin/course");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("ลบหลักสูตรไม่สำเร็จ");
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [courseRes, roadmapRes, subjectRes, structureRes] =
          await Promise.all([
            api.get(`/admin/course/${id}`),
            api.get("/admin/roadmap"),
            api.get("/admin/subject"),
            api.get("/admin/structure"),
          ]);

        setCourseDetail(courseRes.data);
        setRoadmap(Array.isArray(roadmapRes.data) ? roadmapRes.data : []);
        setSubjects(Array.isArray(subjectRes.data) ? subjectRes.data : []);
        setStructures(
          Array.isArray(structureRes.data) ? structureRes.data : [],
        );
      } catch (err) {
        console.error("Error fetching course detail:", err);
      }
    };

    fetchDetail();
  }, [id]);

  if (!courseDetail) {
    return (
      <AdminLayout>
        <div className="container-fluid">
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </AdminLayout>
    );
  }

  const filteredStructures = structures.filter(
    (st) => st.course_id === courseDetail.course_id,
  );

  const filteredRoadmap = roadmap.filter(
    (rp) => rp.course_id === courseDetail.course_id,
  );

  const filteredSubjects = subjects.filter(
    (subj) => subj.course_id === courseDetail.course_id,
  );

  const addNode = (tree, levels, credit) => {
    let current = tree;

    levels.forEach((level, index) => {
      let node = current.find((n) => n.name === level);

      if (!node) {
        node = { name: level, credit: "", children: [] };
        current.push(node);
      }

      if (index === levels.length - 1) {
        node.credit = credit;
      }

      current = node.children;
    });
  };

  const parseCurriculum = (text) => {
    if (!text) return [];

    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l !== "" && !l.startsWith("Program"));

    const tree = [];

    lines.forEach((line) => {
      let tokens = line.split(/\s+/);

      // ตัด prefix เช่น IT
      tokens.shift();

      const creditMatch = line.match(
        /(ไม่น้อยกว่า\s*\d+\s*หน่วยกิต|\d+\s*หน่วยกิต)/,
      );

      let credit = "";
      if (creditMatch) {
        credit = creditMatch[0];
        line = line.replace(creditMatch[0], "").trim();
      }

      let levels = line
        .replace(/^(IT|CS|DS)\s*/, "")
        .trim()
        .split(/\s+/);

      addNode(tree, levels, credit);
    });

    return tree;
  };

  const TreeNode = ({ node }) => {
    return (
      <li>
        <div className="node">
          <span>{node.name}</span>
          {node.credit && <span>{node.credit.replace(/\n/g, " ")}</span>}
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

  const treeData =
    filteredStructures.length > 0
      ? parseCurriculum(filteredStructures[0].detail)
      : [];

  return (
    <AdminLayout>
      <div className="container-fluid text-start">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>{courseDetail.thai_course}</h3>
          <div className="action-buttons">
            <Link
              to={`/admin/editcourse/${courseDetail.course_id}`}
              className=" btn-edit"
            >
              <FaEdit className="me-2" />
              แก้ไข
            </Link>

            <button className=" btn-delete" onClick={deleteCourse}>
              <FaTrash className="me-2" />
              ลบ
            </button>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            {/* Basic Info */}
            <h5 className="mt-3">ข้อมูลหลักสูตร</h5>

            <p>
              <strong>สถานะ :</strong> {courseDetail.status}
            </p>
            <p>
              <strong>รหัสหลักสูตร :</strong> {courseDetail.course_id}
            </p>
            <p>
              <strong>ระดับปริญญา :</strong> {courseDetail.degree}
            </p>
            <p>
              <strong>สาขา :</strong> {courseDetail.major}
            </p>
            <p>
              <strong>ปีหลักสูตร :</strong> {courseDetail.year}
            </p>

            <p>
              <strong>ชื่อหลักสูตร (ไทย) :</strong> {courseDetail.thai_course}
            </p>
            <p>
              <strong>ชื่อหลักสูตร (อังกฤษ) :</strong> {courseDetail.eng_course}
            </p>

            <p>
              <strong>ชื่อปริญญา (ไทย) :</strong> {courseDetail.thai_degree}
            </p>
            <p>
              <strong>ชื่อปริญญา (อังกฤษ) :</strong> {courseDetail.eng_degree}
            </p>

            <p>
              <strong>หน่วยกิต :</strong> {courseDetail.credits}
            </p>
            <p>
              <strong>ค่าใช้จ่าย :</strong> {courseDetail.tuition}
            </p>

            <p>
              <strong>รายละเอียดเพิ่มเติม :</strong>{" "}
              <a
                href={courseDetail.detail_url}
                target="_blank"
                rel="noreferrer"
              >
                {courseDetail.detail_url}
              </a>
            </p>

            <hr />
            <h5>เกณฑ์การเข้าศึกษา</h5>
            <p>{courseDetail.admission_req}</p>

            <h5>เกณฑ์สำเร็จการศึกษา</h5>
            <p>{courseDetail.graduation_req}</p>

            <h5>ปรัชญาของหลักสูตร</h5>
            <p>{courseDetail.philosophy}</p>

            <h5>วัตถุประสงค์ของหลักสูตร</h5>
            <p>{courseDetail.objective}</p>

            <h5>PLOs</h5>
            <pre style={{ whiteSpace: "pre-wrap" }}>{courseDetail.plo}</pre>

            <h5>อาชีพที่ประกอบได้</h5>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {courseDetail.career_paths}
            </pre>

            <hr />

            {/* Structure */}
            <h5>โครงสร้างหลักสูตร</h5>

            {treeData.length === 0 ? (
              <p>ไม่มีข้อมูลโครงสร้างหลักสูตร</p>
            ) : (
              <div className="tree">
                <ul>
                  {treeData.map((node, i) => (
                    <TreeNode key={i} node={node} />
                  ))}
                </ul>
              </div>
            )}
            <hr />

            {/* Roadmap */}
            <h5>แผนการศึกษา</h5>
            {filteredRoadmap.map((rp, i) => (
              <img
                key={`${rp.roadmap_id}-${i}`}
                src={rp.roadmap_url}
                alt="roadmap"
                className="img-fluid mb-3 border"
              />
            ))}
            <hr />

            {/* Subjects */}
            <h5>รายวิชา</h5>

            {filteredSubjects.length === 0 ? (
              <p>ไม่มีรายวิชา</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>รหัสวิชา</th>
                    <th>ชื่อวิชา</th>
                    <th>หน่วยกิต</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map((subj, i) => (
                    <tr key={`${subj.id}-${i}`}>
                      <td>
                        <Link to={`/admin/subject/${subj.id}`}>
                          {subj.subject_id}
                        </Link>
                      </td>
                      <td>{subj.thai_subject}</td>
                      <td>{subj.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailCourse;
