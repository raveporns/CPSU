// AppRoutes.js
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import News from "./page/news";
import NewsDetail from "./page/news_detail";
// import Admission from "./page/admission";
import Personnel from "./page/personnel";
import Course from "./page/course";
import Subject from "./page/subject";

import AddNews from "./page/admin/news_add";
import DetailNews from "./page/admin/news_detail";
import EditNews from "./page/admin/news_edit";

import Courseadmin from "./page/admin/course";
import Addcourse from "./page/admin/course_add";
import Editcourse from "./page/admin/course_edit";
import Detailcourse from "./page/admin/course_detail";

import Subjectadmin from "./page/admin/subject";
import AddSubject from "./page/admin/subject_add";
import EditSubject from "./page/admin/subject_edit";
import DetailSubject from "./page/admin/subject_detail";

import PersonnelAdmin from "./page/admin/personnel";
import AddPersonnel from "./page/admin/personnel_add";
import EditPersonnel from "./page/admin/personnel_edit";
import DetailPersonnel from "./page/admin/personnel_detail";

import TeacherDetail from "./page/personnel_teacher_detail";
import StaffDetail from "./page/personnel_staff_detail";
import Homepage from "./page/homepage";
import NewsAdmin from "./page/admin/news";
import About from "./page/about";
import Login from "./component/login";
import CourseDetail from "./page/course_detail";
import Document from "./page/document";
import EventCalendarAdmin from "./page/admin/EventCalendarAdmin";
import UserPermissions from "./page/admin/UserPermissions";
import SubjectDetail from "./page/subject_detail";

import EditTeacherInfomation from "./page/teacher/editinfomation";
import TeacherInfomation from "./page/teacher/infomation";

import Dashboard from "./page/admin/dashboard";
import EventCalendarPublic from "./page/EventCalendarPublic";
import Admission from "./page/admission";
import AdmissionAdmin from "./page/admin/admission";
import AddAdmission from "./page/admin/admission_add";
import EditAdmission from "./page/admin/admission_edit";

import History from "./page/admin/history";
import Manual from "./page/admin/manual";
import Research from "./page/admin/research";
import Unauthorized from "./page/Unauthorized";
import NotFound from "./page/NotFound";

import DocumentAdmin from "./page/admin/document";


const AppRoutes = () => {
  const RequireAuth = () => {
    const token = localStorage.getItem("access_token");
    return token ? <Outlet /> : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />

      {/* Admin Group */}

      <Route element={<RequireAuth />}>
        <Route path="/admin">
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="news" element={<NewsAdmin />} />
          <Route path="addnews" element={<AddNews />} />
          <Route path="news/:id" element={<DetailNews />} />
          <Route path="editnews/:id" element={<EditNews />} />

          <Route path="course" element={<Courseadmin />} />
          <Route path="addcourse" element={<Addcourse />} />
          <Route path="course/:id" element={<Detailcourse />} />
          <Route path="editcourse/:id" element={<Editcourse />} />

          <Route path="subject" element={<Subjectadmin />} />
          <Route path="addsubject" element={<AddSubject />} />
          <Route path="subject/:id" element={<DetailSubject />} />
          <Route path="editsubject/:id" element={<EditSubject />} />

          <Route path="personnel" element={<PersonnelAdmin />} />
          <Route path="addpersonnel" element={<AddPersonnel />} />
          <Route path="personnel/:id" element={<DetailPersonnel />} />
          <Route path="editpersonnel/:id" element={<EditPersonnel />} />

          <Route path="calendar" element={<EventCalendarAdmin />} />

          <Route path="userpermissions" element={<UserPermissions />} />

          <Route path="admission" element={<AdmissionAdmin />} />
          <Route path="admission/add" element={<AddAdmission />} />
          <Route path="admission/edit/:id" element={<EditAdmission />} />

          <Route path="history" element={<History />} />
          <Route path="manual" element={<Manual />} />
          <Route path="research" element={<Research />} />

          <Route path="document" element={<DocumentAdmin />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="/teacher">
          <Route path="information" element={<TeacherInfomation />} />
          <Route path="informationedit" element={<EditTeacherInfomation />} />
        </Route>
      </Route>

      <Route path="/login" element={<Login />}></Route>
      <Route path="/home" element={<Homepage />}></Route>
      <Route path="/personnel" element={<Personnel />} />
      <Route path="/course" element={<Course />} />
      <Route path="/course/:course_id" element={<CourseDetail />} />
      <Route path="/subject" element={<Subject />} />
      <Route path="/news" element={<News />} />
      <Route path="/news/:news_id" element={<NewsDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/document" element={<Document />} />
      <Route path="/staff/:id" element={<StaffDetail />} />
      <Route path="/teacher/:id" element={<TeacherDetail />} />
      <Route path="/subject/:subject_id" element={<SubjectDetail />} />
      <Route path="/calendar" element={<EventCalendarPublic />} />
      <Route path="/admission" element={<Admission />} />
    </Routes>
  );
};

export default AppRoutes;
