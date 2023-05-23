const { App, AwsLambdaReceiver } = require("@slack/bolt");

// Initialize your custom receiver
const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Initializes your app in socket mode with your app token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  // socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000,
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say(`Hey there <@${message.user}>!`);
});

app.event("reaction_added", async ({ event, say }) => {
  if (event.reaction === "kimchi") {
    // // TODO: Capture 📸
    // console.log(event.item);

    // Store message
    let message;

    function pbcopy(data) {
      var proc = require("child_process").spawn("pbcopy");
      proc.stdin.write(data);
      proc.stdin.end();
    }

    // Fetch conversation history using the ID and a TS from the last example
    async function fetchMessage(channel, ts) {
      try {
        // Call the conversations.history method using the built-in WebClient
        const result = await app.client.conversations.history({
          // The token you used to initialize your app
          token: process.env.SLACK_BOT_TOKEN,
          channel,
          // In a more realistic app, you may store ts data in a db
          latest: ts,
          // Limit results
          inclusive: true,
          limit: 1,
        });

        // There should only be one result (stored in the zeroth index)
        message = result.messages[0];

        // Copy to Clipboard 📎
        pbcopy(message.text);

        // Print message text
        // await say(`Copied ${message.text} :paperclip:`);
      } catch (error) {
        console.error(error);
      }
    }

    // Fetch message using a channel ID and message TS
    const { channel, ts } = event.item;
    fetchMessage(channel, ts);
  }
});

// (async () => {
//   // Start your app
//   await app.start(process.env.PORT || 3000);

//   console.log("⚡️ Bolt app is running!");
// })();

// Handle the Lambda function event
module.exports.handler = async (event, context, callback) => {
  const handler = await awsLambdaReceiver.start();
  return handler(event, context, callback);
};
