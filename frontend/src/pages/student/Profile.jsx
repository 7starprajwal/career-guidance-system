import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  Image as ImageIcon,
  Trash2,
  User,
} from "lucide-react";

import profileService from "../../services/profileService";

function Profile() {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    phone: "",
    education: {
      degree: "",
      branch: "",
      institution: "",
      graduationYear: "",
    },
    skills: [],
    interests: [],
    careerGoal: "",
    preferredCareer: "",
    workPreference: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState("");

  const [skillsInput, setSkillsInput] =
    useState("");

  const [interestsInput, setInterestsInput] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    loadProfile();
  }, []);

  // ============================================================
  // LOAD PROFILE DATA
  // ============================================================

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const response =
        await profileService.getProfile();

      const profile =
        response?.profile ||
        response?.data ||
        response;

      if (profile) {
        setFormData((previous) => ({
          ...previous,
          ...profile,

          education: {
            ...previous.education,
            ...(profile.education || {}),
          },

          skills: Array.isArray(
            profile.skills
          )
            ? profile.skills
            : [],

          interests: Array.isArray(
            profile.interests
          )
            ? profile.interests
            : [],
        }));

        // Load image URL directly from MongoDB
        if (profile.profileImage) {
          setProfileImage(
            profile.profileImage
          );
        } else {
          setProfileImage("");
        }
      }
    } catch (err) {
      console.error(
        "Failed to load profile:",
        err
      );

      if (err.response?.status !== 404) {
        setError(
          err.response?.data?.message ||
            "Unable to load profile."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  // ============================================================
  // PROFILE IMAGE SELECT + CLOUDINARY UPLOAD
  // ============================================================

  async function handleImageSelect(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMessage("");
    setError("");

    // Only images
    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    // Frontend limit: 2 MB
    const maxSize =
      2 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Profile image must be smaller than 2 MB."
      );

      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);

      const response =
        await profileService.uploadProfileImage(
          file
        );

      if (
        response?.success &&
        response?.profileImage
      ) {
        setProfileImage(
          response.profileImage
        );

        setMessage(
          "Profile picture uploaded successfully."
        );

        setError("");
      } else {
        throw new Error(
          response?.message ||
            "Profile image upload failed."
        );
      }
    } catch (err) {
      console.error(
        "Profile image upload error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to upload profile picture."
      );
    } finally {
      setUploadingImage(false);

      // Allow selecting same image again
      event.target.value = "";
    }
  }

  // ============================================================
  // REMOVE PROFILE IMAGE
  // ============================================================

  function handleRemoveImage() {
    /*
      We are intentionally not deleting the
      Cloudinary file yet.

      The profile image URL is removed from
      the current frontend state.

      A dedicated delete endpoint can be added
      later to remove the Cloudinary asset too.
    */

    setProfileImage("");

    setMessage(
      "Profile picture removed from your profile. Click Save Profile to apply."
    );

    setError("");
  }

  // ============================================================
  // FORM CHANGE
  // ============================================================

  function handleChange(event) {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ============================================================
  // EDUCATION CHANGE
  // ============================================================

  function handleEducationChange(
    event
  ) {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,

      education: {
        ...previous.education,
        [name]: value,
      },
    }));
  }

  // ============================================================
  // ADD SKILL
  // ============================================================

  function addSkill() {
    const skill =
      skillsInput.trim();

    if (!skill) {
      return;
    }

    const exists =
      formData.skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      );

    if (!exists) {
      setFormData((previous) => ({
        ...previous,

        skills: [
          ...previous.skills,
          skill,
        ],
      }));
    }

    setSkillsInput("");
  }

  // ============================================================
  // REMOVE SKILL
  // ============================================================

  function removeSkill(
    skillToRemove
  ) {
    setFormData((previous) => ({
      ...previous,

      skills: previous.skills.filter(
        (skill) =>
          skill !== skillToRemove
      ),
    }));
  }

  // ============================================================
  // ADD INTEREST
  // ============================================================

  function addInterest() {
    const interest =
      interestsInput.trim();

    if (!interest) {
      return;
    }

    const exists =
      formData.interests.some(
        (item) =>
          item.toLowerCase() ===
          interest.toLowerCase()
      );

    if (!exists) {
      setFormData((previous) => ({
        ...previous,

        interests: [
          ...previous.interests,
          interest,
        ],
      }));
    }

    setInterestsInput("");
  }

  // ============================================================
  // REMOVE INTEREST
  // ============================================================

  function removeInterest(
    interestToRemove
  ) {
    setFormData((previous) => ({
      ...previous,

      interests:
        previous.interests.filter(
          (interest) =>
            interest !==
            interestToRemove
        ),
    }));
  }

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await profileService.saveProfile({
          ...formData,

          profileImage:
            profileImage || "",
        });

      setMessage(
        response?.message ||
          "Profile updated successfully."
      );

      await loadProfile();
    } catch (err) {
      console.error(
        "Failed to save profile:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

          <p className="mt-4 text-lg text-slate-400">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div>
        <p className="text-sm font-medium text-blue-400">
          Personal Information
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          My Profile
        </h1>

        <p className="mt-2 text-slate-400">
          Keep your profile, skills, interests and
          career goals updated for better
          recommendations.
        </p>
      </div>

      {/* ======================================================
          PROFILE PHOTO
      ====================================================== */}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

          {/* PROFILE IMAGE */}

          <div className="relative mx-auto sm:mx-0">

            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-slate-700 bg-slate-800 shadow-xl">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-600 text-white">
                  <User size={52} />
                </div>
              )}

              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                </div>
              )}

            </div>

            {/* CAMERA BUTTON */}

            <button
              type="button"
              disabled={uploadingImage}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-900 bg-blue-600 text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              title="Change profile picture"
            >
              <Camera size={20} />
            </button>

          </div>

          {/* PROFILE IMAGE INFORMATION */}

          <div className="flex-1 text-center sm:text-left">

            <h2 className="text-xl font-bold text-white">
              Profile Picture
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Add a profile picture so your account
              is easier to recognize.
            </p>

            <p className="mt-2 text-xs text-slate-500">
              JPG, PNG or WEBP. Maximum size: 2 MB.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-start">

              <button
                type="button"
                disabled={uploadingImage}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ImageIcon size={18} />

                {uploadingImage
                  ? "Uploading..."
                  : profileImage
                  ? "Change Picture"
                  : "Upload Picture"}
              </button>

              {profileImage && (
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={
                    handleRemoveImage
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={18} />
                  Remove
                </button>
              )}

            </div>

            {/* HIDDEN FILE INPUT */}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleImageSelect
              }
              className="hidden"
            />

          </div>

        </div>

      </section>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-400">
          <Check size={20} />

          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {/* ======================================================
          PROFILE FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* ====================================================
            BASIC INFORMATION
        ==================================================== */}

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold text-white">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your contact and education information.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* PHONE */}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* DEGREE */}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Degree
              </label>

              <input
                type="text"
                name="degree"
                value={
                  formData.education.degree
                }
                onChange={
                  handleEducationChange
                }
                placeholder="e.g. B.E."
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* BRANCH */}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={
                  formData.education.branch
                }
                onChange={
                  handleEducationChange
                }
                placeholder="e.g. Computer Science and Engineering"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* INSTITUTION */}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Institution
              </label>

              <input
                type="text"
                name="institution"
                value={
                  formData.education.institution
                }
                onChange={
                  handleEducationChange
                }
                placeholder="College / University"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* GRADUATION YEAR */}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Graduation Year
              </label>

              <input
                type="text"
                name="graduationYear"
                value={
                  formData.education
                    .graduationYear
                }
                onChange={
                  handleEducationChange
                }
                placeholder="e.g. 2027"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

          </div>

        </section>

        {/* ====================================================
            SKILLS
        ==================================================== */}

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold text-white">
            Skills
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add the technical skills you currently know.
          </p>

          <div className="mt-5 flex gap-3">

            <input
              type="text"
              value={skillsInput}
              onChange={(event) =>
                setSkillsInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. JavaScript"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={addSkill}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Add
            </button>

          </div>

          <div className="mt-5 flex flex-wrap gap-2">

            {formData.skills.length === 0 ? (
              <p className="text-sm text-slate-500">
                No skills added yet.
              </p>
            ) : (
              formData.skills.map(
                (skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-2 text-sm text-blue-400"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        removeSkill(
                          skill
                        )
                      }
                      className="text-blue-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )
              )
            )}

          </div>

        </section>

        {/* ====================================================
            INTERESTS
        ==================================================== */}

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold text-white">
            Interests
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add areas you enjoy or want to explore.
          </p>

          <div className="mt-5 flex gap-3">

            <input
              type="text"
              value={interestsInput}
              onChange={(event) =>
                setInterestsInput(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addInterest();
                }
              }}
              placeholder="e.g. Web Development"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={addInterest}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
            >
              Add
            </button>

          </div>

          <div className="mt-5 flex flex-wrap gap-2">

            {formData.interests.length === 0 ? (
              <p className="text-sm text-slate-500">
                No interests added yet.
              </p>
            ) : (
              formData.interests.map(
                (interest) => (
                  <span
                    key={interest}
                    className="flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-2 text-sm text-purple-400"
                  >
                    {interest}

                    <button
                      type="button"
                      onClick={() =>
                        removeInterest(
                          interest
                        )
                      }
                      className="text-purple-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                )
              )
            )}

          </div>

        </section>

        {/* ====================================================
            CAREER INFORMATION
        ==================================================== */}

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold text-white">
            Career Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            This information helps the recommendation
            system understand your career direction.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {/* PREFERRED CAREER */}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Preferred Career
              </label>

              <input
                type="text"
                name="preferredCareer"
                value={
                  formData.preferredCareer
                }
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              />
            </div>

            {/* WORK PREFERENCE */}

            <div>
              <label className="text-sm font-medium text-slate-300">
                Work Preference
              </label>

              <select
                name="workPreference"
                value={
                  formData.workPreference
                }
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              >
                <option value="">
                  Select preference
                </option>

                <option value="Remote">
                  Remote
                </option>

                <option value="Hybrid">
                  Hybrid
                </option>

                <option value="On-site">
                  On-site
                </option>

                <option value="Flexible">
                  Flexible
                </option>
              </select>
            </div>

          </div>

          {/* CAREER GOAL */}

          <div className="mt-5">

            <label className="text-sm font-medium text-slate-300">
              Career Goal
            </label>

            <textarea
              name="careerGoal"
              value={
                formData.careerGoal
              }
              onChange={handleChange}
              rows={4}
              placeholder="Describe what you want to achieve in your career..."
              className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

          {/* BIO */}

          <div className="mt-5">

            <label className="text-sm font-medium text-slate-300">
              Bio
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us a little about yourself..."
              className="mt-2 w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

          </div>

        </section>

        {/* ====================================================
            SAVE
        ==================================================== */}

        <div className="flex justify-end">

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default Profile;