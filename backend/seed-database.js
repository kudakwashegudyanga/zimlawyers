require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');
const Document = require('./server/models/Document');
const Case = require('./server/models/Case');

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Test user not found. Please create test user first.');
      return;
    }

    console.log('Found test user:', testUser.email);

    // Clear existing data for this user
    await Document.deleteMany({ createdBy: testUser._id });
    await Case.deleteMany({ userId: testUser._id });
    console.log('Cleared existing data');

    // Create sample documents
    const sampleDocuments = [
      {
        title: 'Employment Contract Template',
        content: `# Employment Contract Template

## Parties
**Employer:** [Company Name]
**Employee:** [Employee Name]

## Terms
1. **Position:** [Job Title]
2. **Start Date:** [Date]
3. **Salary:** [Amount]
4. **Working Hours:** [Hours]

## Responsibilities
[List of job responsibilities]

## Termination
[Termination clauses]

---
*This template is provided for informational purposes only. Consult with legal counsel for specific situations.*`,
        category: 'Employment',
        visibility: 'PRIVATE',
        createdBy: testUser._id
      },
      {
        title: 'Lease Agreement Template',
        content: `# Residential Lease Agreement

## Parties
**Landlord:** [Landlord Name]
**Tenant:** [Tenant Name]
**Property:** [Property Address]

## Lease Terms
1. **Rent:** [Amount] per month
2. **Security Deposit:** [Amount]
3. **Lease Period:** [Start Date] to [End Date]
4. **Utilities:** [Who pays what]

## Maintenance
[Maintenance responsibilities]

---
*This template is provided for informational purposes only. Consult with legal counsel for specific situations.*`,
        category: 'Property',
        visibility: 'PUBLIC',
        createdBy: testUser._id
      },
      {
        title: 'Partnership Agreement',
        content: `# Partnership Agreement

## Partners
1. **Partner 1:** [Name and Address]
2. **Partner 2:** [Name and Address]

## Business
**Business Name:** [Partnership Name]
**Business Purpose:** [Description]

## Capital Contributions
- Partner 1: [Amount]
- Partner 2: [Amount]

## Profit Sharing
[Profit distribution details]

## Dissolution
[Partnership dissolution terms]

---
*This template is provided for informational purposes only. Consult with legal counsel for specific situations.*`,
        category: 'Business',
        visibility: 'PRIVATE',
        createdBy: testUser._id
      }
    ];

    // Create sample cases
    const sampleCases = [
      {
        title: 'Smith vs. Johnson - Property Dispute',
        description: 'Residential property boundary dispute between neighboring properties. Client claims encroachment of 2 meters onto their property.',
        clientName: 'John Smith',
        status: 'OPEN',
        lawyer: testUser._id
      },
      {
        title: 'ABC Corp - Employment Matter',
        description: 'Wrongful termination claim by former employee. Alleging dismissal without proper cause and seeking compensation.',
        clientName: 'ABC Corporation',
        status: 'OPEN',
        lawyer: testUser._id
      },
      {
        title: 'Doe Family - Estate Planning',
        description: 'Comprehensive estate planning including will preparation, trust establishment, and power of attorney documents.',
        clientName: 'Jane Doe',
        status: 'CLOSED',
        lawyer: testUser._id
      }
    ];

    // Insert documents
    const documents = await Document.insertMany(sampleDocuments);
    console.log(`Created ${documents.length} sample documents`);

    // Insert cases
    const cases = await Case.insertMany(sampleCases);
    console.log(`Created ${cases.length} sample cases`);

    // Create some shared templates (without createdBy)
    await Document.deleteMany({ createdBy: null });
    const sharedTemplates = [
      {
        title: 'General Power of Attorney',
        content: `# General Power of Attorney

**Principal:** [Principal Name]
**Attorney-in-Fact:** [Attorney Name]

## Granted Powers
The Principal hereby appoints the Attorney-in-Fact to act on their behalf for all matters including:
- Financial transactions
- Legal proceedings
- Property management
- Business operations

## Limitations
[Any specific limitations]

## Duration
This power of attorney is effective immediately and remains in effect until revoked.

---
*This template is provided for informational purposes only. Consult with legal counsel for specific situations.*`,
        category: 'Legal Forms',
        visibility: 'PUBLIC',
        createdBy: testUser._id // Use test user as creator for shared templates
      },
      {
        title: 'Non-Disclosure Agreement',
        content: `# Non-Disclosure Agreement

## Parties
**Disclosing Party:** [Company Name]
**Receiving Party:** [Recipient Name]

## Confidential Information
The Disclosing Party may share confidential information including:
- Business plans
- Financial data
- Technical specifications
- Customer information

## Obligations
The Receiving Party agrees to:
1. Keep information confidential
2. Use information only for specified purposes
3. Not disclose to third parties
4. Return information upon request

## Term
This agreement remains in effect for [Time Period].

---
*This template is provided for informational purposes only. Consult with legal counsel for specific situations.*`,
        category: 'Business',
        visibility: 'PUBLIC',
        createdBy: testUser._id // Use test user as creator for shared templates
      }
    ];

    const templates = await Document.insertMany(sharedTemplates);
    console.log(`Created ${templates.length} shared templates`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Documents: ${documents.length}`);
    console.log(`- Cases: ${cases.length}`);
    console.log(`- Shared Templates: ${templates.length}`);
    console.log('\n🎯 You can now login and test the dashboard!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
