## This extension will automatically notify the user about the result after a submission is made on the CodeChef website.

#### The extension uses chrome.runtime.SendBeforeHeaders() function which checks if the request is being made to the url 
`https://www.codechef.com/error_status_table/`
####  If the website made the request to this endpoint, it means the result is available from the submission. It will use a content script to scrape problem Name. 
#### The extension will then make a GET request to the url 
`https://www.codechef.com/api/ide/submit?solution_id=<submission id of the problem>&service_name=spoj` and get the response and create a notification where the Problem Name and the submission result will be shown. 