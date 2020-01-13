const core = require('@actions/core');
const fetch = require('node-fetch');
const util = require('util');

async function github_query(github_token, query, variables) {
  return fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({query, variables}),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `bearer ${github_token}`,
    }
  }).then(function(response) {
    return response.json();
  });
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const issue = core.getInput('issue');
    const repository = core.getInput('repository');
    const github_token = core.getInput('github_token');
    const projectIds = core.getInput('issue_project_ids').replace(/[\s]+]/, '').split(',');

    let response, variables;

    query = `
    query($owner:String!, $name:String!, $number:Int!){
      repository(owner: $owner, name: $name) {
        issue(number:$number) {
          id
        }
      }
    }`;

    variables = { owner: repository.split("/")[0], name: repository.split("/")[1], number: parseInt(issue) };

    response = await github_query(github_token, query, variables);
    console.log(util.inspect(response, { showHidden: false, depth: null }));
    const issueId = response['data']['repository']['issue']['id'];

    console.log(`Adding issue ${issue} with issue ID ${issueId} to projects: ${projectIds.join(', ')}`);
    console.log("");

    query = `
    mutation($issueId:ID!, $projectIds:[ID!]) {
      updateIssue(input:{id:$issueId, projectIds:$projectIds}) {
        issue {
          id
        }
      }
    }`;
    variables = { issueId, projectIds };

    response = await github_query(github_token, query, variables);
    console.log(util.inspect(response, { showHidden: false, depth: null }));
    console.log(`Done!`)
  }
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
