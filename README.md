# Add issue to project

A javascript github action to add an issue to the first project on the repository.

NOTE: If you have more than one project, this might not work.

# Usage

```yaml
name: 'Add new issue to project board'

on:
  issues:
    types:
    - opened
 
jobs:
  add_to_project:
    runs-on: ubuntu-latest
    steps:
    - uses: chapterspot/ga-issues-projects@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        repository: ${{ github.repository }}
        issue: ${{ github.event.issue.number }}
        issue_project_ids: list_of_project_ids,delimited_by_comma
```
