# Project Progress

## Database Setup ✅

- Created tables: orders, drivers, assignments, events, call_transcripts
- Added indexes on important columns for fast queries
- Removed foreign keys to auth.users to avoid permission errors
- Created updated_at trigger function and attached triggers

## Monorepo Migration ✅

- Converted to Turborepo with npm workspaces
- Created `apps/web` (Next.js main app)
- Created `apps/driver` (React Native driver app - scaffold)
- Created `packages/ui` (shadcn components)
- Created `packages/shared` (Supabase client, auth context)
- Created `packages/langgraph` (AI agent logic)

## Order Entry System ✅

- Database schema with production indexes (100k+ orders/day ready)
- API endpoints: POST, GET, PATCH for orders
- Order entry form with all sections (customer, locations, items, notes)
- Orders list page with status badges

## Code Consolidation ✅

- Removed duplicate supabase folders from packages/ui and apps/web
- Centralized Supabase client in `@repo/shared`
  - `createBrowserClient()` for client components
  - `createServerClient()` for API routes
- Removed duplicate langgraph, auth-context, schemas from packages/ui
- Updated all imports to use shared package

## CSS Utilities ✅

- Created reusable utility classes in globals.css
- Status badges with theme-aware colors
- Page layouts, form patterns, loading/empty states

## Call Ingestion Pipeline ✅

- Added `call_sid`, `recording_sid` columns to `call_transcripts` table
- Created `order_drafts` table for AI-extracted order data
- Twilio webhook endpoints:
  - `POST /api/twilio/voice` - TwiML response with recording + transcription
  - `POST /api/twilio/recording` - Inserts call record into database
  - `POST /api/twilio/transcription` - Updates transcript when ready
  - `POST /api/twilio/whatsapp` - Handles message, runs AI immediately, replies confirmation
- LangGraph call intake agent (`packages/langgraph`):
  - `state.ts` - CallIntakeState definition
  - `nodes/extract-order.ts` - Gemini-powered order extraction
  - `graph.ts` - Simple linear workflow
- `POST /api/process-calls` - Processes unprocessed transcripts → order_drafts
- Updated middleware to allow public API access for webhooks

## Authentication & Security ✅

- Fixed Magic Link redirect to support `ngrok` via `NEXT_PUBLIC_API_URL`
- Explicitly redirects to `/dashboard` after login using `?next=` param
- Verified `.env` security (keys are safe, `.next` artifacts removed from git)
- Configured `turbo.json` to whitelist env vars for workspace compatibility

## Documentation ✅

- Created `system_architecture.md` (High-level design, database schema, diagrams)
- Created `NGROK_SETUP.md` (Guide for webhooks & local auth testing)

## Order Drafts Review UI ✅

- Created `/drafts` list page fetching from `order_drafts`
- Implemented `DraftCard` with confidence scores and status indicators
- Built `ReviewDialog` with form validation (Schema: `@repo/shared`)
- Added Server Actions: `approveDraft` (promotes to confirmed order) & `rejectDraft` (archives)
- **Responsive Design**:
  - Mobile Sidebar with Sheet/Drawer pattern
  - Timeline visualization for pickup/dropoff
  - Using `Drawer` for Review on mobile, `Dialog` on desktop

## WhatsApp Order Placement ✅ (Tested: Jan 26, 2026)

- End-to-end flow verified:
  1. User sends order message via WhatsApp → Twilio webhook
  2. AI extracts order details (Gemini) → Creates draft with confidence score
  3. Admin reviews draft in Dashboard → Approves/Rejects
  4. Approved orders appear in Orders page immediately
- **Bug Fixes Applied**:
  - Fixed `order_drafts.status` constraint to allow `approved` status
  - Created missing `order_items` table for storing order line items
  - Improved JSON parsing in AI extraction (retry logic, fallback handling)
  - Added React Query cache invalidation for instant UI updates

## Next Steps

- [ ] Driver app development
- [ ] Route optimization integration
