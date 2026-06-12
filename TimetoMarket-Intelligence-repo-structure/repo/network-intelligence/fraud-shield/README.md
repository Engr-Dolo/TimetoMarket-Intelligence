# Agent Fraud Shield

Anomaly-detection layer monitoring aggregate Mobile Money agent-level transaction patterns to flag float manipulation, skimming, and irregular sequences.

## Planned approach

- Input: anonymized, aggregated agent transaction data from the shared pipeline
- Model: anomaly detection (e.g. statistical baselines + ML classifier) on transaction pattern features
- Output: flagged agents/transactions for investigation, with confidence scores
