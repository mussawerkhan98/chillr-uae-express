## Admin Dashboard — Scope

Build a full CMS admin at `/admin` where you (single owner) can log in and manage all editable site content. Public site pages will read from the database instead of `site.ts`.

## What becomes editable

1. **Blog posts** — rich text (Tiptap), cover image, slug, excerpt, published toggle, SEO meta title/description. Public routes `/blog` and `/blog/$slug`.
2. **Site photos / gallery** — upload/replace hero image, cold-chain interior, fleet lineup, and any other keyed images used on the marketing pages.
3. **Fleet vehicles** — name, category, capacity, temp range, volume, ideal use, photo. Add / edit / delete / reorder.
4. **Services** — title, description, icon, order. Add / edit / delete / reorder.
5. **FAQs** — question, answer, order. Add / edit / delete / reorder.
6. **Site settings** — per-page meta title & description (home, about, fleet, services, industries, locations, faq, contact, blog), plus site-wide tagline, phone, WhatsApp, email, address.

## Auth model

- Email/password + Google sign-in (Lovable Cloud managed).
- Single owner: the **first** user to sign up automatically gets the `admin` role via a database trigger. Every subsequent signup gets no role and is blocked from `/admin`.
- Sign-up form is intentionally hidden after the first admin exists (server check).

## Technical layout

**Database migration**
- Enum `app_role` (`admin`) + `user_roles` table + `has_role()` security-definer function.
- `blog_posts`, `site_images`, `fleet_vehicles`, `services`, `faqs`, `site_settings` tables.
- RLS: public `SELECT` on everything except `user_roles` and unpublished blog posts. Full CRUD only for admins (via `has_role`).
- Trigger `handle_first_admin()` on `auth.users` insert → first user gets `admin` role.
- Seed migration inserts current `site.ts` data.
- Public storage bucket `media` for uploads.

**Route structure**
```
src/routes/
  auth.tsx                    (login/signup, Google + email)
  blog.tsx, blog.$slug.tsx    (public blog)
  _authenticated/
    route.tsx                 (managed gate)
    admin/
      route.tsx               (admin-role gate + sidebar layout)
      index.tsx               (dashboard overview)
      blog.tsx, blog.new.tsx, blog.$id.tsx
      images.tsx
      fleet.tsx
      services.tsx
      faqs.tsx
      settings.tsx
```

**Server functions** (`src/lib/admin.functions.ts`, `src/lib/content.functions.ts`) for all CRUD, with `requireSupabaseAuth` + role check. Public reads via publishable-key server client so SSR works.

**Rich text editor**: Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-image`, `@tiptap/extension-link`) — bold, italic, headings, lists, links, inline images uploaded to storage.

**Public pages** get refactored to read from DB via loaders + TanStack Query (`site.ts` becomes fallback constants only).

## Delivery approach

This is a large build. I'll ship it in two turns to keep each change reviewable:

- **Turn 1 (this)**: DB schema + migrations + seed, auth (`/auth`), first-admin trigger, admin shell with sidebar and role gate, **Blog CRUD** end-to-end (list, create, edit with Tiptap, delete, cover image upload) + public `/blog` + `/blog/$slug`.
- **Turn 2**: Site photos / fleet / services / FAQs / settings admin screens, and wiring the existing marketing pages to read from the DB.

If you approve, I'll start Turn 1 immediately.