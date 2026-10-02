import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../css/admin/news_edit.css";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";

import Cropper from "react-easy-crop";
import Button from "@mui/material/Button";
import { getOrientation } from "get-orientation/browser";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(1);
  const [urlDetail, setUrlDetail] = useState("");

  const [fileImage, setFileImage] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);

  // ⭐ ใช้ state รูปตัวเดียว
  const [images, setImages] = useState([]);

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetailNews = async () => {
      try {
        const res = await api.get(`/admin/news/${id}`);
        const data = res.data;

        setTitle(data.title || "");
        setContent(data.content || "");
        setCategory(data.type_id || 1);
        setUrlDetail(data.detail_url || "");
        setCoverUrl(data.cover_image || null);

        if (data.images) {
          const imgs = data.images
            .map((img) => img.file_image)
            .filter((url) => url !== data.cover_image)
            .map((url) => ({
              type: "existing",
              url: url,
            }));

          setImages(imgs);
        }
      } catch (err) {
        console.error("Error fetching news details", err);
      }
    };

    fetchDetailNews();
  }, [id]);

  // upload รูปใหม่
  const onNewsImagesChange = (e) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const newImgs = files.map((file) => ({
      type: "new",
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImgs]);
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], "cover.jpg", { type: blob.type });

      setFileImage(file);
      setCoverUrl(URL.createObjectURL(blob));
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    let imageDataUrl = await readFile(file);

    try {
      await getOrientation(file);
    } catch {
      console.warn("failed to detect orientation");
    }

    setImageSrc(imageDataUrl);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("type_id", String(category));
    formData.append("detail_url", urlDetail || "");

    if (fileImage) {
      formData.append("cover_image", fileImage);
    } else if (coverUrl) {
      const res = await fetch(coverUrl);
      const blob = await res.blob();
      const file = new File([blob], "cover.jpg", { type: blob.type });

      formData.append("cover_image", file);
    }

    for (const img of images) {
      if (img.type === "new") {
        formData.append("images", img.file);
      } else {
        const res = await fetch(img.url);
        const blob = await res.blob();
        const file = new File([blob], "image.jpg", { type: blob.type });

        formData.append("images", file);
      }
    }

    try {
      await api.put(`/admin/news/${id}`, formData);

      alert("แก้ไขข่าวสารสำเร็จ");
      navigate(`/admin/news/${id}`);
    } catch (err) {
      console.error("Error submitting news", err.response?.data);
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid">
        <h4 className="mb-4">แก้ไขข่าวสาร</h4>

        <div className="card shadow-sm">
          <div className="card-body">
            {imageSrc ? (
              <>
                <div
                  style={{ position: "relative", width: "100%", height: 400 }}
                >
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>

                <div className="text-center mt-4">
                  <Button
                    variant="contained"
                    onClick={showCroppedImage}
                    sx={{
                      backgroundColor: "#173390",
                      "&:hover": { backgroundColor: "#0b1a4a" },
                    }}
                  >
                    ตกลง
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEdit}>
                {/* title */}
                <div className="mb-3">
                  <label className="form-label">
                    หัวข้อข่าว <span className="text-danger">*</span>
                  </label>
                  <input
                    required
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* content */}
                <div className="mb-3">
                  <label className="form-label">
                    เนื้อหา <span className="text-danger">*</span>
                  </label>
                  <CKEditor
                    required
                    editor={ClassicEditor}
                    data={content}
                    onChange={(e, editor) => setContent(editor.getData())}
                  />
                </div>

                {/* category */}
                <div className="mb-3">
                  <label className="form-label">
                    ประเภท <span className="text-danger">*</span>
                  </label>
                  <select
                    required
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(Number(e.target.value))}
                  >
                    <option value={1}>ข่าวประชาสัมพันธ์</option>
                    <option value={2}>ทุนการศึกษา</option>
                    <option value={3}>รางวัลที่ได้รับ</option>
                    <option value={4}>กิจกรรมของภาควิชา</option>
                  </select>
                </div>

                {/* detail url */}
                <div className="mb-3">
                  <label className="form-label">รายละเอียดข่าว</label>
                  <input
                    className="form-control"
                    value={urlDetail}
                    onChange={(e) => setUrlDetail(e.target.value)}
                  />
                </div>

                {/* cover */}
                <div className="mb-4 text-start">
                  <label className="form-label">
                    รูปปก <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={onFileChange}
                  />

                  {coverUrl && (
                    <div className="mt-3 position-relative d-inline-block">
                      <img
                        src={coverUrl}
                        alt="cover"
                        className="img-fluid rounded"
                        style={{ maxWidth: "300px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => {
                          setCoverUrl(null);
                          setFileImage(null);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* images */}
                <div className="mb-4 text-start">
                  <label className="form-label">
                    รูปข่าว <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    multiple
                    className="form-control"
                    onChange={onNewsImagesChange}
                  />

                  {images.length > 0 && (
                    <div className="mt-3 d-flex flex-wrap gap-3">
                      {images.map((img, idx) => (
                        <div key={idx} className="position-relative">
                          <img
                            src={
                              img.type === "existing" ? img.url : img.preview
                            }
                            className="img-thumbnail"
                            style={{ width: "150px" }}
                            alt=""
                          />

                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() =>
                              setImages((prev) =>
                                prev.filter((_, i) => i !== idx),
                              )
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-center d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => navigate(`/admin/news/${id}`)}
                  >
                    ยกเลิก
                  </button>

                  <button type="submit" className="btn btn-primary px-4">
                    บันทึกการแก้ไข
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function getCroppedImg(imageSrc, crop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg");
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

export default EditNews;
