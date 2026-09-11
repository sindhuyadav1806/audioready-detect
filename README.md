# VoxGuard AI

Build a complete, polished, hackathon-ready full-stack prototype for Smart India Hackathon 2026 Problem Statement SIH26104 – “AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks.”

The application should look and feel like a real cybersecurity / AI voice fraud detection product, not a simple static website.

1. PRODUCT CONCEPT

Build a platform called:

VoxShield AI
Real-Time Voice Integrity & Impersonation Detection

Tagline:
“Detect AI-generated voices before they become real-world threats.”

The platform detects whether a caller is using:

AI-generated speech

Voice cloning

Synthetic speech

Manipulated audio

Potential impersonation

It should analyze voice/audio, calculate an impersonation risk score, explain the reasons for the score, and recommend actions such as callback verification, MFA, or supervisor escalation.

IMPORTANT:
This is a prototype/demo. If an actual ML voice-detection backend is not available, create a realistic mock AI inference layer with clearly structured functions/API endpoints so that a real deep-learning model can later replace the mock inference.

Do NOT falsely claim that the prototype has scientifically validated voice-cloning detection.

2. TECHNOLOGY

Use:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide icons

Recharts for graphs

Supabase for authentication/database/storage if backend persistence is required

Web Audio API / MediaRecorder API for microphone recording

Clean component-based architecture

Make the application responsive for:

Desktop

Tablet

Mobile

Use a professional cybersecurity visual style:

Dark navy/black background

Blue/cyan accent colors

Subtle gradients

Glassmorphism cards

Clean dashboard

Professional enterprise UI

Smooth animations

Avoid excessive flashy animations

3. MAIN APPLICATION STRUCTURE

Create these pages:

Landing Page

Login / Sign Up

Security Dashboard

Live Voice Analysis

Audio Upload Analysis

Detection Result

Call Verification

Risk History

Analytics

Alerts Center

API / Integration

Privacy & Compliance

Settings

Use a persistent sidebar after login.

Sidebar:

Overview

Live Detection

Analyze Audio

Verification

Risk History

Analytics

Alerts

API Integration

Privacy

Settings

Top bar:

Product logo

Search

Notifications

System status

User profile

4. LANDING PAGE

Create a high-quality cybersecurity SaaS landing page.

Hero:

Stop Voice Cloning Attacks Before They Cause Damage

Subtitle:

“VoxShield AI analyzes voice characteristics, speech patterns and contextual signals to identify potential AI-generated or cloned voices in real time.”

Buttons:

Start Detection
View Demo

Hero visual:
Create a futuristic voice-analysis visualization with:

Audio waveform

AI scanning animation

Risk score

“Voice Integrity Verified” / “Potential Threat Detected”

Add sections:

Why Voice Security Matters

Explain that generative AI enables high-fidelity voice cloning and can be used to impersonate executives, officials and trusted individuals.

How It Works

Show 4 steps:

Capture Voice

Analyze Voice

Calculate Risk

Prevent Fraud

Detection Layers

Cards:

Acoustic Analysis

Spectral Analysis

Prosody Analysis

Behavioral Analysis

Speaker Consistency

Contextual Risk Analysis

Use Cases

Banking

Enterprise

Government

Telecom

Call Centers

High-value Transactions

Privacy First

Show:

Minimal audio retention

Feature-only logging

Edge/on-device inference ready

Secure processing

5. LOGIN / SIGNUP

Create authentication UI.

Login fields:

Email

Password

Sign up:

Name

Organization

Email

Password

Role

Roles:

Security Analyst

Bank Employee

Administrator

Enterprise User

Add demo login option:

“Continue with Demo Account”

The demo account should immediately open the dashboard with realistic sample data.

6. MAIN SECURITY DASHBOARD

Create an impressive SOC-style dashboard.

Header:

Voice Security Command Center

Show cards:

Calls Analyzed

Example:
1,284

Threats Detected

Example:
47

High Risk Calls

Example:
12

Detection Accuracy

Display:
94.7%
but label it clearly as:

Prototype / simulated metric

Do not present fabricated performance as real-world validated accuracy.

Live Threat Overview

Create a graph showing:

Safe calls

Suspicious calls

High-risk calls

over the last 24 hours.

Use Recharts.

Recent Calls

Table:

Columns:

Caller

Time

Language

Risk Score

Voice Type

Status

Action

Example:

Rahul Mehta | 14:32 | English | 18% | Human | Safe

Unknown Caller | 14:18 | Hindi | 87% | AI Suspected | High Risk

CEO - Finance | 13:52 | English | 72% | Possible Clone | Suspicious

7. LIVE VOICE DETECTION PAGE

This is the most important demo page.

Title:

Real-Time Voice Integrity Detection

Create two modes:

Mode 1 — Microphone

Button:

Start Recording

