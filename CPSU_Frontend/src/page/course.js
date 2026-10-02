import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../component/navbar";
import Headers from "../component/header";
import Footer from "../component/footer";
import "../css/course.css";
import { Link } from "react-router-dom";
import Breadcrumb from "../component/Breadcrumb";

const DEGREE_ORDER = ["ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"];

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/course");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  // filter เฉพาะที่แสดง
  const visibleCourses = courses.filter((c) => c.status === "แสดง");

  // เรียงปีใหม่ไปเก่า
  const sortedCourses = [...visibleCourses].sort((a, b) => b.year - a.year);

  // จัดกลุ่ม
  const grouped = {};
  sortedCourses.forEach((course) => {
    if (!grouped[course.degree]) grouped[course.degree] = {};
    if (!grouped[course.degree][course.major])
      grouped[course.degree][course.major] = [];
    grouped[course.degree][course.major].push(course);
  });

  if (loading) {
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
  }

  return (
    <>
      <Headers />
      <Navbar />
      <Breadcrumb items={[{ label: "หลักสูตร", path: "/course" }]} />
      <div className="container my-5">
        {DEGREE_ORDER.map((degree) =>
          grouped[degree] ? (
            <div key={degree} className="degree-section mb-4">
              <h2 className="degree-header mb-3">
                {"หลักสูตร"}
                {degree}
              </h2>

              {Object.entries(grouped[degree]).map(([major, courseList]) => (
                <div key={major} className="major-section mb-3">
                  <h4>{major}</h4>

                  <div className="course-card-container">
                    {courseList.map((course) => (
                      <Link
                        key={course.course_id}
                        to={`/course/${course.course_id}`}
                        className="card course-card text-decoration-none text-dark"
                      >
                        <div className="card-body">
                          <h5 className="course-card-title">
                            {course.thai_course} ({course.year})
                          </h5>
                          <p className="course-card-eng">{course.eng_course}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null,
        )}
      </div>

      <Footer />
    </>
  );
};

export default Course;
