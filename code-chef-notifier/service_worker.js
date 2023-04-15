const x_csrf_token = "<your x-csrf-token>";
let continueFetching = true;
let fetchResultLocal;
let solution;

// Start the extention
chrome.webRequest.onBeforeSendHeaders.addListener(
  async (details) => {
    const url = details.url;
    if (url.startsWith("https://www.codechef.com/error_status_table/")) {
      const submissionId = url.split("/")[4];
      chrome.storage.local.set({ subId: submissionId });
      chrome.storage.local.set({ token: x_csrf_token });
      const fetchUrl = `https://www.codechef.com/api/ide/submit?solution_id=${submissionId}&service_name=spoj`;
      try {
        const fetch = await fetchQuestionInfo();
        fetchResultLocal = fetch;
        await getResult(fetchUrl, x_csrf_token, continueFetching);
      } catch (error) {
        console.log("Error occurred:", error);
      }
    } else {
      console.log("Url doesnt match???");
    }
  },
  {
    urls: ["https://www.codechef.com/error_status_table/*"],
  }
);

// scrape problem Name by using content script
async function fetchQuestionInfo() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const ID = parseInt(tabs[0].id);
  return new Promise((resolve, reject) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: ID },
        files: ["content_script.js"],
      },
      async () => {
        await ping(ID)
          .then(async (localResponse) => {
            resolve(localResponse);
          })
          .catch((error) => {
            reject(error);
          });
      }
    );
  });
}

async function ping(tabID) {
  {
    return await new Promise(async (resolve, reject) => {
      await chrome.tabs.sendMessage(
        tabID,
        { greeting: "hello" },
        function (response) {
          if (!chrome.runtime.lastError) {
            resolve(response);
          } else {
            reject(chrome.runtime.lastError);
          }
        }
      );
    });
  }
}

// send XHR GET request to get the problem submission repsonse.
async function getResult(url, x_csrf_token, continueFetching) {
  while (continueFetching) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-CSRF-Token": x_csrf_token,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.result_code === "wait" || data.result_code === "runtime") {
        setTimeout(() => getResult(url, x_csrf_token, continueFetching), 5000);
      } else if (
        data.result_code === "accepted" ||
        data.result_code === "wrong"
      ) {
        solution = data.result_code;
        continueFetching = false;
        await notifyUser();
      }
    } catch (error) {
      console.log("There was a problem with the fetch request:", error);
    }
  }
}

// notify the user that the result is available.
async function notifyUser() {
  chrome.notifications.create(
    "idHere",
    {
      type: "basic",
      iconUrl: "images/icons.png",
      title: `Problem Name:  ${fetchResultLocal.probName}`,
      message: `You solution is ${solution}`,
    },
    function () {}
  );
}
