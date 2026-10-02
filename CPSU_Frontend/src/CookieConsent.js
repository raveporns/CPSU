import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");

    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    localStorage.setItem("cookie_consent_date", new Date().toISOString());

    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h3 style={styles.title}>🍪 การใช้คุกกี้</h3>

        <p style={styles.text}>
          เว็บไซต์นี้มีการใช้คุกกี้ที่จำเป็นต่อการทำงานของระบบ
          เพื่อให้ผู้ใช้งานได้รับประสบการณ์ที่ดีในการใช้งานเว็บไซต์
          การใช้งานเว็บไซต์ต่อถือว่าท่านยินยอมให้มีการใช้คุกกี้
        </p>

        <div style={styles.buttonGroup}>
          <button style={styles.acceptBtn} onClick={accept}>
            ยอมรับ
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "500px",
    zIndex: 9999,
  },
  box: {
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "1px solid #ddd",
  },
  title: {
    margin: 0,
    marginBottom: "6px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  text: {
    fontSize: "13px",
    color: "#444",
    marginBottom: "12px",
    lineHeight: "1.5",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
  },
  acceptBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#0d6efd",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
  },
};