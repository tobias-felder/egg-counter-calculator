// Client-side notifications handler
const notifications = {
    async sendNotification(email, type, data) {
        console.log('Attempting to send notification:', { email, type, data });
        try {
            console.log('Making fetch request to /api/notifications');
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    type,
                    data
                })
            });

            console.log('Received response:', response);
            const result = await response.json();
            console.log('Parsed response:', result);

            if (!result.success) {
                throw new Error(result.error);
            }

            console.log(`${type} notification sent successfully`);
            return result;
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Error sending notification: ' + error.message);
            return { success: false, error: error.message };
        }
    }
}; 