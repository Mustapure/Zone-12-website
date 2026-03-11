# JCI Zone 12 Website

A comprehensive website for JCI Zone 12 - a global network of young active citizens building a better world.

## 🌐 Project Overview

**Project Name:** JCI Zone 12 Website  
**Project Type:** Full-stack PHP Web Application  
**Core Functionality:** A membership-based website for JCI (Junior Chamber International) Zone 12 that allows members to register, login, manage events, and maintain a business directory.  
**Target Users:** JCI members, potential new members, chapter leaders, and business owners within the JCI network.

---

## 📋 Features

### 1. User Authentication
- **User Registration** - Members can create accounts with different membership types
- **User Login** - Secure login with email and password
- **Password Management** - Password hashing with PHP's password_hash()
- **Session Management** - Secure session handling with timeout
- **Role-based Access** - Different features for logged-in vs guest users

### 2. Membership Types
- Individual Member
- Educational Institution
- Corporate/Organization
- Business Owner

### 3. Business Directory
- Add new business listings (login required)
- Search businesses by name, owner, or tags
- Filter by category (Services, Products, Service Provider)
- Filter by city
- Sort by name (A-Z, Z-A)
- Contact business owners directly

### 4. Event Management
- View upcoming and past events
- Event registration capability

### 5. Additional Pages
- Home Page - Overview and hero section
- About - Information about JCI Zone 12
- Leaders - Leadership team information
- Partners - Partner organizations
- Contact - Contact form

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | HTML5, CSS3, Tailwind CSS, JavaScript |
| **Backend** | PHP 7.4+ |
| **Database** | MySQL / MariaDB |
| **Server** | Apache (XAMPP) |
| **Icons** | Font Awesome 6 |
| **Fonts** | Google Fonts |

---

## 💻 System Requirements

### Software Needed:
1. **XAMPP** (or any Apache + MySQL + PHP stack)
   - Download from: https://www.apachefriends.org/
   - Minimum PHP version: 7.4
   - MySQL version: 5.7+

2. **Web Browser**
   - Chrome, Firefox, Edge, or Safari (latest versions)

### Optional (for development):
- VS Code or any code editor
- Git for version control

---

## 🚀 Installation & Setup Guide

### Step 1: Install XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP with default settings
3. Start Apache and MySQL services from XAMPP Control Panel

### Step 2: Setup Project Files
1. Navigate to your XAMPP htdocs folder:
   ```
   C:\xampp\htdocs\ (Windows)
   /opt/lampp/htdocs/ (Linux)
   /Applications/XAMPP/htdocs/ (Mac)
   ```

2. Create a new folder named `Zone-12-website` (if not exists)

3. Copy all project files to this folder:
   - All PHP files
   - All CSS files
   - All image files
   - Config folder

### Step 3: Setup Database
1. Open your browser and go to: `http://localhost/phpmyadmin`

2. Click on **"Databases"** tab

3. Create a new database:
   - Database name: `jci_zone12`
   - Collation: `utf8mb4_general_ci`

4. Click on the created database `jci_zone12`

5. Click on **"Import"** tab

6. Click **"Choose File"** and select `database.sql` from your project folder

7. Scroll down and click **"Go"** button

### Step 4: Configure Database Connection (if needed)
The database configuration is already set in `config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'jci_zone12');
define('DB_USER', 'root');
define('DB_PASS', '');
```

If you need different credentials, edit this file.

### Step 5: Run the Project
1. Start Apache and MySQL in XAMPP Control Panel
2. Open your browser
3. Go to: `http://localhost/Zone-12-website/`

---

## 📁 Project Structure

```
Zone-12-website/
├── index.php              # Home page
├── login.php              # Login page
├── register.php           # Registration page
├── logout.php             # Logout handler
├── dashboard.php          # User dashboard (requires login)
├── add-business.php       # Add business listing (requires login)
├── dir.php                # Business directory
├── events.php             # Events page
├── leaders.php            # Leadership page
├── contact.php            # Contact form
├── partner.php            # Partners page
├── authnew.php            # Authentication handler
├── database.sql           # Database schema
├── README.md              # This file
├── SETUP.md               # Setup guide
│
├── config/
│   ├── database.php       # Database connection
│   ├── session.php        # Session management
│   └── functions.php      # Helper functions
│
├── css/
│   ├── index.css          # Home page styles
│   ├── auth.css           # Login/Register styles
│   └── common.css         # Common styles
│
├── include/
│   ├── header.php         # Header template
│   └── footer.php         # Footer template
│
└── images/
    ├── JCI Zone.png       # Logo
    └── (other images)
```

---

## 🔐 Default Admin Account

After setting up the database, you can login with:

| Field | Value |
|-------|-------|
| Email | admin@jcizone12.org |
| Password | Admin@123 |

**Note:** Change the admin password after first login for security!

---

## 📝 How to Use

### For Members:
1. **Register:** Go to `register.php` and create an account
2. **Login:** Use `login.php` with your credentials
3. **Add Business:** Navigate to directory and click "Add Your Business"
4. **Manage Profile:** Access dashboard at `dashboard.php`

### For Visitors:
1. Browse the business directory at `dir.php`
2. View events at `events.php`
3. Learn about JCI at `index.php`
4. Contact through `contact.php`

---

## 🔧 Database Tables

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type ENUM('individual', 'educational', 'corporate', 'business'),
    chapter_name VARCHAR(100),
    organization_name VARCHAR(150),
    status ENUM('active', 'inactive', 'pending'),
    email_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Businesses Table
```sql
CREATE TABLE businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    business_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    owner_jci_name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    website VARCHAR(200),
    address TEXT,
    city VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    tags VARCHAR(255),
    status ENUM('active', 'pending', 'inactive') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Other Tables
- `password_resets` - Password reset tokens
- `user_sessions` - Session tracking
- `contact_submissions` - Contact form submissions

---

## 🎨 Design System

### Color Palette
| Color | Hex Code | Usage |
|-------|----------|-------|
| JCI Blue | #0096D6 | Primary brand color |
| JCI Dark | #006699 | Secondary/dark variant |

### Typography
- Primary Font: System default (Tailwind CSS)
- Headings: Bold, various sizes
- Body: Regular weight, 14-16px

---

## 📞 Support

For issues or questions:
1. Check the SETUP.md file for additional setup details
2. Ensure XAMPP services are running
3. Verify database was imported correctly
4. Check PHP error logs in XAMPP

---

## 📄 License

This project is developed for JCI Zone 12 organization use.

---

## 🔗 Useful Links

- JCI International: https://jci.cc/
- JCI India: https://member.jciindia.in/
- JCI Zone 12: (your local domain)

---

**Last Updated:** 2024
**Version:** 1.0.0

