# Architecture Decisions

## Direct API Approach (not LangChain)
- Simpler debugging
- More control
- Provider-agnostic design

## 4-Stage Pipeline
1. Summary: Core concept + learning objectives
2. Program: Complete Python implementation
3. Breakdown: Educational steps with teaching moments
4. Encoding: Final JSON with visibility markers

## Key Libraries
- Pydantic for validation
- OpenAI/Anthropic/Together APIs
- Jinja2 for prompt templates
- Tenacity for retries
