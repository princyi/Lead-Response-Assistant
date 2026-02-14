# Customer Enquiry Assistant - Architecture & Loom Presentation Script

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER ENQUIRY ASSISTANT                           │
│                          (Production System)                                │
└─────────────────────────────────────────────────────────────────────────────┘

                                    INPUT
                                      ▼
                        ┌──────────────────────────┐
                        │  Customer Enquiry Text   │
                        │  e.g., "Damp patches on │
                        │  my wall. What do I do?" │
                        └──────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌──────────────────────┐          ┌────────────────────┐
        │   Context Analysis   │          │  Intent Recognition│
        │  • Information gaps  │          │  • What's being    │
        │  • Domain expertise  │          │    asked?          │
        │  • Risk level        │          │  • Urgency level   │
        └──────────────────────┘          └────────────────────┘
                    │                                   │
                    └─────────────────┬─────────────────┘
                                      │
                                      ▼
        ┌────────────────────────────────────────────────────────┐
        │     CLAUDE SONNET 4 API                                │
        │  ┌──────────────────────────────────────────────────┐  │
        │  │ System Prompt with Accuracy Safeguards:          │  │
        │  │                                                  │  │
        │  │ ❌ NEVER make unverified claims                 │  │
        │  │ ❌ If unsure, acknowledge uncertainty          │  │
        │  │ ✅ Ask 2-3 clarifying questions               │  │
        │  │ ✅ Provide safe, practical next steps          │  │
        │  │ ✅ Include relevant warnings/disclaimers       │  │
        │  │                                                  │  │
        │  │ Output Format: Structured JSON                  │  │
        │  └──────────────────────────────────────────────────┘  │
        └────────────────────────────────────────────────────────┘
                                      │
                                      ▼
        ┌────────────────────────────────────────────────────────┐
        │              STRUCTURED JSON RESPONSE                  │
        │                                                        │
        │  {                                                     │
        │    "acknowledgment": "Empathetic opening...",         │
        │    "analysis": {                                       │
        │      "intent": "What customer is asking",             │
        │      "severity": "low/medium/high",                   │
        │      "confidence": 0.72                               │
        │    },                                                  │
        │    "clarifyingQuestions": [Q1, Q2, Q3],             │
        │    "nextSteps": [Step1, Step2, Step3],              │
        │    "warnings": [Disclaimer1, Disclaimer2],           │
        │    "tone": "professional and empathetic"             │
        │  }                                                     │
        └────────────────────────────────────────────────────────┘
                                      │
                                      ▼
        ┌────────────────────────────────────────────────────────┐
        │           ACCURACY VALIDATION LAYER                    │
        │                                                        │
        │  ✓ Parse & Validate JSON structure                    │
        │  ✓ Check confidence scoring                           │
        │  ✓ Highlight warnings section                         │
        │  ✓ Identify uncertainty flags                         │
        │  ✓ Flag low-confidence responses for review          │
        └────────────────────────────────────────────────────────┘
                                      │
                                      ▼
        ┌────────────────────────────────────────────────────────┐
        │         HUMAN REVIEW INTERFACE                         │
        │                                                        │
        │  ┌──────────────────────────────────────────────────┐  │
        │  │ Response Quality Check                           │  │
        │  │                                                  │  │
        │  │ [ ] Acknowledgment addresses concern?           │  │
        │  │ [ ] Questions are relevant & non-obvious?       │  │
        │  │ [ ] Steps are safe & practical?                 │  │
        │  │ [ ] Warnings included where needed?             │  │
        │  │ [ ] Confidence score justified?                 │  │
        │  │ [ ] No false claims or hallucinations?          │  │
        │  │ [ ] Tone appropriate for brand?                 │  │
        │  │ [ ] Response is actionable?                     │  │
        │  │                                                  │  │
        │  │ Confidence: 72% 🟡 (Needs Review)              │  │
        │  │                                                  │  │
        │  │ [← Edit]  [✓ Approve]  [↻ Regenerate]          │  │
        │  └──────────────────────────────────────────────────┘  │
        └────────────────────────────────────────────────────────┘
                    │                          │
                    │ APPROVED                 │ EDITED/REGENERATED
                    ▼                          ▼
        ┌──────────────────┐        ┌─────────────────────┐
        │  SEND TO         │        │ RETURN TO API       │
        │  CUSTOMER        │        │ WITH FEEDBACK       │
        └──────────────────┘        └─────────────────────┘
                    │                          │
                    └──────────────┬───────────┘
                                   │
                                   ▼
                            ┌─────────────┐
                            │   RESULT    │
                            │ Accurate,   │
                            │ Helpful     │
                            │ Response    │
                            └─────────────┘
