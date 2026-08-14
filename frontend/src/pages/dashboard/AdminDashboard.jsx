import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import SideBar from "../../components/layout/SideBar";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

// Admin Components
import AdminOverview from "../../components/dashboard/admin/AdminOverview";
import AllAssignmentsView from "../../components/dashboard/admin/AllAssignmentsView";
import AssignTeacherClassesSubjectsModal from "../../components/dashboard/admin/AssignTeacherClassesSubjectsModal";
import AssignTeachersModal from "../../components/dashboard/admin/AssignTeachersModal";
import ClassManagement from "../../components/dashboard/admin/ClassManagement";
import CreateClassModal from "../../components/dashboard/admin/CreateClassModal";
import CreateSubjectModal from "../../components/dashboard/admin/CreateSubjectModal";
import SystemSettings from "../../components/dashboard/admin/SystemSettings";
import UserManagement from "../../components/dashboard/admin/UserManagement";
import AlertMessage from "../../components/dashboard/common/AlertMessage";
import {
  SkeletonGrid,
  SkeletonList,
} from "../../components/dashboard/common/SkeletonCard";

//endpoints mapping
const TAB_DEPS = {
  overview: ["users", "classes", "subjects", "assignments"],
  users: ["users", "classes", "subjects", "teachers"],
  classes: ["classes", "subjects", "teachers"],
  assignments: ["assignments"],
  submissions: ["submissions"],
  settings: ["settings"],
};

//Fetch helpers
const FETCHERS = {
  users: () => api.get("/users").then((r) => r.data.users || []),
  classes: () => api.get("/classes").then((r) => r.data.classes || []),
  subjects: () => api.get("/subjects").then((r) => r.data.subjects || []),
  teachers: () => api.get("/users/teachers").then((r) => r.data.teachers || []),
  assignments: () =>
    api.get("/assignments").then((r) => r.data.assignments || []),
  submissions: () =>
    api.get("/submissions").then((r) => r.data.submissions || []),
  settings: () => api.get("/settings").then((r) => r.data.setting || {}),
};

