# Specification

## Summary
**Goal:** Create a unified admin dashboard with navigation that consolidates all existing admin features and implements backend admin list authentication.

**Planned changes:**
- Create backend admin list system in main.mo to store and manage admin principals with Internet Identity authentication
- Create unified admin dashboard page component with organized navigation menu linking to all existing admin features (Order Management, Content Management, Package Management, Homepage Content, Category Management, Sitewide Content)
- Update App.tsx routing to add /admin route displaying the new dashboard
- Update AdminGuard component to verify users against backend admin list before granting access
- Add Admin Dashboard link to header navigation for authenticated admin users

**User-visible outcome:** Admins can authenticate with Internet Identity, access a centralized dashboard at /admin with organized navigation to all admin tools, and quickly navigate between admin features. Non-admin users are denied access to admin routes.
