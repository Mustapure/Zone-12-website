# Database Setup Guide for JCI Zone 12

## Step 1: Access phpMyAdmin
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. You should see the phpMyAdmin interface

## Step 2: Create the Database
1. Click on **"Databases"** tab at the top
2. In the "Create database" field, enter: `jci_zone12`
3. Select **"utf8mb4_general_ci"** as the collation
4. Click **"Create"** button

## Step 3: Import the Tables
1. Click on the `jci_zone12` database in the left sidebar
2. Click on **"Import"** tab at the top
3. Click **"Choose File"** button
4. Select the `database.sql` file from your project folder:
   - Path: `c:\xampp\htdocs\Zone-12-website\database.sql`
5. Scroll down and click **"Go"** or **"Import"** button

## Step 4: Verify the Setup
After importing, you should see these tables in the database:
- `users` - User accounts
- `password_resets` - Password reset tokens
- `user_sessions` - User sessions
- `contact_submissions` - Contact form submissions

## Step 5: Test Login
Default admin account:
- **Email:** admin@jcizone12.org
- **Password:** Admin@123

## Troubleshooting

### If you can't access phpMyAdmin:
1. Make sure XAMPP is running
2. Check if Apache and MySQL services are started in XAMPP Control Panel

### If database import fails:
- Make sure the database `jci_zone12` was created first
- Check that you're importing into the correct database

### If login doesn't work:
- Verify the users table was created correctly
- Check that the admin user was inserted (you can check in phpMyAdmin by viewing the users table)

