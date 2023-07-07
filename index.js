const { remote } = require('webdriverio');

(async () => {
  // Set up WebDriverIO configuration
  const browser = await remote({
    capabilities: {
      browserName: 'chrome'
    }
  });

  try {
    // Navigate to the add student form
    await browser.url('http://localhost:3000/students/add');

    // Generate random values for the form fields
    const randomName = 'John Doe';
    const randomMobileNumber = '1234567890';
    const randomJoiningDate = '2023-07-07';
    // Generate random values for other form fields as needed

    // Fill in the form fields with the generated random values
    await (await browser.$('#name')).setValue(randomName);
    await (await browser.$('#mobileNumber')).setValue(randomMobileNumber);
    await (await browser.$('#joiningDate')).setValue(randomJoiningDate);
    // Fill in other form fields as needed

    // Submit the form
    await (await browser.$('button[type="submit"]')).click();

    // Wait for the form submission to complete
    await browser.waitUntil(async () => {
      const currentUrl = await browser.getUrl();
      return currentUrl === 'http://localhost:3000/students';
    }, { timeout: 5000, timeoutMsg: 'Form submission failed' });

    // Verify if the student was added to the student list page
    const pageContent = await browser.getPageSource();
    const studentListHtml = pageContent.toString();

    if (studentListHtml.includes(randomName) && studentListHtml.includes(randomMobileNumber)) {
      console.log('Student added successfully!');
    } else {
      console.log('Failed to add student.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    // Close the browser
    await browser.deleteSession();
  }
})();
