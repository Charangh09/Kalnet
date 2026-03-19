import Card from "./Card";

const getScoreColor = (score) => {
  if (score >= 80) {
    return {
      text: "text-green-600",
      bar: "bg-green-500"
    };
  }

  if (score >= 50) {
    return {
      text: "text-yellow-500",
      bar: "bg-yellow-500"
    };
  }

  return {
    text: "text-red-600",
    bar: "bg-red-500"
  };
};

const ScoreCard = ({ clarityScore }) => {
  const score = Math.max(0, Math.min(100, clarityScore?.score || 0));
  const colors = getScoreColor(score);
  const breakdown = clarityScore?.breakdown || {};

  return (
    <Card className="border border-gray-100">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-base font-medium uppercase tracking-wide text-gray-500">Clarity Score</p>
        <p className={`mt-2 text-5xl font-bold ${colors.text}`}>{score}</p>
        <p className="text-base text-gray-500">out of 100</p>
      </div>

      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="mt-5 grid gap-2 text-[15px] text-gray-700 sm:grid-cols-2">
        <p>Goal: {breakdown.goal || 0}/25</p>
        <p>Steps: {breakdown.steps || 0}/25</p>
        <p>Timeline: {breakdown.timeline || 0}/25</p>
        <p>Completeness: {breakdown.completeness || 0}/25</p>
      </div>
    </Card>
  );
};

export default ScoreCard;
