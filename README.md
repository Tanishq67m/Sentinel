# 🛡️ Sentinel: Deployment Governance Gateway

**Sentinel** is an automated, zero-trust deployment gatekeeper. It evaluates software release requests against strict business policies before they are allowed to advance. Built with a deterministic state machine, it enforces interface safety, tracks granular observability data, and intercepts misconfigured deployments before they reach production.

---

## 🎯 The Problem

In high-velocity software engineering, humans make mistakes. Engineers might deploy untested "draft" versions, push code without peer review, or use unauthorized tools. When bad code reaches production, services drop and users are impacted. 

**Sentinel acts as a rigid, emotionless backend.** It intercepts incoming deployment requests and strictly evaluates them against predefined rules. If the payload is flawed, Sentinel mechanically rejects it.

---

## 🏗️ Core Architecture & Evaluation Metrics

This project was built explicitly to demonstrate three core engineering tenets:

### 1. Interface Safety
The system cannot be silently corrupted by bad data. 
- **Backend:** All incoming payloads are strongly typed and shielded using **Pydantic** schemas in Python. If a JSON payload is structurally malformed or missing fields, the API throws an explicit `422 Unprocessable Entity` before the payload even touches the policy logic.
- **Frontend:** UI interactions are handled seamlessly via fully typed **TypeScript** interfaces.

### 2. State Correctness (The State Machine)
Transitions are strictly governed by a unidirectional state machine. A deployment request must flow sequentially through locked states.
- `VALIDATING`: The engine securely locks the node while reviewing data.
- `<TERMINAL STATES>`: The request is atomically transitioned into a final state: `APPROVED`, `MANUAL_REVIEW`, or `REJECTED`. 
Race conditions and undocumented mutations are structurally impossible.

### 3. Sub-Second Observability
Without an audit trail, failures are a mystery. Every time the deployment transitions states, the engine burns an immutable entry into the `audit_telemetry_logs` database table. The UI accurately fetches and parses these timestamps down to the fractional second to provide a full diagnostic trace of *why* the rules failed.

---

## ⚙️ The Policy Engine Ruleset
Under the hood, Sentinel enforces the following example business constraints concurrently:
1. **Corporate Identity:** The request must originate from an authorized corporate email domain (`@company.com`). Generic emails (`@gmail.com`) are forcibly rejected.
2. **Execution Manifest:** The release notes attached to the deployment must exceed a strictly enforced character limit (20 chars) to ensure thorough documentation.
3. **Draft Guardrail:** The version tag must not include `-dev` or `-draft`.
4. **Environment Interception:** If the requested environment is `Production`, the system overrides auto-approval and forces the deployment into a `MANUAL_REVIEW` holding state.

---

## 💻 Tech Stack
- **Backend**: Python, Flask, Pydantic, SQLite3 (for ACID-compliant state storage).
- **Frontend**: React.js, Vite, TypeScript, Custom CSS.
- **Design Paradigm**: High-Contrast Editorial Brutalism & Tactile Interfaces.

---

## 🚀 Local Development Setup

To run Sentinel locally, you need two terminal windows running concurrently.

### 1. Start the Backend (API & Engine)
Navigate to the `backend` directory, install requirements, and run the server.

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```
> The API will launch on `http://127.0.0.1:5001`.

### 2. Start the Frontend (Client & UI)
Open a new terminal window, navigate to the `frontend` directory, and start the Vite development server.

```bash
cd frontend
npm install
npm run dev
```
> The client will mount natively on `http://localhost:5173`.

---

## 🧪 Testing the Workflow

1. Open `http://localhost:5173` to view the Landing Page. Click **Launch Console**.
2. **Test an Auto-Approval**: Submit the form targeting the `Staging` environment using a valid corporate email and detailed notes. Watch the feed transition to `APPROVED`.
3. **Test a Locked Verification**: Submit an identical valid form, but switch the environment toggle to `Production`. The system intercepts it and places it in `MANUAL_REVIEW`.
4. **Test a Rejection**: Attempt to submit using a `@gmail.com` address or `-draft` version. The engine will lock you out with a `REJECTED` status. 
5. Select any Request Card in the feed to open the **Live Telemetry Panel** and read the exact SQLite audit logs and engine outputs.

## 📄 License
MIT License.
