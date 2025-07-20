import { useState } from "react";
import TeamSetup from "@/components/TeamSetup";
import TossScreen from "@/components/TossScreen";
import MatchInterface from "@/components/MatchInterface";
import MatchResult from "@/components/MatchResult";
import DarkModeToggle from "@/components/DarkModeToggle";

type GameState = 'setup' | 'toss' | 'match' | 'result';

const Index = () => {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [teams, setTeams] = useState({ team1: '', team2: '' });
  const [battingFirst, setBattingFirst] = useState('');
  const [winner, setWinner] = useState('');

  const handleTeamsSet = (team1: string, team2: string) => {
    setTeams({ team1, team2 });
    setGameState('toss');
  };

  const handleTossComplete = (tossWinner: string, choice: 'bat' | 'bowl') => {
    setBattingFirst(choice === 'bat' ? tossWinner : (tossWinner === teams.team1 ? teams.team2 : teams.team1));
    setGameState('match');
  };

  const handleMatchEnd = (matchWinner: string) => {
    setWinner(matchWinner);
    setGameState('result');
  };

  const handleNewMatch = () => {
    setGameState('toss');
  };

  const handleGoHome = () => {
    setGameState('setup');
    setTeams({ team1: '', team2: '' });
    setBattingFirst('');
    setWinner('');
  };

  const handleLeaveMatch = () => {
    handleGoHome();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dark mode toggle - only show when not in match (match has its own header) */}
      {gameState !== 'match' && <DarkModeToggle />}
      
      {gameState === 'setup' && (
        <TeamSetup onTeamsSet={handleTeamsSet} />
      )}
      
      {gameState === 'toss' && (
        <TossScreen 
          team1={teams.team1}
          team2={teams.team2}
          onTossComplete={handleTossComplete}
        />
      )}
      
      {gameState === 'match' && (
        <MatchInterface
          team1={teams.team1}
          team2={teams.team2}
          battingFirst={battingFirst}
          onMatchEnd={handleMatchEnd}
          onLeaveMatch={handleLeaveMatch}
        />
      )}
      
      {gameState === 'result' && (
        <MatchResult
          winner={winner}
          onNewMatch={handleNewMatch}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
};

export default Index;