```

---

## Data Flow: Step-by-Step

### Stage 1: INPUT (Customer Enquiry)
```
Raw Input:
"Hi, I am getting damp patches on my bedroom wall after rains. What should I do?"

Analysis:
✓ Intent: Technical troubleshooting / problem diagnosis
✓ Emotion: Concerned but calm
✓ Context: Specific (damp patches, after rain)
✓ Missing: Duration, location, appearance, smell
```

### Stage 2: PROCESSING (AI Analysis)
```
System evaluates:
1. Intent clarity: HIGH (clearly asking for help troubleshooting)
2. Domain expertise needed: MEDIUM (requires building science knowledge)
3. Risk level: MEDIUM (could be serious if ignored)
4. Confidence: ~0.72 (specific symptom but multiple possible causes)
5. Response strategy: Acknowledge + Ask clarifying Q's + Recommend pro inspection
```

### Stage 3: GENERATION (Structured Response)
```
acknowledgment:
"I understand this is concerning, especially in a bedroom where you want 
comfort and safety. Damp patches after rain can have several causes, so let's 
gather more information before recommending action."

clarifyingQuestions: [
  "How long have you noticed the damp patches, and are they growing or stable?",
  "Are they on the wall itself, in corners, along ceiling, or at the base?",
  "Is there any visible mold, musty smell, or soft plaster?"
]

nextSteps: [
  "Monitor the patch over 48 hours with good ventilation",
  "Look for external issues (gutters, roof leaks, grading)",
  "If persisting, consult a surveyor or damp specialist",
  "Consider moisture control (dehumidifier, ventilation)"
]

warnings: [
  "Do NOT assume it's only condensation - professional assessment needed",
  "Structural damage may require urgent intervention",
  "Black/dark mold requires professional remediation (health risk)"
]

confidence: 0.72 (moderate - requires expertise but issue is clear)
```

### Stage 4: VALIDATION (Human Review)
```
Reviewer checks:
✓ Does it address the actual concern? YES
✓ Are questions helpful/non-obvious? YES
✓ Are next steps safe? YES
✓ Warnings appropriate? YES
✓ Confidence justified? YES

Review Result: APPROVED ✓

