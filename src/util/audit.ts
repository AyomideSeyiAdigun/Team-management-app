

export function logAudit({
  actor,
  action,
  target,
  orgId,
}: {
  actor: string;
  action: string;
  target: string;
  orgId: string;
}) {
  const logsKey = `audit_${orgId}`;
  const existing = JSON.parse(localStorage.getItem(logsKey) || "[]");

  const newLog = {
    actor,
    action,
    target,
    timestamp: new Date().toISOString(),
    orgId,
  };

  localStorage.setItem(logsKey, JSON.stringify([newLog, ...existing]));
}
