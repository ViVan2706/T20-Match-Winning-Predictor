
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface TossScreenProps {
  team1: string;
  team2: string;
  onTossComplete: (winner: string, choice: 'bat' | 'bowl') => void;
}

const TossScreen = ({ team1, team2, onTossComplete }: TossScreenProps) => {
  const [tossCall, setTossCall] = useState<'heads' | 'tails' | null>(null);
  const [tossResult, setTossResult] = useState<'heads' | 'tails' | null>(null);
  const [tossWinner, setTossWinner] = useState<string>("");
  const [showChoice, setShowChoice] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const flipCoin = (call: 'heads' | 'tails') => {
    setTossCall(call);
    setIsFlipping(true);
    
    setTimeout(() => {
      const rndm=Math.random()
      const result = rndm > 0.5 ? 'heads' : 'tails';
      setTossResult(result);
      const winner = call === result ? team1 : team2;
      setTossWinner(winner);
      setIsFlipping(false);
      setShowChoice(true);
    }, 2000);
  };

  const makeChoice = (choice: 'bat' | 'bowl') => {
    onTossComplete(tossWinner, choice);
  };

  if (showChoice) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-xl">Toss Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-lg">
              <p className="mb-2">🪙 {tossResult?.toUpperCase()}</p>
              <p className="font-semibold text-green-600">{tossWinner} wins the toss!</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Choose your option:</p>
              <div className="flex gap-2">
                <Button onClick={() => makeChoice('bat')} className="flex-1">
                  Bat First
                </Button>
                <Button onClick={() => makeChoice('bowl')} variant="outline" className="flex-1">
                  Bowl First
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">Toss Time</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{team1} calls...</p>
          
          {isFlipping ? (
            <div className="py-8">
              <div className="animate-spin text-6xl mb-4">🪙</div>
              <p className="text-muted-foreground">Flipping coin...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Button onClick={() => flipCoin('heads')} className="w-full">
                HEADS
              </Button>
              <Button onClick={() => flipCoin('tails')} variant="outline" className="w-full">
                TAILS
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TossScreen;