const EMPTY_CLASS_FORM = {
  _id: null,
  name: "",
  code: "",
  academicYear: "2025-2026",
};
const EMPTY_SUBJECT_FORM = {
  _id: null,
  name: "",
  code: "",
  classId: "",
  assignedTeachers: [],
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  //Data store (only load what's been visited)
  const [data, setData] = useState({
    users: [],
    classes: [],
    subjects: [],
    teachers: [],
    assignments: [],
    submissions: [],
    settings: {},
  });
  const [loading, setLoading] = useState(false);
  const fetchedTabs = useRef(new Set()); // track which tabs have been loaded

  // UI state
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [showClassModal, setShowClassModal] = useState(false);
  const [classForm, setClassForm] = useState(EMPTY_CLASS_FORM);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [subjectForm, setSubjectForm] = useState(EMPTY_SUBJECT_FORM);
  const [selectedSubjectForAssign, setSelectedSubjectForAssign] =
    useState(null);
  const [selectedTeacherForAssign, setSelectedTeacherForAssign] =
    useState(null);

  const showMessage = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
  }, []);

  // Tab-based lazy fetch
  const fetchForTab = useCallback(async (tab, force = false) => {
    const deps = TAB_DEPS[tab] || [];
    const toFetch = force
      ? deps
      : deps.filter((key) => !fetchedTabs.current.has(key));

    if (toFetch.length === 0) return;

    setLoading(true);
    try {
      const results = await Promise.all(toFetch.map((key) => FETCHERS[key]()));
      setData((prev) => {
        const next = { ...prev };
        toFetch.forEach((key, i) => {
          next[key] = results[i];
        });
        return next;
      });
      toFetch.forEach((key) => fetchedTabs.current.add(key));
    } catch (err) {
      console.error("Failed to load tab data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount (overview tab)
  useEffect(() => {
    fetchForTab("overview");
  }, [fetchForTab]);

  // Fetch when tab changes
  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      setIsMobileMenuOpen(false);
      fetchForTab(tab);
    },
    [fetchForTab],
  );

  //Refresh keys to maintain 100% data consistency
  const refreshKeys = useCallback(async (...keys) => {
    try {
      const results = await Promise.all(keys.map((key) => FETCHERS[key]()));
      setData((prev) => {
        const next = { ...prev };
        keys.forEach((key, i) => {
          next[key] = results[i];
        });
        return next;
      });
    } catch (err) {
      console.error("Refresh failed:", err);
    }
  }, []);

  // Handlers
  const handleUserStatus = async (userId, currentStatus) => {
    try {
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) =>
          u._id === userId ? { ...u, currentStatus } : u,
        ),
      }));
      await api.patch(`/users/${userId}/status`, { currentStatus });
      showMessage(`User status updated to ${currentStatus}`);
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to update user status",
        "error",
      );
      refreshKeys("users");
    }
  };

  // ── Admin assigns / changes student class ──────────────────
  const handleUserClassChange = async (userId, classId) => {
    try {
      await api.put(`/users/${userId}`, { classId });
      showMessage("Class / Course assigned to user successfully!");
      refreshKeys("users");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to assign class to user",
        "error",
      );
    }
  };

  //Admin assigns multiple classes & subjects to teacher
  const handleSaveTeacherAssignments = async (
    teacherId,
    { assignedClasses, assignedSubjects },
  ) => {
    try {
      await api.put(`/users/${teacherId}`, {
        assignedClasses,
        assignedSubjects,
      });
      showMessage("Teacher classes & subjects updated successfully!");
      setSelectedTeacherForAssign(null);
      refreshKeys("users", "subjects");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to save teacher assignments",
        "error",
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u._id !== userId),
      }));
      await api.delete(`/users/${userId}`);
      showMessage("User deleted successfully");
    } catch (err) {
      showMessage("Failed to delete user", "error");
      refreshKeys("users");
    }
  };

  // Class Create & Edit Handlers
  const handleOpenCreateClassModal = () => {
    setClassForm(EMPTY_CLASS_FORM);
    setShowClassModal(true);
  };

  const handleOpenEditClassModal = (cls) => {
    setClassForm({
      _id: cls._id,
      name: cls.name,
      code: cls.code,
      academicYear: cls.academicYear || "2025-2026",
    });
    setShowClassModal(true);
  };

  const handleSaveClass = async (e) => {
    e.preventDefault();
    try {
      if (classForm._id) {
        // Edit Class
        await api.put(`/classes/${classForm._id}`, classForm);
        showMessage("Class / Course updated successfully!");
      } else {
        // Create Class
        await api.post("/classes", classForm);
        showMessage("Class created successfully!");
      }
      setShowClassModal(false);
      setClassForm(EMPTY_CLASS_FORM);
      // Guarantee full system-wide data consistency (updates subjects, users, assignments)
      refreshKeys("classes", "subjects", "users", "assignments");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to save class",
        "error",
      );
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      setData((prev) => ({
        ...prev,
        classes: prev.classes.filter((c) => c._id !== id),
      }));
      await api.delete(`/classes/${id}`);
      showMessage("Class deleted");
      refreshKeys("classes", "subjects", "users");
    } catch (err) {
      showMessage("Failed to delete class", "error");
      refreshKeys("classes");
    }
  };

  //Subject Create & Edit Handlers
  const handleOpenCreateSubjectModal = (prefilledClassId = "") => {
    setSubjectForm({ ...EMPTY_SUBJECT_FORM, classId: prefilledClassId });
    setShowSubjectModal(true);
  };

  const handleOpenEditSubjectModal = (sub) => {
    const classId = typeof sub.class === "object" ? sub.class?._id : sub.class;
    const teacherIds = (sub.assignedTeachers || []).map((t) =>
      typeof t === "object" ? t._id : t,
    );
    setSubjectForm({
      _id: sub._id,
      name: sub.name,
      code: sub.code,
      classId: classId || "",
      assignedTeachers: teacherIds,
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    try {
      if (subjectForm._id) {
        await api.put(`/subjects/${subjectForm._id}`, subjectForm);
        showMessage("Subject updated successfully!");
      } else {
        await api.post("/subjects", subjectForm);
        showMessage("Subject created successfully!");
      }
      setShowSubjectModal(false);
      setSubjectForm(EMPTY_SUBJECT_FORM);
      refreshKeys("subjects", "classes");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to save subject",
        "error",
      );
    }
  };

  const handleAssignTeachersToSubject = async (subjectId, assignedTeachers) => {
    try {
      await api.put(`/subjects/${subjectId}/assign-teachers`, {
        assignedTeachers,
      });
      showMessage("Teachers assigned to subject successfully!");
      setSelectedSubjectForAssign(null);
      refreshKeys("subjects");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to assign teachers",
        "error",
      );
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;
    try {
      setData((prev) => ({
        ...prev,
        subjects: prev.subjects.filter((s) => s._id !== id),
      }));
      await api.delete(`/subjects/${id}`);
      showMessage("Subject deleted");
    } catch (err) {
      showMessage("Failed to delete subject", "error");
      refreshKeys("subjects");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put("/settings", data.settings);
      showMessage("System settings updated successfully!");
    } catch (err) {
      showMessage("Failed to update settings", "error");
    }
  };

  const tabTitles = {
    overview: "Overview",
    users: "User Management",
    classes: "Classes & Curriculum",
    assignments: "All Assignments",
    submissions: "All Submissions",
    settings: "System Settings",
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      <SideBar
        user={user}
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          activeTabTitle={tabTitles[activeTab] || "Admin Portal"}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <AlertMessage message={message.text} type={message.type} />

          {loading && (activeTab === "users" || activeTab === "classes") && (
            <SkeletonList count={5} />
          )}
          {loading &&
            (activeTab === "overview" ||
              activeTab === "assignments" ||
              activeTab === "submissions") && <SkeletonGrid count={3} />}

          {!loading && activeTab === "overview" && (
            <AdminOverview
              usersList={data.users}
              classesList={data.classes}
              subjectsList={data.subjects}
              assignmentsList={data.assignments}
              onUserStatusChange={handleUserStatus}
            />
          )}
          {!loading && activeTab === "users" && (
            <UserManagement
              usersList={data.users}
              classesList={data.classes}
              subjectsList={data.subjects}
              onUserStatusChange={handleUserStatus}
              onUserClassChange={handleUserClassChange}
              onOpenTeacherAssignModal={(teacher) =>
                setSelectedTeacherForAssign(teacher)
              }
              onDeleteUser={handleDeleteUser}
            />
          )}
          {!loading && activeTab === "classes" && (
            <ClassManagement
              classesList={data.classes}
              subjectsList={data.subjects}
              onOpenClassModal={handleOpenCreateClassModal}
              onOpenEditClassModal={handleOpenEditClassModal}
              onOpenCreateSubjectModal={handleOpenCreateSubjectModal}
              onOpenEditSubjectModal={handleOpenEditSubjectModal}
              onOpenAssignTeachersModal={(sub) =>
                setSelectedSubjectForAssign(sub)
              }
              onDeleteClass={handleDeleteClass}
              onDeleteSubject={handleDeleteSubject}
            />
          )}
          {!loading &&
            (activeTab === "assignments" || activeTab === "submissions") && (
              <AllAssignmentsView
                assignmentsList={data.assignments}
                submissionsList={data.submissions}
              />
            )}
          {!loading && activeTab === "settings" && (
            <SystemSettings
              settings={data.settings}
              setSettings={(s) => setData((prev) => ({ ...prev, settings: s }))}
              onSaveSettings={handleSaveSettings}
            />
          )}
        </main>
      </div>

      {showClassModal && (
        <CreateClassModal
          classForm={classForm}
          setClassForm={setClassForm}
          onSubmit={handleSaveClass}
          onClose={() => setShowClassModal(false)}
        />
      )}
      {showSubjectModal && (
        <CreateSubjectModal
          subjectForm={subjectForm}
          setSubjectForm={setSubjectForm}
          classesList={data.classes}
          teachersList={data.teachers}
          onSubmit={handleSaveSubject}
          onClose={() => setShowSubjectModal(false)}
        />
      )}
      {selectedSubjectForAssign && (
        <AssignTeachersModal
          subject={selectedSubjectForAssign}
          teachersList={data.teachers}
          onSubmit={handleAssignTeachersToSubject}
          onClose={() => setSelectedSubjectForAssign(null)}
        />
      )}
      {selectedTeacherForAssign && (
        <AssignTeacherClassesSubjectsModal
          teacher={selectedTeacherForAssign}
          classesList={data.classes}
          subjectsList={data.subjects}
          onSubmit={handleSaveTeacherAssignments}
          onClose={() => setSelectedTeacherForAssign(null)}
        />
      )}
    </div>
  );
}
