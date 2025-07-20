# 🏏 Cricket Win Predictor Web App

<p align="center">
  <img src="./T20_Match_Prediction.png" alt="T20 Logo" width="500"/>
</p>

This project predicts cricket match outcomes in real-time based on ball-by-ball input.
It uses a **Machine Learning model (Logistic Regression)** built from scartch, trained on historical T20 data.

This project is built with learnings from the **Summer of ML(SOM 25)** by **BitByte Summer of Code (Bsoc 25)**

<p align="center">
  <img src="./TpcSom.png" alt="BitByte Tpc Som Logo" width="300"/>
</p>

The system consists of:

* 🖥️ **Backend:** Python FastAPI serving prediction APIs
* 💻 **Frontend:** React.js for live user interaction and visualization

---

## ⚙️ Complete Setup Guide (A-Z)

### ✅ Step 1: Install Prerequisites

#### 1️⃣ Install Python 3.x

* Download and install Python from:
  👉 [https://www.python.org/downloads/](https://www.python.org/downloads/)
* Ensure **pip** is added to your PATH (usually done automatically)
* Verify installation:

  ```bash
  python --version
  pip --version
  ```

#### 2️⃣ Install Node.js & npm

* Download and install **Node.js** from:
  👉 [https://nodejs.org/](https://nodejs.org/)
* This automatically installs **npm** (Node Package Manager)
* Verify installation:

  ```bash
  node -v
  npm -v
  ```

---

### ✅ Step 2: Backend Setup and Running

1️⃣ Navigate to the Backend folder:

```bash
cd Backend
```

2️⃣ Install backend dependencies:

```bash
pip install -r requirements.txt
```

3️⃣ Start the backend server:

```bash
python Model.py
```

* The backend API will start running on `http://localhost:8000` (or as configured)
* ✅ Keep **Backend** running in one terminal window.

---

### ✅ Step 3: Frontend Setup and Running

1️⃣ Open another terminal window:

2️⃣ Navigate to the Frontend folder:

```bash
cd Frontend
```

3️⃣ Install frontend dependencies:

```bash
npm i
```

4️⃣ Start the frontend development server:

```bash
npm run dev
```

* The frontend will start on `http://localhost:3000` (or as per your React/Vite/Next.js setup)
* ✅ Keep **Frontend** running in another terminal window.

---

### ✅ Step 4: Running the Full Application

* ✅ Keep **Backend** running in one terminal window.
* ✅ Keep **Frontend** running in another terminal window.
* ✅ Open `http://localhost:3000` in your browser.
* ✅ Make sure both servers stay active during usage.

---

### ✅ Notes & Tips

* If you face any CORS issues, ensure your backend allows frontend connections.
* Stop any server with `Ctrl + C` in the terminal.
---

## 📄 Summary

| Component | Technology       | Command           |
| --------- | ---------------- | ----------------- |
| Backend   | Python + FastAPI | `python Model.py` |
| Frontend  | React.js + npm   | `npm run dev`     |

---

## 📝 Author Notes

This README includes  running both backend and frontend — all in **one single file**. Follow the steps in order for a hassle-free experience.

---

## 🚀 Happy Predicting!

<p align="center">
  <img src="https://github.com/bsoc-bitbyte/Summer-of-ML/blob/main/logo.png" alt="SOM Logo" />
</p>