Optional: Edit tone, add company-specific resources, adjust questions
```

### Stage 5: DELIVERY (To Customer)
```
The response is now ready to send, with confidence that:
- It won't make false claims
- It gathers necessary context
- It recommends safe next steps
- It includes appropriate disclaimers
- It acknowledges the customer's concern
```

---

## Loom Presentation Script (3-5 minutes)

### Slide 1: Introduction (0:00-0:30)

**What to show on screen:**
- Title slide: "Customer Enquiry Assistant"
- Subtitle: "AI-powered response generation with accuracy safeguards"

**What to say:**
"Hi, I'm going to walk you through a production system for generating customer 
service responses using AI. This system is designed to help support teams respond 
faster, while maintaining accuracy and avoiding the hallucinations that often 
plague AI customer service tools.

The key insight here is that **speed without accuracy is worthless**. So we've 
built multiple layers of protection to ensure every response is factually sound, 
helpful, and appropriate for your customers."

---

### Slide 2: The Problem (0:30-1:00)

**What to show on screen:**
- Example of AI hallucination in customer service
- "System: 'We offer 30-day returns' (but we actually don't)"
- Or: "Your internet is definitely broken because..."

**What to say:**
"The problem with naive AI in customer service is hallucination. The model makes 
up facts, overconfidently recommends solutions, or makes promises the company 
can't keep.

For example, a model might tell a customer they can return something within 30 
days even if your policy is 14 days. Or it might confidently diagnose a technical 
problem when it should actually be asking clarifying questions first.

Our system solves this through a multi-layered approach."

---

### Slide 3: How It Works - The Prompt (1:00-1:45)

**What to show on screen:**
- Screenshot of the system prompt
- Highlight key constraints:
  - "NEVER make claims you cannot verify"
  - "If unsure, acknowledge uncertainty"
  - "Ask 2-3 clarifying questions"
  - "Provide safe, practical next steps"

**What to say:**
"We start with a carefully engineered prompt that explicitly forbids 
hallucination. The model is told:

1. NEVER make unverified claims - if you're not sure, say so
2. When you don't have enough information, ask clarifying questions instead of guessing
3. Provide practical, safe next steps - not false promises
4. Always include warnings or disclaimers where appropriate

This foundation is critical. We're not relying on the model to be naturally 
accurate - we're explicitly instructing it to prioritize accuracy and humility."

---

### Slide 4: Structured Output (1:45-2:30)

**What to show on screen:**
- Display the JSON output structure
- Show each section highlighted:
  - acknowledgment (blue)
  - analysis with confidence score (green)
  - clarifyingQuestions (cyan)
  - nextSteps (yellow)
  - warnings (red)

**What to say:**
"The second key mechanism is **structured output**. Instead of letting the model 
write free-form text, we force it to output JSON with required sections.

This accomplishes several things:
- **Acknowledgment** ensures we're addressing the customer's actual concern emotionally
- **Analysis** includes intent, severity, and most importantly, a confidence score
- **Clarifying Questions** prevents assumptions - we ask what we don't know
- **Next Steps** are practical and safe
- **Warnings** capture any disclaimers or limitations

The confidence score is crucial. If it's low, we know to invest more time in 
human review. If it's high, we can trust the response more."

---

### Slide 5: Live Demo (2:30-3:45)

**What to show on screen:**
- Open the interactive component
- Paste in the example enquiry: "Hi, I am getting damp patches on my bedroom wall..."
- Click "Generate Response"
- Show the loading state
- Display the generated response

**What to say:**
"Let me show you this in action. Here's a real customer enquiry about damp 
patches on their bedroom wall.

[Click submit]

The system analyzes it and generates a structured response. Notice:

1. **Acknowledgment** - empathetic, takes the concern seriously
2. **Analysis** - correctly identifies this is a troubleshooting request with 
   moderate severity, and assigns a confidence of 72%
3. **Questions** - it doesn't guess what's wrong, it asks three important 
   diagnostic questions
4. **Next Steps** - safe, practical actions they can take
5. **Warnings** - importantly, it warns them NOT to assume it's just condensation, 
   and mentions mold concerns

The confidence of 72% is appropriate because this is a domain-specific issue that 
really benefits from professional assessment. That confidence score helps the 
support agent know: 'Okay, I should probably review this carefully before sending.'"

---

### Slide 6: Accuracy & Reliability (3:45-4:30)

**What to show on screen:**
- Visual showing the 7-layer accuracy stack:
  1. Explicit safeguards in prompt
  2. Structured JSON output
  3. Confidence scoring
  4. Clarifying questions
  5. Mandatory disclaimers
  6. Domain awareness
  7. Human review layer

**What to say:**
"Here's how we achieve accuracy at every level:

**Layer 1: Explicit Safeguards** - The prompt tells the model to never guess

**Layer 2: Structured Output** - JSON format prevents rambling or overconfidence

**Layer 3: Confidence Scoring** - The model assesses its own reliability

**Layer 4: Clarifying Questions** - Forces information-gathering over assumptions

**Layer 5: Mandatory Disclaimers** - Warnings section catches edge cases

**Layer 6: Domain Awareness** - System acknowledges when expertise is needed

**Layer 7: Human Review** - Nothing goes out without human approval

This layered approach means even if one mechanism fails, the others catch problems."

---

### Slide 7: Known Limitations (4:30-4:50)

**What to show on screen:**
- List of known limitations:
  - Product-specific details (may hallucinate features)
  - Current data (knowledge cutoff)
  - Company policies (needs reference material)
  - Customer history (single-turn)
  - Safety-critical domains (medical, legal)

**What to say:**
"We're transparent about what this system can't do:

- It can't reliably know product-specific details unless we provide them
- Its knowledge has a cutoff date - it doesn't know what's happening right now
- It may not know your exact company policies
- It doesn't have access to customer history
- For safety-critical domains like medical or legal issues, it should escalate 

The key mitigation: **human review**. Everything we show is reviewed by a human 
before sending. That's our safety net."

---

### Slide 8: Key Takeaways & Next Steps (4:50-5:00)

**What to show on screen:**
- Three benefits:
  1. ✅ Accurate (multiple safeguards against hallucination)
  2. ✅ Empathetic (starts with acknowledgment)
  3. ✅ Smart (asks good clarifying questions)

- Three implementation steps:
  1. Review with support team
  2. Test with real enquiries
  3. Adjust confidence thresholds based on your domain

**What to say:**
"To wrap up, this system delivers three things:

1. **Accuracy** - Multiple layers ensure we don't make false claims
2. **Empathy** - Every response starts by acknowledging the customer
3. **Intelligence** - It asks the right clarifying questions

If you want to implement this, the next steps are simple:
- Review the documentation
- Test with real customer enquiries from your support queue
- Adjust the confidence scoring thresholds for your specific domain
- Train your team on how to interpret the confidence scores and warnings

All the code is provided - it's a React component that integrates with the 
Anthropic API. Full documentation is included.

Thanks for watching!"

---

## Files Provided

1. **enquiry_assistant.jsx** - Interactive React component (14 KB)
   - Full UI with real-time API integration
   - Confidence score visualization
   - Example enquiries built-in
   - Production-ready styling

2. **SYSTEM_DOCUMENTATION.md** - Technical deep dive (9.5 KB)
   - Architecture explanation
   - Design decisions and rationale
   - Future improvements
   - QA checklist

3. **README.md** - Setup and usage guide (11 KB)
   - Quick start instructions
   - Example workflows
   - Integration examples
   - Best practices
   - Troubleshooting

4. **test_suite.js** - Testing and examples (20 KB)
   - 10 test cases with expected behavior
   - Analysis framework explanation
   - Accuracy mechanisms breakdown
   - Quality checklist
   - Metrics to track

---

## Deployment Checklist

- [ ] Review all documentation
- [ ] Run test_suite.js to understand system behavior
- [ ] Deploy enquiry_assistant.jsx to your environment
- [ ] Test with 10-20 real customer enquiries
- [ ] Train support team on confidence scores and warnings
- [ ] Set up human review protocol (100% initially)
- [ ] Monitor approval rate and adjust thresholds
- [ ] Integrate with ticketing system (Zendesk, Jira, etc.)
- [ ] Create feedback loop for continuous improvement
- [ ] Track metrics (approval rate, avg review time, satisfaction)

---

## Expected Outcomes

**Week 1:** 100% of responses reviewed, understanding system behavior
**Week 2:** 95% approval rate, team comfortable with confidence scores
**Week 3:** 90% approval rate, starting to trust high-confidence responses
**Month 2:** 85% approval rate, system refining based on feedback
**Month 3:** Integrated with ticketing, 50% reduction in draft time

---

## Questions & Support

Review the comprehensive documentation for:
- Technical architecture details
- Integration examples for different platforms
- Troubleshooting common issues
- Metrics to track success
- Future improvements roadmap

The system is designed for continuous improvement. Use your team's feedback to 
refine the system prompt, add company-specific context, and adjust thresholds 
over time.
