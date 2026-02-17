# Multi-LLM Support Implementation Plan

## Overview

This document outlines the implementation plan for adding multi-LLM support to the Code Lab MCP server while maintaining backward compatibility with Claude Desktop/Code. The implementation allows users to choose between different LLM providers (Anthropic, OpenAI, Google) or use template-based generation.

## Key Features

- 🔄 **Backward Compatible**: Claude Desktop/Code continues to work unchanged
- 🎯 **Multi-Provider Support**: Anthropic, OpenAI, Google, and Template modes
- 💰 **Cost Optimization**: Choose providers based on quality/cost tradeoffs
- 🔒 **Secure**: API keys centralized in MCP server
- 📊 **Transparent**: Shows cost estimates per operation

## Architecture

### Current State
```
Claude Desktop/Code → MCP Protocol → Template Generation
Web App → MCP Server → Template Generation
```

### Target State
```
Claude Desktop/Code → MCP Protocol → Template Generation (unchanged)
Web App → MCP Server → LLM Router → [Anthropic/OpenAI/Google/Template]
```

## Implementation Progress

### ✅ Completed

1. **LLM Dependencies Installed** (Feb 14)
   ```bash
   ai@^3.2.0
   @ai-sdk/openai@^0.0.49
   @ai-sdk/anthropic@^0.0.51
   @ai-sdk/google@^0.0.35
   ```

2. **LLM Router Module Created** (Feb 14)
   - File: `code-lab-mcp-server/src/lib/llm-router.ts`
   - Lines: 254
   - Features:
     - Multi-provider routing
     - API key management
     - Template fallback
     - Error handling
     - Usage tracking

### 🚧 In Progress

#### Phase 1: MCP Server Enhancement

**1.2 Create Supporting Infrastructure**
- [ ] `src/lib/prompts.ts` - Prompt templates for each tool
- [ ] `src/lib/llm-types.ts` - TypeScript interfaces

**1.3 Update Tool Handlers (Dual-Mode)**
- [ ] Modify `brainstormLabOpportunity.ts` to accept optional provider
- [ ] Add provider routing logic
- [ ] Maintain template fallback

**1.4 Update HTTP Server**
- [ ] Modify `http-server.ts` endpoints to accept provider parameter
- [ ] Add provider validation
- [ ] Implement error handling for missing API keys

**1.5 Environment Configuration**
- [ ] Create `.env` file in MCP server
- [ ] Add `.env` to `.gitignore`
- [ ] Move API keys from web app to MCP server

#### Phase 2: Web App Updates

**2.1 Remove Demo Mode**
- [ ] Clean up demo data generation from `mcp-client.ts`
- [ ] Always connect to real MCP server
- [ ] Use template mode as fallback

**2.2 Add Provider Selection UI**
- [ ] Create provider dropdown component
- [ ] Show provider status (configured/missing key)
- [ ] Display cost estimates per provider

**2.3 Update API Integration**
- [ ] Pass provider selection to MCP server
- [ ] Handle provider-specific responses
- [ ] Add retry logic for failed requests

#### Phase 3: Testing

**3.1 Test Backward Compatibility**
- [ ] Verify Claude Desktop/Code works unchanged
- [ ] Test with MCP inspector tool
- [ ] Confirm template generation still works

**3.2 Test Multi-LLM Support**
- [ ] Test Anthropic Claude
- [ ] Test OpenAI GPT
- [ ] Test Google Gemini
- [ ] Verify template fallback

## File Changes

### New Files Created

| File | Status | Purpose |
|------|--------|---------|
| `code-lab-mcp-server/src/lib/llm-router.ts` | ✅ Complete | Multi-provider LLM routing |
| `code-lab-mcp-server/src/lib/prompts.ts` | 🔴 Pending | Prompt templates |
| `code-lab-mcp-server/src/lib/llm-types.ts` | 🔴 Pending | TypeScript interfaces |
| `code-lab-mcp-server/.env` | 🔴 Pending | API keys configuration |

### Files to Modify

| File | Status | Changes Needed |
|------|--------|----------------|
| `code-lab-mcp-server/src/tools/brainstormLabOpportunity.ts` | 🔴 Pending | Add provider parameter support |
| `code-lab-mcp-server/src/http-server.ts` | 🔴 Pending | Accept and pass provider parameter |
| `code-lab-mcp-server/package.json` | ✅ Complete | Dependencies added |
| `code-labs-generator-web/app/api/mcp/brainstorm/route.ts` | 🔴 Pending | Pass provider to MCP server |
| `code-labs-generator-web/components/workflows/BrainstormWorkflow.tsx` | 🔴 Pending | Add provider selection UI |
| `code-labs-generator-web/lib/mcp-client.ts` | 🔴 Pending | Remove demo mode |

## Code Examples

### Tool Handler Pattern (Dual-Mode)

