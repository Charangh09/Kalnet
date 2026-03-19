## Short Note (Challenges + Prompting Approach)

The main challenge was making LLM output consistently parseable while still useful for end users. Models can return markdown or extra commentary, which breaks API reliability. I handled this by designing a strict, schema-first prompt and adding defensive parsing that extracts and validates JSON safely. Another challenge was balancing “simple MVP” scope with product clarity. I kept the UI minimal but structured each output into cards so users can quickly understand goal, gaps, and next actions.

For prompting, I used role + task + rigid output contract. The prompt defines the assistant role, provides exact JSON keys, and sets practical rules (5–8 actions, timeline handling, and boolean missing flags). I avoided over-complex chain prompts to keep latency and failure points low. Then I moved scoring logic to deterministic backend code (+25 per criterion) so scoring remains transparent and auditable, independent of model variability.
