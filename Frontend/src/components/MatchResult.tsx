
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MatchResultProps {
  winner: string;
  onNewMatch: () => void;
  onGoHome: () => void;
}

const MatchResult = ({ winner, onNewMatch, onGoHome }: MatchResultProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Match Complete! 🏆</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{winner}</div>
            <div className="text-lg text-muted-foreground">Wins the Match!</div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={onNewMatch} className="w-full">
              Start New Match
            </Button>
            <Button onClick={onGoHome} variant="outline" className="w-full">
              Go to Home Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchResult;
