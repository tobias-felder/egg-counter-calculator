const notifications = require('./notifications');

async function testNotifications() {
  const userEmail = process.env.TEST_EMAIL;

  // Test 1: Fertility Window Alert
  await notifications.sendNotification(userEmail, 'fertilityWindow', {
    startDate: 'November 15, 2023',
    endDate: 'November 20, 2023',
    ovulationDate: 'November 18, 2023'
  });

  // Test 2: Egg Count Update
  await notifications.sendNotification(userEmail, 'eggCountUpdate', {
    age: 30,
    eggRange: '50,000 - 100,000',
    change: 'Decreased by 5% from last measurement'
  });

  // Test 3: Cycle Reminder
  await notifications.sendNotification(userEmail, 'cycleReminder', {
    nextPeriod: 'November 25, 2023',
    ovulationDay: 'November 18, 2023'
  });

  // Test 4: Custom Notification
  await notifications.sendNotification(userEmail, 'custom', {
    title: 'Important Reminder',
    message: 'Remember to update your cycle information for more accurate predictions.'
  });
}

testNotifications().then(() => {
  console.log('All test notifications sent!');
}).catch(error => {
  console.error('Error during testing:', error);
}); 