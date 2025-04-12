// server/seed.js

const mongoose = require('mongoose');
const Property = require('./models/Property'); // Ensure path is correct
require('dotenv').config();

// --- Placeholder Owner ID ---
// Replace this with your actual test user's _id from the 'users' collection
// if you want some seed properties to be editable by that user.
// Otherwise, leave it - this ensures seeded properties aren't owned by the logged-in test user.
const SEED_OWNER_ID = '67f7eeb73908c9f6f411a000'; // Example placeholder ID

// --- Extended Sample Property Data ---
const sampleProperties = [
  // --- Houses (For Sale) ---
  {
    owner: SEED_OWNER_ID,
    title: 'Charming Colonial with Updates',
    description: 'Classic colonial design with modern kitchen and bath updates. Hardwood floors throughout, large deck, and mature landscaping.',
    price: 580000,
    address: '10 Downing St', city: 'Westwood', state: 'MA', zipCode: '02090',
    propertyType: 'House', status: 'For Sale', bedrooms: 4, bathrooms: 2.5, squareFootage: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Modern Minimalist Design Home',
    description: 'Sleek and stylish home featuring clean lines, open concept living, high-end finishes, and smart home technology.',
    price: 890000,
    address: '200 Tech Drive', city: 'Austin', state: 'TX', zipCode: '78701',
    propertyType: 'House', status: 'For Sale', bedrooms: 3, bathrooms: 3, squareFootage: 2900,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Sprawling Ranch on Corner Lot',
    description: 'Single-level living at its best. Spacious rooms, large finished basement, two-car garage, and a beautifully maintained yard.',
    price: 420000,
    address: '55 Corner Ave', city: 'Springfield', state: 'IL', zipCode: '62704',
    propertyType: 'House', status: 'For Sale', bedrooms: 3, bathrooms: 2, squareFootage: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Lakefront Retreat with Dock',
    description: 'Enjoy stunning lake views from every room. Private dock included. Perfect year-round home or vacation getaway.',
    price: 750000,
    address: '1 Lakeview Path', city: 'Lakeland', state: 'FL', zipCode: '33801',
    propertyType: 'House', status: 'For Sale', bedrooms: 3, bathrooms: 3, squareFootage: 2600,
    imageUrl: 'https://images.unsplash.com/photo-1595511897340-9348dc55b936?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Affordable Starter Home',
    description: 'Great opportunity for first-time buyers or investors. Cozy 2-bedroom layout, needs some TLC but has great potential.',
    price: 185000,
    address: '30 Maple Ln', city: 'Columbus', state: 'OH', zipCode: '43215',
    propertyType: 'House', status: 'For Sale', bedrooms: 2, bathrooms: 1, squareFootage: 950,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },

  // --- Apartments (For Rent) ---
  {
    owner: SEED_OWNER_ID,
    title: 'Bright Studio in Great Location',
    description: 'Efficient studio layout with large windows. Located near public transport, shops, and restaurants. Laundry in building.',
    price: 1600,
    address: '50 Transit Plaza, Apt 3B', city: 'Brooklyn', state: 'NY', zipCode: '11201',
    propertyType: 'Apartment', status: 'For Rent', bedrooms: 0, bathrooms: 1, squareFootage: 450,
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Two Bedroom Loft-Style Apt',
    description: 'Spacious loft with high ceilings, exposed brick, and updated kitchen. Large master bedroom plus second bedroom/office.',
    price: 2800,
    address: '88 Warehouse Way, Unit 401', city: 'Chicago', state: 'IL', zipCode: '60607',
    propertyType: 'Apartment', status: 'For Rent', bedrooms: 2, bathrooms: 1.5, squareFootage: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Luxury Penthouse with Views',
    description: 'Top floor penthouse with panoramic city skyline views. Private balcony, gourmet kitchen, building amenities include pool and gym.',
    price: 5500,
    address: '1 Sky High Rd, PH 2', city: 'Los Angeles', state: 'CA', zipCode: '90012',
    propertyType: 'Apartment', status: 'For Rent', bedrooms: 2, bathrooms: 2, squareFootage: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1613553497126-a446242717fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Garden Level One Bedroom',
    description: 'Cozy one-bedroom apartment with private entrance and access to shared garden space. Pet friendly.',
    price: 1950,
    address: '15 Garden Walk, Apt G', city: 'Portland', state: 'OR', zipCode: '97201',
    propertyType: 'Apartment', status: 'For Rent', bedrooms: 1, bathrooms: 1, squareFootage: 650,
    imageUrl: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1034&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Furnished Corporate Rental',
    description: 'Fully furnished 1-bedroom apartment available for short or long term lease. Includes utilities and high-speed internet.',
    price: 2400,
    address: '300 Commerce St, #1205', city: 'Atlanta', state: 'GA', zipCode: '30303',
    propertyType: 'Apartment', status: 'For Rent', bedrooms: 1, bathrooms: 1, squareFootage: 700,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  },

  // --- Offices (For Rent) ---
  {
    owner: SEED_OWNER_ID,
    title: 'Small Private Office Suite',
    description: 'Perfect for a solopreneur or small team. Quiet building with shared amenities. Includes internet.',
    price: 800,
    address: '45 Professional Plaza, Suite 210', city: 'Denver', state: 'CO', zipCode: '80202',
    propertyType: 'Office', status: 'For Rent', squareFootage: 250, bathrooms: 0, // Assuming shared
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Full Floor Creative Office Space',
    description: 'Open-plan office space occupying an entire floor. High ceilings, large windows, kitchen area, and multiple private offices/meeting rooms.',
    price: 9500,
    address: '9 Creative Hub', city: 'San Francisco', state: 'CA', zipCode: '94107',
    propertyType: 'Office', status: 'For Rent', squareFootage: 4500, bathrooms: 4,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Executive Office with Reception',
    description: 'Prestigious office location with shared reception services, conference rooms, and mail handling. Furnished option available.',
    price: 1500,
    address: '1 Executive Tower, Floor 15', city: 'New York', state: 'NY', zipCode: '10001',
    propertyType: 'Office', status: 'For Rent', squareFootage: 400, bathrooms: 0, // Assuming shared
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Affordable Co-working Desk Space',
    description: 'Rent a dedicated desk in a vibrant co-working environment. Includes access to common areas, coffee, and printing.',
    price: 350,
    address: '1 Collaboration Corner', city: 'Seattle', state: 'WA', zipCode: '98101',
    propertyType: 'Office', status: 'For Rent', squareFootage: 50, // Per desk estimate
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },

  // --- Shops/Retail (For Rent) ---
  {
    owner: SEED_OWNER_ID,
    title: 'Charming Boutique Space',
    description: 'Quaint retail space on a picturesque street. Ideal for boutique clothing, gifts, or gallery. High ceilings and original details.',
    price: 2200,
    address: '25 Artisan Alley', city: 'Savannah', state: 'GA', zipCode: '31401',
    propertyType: 'Shop', status: 'For Rent', squareFootage: 700, bathrooms: 1,
    imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7e23ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Large Retail Storefront in Mall',
    description: 'Prime location inside a busy shopping mall. High visibility, excellent foot traffic, large open floor plan.',
    price: 8000,
    address: '100 Mall Drive, Space C-12', city: 'King of Prussia', state: 'PA', zipCode: '19406',
    propertyType: 'Shop', status: 'For Rent', squareFootage: 3500, bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Corner Cafe/Restaurant Location',
    description: 'Former cafe space on a busy corner. Includes some kitchen hookups and outdoor seating potential. Grease trap may be required.',
    price: 4500,
    address: '99 Corner Perk', city: 'Nashville', state: 'TN', zipCode: '37203',
    propertyType: 'Shop', status: 'For Rent', squareFootage: 1500, bathrooms: 2,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1147&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Small Pop-Up Shop Space',
    description: 'Affordable, temporary space perfect for pop-up shops or short-term retail needs. Basic amenities.',
    price: 900,
    address: '1 Temporary Spot', city: 'Miami', state: 'FL', zipCode: '33101',
    propertyType: 'Shop', status: 'For Rent', squareFootage: 300, bathrooms: 0, // Shared likely
    imageUrl: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },

  // --- Land (For Sale) ---
  {
    owner: SEED_OWNER_ID,
    title: 'Wooded Acreage with Stream',
    description: 'Beautiful 5-acre wooded lot featuring a small stream. Ideal for building a private home or cabin retreat.',
    price: 95000,
    city: 'Asheville', state: 'NC', zipCode: '28801',
    propertyType: 'Land', status: 'For Sale', squareFootage: 217800, // 5 acres
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80',
  },
  {
    owner: SEED_OWNER_ID,
    title: 'Commercial Development Lot',
    description: '2-acre lot zoned for commercial use on a major highway. High visibility and easy access. Utilities at street.',
    price: 350000,
    address: '500 Highway Access Rd', city: 'Dallas', state: 'TX', zipCode: '75201',
    propertyType: 'Land', status: 'For Sale', squareFootage: 87120, // 2 acres
    imageUrl: 'https://images.unsplash.com/photo-1560438718-1eec92542f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
      owner: SEED_OWNER_ID,
      title: 'Ocean View Building Lot',
      description: 'Rare opportunity to build your dream home with potential ocean views. Sloped lot in an established neighborhood.',
      price: 650000,
      city: 'Malibu', state: 'CA', zipCode: '90265',
      propertyType: 'Land', status: 'For Sale', squareFootage: 20000, // Approx half acre
      imageUrl: 'https://images.unsplash.com/photo-1606074066057-13fab6756b6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },

  // --- More Mixed Properties ---
  {
      owner: SEED_OWNER_ID,
      title: 'Downtown Historic Condo',
      description: 'Condo in a beautifully restored historic building. Original features combined with modern amenities.',
      price: 310000,
      address: '1 Historic Plaza, #305', city: 'Philadelphia', state: 'PA', zipCode: '19106',
      propertyType: 'Apartment', status: 'For Sale', bedrooms: 1, bathrooms: 1, squareFootage: 850,
      imageUrl: 'https://images.unsplash.com/photo-1560185007-c5ca96179656?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },
  {
      owner: SEED_OWNER_ID,
      title: 'Turnkey Restaurant Space',
      description: 'Fully equipped restaurant space ready for a new concept. Includes kitchen equipment, seating, and bar area.',
      price: 7500, // Rent per month
      address: '42 Foodie Row', city: 'New Orleans', state: 'LA', zipCode: '70130',
      propertyType: 'Shop', status: 'For Rent', squareFootage: 2800, bathrooms: 3,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
      owner: SEED_OWNER_ID,
      title: 'Mountain View Cabin',
      description: 'Secluded cabin with breathtaking mountain views. Perfect for nature lovers. Wood-burning stove and large deck.',
      price: 395000,
      city: 'Estes Park', state: 'CO', zipCode: '80517',
      propertyType: 'House', status: 'For Sale', bedrooms: 2, bathrooms: 1, squareFootage: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1518787419538-efe740035c47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
   {
      owner: SEED_OWNER_ID,
      title: 'Medical Office Suite Available',
      description: 'Professional office suite suitable for medical or dental practice. Includes reception area, exam rooms, and private office.',
      price: 4000, // Rent per month
      address: '1 Wellness Center, Suite 100', city: 'Phoenix', state: 'AZ', zipCode: '85001',
      propertyType: 'Office', status: 'For Rent', squareFootage: 1800, bathrooms: 2,
      imageUrl: 'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
   {
      owner: SEED_OWNER_ID,
      title: 'Fixer-Upper with Potential',
      description: 'Handyman special! This property needs significant work but is priced accordingly. Great bones in a desirable area.',
      price: 120000,
      address: '99 Opportunity Knocks', city: 'Detroit', state: 'MI', zipCode: '48201',
      propertyType: 'House', status: 'For Sale', bedrooms: 3, bathrooms: 1, squareFootage: 1300,
      imageUrl: 'https://images.unsplash.com/photo-1577703890310-34f3e78dac7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },
   {
      owner: SEED_OWNER_ID,
      title: 'Shared Artist Studio Space',
      description: 'Rentable space within a larger shared artist studio. Good natural light, access to shared tools and sink.',
      price: 450, // Rent per month
      address: '10 Art Collective Lofts', city: 'Oakland', state: 'CA', zipCode: '94612',
      propertyType: 'Office', status: 'For Rent', squareFootage: 150, // Estimated personal space
      imageUrl: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
    {
      owner: SEED_OWNER_ID,
      title: 'Pet Grooming Salon Setup',
      description: 'Former pet grooming location already set up with washing stations and separate rooms. Good visibility.',
      price: 1800, // Rent per month
      address: '12 Pampered Pet Way', city: 'San Diego', state: 'CA', zipCode: '92101',
      propertyType: 'Shop', status: 'For Rent', squareFootage: 800, bathrooms: 1,
      imageUrl: 'https://images.unsplash.com/photo-1599443012990-134c7635c9f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },
    {
      owner: SEED_OWNER_ID,
      title: '3-Bedroom Townhouse End Unit',
      description: 'Spacious townhouse with extra windows being an end unit. Small patio area, community pool access.',
      price: 2600, // Rent per month
      address: '7 End Unit Circle', city: 'Charlotte', state: 'NC', zipCode: '28202',
      propertyType: 'House', status: 'For Rent', bedrooms: 3, bathrooms: 2.5, squareFootage: 1650,
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1175&q=80',
  },
  {
      owner: SEED_OWNER_ID,
      title: 'Investment Duplex Property',
      description: 'Two-unit duplex, live in one and rent the other, or rent both. Separate entrances and utilities.',
      price: 375000,
      address: '14 & 16 Sideby Side St', city: 'Kansas City', state: 'MO', zipCode: '64108',
      propertyType: 'House', status: 'For Sale', bedrooms: 4, bathrooms: 2, squareFootage: 1900, // Total approx
      imageUrl: 'https://images.unsplash.com/photo-1591790198412- Smythe Ave, #6', city: 'Boston', state: 'MA', zipCode: '02115',
      propertyType: 'Apartment', status: 'For Rent', bedrooms: 1, bathrooms: 1, squareFootage: 750,
      imageUrl: 'https://images.unsplash.com/photo-1529408686214-b48b8532f72c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
  {
      owner: SEED_OWNER_ID,
      title: 'Modern Glass Wall Office',
      description: 'Impressive office space with floor-to-ceiling glass walls, great natural light, and modern amenities. Conference room access.',
      price: 6000, // Rent per month
      address: '35 Crystal Plaza', city: 'Chicago', state: 'IL', zipCode: '60606',
      propertyType: 'Office', status: 'For Rent', squareFootage: 2500, bathrooms: 2,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },
   {
      owner: SEED_OWNER_ID,
      title: 'Small Town Convenience Store',
      description: 'Established convenience store location available for lease. Includes shelving and counter space. Inventory negotiable.',
      price: 1500, // Rent per month
      address: '1 Main Corner', city: 'Smallville', state: 'KS', zipCode: '66002',
      propertyType: 'Shop', status: 'For Rent', squareFootage: 1200, bathrooms: 1,
      imageUrl: 'https://images.unsplash.com/photo-1580913428023-02c695666d61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },
   {
      owner: SEED_OWNER_ID,
      title: 'Farm Land - 50 Acres',
      description: 'Large parcel of flat, tillable farm land. Suitable for various crops. Currently leased month-to-month.',
      price: 450000,
      city: 'Farmington', state: 'IA', zipCode: '52626',
      propertyType: 'Land', status: 'For Sale', squareFootage: 2178000, // 50 acres
      imageUrl: 'https://images.unsplash.com/photo-1464979681340-35b1817d7534?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
  },

];

// --- Database Connection and Seeding Function ---
const seedDB = async () => {
    if (!process.env.MONGODB_URI) {
        console.error("Error: MONGODB_URI not found in .env file. Seeding cannot proceed.");
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        console.log(`Using placeholder Owner ID for seeded properties: ${SEED_OWNER_ID}`);
        console.log('If needed, replace this ID in seed.js with your actual test user ID to test edit/delete on seeded data.');

        console.log('Deleting existing properties...');
        const deleteResult = await Property.deleteMany({});
        console.log(`Existing properties deleted (${deleteResult.deletedCount} documents).`);

        console.log('Inserting sample properties...');
        const inserted = await Property.insertMany(sampleProperties);
        console.log(`Sample properties inserted successfully (${inserted.length} documents)!`);

    } catch (err) {
        console.error('Error during seeding process:', err); // Log the full error
        console.error('Error Message:', err.message);
    } finally {
        try {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        } catch (closeErr) {
            console.error('Error closing MongoDB connection:', closeErr.message);
        }
        // process.exit(); // Exit only if needed, sometimes helpful to keep terminal open
    }
};

// --- Execute the Seeding Function ---
seedDB();