# Ready-to-Use Claude Prompts for Azure Policy Generation

Supporting material for: *Your Azure Security Posture Needs a Second Opinion*

These are the actual prompts and workflow used to generate custom Azure Policies for MySQL Flexible Server — from identifying the gap to production-ready EPAC definitions.

---

## Prompt 1: Discover What Built-in Policies Exist

Use this to understand the current coverage before generating custom policies.

```
I'm reviewing Azure Policy coverage for MySQL Flexible Server
(Microsoft.DBforMySQL/flexibleServers).

List all built-in Azure Policies that target this resource type.
For each policy, include:
- Policy name and display name
- Effect (Audit, Deny, DeployIfNotExists, etc.)
- What property/alias it checks
- Policy definition ID

Then identify the gaps — what common security, operational, and compliance
requirements are NOT covered by built-in policies?
```

---

## Prompt 2: Generate a Custom Policy Definition

This is the core prompt. Feed it the gap you want to close and the EPAC schema.

```
I need a custom Azure Policy definition for Enterprise Policy as Code (EPAC).

**Requirement:** MySQL Flexible Server should run a minimum supported version
to receive security patches and avoid end-of-support risks.

**Target resource:** Microsoft.DBforMySQL/flexibleServers
**Alias to check:** Microsoft.DBforMySQL/flexibleServers/version
**Desired behavior:** Audit (default) servers running a version below a
parameterized minimum (default: "8.0"). Allow Audit, Deny, or Disabled effects.

Generate a complete EPAC policy definition in JSONC format following this schema:
https://raw.githubusercontent.com/Azure/enterprise-azure-policy-as-code/main/Schemas/policy-definition-schema.json

Include:
- Parameterized effect and minimum version threshold
- Clear displayName and description
- Category metadata: "MySQL"
- Mode: Indexed
- policyType: Custom
```

---

## Prompt 3: Generate Policies for Server Configuration Properties

Server configurations (like slow_query_log, log_output) are child resources — they need a different approach.

```
I need a custom Azure Policy for a MySQL Flexible Server configuration parameter.

**Requirement:** MySQL Flexible Server should have slow query logging enabled
for performance monitoring.

**Important:** Server configuration parameters are child resources:
- Resource type: Microsoft.DBforMySQL/flexibleServers/configurations
- The "name" field identifies which configuration (e.g., "slow_query_log")
- The "value" field contains the setting (e.g., "ON" or "OFF")
- Alias: Microsoft.DBforMySQL/flexibleServers/configurations/value
- Mode must be "All" (not "Indexed") because child resources are non-indexed

Generate an EPAC policy definition in JSONC format that:
- Checks resource type is flexibleServers/configurations
- Matches the specific configuration name "slow_query_log"
- Flags when value is not "ON"
- Supports Audit, Deny, and Disabled effects (default: Audit)
```

---

## Prompt 4: Bundle Policies into an Initiative (Policy Set Definition)

Once you have individual policies, combine them into a manageable initiative.

```
I have the following custom and built-in Azure Policies for MySQL Flexible Server.
Bundle them into an EPAC policy set definition (initiative).

**Custom policies (use policy name as reference):**
- Deny-MySqlFlex-SSL (SSL/TLS enforcement)
- Audit-MySqlFlex-CMK (customer-managed key encryption)
- Audit-MySqlFlex-GeoBackup (geo-redundant backup)
- Audit-MySqlFlex-MinVersion (minimum version compliance)
- Deny-MySqlFlex-LogFileOutput (block FILE-based log output)
- Audit-MySqlFlex-SlowQueryLog (slow query logging)
- Audit-MySqlFlex-LogOutputTable (TABLE-based log output)

**Built-in policies (use policy definition ID):**
- c9299215-ae47-4f50-9c54-8a392f68a052 (deny public network access)
- 40e85574-ef33-4e0f-9b25-cbe2e4bfb38e (Entra-only authentication)
- 3d5ed4c2-5e50-4b53-a832-2a048c9e28ac (Advanced Threat Protection)
- 3bc8a0d5-1c4d-4a0e-a81a-7a10b9c35f7f (Defender for MySQL)
- 493c215d-2553-4976-bc81-57d2c04fc1c1 (zone resilience)

Generate an EPAC policy set definition in JSONC that:
- Groups policies by security domain (Network, Auth, Encryption, etc.)
- Uses meaningful reference IDs
- Parameterizes all effects so they can be overridden per assignment
- Sets sensible defaults (Deny for critical, Audit for advisory)
- Includes version metadata
```

