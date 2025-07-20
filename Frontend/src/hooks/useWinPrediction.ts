import { useEffect, useState } from "react";

interface Prediction {
  batting: string;
  bowling: string;
}

interface MatchState {
  innings: 1 | 2;
  runs: number;
  wickets: number;
  balls: number;
  target?: number;
}

export const useWinPrediction = (match: MatchState) => {
  const [prediction, setPrediction] = useState<Prediction>({
    batting: "0%",
    bowling: "0%"
  });

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const url =
          match.innings === 1
            ? "http://127.0.0.1:8000/predictinning1"
            : "http://127.0.0.1:8000/predictinning2";

        const body =
          match.innings === 1
            ? {
                total_runs: match.runs,
                total_wickets: match.wickets,
                ball_bowled: match.balls
              }
            : {
                total_runs: match.runs,
                total_wickets: match.wickets,
                ball_bowled: match.balls,
                target_score: match.target || 0
              };

        console.log("Sending POST to", url, "with body", body);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          console.error("API Error", response.status, response.statusText);
          return;
        }

        const data = await response.json();

        console.log("API Response:", data);

        setPrediction({
          batting: data["Team Batting Win %"] || "0%",
          bowling: data["Team Bowling Win %"] || "0%"
        });
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchPrediction();
  }, [match]);

  return prediction;
};
