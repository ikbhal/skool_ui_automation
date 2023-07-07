const { remote } = require('webdriverio');

(async () => {
  // Set up WebDriverIO configuration
  const browser = await remote({
    capabilities: {
      browserName: 'chrome'
    }
  });

  // Navigate to a website
  await browser.url('http://localhost:3000/students');

  // Find an element on the page
  const element = await browser.$('h1');

  // Get the text of the element
  const text = await element.getText();

  // Print the text
  console.log(text);

  // Close the browser
  await browser.deleteSession();
})();