```typescript
// src/tools/brainstormLabOpportunity.ts
export async function handleBrainstormLabOpportunity(args: any) {
  const { provider, ...brainstormArgs } = args;

  // Claude Desktop/Code mode (no provider)
  if (!provider || provider === 'template') {
    return originalTemplateImplementation(brainstormArgs);
  }

  // Web App mode (with LLM provider)
  const llmRouter = new LLMRouter();
  return await llmRouter.generateLabOpportunity(brainstormArgs, provider);
}
```

### HTTP Endpoint Update

```typescript
// src/http-server.ts
app.post('/api/brainstorm', async (req, res) => {
  const { provider = 'template', ...args } = req.body;

  const result = await handleBrainstormLabOpportunity({
    ...args,
    provider // Pass through the provider
  });

  res.json({
    success: true,
    content: result.content,
    provider,
    cost: result.cost || 0
  });
});
```

### Web App Provider Selection

```typescript
// components/workflows/BrainstormWorkflow.tsx
const providers = [
  { value: 'anthropic', label: 'Claude (Best Quality)', cost: '$$$' },
  { value: 'openai', label: 'GPT-4 (Fast)', cost: '$$' },
  { value: 'google', label: 'Gemini (Economical)', cost: '$' },
  { value: 'template', label: 'Template (Free)', cost: 'Free' }
];
```

## Environment Variables

### MCP Server (.env)
```bash
# LLM API Keys
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Server Configuration
PORT=3002
NODE_ENV=development
```

### Web App (.env.local)
```bash
# MCP Server Connection
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:3002

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Remove these (moved to MCP server)
# ANTHROPIC_API_KEY=...
# OPENAI_API_KEY=...
# GOOGLE_GENERATIVE_AI_API_KEY=...
```

## Testing Strategy

### 1. Backward Compatibility Test

```bash
# Start MCP server in standard mode
cd code-lab-mcp-server
npm run dev

# In Claude Desktop, use tools normally
# Should use template generation (unchanged behavior)
```

### 2. Multi-LLM Test

```bash
# Start MCP server in HTTP mode
cd code-lab-mcp-server
npm run dev:http

# Start web app
cd code-labs-generator-web
npm run dev

# Test each provider through web UI
# Should see different quality/speed for each
```

### 3. Fallback Test

```bash
# Remove API keys from .env
# Select non-template provider
# Should gracefully fall back to template mode
```

## Success Criteria

- [ ] **Backward Compatibility**: Claude Desktop/Code works exactly as before
- [ ] **Provider Selection**: Can choose between 4 providers in web app
- [ ] **Cost Transparency**: Shows estimated cost before generation
- [ ] **Error Handling**: Graceful fallback when API keys missing
- [ ] **Performance**: LLM calls complete within 10 seconds
- [ ] **Documentation**: All changes documented

## Rollback Plan

If issues arise:

1. **Quick Rollback**: Set all providers to 'template' in web app
2. **Full Rollback**: Revert git commits and reinstall dependencies
3. **Partial Rollback**: Disable LLM features via environment variable

## Next Steps After Implementation

1. **Add Caching**: Cache LLM responses to reduce costs
2. **Add Streaming**: Stream responses for better UX
3. **Add Analytics**: Track which providers are most used
4. **Add Fine-tuning**: Custom models for better Code Lab generation
5. **Add Rate Limiting**: Prevent abuse and control costs

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: MCP Server | 2-3 hours | 30% Complete |
| Phase 2: Web App | 1-2 hours | 0% Complete |
| Phase 3: Testing | 1 hour | 0% Complete |
| **Total** | **4-6 hours** | **10% Complete** |

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking Claude Desktop | High | Optional provider parameter |
| API Key Exposure | High | Server-side only, .env files |
| Cost Overrun | Medium | Cost estimates, rate limiting |
| Provider Outage | Medium | Multiple providers, template fallback |
| Performance Issues | Low | Timeout controls, streaming |

## Commands Reference

### Development
```bash
# MCP Server
cd code-lab-mcp-server
npm run dev        # Standard MCP mode
npm run dev:http   # HTTP mode with LLM

# Web App
cd code-labs-generator-web
npm run dev        # Development server
```

### Testing
```bash
# Test MCP tools
npx @modelcontextprotocol/inspector

# Test HTTP endpoints
curl -X POST http://localhost:3002/api/brainstorm \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","learningObjectives":["Test"],"provider":"template"}'
```

### Deployment
```bash
# Build MCP server
cd code-lab-mcp-server
npm run build

# Deploy web app
cd code-labs-generator-web
vercel --prod
```

## Support & Troubleshooting

### Common Issues

1. **"API key not found"**
   - Check .env file in MCP server
   - Restart server after adding keys

2. **"Provider not available"**
   - Verify API key is valid
   - Check billing/credits for provider

3. **"Template mode only"**
   - MCP server may be in standard mode
   - Use `npm run dev:http` for HTTP mode

4. **"Connection refused"**
   - Ensure MCP server is running on port 3002
   - Check firewall settings

## Contributors

- Implementation Plan: Claude Code + User
- Date: February 14, 2026
- Version: 1.0.0

---

*This document is part of the Code Lab Generator Web MVP project*