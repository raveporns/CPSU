import React, { useState } from "react";
import "../css/navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar-component">
      <div className="container-fluid" id="navbar-component">
        <div className="nav-position">
          <Link
            to="/home"
            className="d-flex align-items-center text-decoration-none"
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src="/images/cpsu.png"
                alt="CPSU Logo"
                className="img-fluid"
                style={{ maxWidth: "50px" }}
              />

              <div>
                <h5
                  className="mb-0 text-muted text-start"
                  // style={{ margin: "5px" }}
                >
                ภาควิชาคอมพิวเตอร์
                </h5>
                <p className="mb-0 text-muted">
                คณะวิทยาศาสตร์ มหาวิทยาลัยศิลปากร
                </p>
              </div>
            </div>
          </Link>

          {/* Hamburger icon */}
          <div className="hamburger" onClick={toggleMenu}>
            ☰
          </div>
        </div>

        {/* Navigation links */}
        <div className={`layout-button-nav ${isOpen ? "open" : ""}`}>
          <Link to="/news" onClick={() => setIsOpen(false)}>
            ข่าวสาร
          </Link>
          <Link to="/personnel" onClick={() => setIsOpen(false)}>
            บุคลากร
          </Link>
          <Link to="/course" onClick={() => setIsOpen(false)}>
            หลักสูตร
          </Link>
          <Link to="/admission" onClick={() => setIsOpen(false)}>
            ข่าวการรับสมัคร
          </Link>
          <Link to="/document" onClick={() => setIsOpen(false)}>
            เอกสาร
          </Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>
            เกี่ยวกับภาควิชา
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
