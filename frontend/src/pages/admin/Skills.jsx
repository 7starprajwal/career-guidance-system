import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Edit3,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import api from "../../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingSkill, setEditingSkill] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    level: "Beginner",
    description: "",
  });

  // =========================================================
  // LOAD SKILLS
  // =========================================================

  const loadSkills = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(
        "/admin/content/skills"
      );

      const data = response.data;

      const skillData =
        data?.skills ||
        data?.data ||
        [];

      setSkills(
        Array.isArray(skillData)
          ? skillData
          : []
      );
    } catch (requestError) {
      console.error(
        "Load skills error:",
        requestError
      );

      setError(
        requestError?.response?.data?.message ||
          "Unable to load skills from the server."
      );

      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const values = skills
      .map(
        (skill) =>
          skill?.category ||
          skill?.type ||
          ""
      )
      .filter(Boolean);

    return [
      "All",
      ...Array.from(
        new Set(values)
      ),
    ];
  }, [skills]);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredSkills = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return skills.filter((skill) => {
      const name =
        skill?.name ||
        skill?.skill ||
        "";

      const category =
        skill?.category ||
        skill?.type ||
        "";

      const matchesSearch =
        !searchValue ||
        name
          .toLowerCase()
          .includes(searchValue) ||
        category
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        categoryFilter === "All" ||
        category === categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    skills,
    search,
    categoryFilter,
  ]);

  // =========================================================
  // ADD MODAL
  // =========================================================

  const openAddModal = () => {
    setEditingSkill(null);

    setForm({
      name: "",
      category: "",
      level: "Beginner",
      description: "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================================================
  // EDIT MODAL
  // =========================================================

  const openEditModal = (skill) => {
    setEditingSkill(skill);

    setForm({
      name:
        skill?.name ||
        skill?.skill ||
        "",
      category:
        skill?.category ||
        skill?.type ||
        "",
      level:
        skill?.level ||
        "Beginner",
      description:
        skill?.description ||
        "",
    });

    setError("");
    setSuccess("");
    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowModal(false);
    setEditingSkill(null);

    setForm({
      name: "",
      category: "",
      level: "Beginner",
      description: "",
    });
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE SKILL
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name =
      form.name.trim();

    const category =
      form.category.trim();

    const description =
      form.description.trim();

    if (!name) {
      setError(
        "Skill name is required."
      );
      return;
    }

    if (!category) {
      setError(
        "Skill category is required."
      );
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name,
        category,
        level: form.level,
        description,
      };

      if (editingSkill) {
        const skillId =
          editingSkill?._id ||
          editingSkill?.id;

        if (!skillId) {
          throw new Error(
            "Skill ID is missing."
          );
        }

        await api.put(
          `/admin/content/skills/${skillId}`,
          payload
        );

        setSuccess(
          "Skill updated successfully."
        );
      } else {
        await api.post(
          "/admin/content/skills",
          payload
        );

        setSuccess(
          "Skill created successfully."
        );
      }

      await loadSkills();

      setTimeout(() => {
        setShowModal(false);
        setEditingSkill(null);
        setSuccess("");
      }, 700);
    } catch (requestError) {
      console.error(
        "Save skill error:",
        requestError
      );

      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to save the skill."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE SKILL
  // =========================================================

  const handleDelete = async (skill) => {
    const skillId =
      skill?._id ||
      skill?.id;

    const skillName =
      skill?.name ||
      skill?.skill ||
      "this skill";

    if (!skillId) {
      setError(
        "Skill ID is missing."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${skillName}"?`
      );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await api.delete(
        `/admin/content/skills/${skillId}`
      );

      setSuccess(
        "Skill deleted successfully."
      );

      await loadSkills();

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (requestError) {
      console.error(
        "Delete skill error:",
        requestError
      );

      setError(
        requestError?.response?.data?.message ||
          "Unable to delete the skill."
      );
    }
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-screen bg-[#020617] pb-10 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-medium text-blue-400">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Skill Management
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage the skills used by the Career Guidance System.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          <button
            type="button"
            onClick={loadSkills}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Plus size={18} />

            Add Skill
          </button>

        </div>
      </div>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 size={18} />

          <span>{success}</span>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-800 bg-[#0f172a] p-4">

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">

          <div className="relative">

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
              placeholder="Search skills..."
              className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />

          </div>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value
              )
            }
            className="h-11 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none focus:border-blue-500"
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

        </div>

      </div>

      {/* =====================================================
          COUNT
      ===================================================== */}

      <div className="mb-4 flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400">
          <Activity size={20} />
        </div>

        <div>

          <p className="text-sm font-semibold text-white">
            {filteredSkills.length} Skills
          </p>

          <p className="text-xs text-slate-500">
            Showing matching skills
          </p>

        </div>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {[1, 2, 3, 4, 5, 6].map(
            (item) => (
              <div
                key={item}
                className="h-40 animate-pulse rounded-2xl border border-slate-800 bg-[#0f172a]"
              />
            )
          )}

        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        filteredSkills.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-10 text-center">

            <Activity
              size={40}
              className="mx-auto text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold text-white">
              No skills found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or add a new skill.
            </p>

          </div>
        )}

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      {!loading &&
        filteredSkills.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] md:block">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[760px]">

                <thead>

                  <tr className="border-b border-slate-800 bg-slate-900/50">

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Skill
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Level
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Description
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSkills.map(
                    (skill, index) => {

                      const name =
                        skill?.name ||
                        skill?.skill ||
                        "Unnamed Skill";

                      const category =
                        skill?.category ||
                        skill?.type ||
                        "General";

                      const level =
                        skill?.level ||
                        "Beginner";

                      const description =
                        skill?.description ||
                        "No description available.";

                      return (
                        <tr
                          key={
                            skill?._id ||
                            skill?.id ||
                            `${name}-${index}`
                          }
                          className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/30"
                        >

                          <td className="px-5 py-4">

                            <p className="font-semibold text-white">
                              {name}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                              {category}
                            </span>

                          </td>

                          <td className="px-5 py-4">

                            <span className="text-sm text-slate-300">
                              {level}
                            </span>

                          </td>

                          <td className="max-w-md px-5 py-4">

                            <p className="truncate text-sm text-slate-400">
                              {description}
                            </p>

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    skill
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
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
                                    skill
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-red-500 hover:text-red-400"
                                title="Delete"
                              >
                                <Trash2
                                  size={16}
                                />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      {/* =====================================================
          MOBILE CARDS
      ===================================================== */}

      {!loading &&
        filteredSkills.length > 0 && (
          <div className="grid gap-4 md:hidden">

            {filteredSkills.map(
              (skill, index) => {

                const name =
                  skill?.name ||
                  skill?.skill ||
                  "Unnamed Skill";

                const category =
                  skill?.category ||
                  skill?.type ||
                  "General";

                const level =
                  skill?.level ||
                  "Beginner";

                const description =
                  skill?.description ||
                  "No description available.";

                return (
                  <div
                    key={
                      skill?._id ||
                      skill?.id ||
                      `${name}-${index}`
                    }
                    className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <h2 className="truncate text-lg font-semibold text-white">
                          {name}
                        </h2>

                        <div className="mt-2 flex flex-wrap gap-2">

                          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                            {category}
                          </span>

                          <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-400">
                            {level}
                          </span>

                        </div>

                      </div>

                      <Activity
                        size={20}
                        className="shrink-0 text-blue-400"
                      />

                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {description}
                    </p>

                    <div className="mt-5 flex gap-2 border-t border-slate-800 pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(
                            skill
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-blue-400"
                      >
                        <Edit3 size={16} />

                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            skill
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        <Trash2 size={16} />

                        Delete
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      {/* =====================================================
          MODAL
      ===================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-6">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

              <div>

                <h2 className="text-lg font-bold text-white">
                  {editingSkill
                    ? "Edit Skill"
                    : "Add Skill"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the skill information below.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5"
            >

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Skill Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: React"
                  className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />

              </div>

              {/* Category */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Example: Frontend"
                  className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />

              </div>

              {/* Level */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Level
                </label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none focus:border-blue-500"
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

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe this skill..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />

              </div>

              {/* Modal Error */}

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving && (
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingSkill
                    ? "Update Skill"
                    : "Create Skill"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Skills;