---

## Prompt 5: Generate Environment-Specific Assignments

Different environments need different enforcement levels.

```
I have an EPAC policy set definition called
"Enforce-Guardrails-MySQL_20260313" with these parameterized effects:

- mySqlFlexPublicNetworkAccess (default: Deny)
- mySqlFlexEntraOnlyAuth (default: Audit)
- mySqlFlexSslEnforcement (default: Deny)
- mySqlFlexCmkEncryption (default: Audit)
- mySqlFlexAdvThreatProtection (default: DeployIfNotExists)
- mySqlFlexDefender (default: Audit)
- mySqlFlexGeoBackup (default: Audit)
- mySqlFlexZoneResilience (default: Audit)
- mySqlFlexMinVersion (default: Audit)
- mySqlFlexSlowQueryLog (default: Audit)
- mySqlFlexLogOutputTable (default: Audit)
- mySqlFlexLogFileOutput (default: Deny)

Generate two EPAC policy assignment files:

1. **Workforce** (lower environments): Use defaults. Enforcement mode:
   DoNotEnforce. Include nonComplianceMessages for each policy.

2. **Production**: Override logging and version policies to Deny
   (mySqlFlexSlowQueryLog, mySqlFlexLogOutputTable, mySqlFlexMinVersion).
   Enforcement mode: DoNotEnforce initially for rollout safety.
   Include nonComplianceMessages.

Both should scope to management group ID: "your-management-group-id"
```

---

## Prompt 6: Validate and Fix — When Things Go Wrong

This is the prompt for when a policy doesn't work as expected. This happened with the SSL and LocalAuth policies.

```
I have an Azure Policy that is not evaluating correctly.

**Policy:** Deny-MySqlFlex-SSL
**Expected behavior:** Deny MySQL Flexible Servers without SSL enforcement
**Actual behavior:** Policy never triggers — all resources show as compliant

Here is the current policy rule:
{
  "if": {
    "allOf": [
      { "field": "type", "equals": "Microsoft.DBforMySQL/flexibleServers" },
      { "field": "Microsoft.DBforMySQL/flexibleServers/requireSecureTransport", "notEquals": "ON" }
    ]
  },
  "then": { "effect": "[parameters('effect')]" }
}

Can you:
1. Check if the alias "requireSecureTransport" is valid for MySQL Flexible Server
2. Find the correct alias for SSL/TLS enforcement
3. Provide the corrected policy rule

Note: I can verify aliases with:
Get-AzPolicyAlias -NamespaceMatch "Microsoft.DBforMySQL" | Where-Object { $_.ResourceType -like "*flexibleServers" }
```

---

## Prompt 7: Cross-Reference Tool Outputs with AI

This is the "second opinion" prompt — the core of the presentation's thesis.

```
I've run three security review tools against my Azure environment.
I'm attaching the outputs below. Please:

1. Cross-reference findings across all three tools
2. Identify gaps — issues found by one tool but missed by others
3. Identify blind spots — security risks none of the tools flagged
4. For each gap or blind spot, recommend whether it can be addressed with:
   - A built-in Azure Policy (provide the policy ID)
   - A custom Azure Policy (describe what it should check)
   - A manual remediation step
5. Prioritize findings by risk (Critical, High, Medium, Low)

**Tool outputs:**

[Maester report]
(paste HTML report content or key findings)

[Az Quick Review output]
(paste Excel/JSON findings)

[Azure Review Checklist results]
(paste completed checklist items)
```

---

## Tips for Live Demo

1. **Start with Prompt 1** to show the audience what built-in coverage looks like
2. **Use Prompt 2** to live-generate a simple policy (MinVersion is a good one — clean and easy to follow)
3. **Show Prompt 6** to demonstrate the iteration — the SSL alias fix is a perfect "AI isn't magic, but it's fast" moment
4. **End with Prompt 7** to paint the bigger picture of AI as a cross-reference engine

## Key Talking Point

> "These 7 custom policies were generated in hours, not weeks. The AI got us 90% there. The remaining 10% — validating aliases, testing against real resources — is where human expertise still matters. But that's the best kind of work: reviewing and refining, not writing boilerplate from scratch."
