import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import SideBar from "../../components/layout/SideBar";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

// Teacher Components
import AlertMessage from "../../components/dashboard/common/AlertMessage";
import {
  SkeletonGrid,
  SkeletonList,
} from "../../components/dashboard/common/SkeletonCard";
import CreateAssignmentModal from "../../components/dashboard/teacher/CreateAssignmentModal";
import GradeSubmissionModal from "../../components/dashboard/teacher/GradeSubmissionModal";
import MyAssignments from "../../components/dashboard/teacher/MyAssignments";
import SubmissionsGrading from "../../components/dashboard/teacher/SubmissionsGrading";
import TeacherOverview from "../../components/dashboard/teacher/TeacherOverview";
import TeacherSubjects from "../../components/dashboard/teacher/TeacherSubjects";

//tab mapping
const TAB_DEPS = {
  overview: ["assignments", "submissions", "subjects"],
  assignments: ["assignments", "classes", "subjects"],
  submissions: ["submissions"],
  subjects: ["subjects"],
};

const FETCHERS = {
  assignments: () =>
    api.get("/assignments").then((r) => r.data.assignments || []),
  submissions: () =>
    api.get("/submissions").then((r) => r.data.submissions || []),
  subjects: () => api.get("/subjects").then((r) => r.data.subjects || []),
  classes: () => api.get("/classes/public").then((r) => r.data.classes || []),
};

