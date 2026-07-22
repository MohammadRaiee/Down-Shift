---
name: ai-prompt-maker
description: 'Guides the creation and refinement of high-quality AI prompts. Use when you need to write system prompts, user constraints, or structured few-shot instructions.'
argument-hint: 'Describe the goal or task you want the AI prompt to solve'
user-invocable: true
---

# AI Prompt Maker

## When to Use
- Designing a system prompt or instructions for an AI agent.
- Structuring a complex query requiring specific constraints, tone, or formatting.
- Creating few-shot examples or testing out edge cases for AI models.
- Refining ambiguous instructions into clear standard operating procedures for LLMs.

## Procedure

Follow these steps to construct an effective AI prompt:

### 1. Goal & Context Setting
- **Identify the Persona/Role**: Who is the AI acting as? (e.g., "Expert TypeScript Developer").
- **Define the Core Task**: What is the primary objective of this prompt?
- **Establish Context**: What essential background knowledge or implicit rules does the AI need to know?

### 2. Format & Constraints
- **Determine the Output Format**: Does it need to be JSON, Markdown, a code snippet, or a bulleted list? Specify exact schemas if needed.
- **Set Explicit Constraints**: What should the AI *not* do? (e.g., "Do not include pleasantries", "Never output full files, only diffs").

### 3. Draft using Structure (XML/Markdown)
Organize the prompt into clear sections (recommended to use XML tags or Markdown headers grouping):
- `<role>`
- `<context>`
- `<instructions>` (Numbered steps work best)
- `<constraints>`
- `<examples>` (Provide a good and/or bad example if the task is complex)
- `<output_format>`

### 4. Review Checklist
- [ ] Is the task specific and unambiguous?
- [ ] Are the constraints clearly stated?
- [ ] Has unnecessary filler text been removed?
- [ ] If applicable, is there an example provided?

### 5. Finalize
Present the drafted prompt to the user inside a markdown code block so they can easily copy it, or write it directly into the target `.prompt.md` / `.instructions.md` file if requested.