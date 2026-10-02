import React, { useEffect, useState } from "react";
import "../../css/admin/news_detail.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";
import { FaEdit, FaTrash } from "react-icons/fa";

const DetailNews = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const deleteNews = async () => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข่าวนี้?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/news/${id}`);
      alert("ลบข่าวสารสำเร็จ");
      navigate("/admin/news");
    } catch (error) {
      console.error("Error deleting news:", error);

      if (error.response?.status === 401) {
        alert("กรุณาเข้าสู่ระบบใหม่");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get(`/admin/news/${id}`);
        setNews(response.data);
      } catch (error) {
        console.log("Error fetching news details", error);
      }
    };

    fetchNews();
  }, [id]);

  const images = news?.images || [];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="card shadow-sm">
          <div className="card-body">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div className="d-flex align-items-center mb-3">
                  <h4 className="mb-0">
                    <Link
                      to="/admin/news"
                      className="me-2 text-decoration-none"
                    >
                      &lt;
                    </Link>
                    {news?.title || "กำลังโหลด..."}
                  </h4>
                </div>

                {news?.created_at && (
                  <small className="text-muted">
                    {new Date(news.created_at).toLocaleString("th-TH", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </small>
                )}
              </div>

              <div className="action-buttons">
                <Link
                  to={`/admin/editnews/${news?.news_id}`}
                  className="btn-edit"
                >
                  <FaEdit className="me-2" />
                  แก้ไข
                </Link>

                <button className="btn-delete" onClick={deleteNews}>
                  <FaTrash className="me-2" />
                  ลบ
                </button>
              </div>
            </div>

            {/* Carousel */}
            {images.length > 0 ? (
              <>
                <div className="carousel-wrapper">
                  <img
                    src={images[activeIndex].file_image}
                    className="news-image"
                    alt="news"
                  />

                  {images.length > 1 && (
                    <>
                      <button className="carousel-btn prev" onClick={prevSlide}>
                        ‹
                      </button>

                      <button className="carousel-btn next" onClick={nextSlide}>
                        ›
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail */}
                <div className="thumbnail-container">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img.file_image}
                      alt={`thumb-${index}`}
                      className={`thumbnail ${
                        activeIndex === index ? "active-thumb" : ""
                      }`}
                      onClick={() => setActiveIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <img
                src="/images/cpsu.png"
                className="img-fluid mb-4"
                style={{ maxHeight: "450px", objectFit: "cover" }}
                alt="default"
              />
            )}

            {/* Content */}
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{
                __html: news?.content || "",
              }}
            />

            {/* Detail URL */}
            <div>
              <h6 className="fw-bold">รายละเอียดเพิ่มเติม</h6>

              {news?.detail_url && news.detail_url !== "null" ? (
                news.detail_url.split("\n").map((line, index) => (
                  <div key={index}>
                    <a href={line} target="_blank" rel="noopener noreferrer">
                      {line}
                    </a>
                  </div>
                ))
              ) : (
                <p>-</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DetailNews;