Use browser MediaRecorder API.

When recording starts:

Show microphone status

Live waveform

Recording timer

Audio amplitude visualization

“Analyzing voice…” indicator

Buttons:

Pause
Stop & Analyze

After stopping, send the recorded audio to the analysis function.

If actual ML backend is unavailable, use a mock analysis service.

Mode 2 — Simulated Live Call

Create:

Start Simulated Call

Show:

Caller:
Unknown Caller

Call duration:
00:00

Live waveform

Detection status:

Analyzing...

After several seconds, dynamically update:

Acoustic score

Spectral score

Prosody score

Speaker consistency score

Context score

Then calculate an overall risk score.

Example:

87% IMPERSONATION RISK

Status:

🔴 HIGH RISK

8. AUDIO UPLOAD PAGE

Create:

Analyze Voice Recording

Allow:

Drag & drop audio

Browse files

Supported formats: WAV, MP3, M4A, WebM

Show uploaded audio player.

Button:

Analyze Voice

Show processing stages:

Audio preprocessing

Acoustic feature extraction

Spectral analysis

Prosody analysis

Speaker consistency check

Contextual analysis

Risk calculation

Use an animated progress indicator.

9. AI ANALYSIS ENGINE

Create a modular mock service called something like:

voiceAnalysisService.ts

The architecture should make it easy to replace the mock logic with a real FastAPI/ML backend later.

Create a function similar to:

analyzeVoice(audioData, metadata)

Return structured data:

overallRiskScore

classification

confidence

acousticScore

spectralScore

prosodyScore

behavioralScore

speakerConsistencyScore

contextualRiskScore

detectedLanguage

possibleManipulationTypes

explanation

recommendedActions

Classification:

0–30:
LOW RISK

31–60:
MEDIUM RISK

61–80:
SUSPICIOUS

81–100:
HIGH RISK

For prototype/demo purposes, generate deterministic realistic scores rather than completely random values.

10. DETECTION RESULT PAGE

After analysis, show a large result card.

Example:

Voice Integrity Result

87%

HIGH IMPERSONATION RISK

Possible AI-generated / cloned voice detected.

Add circular risk gauge.

Color states:

Green = Safe

Yellow = Medium

Orange = Suspicious

Red = High Risk

Detection Breakdown

Create horizontal progress bars:

Acoustic Analysis
91% suspicious

Spectral Analysis
88% suspicious

Prosody Analysis
79% suspicious

Behavioral Analysis
84% suspicious

Speaker Consistency
92% suspicious

Contextual Risk
81% suspicious

11. EXPLAINABLE AI SECTION

Very important.

Create:

Why was this call flagged?

Show understandable reasons:

Unusual spectral patterns detected

Speech contains characteristics commonly associated with synthetic generation

Pitch variation appears unusually consistent

Pause distribution differs from historical speaker samples

Speaker identity consistency is low

Call context indicates elevated transaction risk

Add:

AI Explanation

“Multiple voice characteristics were inconsistent with the expected natural speech profile. The system therefore classified this call as potentially synthetic or impersonated.”

Add disclaimer:

“Prototype analysis. Results should be treated as risk indicators and verified through independent authentication.”

12. CONTEXTUAL RISK ENGINE

Create a panel:

Contextual Risk Assessment

Fields:

Caller:
Unknown

Caller ID:
+91 XXXXX XXXXX

Known Contact:
No

Transaction:
₹8,50,000

Transaction Type:
Fund Transfer

Previous Interaction:
None

Time:
Unusual

Historical Fraud Indicator:
Medium

Then calculate:

Context Risk: HIGH

Explain that voice detection should not be the only security signal.

13. FRAUD PREVENTION RECOMMENDATION

For high-risk calls show a strong warning:

🚨 POTENTIAL IMPERSONATION DETECTED

Recommended action:

DO NOT APPROVE TRANSACTION

Then buttons:

Verify Caller
Request MFA
Call Back Using Trusted Number
Escalate to Supervisor
Block / End Call

For low-risk calls:

🟢 VOICE APPEARS CONSISTENT

Recommendation:

“Continue normal verification procedures.”

14. CALL VERIFICATION PAGE

Build a dedicated verification workflow.

Title:

Secure Caller Verification

Step 1:
Voice analysis completed.

Step 2:
Identity verification.

Options:

Trusted Callback

Call the saved trusted number.

MFA

Send OTP.

Supervisor Approval

Request approval.

Knowledge Verification

Ask a predefined security question.

Create a mock verification flow.

Example:

Risk score:
87%

System recommendation:
Additional verification required

Click:

Send Verification Request

Then show:
“Verification request sent successfully.”

15. MULTILINGUAL SUPPORT

Create language selector.

Languages:

English

Hindi

Telugu

Tamil

Kannada

Malayalam

Bengali

