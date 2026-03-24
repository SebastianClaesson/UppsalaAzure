# Your Azure Security Posture Needs a Second Opinion

**Speaker:** Sebastian Claesson, TechLead @ Viedoc
**Event:** Uppsala Azure User Group Kickoff — May 7, 2026

---

## Slide 1: Title

**Your Azure Security Posture Needs a Second Opinion**

*Sebastian Claesson — TechLead @ Viedoc*

---

## Slide 2: The Problem

- Your Azure environment generates signals everywhere — but who's listening?
- No single tool sees everything
- Security posture reviews are manual, fragmented, and time-consuming
- Built-in Azure Policies cover common scenarios, but your organization has unique requirements
- The gaps between tools are where the risks hide

---

## Slide 3: The Approach — Layered Security Review

| Layer | Tool | What It Sees |
|---|---|---|
| Identity & Access | **Maester** | Entra ID config, Conditional Access, tenant security |
| Resource Configuration | **Az Quick Review (azqr)** | Are deployed resources following best practices? |
| Architecture Design | **Azure Review Checklists** | Does the overall design match Well-Architected guidance? |
| Continuous Enforcement | **Azure Policies** | Prevent drift and enforce compliance going forward |

*Each tool sees a piece. None sees the whole picture.*

---

## Slide 4: Tool #1 — Maester

- Open-source PowerShell framework built on Pester
- Tests Entra ID / Microsoft 365 tenant configuration via Microsoft Graph
- 40+ pre-built tests from the Entra ID Security Config Analyzer (EIDSCA)
- Conditional Access "What-If" simulation
- Aligned to MITRE ATT&CK for Entra ID
- Output: Interactive HTML reports with pass/fail, remediation links
- CI/CD ready (GitHub Actions, Azure DevOps)

**Demo:** Run Maester against a live tenant, walk through the report

---

## Slide 5: Tool #2 — Az Quick Review (azqr)

- CLI tool that scans Azure resources against Microsoft best practices
- Supports 70+ resource types
- Uses Azure Resource Graph + Azure Go SDK
- Aligned to Azure Proactive Resiliency Library v2
- Optionally pulls Advisor, Defender for Cloud, and Policy compliance data
- Output: Multi-sheet Excel workbooks with recommendations per resource

**Demo:** Run azqr, show the Excel output, highlight findings

---

## Slide 6: Tool #3 — Azure Review Checklists

- Version-controlled checklists for validating Azure designs
- Covers: Landing Zone, Well-Architected Framework, AKS, AVD, cost optimization, and more
- Mix of manual review items and Azure Resource Graph queries
- The "architectural design review" layer

**Demo:** Walk through a checklist, show how it catches design-level gaps

---

## Slide 7: The Gap — What None of These Tools Do

- They **detect** issues, but they don't **prevent** them
- Azure Policies are the enforcement layer
- But built-in policies don't cover everything
- Your organization has unique requirements that Microsoft hasn't built policies for
- **This is where AI comes in**

---

## Slide 8: The Second Opinion — AI Cross-Referencing

- Collect outputs from all three tools
- Feed the findings to AI (Claude)
- AI cross-references across tools to:
  - Find blind spots each tool misses individually
  - Prioritize and correlate findings
  - Generate a remediation roadmap
  - Identify where custom Azure Policies are needed

*The AI is the "second opinion" — it sees the connections humans miss*

---

## Slide 9: Going Further — AI-Generated Azure Policies

- Some governance requirements have **no built-in Azure Policy**
- Claude can generate production-ready custom policies by feeding it:
  - Azure resource provider documentation
  - ARM/Bicep schema references
  - The specific issue you want to prevent
- The result: custom policy definitions ready for Enterprise Policy as Code (EPAC)

**Demo:** Live walkthrough — from a real security gap to a deployed policy

---

## Slide 10: Real-World Example — MySQL Flexible Server Guardrails

**The problem:** Built-in Azure Policies for MySQL Flexible Server cover basics (threat protection, infrastructure encryption) but miss critical operational and security configurations.

