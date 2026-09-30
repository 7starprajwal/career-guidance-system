import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import api from "../../services/api";

const emptyForm = {
  courseId: "",
  title: "",
  skill: "",
  category: "",
  level: "Beginner",
  duration: "",
  description: "",
  topics: "",
  provider: "Career Guidance Learning",
  type: "Learning Path",
  isActive: true,
};

function Courses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  // =====================================================
  // LOAD COURSES
  // =====================================================

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/courses"
      );

      setCourses(
        Array.isArray(response.data?.courses)
          ? response.data.courses
          : []
      );
    } catch (err) {
      console.error(
        "Load admin courses error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load courses."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // =====================================================
  // CATEGORY LIST
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        courses
          .map((course) => course.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories.sort()];
  }, [courses]);

  // =====================================================
  // FILTER COURSES
  // =====================================================

  const filteredCourses = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !searchText ||
        course.title
          ?.toLowerCase()
          .includes(searchText) ||
        course.skill
          ?.toLowerCase()
          .includes(searchText) ||
        course.courseId
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        categoryFilter === "All" ||
        course.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    courses,
    search,
    categoryFilter,
  ]);

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = () => {
    setEditingCourse(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (course) => {
    setEditingCourse(course);

    setForm({
      courseId: course.courseId || "",
      title: course.title || "",
      skill: course.skill || "",
      category: course.category || "",
      level: course.level || "Beginner",
      duration: course.duration || "",
      description:
        course.description || "",
      topics: Array.isArray(course.topics)
        ? course.topics.join(", ")
        : "",
      provider:
        course.provider ||
        "Career Guidance Learning",
      type:
        course.type ||
        "Learning Path",
      isActive:
        course.isActive !== false,
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setEditingCourse(null);
    setForm(emptyForm);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // CREATE / UPDATE
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      courseId: form.courseId.trim(),
      title: form.title.trim(),
      skill: form.skill.trim(),
      category: form.category.trim(),
      level: form.level,
      duration: form.duration.trim(),
      description:
        form.description.trim(),
      topics: form.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean),
      provider:
        form.provider.trim() ||
        "Career Guidance Learning",
      type:
        form.type.trim() ||
        "Learning Path",
      isActive: form.isActive,
    };

    if (
      !payload.courseId ||
      !payload.title ||
      !payload.skill ||
      !payload.category ||
      !payload.duration
    ) {
      setError(
        "Course ID, title, skill, category and duration are required."
      );

      setSaving(false);
      return;
    }

    try {
      if (editingCourse) {
        await api.patch(
          `/admin/courses/${editingCourse._id}`,
          payload
        );

        setSuccess(
          "Course updated successfully."
        );
      } else {
        await api.post(
          "/admin/courses",
          payload
        );

        setSuccess(
          "Course created successfully."
        );
      }

      await loadCourses();

      setTimeout(() => {
        closeModal();
        setSuccess("");
      }, 700);
    } catch (err) {
      console.error(
        "Save course error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save course."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE COURSE
  // =====================================================

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/courses/${course._id}`
      );

      setCourses((previous) =>
        previous.filter(
          (item) =>
            item._id !== course._id
        )
      );

      setSuccess(
        "Course deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete course error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete course."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-10 text-white">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                <BookOpen size={24} />
              </div>

              <div>
                <p className="text-sm font-medium text-blue-400">
                  Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Manage Courses
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Create, update and manage learning
                  courses available to students.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Plus size={18} />
              Add Course
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        {success && (
          <div className="mb-5 rounded-xl border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {error && !modalOpen && (
          <div className="mb-5 rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* FILTER BAR */}
        <div className="mb-6 rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by course, skill or course ID..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 lg:w-56"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadCourses}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
              Refresh
            </button>
          </div>
        </div>

        {/* COURSE COUNT */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredCourses.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">
              {courses.length}
            </span>{" "}
            courses
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading courses...
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          filteredCourses.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-[#0f172a] p-12 text-center">
              <BookOpen
                size={42}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-4 text-lg font-semibold text-slate-200">
                No courses found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or category
                filter.
              </p>
            </div>
          )}

        {/* DESKTOP TABLE */}
        {!loading &&
          filteredCourses.length > 0 && (
            <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/70">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Course
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Skill
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Level
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Duration
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCourses.map(
                      (course) => (
                        <tr
                          key={course._id}
                          className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/40"
                        >
                          <td className="px-5 py-5">
                            <div>
                              <p className="font-semibold text-white">
                                {course.title}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {course.courseId}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-300">
                            {course.skill}
                          </td>

                          <td className="px-5 py-5">
                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                              {course.category}
                            </span>
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-300">
                            {course.level}
                          </td>

                          <td className="px-5 py-5 text-sm text-slate-300">
                            {course.duration}
                          </td>

                          <td className="px-5 py-5">
                            <span
                              className={
                                course.isActive
                                  ? "rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400"
                                  : "rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400"
                              }
                            >
                              {course.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    course
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-blue-400 transition hover:bg-slate-800"
                                title="Edit"
                              >
                                <Edit3
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    course
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-red-400 transition hover:bg-red-950/40"
                                title="Delete"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* MOBILE CARDS */}
        {!loading &&
          filteredCourses.length > 0 && (
            <div className="space-y-4 lg:hidden">
              {filteredCourses.map(
                (course) => (
                  <div
                    key={course._id}
                    className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-white">
                          {course.title}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {course.courseId}
                        </p>
                      </div>

                      <span
                        className={
                          course.isActive
                            ? "shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400"
                            : "shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400"
                        }
                      >
                        {course.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-900 p-3">
                        <p className="text-xs text-slate-500">
                          Skill
                        </p>

                        <p className="mt-1 text-sm text-slate-200">
                          {course.skill}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-900 p-3">
                        <p className="text-xs text-slate-500">
                          Level
                        </p>

                        <p className="mt-1 text-sm text-slate-200">
                          {course.level}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-900 p-3">
                        <p className="text-xs text-slate-500">
                          Category
                        </p>

                        <p className="mt-1 text-sm text-slate-200">
                          {course.category}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-900 p-3">
                        <p className="text-xs text-slate-500">
                          Duration
                        </p>

                        <p className="mt-1 text-sm text-slate-200">
                          {course.duration}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(course)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-blue-400 hover:bg-slate-800"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(course)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/40"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0f172a] shadow-2xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#0f172a] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {editingCourse
                    ? "Edit Course"
                    : "Add Course"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingCourse
                    ? "Update course information."
                    : "Create a new learning course."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800 disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {error && (
                <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Course ID *
                  </label>

                  <input
                    name="courseId"
                    value={form.courseId}
                    onChange={handleChange}
                    placeholder="course-012"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Course Title *
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="React Development"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Skill *
                  </label>

                  <input
                    name="skill"
                    value={form.skill}
                    onChange={handleChange}
                    placeholder="React"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Category *
                  </label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Frontend Development"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Level
                  </label>

                  <select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 disabled:opacity-60"
                  >
                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Duration *
                  </label>

                  <input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="14 days"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Provider
                  </label>

                  <input
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    placeholder="Career Guidance Learning"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">
                    Type
                  </label>

                  <input
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Learning Path"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe what students will learn..."
                  disabled={saving}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">
                  Topics
                </label>

                <input
                  name="topics"
                  value={form.topics}
                  onChange={handleChange}
                  placeholder="HTML, CSS, Flexbox, Grid"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate topics using commas.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  disabled={saving}
                  className="h-4 w-4 accent-blue-600"
                />

                <span>
                  <span className="block text-sm font-medium text-slate-200">
                    Course is active
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Active courses can be shown to students.
                  </span>
                </span>
              </label>

              {/* MODAL ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {saving && (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingCourse
                    ? "Update Course"
                    : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;