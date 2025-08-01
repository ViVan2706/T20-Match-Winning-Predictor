import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useWinPrediction } from "@/hooks/useWinPrediction"; 

interface MatchState {
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  balls: number;
  target?: number;
  innings: 1 | 2;
}

interface MatchInterfaceProps {
  team1: string;
  team2: string;
  battingFirst: string;
  onMatchEnd: (winner: string) => void;
  onLeaveMatch: () => void;
}

const MatchInterface = ({ team1, team2, battingFirst, onMatchEnd, onLeaveMatch }: MatchInterfaceProps) => {
  const [match, setMatch] = useState<MatchState>({
    battingTeam: battingFirst,
    bowlingTeam: battingFirst === team1 ? team2 : team1,
    runs: 0,
    wickets: 0,
    balls: 0,
    innings: 1
  });
  const prediction = useWinPrediction(match); 
  // const calculateWinProbability = () => {
  //   if (match.innings === 1) {
  //     // First innings - rough estimate based on run rate and wickets
  //     const runRate = match.balls > 0 ? (match.runs / match.balls) * 6 : 0;
  //     const wicketsFactor = (10 - match.wickets) / 10;
  //     const battingProb = Math.min(90, Math.max(10, runRate * 8 + wicketsFactor * 40));
  //     return { batting: battingProb, bowling: 100 - battingProb };
  //   } else {
  //     // Second innings - based on required run rate
  //     const required = (match.target || 0) - match.runs;
  //     const ballsLeft = 120 - match.balls;
  //     const requiredRate = ballsLeft > 0 ? (required / ballsLeft) * 6 : 0;
      
  //     if (required <= 0) return { batting: 95, bowling: 5 };
  //     if (match.wickets >= 10) return { batting: 0, bowling: 100 };
  //     if (ballsLeft <= 0) return { batting: 0, bowling: 100 };
      
  //     const wicketsFactor = (10 - match.wickets) / 10;
  //     const rateComparison = Math.max(0, 12 - requiredRate) / 12;
  //     const battingProb = Math.min(95, Math.max(5, rateComparison * 70 + wicketsFactor * 25));
      
  //     return { batting: battingProb, bowling: 100 - battingProb };
  //   }
  // };

  // const probability = calculateWinProbability();

 const handleScoring = (runs: number, isWicket: boolean = false) => {
  setMatch(prev => {
    const updated = {
      ...prev,
      runs: prev.runs + runs,
      wickets: isWicket ? prev.wickets + 1 : prev.wickets,
      balls: prev.balls + 1,
    };

    // End of first innings
    if (updated.innings === 1 && (updated.balls >= 120 || updated.wickets >= 10)) {
      return {
        battingTeam: prev.bowlingTeam,
        bowlingTeam: prev.battingTeam,
        runs: 0,
        wickets: 0,
        balls: 0,
        target: updated.runs + 1,
        innings: 2,
      };
    }

    // End of second innings (match end)
    if (updated.innings === 2) {
      const isAllOut = updated.wickets === 10;
      const isBallsOver = updated.balls === 120;
      const hasChased = updated.runs >= (updated.target || 0);

      if (hasChased) {
        onMatchEnd(updated.battingTeam); // chased successfully
        return updated;
      }

      if (isAllOut || isBallsOver) {
        let winner: string;

        if (updated.runs === updated.target-1) {
          winner = "draw";
        } else {
          winner = updated.runs >= (updated.target || 0)
            ? updated.battingTeam
            : updated.bowlingTeam;
        }

        onMatchEnd(winner);
        return updated;
      }
    }

    return updated;
  });
};


  const formatOvers = (balls: number) => {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header with Leave Match button */}
      <header className="h-16 border-b bg-card flex items-center justify-end px-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Leave Match</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Match?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to leave the match? All progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onClick={onLeaveMatch}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      {/* Main content */}
      <div className="p-4 space-y-4">
        {/* Team scores */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-lg font-semibold">{match.battingTeam}</div>
            <div className="text-2xl font-bold">{match.runs}/{match.wickets}</div>
            {match.innings === 2 && match.target && (
              <div className="text-sm text-muted-foreground">
                Need {match.target - match.runs} from {120 - match.balls} balls
              </div>
            )}
          </div>
          
          <div className="text-right flex-1">
            <div className="text-lg font-semibold">{match.bowlingTeam}</div>
            <div className="text-xl">Overs: {formatOvers(match.balls)}</div>
          </div>
        </div>

        {/* Win Probability Bar */}
        {/* <div className="bg-card rounded-lg p-4">
          <div className="flex justify-between mb-2 text-sm">
            <span>{probability.batting.toFixed(0)}%</span>
            <span className="text-muted-foreground">Win Probability</span>
            <span>{probability.bowling.toFixed(0)}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${probability.batting}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{match.battingTeam}</span>
            <span>{match.bowlingTeam}</span>
          </div>
        </div> */}
        {/* Win Probability Bar */}
        <div className="bg-card rounded-lg p-4">
          {parseFloat(prediction.batting) === 0 && parseFloat(prediction.bowling) === 0 ? (
             <div className="text-center text-sm text-muted-foreground">
              <div>Probability meter is loading...</div>
              <div className="text-xs mt-1">It may take up to 50 seconds to load the first time.</div>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-2 text-sm">
                <span>{prediction.batting}</span>
                <span className="text-muted-foreground">Win Probability</span>
                <span>{prediction.bowling}</span>
              </div>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${parseFloat(prediction.batting)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{match.battingTeam}</span>
                <span>{match.bowlingTeam}</span>
              </div>
            </>
          )}
        </div>



        {/* Scoring Buttons */}
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <Button 
            onClick={() => handleScoring(0)}
            variant="outline"
            className="h-16 text-lg"
          >
            Dot (0)
          </Button>
          
          <Button 
            onClick={() => handleScoring(1)}
            variant="outline"
            className="h-16 text-lg"
          >
            1 Run
          </Button>
          
          <Button 
            onClick={() => handleScoring(2)}
            variant="outline"
            className="h-16 text-lg"
          >
            2 Runs
          </Button>
          
          <Button 
            onClick={() => handleScoring(3)}
            variant="outline"
            className="h-16 text-lg"
          >
            3 Runs
          </Button>
          
          <Button 
            onClick={() => handleScoring(4)}
            className="h-16 text-lg bg-yellow-600 hover:bg-yellow-600"
          >
            4 Runs
          </Button>
          
          <Button 
            onClick={() => handleScoring(6)}
            className="h-16 text-lg bg-yellow-500 hover:bg-yellow-600"
          >
            6 Runs!
          </Button>
          
          <Button 
            onClick={() => handleScoring(0, true)}
            variant="destructive"
            className="h-16 text-lg col-span-2"
          >
            Wicket! 🏏
          </Button>
        </div>

        {/* Match Info */}
        <div className="text-center text-sm text-muted-foreground">
          {match.innings === 1 ? "First Innings" : "Second Innings"} • Ball {match.balls + 1}/120
        </div>
      </div>
    </div>
  );
};

export default MatchInterface;
