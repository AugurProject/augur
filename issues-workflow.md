# Augur Issues Workflow

The goal of this document is to provide a high-level understanding of the workflow the team uses to triage new issues and coordinate projects. This should give individuals conttributors as well as people looking at the project as a whole a way to understand what they're responsible for in the project.

## New Issues Workflow

GOAL: We want to give the engineers working on specific projects the ability to triage, organize, and prioritize the work within their respective propjects and epics.

### Issues created by the team

- IF you are submitting a new issue for a Feature, Chore, or Improvement which is not a live bug:
  - If this issue relates to current or future which for which there is an Epic, assign it to that epic.
  - Place the issue in the backlog.
  - Assign Priority based on your knowledge of the project.
  - If issue is considered Critical, mark as Product: Critical. If you're unsure, send to @pgebheim or @joeykrug and get it discussed.
- IF you are submitting a new Live Bug
  - If the issue relates to a currently existing Epic, assign it to that Epic
  - Else, assign to the Bugs Epic
  - If the issue requires immediate attention, assign to the person who will work on it, and move it to In Progress
  - Else, add the issue to Backlog
  - If issue is considered Critical, mark as Product: Critical. If you're unsure, send to @pgebheim or @joeykrug and get it discussed.
  
### Issues created externally (for the DIP)

- The monthly DIP (Designated Intrerruptible Person) is responsible for first level triage of issues submitted by the community.
- IF the submitted issue is a Feature, Chore, or Improvement
  - Tag @joeykrug, @adrake, and @pgebheim on the issue -- move to Needs Information
  - If you have any specific information or feedback on the issue, add as needed.
- IF the submitted issue is a Live Bug
  - Assign to yourself
  - IF there is a currently open related Epic, assign to that Epic
  - ELSE, assign to the Bugs epic
  - THEN complete first level evaluation of the bug
  - If the bug needs immediate attention, move to In Progress and handle it, or assign to the person who will handle it.
  - Else, Add to Backlog pipeline and assign to the appropriate person after all your investigation. Ask @pgebheim if you need help!
  
