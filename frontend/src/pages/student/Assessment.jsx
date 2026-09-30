import { useEffect, useState } from "react";
import assessmentService from "../../services/assessmentService";

function Assessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  async function loadQuestions() {
    try {
      setLoading(true);
      setError("");

      const response =
        await assessmentService.getQuestions();

      setQuestions(response?.questions || []);
    } catch (err) {
      console.error(
        "Failed to load assessment questions:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load assessment questions."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(questionId, answer) {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: answer,
    }));
  }

  function goToNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
    }
  }

  function goToPrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion((previous) => previous - 1);
    }
  }

  async function submitAssessment() {
    if (Object.keys(answers).length !== questions.length) {
      setError(
        "Please answer all questions before submitting."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response =
        await assessmentService.submitAssessment(
          answers
        );

      setResult(response);
    } catch (err) {
      console.error(
        "Failed to submit assessment:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function restartAssessment() {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
    setError("");
  }

  function getScoreEntries() {
    if (!result?.behaviorScores) {
      return [];
    }

    return Object.entries(result.behaviorScores);
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-lg text-slate-400">
          Loading assessment...
        </div>
      </div>
    );
  }

  if (result) {
    const scoreEntries = getScoreEntries();

    return (
      <div className="space-y-8">
        {/* Result Header */}
        <div>
          <p className="text-sm font-medium text-green-400">
            Assessment Completed
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Your Behavioral Analysis
          </h1>

          <p className="mt-2 text-slate-400">
            Your assessment responses have been analyzed.
          </p>
        </div>

        {/* Success Card */}
        <div className="rounded-xl border border-green-500/20 bg-slate-900 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-2xl text-green-400">
              ✓
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Assessment submitted successfully
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Your behavioral profile has been generated.
              </p>
            </div>
          </div>
        </div>

        {/* Behavior Scores */}
        {scoreEntries.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white">
              Behavioral Scores
            </h2>

            <p className="mt-1 text-slate-400">
              Scores calculated from your assessment responses.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {scoreEntries.map(([name, score]) => {
                const numericScore =
                  Number(score) || 0;

                return (
                  <div
                    key={name}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize text-slate-200">
                        {name.replace(/([A-Z])/g, " $1")}
                      </span>

                      <span className="font-bold text-blue-400">
                        {Math.round(numericScore)}%
                      </span>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              numericScore
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Backend Response Information */}
        {result.message && (
          <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <h2 className="text-lg font-semibold text-blue-400">
              Analysis Result
            </h2>

            <p className="mt-2 text-slate-300">
              {result.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={restartAssessment}
            className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Retake Assessment
          </button>

          <a
            href="/career-analysis"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            View Career Analysis
          </a>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
        <h1 className="text-2xl font-bold text-white">
          No Assessment Questions
        </h1>

        <p className="mt-2 text-slate-400">
          Assessment questions are currently unavailable.
        </p>

        <button
          onClick={loadQuestions}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  const selectedAnswer =
    answers[question.id];

  const answeredCount =
    Object.keys(answers).length;

  const progress =
    Math.round(
      ((currentQuestion + 1) /
        questions.length) *
        100
    );

  const isLastQuestion =
    currentQuestion === questions.length - 1;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-blue-400">
          Behavioral Assessment
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Discover Your Career Profile
        </h1>

        <p className="mt-2 text-slate-400">
          Answer the questions honestly. Your responses
          help analyze your behavioral preferences.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Progress */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Question
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {currentQuestion + 1} of {questions.length}
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="mt-1 text-lg font-semibold text-blue-400">
              {answeredCount}/{questions.length}
            </p>
          </div>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
            Question {currentQuestion + 1}
          </span>

          <span className="text-sm text-slate-500">
            {progress}%
          </span>
        </div>

        <h2 className="mt-6 text-2xl font-bold leading-relaxed text-white">
          {question.question}
        </h2>

        {/* Options */}
        <div className="mt-8 space-y-4">
          {(question.options || []).map(
            (option, index) => {
              const optionText =
                typeof option === "string"
                  ? option
                  : option.text;

              const optionValue =
                typeof option === "string"
                  ? option
                  : option.value ??
                    option.text ??
                    index;

              const isSelected =
                String(selectedAnswer) ===
                String(optionValue);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    selectAnswer(
                      question.id,
                      optionValue
                    )
                  }
                  className={`w-full rounded-xl border p-5 text-left transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
                        isSelected
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-slate-600 text-slate-400"
                      }`}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </div>

                    <span
                      className={`text-base ${
                        isSelected
                          ? "font-medium text-white"
                          : "text-slate-300"
                      }`}
                    >
                      {optionText}
                    </span>
                  </div>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="rounded-lg bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        {!isLastQuestion ? (
          <button
            type="button"
            onClick={goToNext}
            disabled={!selectedAnswer}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            onClick={submitAssessment}
            disabled={
              submitting ||
              !selectedAnswer ||
              answeredCount !== questions.length
            }
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting
              ? "Analyzing..."
              : "Submit Assessment"}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
        <p className="text-sm leading-6 text-slate-300">
          <span className="font-semibold text-blue-400">
            Tip:
          </span>{" "}
          There are no right or wrong answers. Choose the
          option that best represents you.
        </p>
      </div>
    </div>
  );
}

export default Assessment;