Marathi

Display:

Detected Language: Telugu

Explain:

“Language-agnostic acoustic features allow the system architecture to support multiple Indian languages and regional accents.”

This should be presented as prototype support architecture, not as a claim of trained production-grade multilingual detection.

16. RISK HISTORY

Create a page:

Voice Threat History

Filters:

Date

Risk level

Language

Caller

Detection type

Table with:

Call ID

Date

Caller

Language

Risk Score

Detection

Action

Status

Add search.

Clicking a row should open detailed analysis.

17. ANALYTICS PAGE

Create charts:

Risk Distribution

Pie/donut chart:

Low

Medium

Suspicious

High

Threats Over Time

Line chart.

Detection Categories

Bar chart:

Voice Cloning

Synthetic Speech

Speaker Mismatch

Manipulated Audio

Language Distribution

Bar chart.

Average Risk Score

Metric card.

All data can initially be realistic mock/demo data.

Clearly label demo/sample analytics where appropriate.

18. ALERT CENTER

Create:

Security Alerts

Example alerts:

🔴 High Risk
“Possible CEO voice impersonation detected.”

🟠 Suspicious
“Speaker consistency mismatch detected.”

🟡 Verification Required
“High-value transaction requires secondary verification.”

Allow:

Mark as read

Resolve

Escalate

Add notification count to the top navigation.

19. API INTEGRATION PAGE

Create an enterprise developer page.

Title:

VoiceShield API

Show sample endpoints:

POST /api/v1/analyze-voice

POST /api/v1/analyze-stream

POST /api/v1/verify-speaker

GET /api/v1/risk/{callId}

GET /api/v1/alerts

Show example JSON request/response in code blocks.

Example response:

{
  "risk_score": 87,
  "classification": "HIGH_RISK",
  "voice_type": "POSSIBLE_SYNTHETIC",
  "language": "en",
  "confidence": 0.91,
  "recommended_action": "SECONDARY_VERIFICATION"
}


Add:

API Key

with masked key.

Button:

Generate API Key

This can be simulated in the prototype.

20. PRIVACY & COMPLIANCE PAGE

Create a professional privacy dashboard.

Sections:

Audio Retention

Toggle:
Minimal Retention

Feature-Only Logging

Toggle:
Enabled

On-Device / Edge Processing

Toggle:
Enabled

Audio Encryption

Status:
Active

Data Access

Show:

Security Team

Administrator

Authorized Investigators

Privacy Principle

Display:

“Store only what is necessary for detection, investigation and security auditing.”

Do not claim specific legal compliance unless implemented and verified.

21. SETTINGS

Include:

Detection Settings

Risk threshold:
Slider

Default:
70%

High-risk threshold:
80%

Alert Settings

Toggle:

SMS

Email

In-app notification

Verification Rules

Checkboxes:

Require MFA for high-risk calls

Require callback for high-value transactions

Escalate high-risk executive impersonation

Organization Settings

Organization name
Industry
Default language

22. DEMO MODE

This is extremely important for the hackathon presentation.

Create a prominent:

Demo Mode

button.

When clicked, allow the judges to experience a complete attack simulation.

Scenario:

“CEO Voice Cloning Attack”

Show:

Incoming Call

Caller:
CEO – Finance Department

Message:
“Please urgently transfer ₹8,50,000 to the new vendor account.”

System starts analysis.

Stage 1:
Audio captured

Stage 2:
Acoustic analysis

Stage 3:
Spectral analysis

Stage 4:
Prosody analysis

Stage 5:
Speaker consistency

Stage 6:
Context analysis

Final:

🚨 87% IMPERSONATION RISK

POSSIBLE AI VOICE CLONE

Then show:

TRANSACTION BLOCKED

Reason:
“High-risk voice + unusual transaction context.”

Then:

Secondary Verification Required

This should be a smooth animated end-to-end demo lasting approximately 10–15 seconds.

23. SAMPLE ATTACK SCENARIOS

Create 4 selectable demo scenarios:

Scenario 1 — CEO Impersonation

Risk: 92%

Scenario 2 — Bank Customer Voice Clone

Risk: 84%

Scenario 3 — Government Official Impersonation

Risk: 76%

Scenario 4 — Genuine Caller

Risk: 12%

Each should produce different analysis breakdowns and recommendations.

24. BLOCKCHAIN / AUDIT LOG

Because the SIH theme is:

Blockchain & Cybersecurity

Add an optional:

Tamper-Evident Security Audit

page.

Do NOT pretend to implement a real blockchain if it is only a frontend prototype.

Instead create a prototype audit ledger showing:

Event ID

Timestamp

Call ID

Risk score

Action

Hash

Previous hash

Status

Example:

Event:
VOICE_ANALYSIS_COMPLETED

Hash:
8f31...a92c

