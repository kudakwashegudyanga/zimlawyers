require('dotenv').config();
const mongoose = require('mongoose');
const DraftCase = require('./server/models/DraftCase');
const User = require('./server/models/User');

async function seedDrafts() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Please create admin user first.');
      return;
    }

    console.log('Using admin user:', adminUser.email);

    // Clear existing drafts
    await DraftCase.deleteMany({});
    console.log('Cleared existing drafts');

    // Sample draft cases data
    const sampleDrafts = [
      {
        title: 'Murder Defense - State v. John Doe',
        description: `Client: John Doe
Case Number: CRB-2024-015
Date of Arrest: January 15, 2024
Charges: Murder (Section 47 of Criminal Law)

FACTS:
- Client was arrested on January 15, 2024, for alleged murder of James Smith
- Incident occurred on January 14, 2024, at approximately 10:30 PM
- Location: Downtown Harare, 4th Street residence
- Weapon allegedly used: Kitchen knife
- Victim died from multiple stab wounds
- Client claims self-defense
- Witnesses: Mary Smith (neighbor), Robert Johnson (passerby)

EVIDENCE TO COLLECT:
1. Witness statements from Mary Smith and Robert Johnson
2. CCTV footage from nearby establishment
3. Forensic report from pathologist
4. Weapon analysis
5. Client's mobile phone records
6. 911 call recordings

LEGAL ISSUES:
- Self-defense claim under Zimbabwe law
- Excessive force by police during arrest
- Miranda rights violations
- Chain of custody issues for evidence

NEXT STEPS:
1. File bail application
2. Request forensic evidence review
3. Prepare preliminary hearing
4. Interview all witnesses
5. File motion to dismiss if evidence insufficient`,
        category: 'Murder',
        status: 'Draft',
        createdBy: adminUser._id
      },
      {
        title: 'Commercial Fraud Investigation',
        description: `Client: ABC Manufacturing Company
Case Number: FRC-2024-008
Date: February 1, 2024
Type: Commercial Fraud Investigation

CLIENT INFORMATION:
- ABC Manufacturing is a medium-sized textile company
- Annual revenue: $2.5 million USD
- Employees: 45 staff members
- Established: 2010

INCIDENT DETAILS:
- Discovered financial irregularities in Q4 2023
- Estimated loss: $450,000 USD
- Period of fraud: January 2022 - December 2023
- Suspected perpetrator: Internal finance manager
- Method: Fictitious invoices and ghost payments

INVESTIGATION SCOPE:
1. Forensic accounting analysis
2. Review of all financial transactions (2022-2023)
3. Interview with finance department staff
4. Examination of vendor contracts and payments
5. Background check on suspected employee
6. Recovery asset tracing

LEGAL CONSIDERATIONS:
- Criminal charges under Companies Act
- Civil recovery action against former employee
- Potential insurance claims
- Employment law compliance issues
- Evidence preservation requirements

TIMELINE:
- Week 1: Complete forensic analysis
- Week 2: File criminal complaint
- Week 3: Initiate civil proceedings
- Week 4: Asset recovery efforts`,
        category: 'Fraud',
        status: 'In Progress',
        createdBy: adminUser._id
      },
      {
        title: 'Divorce Settlement Negotiation',
        description: `Client: Sarah Thompson
Case Number: DIV-2024-012
Date: February 10, 2024
Type: Divorce Settlement Negotiation

PARTIES:
- Client: Sarah Thompson (Petitioner)
- Spouse: Michael Thompson (Respondent)
- Married: June 15, 2015
- Separated: December 1, 2023
- Children: 2 minor children (ages 8 and 12)

ASSETS TO DIVIDE:
- Marital home: $250,000 value (joint ownership)
- Family vehicle: $35,000 value (joint ownership)
- Bank accounts: $45,000 total (joint savings)
- Retirement accounts: $120,000 total (joint)
- Michael's business: $180,000 value (sole ownership)

KEY ISSUES:
- Custody arrangements for minor children
- Spousal maintenance calculation
- Property division (equitable distribution)
- Child support obligations
- Tax implications of settlement

CLIENT OBJECTIVES:
- Primary custody of both children
- Remain in family home with children
- Fair division of marital assets
- Minimal spousal maintenance (Sarah is employed)
- Child support from Michael based on income

NEGOTIATION STRATEGY:
1. Emphasize children's best interests
2. Highlight Sarah's financial independence
3. Propose shared custody arrangement
4. Seek 60/40 asset split in Sarah's favor
5. Minimal child support due to Sarah's income

NEXT ACTIONS:
1. Prepare settlement proposal
2. File custody application
3. Calculate child support guidelines
4. Prepare property settlement agreement
5. Schedule mediation session`,
        category: 'Divorce',
        status: 'Draft',
        createdBy: adminUser._id
      },
      {
        title: 'Landlord-Tenant Dispute - Commercial Property',
        description: `Client: Harare Properties Ltd
Case Number: LD-2024-003
Date: January 20, 2024
Type: Commercial Lease Dispute

PARTIES:
- Client: Harare Properties Ltd (Landlord)
- Opposing: Retail Solutions Inc (Tenant)
- Property: Commercial unit at Samora Machel Ave, Harare
- Lease term: 5 years (2019-2024)
- Monthly rent: $5,000 USD

DISPUTE DETAILS:
- Tenant stopped paying rent in October 2023
- Outstanding rent: $25,000 (5 months)
- Lease violation: Subletting without permission
- Property damage reported: $8,000
- Tenant claims: Landlord failed to maintain premises

CLIENT POSITION:
- All rent payments made until October 2023
- Property properly maintained throughout lease term
- Documented all maintenance requests
- Tenant breached lease terms
- Seeking eviction and arrears payment

LEGAL ISSUES:
- Commercial lease law under Zimbabwe's Commercial Premises Act
- Eviction procedures and requirements
- Arrears recovery process
- Property damage compensation claims
- Lease termination clauses

EVIDENCE TO PRESENT:
1. Lease agreement (original and all amendments)
2. Bank statements showing rent payments
3. Maintenance request logs and responses
4. Property inspection reports
5. Subletting evidence and communications
6. Legal notices sent to tenant

STRATEGY:
1. File eviction proceedings
2. Claim all outstanding rent and damages
3. Seek court order for tenant removal
4. Pursue bank guarantees for commercial lease
5. Consider injunction against further subletting

OUTCOME OBJECTIVES:
- Recover all outstanding rent ($25,000)
- Recover property damages ($8,000)
- Obtain possession of property
- Terminate commercial lease
- Potential new tenant placement`,
        category: 'Land Disputes',
        status: 'Draft',
        createdBy: adminUser._id
      }
    ];

    // Insert drafts
    const drafts = await DraftCase.insertMany(sampleDrafts);
    console.log(`Created ${drafts.length} sample draft cases`);

    // Display created drafts
    console.log('\n📋 Created Draft Cases:');
    drafts.forEach((draft, index) => {
      console.log(`${index + 1}. ${draft.title} (${draft.category}) - ${draft.status}`);
    });

    console.log('\n✅ Draft cases seeded successfully!');
    console.log('\n🎯 You can now access draft cases via dashboard.');

  } catch (error) {
    console.error('Error seeding drafts:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDrafts();
