import React, { useEffect } from "react";
import Navbar from "../component/navbar";
import Headers from "../component/header";
import Footer from "../component/footer";
import "../css/about.css";
import Breadcrumb from "../component/Breadcrumb";

const About = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <Headers />
      <Navbar />

      {/* Hero */}
      <div
        className="about-hero"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/banner-cusp3.png)",
        }}
      >
        <div className="hero-overlay">
          <h1>ภาควิชาคอมพิวเตอร์</h1>
          <p>Department of Computing</p>
        </div>
      </div>

      <Breadcrumb items={[{ label: "เกี่ยวกับภาควิชา", path: "/about" }]} />

      <div className="container about-container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* ================= History ================= */}

            <section className="about-section">
              <h4 className="text-start mb-4">ประวัติภาควิชา</h4>

              <div className="timeline white-box">
                <div className="timeline-item left fade-in">
                  <div className="timeline-icon">
                    <i className="bi bi-mortarboard"></i>
                  </div>
                  <div className="timeline-content">
                    <h5>พ.ศ. 2531</h5>
                    <p>
                      เริ่มเปิดสอนหลักสูตร{" "}
                      <strong>วิทยาศาสตรบัณฑิต สาขาวิทยาการคอมพิวเตอร์ </strong>
                      ภายใต้การดูแลของภาควิชาคณิตศาสตร์ คณะวิทยาศาสตร์
                      มหาวิทยาลัยศิลปากร
                    </p>
                  </div>
                </div>

                <div className="timeline-item right fade-in">
                  <div className="timeline-icon">
                    <i className="bi bi-journal-code"></i>
                  </div>
                  <div className="timeline-content">
                    <h5>พ.ศ. 2545</h5>
                    <p>
                      เปิดสอนหลักสูตร{" "}
                      <strong>
                        วิทยาศาสตรมหาบัณฑิต สาขาวิทยาการคอมพิวเตอร์
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="timeline-item left fade-in">
                  <div className="timeline-icon">
                    <i className="bi bi-building"></i>
                  </div>
                  <div className="timeline-content">
                    <h5>8 กันยายน พ.ศ. 2547</h5>
                    <p>
                      ได้รับอนุมัติจาก <strong> สภามหาวิทยาลัยศิลปากร</strong>
                      ให้จัดตั้งเป็น <strong>ภาควิชาคอมพิวเตอร์ </strong>{" "}
                      สังกัดคณะวิทยาศาสตร์
                    </p>
                  </div>
                </div>

                <div className="timeline-item right fade-in">
                  <div className="timeline-icon">
                    <i className="bi bi-lightbulb"></i>
                  </div>
                  <div className="timeline-content">
                    <h5>พ.ศ. 2547</h5>
                    <p>
                      เปิดสอนหลักสูตร{" "}
                      <strong>วิทยาศาสตรมหาบัณฑิต สาขาเทคโนโลยีสารสนเทศ</strong>
                    </p>
                  </div>
                </div>

                <div className="timeline-item left fade-in">
                  <div className="timeline-icon">
                    <i className="bi bi-laptop"></i>
                  </div>
                  <div className="timeline-content">
                    <h5>พ.ศ. 2548</h5>
                    <p>
                      เปิดสอนหลักสูตร{" "}
                      <strong>วิทยาศาสตรบัณฑิต สาขาเทคโนโลยีสารสนเทศ</strong>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= Contact ================= */}

            <section className="about-section white-box">
              <h4>ติดต่อภาควิชาคอมพิวเตอร์</h4>

              <div className="row">
                {/* Contact Info */}
                <div className="col-md-6">
                  <p>
                    <strong>ที่อยู่ (ภาษาไทย)</strong>
                    <br />
                    ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์ มหาวิทยาลัยศิลปากร
                    <br />
                    วิทยาเขตพระราชวังสนามจันทร์ ถนนราชมรรคาใน
                    <br />
                    อำเภอเมือง จังหวัดนครปฐม 73000
                  </p>

                  <p>
                    <strong>Address (English)</strong>
                    <br />
                    Department of Computing, Faculty of Science
                    <br />
                    Silpakorn University
                    <br />
                    Sanam Chandra Palace Campus
                    <br />
                    Muang District, Nakhon Pathom 73000
                  </p>

                  <p>
                    <strong>โทรศัพท์ (ภาควิชา)</strong>
                    <br />
                    0-3414-7014, 0-3414-7015
                  </p>

                  <p>
                    <strong>เบอร์กลางคณะ</strong>
                    <br />
                    0-3414-7001
                  </p>
                </div>

                {/* Map */}
                <div className="col-md-6">
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1937.1693423775325!2d100.03880173870269!3d13.81869014664506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30fcffa1b2043d1b%3A0x18c800b2e15effc7!2sSilpakorn%20University%2C%20Sanam%20Chandra%20Palace%20Campus!5e0!3m2!1sen!2sth!4v1758449318289!5m2!1sen!2sth"
                      width="100%"
                      height="350"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="แผนที่ภาควิชาคอมพิวเตอร์"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default About;
