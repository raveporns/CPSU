import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Headers from "../component/header";
import Navbar from "../component/navbar";
import Footer from "../component/footer";
import "../css/news_detail.css";
import Breadcrumb from "../component/Breadcrumb";

const NewsDetail = () => {
  const { news_id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/news/${news_id}`
        );
        setNews(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [news_id]);

  if (loading) return <p className="text-center mt-5">กำลังโหลด...</p>;
  if (!news) return <p className="text-center mt-5">ไม่พบข่าวที่ต้องการ</p>;

  return (
    <>
      <Headers />
      <Navbar />

      <Breadcrumb
        items={[
          { label: "ข่าวสาร", path: "/news" },
          { label: news?.title || "รายละเอียดข่าว" },
        ]}
      />

      <div className="container py-5">
        <div className="row">

          {/* ซ้าย : รูปข่าว */}
          <div className="col-md-5 mb-4">

            {news.images && news.images.length > 0 && (
              <>
                {/* รูปหลัก */}
                <div className="main-image">
                  <img
                    src={news.images[activeIndex].file_image}
                    className="main-img"
                    alt="news"
                  />
                </div>

                {/* Thumbnail */}
                {news.images.length > 1 && (
                  <div className="thumbnail-gallery">
                    {news.images.map((image, index) => (
                      <img
                        key={index}
                        src={image.file_image}
                        alt={`thumb-${index}`}
                        className={`thumb-img ${
                          activeIndex === index ? "active" : ""
                        }`}
                        onClick={() => setActiveIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

          </div>

          {/* ขวา : เนื้อหาข่าว */}
          <div className="col-md-7 text-start">

            <h2 className="mb-3">{news.title}</h2>

            <p className="text-muted mb-4">
              เผยแพร่เมื่อ{" "}
              {new Date(news.created_at).toLocaleString("th-TH", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>

            <div
              className="news-content"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default NewsDetail;