require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./server/models/User');
const Document = require('./server/models/Document');
const Case = require('./server/models/Case');

// Sample data
const sampleData = {
  users: [
    {
      fullName: 'Admin User',
      email: 'admin@zimlayers.com',
      role: 'ADMIN',
      isVerified: true,
    },
    {
      fullName: 'John Lawyer',
      email: 'lawyer@zimlayers.com',
      role: 'LAWYER',
      isVerified: true,
    },
    {
      fullName: 'Sarah Attorney',
      email: 'sarah@zimlayers.com',
      role: 'LAWYER',
      isVerified: true,
    },
  ],
  
  documents: [
    {
      title: 'State v. Johnson - Murder Defense',
      content: `# STATE V. JOHNSON - MURDER DEFENSE

## CASE SUMMARY
Client is charged with first-degree murder in the death of John Doe. The prosecution alleges premeditated killing, but we have strong evidence supporting self-defense.

## KEY POINTS
- Client has no prior criminal record
- Multiple witnesses support self-defense claim
- Victim had history of violence against client
- Forensic evidence supports client's version

## NEXT STEPS
1. File motion to dismiss based on self-defense
2. Prepare witness testimony
3. Gather additional forensic evidence
4. Consider plea bargain options

## COURT DATES
- Preliminary Hearing: March 15, 2026
- Status Conference: March 22, 2026
- Trial (if needed): April 10, 2026`,
      visibility: 'PRIVATE',
      category: 'Murder',
    },
    {
      title: 'Smith Corp Contract Dispute',
      content: `# SMITH CORP CONTRACT DISPUTE

## CLIENT INFORMATION
Smith Corporation, a manufacturing company, is in dispute with XYZ Supplies over breach of supply contract.

## DISPUTE DETAILS
- Contract Value: $500,000
- Breach Date: January 15, 2026
- Issue: Failure to deliver raw materials on time
- Damages: Production delays and lost revenue

## LEGAL POSITION
- Clear breach of contract terms
- Documented losses due to delays
- Strong evidence of contractual obligations

## DEMANDS
1. Full refund of advance payment
2. Compensation for lost revenue
3. Coverage of additional costs incurred
4. Termination of contract with penalty

## TIMELINE
- Demand letter sent: February 1, 2026
- Response received: February 10, 2026
- Mediation scheduled: March 1, 2026
- Court filing deadline: March 15, 2026`,
      visibility: 'PRIVATE',
      category: 'Corporate Law',
    },
    {
      title: 'Doe v. Doe - Divorce Proceedings',
      content: `# DOE V. DOE - DIVORCE PROCEEDINGS

## CLIENT INFORMATION
Representing Jane Doe in divorce proceedings from John Doe after 12 years of marriage.

## MARRIAGE DETAILS
- Marriage Date: June 15, 2014
- Separation Date: December 1, 2025
- Children: 2 (ages 8 and 10)
- Marriage Duration: 11.5 years

## ASSETS TO DIVIDE
### Real Estate
- Family home: $350,000 equity
- Vacation property: $150,000 equity

### Financial Assets
- Joint savings: $85,000
- Retirement accounts: $420,000
- Investment portfolio: $125,000

### Business Interests
- Client's business: 100% ownership, valued at $200,000

## CHILD CUSTODY
- Client seeks primary physical custody
- Father wants joint custody
- Children prefer to stay with mother
- Father has demanding work schedule

## SUPPORT ISSUES
- Child support: Guidelines suggest $1,800/month
- Spousal support: Client requests temporary support for 2 years
- Duration: Until client completes degree program

## PROPOSED SETTLEMENT
- Client keeps family home, assumes mortgage
- Client receives 60% of financial assets
- Client keeps business interest
- Joint custody with children primarily with client
- Father pays guideline child support
- No spousal support requested

## NEXT STEPS
1. Serve divorce papers
2. Financial disclosure exchange
3. Custody evaluation
4. Settlement conference
5. Trial if settlement fails`,
      visibility: 'PRIVATE',
      category: 'Divorce',
    },
    {
      title: 'Brown v. Green - Land Boundary Dispute',
      content: `# BROWN V. GREEN - LAND BOUNDARY DISPUTE

## CLIENT INFORMATION
Representing property owner Brown in boundary dispute with neighboring property owner Green.

## PROPERTY DETAILS
- Client Property: 123 Main Street, 2.5 acres
- Disputed Area: 0.25 acres along southern boundary
- Client Ownership: Since 1998
- Tax Records: Consistent with client's claim

## DISPUTE HISTORY
- Initial Issue: Green built fence 15 feet onto client's property
- Date of Issue: Summer 2025
- Previous Attempts: Informal resolution failed
- Current Status: Formal legal action initiated

## EVIDENCE
### Survey Evidence
- Original 1998 survey: Clear boundary markers
- 2025 updated survey: Confirms original boundaries
- GPS measurements: Support client's position

### Historical Evidence
- Deed records: Clear description of boundaries
- Tax maps: Consistent with client's claim
- Historical photos: Show original fence line

### Usage Evidence
- Client has maintained disputed area for 27 years
- No previous disputes with neighbors
- Property taxes paid on entire area

## LEGAL THEORY
1. Adverse possession: Client has open, notorious possession for 27 years
2. Boundary by agreement: Historical acceptance of boundaries
3. Easement by prescription: Long-term usage rights

## DEMANDS
1. Removal of encroaching fence
2. Deed correction to reflect proper boundaries
3. Compensation for legal fees
4. Damages for loss of use

## OPPOSITION POSITION
- Green claims historical use of area
- Cites verbal agreement from previous owner
- Claims adverse possession rights
- Seeks to keep current fence location

## COURT PROCEEDINGS
- Complaint filed: February 15, 2026
- Response due: March 15, 2026
- Mediation required: April 1, 2026
- Trial date: June 15, 2026

## SETTLEMENT OPTIONS
1. Boundary adjustment with compensation
2. Easement agreement
3. Purchase/sale of disputed strip
4. Court-determined boundary

## RECOMMENDATION
Strong case for client based on long-term possession and clear documentation. Recommend mediation first, but prepare for trial if needed.`,
      visibility: 'PRIVATE',
      category: 'Land Disputes',
    },
    {
      title: 'People v. Martinez - Assault Case',
      content: `# PEOPLE V. MARTINEZ - ASSAULT CASE

## CLIENT INFORMATION
Representing defendant charged with aggravated assault following bar altercation.

## CHARGES
- Count 1: Aggravated assault
- Count 2: Battery with serious bodily injury
- Count 3: Disorderly conduct

## INCIDENT DETAILS
- Date: February 10, 2026
- Location: The Local Bar, downtown
- Time: Approximately 11:30 PM
- Involved Parties: Client and alleged victim

## PROSECUTION'S CASE
- Claims client initiated fight
- Alleges client used bottle as weapon
- Victim suffered broken jaw and concussion
- Several eyewitnesses for prosecution

## DEFENSE THEORY
1. Self-defense: Client was attacked first
2. Defense of others: Protecting friend
3. Lack of intent: No premeditation
4. Excessive force by victim initially

## EVIDENCE
### Prosecution Evidence
- Bar video footage (inconclusive)
- Victim medical records
- Eyewitness testimony
- Police report

### Defense Evidence
- Client's medical records (injuries)
- Defense eyewitnesses
- Character witnesses
- Prior threats from victim

## WITNESSES
### Defense Witnesses
1. Jane Smith - Saw victim attack client first
2. Mike Johnson - Client's friend, confirms self-defense
3. Dr. Sarah Brown - Character witness

### Prosecution Witnesses
1. Bartender - Saw client throw bottle
2. Victim's friends - Support prosecution version
3. Police officers - Responded to scene

## LEGAL ISSUES
- Self-defense justification
- Reasonable force standard
- Witness credibility issues
- Video interpretation

## POSSIBLE OUTCOMES
1. Dismissal (if self-defense accepted)
2. Reduced charges (misdemeanor)
3. Plea bargain (probation)
4. Conviction (if self-defense rejected)

## STRATEGY
1. File self-defense motion
2. Challenge witness credibility
3. Present strong character evidence
4. Consider plea negotiations

## COURT DATES
- Arraignment: February 20, 2026
- Pre-trial conference: March 10, 2026
- Motion hearing: March 20, 2026
- Trial: April 5, 2026

## RECOMMENDATION
Strong self-defense case with supporting witnesses. Recommend proceeding to trial unless favorable plea offer received.`,
      visibility: 'PRIVATE',
      category: 'Assault',
    },
    {
      title: 'Investment Fraud - ABC Capital Case',
      content: `# INVESTMENT FRAUD - ABC CAPITAL CASE

## CLIENT INFORMATION
Representing 15 investors defrauded by ABC Capital in Ponzi scheme.

## FRAUD DETAILS
- Total Loss: $2.5 million across all investors
- Client Loss: $150,000
- Investment Period: 2023-2025
- Fraud Type: Ponzi scheme with fake returns

## SCHEME OPERATION
- Promised 15% annual returns
- Used new investor money to pay old investors
- Created fake account statements
- Lied about investment strategy

## EVIDENCE OF FRAUD
### Documentary Evidence
- False prospectus materials
- Fake account statements
- Internal emails showing scheme
- Bank records showing money movement

### Witness Evidence
- Former employees willing to testify
- Financial experts confirming fraud
- Other investors as witnesses

### Digital Evidence
- Website with false claims
- Social media promotions
- Email marketing materials

## LEGAL CLAIMS
1. Securities fraud
2. Wire fraud
3. Mail fraud
4. Breach of fiduciary duty
5. Civil RICO

## DAMAGES SOUGHT
- Actual losses: $150,000
- Punitive damages: $450,000
- Legal fees: $50,000
- Interest and costs: $25,000
- Total: $675,000

## DEFENDANTS
1. ABC Capital (corporation)
2. John Smith (CEO)
3. Jane Doe (CFO)
4. Various sales representatives

## ASSETS RECOVERY
- Bank accounts: $500,000 frozen
- Real estate: $800,000 in properties
- Vehicles: $200,000 in luxury cars
- Offshore accounts: Unknown amounts

## CRIMINAL PROCEEDINGS
- FBI investigation ongoing
- SEC enforcement action
- Criminal charges filed
- Asset freeze in place

## CIVIL PROCEEDINGS
- Class action certification pending
- Discovery underway
- Mediation scheduled
- Trial date: September 2026

## SETTLEMENT NEGOTIATIONS
- Defendants offering 40% recovery
- Plaintiffs demanding 80%
- Insurance coverage: $2 million policy
- Timeline: Settlement by June 2026

## RECOVERY PROSPECTS
- Criminal restitution likely
- Civil settlement probable
- Asset liquidation ongoing
- Total recovery: 60-70% possible

## NEXT STEPS
1. Complete discovery process
2. Expert witness reports
3. Settlement conference
4. Trial preparation if needed

## CLIENT COMMUNICATION
- Monthly updates provided
- Recovery timeline explained
- Options clearly outlined
- Costs and fees discussed`,
      visibility: 'PRIVATE',
      category: 'Fraud',
    },
    {
      title: 'Retail Theft - Store v. Employee',
      content: `# RETAIL THEFT - STORE V. EMPLOYEE

## CLIENT INFORMATION
Representing retail store in employee theft case.

## THEFT DETAILS
- Employee: Former shift supervisor
- Duration: 6 months (July - December 2025)
- Total Loss: $45,000 in merchandise
- Method: Systematic inventory manipulation

## EVIDENCE
### Surveillance
- Video footage of suspicious activity
- Access logs showing after-hours presence
- Inventory system anomalies

### Financial Records
- Discrepancies in inventory counts
- Missing high-value items tracked
- Sales return patterns analyzed

### Witness Statements
- Coworker observations
- Customer complaints about shortages
- Security guard reports

## LEGAL CLAIMS
1. Theft/larceny
2. Embezzlement
3. Breach of fiduciary duty
4. Conversion

## DAMAGES
- Direct losses: $45,000
- Investigation costs: $5,000
- Legal fees: $8,000
- Total: $58,000

## DEFENSE ANTICIPATED
- Claims of authorization
- Mistake/accident arguments
- Lack of intent defenses

## COURT PROCEEDINGS
- Complaint filed: January 15, 2026
- Response due: February 15, 2026
- Pre-trial conference: March 1, 2026
- Trial date: April 20, 2026

## SETTLEMENT OPTIONS
- Full restitution with payment plan
- Partial settlement with confession
- Criminal charges in addition to civil

## RECOMMENDATION
Strong evidence case. Recommend pursuing full recovery and criminal charges.`,
      visibility: 'PRIVATE',
      category: 'Theft',
    },
  ],
  
  cases: [
    {
      title: 'People v. Thompson - Murder Defense',
      description: 'Client accused of first-degree murder in workplace shooting. Claiming self-defense due to prior threats from victim.',
      category: 'Murder',
      status: 'OPEN',
      clientName: 'Robert Thompson',
      lawyer: null, // Will be set after creating users
    },
    {
      title: 'XYZ Corp v. Supplier - Contract Dispute',
      description: 'Supplier failed to deliver critical components on time, causing production delays and financial losses.',
      category: 'Corporate Law',
      status: 'OPEN',
      clientName: 'XYZ Corporation',
      lawyer: null, // Will be set after creating users
    },
    {
      title: 'Johnson v. Johnson - High-Asset Divorce',
      description: 'Divorce proceeding involving multiple properties, business interests, and child custody disputes.',
      category: 'Divorce',
      status: 'OPEN',
      clientName: 'Jane Johnson',
      lawyer: null, // Will be set after creating users
    },
    {
      title: 'Wilson v. Neighbor - Property Line Dispute',
      description: 'Neighbor built fence 10 feet onto client\'s property. Need to resolve boundary issues and seek removal.',
      category: 'Land Disputes',
      status: 'OPEN',
      clientName: 'Michael Wilson',
      lawyer: null, // Will be set after creating users
    },
    {
      title: 'State v. Garcia - Assault with Weapon',
      description: 'Client charged with assault with deadly weapon. Claims self-defense during home invasion.',
      category: 'Assault',
      status: 'OPEN',
      clientName: 'Maria Garcia',
      lawyer: null, // Will be set after creating users
    },
    {
      title: 'Investors v. Fake Investment Company',
      description: 'Multiple investors defrauded in Ponzi scheme. Need to recover losses and pursue criminal charges.',
      category: 'Fraud',
      status: 'OPEN',
      clientName: 'Multiple Investors',
      lawyer: null, // Will be set after creating users
    },
    {
      title: 'Retail Theft - Chain Store v. Employee',
      description: 'Employee accused of stealing merchandise over 6-month period. Internal investigation evidence.',
      category: 'Theft',
      status: 'OPEN',
      clientName: 'Retail Chain Inc.',
      lawyer: null, // Will be set after creating users
    },
    {
      title: 'Estate Planning - Williams Family',
      description: 'Comprehensive estate planning including wills, trusts, and power of attorney documents.',
      category: 'Other',
      status: 'CLOSED',
      clientName: 'Williams Family',
      lawyer: null, // Will be set after creating users
    },
  ],
};

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Document.deleteMany({});
    await Case.deleteMany({});
    console.log('Cleared existing data');

    // Create users with hashed passwords
    const users = [];
    for (const userData of sampleData.users) {
      const hashedPassword = await bcrypt.hash(userData.email === 'admin@zimlayers.com' ? 'admin123' : 'lawyer123', 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        createdAt: new Date(),
      });
      const savedUser = await user.save();
      users.push(savedUser);
      console.log(`Created user: ${userData.email}`);
    }

    // Create documents
    const documents = [];
    for (const docData of sampleData.documents) {
      const document = new Document({
        ...docData,
        createdBy: users[1]._id, // Lawyer user
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedDocument = await document.save();
      documents.push(savedDocument);
      console.log(`Created document: ${docData.title}`);
    }

    // Create cases
    const cases = [];
    for (let i = 0; i < sampleData.cases.length; i++) {
      const caseData = sampleData.cases[i];
      // Assign lawyers alternately between the two lawyer users
      caseData.lawyer = i % 2 === 0 ? users[1]._id : users[2]._id;
      
      const case_ = new Case({
        ...caseData,
        createdBy: caseData.lawyer,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const savedCase = await case_.save();
      cases.push(savedCase);
      console.log(`Created case: ${caseData.title}`);
    }

    console.log('\nDatabase population completed successfully!');
    console.log('\nSummary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Documents: ${documents.length}`);
    console.log(`- Cases: ${cases.length}`);

    console.log('\nTest Accounts:');
    console.log('Admin: admin@zimlayers.com / admin123');
    console.log('Lawyer: lawyer@zimlayers.com / lawyer123');
    console.log('Sarah: sarah@zimlayers.com / lawyer123');

  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
