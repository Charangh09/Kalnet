import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  ListChecks,
  Target,
  TrendingUp,
} from "lucide-react";
import Badge from "./components/Badge";
import Button from "./components/Button";
import Card from "./components/Card";
import ScoreCard from "./components/ScoreCard";
import { analyzePlan } from "./services/api";

const defaultIdea = "I want to start a YouTube channel and earn money quickly";

const getMissingVariant = (missing) => (missing ? "red" : "green");

const renderMissingItem = (title, item, missingText, presentText) => {
  const isMissing = Boolean(item?.missing);
  const statusText = isMissing ? missingText : presentText;
  const insight = item?.insight || (isMissing ? missingText : presentText);

  return (
    <li className="rounded-xl border border-gray-100 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[15px] font-semibold text-gray-900">
          {isMissing ? (
            <AlertTriangle className="h-4 w-4 text-red-500" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          )}
          <span>{title}</span>
        </div>
        <Badge variant={getMissingVariant(isMissing)}>{statusText}</Badge>
      </div>
      <p className="text-[15px] text-gray-600">{insight}</p>
    </li>
  );
};

function App() {
  const [idea, setIdea] = useState(defaultIdea);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previousResult = useMemo(() => {
    if (history.length < 2) return null;
    return history[history.length - 2];
  }, [history]);

  const scoreDelta = result && previousResult
    ? (result.clarity_score?.score || 0) - (previousResult.clarity_score?.score || 0)
    : 0;

  const handleAnalyze = async () => {
    if (!idea.trim()) {
      setError("Please enter an idea or plan.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const analysis = await analyzePlan(idea.trim());
      setResult(analysis);
      setHistory((prev) => [...prev, analysis]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Explain My Plan</h1>
          <p className="mt-2 text-base text-gray-500">AI Clarity & Structuring Tool</p>
        </header>

        <Card className="mb-6">
          <label htmlFor="idea-input" className="mb-2 block text-base font-semibold text-gray-700">
            Enter your raw idea or plan
          </label>
        <textarea
          id="idea-input"
          rows={6}
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder="I want to start a YouTube channel and earn money quickly"
          className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-base text-gray-900 outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
        />

          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleAnalyze} loading={loading}>
              {loading ? "Analyzing..." : "Analyze Plan"}
            </Button>
            {error && <p className="text-base text-red-600">{error}</p>}
          </div>
        </Card>

      {result && (
        <>
          <section className="mb-6">
            <ScoreCard clarityScore={result.clarity_score} />
          </section>

          {previousResult && (
            <section className="mb-6 grid gap-6 md:grid-cols-2">
              <Card title="Previous Score" icon={TrendingUp} className="bg-gray-100">
                <p className="text-3xl font-bold text-gray-600">{previousResult.clarity_score?.score || 0}</p>
                <p className="mt-1 text-[15px] text-gray-500">Earlier analysis score</p>
              </Card>

              <Card title="Current Score" icon={TrendingUp} className="border border-green-200">
                <p className="text-3xl font-bold text-green-600">{result.clarity_score?.score || 0}</p>
                <p className="mt-1 text-[15px] text-gray-500">
                  Improvement: <span className={`font-semibold ${scoreDelta >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}
                  </span>
                </p>
              </Card>
            </section>
          )}

          <section className="grid gap-6 lg:grid-cols-3">
            <Card title="Goal & Method" icon={Target}>
              <div className="space-y-3 text-[15px] text-gray-700">
                <p><span className="font-semibold text-gray-900">Goal:</span> {result.structured_plan?.goal || "Not identified"}</p>
                <p><span className="font-semibold text-gray-900">Method:</span> {result.structured_plan?.method || "Not identified"}</p>
                <p><span className="font-semibold text-gray-900">Timeline:</span> {result.structured_plan?.timeline || "Not specified"}</p>
              </div>
            </Card>

            <Card title="Steps" icon={ListChecks}>
              {result.structured_plan?.steps?.length ? (
                <ol className="list-decimal space-y-2 pl-5 text-[15px] text-gray-700">
                  {result.structured_plan.steps.map((step, index) => (
                    <li key={`${step}-${index}`}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-[15px] text-gray-500">No clear steps found.</p>
              )}
            </Card>

            <Card title="Missing Elements" icon={AlertTriangle}>
              <ul className="space-y-3">
                {renderMissingItem(
                  "Goal Clarity",
                  result.missing_elements?.goal_clarity,
                  "Missing",
                  "Present",
                )}
                {renderMissingItem(
                  "Execution Steps",
                  result.missing_elements?.steps_missing,
                  "Missing",
                  "Present",
                )}
                {renderMissingItem(
                  "Resources",
                  result.missing_elements?.resources_missing,
                  "Missing",
                  "Identified",
                )}
                {renderMissingItem(
                  "Timeline",
                  result.missing_elements?.timeline_missing,
                  "Missing",
                  "Present",
                )}
              </ul>
            </Card>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card title="Simplified Version" icon={Lightbulb}>
              <p className="text-[15px] text-gray-700">{result.simplified_version || "No simplified version generated."}</p>
            </Card>

            <Card title="Action Steps" icon={ClipboardList}>
              {result.action_steps?.length ? (
                <ol className="list-decimal space-y-2 pl-5 text-[15px] text-gray-700">
                  {result.action_steps.map((item, index) => (
                    <li key={`${item}-${index}`}>{item}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-[15px] text-gray-500">No action steps generated.</p>
              )}
            </Card>
          </section>
        </>
      )}
      </main>
    </div>
  );
}

export default App;
