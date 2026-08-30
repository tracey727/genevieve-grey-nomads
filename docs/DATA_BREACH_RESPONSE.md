# Data Breach Response Plan — GENEVIEVE — The Budget Travels

## Purpose
Use this plan when personal information may have been lost, accessed without authority, disclosed to the wrong person, or exposed through a compromised account, secret, database, deployment or third-party provider.

## Immediate actions
1. Contain the incident without destroying evidence.
2. Revoke or rotate exposed Stripe, Cloudflare, Neon, GitHub or other credentials.
3. Restrict affected access and preserve relevant logs, timestamps and deployment/database records.
4. Identify what information was involved, whose information it was, and whether it was encrypted or otherwise protected.
5. Record the incident owner, decisions and actions.

## Assessment
- Determine whether the Privacy Act / Notifiable Data Breaches scheme applies to the operator at the time of the incident.
- If the scheme applies, assess suspected eligible breaches promptly and within the statutory assessment period.
- Consider likely serious harm, including financial loss, identity misuse, physical safety risk, psychological harm or reputational harm.
- Consider whether remedial action can remove the likely risk of serious harm.

## Notification
If notification is legally required, prepare the required statement and notify affected individuals and the OAIC as required. Provide practical steps affected people can take to reduce harm. Do not make misleading assurances about the scope of the incident before facts are established.

## Provider coordination
Contact affected processors such as Stripe, Cloudflare or Neon promptly and preserve their incident references. Confirm which party holds relevant logs and what remediation has occurred.

## Recovery
- Patch the root cause.
- Validate production configuration and secrets.
- Check for unauthorised subscriptions, refunds, data exports, database changes or deployments.
- Restore service safely.
- Record lessons and prevention actions.

## Post-incident review
Update security controls, this response plan, Privacy Policy or user notices if the incident reveals a material gap. Keep an internal incident record even when notification is not required.

## Contact
Privacy and incident contact: tracey@genevieveapp.com.au
