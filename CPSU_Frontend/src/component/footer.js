import React from "react";
import "../css/footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-component">
        {/* ข้อมูลการติดต่อ */}
        <div className="container text-center contact-info">
          <div className="row justify-content-center align-items-center text-center">
            <div className="col-auto" id="footer-icon-text">
              <i className="fas fa-phone-alt"></i> 0-3414-7014, 0-3414-7015,
              0-3427-2923
            </div>
            <div className="col-auto" id="footer-icon-text">
              <i className="fas fa-envelope"></i> cpsu@su.ac.th
            </div>
            <div className="col-auto" id="footer-icon-text">
              <i className="fas fa-map-marker-alt"></i> ภาควิชาคอมพิวเตอร์
              คณะวิทยาศาสตร์ ม.ศิลปากร นครปฐม 73000
            </div>
          </div>
        </div>

        {/* เนื้อหาหลักของ Footer */}
        <div className="footer-main">
          {/* โลโก้ + ชื่อภาควิชา */}
          <div className="footer-group-name">
            <img src="/cpsu.png" id="img-footer" alt="CPSU Logo" />
            <div>
              <h5 className="label-cpsu1-footer">ภาควิชาคอมพิวเตอร์</h5>
              <p className="label-cpsu2-footer">
                คณะวิทยาศาสตร์ มหาวิทยาลัยศิลปากร
              </p>
              <div className="footer-social">
                <p>ติดตามภาควิชา</p>
                <a href="https://www.facebook.com/computingsu">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.youtube.com/@ComputerSilpakorn">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </div>

          {/* ลิงก์ของ Footer */}
          <div className="footer-links">
            <div className="footer-column">
              <h5>หน้าทั้งหมด</h5>
              <ul>
                <li><Link to="/news" className="text-white text-decoration-none">ข่าวสาร</Link></li>
                <li><Link to="/personnel" className="text-white text-decoration-none">บุคลากร</Link></li>
                <li><Link to="/course" className="text-white text-decoration-none">หลักสูตร</Link></li>
                <li><Link to="/admission" className="text-white text-decoration-none">ข่าวการรับสมัคร</Link></li>
                <li><Link to="/document" className="text-white text-decoration-none">เอกสาร</Link></li>
                <li><Link to="/about" className="text-white text-decoration-none">เกี่ยวกับภาควิชา</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5>สำหรับผู้สนใจศึกษาต่อ</h5>
              <ul>
                <li><Link to="/news" className="text-white text-decoration-none">ข่าวสาร</Link></li>
                <li><Link to="/course" className="text-white text-decoration-none">หลักสูตร</Link></li>
                <li><Link to="/admission" className="text-white text-decoration-none">ข่าวการรับสมัคร</Link></li>
                <li><Link to="/about" className="text-white text-decoration-none">เกี่ยวกับภาควิชา</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5>สำหรับนักศึกษา</h5>
              <ul>
                <li><Link to="/news" className="text-white text-decoration-none">ข่าวสาร</Link></li>
                <li><Link to="/personnel" className="text-white text-decoration-none">บุคลากร</Link></li>
                <li><Link to="/course" className="text-white text-decoration-none">หลักสูตร</Link></li>
                <li><Link to="/document" className="text-white text-decoration-none">เอกสาร</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h5>สำหรับบุคลากร</h5>
              <ul>
                <li><Link to="/news" className="text-white text-decoration-none">ข่าวสาร</Link></li>
                <li><Link to="/personnel" className="text-white text-decoration-none">บุคลากร</Link></li>
                <li><Link to="/course" className="text-white text-decoration-none">หลักสูตร</Link></li>
                {/* <li><Link to="/login" className="text-white text-decoration-none">เข้าสู่ระบบ</Link></li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* ลิขสิทธิ์ */}
        <p className="footer-copy">
          เว็บไซต์นี้เป็นส่วนหนึ่งของปริญญานิพนธ์ ภาควิชาคอมพิวเตอร์ มหาวิทยาลัยศิลปากร
        </p>
      </div>
    </footer>
  );
};

export default Footer;
