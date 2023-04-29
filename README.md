# js-GPT

<https://u8sand.github.io/js-gpt>

GPT--but answers are coded in Javascript and executed. This helps GPT overcome limitations like getting information about *today*, from external places via API, and provide more reliable calculations.

NOTE: This is a client-side application, all communication happens with OpenAI, all persistent state is stored in localStorage, all execution happens in your browser.

## Example
```
Note:
Q: User query
F: javascript function
R: execution result of I
A: answer to user query based on R.

User: Q: How many years until 32-bit Unix Timestamps become a problem?

Assistant: F: function main() {
  const current_date = new Date();
  // Unix timestamps are measured in seconds, so we convert to milliseconds here
  const current_timestamp = current_date.getTime() / 1000; 
  const max_unix_timestamp = Math.pow(2, 32) - 1; // Maximum value of a 32-bit Unix timestamp
  const seconds_until_problem = max_unix_timestamp - current_timestamp;
  const years_until_problem = seconds_until_problem / (60 * 60 * 24 * 365.25);
  return Math.ceil(years_until_problem);
}

User Browser: R: 83

Assistant: A: According to our calculations, there are approximately 83 years until 32-bit Unix timestamps become a problem.
```
