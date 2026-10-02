import React, { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../api/axios";
import "../../css/admin/event.css";
import AdminLayout from "../../layout/AdminLayout";

function EventCalendarAdmin() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});

  /* ================= utils ================= */

  const toDateOnly = (iso) => iso.split("T")[0];

  const subtractOneDay = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const formatThaiDate = (iso) =>
    new Date(iso).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  /* ✅ เพิ่มอันนี้ */
  const toISO = (date) => {
    return date + "T00:00:00Z";
  };

  /* ================= Load Events ================= */

  const fetchEvents = useCallback(async () => {
    try {
      const res = await api.get("/admin/calendar");

      const formattedEvents = res.data.map((event) => {
        const start = event.start_date.split("T")[0];

        const endRaw = event.end_date ? event.end_date.split("T")[0] : start;

        const addOneDay = (dateStr) => {
          const d = new Date(dateStr);
          d.setDate(d.getDate() + 1);
          return d.toISOString().split("T")[0];
        };

        const end = start === endRaw ? undefined : addOneDay(endRaw);

        return {
          id: event.calendar_id,
          title: event.title,
          start: start,
          end: end,
          allDay: true,
          description: event.detail,
        };
      });

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /* ================= Modal Control ================= */

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setIsEditing(false);
    setIsAdding(false);
    setEditedEvent({});
  };

  const openAddModal = () => {
    const today = new Date().toISOString().split("T")[0];

    setEditedEvent({
      title: "",
      start: today,
      end: today,
      description: "",
    });

    setIsAdding(true);
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const event = events.find((e) => e.id === Number(info.event.id));

    setSelectedEvent(event);

    setEditedEvent({
      ...event,
      start: toDateOnly(event.start),
      end: event.end
        ? subtractOneDay(toDateOnly(event.end))
        : toDateOnly(event.start),
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= CRUD ================= */

  const handleAdd = async () => {
    if (!editedEvent.title || !editedEvent.start) {
      alert("กรุณากรอกชื่อกิจกรรมและวันเริ่ม");
      return;
    }

    try {
      await api.post("/admin/calendar", {
        title: editedEvent.title,
        detail: editedEvent.description || "-",
        start_date: toISO(editedEvent.start),
        end_date: toISO(editedEvent.end || editedEvent.start),
      });

      alert("เพิ่มกิจกรรมสำเร็จ");

      fetchEvents();
      closeModal();
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/calendar/${editedEvent.id}`, {
        title: editedEvent.title,
        detail: editedEvent.description || "-",
        start_date: toISO(editedEvent.start),
        end_date: toISO(editedEvent.end || editedEvent.start),
      });

      alert("บันทึกกิจกรรมสำเร็จ");
      fetchEvents();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("ต้องการลบกิจกรรมนี้หรือไม่?")) return;

    try {
      await api.delete(`/admin/calendar/${selectedEvent.id}`);
      alert("ลบกิจกรรมสำเร็จ");
      fetchEvents();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("ลบไม่สำเร็จ");
    }
  };

  /* ================= Render ================= */

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>ปฏิทินกิจกรรม</h3>
          <button className="btn-addcourse" onClick={openAddModal}>
            + เพิ่มกิจกรรม
          </button>
        </div>

        <div className="bg-white p-3 shadow rounded">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="th"
            events={events}
            eventClick={handleEventClick}
            displayEventTime={false}
            height="auto"
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isAdding
                    ? "เพิ่มกิจกรรม"
                    : isEditing
                      ? "แก้ไขกิจกรรม"
                      : "รายละเอียดกิจกรรม"}
                </h5>
                <button className="btn-close" onClick={closeModal} />
              </div>

              <div className="modal-body">
                {isAdding || isEditing ? (
                  <>
                    <input
                      className="form-control mb-2"
                      name="title"
                      placeholder="ชื่อกิจกรรม"
                      value={editedEvent.title}
                      onChange={handleChange}
                    />

                    <input
                      type="date"
                      className="form-control mb-2"
                      name="start"
                      value={editedEvent.start}
                      onChange={handleChange}
                    />

                    <input
                      type="date"
                      className="form-control mb-2"
                      name="end"
                      value={editedEvent.end}
                      onChange={handleChange}
                    />

                    <textarea
                      className="form-control"
                      name="description"
                      placeholder="รายละเอียด"
                      value={editedEvent.description || ""}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <p>
                      <b>ชื่อกิจกรรม :</b> {selectedEvent.title}
                    </p>

                    <p>
                      <b>วันเริ่ม :</b> {formatThaiDate(selectedEvent.start)}
                    </p>

                    <p>
                      <b>วันสิ้นสุด :</b>{" "}
                      {selectedEvent.end
                        ? formatThaiDate(subtractOneDay(selectedEvent.end))
                        : formatThaiDate(selectedEvent.start)}
                    </p>

                    <p>
                      <b>รายละเอียด:</b>
                      <br />
                      {selectedEvent.description || "-"}
                    </p>
                  </>
                )}
              </div>

              <div className="modal-footer">
                {isAdding && (
                  <>
                    <button className="btn btn-primary" onClick={handleAdd}>
                      บันทึก
                    </button>
                    <button className="btn btn-secondary" onClick={closeModal}>
                      ยกเลิก
                    </button>
                  </>
                )}

                {isEditing && (
                  <>
                    <button className="btn btn-primary" onClick={handleSave}>
                      บันทึก
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      ยกเลิก
                    </button>
                  </>
                )}

                {!isAdding && !isEditing && (
                  <>
                    <button
                      className="btn btn-warning"
                      onClick={() => setIsEditing(true)}
                    >
                      แก้ไข
                    </button>

                    <button className="btn btn-danger" onClick={handleDelete}>
                      ลบ
                    </button>

                    <button className="btn btn-secondary" onClick={closeModal}>
                      ปิด
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default EventCalendarAdmin;
