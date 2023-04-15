chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const problemName =
    document.querySelector(`#root > div > div._pageContainer_1se0b_3._dark_1se0b_9 > 
 div > div > div._problemBanner__container_1dtux_405._dark_1dtux_110._mobileBanner__container_1dtux_1050 > 
 div._problem__title_1dtux_855._dark_1dtux_110._mobileBannerTitle__container_1dtux_784 > div._titleStatus__container_1dtux_838 > h1`).innerText;
  if (request.greeting == "hello") {
    sendResponse({
      probName: problemName
    });
  }
  return true;
});
