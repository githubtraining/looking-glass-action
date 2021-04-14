# Looking Glass

Looking Glass is a reporting agent that provides feedback to users based on a payload signature. Looking Glass **reads the output of a previous GitHub action** and then reports that output to the repository in a configurable manner. To use Looking Glass your action will need to **set output** matching the following payload signature:

**Sample payload signature**

```javascript
{
  reports: [
    {
      filename: "the filename associated with the report",
      isCorrect: true,
      level: "info",
      display_type: "actions",
      msg: "the message",
      error: {
        expected: "the expected string",
        got: "the gotten string",
      },
    },
    {
      filename: "",
      isCorrect: false,
      display_type: "issues",
      level: "fatal",
      msg: "the message",
      error: {
        expected: "",
        got: "",
      },
    },
  ];
}
```

| Key              | Value   | Description                                                                                                                                                                                           | Required | Values                                                                                                                                                                      |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filename`       | String  | If there is a file associated with the report pass its full path as the value to `filename`                                                                                                           | NO       | Any string                                                                                                                                                                  |
| `isCorrect`      | Boolean | Was the task associated with this report completed correctly?                                                                                                                                         | YES      | <ul><li>true</li><li>false</li></ul>                                                                                                                                        |
| `level`          | String  | What is the severity of the report? Useful for applying labels to issues or highlighting text and other data in the GitHub Actions runner                                                             | YES      | <ul><li>info</li><li>warning</li><li>fatal</li></ul>                                                                                                                        |
| `display_type`   | String  | Desired GitHub repository feature to use for displaying `msg`.                                                                                                                                        | YES      | <ul><li>actions</li><li>issues</li><li>pages (not currently supported)</li><li>projects (not currently supported)</li><li>pull_requests (not currently supported)</li></ul> |
| `msg`            | String  | Message to be provided to the user. **Default value is Error**.                                                                                                                                       | NO       | Any string                                                                                                                                                                  |
| `error.expected` | String  | If the `msg` is "Error" this field **must be populated**. This should be a short message describing what the expected value of the feedback payload. `Example: "Expected path to be /docs"`           | NO       | Any string                                                                                                                                                                  |
| `error.got`      | String  | if the `msg` is "Error" this field **must be populated**. This should be a short message describing what the feedback payload actually sent to the Looking Glass. `Example: "Got path /bread-crumbs"` | NO       | Any string                                                                                                                                                                  |

## Using Looking Glass

**Input Parameters**

| Parameter      | Description                                                                                                                                             | Required |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `feedback`     | Output from a previous action containing a **stringified** version of the payload signature.                                                            | YES      |
| `github-token` | A token scoped with the ability to use repository features to provide feedback. It is best to use `secrets.GITHUB_TOKEN` as a value for this parameter. | YES      |

**Basic configuration**
In this example Looking Glass reads the output of a previous action which has an ID of `events` as supplied input for the `feedback` parameter.

```yaml
jobs:
  grade_lab:
    runs-on: ubuntu-latest
    steps:
      - name: My grading action
        uses: mygrading/action-for-this-lab@v1
        id: events
        with:
          input_1: whatever input you need

      - name: Your Feedback
        uses: githubtraining/looking-glass-action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          feedback: ${{ steps.events.outputs.reports }}
```

## Author Resources

Are you authoring a hands-on lab? Here is a living collection of tools and resources to help you develop labs with greater velocity 😄

- [Looking-Glass-Payload-Tester](https://github.com/githubtraining/looking-glass-payload-tester), A tool to help you test your Looking Glass payloads manually so that you don't have to step through each lab multiple times to determine if Looking Glass is going to behave as you expect.

## Trouble With Looking Glass

Looking glass is currently in release `version 0.1.0` which means it's still quite young and we are shipping to learn from our authors. If you run into a problem with Looking Glass please open an issue in this repository and feel free to ping @github/content-and-enablement in Slack if you don't receive a follow up quickly!

It's also important to check the releases page often since Looking Glass is likely to receive new features and other updates frequently leading up to it's first major release.

Please feel free to leave general feedback in an issue in this repository as well!
