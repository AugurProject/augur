# Augur Issues Workflow

The goal of this document is to provide a high-level understanding of the workflow the team uses to triage new issues and coordinate projects. This should give individual contributors as well as people looking at the project as a whole a way to understand what they're responsible for in the project.

## New Issues Workflow

GOAL: We want to give the engineers working on specific projects the ability to triage, organize, and prioritize the work within their respective projects and epics. We also want to free up time so that one person isn't consistently responsible for sorting through all issue and tracking people down to understand how they should be organized. To facilitate this, the DIP (designated interruptible person) will be responsible for newly created external issues during their time as DIP, and the internal reporter is responsible for organizing the issue if it is internally created.

### Issues created by the team

- IF you are submitting a new issue for a Feature, Chore, or Improvement which is not a live bug:
  - If this issue relates to current or future which for which there is an Epic, assign it to that epic.
  - Place the issue in the backlog.
  - Assign Priority based on your knowledge of the project.
- ELSE IF you are submitting a new Live Bug
  - If the issue relates to a currently existing Epic, assign it to that Epic
  - Else, assign to the Bugs Epic
  - If the issue requires immediate attention, assign to the person who will work on it, and move it to In Progress
  - Else, add the issue to Backlog
- If issue is considered Critical (or if the epic it belongs to is Product Critical), mark as Product: Critical. If you're unsure, send to @pgebheim or @joeykrug and get it discussed.
- If issue is relevant to V2 in any way, add it to the V2 Release (You need the Zenhub plugin to do this within GH interface), basically all issues which would be marked as Product Critical should go to V2, as well as bugs related to V2 code. Issues only related to V1 code, or issues which are future feature requests do not need the V2 release.

### Issues created externally (for the DIP)

- The monthly DIP (Designated Intrerruptible Person) is responsible for first level triage of issues submitted by the community.
- IF the submitted issue is a Feature, Chore, or Improvement
  - Tag @joeykrug, @adrake, and @pgebheim on the issue -- move to Needs Information
  - If you have any specific information or feedback on the issue, add as needed.
- IF the submitted issue is a Live Bug
  - Assign to yourself
  - Assign the current Milestone.
  - IF there is a currently open related Epic, assign to that Epic
  - ELSE, assign to the Bugs epic
  - THEN complete first level evaluation of the bug
  - If the bug needs immediate attention, move to In Progress and handle it, or assign to the person who will handle it.
  - Else, Add to Backlog pipeline and assign to the appropriate person after all your investigation. Ask @pgebheim if you need help!
- If issue is considered Critical (or if the epic it belongs to is Product Critical), mark as Product: Critical. If you're unsure, send to @pgebheim or @joeykrug and get it discussed.
- If issue is relevant to V2 in any way, add it to the V2 Release (You need the Zenhub plugin to do this within GH interface), basically all issues which would be marked as Product Critical should go to V2, as well as bugs related to V2 code. Issues only related to V1 code, or issues which are future feature requests do not need the V2 release.

## Other Considerations

It's not always obvious how tasks fit into the overall priorities. Once your team has decided what it thinks the appropriate internal priorities are, the issues can be looked at by @pgebheim, @joeykrug, and other stakeholders to see if this will meet any overall goals. This will begin with the Monday Morning - Critical Issue Roundup, but we'll add more (light) process where necessary.


## Pipelines

This set of pipelines is meant to make it easy to see the status of issues across the project on one screen. We've simplified so there's very few extra steps needed to work an issue. Most should move from Backlog to In Progress to Closed.

Pipelines:
- New Issues
  - Where new external issues show up
  - DIP will monitor this pipeline
- Backlog
  - This should be an ordered list of tasks per epic / release.
- Blocked / Needs Information
  - New issues that need exploration, or issues that were in progress but are now blocked by another task should go here. Feel free to move items in and out of this as need be!
- In Progress
  - Things which you are actively working on. If an item becomes blocked try to move it back to the Blocked / Needs Info pipeline. If you stop working on it, it goes back into the Backlog.
- QA
  - For integration work that needs approval from Product. Put the issue here and assign to the stakeholder that needs to check it out.
- Closed
  - Things that have been closed.
