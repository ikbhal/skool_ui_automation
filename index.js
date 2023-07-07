const { remote } = require('webdriverio');


function automateAddStudent() {
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

}

function automateDeleteStudentById(studentId) {

  const { remote } = require('webdriverio');

  (async () => {
    // Set up WebDriverIO configuration
    const browser = await remote({
      capabilities: {
        browserName: 'chrome'
      }
    });

    try {
      // Navigate to the student list page
      await browser.url('http://localhost:3000/students');

      // Delete a student
      // const studentId = '4'; // Provide the ID of the student you want to delete
      const deleteButton = await browser.$(`a[onclick="deleteStudent('${studentId}')"]`);
      await deleteButton.click();

      // Confirm the deletion
      const confirmButton = await browser.$('.modal-footer .btn-danger');
      await confirmButton.click();

      // Wait for the student to be deleted
      await browser.waitUntil(async () => {
        const studentRow = await browser.$(`tr[data-student-id="${studentId}"]`);
        return !(await studentRow.isExisting());
      }, { timeout: 5000, timeoutMsg: 'Student deletion failed' });

      console.log('Student deleted successfully!');
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      // Close the browser
      await browser.deleteSession();
    }
  })();

}

//call delete
// automateDeleteStudentById(4);

function automateDeleteAllStudents() {
  const { remote } = require('webdriverio');

  (async () => {
    // Set up WebDriverIO configuration
    const browser = await remote({
      capabilities: {
        browserName: 'chrome'
      }
    });

    try {
      // Navigate to the student list page
      await browser.url('http://localhost:3000/students');

      // Get all delete buttons
      const deleteButtons = await browser.$$('a[onclick^="deleteStudent("]');

      // Delete each student
      for (const deleteButton of deleteButtons) {
        await deleteButton.click();

        // Wait for the confirmation dialog to appear
        await browser.waitUntil(async () => {
          const confirmDialog = await browser.$('.modal-content');
          return await confirmDialog.isDisplayed();
        }, { timeout: 5000, timeoutMsg: 'Deletion confirmation dialog did not appear' });

        // Click the confirm button
        const confirmButton = await browser.$('.modal-footer .btn-danger');
        await confirmButton.click();

        // Wait for the confirmation dialog to close
        await browser.waitUntil(async () => {
          const confirmDialog = await browser.$('.modal-content');
          return !(await confirmDialog.isDisplayed());
        }, { timeout: 5000, timeoutMsg: 'Deletion confirmation dialog did not close' });

        // Wait for the student to be deleted
        await browser.waitUntil(async () => !(await deleteButton.isExisting()), { timeout: 5000, timeoutMsg: 'Student deletion failed' });
      }

      console.log('All students deleted successfully!');
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      // Close the browser
      await browser.deleteSession();
    }
  })();

}

// call delete all
automateDeleteAllStudents();