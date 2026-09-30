import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  MessageSquare,
  X,
  Star,
  Save,
} from "lucide-react";

import api from "../../services/api";

function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedFeedback, setSelectedFeedback] =
    useState(null);

  const [status, setStatus] = useState("new");
  const [adminResponse, setAdminResponse] =
    useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/feedback"
      );

      setFeedback(
        response.data?.feedback || []
      );
    } catch (err) {
      console.error(
        "Load feedback error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const filteredFeedback = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return feedback.filter((item) => {
      const userName =
        item.user?.name?.toLowerCase() || "";

      const userEmail =
        item.user?.email?.toLowerCase() || "";

      const message =
        item.message?.toLowerCase() || "";

      const category =
        item.category?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        userName.includes(searchText) ||
        userEmail.includes(searchText) ||
        message.includes(searchText) ||
        category.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [
    feedback,
    search,
    statusFilter,
  ]);

  const openFeedback = (item) => {
    setSelectedFeedback(item);

    setStatus(item.status || "new");

    setAdminResponse(
      item.adminResponse || ""
    );
  };

  const closeFeedback = () => {
    if (saving) return;

    setSelectedFeedback(null);
    setAdminResponse("");
  };

  const updateFeedback = async () => {
    if (!selectedFeedback) return;

    try {
      setSaving(true);
      setError("");

      await api.patch(
        `/admin/feedback/${selectedFeedback._id}`,
        {
          status,
          adminResponse:
            adminResponse.trim(),
        }
      );

      setSelectedFeedback(null);

      await loadFeedback();
    } catch (err) {
      console.error(
        "Update feedback error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update feedback"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (value) => {
    if (value === "resolved") {
      return "bg-emerald-500/10 text-emerald-400";
    }

    if (value === "reviewed") {
      return "bg-blue-500/10 text-blue-400";
    }

    return "bg-amber-500/10 text-amber-400";
  };

  const averageRating =
    feedback.length > 0
      ? (
          feedback.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          ) / feedback.length
        ).toFixed(1)
      : "0.0";

  const resolvedCount = feedback.filter(
    (item) => item.status === "resolved"
  ).length;

  const newCount = feedback.filter(
    (item) => item.status === "new"
  ).length;

  return (
    <div className="min-h-screen bg-[#020617] pb-10 text-white">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-400">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            Manage Feedback
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Review student feedback and respond to users.
          </p>
        </div>

        <button
          type="button"
          onClick={loadFeedback}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-5">
          <p className="text-sm text-slate-400">
            Total Feedback
          </p>

          <p className="mt-2 text-2xl font-bold">
            {feedback.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-5">
          <p className="text-sm text-slate-400">
            New
          </p>

          <p className="mt-2 text-2xl font-bold text-amber-400">
            {newCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-5">
          <p className="text-sm text-slate-400">
            Resolved
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-400">
            {resolvedCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0f172a] p-5">
          <p className="text-sm text-slate-400">
            Average Rating
          </p>

          <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-yellow-400">
            {averageRating}
            <Star size={20} fill="currentColor" />
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0f172a] p-4 md:flex-row">
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
            placeholder="Search feedback, user or category..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
        >
          <option value="All">
            All Statuses
          </option>

          <option value="new">
            New
          </option>

          <option value="reviewed">
            Reviewed
          </option>

          <option value="resolved">
            Resolved
          </option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-3 text-slate-400">
            <RefreshCw
              size={20}
              className="animate-spin"
            />
            Loading feedback...
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!loading &&
        filteredFeedback.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0f172a] px-6 text-center">
            <MessageSquare
              size={42}
              className="text-slate-600"
            />

            <h2 className="mt-4 text-lg font-semibold">
              No feedback found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There is no feedback matching your filters.
            </p>
          </div>
        )}

      {/* DESKTOP TABLE */}
      {!loading &&
        filteredFeedback.length > 0 && (
          <div className="hidden overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b border-slate-800 bg-slate-950">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                      Rating
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                      Message
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredFeedback.map(
                    (item) => (
                      <tr
                        key={item._id}
                        className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-white">
                            {item.user?.name ||
                              "Unknown User"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.user?.email ||
                              "No email"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-300">
                          {item.category ||
                            "General"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star
                              size={15}
                              fill="currentColor"
                            />
                            <span>
                              {item.rating || 0}
                            </span>
                          </div>
                        </td>

                        <td className="max-w-[350px] px-5 py-4">
                          <p className="truncate text-sm text-slate-300">
                            {item.message ||
                              item.comment ||
                              "No message"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {item.status ||
                              "new"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-400">
                          {formatDate(
                            item.createdAt
                          )}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              openFeedback(item)
                            }
                            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-blue-400 hover:bg-blue-500/10"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* MOBILE */}
      {!loading &&
        filteredFeedback.length > 0 && (
          <div className="grid gap-4 lg:hidden">
            {filteredFeedback.map(
              (item) => (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-800 bg-[#0f172a] p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">
                        {item.user?.name ||
                          "Unknown User"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {item.user?.email}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${getStatusClass(
                        item.status
                      )}`}
                    >
                      {item.status || "new"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="text-slate-400">
                      {item.category ||
                        "General"}
                    </span>

                    <span className="flex items-center gap-1 text-yellow-400">
                      <Star
                        size={15}
                        fill="currentColor"
                      />
                      {item.rating || 0}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-slate-300">
                    {item.message ||
                      item.comment ||
                      "No message"}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      openFeedback(item)
                    }
                    className="mt-4 w-full rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10"
                  >
                    Review Feedback
                  </button>
                </div>
              )
            )}
          </div>
        )}

      {/* REVIEW MODAL */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-[#0f172a]">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold">
                  Review Feedback
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Update status and provide an admin response.
                </p>
              </div>

              <button
                type="button"
                onClick={closeFeedback}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              {/* USER */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <p className="text-xs text-slate-500">
                  User
                </p>

                <p className="mt-1 font-semibold text-white">
                  {selectedFeedback.user?.name ||
                    "Unknown User"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedFeedback.user?.email ||
                    "No email"}
                </p>
              </div>

              {/* CATEGORY + RATING */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">
                    Category
                  </p>

                  <p className="mt-1 text-sm text-slate-300">
                    {selectedFeedback.category ||
                      "General"}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <p className="text-xs text-slate-500">
                    Rating
                  </p>

                  <div className="mt-1 flex items-center gap-1 text-yellow-400">
                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    <span>
                      {selectedFeedback.rating ||
                        0}
                    </span>
                  </div>
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Feedback
                </label>

                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-300">
                  {selectedFeedback.message ||
                    selectedFeedback.comment ||
                    "No message provided."}
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="new">
                    New
                  </option>

                  <option value="reviewed">
                    Reviewed
                  </option>

                  <option value="resolved">
                    Resolved
                  </option>
                </select>
              </div>

              {/* ADMIN RESPONSE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Admin Response
                </label>

                <textarea
                  value={adminResponse}
                  onChange={(event) =>
                    setAdminResponse(
                      event.target.value
                    )
                  }
                  rows={5}
                  placeholder="Write a response to the user..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeFeedback}
                  disabled={saving}
                  className="rounded-lg border border-slate-700 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={updateFeedback}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Feedback;