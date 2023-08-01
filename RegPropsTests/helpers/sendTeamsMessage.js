const request = require("supertest");
require("dotenv").config();


const getUserEmail = require("../../sharedMethods/users");
const getCount = require("../../sharedMethods/getTestCountsFromXML");
const message = require("../../sharedMethods/message.json");

const results = require("../../reports/reportJsonRP.json");

const { Octokit } = require("octokit");

const run_id = process.env.runId;
const ownerRepo = process.env.ownerRepo;
const accessToken = process.env.accessToken;

const octokit = new Octokit({
  auth: accessToken,
});

const msteams = {
  entities: [
    {
      type: "mention",
      text: "<at>firstName.lastName</at>",
      mentioned: {
        id: "firstName.lastName@msci.com",
        name: "Firstname Lastname",
      },
    },
  ],
};

const buildInfo = {
  type: "Column",
  width: "stretch",
  items: [
    {
      type: "TextBlock",
      horizontalAlignment: "Left",
      isSubtle: true,
      wrap: true,
    },
    {
      type: "TextBlock",
      spacing: "None",
      horizontalAlignment: "Left",
      text: "Azure pipelines",
      isSubtle: true,
      wrap: true,
    },
  ],
};

const getTriggeredByRunInfo = async () => {
  console.log("---------------->>", run_id);
  const response = await octokit.request(
    `GET /repos/${ownerRepo}/actions/runs/{run_id}`,
    {
      run_id: run_id,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // console.log(response);
  return response.data;
};

function getFailedMessages() {
  const extraButton = {
    type: "Action.ShowCard",
    title: "Failed results",
    card: {
      type: "AdaptiveCard",
      body: [],
    },
  };

  //get into general suite
  results.suites.forEach((suite) => {
    //get into suites
    suite.suites.forEach((tests) => {
      const suiteTitle = tests.title;
      //get into specs
      tests.specs.forEach((spec) => {
        if (spec.tests[0].results[0].errors.length != 0) {
          let testName = {
            type: "TextBlock",
            text: `**Failed test name: _${suiteTitle}=>${
              spec.title
            }_** failed with \n\n **Error message:** ${spec.tests[0].results[0].error.message.replace(
              /\u001b\[.*?m/g,
              ""
            )}_`,
            width: "stretch",
            wrap: true,
            separator: true,
          };

          extraButton.card.body.push(testName);
        }
      });
    });
  });
  return extraButton;
}

const constructMessage = async () => {
  const getRunInfo = await getTriggeredByRunInfo();
  const testResults = getCount.getTestCountsFromXML();

  //set commit name
  message.attachments[0].content.body[0].columns[0].items[1].text =
    getRunInfo.display_title;
  //set user name, who triggered run
  message.attachments[0].content.body[0].columns[1].items[1].text = `<at>${getRunInfo.actor.login}</at>`;
  // getRunInfo.actor.login;

  //set msteams mention
  msteams.entities[0].text = `<at>${getRunInfo.actor.login}</at>`;
  msteams.entities[0].mentioned.id = getUserEmail.users(getRunInfo.actor.login);
  msteams.entities[0].mentioned.name = getRunInfo.actor.login;
  message.attachments[0].content.msteams = msteams;

  //set link to gh branch
  buildInfo.items[1].text = `Branch [${getRunInfo.head_branch}](${getRunInfo.html_url}) `;

  message.attachments[0].content.body[0].columns.push(buildInfo);

  //set count details
  message.attachments[0].content.body[1].columns[0].items[1].text =
    testResults.total;
  message.attachments[0].content.body[1].columns[1].items[1].text =
    testResults.passed;
  message.attachments[0].content.body[1].columns[2].items[1].text =
    testResults.skipped;
  message.attachments[0].content.body[1].columns[3].items[1].text =
    testResults.failed;

  console.log(`Total tests: ${testResults.total}`);
  console.log(`Passed tests: ${testResults.passed}`);
  console.log(`Failed tests: ${testResults.failed}`);

  //set color of the commit
  if (testResults.failed == 0) {
    message.attachments[0].content.body[0].columns[0].items[1].color = "good";
  } else {
    message.attachments[0].content.body[2].actions[0] = getFailedMessages();
  }

  console.log(JSON.stringify(message));
  return message;
};

const url =
  //e2e-test webhook
  "https://onemsci.webhook.office.com/webhookb2/ce10d01a-2ad3-4288-a9f2-f878bb4e2073@7a9376d4-7c43-480f-82ba-a090647f651d/IncomingWebhook/ddba009437ed44f99f53aa08a6398d4b/34d0e891-ebdf-4291-a14b-ad852606b0ec";
const sendMessage = async () => {
  const response = await request(url)
    .post("")
    .set({
      accept: "application/json, te",
      "content-type": "application/json; charset=UTF-8",
    })
    .send(await constructMessage());

  console.log(
    "Message status code of MS Teams: " + JSON.stringify(response.text)
  );
  // console.log("Message status code of MS Teams: " + JSON.stringify(response));
};

sendMessage();
