# AGENTS.md

# Agentic AI Project Development Guide

Version: 1.0

---

# OBJECTIVE

Build a completely new, production-ready Full Stack Agentic AI application.

The project must demonstrate:

- Production-grade architecture
- Modern UI/UX
- Secure authentication
- AI agent workflows
- LLM integration
- Database design
- Clean API architecture
- Responsive design
- Professional code quality

Never create demo projects.

Never copy previous projects.

Everything must be production ready.

---

# GLOBAL DEVELOPMENT RULES

Every team member must follow these rules.

## Code Quality

- TypeScript everywhere.
- Strict typing.
- No any unless absolutely necessary.
- Modular architecture.
- Reusable components.
- Clean folder structure.
- No duplicated code.
- Proper error handling.
- Proper loading states.
- Proper empty states.
- Proper validation.

---

## UI Rules

Maximum:

- 3 primary colors
- optional neutral colors

Use consistent

- spacing
- border radius
- shadows
- typography
- button styles
- card styles

Every page must feel like the same product.

---

## Responsive Rules

Support

- Mobile
- Tablet
- Desktop

No broken layouts.

No horizontal scrolling.

---

## Content Rules

Never use

- Lorem Ipsum
- Fake products
- Placeholder descriptions
- Random testimonials
- Fake statistics

Everything should be meaningful.

---

# PROJECT STRUCTURE

Frontend

- Next.js / React
- TypeScript
- Tailwind CSS
- TanStack Query / RTK Query
- Chart Library

Backend

- Node.js
- Express
- TypeScript
- MongoDB

Authentication

- Better Auth

AI

Choose at least one

- OpenAI
- Gemini
- Claude
- Groq
- Together AI
- HuggingFace
- Ollama

---

# DESIGN AGENT

Responsible only for UI/UX.

Must create

- Design System
- Color Palette
- Typography
- Components
- Responsive Layout
- User Flow

Pages

- Home
- Explore
- Details
- Login
- Register
- Dashboard
- Add Item
- Manage Items
- AI Features
- About
- Contact

Every component must have

- Hover
- Active
- Disabled
- Loading
- Empty
- Error

Design skeleton loaders.

Design mobile first.

---

# FRONTEND AGENT

Responsible for

- UI implementation
- State management
- API integration
- Authentication flow
- Forms
- Routing

Must implement

- Protected Routes
- Public Routes
- Loading UI
- Error UI
- Empty UI
- Skeleton UI

Never hardcode data.

Everything comes from backend.

Use reusable components.

---

# BACKEND AGENT

Responsible for

- API
- Database
- Authentication
- Authorization
- AI endpoints

Must build

REST API

Proper folder structure

Controllers

Services

Routes

Middleware

Validation

Database Models

Use

- Better Auth

Protect private endpoints.

Never trust frontend validation.

Validate every request.

Return consistent API responses.

Example

Success

{
success: true,
data: ...
}

Failure

{
success: false,
message: "...",
errors: ...
}

---

# DATABASE AGENT

Responsible for

MongoDB schema

Indexes

Relationships

Validation

Collections should be properly normalized.

Avoid duplicated information.

Include

createdAt

updatedAt

---

# AI AGENT

Responsible only for AI.

Must integrate one LLM provider.

Prompt templates should be reusable.

Separate

System Prompt

Developer Prompt

User Prompt

Never hardcode prompts inside business logic.

Keep prompts organized.

Support

temperature

max tokens

streaming when possible

Maintain conversation history if chat exists.

---

# REQUIRED PAGES

Public

/

Explore

Details

About

Contact

Login

Register

Private

Dashboard

Add Item

Manage Items

AI Features

Profile

---

# HOME PAGE

Must include

Navbar

Hero

Minimum seven meaningful sections

CTA

Footer

Navbar

Sticky

Responsive

Working navigation

Hero

60–70% viewport height

Interactive

CTA

Sections examples

Features

Categories

Highlights

Statistics

Testimonials

Blogs

FAQ

Newsletter

Partners

Footer

Working links

Socials

Contact

---

# EXPLORE PAGE

Must support

Search

Filtering

Sorting

Pagination

Skeleton loading

Responsive cards

---

# DETAILS PAGE

Must include

Images

Description

Overview

Specifications

Reviews

Related items

---

# AUTHENTICATION

Required

Registration

Login

Google Login

Demo Login

Validation

Proper error handling

Protected routes

---

# ADD ITEM

Authenticated only.

Fields

Title

Short Description

Description

Price

Image

Relevant metadata

Validation required.

---

# MANAGE ITEMS

Display all user items.

Support

View

Delete

Responsive

Table or Grid

---

# AI FEATURES

Project must implement at least TWO substantial AI features.

Examples

AI Chat Assistant

AI Recommendation Engine

AI Content Generator

AI Document Intelligence

AI Data Analyzer

AI Image Understanding

AI Auto Tagging

Simple text generation alone is NOT enough.

AI should demonstrate

Reasoning

Memory

Context awareness

Decision making

Tool usage

---

# API RULES

Every endpoint should include

Validation

Authentication when required

Consistent response format

Proper HTTP status codes

Error messages

No unnecessary database queries.

---

# LOADING STATES

Every async operation needs

Loading UI

Skeleton

Progress indicator

---

# ERROR STATES

Every page must handle

404

401

403

500

Network errors

Validation errors

---

# PERFORMANCE

Optimize

Images

Fonts

API calls

Queries

Caching

Lazy loading

Code splitting

---

# ACCESSIBILITY

Semantic HTML

Keyboard navigation

Proper labels

Alt text

Contrast ratio

Focus states

---

# SECURITY

Never expose secrets.

Environment variables only.

Sanitize inputs.

Validate server-side.

Protect APIs.

Rate limit AI endpoints if possible.

---

# TESTING CHECKLIST

Before completion verify

✓ Responsive

✓ Authentication

✓ Authorization

✓ AI features

✓ CRUD works

✓ Search

✓ Filter

✓ Sort

✓ Pagination

✓ Error handling

✓ Loading states

✓ Empty states

✓ API validation

✓ Mobile support

✓ Accessibility

✓ Production build passes

---

# DEFINITION OF DONE

The project is complete only when

- No placeholder content exists.
- All pages are responsive.
- Authentication works.
- Protected routes work.
- APIs are secure.
- AI features work reliably.
- CRUD is fully functional.
- No TypeScript errors.
- No ESLint errors.
- No broken links.
- No console errors.
- Production build succeeds.
- UI is consistent across the application.