**What was missing:**
- No policy to enforce minimum MySQL version (end-of-support risk)
- No policy to require slow query logging (performance monitoring blind spot)
- No policy to prevent FILE-based log output (PII exposure risk)
- No policy to enforce TABLE-based log output (keeps logs within DB boundary)
- No policy to enforce SSL/TLS (the built-in uses a different resource type)
- No policy for customer-managed key encryption
- No policy for geo-redundant backup

---

## Slide 11: The Journey — Iterating with AI

It's not always perfect on the first try — and that's the point:

1. **First attempt:** Generated a policy to deny local authentication
   - Used alias `flexibleServers/authConfig.passwordAuth`
   - **Problem:** That alias doesn't exist for MySQL Flexible Server
   - **Fix:** Removed the policy, used the built-in Entra-only auth policy instead

2. **Second issue:** SSL enforcement policy used wrong alias
   - Initially used `flexibleServers/requireSecureTransport`
   - **Problem:** Not a valid alias — policy would never evaluate
   - **Fix:** Corrected to `flexibleServers/sslEnforcement`

3. **Key lesson:** AI gets you 90% there fast. The last 10% requires validation against actual Azure resource provider schemas. Always test with `Get-AzPolicyAlias`.

---

## Slide 12: The Result — 12-Policy Initiative

From 2 built-in policies to a comprehensive 12-policy initiative:

| Domain | Policy | Effect |
|---|---|---|
| Network | Deny public network access | Deny |
| Authentication | Entra-only auth | Audit |
| Encryption | SSL/TLS enforcement | Deny |
| Encryption | Customer-managed keys | Audit |
| Threat Protection | Advanced Threat Protection | DeployIfNotExists |
| Threat Protection | Defender for MySQL | Audit |
| Backup | Geo-redundant backup | Audit |
| Resilience | Zone redundancy | Audit |
| Version | Minimum version (8.0) | Audit/Deny |
| Logging | Slow query logging enabled | Audit/Deny |
| Logging | Log output to TABLE | Audit/Deny |
| Logging | Block FILE-based log output | Deny |

*7 of these are custom policies that didn't exist before. Generated in hours, not weeks.*

---

## Slide 13: Environment-Specific Enforcement

Not all environments are equal:

| Policy | Workforce | Production |
|---|---|---|
| Slow query logging | Audit | **Deny** |
| Log output to TABLE | Audit | **Deny** |
| Minimum version | Audit | **Deny** |
| SSL enforcement | Deny | Deny |
| FILE-based logging | Deny | Deny |

*Start soft in lower environments, enforce hard in production.*

---

## Slide 14: The Workflow — From Signal to Policy

```
┌─────────┐   ┌──────┐   ┌───────────┐   ┌──────────┐
│ Maester  │──▶│      │   │           │   │  Custom   │
├─────────┤   │  AI  │──▶│ Roadmap + │──▶│  Azure    │
│  azqr   │──▶│Cross-│   │ Gap List  │   │ Policies  │
├─────────┤   │ Ref  │   │           │   │  (EPAC)   │
│Checklist│──▶│      │   │           │   │           │
└─────────┘   └──────┘   └───────────┘   └──────────┘
   Detect      Analyze      Prioritize      Enforce
```

---

## Slide 15: Key Takeaways

1. **No single tool gives you the full picture** — layer your security review
2. **AI is the cross-reference engine** — it connects dots across tool outputs
3. **Custom Azure Policies fill the gaps** — AI can generate them from docs and real issues
4. **Iterate and validate** — AI gets you 90% there, always verify aliases and schemas
5. **Enforce progressively** — audit first, deny in production

---

## Slide 16: Resources & Links

- **Maester:** https://maester.dev
- **Az Quick Review:** https://github.com/Azure/azqr
- **Azure Review Checklists:** https://github.com/Azure/review-checklists
- **Enterprise Policy as Code (EPAC):** https://github.com/Azure/enterprise-azure-policy-as-code
- **Uppsala Azure User Group:** https://uppsalaazure.com

---

## Slide 17: Q&A

*Your Azure environment is talking — are you listening?*
