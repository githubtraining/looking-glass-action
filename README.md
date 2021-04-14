# looking-glass-action

Looking Glass is a reporting agent that provides feedback to users based on a payload signature. Looking Glass reads the output of a previous GitHub action and then reports that output to the repository in a configurable manner. To use Looking Glass your action will need to **set output** matching the following payload signature.

**Sample payload signature (:warning: not compatible with POC actions at the moment)**

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

| Key              | Value   | Description                                                                                                                                                                                           | Required | Values                                                                                        |
| ---------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `filename`       | String  | If there is a file associated with the report pass its full path as the value to `filename`                                                                                                           | NO       | Any string                                                                                    |
| `isCorrect`      | Boolean | Was the task associated with this report completed correctly?                                                                                                                                         | YES      | <ul><li>true</li><li>false</li></ul>                                                          |
| `level`          | String  | What is the severity of the report? Useful for applying labels to issues or highlighting text and other data in the GitHub Actions runner                                                             | YES      | <ul><li>info</li><li>warning</li><li>fatal</li></ul>                                          |
| `display_type`   | String  | Desired GitHub repository feature to use for displaying `msg`.                                                                                                                                        | YES      | <ul><li>actions</li><li>issues</li><li>pages</li><li>projects</li><li>pull_requests</li></ul> |
| `msg`            | String  | Message to be provided to the user. **Default value is Error**.                                                                                                                                       | NO       | Any string                                                                                    |
| `error.expected` | String  | If the `msg` is "Error" this field **must be populated**. This should be a short message describing what the expected value of the feedback payload. `Example: "Expected path to be /docs"`           | NO       | Any string                                                                                    |
| `error.got`      | String  | if the `msg` is "Error" this field **must be populated**. This should be a short message describing what the feedback payload actually sent to the Looking Glass. `Example: "Got path /bread-crumbs"` | NO       | Any string                                                                                    |

## Using Looking Glass

**Input Parameters**

| Parameter      | Description                                                                                                                                             | Required |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `feedback`     | Output from a previous action containing a **stringified** version of the payload signature.                                                            | YES      |
| `github-token` | A token scoped with the ability to use repository features to provide feedback. It is best to use `secrets.GITHUB_TOKEN` as a value for this parameter. | YES      |

**Basic configuration**
In this example Looking Glass reads the output of a previous action which has an ID of `events` as supplied input for the `feedback` parameter.

```yaml
- name: Troubleshooting info for grading
  if: failure()
  uses: githubtraining/looking-glass-action@main
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    feedback: ${{ steps.events.outputs.reports }}
```
