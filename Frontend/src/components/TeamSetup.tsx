
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface TeamSetupProps {
  onTeamsSet: (team1: string, team2: string) => void;
}

const TeamSetup = ({ onTeamsSet }: TeamSetupProps) => {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");

  const handleSubmit = () => {
    if (team1.trim() && team2.trim()) {
      onTeamsSet(team1.trim(), team2.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Cricket Match Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Team 1 Name</label>
            <Input
              value={team1}
              onChange={(e) => setTeam1(e.target.value)}
              placeholder="Enter first team name"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Team 2 Name</label>
            <Input
              value={team2}
              onChange={(e) => setTeam2(e.target.value)}
              placeholder="Enter second team name"
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full mt-6"
            disabled={!team1.trim() || !team2.trim()}
          >
            Start Match
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamSetup;
