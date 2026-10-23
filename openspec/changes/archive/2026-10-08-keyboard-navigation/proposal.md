# Complete keyboard navigation

## Why
The mobile menu remains open after Escape and its links occur before the toggle in DOM order, so keyboard activation followed by Tab skips them.

## What Changes
Focus the first link on opening, close the menu on Escape or outside click, and restore focus for keyboard closure. Modal dialogs retain their own Escape handling.

## Impact
Changes shared consumer shell behavior, preserving appearance and routes.

