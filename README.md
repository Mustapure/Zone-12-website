Objective of the Project to Make more reach for JC and NON JC prmote Buy from JC and promote All the events done by local Chapter NewsLitter 


JCI Website Requirements
The website should include the following features:
1.	Overview of All JCI Functions
A dedicated section showcasing all JCI activities, programs, initiatives, and impact areas.
2.	Complete JCI Hyperlinks
Integration of all important JCI links (National, Zone, International, Programs, Resources, etc.) for easy navigation.
3.	Online Joining Form
A user-friendly membership registration form with payment integration (if required).
4.	Chapter Sub-Pages
Separate pages for each chapter, including:
o	Leadership Team
o	Events & Projects
o	Gallery
o	Contact Information
5.	Mobile Application for Networking
A dedicated networking app where members can:
o	Connect with other members
o	Share business opportunities
o	Post updates
o	Send direct messages
6.	Event Publishing Section
A dynamic events page where upcoming and past events can be published with:
o	Event details
o	Registration links
o	Photos & reports
7.	Media Section (Online Repository)
A centralized digital media library containing:
o	Chapter magazines (E-magazines)
o	Newsletters
o	Press releases
o	Event reports
o	Photo & video archives

FRD functional requirement Document
Events rgiistsion:  A user can create event whch allow Him to get rigistation and payment link 

Login access educational Chapter /Corporate Chapter / Business Chapter 


Login and Logout funcation and rgisiation Funcation password forget passcode 


Resource 
•	Google Sites  Hosting
•	Gith hub Hosting 
•	https://www.notion.so/login 
•	Firebase 
•	Google Apps Script 
•	Deploy for Free – Render Docs 
•	Free Website Hosting - InfinityFree 

Navigation bar/menu
Home
About 
Events
Gallery 
Project 
Join us 
Contact us 

Media
Partners
Where We Are
What We Do

https://jci.cc/ 
https://jvc.jci.cc/login
https://member.jciindia.in/ 


Business Directory

CREATE TABLE businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255),
    category VARCHAR(100),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    logo VARCHAR(255),
    description TEXT,
    rating FLOAT
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    user_name VARCHAR(100),
    review TEXT,
    rating INT,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
);