Previous Hash:
91ab...82d1

Status:
Verified

Add an explanation:

“Prototype tamper-evident audit ledger. A production implementation can anchor these records to a permissioned blockchain.”

Create a simple chain visualization:

Event 1 → Event 2 → Event 3 → Event 4

25. DATABASE STRUCTURE

If Supabase is used, create tables approximately like:

users
organizations
calls
voice_analysis
risk_events
alerts
verification_requests
audit_logs
api_keys

Calls should contain:

id

caller

timestamp

language

duration

risk_score

classification

status

Voice analysis:

call_id

acoustic_score

spectral_score

prosody_score

behavioral_score

speaker_consistency_score

contextual_score

detected_language

explanation

Audit logs:

event_id

call_id

timestamp

event_type

hash

previous_hash

26. COMPONENT ARCHITECTURE

Keep the code clean and modular.

Suggested components:

RiskGauge

VoiceWaveform

LiveAnalyzer

DetectionBreakdown

RiskBadge

ThreatAlert

CallTable

AnalysisTimeline

VerificationPanel

ContextRiskCard

AudioUploader

DemoAttackSimulation

AuditChain

LanguageSelector

PrivacyPanel

MetricCard

ThreatChart

Avoid putting the entire application in one component.

27. MOCK BACKEND

Create a clean mock API layer.

Example services:

voiceAnalysisService.ts

riskScoringService.ts

alertService.ts

verificationService.ts

auditService.ts

The mock backend should return realistic structured data.

Keep the interface compatible with a future FastAPI backend.

Create environment configuration so the backend URL can later be changed:

VITE_API_BASE_URL

Do not hardcode API URLs throughout the application.

28. REAL AUDIO FUNCTIONALITY

Use the browser's MediaRecorder API.

The microphone button should actually:

Request microphone permission

Record audio

Show recording timer

Show waveform/amplitude

Stop recording

Generate an audio blob

Play the recorded audio

Send the blob to the mock analysis service

If microphone permission is denied, show a clear error and allow demo mode.

29. ERROR HANDLING

Handle:

Microphone permission denied

Invalid audio file

Unsupported audio format

Empty recording

Analysis failure

Network failure

Authentication failure

Show clean user-friendly messages.

Never leave the UI stuck on “Loading”.

30. SECURITY UX

Make the interface feel like a real cybersecurity product.

Use:

Risk badges

Threat severity

Security alerts

Audit logs

Verification workflows

Clear warnings

Explainable AI

Do not make the interface look like a generic AI chatbot.

31. IMPORTANT PRODUCT DISCLAIMER

Add a small disclaimer in the application:

“VoxShield AI is a prototype demonstrating an architecture for AI-powered voice integrity analysis. Detection results are risk indicators and should not be treated as definitive proof of synthetic speech. Production deployment requires validated ML models, security testing, privacy review and integration with trusted verification systems.”

32. FINAL DEMO FLOW

The entire prototype must support this exact presentation flow:

Landing Page
↓
Dashboard
↓
Live Detection
↓
Start Demo
↓
Incoming CEO Call
↓
Voice Waveform
↓
AI Analysis
↓
Acoustic Analysis
↓
Spectral Analysis
↓
Prosody Analysis
↓
Speaker Consistency
↓
Context Analysis
↓
Risk Score = 92%
↓
HIGH RISK
↓
AI Voice Clone Suspected
↓
Transaction Warning
↓
Transaction Blocked
↓
Secondary Verification
↓
OTP / Callback
↓
Verification Completed
↓
Audit Event Created
↓
Dashboard Updated

Make this flow polished enough to demonstrate to SIH judges.

33. UI QUALITY REQUIREMENTS

The application must NOT look like an unfinished generated template.

Ensure:

Consistent spacing

Professional typography

Responsive layout

Proper empty states

Loading states

Error states

Hover effects

Smooth transitions

Accessible buttons

Tooltips

Clear navigation

Realistic demo data

No broken links

No placeholder “Lorem ipsum”

No fake buttons that do nothing

Every major button should perform an action.

Use realistic sample data throughout the dashboard.

34. FINAL REQUIREMENT

Build the application as a complete working prototype, not just UI mockups.

Prioritize these features above everything else:

Working microphone recording

Audio upload

Voice analysis simulation

Risk score generation

Explainable detection

Contextual risk analysis

Real-time-style detection flow

Fraud prevention recommendation

Secondary verification workflow

Threat dashboard

Risk history

Analytics

Privacy controls

API architecture

Tamper-evident audit log

SIH-ready demo mode

The application should be deployable and should work immediately after installation.

After implementation, check the entire user flow for runtime errors and fix them.

Do not stop after creating the landing page. Implement the dashboard and the complete voice-detection demo workflow.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f3cd961-f8f1-48a9-abbd-8578dee2eff5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
