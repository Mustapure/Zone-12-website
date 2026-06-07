import { sql } from './db';
import bcrypt from 'bcryptjs';

/**
 * Initializes the Neon PostgreSQL database tables
 * and seeds the default administrator if it does not exist.
 */
export async function initializeDatabase() {
  try {
    console.log('Starting Neon database initialization...');

    // 1. Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type VARCHAR(50) DEFAULT 'individual',
        role VARCHAR(50) DEFAULT 'user', -- 'user', 'verified_user', 'vendor', 'admin'
        chapter_name VARCHAR(100),
        member_id VARCHAR(50),
        organization_name VARCHAR(150),
        status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
        email_verified BOOLEAN DEFAULT FALSE,
        verification_requested BOOLEAN DEFAULT FALSE,
        claimed BOOLEAN DEFAULT TRUE,
        show_in_directory BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ Users table checked/created.');

    // Ensure member_id column exists on users table for existing databases
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS member_id VARCHAR(50);
    `;

    // Ensure claimed and show_in_directory columns exist on users table for existing databases
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS claimed BOOLEAN DEFAULT TRUE;
    `;
    await sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS show_in_directory BOOLEAN DEFAULT TRUE;
    `;

    // 2. Create Businesses Table (with foreign key)
    await sql`
      CREATE TABLE IF NOT EXISTS businesses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        business_name VARCHAR(150) NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        website VARCHAR(200),
        address TEXT,
        city VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending', -- 'active', 'pending', 'inactive'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ Businesses table checked/created.');

    // 3. Create Contact Submissions Table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        city VARCHAR(100),
        message TEXT,
        status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'closed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ Contact submissions table checked/created.');

    // 4. Create Events Table
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        date VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        location VARCHAR(150) NOT NULL,
        img VARCHAR(255) DEFAULT '/img/img10.jpeg',
        featured BOOLEAN DEFAULT FALSE,
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✓ Events table checked/created.');

    // Seed default Events if empty
    const eventsCheck = await sql`SELECT id FROM events LIMIT 1`;
    if (eventsCheck.length === 0) {
      console.log('Seeding initial mock events...');
      const mockEvents = [
        {
          title: 'Zone Midcon 2026',
          date: 'June 12, 2024',
          desc: 'Annual gathering of all local chapters for mid-year review, strategic planning, and celebration of achievements across JCI Zone 12.',
          category: 'conference',
          location: 'TBD',
          img: '/img/img10.jpeg',
          featured: true,
          published: true
        },
        {
          title: 'Zone Conference 2024',
          date: 'March 15, 2024',
          desc: 'Join leaders from across the zone for a weekend of strategic planning, delegation meetings, and networking.',
          category: 'conference',
          location: 'City Hall Annex',
          img: '/img/img11.jpeg',
          featured: false,
          published: true
        },
        {
          title: 'Leadership Training Workshop',
          date: 'April 10, 2024',
          desc: 'Enhance your professional capabilities with our expert-led workshop focused on communication and strategy.',
          category: 'training',
          location: 'Online (Zoom)',
          img: '/img/img12.jpeg',
          featured: false,
          published: true
        },
        {
          title: 'Business Networking Night',
          date: 'July 20, 2024',
          desc: 'Connect with commercial business leaders and directory partners in JCI India Zone 12.',
          category: 'community',
          location: 'Grand Hotel Ballroom',
          img: '/img/img13.jpeg',
          featured: false,
          published: true
        },
        {
          title: 'Youth Leadership Summit',
          date: 'August 10, 2024',
          desc: 'Empowering the next generation of active citizens through dynamic debates and workshops.',
          category: 'training',
          location: 'Convention Center',
          img: '/img/img14.jpeg',
          featured: false,
          published: true
        },
        {
          title: 'Community Impact Day',
          date: 'September 14, 2024',
          desc: 'Hands-on community service projects executing sustainable sanitation initiatives across the zone.',
          category: 'community',
          location: 'Various Locations',
          img: '/img/img15.jpeg',
          featured: false,
          published: true
        },
        {
          title: 'Annual Awards Night',
          date: 'November 22, 2024',
          desc: 'Celebrating outstanding achievements of chapters and active members in JCI Zone 12.',
          category: 'awards',
          location: 'Gala Banquet Venue',
          img: '/img/img17.jpeg',
          featured: false,
          published: true
        }
      ];

      for (const e of mockEvents) {
        await sql`
          INSERT INTO events (title, date, description, category, location, img, featured, published)
          VALUES (${e.title}, ${e.date}, ${e.desc}, ${e.category}, ${e.location}, ${e.img}, ${e.featured}, ${e.published})
        `;
      }
      console.log('✓ Mock events seeded successfully!');
    }

    // 4. Seed default Administrator
    const adminEmail = 'admin@jcizone12.org';
    const adminCheck = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;

    if (adminCheck.length === 0) {
      console.log('Seeding default administrator account...');
      const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
      
      await sql`
        INSERT INTO users (first_name, last_name, email, password, user_type, role, email_verified, status)
        VALUES ('Admin', 'User', ${adminEmail}, ${adminPasswordHash}, 'individual', 'admin', true, 'active')
      `;
      
      console.log('✓ Default administrator seeded successfully!');
    } else {
      console.log('✓ Administrator account already exists.');
    }

    console.log('Neon database initialization completed successfully.');
    return { status: 'success', message: 'Database initialized successfully' };
  } catch (error: any) {
    console.error('Failed to initialize Neon database:', error);
    return { status: 'error', error: error.message || error };
  }
}
