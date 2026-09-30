import { useEffect, useState } from "react";

import {
  AlertCircle,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Eye,
  GraduationCap,
  Heart,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Shield,
  Target,
  Trash2,
  User,
  Users as UsersIcon,
  X,
} from "lucide-react";

import api from "../../services/api";

// ============================================================
// MAIN USERS PAGE
// ============================================================

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const [deleteLoading, setDeleteLoading] = useState("");

  // ============================================================
  // LOAD USERS
  // ============================================================

  const loadUsers = async (showFullLoader = false) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await api.get("/admin/users");

      const userList = response.data?.users || [];

      setUsers(
        Array.isArray(userList)
          ? userList
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load users:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadUsers(true);
  }, []);

  // ============================================================
  // VIEW USER
  // ============================================================

  const handleViewUser = async (userId) => {
    try {
      setViewLoading(true);
      setViewError("");
      setSelectedUser(null);

      const response = await api.get(
        `/admin/users/${userId}`
      );

      const user = response.data?.user;

      if (!user) {
        throw new Error(
          "User details were not found."
        );
      }

      setSelectedUser(user);
    } catch (err) {
      console.error(
        "Failed to load user details:",
        err
      );

      setViewError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load user details."
      );
    } finally {
      setViewLoading(false);
    }
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeUserModal = () => {
    setSelectedUser(null);
    setViewError("");
    setViewLoading(false);
  };

  // ============================================================
  // DELETE USER
  // ============================================================

  const handleDeleteUser = async (
    userId,
    userName
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleteLoading(userId);

      await api.delete(
        `/admin/users/${userId}`
      );

      setUsers((previous) =>
        previous.filter(
          (user) => user._id !== userId
        )
      );

      if (selectedUser?._id === userId) {
        closeUserModal();
      }
    } catch (err) {
      console.error(
        "Delete user error:",
        err
      );

      window.alert(
        err.response?.data?.message ||
          "Failed to delete user."
      );
    } finally {
      setDeleteLoading("");
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return <UsersSkeleton />;
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
          <PageHeader />

          <div className="mt-7 rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                <AlertCircle size={22} />
              </div>

              <div className="min-w-0">
                <h2 className="font-semibold text-white">
                  Unable to load users
                </h2>

                <p className="mt-1 break-words text-sm text-slate-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    loadUsers(true)
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <>
      <div className="min-h-screen bg-[#020617] text-white">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
          <PageHeader />

          {/* ====================================================
              SUMMARY
          ==================================================== */}

          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
            {/* TOTAL USERS */}

            <div className="rounded-2xl border border-slate-800/90 bg-[#0f172a] p-4 shadow-lg shadow-black/5 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 sm:text-sm">
                    Registered Users
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-white sm:text-3xl">
                      {users.length}
                    </p>

                    <span className="text-xs text-slate-500">
                      accounts
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 sm:h-12 sm:w-12">
                  <UsersIcon size={22} />
                </div>
              </div>
            </div>

            {/* REFRESH */}

            <div className="rounded-2xl border border-slate-800/90 bg-[#0f172a] p-4 shadow-lg shadow-black/5 sm:p-5">
              <button
                type="button"
                onClick={() =>
                  loadUsers(false)
                }
                disabled={refreshing}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto sm:w-auto sm:px-5"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh Users"}
              </button>
            </div>
          </div>

          {/* ====================================================
              EMPTY STATE
          ==================================================== */}

          {users.length === 0 ? (
            <EmptyUsers />
          ) : (
            <>
              {/* ==================================================
                  DESKTOP TABLE
              ================================================== */}

              <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-xl shadow-black/10 lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#111a2e]">
                        <TableHeading>
                          User
                        </TableHeading>

                        <TableHeading>
                          Role
                        </TableHeading>

                        <TableHeading>
                          Career
                        </TableHeading>

                        <TableHeading>
                          Skills
                        </TableHeading>

                        <TableHeading>
                          Registered
                        </TableHeading>

                        <TableHeading center>
                          Actions
                        </TableHeading>
                      </tr>
                    </thead>

                    <tbody>
                      {users.map((user) => (
                        <DesktopUserRow
                          key={user._id}
                          user={user}
                          formatDate={
                            formatDate
                          }
                          onView={
                            handleViewUser
                          }
                          onDelete={
                            handleDeleteUser
                          }
                          deleteLoading={
                            deleteLoading
                          }
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ==================================================
                  MOBILE + TABLET CARDS
              ================================================== */}

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
                {users.map((user) => (
                  <MobileUserCard
                    key={user._id}
                    user={user}
                    formatDate={
                      formatDate
                    }
                    onView={
                      handleViewUser
                    }
                    onDelete={
                      handleDeleteUser
                    }
                    deleteLoading={
                      deleteLoading
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================
          USER MODAL
      ======================================================== */}

      {(viewLoading ||
        selectedUser ||
        viewError) && (
        <UserDetailsModal
          loading={viewLoading}
          user={selectedUser}
          error={viewError}
          onClose={closeUserModal}
          formatDate={formatDate}
        />
      )}
    </>
  );
}

// ============================================================
// PAGE HEADER
// ============================================================

function PageHeader() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-400 sm:text-sm">
        Administration
      </p>

      <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:mt-2 sm:text-3xl lg:text-4xl">
        Users
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
        Manage registered users and review
        their career guidance information.
      </p>
    </div>
  );
}

// ============================================================
// DESKTOP TABLE HEADING
// ============================================================

function TableHeading({
  children,
  center = false,
}) {
  return (
    <th
      className={`
        px-5
        py-4
        text-left
        text-[11px]
        font-semibold
        uppercase
        tracking-[0.1em]
        text-slate-500
        xl:px-6
        xl:py-5
        ${center ? "text-center" : ""}
      `}
    >
      {children}
    </th>
  );
}

// ============================================================
// DESKTOP USER ROW
// ============================================================

function DesktopUserRow({
  user,
  formatDate,
  onView,
  onDelete,
  deleteLoading,
}) {
  const profile = user.profile || {};

  const skills = Array.isArray(
    profile.skills
  )
    ? profile.skills
    : [];

  const userName =
    user.name || "Unknown User";

  const career =
    profile.preferredCareer ||
    "Not set";

  return (
    <tr className="border-b border-slate-800/80 last:border-b-0 transition hover:bg-white/[0.025]">
      {/* USER */}

      <td className="px-5 py-5 xl:px-6">
        <div className="flex min-w-[220px] items-center gap-3">
          <Avatar
            name={userName}
            image={user.profileImage}
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white xl:text-[15px]">
              {userName}
            </p>

            <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500 xl:text-sm">
              {user.email || "No email"}
            </p>
          </div>
        </div>
      </td>

      {/* ROLE */}

      <td className="px-5 py-5 xl:px-6">
        <RoleBadge
          role={user.role || "student"}
        />
      </td>

      {/* CAREER */}

      <td className="px-5 py-5 xl:px-6">
        <div className="flex max-w-[190px] items-center gap-2">
          <BriefcaseBusiness
            size={15}
            className="shrink-0 text-slate-500"
          />

          <p className="truncate text-sm text-slate-300">
            {career}
          </p>
        </div>
      </td>

      {/* SKILLS */}

      <td className="px-5 py-5 xl:px-6">
        {skills.length > 0 ? (
          <div className="flex max-w-[300px] flex-wrap gap-1.5">
            {skills
              .slice(0, 3)
              .map(
                (skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-300"
                  >
                    {skill}
                  </span>
                )
              )}

            {skills.length > 3 && (
              <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-1 text-[11px] font-medium text-slate-400">
                +{skills.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-slate-600">
            No skills
          </span>
        )}
      </td>

      {/* DATE */}

      <td className="whitespace-nowrap px-5 py-5 xl:px-6">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <CalendarDays
            size={15}
            className="text-slate-600"
          />

          {formatDate(
            user.createdAt
          )}
        </div>
      </td>

      {/* ACTIONS */}

      <td className="px-5 py-5 xl:px-6">
        <div className="flex justify-center gap-2">
          <ActionButton
            title="View user details"
            onClick={() =>
              onView(user._id)
            }
            icon={<Eye size={18} />}
          />

          <ActionButton
            title="Delete user"
            danger
            disabled={
              deleteLoading ===
              user._id
            }
            onClick={() =>
              onDelete(
                user._id,
                userName
              )
            }
            icon={
              deleteLoading ===
              user._id ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={18} />
              )
            }
          />
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// MOBILE / TABLET USER CARD
// ============================================================

function MobileUserCard({
  user,
  formatDate,
  onView,
  onDelete,
  deleteLoading,
}) {
  const profile = user.profile || {};

  const skills = Array.isArray(
    profile.skills
  )
    ? profile.skills
    : [];

  const userName =
    user.name || "Unknown User";

  const career =
    profile.preferredCareer ||
    "Not set";

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] shadow-lg shadow-black/5 transition hover:border-slate-700">
      {/* CARD TOP */}

      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar
            name={userName}
            image={user.profileImage}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="break-words text-base font-semibold text-white">
                  {userName}
                </h2>

                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                  <Mail
                    size={14}
                    className="shrink-0 text-slate-600"
                  />

                  <p className="break-all text-xs text-slate-500">
                    {user.email ||
                      "No email"}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <RoleBadge
                  role={
                    user.role ||
                    "student"
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* CAREER */}

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <BriefcaseBusiness
                size={17}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                Preferred Career
              </p>

              <p className="mt-1 break-words text-sm font-medium leading-5 text-slate-300">
                {career}
              </p>
            </div>
          </div>
        </div>

        {/* SKILLS */}

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              Skills
            </p>

            <span className="text-[10px] text-slate-600">
              {skills.length} total
            </span>
          </div>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {skills
                .slice(0, 6)
                .map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="max-w-full break-words rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300"
                    >
                      {skill}
                    </span>
                  )
                )}

              {skills.length > 6 && (
                <span className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-500">
                  +{skills.length - 6}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-600">
              No skills added
            </p>
          )}
        </div>

        {/* DATE */}

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <CalendarDays
            size={14}
            className="text-slate-600"
          />

          Registered{" "}
          {formatDate(user.createdAt)}
        </div>
      </div>

      {/* CARD ACTIONS */}

      <div className="grid grid-cols-2 border-t border-slate-800">
        <button
          type="button"
          onClick={() =>
            onView(user._id)
          }
          className="flex min-h-[50px] items-center justify-center gap-2 border-r border-slate-800 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10 hover:text-blue-300"
        >
          <Eye size={17} />
          View Details
        </button>

        <button
          type="button"
          disabled={
            deleteLoading === user._id
          }
          onClick={() =>
            onDelete(
              user._id,
              userName
            )
          }
          className="flex min-h-[50px] items-center justify-center gap-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteLoading === user._id ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={17} />
          )}

          Delete
        </button>
      </div>
    </article>
  );
}

// ============================================================
// AVATAR
// ============================================================

function Avatar({
  name,
  image,
}) {
  const initial =
    name?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 sm:h-12 sm:w-12">
      {image ? (
        <img
          src={image}
          alt={`${name} profile`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold sm:text-base">
          {initial}
        </span>
      )}
    </div>
  );
}

// ============================================================
// ROLE BADGE
// ============================================================

function RoleBadge({
  role,
}) {
  const isAdmin = role === "admin";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1.5
        text-[10px]
        font-semibold
        sm:px-3
        sm:text-xs
        ${
          isAdmin
            ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
            : "border-blue-500/30 bg-blue-500/10 text-blue-400"
        }
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${
            isAdmin
              ? "bg-purple-400"
              : "bg-blue-400"
          }
        `}
      />

      {isAdmin ? "Admin" : "Student"}
    </span>
  );
}

// ============================================================
// ACTION BUTTON
// ============================================================

function ActionButton({
  title,
  onClick,
  icon,
  danger = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        h-9
        w-9
        items-center
        justify-center
        rounded-lg
        border
        bg-slate-900/80
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          danger
            ? "border-slate-700 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            : "border-slate-700 text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300"
        }
      `}
    >
      {icon}
    </button>
  );
}

