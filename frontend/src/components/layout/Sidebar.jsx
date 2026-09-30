import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  BarChart3,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Camera,
  ClipboardCheck,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Route,
  Target,
  User,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import profileService from "../../services/profileService";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Career Analysis",
    path: "/career-analysis",
    icon: BriefcaseBusiness,
  },
  {
    label: "Skill Gap",
    path: "/skill-gap",
    icon: Target,
  },
  {
    label: "Roadmap",
    path: "/roadmap",
    icon: Route,
  },
  {
    label: "Courses",
    path: "/courses",
    icon: BookOpen,
  },
  {
    label: "Progress",
    path: "/progress",
    icon: BarChart3,
  },
  {
    label: "Assessment",
    path: "/assessment",
    icon: ClipboardCheck,
  },
  {
    label: "AI Assistant",
    path: "/chatbot",
    icon: Brain,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "Feedback",
    path: "/feedback",
    icon: MessageCircle,
  },
];

function Sidebar({
  mobileOpen = false,
  onClose = () => {},
}) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [profileImage, setProfileImage] =
    useState("");

  const [profileLoading, setProfileLoading] =
    useState(true);

  // ============================================================
  // USER INFORMATION
  // ============================================================

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "Prajwal";

  const userEmail =
    user?.email ||
    "Student";

  // ============================================================
  // LOAD PROFILE IMAGE FROM BACKEND
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadProfileImage = async () => {
      try {
        setProfileLoading(true);

        const response =
          await profileService.getProfile();

        if (!mounted) {
          return;
        }

        const profile =
          response?.profile ||
          response?.data ||
          response;

        if (profile?.profileImage) {
          setProfileImage(
            profile.profileImage
          );
        } else {
          setProfileImage("");
        }
      } catch (error) {
        console.error(
          "Failed to load sidebar profile image:",
          error
        );

        if (mounted) {
          setProfileImage("");
        }
      } finally {
        if (mounted) {
          setProfileLoading(false);
        }
      }
    };

    if (user) {
      loadProfileImage();
    } else {
      setProfileImage("");
      setProfileLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  // ============================================================
  // PROFILE NAVIGATION
  // ============================================================

  const openProfile = () => {
    onClose();

    navigate("/profile");
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }

    localStorage.removeItem(
      "career_guidance_token"
    );

    localStorage.removeItem(
      "career_guidance_user"
    );

    onClose();

    navigate("/login", {
      replace: true,
    });
  };

  // ============================================================
  // PROFILE INITIAL
  // ============================================================

  const profileInitial =
    userName
      .charAt(0)
      .toUpperCase();

  // ============================================================
  // UI
  // ============================================================

  return (
    <aside
      className={`
        fixed
        left-0
        top-0
        z-[60]
        flex
        h-screen
        w-[270px]
        flex-col
        border-r
        border-slate-800
        bg-[#111a2e]
        shadow-2xl
        transition-transform
        duration-300
        ease-in-out
        lg:w-[240px]
        lg:translate-x-0
        lg:shadow-none
        ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}
    >
      {/* ======================================================
          SIDEBAR HEADER
      ====================================================== */}

      <div
        className="
          flex
          h-16
          shrink-0
          items-center
          justify-between
          border-b
          border-slate-800
          px-5
        "
      >
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-white">
            Career Guidance
          </h1>

          <p className="truncate text-xs text-slate-400">
            Intelligent Career System
          </p>
        </div>

        {/* MOBILE CLOSE */}

        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-slate-400
            transition
            hover:bg-slate-800
            hover:text-white
            lg:hidden
          "
        >
          <X size={20} />
        </button>
      </div>

      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          sidebar-scroll
          min-h-0
          flex-1
          overflow-y-auto
          px-3
          py-4
        "
      >
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    flex
                    min-h-[44px]
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }
                  `
                }
              >
                <Icon
                  size={18}
                  className="shrink-0"
                />

                <span className="truncate">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ======================================================
          USER SECTION
      ====================================================== */}

      <div
        className="
          shrink-0
          border-t
          border-slate-800
          bg-[#111a2e]
          p-4
        "
      >
        {/* ==================================================
            PROFILE AREA
            IMAGE + NAME + EMAIL ARE CLICKABLE
        ================================================== */}

        <button
          type="button"
          onClick={openProfile}
          title="Open profile"
          className="
            group
            mb-3
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            p-2
            text-left
            transition
            hover:bg-slate-800
          "
        >
          {/* PROFILE IMAGE */}

          <div
            className="
              relative
              h-11
              w-11
              shrink-0
              overflow-hidden
              rounded-full
              bg-blue-600
              text-sm
              font-bold
              text-white
              ring-2
              ring-transparent
              transition
              group-hover:ring-blue-400
            "
          >
            {profileLoading ? (
              <div
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  bg-slate-700
                "
              >
                <div
                  className="
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-slate-400
                    border-t-white
                  "
                />
              </div>
            ) : profileImage ? (
              <img
                src={profileImage}
                alt={`${userName} profile`}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <span
                className="
                  flex
                  h-full
                  w-full
                  items-center
                  justify-center
                  bg-blue-600
                "
              >
                {profileInitial}
              </span>
            )}

            {/* CAMERA HOVER */}

            <span
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/50
                opacity-0
                transition
                group-hover:opacity-100
              "
            >
              <Camera size={16} />
            </span>
          </div>

          {/* USER DETAILS */}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {userName}
            </p>

            <p className="truncate text-xs text-slate-400">
              {userEmail}
            </p>

            <p className="mt-0.5 text-[10px] text-blue-400 opacity-0 transition group-hover:opacity-100">
              View Profile
            </p>
          </div>
        </button>

        {/* ====================================================
            LOGOUT
        ==================================================== */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-red-600
            px-3
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-red-500
          "
        >
          <LogOut size={17} />

          <span>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;