// In-memory session store keyed by USSD session ID.
// Interface is intentionally Redis-compatible so the backing store can be
// swapped without changing callers: get / set / clear.

const sessions = new Map();

function getSession(sessionId) {
  return sessions.get(sessionId) || {};
}

function setSession(sessionId, data) {
  sessions.set(sessionId, { ...getSession(sessionId), ...data });
}

function clearSession(sessionId) {
  sessions.delete(sessionId);
}

module.exports = { getSession, setSession, clearSession };
