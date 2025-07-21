import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import joblib
import os
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Data
df = pd.read_csv("./Final_T20.csv")
X = df[['total_runs', 'total_wickets', 'required_runs',
        'balls_remaining', 'run_rate', 'required_run_rate', 'wickets_remaining']]
y = df['result']

best_model = joblib.load('./model.pkl')
scaler = joblib.load('./scaler.pkl')
base_inning1_win_prob = df["result"].value_counts()[1] / df["result"].value_counts().sum()
base_inning2_win_prob = df["result"].value_counts()[2] / df["result"].value_counts().sum()

# First Innings Target (Mean of Winning Scores)
first_inning_target = df[(df['innings'] == 1) & (df['result'] == 1) & (
    (df['ball_bowled'] == 120) | (df['total_wickets'] == 10))]['total_runs'].mean()

# Heuristic Functions


def heuristic_first_innings(total_runs, total_wickets, ball_bowled):
    run_rate = (total_runs / ball_bowled) * 6 if ball_bowled else 0
    wickets_factor = (10 - total_wickets) / 10
    batting_prob = min(90, max(10, run_rate * 8 + wickets_factor * 40))
    return batting_prob, 100 - batting_prob


def heuristic_second_innings(total_runs, total_wickets, ball_bowled, target):
    required = max(0, target - total_runs)
    balls_left = 120 - ball_bowled
    required_rate = (required / balls_left) * 6 if balls_left > 0 else 0

    if required <= 0:
        return 95, 5
    if total_wickets >= 10 or balls_left <= 0:
        return 0, 100

    wickets_factor = (10 - total_wickets) / 10
    rate_comparison = max(0, 12 - required_rate) / 12
    batting_prob = min(95, max(5, rate_comparison * 70 + wickets_factor * 25))
    return batting_prob, 100 - batting_prob

def calculate_prediction(total_runs, total_wickets, ball_bowled, target_score,inning):
    if (ball_bowled == 0 and inning==1):
        return {
            'Team Batting Win %': f"{df['result'].value_counts()[1] / df['result'].value_counts().sum() * 100:.2f}%",
            'Team Bowling Win %': f"{df['result'].value_counts()[2] / df['result'].value_counts().sum() * 100:.2f}%"
        }
    required_runs = target_score - total_runs
    balls_remaining = 120 - ball_bowled
    run_rate = total_runs / (ball_bowled / 6) if ball_bowled else 0
    required_run_rate = required_runs / (balls_remaining / 6) if balls_remaining else 0
    wickets_remaining = 10 - total_wickets
    if required_runs > balls_remaining * 6:
        return {
            'Team Batting Win %': "0.50%",
            'Team Bowling Win %': "99.50%"
        }

    df_input = pd.DataFrame([{
        'total_runs': total_runs,
        'total_wickets': total_wickets,
        'required_runs': required_runs,
        'balls_remaining': balls_remaining,
        'run_rate': run_rate,
        'required_run_rate': required_run_rate,
        'wickets_remaining': wickets_remaining
    }])

    input_scaled = scaler.transform(df_input)
    probs = best_model.predict_proba(input_scaled)[0]

    model_batting = probs[1] * 100
    model_bowling = probs[0] * 100

    # Heuristic Logic
    if target_score == first_inning_target:  # First innings
        run_rate_heur = run_rate
        wickets_factor = (10 - total_wickets) / 10
        heur_batting = min(90, max(10, run_rate_heur * 8 + wickets_factor * 40))
        heur_bowling = 100 - heur_batting
    else:  # Second innings
        if required_runs <= 0:
            heur_batting = 95
            heur_bowling = 5
        elif total_wickets >= 10 or balls_remaining <= 0:
            heur_batting = 0
            heur_bowling = 100
        else:
            wickets_factor = (10 - total_wickets) / 10
            rate_comparison = max(0, 12 - required_run_rate) / 12
            heur_batting = min(95, max(5, rate_comparison * 70 + wickets_factor * 25))
            heur_bowling = 100 - heur_batting

    # Weighted Blending: 50% Model + 30% Heuristic + 20% Base
    final_batting = 0.6 * model_batting + 0.2 * heur_batting + 0.2 * (base_inning1_win_prob * 100)
    final_bowling = 100 - final_batting

    return {
        'Team Batting Win %': f"{final_batting:.2f}%",
        'Team Bowling Win %': f"{final_bowling:.2f}%"
    }

# API Models
class BallInputInning2(BaseModel):
    total_runs: int
    total_wickets: int
    ball_bowled: int
    target_score: int

class BallInputInning1(BaseModel):
    total_runs: int
    total_wickets: int
    ball_bowled: int

# API Endpoints
@app.post("/predictinning1")
def predict_inning1(input_data: BallInputInning1):
    return calculate_prediction(
        input_data.total_runs,
        input_data.total_wickets,
        input_data.ball_bowled,
        first_inning_target,
        inning=1
    )

@app.post("/predictinning2")
def predict_inning2(input_data: BallInputInning2):
    return calculate_prediction(
        input_data.total_runs,
        input_data.total_wickets,
        input_data.ball_bowled,
        input_data.target_score,
        inning=2
    )

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run("Model:app", host="0.0.0.0", port=port, reload=True)