// ============================================================
// EMPTY USERS
// ============================================================

function EmptyUsers() {
  return (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0f172a] px-5 py-14 text-center sm:px-6 sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-500 sm:h-16 sm:w-16">
        <UsersIcon size={27} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        No users found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        There are currently no registered
        users available in the system.
      </p>
    </div>
  );
}

// ============================================================
// USER DETAILS MODAL
// ============================================================

function UserDetailsModal({
  loading,
  user,
  error,
  onClose,
  formatDate,
}) {
  const profile = user?.profile || {};

  const education =
    profile.education || {};

  const skills = Array.isArray(
    profile.skills
  )
    ? profile.skills
    : [];

  const interests =
    Array.isArray(
      profile.interests
    )
      ? profile.interests
      : [];

  const progress =
    Array.isArray(user?.progress)
      ? user.progress
      : [];

  const feedback =
    Array.isArray(user?.feedback)
      ? user.feedback
      : [];

  const assessment =
    user?.assessment || null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[96vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl border border-slate-700 bg-[#0b1220] shadow-2xl shadow-black/60 sm:max-h-[92vh] sm:rounded-2xl">
        {/* MODAL HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-[#0f172a] px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-400 sm:text-xs">
              Administration
            </p>

            <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
              User Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400 transition hover:bg-slate-800 hover:text-white sm:h-10 sm:w-10"
          >
            <X size={19} />
          </button>
        </div>

        {/* MODAL BODY */}

        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[350px] items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <Loader2
                    size={27}
                    className="animate-spin"
                  />
                </div>

                <p className="mt-4 font-semibold text-white">
                  Loading user details
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Fetching profile and activity...
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}

          {!loading && error && (
            <div className="flex min-h-[320px] items-center justify-center text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                  <AlertCircle size={27} />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">
                  Unable to load user
                </h3>

                <p className="mt-2 break-words text-sm leading-6 text-slate-500">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* USER */}

          {!loading &&
            !error &&
            user && (
              <div className="space-y-4 sm:space-y-5">
                {/* PROFILE */}

                <DetailSection
                  title="Profile"
                  description="Basic account information"
                  icon={<User size={19} />}
                  iconClass="bg-blue-500/10 text-blue-400"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <Avatar
                        name={
                          user.name
                        }
                        image={
                          user.profileImage
                        }
                      />

                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-bold text-white sm:text-xl">
                          {user.name ||
                            "Unknown User"}
                        </h3>

                        <div className="mt-1 flex min-w-0 items-start gap-2">
                          <Mail
                            size={14}
                            className="mt-0.5 shrink-0 text-slate-500"
                          />

                          <p className="break-all text-xs text-slate-400 sm:text-sm">
                            {user.email ||
                              "No email"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <RoleBadge
                      role={
                        user.role ||
                        "student"
                      }
                    />
                  </div>

                  <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays
                      size={13}
                    />
                    Registered{" "}
                    {formatDate(
                      user.createdAt
                    )}
                  </p>
                </DetailSection>

                {/* CAREER */}

                <DetailSection
                  title="Career Information"
                  description="Career preferences and goals"
                  icon={
                    <BriefcaseBusiness
                      size={19}
                    />
                  }
                  iconClass="bg-blue-500/10 text-blue-400"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InfoCard
                      label="Preferred Career"
                      value={
                        profile.preferredCareer ||
                        "Not set"
                      }
                      icon={
                        <Target size={15} />
                      }
                    />

                    <InfoCard
                      label="Career Goal"
                      value={
                        profile.careerGoal ||
                        "Not set"
                      }
                    />

                    <InfoCard
                      label="Work Preference"
                      value={
                        profile.workPreference ||
                        "Not set"
                      }
                    />

                    <InfoCard
                      label="Bio"
                      value={
                        profile.bio ||
                        "Not provided"
                      }
                    />
                  </div>
                </DetailSection>

                {/* EDUCATION */}

                <DetailSection
                  title="Education"
                  description="Academic information"
                  icon={
                    <GraduationCap
                      size={19}
                    />
                  }
                  iconClass="bg-purple-500/10 text-purple-400"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <InfoCard
                      label="Degree"
                      value={
                        education.degree ||
                        "Not set"
                      }
                    />

                    <InfoCard
                      label="Branch"
                      value={
                        education.branch ||
                        "Not set"
                      }
                    />

                    <InfoCard
                      label="Institution"
                      value={
                        education.institution ||
                        education.college ||
                        "Not set"
                      }
                    />

                    <InfoCard
                      label="Graduation Year"
                      value={
                        education.graduationYear ||
                        "Not set"
                      }
                    />

                    <InfoCard
                      label="CGPA"
                      value={
                        education.cgpa ||
                        "Not set"
                      }
                    />

                    <InfoCard
                      label="Semester"
                      value={
                        education.semester ||
                        "Not set"
                      }
                    />
                  </div>
                </DetailSection>

                {/* SKILLS */}

                <DetailSection
                  title="Skills"
                  description="Technical skills"
                  icon={
                    <Shield size={19} />
                  }
                  iconClass="bg-cyan-500/10 text-cyan-400"
                >
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map(
                        (
                          skill,
                          index
                        ) => (
                          <span
                            key={`${skill}-${index}`}
                            className="max-w-full break-words rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1.5 text-xs font-medium text-cyan-300 sm:px-3 sm:py-2 sm:text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyText>
                      No skills added.
                    </EmptyText>
                  )}
                </DetailSection>

                {/* INTERESTS */}

                <DetailSection
                  title="Interests"
                  description="Learning and career interests"
                  icon={
                    <Heart size={19} />
                  }
                  iconClass="bg-pink-500/10 text-pink-400"
                >
                  {interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {interests.map(
                        (
                          interest,
                          index
                        ) => (
                          <span
                            key={`${interest}-${index}`}
                            className="max-w-full break-words rounded-lg border border-pink-500/20 bg-pink-500/10 px-2.5 py-1.5 text-xs text-pink-300 sm:px-3 sm:py-2 sm:text-sm"
                          >
                            {interest}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyText>
                      No interests added.
                    </EmptyText>
                  )}
                </DetailSection>

                {/* ASSESSMENT */}

                <DetailSection
                  title="Assessment"
                  description="Latest assessment information"
                  icon={
                    <BookOpen size={19} />
                  }
                  iconClass="bg-amber-500/10 text-amber-400"
                >
                  {assessment ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <InfoCard
                        label="Score"
                        value={
                          assessment.score ??
                          assessment.totalScore ??
                          assessment.percentage ??
                          "Not available"
                        }
                        icon={
                          <Target size={15} />
                        }
                      />

                      <InfoCard
                        label="Result"
                        value={
                          assessment.result ||
                          assessment.status ||
                          "Completed"
                        }
                      />

                      <InfoCard
                        label="Completed On"
                        value={formatDate(
                          assessment.completedAt ||
                            assessment.createdAt
                        )}
                      />
                    </div>
                  ) : (
                    <EmptyText>
                      No assessment data available.
                    </EmptyText>
                  )}
                </DetailSection>

                {/* PROGRESS */}

                <DetailSection
                  title="Progress"
                  description="Learning progress and completed activities"
                  icon={
                    <CheckCircle2
                      size={19}
                    />
                  }
                  iconClass="bg-green-500/10 text-green-400"
                >
                  {progress.length > 0 ? (
                    <div className="space-y-3">
                      {progress
                        .slice(0, 10)
                        .map(
                          (
                            item,
                            index
                          ) => (
                            <ProgressItem
                              key={
                                item._id ||
                                item.id ||
                                index
                              }
                              item={item}
                              index={
                                index
                              }
                            />
                          )
                        )}
                    </div>
                  ) : (
                    <EmptyText>
                      No progress data available.
                    </EmptyText>
                  )}
                </DetailSection>

                {/* FEEDBACK */}

                <DetailSection
                  title="Feedback"
                  description="Feedback submitted by the user"
                  icon={
                    <MessageSquare
                      size={19}
                    />
                  }
                  iconClass="bg-indigo-500/10 text-indigo-400"
                >
                  {feedback.length > 0 ? (
                    <div className="space-y-3">
                      {feedback
                        .slice(0, 10)
                        .map(
                          (
                            item,
                            index
                          ) => (
                            <FeedbackItem
                              key={
                                item._id ||
                                item.id ||
                                index
                              }
                              item={item}
                            />
                          )
                        )}
                    </div>
                  ) : (
                    <EmptyText>
                      No feedback submitted.
                    </EmptyText>
                  )}
                </DetailSection>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL SECTION
// ============================================================

function DetailSection({
  title,
  description,
  icon,
  iconClass,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-5 lg:p-6">
      <div className="flex items-start gap-3">
        <div
          className={`
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-xl
            sm:h-10
            sm:w-10
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white sm:text-base">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        {children}
      </div>
    </section>
  );
}

// ============================================================
// INFO CARD
// ============================================================

function InfoCard({
  label,
  value,
  icon,
}) {
  const displayValue =
    value === null ||
    value === undefined ||
    value === ""
      ? "Not available"
      : String(value);

  return (
    <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 sm:p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 sm:text-xs">
        {icon && (
          <span className="text-slate-500">
            {icon}
          </span>
        )}

        {label}
      </div>

      <p className="mt-1.5 break-words text-sm font-medium leading-5 text-slate-200 sm:mt-2 sm:leading-6">
        {displayValue}
      </p>
    </div>
  );
}

// ============================================================
// EMPTY TEXT
// ============================================================

function EmptyText({
  children,
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 px-4 py-5 text-center text-xs text-slate-500 sm:py-6 sm:text-sm">
      {children}
    </div>
  );
}

// ============================================================
// PROGRESS ITEM
// ============================================================

function ProgressItem({
  item,
  index,
}) {
  const title =
    item.title ||
    item.courseName ||
    item.skill ||
    item.topic ||
    item.name ||
    `Progress ${index + 1}`;

  const status =
    item.status ||
    item.state ||
    (item.completed
      ? "Completed"
      : "In Progress");

  const percentage =
    item.percentage ??
    item.progress ??
    item.completionPercentage;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 sm:p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-slate-200">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {status}
          </p>
        </div>

        {percentage !== undefined &&
          percentage !== null && (
            <span className="self-start rounded-lg bg-green-500/10 px-2.5 py-1.5 text-xs font-semibold text-green-400 sm:self-auto">
              {percentage}%
            </span>
          )}
      </div>

      {percentage !== undefined &&
        percentage !== null && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    Number(
                      percentage
                    ) || 0
                  )
                )}%`,
              }}
            />
          </div>
        )}
    </div>
  );
}

// ============================================================
// FEEDBACK ITEM
// ============================================================

function FeedbackItem({
  item,
}) {
  const message =
    item.message ||
    item.feedback ||
    item.comment ||
    item.text ||
    "No feedback message";

  const rating =
    item.rating ??
    item.score;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-300">
          {message}
        </p>

        {rating !== undefined &&
          rating !== null && (
            <span className="shrink-0 self-start rounded-lg bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-400">
              Rating: {rating}
            </span>
          )}
      </div>

      {(item.createdAt ||
        item.updatedAt) && (
        <p className="mt-3 text-xs text-slate-600">
          {new Date(
            item.createdAt ||
              item.updatedAt
          ).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )}
        </p>
      )}
    </div>
  );
}

// ============================================================
// LOADING SKELETON
// ============================================================

function UsersSkeleton() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 xl:px-10">
        {/* HEADER */}

        <div>
          <div className="h-3.5 w-28 animate-pulse rounded bg-blue-500/20" />

          <div className="mt-3 h-9 w-32 animate-pulse rounded-lg bg-slate-800 sm:h-10 sm:w-36" />

          <div className="mt-3 h-4 w-full max-w-xl animate-pulse rounded bg-slate-800" />
        </div>

        {/* SUMMARY */}

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-800" />

                <div className="h-8 w-14 animate-pulse rounded-lg bg-slate-800" />
              </div>

              <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5">
            <div className="h-11 w-full animate-pulse rounded-xl bg-slate-800 sm:ml-auto sm:w-36" />
          </div>
        </div>

        {/* MOBILE CARDS */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          <SkeletonCard />
          <SkeletonCard />

          <div className="hidden sm:block">
            <SkeletonCard />
          </div>

          <div className="hidden sm:block">
            <SkeletonCard />
          </div>
        </div>

        {/* DESKTOP */}

        <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] lg:block">
          <div className="h-14 animate-pulse bg-[#111a2e]" />

          <SkeletonDesktopRow />
          <SkeletonDesktopRow />
          <SkeletonDesktopRow />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SKELETON CARD
// ============================================================

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0f172a] p-4 sm:p-5">
      <div className="flex gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-800" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />

          <div className="h-3 w-40 animate-pulse rounded bg-slate-800" />
        </div>
      </div>

      <div className="mt-5 h-16 animate-pulse rounded-xl bg-slate-900" />

      <div className="mt-4 flex gap-2">
        <div className="h-7 w-16 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-7 w-20 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-800" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <div className="h-10 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-10 animate-pulse rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}

// ============================================================
// SKELETON DESKTOP ROW
// ============================================================

function SkeletonDesktopRow() {
  return (
    <div className="grid grid-cols-[1.6fr_0.7fr_1fr_1.4fr_1fr_0.7fr] items-center gap-4 border-b border-slate-800 px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-slate-800" />

        <div className="space-y-2">
          <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
          <div className="h-3 w-36 animate-pulse rounded bg-slate-800" />
        </div>
      </div>

      <div className="h-8 w-20 animate-pulse rounded-full bg-slate-800" />

      <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />

      <div className="flex gap-2">
        <div className="h-7 w-16 animate-pulse rounded bg-slate-800" />
        <div className="h-7 w-20 animate-pulse rounded bg-slate-800" />
      </div>

      <div className="h-4 w-24 animate-pulse rounded bg-slate-800" />

      <div className="flex justify-center gap-2">
        <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}

export default Users;