const EMPTY_FORM = {
  title: "",
  description: "",
  classId: "",
  subjectId: "",
  deadline: "",
  maxMarks: 100,
  status: "published",
  attachmentFile: null,
  existingAttachment: null,
  removeAttachment: "",
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [data, setData] = useState({
    assignments: [],
    submissions: [],
    subjects: [],
    classes: [],
  });
  const [loading, setLoading] = useState(false);
  const fetchedTabs = useRef(new Set());

  const [message, setMessage] = useState({ text: "", type: "success" });
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState(EMPTY_FORM);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({
    marks: "",
    feedback: "",
    status: "graded",
  });

  const showMessage = useCallback((text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
  }, []);

  const fetchForTab = useCallback(async (tab, force = false) => {
    const deps = TAB_DEPS[tab] || [];
    const toFetch = force
      ? deps
      : deps.filter((k) => !fetchedTabs.current.has(k));
    if (toFetch.length === 0) return;
    setLoading(true);
    try {
      const results = await Promise.all(toFetch.map((k) => FETCHERS[k]()));
      setData((prev) => {
        const next = { ...prev };
        toFetch.forEach((k, i) => {
          next[k] = results[i];
        });
        return next;
      });
      toFetch.forEach((k) => fetchedTabs.current.add(k));
    } catch (err) {
      console.error("Teacher tab fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchForTab("overview");
  }, [fetchForTab]);

  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab);
      setIsMobileMenuOpen(false);
      fetchForTab(tab);
    },
    [fetchForTab],
  );

  const refreshKeys = useCallback(async (...keys) => {
    const results = await Promise.all(keys.map((k) => FETCHERS[k]()));
    setData((prev) => {
      const next = { ...prev };
      keys.forEach((k, i) => {
        next[k] = results[i];
      });
      return next;
    });
  }, []);

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      // Build multipart FormData so file gets uploaded
      const fd = new FormData();
      fd.append("title", assignmentForm.title);
      fd.append("description", assignmentForm.description);
      fd.append("classId", assignmentForm.classId);
      fd.append("subjectId", assignmentForm.subjectId);
      fd.append("deadline", assignmentForm.deadline);
      fd.append("maxMarks", Number(assignmentForm.maxMarks));
      fd.append("status", assignmentForm.status);
      if (assignmentForm.attachmentFile) {
        fd.append("file", assignmentForm.attachmentFile);
      }
      if (assignmentForm.removeAttachment) {
        fd.append("removeAttachment", assignmentForm.removeAttachment);
      }

      if (editingId) {
        await api.put(`/assignments/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("Assignment updated successfully!");
      } else {
        await api.post("/assignments", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("Assignment created successfully!");
      }

      setShowAssignmentModal(false);
      setEditingId(null);
      setAssignmentForm(EMPTY_FORM);
      refreshKeys("assignments");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to save assignment",
        "error",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditAssignment = (asg) => {
    setEditingId(asg._id);
    const deadlineFormatted = asg.deadline
      ? new Date(asg.deadline).toISOString().slice(0, 16)
      : "";
    setAssignmentForm({
      _isEditing: true,
      title: asg.title || "",
      description: asg.description || "",
      classId: typeof asg.class === "object" ? asg.class?._id : asg.class || "",
      subjectId: typeof asg.subject === "object" ? asg.subject?._id : asg.subject || "",
      deadline: deadlineFormatted,
      maxMarks: asg.maxMarks || 100,
      status: asg.status || "published",
      attachmentFile: null,
      existingAttachment: asg.attachments?.[0] || null,
      removeAttachment: "",
    });
    setShowAssignmentModal(true);
  };

  const handleTogglePublish = async (asg) => {
    const newStatus = asg.status === "published" ? "draft" : "published";
    // Optimistic
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a._id === asg._id ? { ...a, status: newStatus } : a,
      ),
    }));
    try {
      await api.put(`/assignments/${asg._id}`, { status: newStatus });
    } catch {
      refreshKeys("assignments");
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    setData((prev) => ({
      ...prev,
      assignments: prev.assignments.filter((a) => a._id !== id),
    }));
    try {
      await api.delete(`/assignments/${id}`);
    } catch {
      refreshKeys("assignments");
    }
  };

  const handleOpenGradeModal = (sub) => {
    setSelectedSubmission(sub);
    setGradeForm({
      marks: sub.marks ?? "",
      feedback: sub.feedback || "",
      status: ["submitted", "resubmitted"].includes(sub.status)
        ? "graded"
        : sub.status,
    });
  };

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    if (!selectedSubmission) return;
    try {
      await api.put(`/submissions/${selectedSubmission._id}/grade`, gradeForm);
      setSelectedSubmission(null);
      showMessage("Submission graded successfully!");
      refreshKeys("submissions");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to grade submission",
        "error",
      );
    }
  };

  const pendingCount = data.submissions.filter((s) =>
    ["submitted", "resubmitted", "late"].includes(s.status),
  ).length;

  const tabTitles = {
    overview: "Overview",
    assignments: "My Assignments",
    submissions: "Submissions & Grading",
    subjects: "My Subjects",
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
          activeTabTitle={tabTitles[activeTab] || "Teacher Portal"}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <AlertMessage message={message.text} type={message.type} />

          {loading &&
            (activeTab === "assignments" || activeTab === "subjects") && (
              <SkeletonList count={4} />
            )}
          {loading &&
            (activeTab === "overview" || activeTab === "submissions") && (
              <SkeletonGrid count={3} />
            )}

          {!loading && activeTab === "overview" && (
            <TeacherOverview
              user={user}
              myAssignments={data.assignments}
              submissions={data.submissions}
              mySubjects={data.subjects}
              pendingGradingCount={pendingCount}
              onOpenGradeModal={handleOpenGradeModal}
            />
          )}
          {!loading && activeTab === "assignments" && (
            <MyAssignments
              myAssignments={data.assignments}
              onOpenCreateModal={() => {
                setEditingId(null);
                setAssignmentForm(EMPTY_FORM);
                setShowAssignmentModal(true);
              }}
              onEditAssignment={handleEditAssignment}
              onTogglePublish={handleTogglePublish}
              onDeleteAssignment={handleDeleteAssignment}
            />
          )}
          {!loading && activeTab === "submissions" && (
            <SubmissionsGrading
              submissions={data.submissions}
              onOpenGradeModal={handleOpenGradeModal}
            />
          )}
          {!loading && activeTab === "subjects" && (
            <TeacherSubjects mySubjects={data.subjects} />
          )}
        </main>
      </div>

      {showAssignmentModal && (
        <CreateAssignmentModal
          assignmentForm={assignmentForm}
          setAssignmentForm={setAssignmentForm}
          classesList={data.classes}
          mySubjects={data.subjects}
          onSubmit={handleSaveAssignment}
          onClose={() => setShowAssignmentModal(false)}
          isUploading={isUploading}
        />
      )}
      {selectedSubmission && (
        <GradeSubmissionModal
          submission={selectedSubmission}
          gradeForm={gradeForm}
          setGradeForm={setGradeForm}
          onSubmit={handleSaveGrade}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </div>
  );
}
