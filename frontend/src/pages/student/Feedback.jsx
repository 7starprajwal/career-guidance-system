import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MessageSquare,
  RefreshCw,
  Send,
  Star,
} from "lucide-react";

import api from "../../services/api";

function Feedback() {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const [feedbackList, setFeedbackList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");

  // ==========================================
  // LOAD STUDENT FEEDBACK
  // ==========================================

  const loadMyFeedback = async () => {
    try {
      setLoadingFeedback(true);
      setFetchError("");

      const response = await api.get("/feedback/my");

      setFeedbackList(
        Array.isArray(response.data?.feedback)
          ? response.data.feedback
          : []
      );
    } catch (err) {
      console.error("Get my feedback error:", err);

      setFetchError(
        err.response?.data?.message ||
          "Unable to load your feedback."
      );
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    loadMyFeedback();
  }, []);

  // ==========================================
  // SUBMIT FEEDBACK
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    if (!message.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    if (message.trim().length < 5) {
      setError(
        "Feedback must contain at least 5 characters."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/feedback", {
        rating,
        message: message.trim(),
      });

      setRating(0);
      setMessage("");
      setSubmitted(true);

      // Refresh feedback list
      await loadMyFeedback();
    } catch (err) {
      console.error(
        "Feedback submission error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STATUS UI
  // ==========================================

  const getStatusDetails = (status) => {
    switch (status) {
      case "reviewed":
        return {
          label: "Reviewed",
          icon: CheckCircle2,
          className:
            "border-blue-500/30 bg-blue-500/10 text-blue-400",
        };

      case "resolved":
        return {
          label: "Resolved",
          icon: CheckCircle2,
          className:
            "border-green-500/30 bg-green-500/10 text-green-400",
        };

      case "new":
      default:
        return {
          label: "Waiting for review",
          icon: Clock3,
          className:
            "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        };
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pb-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6 rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <MessageSquare size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Feedback
              </h1>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                Share your experience and see responses
                from the Career Guidance team.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}

        {submitted && (
          <div className="mb-6 rounded-xl border border-green-800 bg-green-950/40 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={22}
                className="mt-0.5 shrink-0 text-green-400"
              />

              <div>
                <h2 className="font-semibold text-green-400">
                  Feedback submitted successfully
                </h2>

                <p className="mt-1 text-sm leading-6 text-green-300">
                  Thank you for helping us improve the
                  Career Guidance System.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              Submit More Feedback
            </button>
          </div>
        )}

        {/* ==========================================
            FEEDBACK FORM
        ========================================== */}

        {!submitted && (
          <div className="mb-8 rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-white">
              How was your experience?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Your feedback helps us improve the Career
              Guidance System.
            </p>

            {/* Rating */}

            <div className="mt-8">
              <label className="text-sm font-medium text-slate-200">
                Rate your experience
              </label>

              <div className="mt-3 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setRating(value);
                      setError("");
                    }}
                    disabled={loading}
                    aria-label={`Rate ${value} stars`}
                    className="rounded-lg p-2 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Star
                      size={30}
                      className={
                        value <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                      }
                    />
                  </button>
                ))}
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {rating === 0
                  ? "Select a rating"
                  : `${rating} out of 5 stars`}
              </p>
            </div>

            {/* Message */}

            <div className="mt-7">
              <label
                htmlFor="feedback"
                className="text-sm font-medium text-slate-200"
              >
                Your feedback
              </label>

              <textarea
                id="feedback"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setError("");
                }}
                placeholder="Tell us about your experience..."
                rows={7}
                disabled={loading}
                className="mt-3 w-full resize-none rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-blue-500 disabled:opacity-60"
              />

              <p className="mt-2 text-xs text-slate-500">
                {message.length} characters
              </p>
            </div>

            {/* Error */}

            {error && (
              <div className="mt-4 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 sm:w-auto"
            >
              <Send size={18} />

              {loading
                ? "Submitting..."
                : "Submit Feedback"}
            </button>
          </div>
        )}

        {/* ==========================================
            MY FEEDBACK
        ========================================== */}

        <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                My Feedback
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-400">
                View your submitted feedback and
                responses from the administration.
              </p>
            </div>

            <button
              type="button"
              onClick={loadMyFeedback}
              disabled={loadingFeedback}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  loadingFeedback
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>
          </div>

          {/* Loading */}

          {loadingFeedback && (
            <div className="mt-8 flex min-h-[160px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

                <p className="mt-3 text-sm text-slate-400">
                  Loading your feedback...
                </p>
              </div>
            </div>
          )}

          {/* Fetch Error */}

          {!loadingFeedback && fetchError && (
            <div className="mt-6 rounded-xl border border-red-800 bg-red-950/30 p-5">
              <p className="text-sm text-red-400">
                {fetchError}
              </p>

              <button
                type="button"
                onClick={loadMyFeedback}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}

          {!loadingFeedback &&
            !fetchError &&
            feedbackList.length === 0 && (
              <div className="mt-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
                <MessageSquare
                  size={36}
                  className="mx-auto text-slate-600"
                />

                <h3 className="mt-4 font-semibold text-slate-200">
                  No feedback submitted yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Your submitted feedback will appear
                  here.
                </p>
              </div>
            )}

          {/* Feedback List */}

          {!loadingFeedback &&
            !fetchError &&
            feedbackList.length > 0 && (
              <div className="mt-6 space-y-5">
                {feedbackList.map((feedback) => {
                  const statusDetails =
                    getStatusDetails(
                      feedback.status
                    );

                  const StatusIcon =
                    statusDetails.icon;

                  return (
                    <div
                      key={feedback._id}
                      className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                    >
                      {/* Top Section */}

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-1">
                            {[1, 2, 3, 4, 5].map(
                              (star) => (
                                <Star
                                  key={star}
                                  size={17}
                                  className={
                                    star <=
                                    Number(
                                      feedback.rating
                                    )
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-700"
                                  }
                                />
                              )
                            )}
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Submitted on{" "}
                            {formatDate(
                              feedback.createdAt
                            )}
                          </p>
                        </div>

                        {/* Status */}

                        <div
                          className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusDetails.className}`}
                        >
                          <StatusIcon size={14} />

                          {statusDetails.label}
                        </div>
                      </div>

                      {/* Student Feedback */}

                      <div className="mt-5 rounded-xl border border-slate-800 bg-[#0f172a] p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Your Feedback
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                          {feedback.message}
                        </p>
                      </div>

                      {/* Admin Response */}

                      <div className="mt-4">
                        {feedback.adminResponse ? (
                          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                            <div className="flex items-center gap-2">
                              <MessageSquare
                                size={17}
                                className="text-blue-400"
                              />

                              <p className="text-sm font-semibold text-blue-400">
                                Admin Response
                              </p>
                            </div>

                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                              {feedback.adminResponse}
                            </p>
                          </div>
                        ) : (
                          <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                            <div className="flex items-center gap-2">
                              <Clock3
                                size={17}
                                className="text-slate-500"
                              />

                              <p className="text-sm font-medium text-slate-400">
                                No admin response yet
                              </p>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                              The administration has not
                              responded to this feedback
                              yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;