# Preview and reading quality

## Why
The English preview PID is removed by the website clean stage, leaving a live server that stop:en cannot stop. Reader controls also require a final pass for keyboard and mobile behavior.

## What Changes
Store English preview state outside the build workspace, check process ownership and verify the documented starter workflow.

## Impact
Changes consumer preview scripts and verification; no engine or publication changes.

