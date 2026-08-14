import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../../components/layout/Header";
import SideBar from "../../components/layout/SideBar";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

// Student Components
import AlertMessage from "../../components/dashboard/common/AlertMessage";
import {
  SkeletonGrid,
  SkeletonList,
} from "../../components/dashboard/common/SkeletonCard";
import StudentAssignments from "../../components/dashboard/student/StudentAssignments";
import StudentOverview from "../../components/dashboard/student/StudentOverview";
import StudentSubmissions from "../../components/dashboard/student/StudentSubmissions";
import SubmitAnswerModal from "../../components/dashboard/student/SubmitAnswerModal";

// ─── Tab → which data keys are needed ────────────────────────
const TAB_DEPS = {
  overview: ["assignments", "submissions"],
  assignments: ["assignments", "submissions"],
  submissions: ["submissions"],
};

const FETCHERS = {
  assignments: () =>
    api.get("/assignments").then((r) => r.data.assignments || []),
  submissions: () =>
    api.get("/submissions").then((r) => r.data.submissions || []),
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [data, setData] = useState({ assignments: [], submissions: [] });
  const [loading, setLoading] = useState(false);
  const fetchedTabs = useRef(new Set());

  const [message, setMessage] = useState({ text: "", type: "success" });
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitForm, setSubmitForm] = useState({
    answer: "",
    attachmentFile: null,
    existingFileName: "",
    existingFileUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      console.error("Student tab fetch error:", err);
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

  const handleOpenSubmitModal = (asg) => {
    setSelectedAssignment(asg);
    const existing = data.submissions.find(
      (s) => s.assignment?._id === asg._id,
    );
    if (existing) {
      setSubmitForm({
        answer: existing.answer || "",
        attachmentFile: null,
        existingFileName: existing.attachments?.[0]?.fileName || "",
        existingFileUrl: existing.attachments?.[0]?.fileUrl || "",
      });
    } else {
      setSubmitForm({
        answer: "",
        attachmentFile: null,
        existingFileName: "",
        existingFileUrl: "",
      });
    }
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setIsSubmitting(true);
    try {
      // Send as multipart/form-data so the file reaches multer
      const fd = new FormData();
      fd.append("assignmentId", selectedAssignment._id);
      fd.append("answer", submitForm.answer);
      if (submitForm.attachmentFile) {
        fd.append("file", submitForm.attachmentFile);
      }

      await api.post("/submissions", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showMessage("Assignment submitted successfully!");
      setSelectedAssignment(null);
      refreshKeys("submissions");
    } catch (err) {
      showMessage(
        err.response?.data?.message || "Failed to submit assignment",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabTitles = {
    overview: "Dashboard",
    assignments: "My Assignments",
    submissions: "My Submissions",
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
          activeTabTitle={tabTitles[activeTab] || "Student Portal"}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <AlertMessage message={message.text} type={message.type} />

          {loading && activeTab === "submissions" && <SkeletonList count={4} />}
          {loading &&
            (activeTab === "overview" || activeTab === "assignments") && (
              <SkeletonGrid count={3} />
            )}

          {!loading && activeTab === "overview" && (
            <StudentOverview
              user={user}
              setActiveTab={setActiveTab}
              assignments={data.assignments}
              submissions={data.submissions}
              onOpenSubmitModal={handleOpenSubmitModal}
            />
          )}
          {!loading && activeTab === "assignments" && (
            <StudentAssignments
              assignments={data.assignments}
              submissions={data.submissions}
              onOpenSubmitModal={handleOpenSubmitModal}
            />
          )}
          {!loading && activeTab === "submissions" && (
            <StudentSubmissions submissions={data.submissions} />
          )}
        </main>
      </div>

      {selectedAssignment && (
        <SubmitAnswerModal
          assignment={selectedAssignment}
          submitForm={submitForm}
          setSubmitForm={setSubmitForm}
          onSubmit={handleSubmitAssignment}
          onClose={() => setSelectedAssignment(null)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
