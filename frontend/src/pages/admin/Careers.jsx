import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import api from "../../services/api";

const emptyForm = {
  name: "",
  category: "",
  description: "",
  requiredSkills: "",
  interests: "",
  behavioralTraits: "",
  preferredEducation: "",
  learningPath: "",
  isActive: true,
};

function Careers() {
  const [careers, setCareers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCareer, setEditingCareer] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  // =====================================================
  // LOAD CAREERS
  // =====================================================

  const loadCareers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/content/careers"
      );

      setCareers(
        Array.isArray(response.data?.careers)
          ? response.data.careers
          : []
      );
    } catch (err) {
      console.error(
        "Load admin careers error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load careers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareers();
  }, []);

  // =====================================================
  // CATEGORY LIST
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        careers
          .map((career) => career.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueCategories.sort()];
  }, [careers]);

  // =====================================================
  // FILTER CAREERS
  // =====================================================

  const filteredCareers = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return careers.filter((career) => {
      const matchesSearch =
        !searchText ||
        career.name
          ?.toLowerCase()
          .includes(searchText) ||
        career.category
          ?.toLowerCase()
          .includes(searchText) ||
        career.description
          ?.toLowerCase()
          .includes(searchText) ||
        career.requiredSkills?.some((skill) =>
          String(skill)
            .toLowerCase()
            .includes(searchText)
        );

      const matchesCategory =
        categoryFilter === "All" ||
        career.category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    careers,
    search,
    categoryFilter,
  ]);

  // =====================================================
  // OPEN CREATE MODAL
  // =====================================================

  const openCreateModal = () => {
    setEditingCareer(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (career) => {
    setEditingCareer(career);

    setForm({
      name: career.name || "",
      category: career.category || "",
      description:
        career.description || "",

      requiredSkills:
        Array.isArray(
          career.requiredSkills
        )
          ? career.requiredSkills.join(", ")
          : "",

      interests:
        Array.isArray(
          career.interests
        )
          ? career.interests.join(", ")
          : "",

      behavioralTraits:
        Array.isArray(
          career.behavioralTraits
        )
          ? career.behavioralTraits.join(", ")
          : "",

      preferredEducation:
        Array.isArray(
          career.preferredEducation
        )
          ? career.preferredEducation.join(", ")
          : "",

      learningPath:
        Array.isArray(
          career.learningPath
        )
          ? career.learningPath.join(", ")
          : "",

      isActive:
        career.isActive !== false,
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
    setEditingCareer(null);
    setForm(emptyForm);
  };

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // =====================================================
  // CONVERT COMMA TEXT TO ARRAY
  // =====================================================

  const convertToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  // =====================================================
  // CREATE / UPDATE CAREER
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name.trim(),

      category:
        form.category.trim(),

      description:
        form.description.trim(),

      requiredSkills:
        convertToArray(
          form.requiredSkills
        ),

      interests:
        convertToArray(
          form.interests
        ),

      behavioralTraits:
        convertToArray(
          form.behavioralTraits
        ),

      preferredEducation:
        convertToArray(
          form.preferredEducation
        ),

      learningPath:
        convertToArray(
          form.learningPath
        ),

      isActive:
        form.isActive,
    };

    if (
      !payload.name ||
      !payload.category ||
      !payload.description
    ) {
      setError(
        "Career name, category and description are required."
      );

      setSaving(false);
      return;
    }

    try {
      if (editingCareer) {
        await api.patch(
          `/admin/content/careers/${editingCareer._id}`,
          payload
        );

        setSuccess(
          "Career updated successfully."
        );
      } else {
        await api.post(
          "/admin/content/careers",
          payload
        );

        setSuccess(
          "Career created successfully."
        );
      }

      await loadCareers();

      setTimeout(() => {
        closeModal();
        setSuccess("");
      }, 700);
    } catch (err) {
      console.error(
        "Save career error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save career."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE CAREER
  // =====================================================

  const handleDelete = async (career) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${career.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/admin/content/careers/${career._id}`
      );

      setCareers((previous) =>
        previous.filter(
          (item) =>
            item._id !== career._id
        )
      );

      setSuccess(
        "Career deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete career error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete career."
      );
    }
  };

  // =====================================================
  // TOGGLE ACTIVE STATUS
  // =====================================================

  const toggleCareerStatus = async (
    career
  ) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/admin/content/careers/${career._id}`,
        {
          isActive:
            !career.isActive,
        }
      );

      setCareers((previous) =>
        previous.map((item) =>
          item._id === career._id
            ? {
                ...item,
                isActive:
                  !career.isActive,
              }
            : item
        )
      );

      setSuccess(
        `Career ${
          career.isActive
            ? "deactivated"
            : "activated"
        } successfully.`
      );
    } catch (err) {
      console.error(
        "Toggle career status error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update career status."
      );
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#020617] pb-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
                <BriefcaseBusiness
                  size={24}
                />
              </div>

              <div>

                <p className="text-sm font-medium text-blue-400">
                  Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Manage Careers
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Create, update and manage
                  career profiles used by the
                  recommendation system.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={
                openCreateModal
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Plus size={18} />
              Add Career
            </button>

          </div>
        </div>

        {/* =================================================
            MESSAGES
        ================================================== */}

        {success && (
          <div className="mb-5 rounded-xl border border-green-800 bg-green-950/40 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}

        {error &&
          !modalOpen && (
            <div className="mb-5 rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

        {/* =================================================
            FILTER BAR
        ================================================== */}

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
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search by career, category or skill..."
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />

            </div>

            <select
              value={
                categoryFilter
              }
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 lg:w-60"
            >

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}

            </select>

            <button
              type="button"
              onClick={loadCareers}
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

        {/* =================================================
            SUMMARY
        ================================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5">

            <p className="text-sm text-slate-400">
              Total Careers
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {careers.length}
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5">

            <p className="text-sm text-slate-400">
              Active Careers
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {
                careers.filter(
                  (career) =>
                    career.isActive
                ).length
              }
            </p>

          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5">

            <p className="text-sm text-slate-400">
              Search Results
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-400">
              {
                filteredCareers.length
              }
            </p>

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-12 text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

            <p className="mt-4 text-sm text-slate-400">
              Loading careers...
            </p>

          </div>
        )}

        {/* =================================================
            EMPTY
        ================================================== */}

        {!loading &&
          filteredCareers.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-[#0f172a] p-12 text-center">

              <BriefcaseBusiness
                size={42}
                className="mx-auto text-slate-600"
              />

              <h2 className="mt-4 text-lg font-semibold text-slate-200">
                No careers found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search
                or category filter.
              </p>

            </div>
          )}

        {/* =================================================
            DESKTOP TABLE
        ================================================== */}

        {!loading &&
          filteredCareers.length >
            0 && (
            <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] lg:block">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                  <thead>

                    <tr className="border-b border-slate-800 bg-slate-900/70">

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Career
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Required Skills
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Interests
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

                    {filteredCareers.map(
                      (career) => (
                        <tr
                          key={
                            career._id
                          }
                          className="border-b border-slate-800 last:border-b-0 hover:bg-slate-900/40"
                        >

                          {/* CAREER */}

                          <td className="px-5 py-5">

                            <div className="flex items-start gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                                <BriefcaseBusiness
                                  size={18}
                                />
                              </div>

                              <div>

                                <p className="font-semibold text-white">
                                  {
                                    career.name
                                  }
                                </p>

                                <p className="mt-1 max-w-[300px] text-xs leading-5 text-slate-500">
                                  {
                                    career.description
                                  }
                                </p>

                              </div>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          <td className="px-5 py-5">

                            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                              {
                                career.category
                              }
                            </span>

                          </td>

                          {/* SKILLS */}

                          <td className="px-5 py-5">

                            <div className="flex max-w-[280px] flex-wrap gap-1.5">

                              {career.requiredSkills
                                ?.slice(
                                  0,
                                  5
                                )
                                .map(
                                  (
                                    skill
                                  ) => (
                                    <span
                                      key={
                                        skill
                                      }
                                      className="rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-300"
                                    >
                                      {
                                        skill
                                      }
                                    </span>
                                  )
                                )}

                              {career.requiredSkills
                                ?.length >
                                5 && (
                                <span className="rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-500">
                                  +
                                  {career
                                    .requiredSkills
                                    .length -
                                    5}{" "}
                                  more
                                </span>
                              )}

                            </div>

                          </td>

                          {/* INTERESTS */}

                          <td className="px-5 py-5">

                            <div className="flex max-w-[220px] flex-wrap gap-1.5">

                              {career.interests
                                ?.slice(
                                  0,
                                  3
                                )
                                .map(
                                  (
                                    interest
                                  ) => (
                                    <span
                                      key={
                                        interest
                                      }
                                      className="rounded-md bg-purple-500/10 px-2 py-1 text-xs text-purple-400"
                                    >
                                      {
                                        interest
                                      }
                                    </span>
                                  )
                                )}

                            </div>

                          </td>

                          {/* STATUS */}

                          <td className="px-5 py-5">

                            <button
                              type="button"
                              onClick={() =>
                                toggleCareerStatus(
                                  career
                                )
                              }
                              className={
                                career.isActive
                                  ? "rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 transition hover:bg-green-500/20"
                                  : "rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 transition hover:bg-red-500/20"
                              }
                            >
                              {career.isActive
                                ? "Active"
                                : "Inactive"}
                            </button>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-5">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    career
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-blue-400 transition hover:bg-slate-800"
                                title="Edit Career"
                              >
                                <Edit3
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    career
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-red-400 transition hover:bg-red-950/40"
                                title="Delete Career"
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

        {/* =================================================
            MOBILE CARDS
        ================================================== */}

        {!loading &&
          filteredCareers.length >
            0 && (
            <div className="space-y-4 lg:hidden">

              {filteredCareers.map(
                (career) => (
                  <div
                    key={
                      career._id
                    }
                    className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                          <BriefcaseBusiness
                            size={18}
                          />
                        </div>

                        <div>

                          <h2 className="font-semibold text-white">
                            {
                              career.name
                            }
                          </h2>

                          <p className="mt-1 text-xs text-blue-400">
                            {
                              career.category
                            }
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleCareerStatus(
                            career
                          )
                        }
                        className={
                          career.isActive
                            ? "shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-xs text-green-400"
                            : "shrink-0 rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-400"
                        }
                      >
                        {career.isActive
                          ? "Active"
                          : "Inactive"}
                      </button>

                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {
                        career.description
                      }
                    </p>

                    <div className="mt-5">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Required Skills
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {career.requiredSkills?.map(
                          (skill) => (
                            <span
                              key={
                                skill
                              }
                              className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400"
                            >
                              {
                                skill
                              }
                            </span>
                          )
                        )}

                      </div>

                    </div>

                    {career.interests
                      ?.length >
                      0 && (
                      <div className="mt-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Interests
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          {career.interests.map(
                            (
                              interest
                            ) => (
                              <span
                                key={
                                  interest
                                }
                                className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs text-purple-400"
                              >
                                {
                                  interest
                                }
                              </span>
                            )
                          )}

                        </div>

                      </div>
                    )}

                    <div className="mt-5 flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            career
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-blue-400 hover:bg-slate-800"
                      >
                        <Edit3
                          size={16}
                        />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            career
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/40"
                      >
                        <Trash2
                          size={16}
                        />
                        Delete
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </div>

      {/* =================================================
          CREATE / EDIT MODAL
      ================================================== */}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">

          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0f172a] shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#0f172a] px-5 py-4 sm:px-6">

              <div>

                <h2 className="text-xl font-bold text-white">
                  {editingCareer
                    ? "Edit Career"
                    : "Add Career"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {editingCareer
                    ? "Update career information."
                    : "Create a new career profile."}
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

            {/* MODAL FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >

              {error && (
                <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* BASIC INFORMATION */}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>

                  <label className="text-sm font-medium text-slate-200">
                    Career Name *
                  </label>

                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Full Stack Developer"
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
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Software Development"
                    disabled={saving}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                  />

                </div>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="text-sm font-medium text-slate-200">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                  rows={4}
                  placeholder="Describe this career..."
                  disabled={saving}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />

              </div>

              {/* REQUIRED SKILLS */}

              <div>

                <label className="text-sm font-medium text-slate-200">
                  Required Skills
                </label>

                <input
                  name="requiredSkills"
                  value={
                    form.requiredSkills
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="JavaScript, React, Node.js, MongoDB"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate skills using commas.
                </p>

              </div>

              {/* INTERESTS */}

              <div>

                <label className="text-sm font-medium text-slate-200">
                  Interests
                </label>

                <input
                  name="interests"
                  value={
                    form.interests
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Web Development, Programming"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate interests using commas.
                </p>

              </div>

              {/* BEHAVIORAL TRAITS */}

              <div>

                <label className="text-sm font-medium text-slate-200">
                  Behavioral Traits
                </label>

                <input
                  name="behavioralTraits"
                  value={
                    form.behavioralTraits
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="logicalThinking, problemSolving, creativity"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  These are used by the behavioral
                  career recommendation system.
                </p>

              </div>

              {/* EDUCATION */}

              <div>

                <label className="text-sm font-medium text-slate-200">
                  Preferred Education
                </label>

                <input
                  name="preferredEducation"
                  value={
                    form.preferredEducation
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Computer Science, Information Technology"
                  disabled={saving}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate education fields using commas.
                </p>

              </div>

              {/* LEARNING PATH */}

              <div>

                <label className="text-sm font-medium text-slate-200">
                  Learning Path
                </label>

                <textarea
                  name="learningPath"
                  value={
                    form.learningPath
                  }
                  onChange={
                    handleChange
                  }
                  rows={3}
                  placeholder="HTML, CSS, JavaScript, React, Node.js, MongoDB"
                  disabled={saving}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-500 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Separate learning steps using commas.
                </p>

              </div>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    form.isActive
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                  className="h-4 w-4 accent-blue-600"
                />

                <span>

                  <span className="block text-sm font-medium text-slate-200">
                    Career is active
                  </span>

                  <span className="mt-1 block text-xs text-slate-500">
                    Active careers can be used by
                    the recommendation system.
                  </span>

                </span>

              </label>

              {/* ACTIONS */}

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
                    : editingCareer
                    ? "Update Career"
                    : "Create Career"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Careers;