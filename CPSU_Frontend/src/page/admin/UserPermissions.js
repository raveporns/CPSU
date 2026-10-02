import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import * as bootstrap from "bootstrap";
import "../../css/admin/user.css";
import AdminLayout from "../../layout/AdminLayout";

function UserPermissions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
  });

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const roleOptions = [
    { value: 1, label: "แอดมินสูงสุด" },
    { value: 2, label: "แอดมิน" },
    { value: 3, label: "อาจารย์" },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/user");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("โหลดรายชื่อผู้ใช้ไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!newUser.username.trim()) {
      alert("กรุณากรอก Username");
      return;
    }

    if (!newUser.email.trim()) {
      alert("กรุณากรอก Email");
      return;
    }

    try {
      await api.post("/admin/user", newUser);

      window.location.reload();
      alert("เพิ่มผู้ใช้สำเร็จ");

      setNewUser({ username: "", email: "" });
      await fetchUsers();

      const modalEl = document.getElementById("addUserModal");
      bootstrap.Modal.getInstance(modalEl)?.hide();
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "เพิ่มผู้ใช้ไม่สำเร็จ");
    }
  };

  const handleAssignRole = async () => {
    if (!selectedRole) {
      alert("กรุณาเลือกสิทธิ์ให้กับผู้ใช้");
      return;
    }

    if (!selectedUserId) {
      alert("ไม่พบข้อมูลผู้ใช้");
      return;
    }

    try {
      const role_id = Number(selectedRole);

      await api.post(`/admin/permission/user/${selectedUserId}`, {
        role_id,
      });

      alert("มอบหมายสิทธิ์ผู้ใช้เรียบร้อย");
      window.location.reload();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.user_id === selectedUserId
            ? { ...user, name: users.name }
            : user,
        ),
      );

      const modalEl = document.getElementById("assignRoleModal");
      bootstrap.Modal.getInstance(modalEl)?.hide();
    } catch (err) {
      console.error(err);
      alert("การกำหนดสิทธิ์ผู้ใช้ล้มเหลว");
    }
  };

  const openAssignRoleModal = (userId, currentRole) => {
    setSelectedUserId(userId);

    if (currentRole) {
      setSelectedRole(currentRole);
    } else {
      setSelectedRole("");
    }

    const modalEl = document.getElementById("assignRoleModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบข้อมูลผู้ใช้ใช่หรือไม่?")) return;

    try {
      await api.delete(`/admin/user/${id}`);
      setUsers((prev) => prev.filter((item) => item.user_id !== id));
      alert("ลบผู้ใช้สำเร็จ");
    } catch (error) {
      console.error(error);
      alert("ลบข้อมูลไม่สำเร็จ");
    }
  };
  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>กำหนดสิทธิ์ผู้ใช้</h3>
          <div className="d-flex gap-2">
            {/* dropdown filter */}
            <select
              className="form-select"
              style={{ width: 200 }}
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              <option value="rootadmin">แอดมินสูงสุด</option>
              <option value="admin">แอดมิน</option>
              <option value="teacher">อาจารย์</option>
              <option value="none">ยังไม่กำหนด</option>
            </select>

            <button
              className="btn-addcourse"
              data-bs-toggle="modal"
              data-bs-target="#addUserModal"
            >
              + เพิ่มผู้ใช้
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light text-center">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>สิทธิ์การเข้าถึง</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    กำลังโหลด...
                  </td>
                </tr>
              ) : (
                users
                  .filter((u) => {
                    if (!filterRole) return true;

                    if (filterRole === "none") {
                      return !u.name;
                    }

                    return u.name === filterRole;
                  })
                  .map((u) => (
                    <tr key={u.user_id} className="align-middle">
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        {u.name === "rootadmin"
                          ? "แอดมินสูงสุด"
                          : u.name === "admin"
                            ? "แอดมิน"
                            : u.name === "teacher"
                              ? "อาจารย์"
                              : "- ยังไม่กำหนดสิทธิ์ -"}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            openAssignRoleModal(u.user_id, u.role_id)
                          }
                        >
                          <i className="fas fa-user-pen"></i>
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>

        {/* Assign Role Modal */}
        <div
          className="modal fade"
          id="assignRoleModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">แก้ไขสิทธิ์ผู้ใช้</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label>เลือกสิทธิ์</label>

                  <select
                    className="form-select"
                    value={selectedRole || ""}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    {selectedRole === "" && (
                      <option value="" disabled>
                        - ยังไม่ได้กำหนดสิทธิ์ -
                      </option>
                    )}

                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                {/* ปุ่มลบ */}
                <button
                  className="btn btn-danger me-auto"
                  onClick={() => {
                    handleDelete(selectedUserId);

                    const modalEl = document.getElementById("assignRoleModal");

                    bootstrap.Modal.getInstance(modalEl)?.hide();
                  }}
                >
                  ลบผู้ใช้
                </button>

                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  ยกเลิก
                </button>

                <button className="btn btn-primary" onClick={handleAssignRole}>
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add User Modal */}
        <div
          className="modal fade"
          id="addUserModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">เพิ่มผู้ใช้ใหม่</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                />
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label>
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    className="form-control"
                    required
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>

                {/* <div className="mb-3">
                  <label>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  />
                </div> */}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  ยกเลิก
                </button>
                <button className="btn btn-primary" onClick={handleRegister}>
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default UserPermissions;
