const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

class SubscriptionService {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, '../subscriptions.db'));
        this.initializeDatabase();
    }

    initializeDatabase() {
        this.db.run(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE,
                phone TEXT,
                plan TEXT,
                status TEXT DEFAULT 'active',
                startDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                endDate DATETIME,
                lastNotificationDate DATETIME,
                stripeCustomerId TEXT,
                stripeSubscriptionId TEXT,
                stripePaymentMethodId TEXT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating subscriptions table:', err);
            } else {
                console.log('Subscriptions table created/verified');
            }
        });
    }

    async createSubscription({ email, phone, plan, stripeCustomerId, stripeSubscriptionId, stripePaymentMethodId }) {
        return new Promise((resolve, reject) => {
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + 1); // Default to 1 month

            this.db.run(
                `INSERT INTO subscriptions (email, phone, plan, endDate, stripeCustomerId, stripeSubscriptionId, stripePaymentMethodId)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [email, phone, plan, endDate, stripeCustomerId, stripeSubscriptionId, stripePaymentMethodId],
                function(err) {
                    if (err) {
                        console.error('Error creating subscription:', err);
                        reject(err);
                    } else {
                        resolve({
                            id: this.lastID,
                            email,
                            phone,
                            plan,
                            endDate
                        });
                    }
                }
            );
        });
    }

    async getSubscription(email) {
        return new Promise((resolve, reject) => {
            this.db.get(
                'SELECT * FROM subscriptions WHERE email = ?',
                [email],
                (err, row) => {
                    if (err) {
                        console.error('Error getting subscription:', err);
                        reject(err);
                    } else {
                        resolve(row);
                    }
                }
            );
        });
    }

    async updateSubscription(email, { plan, status, stripeCustomerId, stripeSubscriptionId, stripePaymentMethodId }) {
        return new Promise((resolve, reject) => {
            const updates = [];
            const values = [];

            if (plan) {
                updates.push('plan = ?');
                values.push(plan);
            }
            if (status) {
                updates.push('status = ?');
                values.push(status);
            }
            if (stripeCustomerId) {
                updates.push('stripeCustomerId = ?');
                values.push(stripeCustomerId);
            }
            if (stripeSubscriptionId) {
                updates.push('stripeSubscriptionId = ?');
                values.push(stripeSubscriptionId);
            }
            if (stripePaymentMethodId) {
                updates.push('stripePaymentMethodId = ?');
                values.push(stripePaymentMethodId);
            }

            if (updates.length === 0) {
                reject(new Error('No fields to update'));
                return;
            }

            values.push(email);

            this.db.run(
                `UPDATE subscriptions SET ${updates.join(', ')} WHERE email = ?`,
                values,
                function(err) {
                    if (err) {
                        console.error('Error updating subscription:', err);
                        reject(err);
                    } else {
                        resolve({ changes: this.changes, email });
                    }
                }
            );
        });
    }

    async cancelSubscription(email) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE subscriptions SET status = ? WHERE email = ?',
                ['cancelled', email],
                function(err) {
                    if (err) {
                        console.error('Error cancelling subscription:', err);
                        reject(err);
                    } else {
                        resolve({ changes: this.changes, email });
                    }
                }
            );
        });
    }

    async getActiveSubscriptions() {
        return new Promise((resolve, reject) => {
            this.db.all(
                'SELECT * FROM subscriptions WHERE status = ?',
                ['active'],
                (err, rows) => {
                    if (err) {
                        console.error('Error getting active subscriptions:', err);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                }
            );
        });
    }

    async updateLastNotification(email) {
        return new Promise((resolve, reject) => {
            this.db.run(
                'UPDATE subscriptions SET lastNotificationDate = CURRENT_TIMESTAMP WHERE email = ?',
                [email],
                function(err) {
                    if (err) {
                        console.error('Error updating last notification:', err);
                        reject(err);
                    } else {
                        console.log('Last notification updated (email notifications disabled)');
                        resolve({
                            changes: this.changes,
                            email
                        });
                    }
                }
            );
        });
    }
}

module.exports = new SubscriptionService(); 