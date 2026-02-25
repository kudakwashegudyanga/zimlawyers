require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('./server/models/Template');

async function seedTemplates() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const User = require('./server/models/User');
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.log('Admin user not found. Please create admin user first.');
      return;
    }

    console.log('Using admin user:', adminUser.email);

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Sample templates data
    const sampleTemplates = [
      {
        title: 'Divorce Petition Template',
        category: 'Divorce',
        content: `IN THE MAGISTRATE COURT OF [COURT NAME]
DIVORCE CAUSE NO. [CASE NUMBER]

BETWEEN
[PETITIONER'S NAME]
        ...PETITIONER

AND
[RESPONDENT'S NAME]
        ...RESPONDENT

PETITION FOR DIVORCE

THE PETITIONER MOST RESPECTFULLY SHOWS THAT:

1. The Petitioner is [NATIONALITY] by nationality, aged [AGE] years, residing at [ADDRESS].

2. The Respondent is [NATIONALITY] by nationality, aged [AGE] years, residing at [ADDRESS].

3. The parties were lawfully married on [DATE OF MARRIAGE] at [PLACE OF MARRIAGE] under [MARRIAGE ACT].

4. There are [NUMBER] children born of the marriage:
   a) [CHILD 1 NAME] - born [DATE]
   b) [CHILD 2 NAME] - born [DATE]

5. The marriage has irretrievably broken down due to:
   a) [REASON 1 - e.g., irreconcilable differences]
   b) [REASON 2 - e.g., separation for more than 2 years]

6. The Petitioner seeks the following relief:
   a) Dissolution of marriage
   b) Custody of children
   c) Maintenance for children
   d) Division of matrimonial property

DATED THIS [DAY] DAY OF [MONTH], [YEAR]

_________________________
PETITIONER`,
        createdBy: adminUser._id
      },
      {
        title: 'Employment Contract Template',
        category: 'Corporate Law',
        content: `EMPLOYMENT CONTRACT

This Employment Contract is made on [DATE] between:

EMPLOYER:
[COMPANY NAME]
[COMPANY ADDRESS]
[COMPANY REGISTRATION NUMBER]

AND

EMPLOYEE:
[EMPLOYEE NAME]
[EMPLOYEE ADDRESS]
[EMPLOYEE ID NUMBER]

1. POSITION AND DUTIES
   The Employee is employed as [JOB TITLE] and shall perform such duties as may be assigned by the Employer.

2. COMMENCEMENT AND DURATION
   This contract shall commence on [START DATE] and continue for [DURATION] months/years.

3. REMUNERATION
   a) Basic Salary: [AMOUNT] per month
   b) Allowances: [LIST ALLOWANCES]
   c) Payment shall be made on the [PAYMENT DATE] of each month.

4. WORKING HOURS
   a) Monday to Friday: [START TIME] to [END TIME]
   b) Lunch break: [DURATION] hours
   c) Overtime as per company policy

5. LEAVE ENTITLEMENT
   a) Annual leave: [DAYS] working days per year
   b) Sick leave: [DAYS] days per year
   c) Maternity leave: As per Labor Act

6. TERMINATION
   Either party may terminate this contract by giving [NOTICE PERIOD] written notice.

SIGNED ON [DATE]

_________________________
EMPLOYER

_________________________
EMPLOYEE`,
        createdBy: adminUser._id
      },
      {
        title: 'Residential Lease Agreement',
        category: 'Land Disputes',
        content: `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement is made on [DATE] between:

LANDLORD:
[LANDLORD NAME]
[LANDLORD ADDRESS]
[LANDLORD PHONE]

AND

TENANT:
[TENANT NAME]
[TENANT ADDRESS]
[TENANT PHONE]

1. PREMISES
   The Landlord agrees to let to the Tenant the residential property situated at:
   [PROPERTY ADDRESS]
   (hereinafter called "the Premises")

2. TERM
   This lease shall commence on [START DATE] and expire on [END DATE] for a period of [DURATION] months.

3. RENT
   a) Monthly rent: [RENT AMOUNT]
   b) Payment due: [DUE DATE] of each month
   c) Payment method: [PAYMENT METHOD]
   d) Security deposit: [DEPOSIT AMOUNT]

4. PERMITTED USE
   The Premises shall be used solely for residential purposes.

5. MAINTENANCE
   a) Landlord responsible for structural repairs
   b) Tenant responsible for internal maintenance
   c) Tenant to keep Premises in good condition

6. UTILITIES
   Tenant shall pay for all utilities including electricity, water, gas, and telephone.

7. TERMINATION
   Either party may terminate this lease by giving [NOTICE PERIOD] written notice.

SIGNED BY:

_________________________
LANDLORD

_________________________
TENANT

WITNESS:
_________________________
[WITNESS NAME]
[WITNESS ADDRESS]`,
        createdBy: adminUser._id
      },
      {
        title: 'General Power of Attorney',
        category: 'Other',
        content: `GENERAL POWER OF ATTORNEY

I, [PRINCIPAL'S NAME], of [PRINCIPAL'S ADDRESS], hereby appoint:

[ATTORNEY'S NAME]
of [ATTORNEY'S ADDRESS]
as my true and lawful attorney to act on my behalf as follows:

1. BANKING MATTERS
   a) To operate all my bank accounts
   b) To sign checks and withdraw funds
   c) To apply for loans and credit facilities

2. PROPERTY MATTERS
   a) To sell, lease, or manage my properties
   b) To execute sale agreements
   c) To receive rental income

3. LEGAL MATTERS
   a) To institute legal proceedings
   b) To compromise claims
   c) To engage legal counsel

4. BUSINESS MATTERS
   a) To manage my business interests
   b) To sign contracts and agreements
   c) To represent me in business meetings

This Power of Attorney shall remain in effect until revoked by me in writing.

DATED THIS [DAY] DAY OF [MONTH], [YEAR]

_________________________
PRINCIPAL

DECLARED BEFORE ME:
_________________________
COMMISSIONER OF OATHS
[COMMISSIONER'S DETAILS]`,
        createdBy: adminUser._id
      },
      {
        title: 'Partnership Agreement',
        category: 'Corporate Law',
        content: `PARTNERSHIP AGREEMENT

This Partnership Agreement is made on [DATE] between:

PARTNER 1:
[PARTNER 1 NAME]
[PARTNER 1 ADDRESS]
[PARTNER 1 ID NUMBER]

PARTNER 2:
[PARTNER 2 NAME]
[PARTNER 2 ADDRESS]
[PARTNER 2 ID NUMBER]

1. BUSINESS NAME
   The partners shall carry on business under the name "[BUSINESS NAME]"

2. BUSINESS OBJECTIVES
   The business shall engage in [DESCRIPTION OF BUSINESS ACTIVITIES]

3. CAPITAL CONTRIBUTIONS
   Partner 1 shall contribute [AMOUNT 1]
   Partner 2 shall contribute [AMOUNT 2]
   Total capital: [TOTAL AMOUNT]

4. PROFIT SHARING
   Profits and losses shall be shared as follows:
   Partner 1: [PERCENTAGE 1]%
   Partner 2: [PERCENTAGE 2]%

5. MANAGEMENT
   Both partners shall participate in the management of the business.
   Major decisions shall require mutual consent.

6. DRAWINGS
   Each partner may draw up to [DRAWING AMOUNT] per month against profits.

7. ACCOUNTING
   Proper books of account shall be maintained and audited annually.

8. DISSOLUTION
   The partnership may be dissolved by:
   a) Mutual agreement
   b) Death or incapacity of a partner
   c) Court order

SIGNED BY:

_________________________
PARTNER 1

_________________________
PARTNER 2

WITNESSED BY:

_________________________
[WITNESS NAME]
[WITNESS ADDRESS]`,
        createdBy: adminUser._id
      },
      {
        title: 'Criminal Defense Brief',
        category: 'Assault',
        content: `CRIMINAL DEFENSE BRIEF

IN THE [COURT NAME]
CRIMINAL CASE NO. [CASE NUMBER]

STATE
        ...COMPLAINANT

VERSUS
[ACCUSED'S NAME]
        ...ACCUSED

DEFENSE BRIEF

THE ACCUSED, THROUGH DEFENSE COUNSEL, MOST RESPECTFULLY SHOWS THAT:

1. The accused is [AGE] years old, [OCCUPATION] by profession, residing at [ADDRESS].

2. The accused has been charged with [OFFENSE] under [SECTION OF LAW].

3. The accused pleads NOT GUILTY to the charge and shall rely on the following defenses:

4. DEFENSE OF ALIBI
   a) On the date and time of the alleged offense, the accused was at [LOCATION].
   b) Witnesses to the alibi: [WITNESS NAMES AND CONTACTS].

5. DEFENSE OF MISTAKEN IDENTITY
   a) The accused was not properly identified by witnesses.
   b. The identification procedure was flawed.

6. LACK OF MENS REA
   a) The accused did not have the required mental state to commit the offense.
   b) The act was accidental/inadvertent.

7. PROCEDURAL IRREGULARITIES
   a) The arrest was unlawful.
   b) Evidence was obtained in violation of constitutional rights.

8. The accused respectfully prays that:
   a) The charge be dismissed
   b) Alternatively, the accused be acquitted
   c) Costs be awarded in favor of the accused

DATED THIS [DAY] DAY OF [MONTH], [YEAR]

_________________________
DEFENSE COUNSEL
[LAWYER'S NAME]
[LAW PRACTICE NUMBER]`,
        createdBy: adminUser._id
      },
      {
        title: 'Fraud Complaint Affidavit',
        category: 'Fraud',
        content: `AFFIDAVIT IN SUPPORT OF FRAUD COMPLAINT

I, [COMPLAINANT'S NAME], of [COMPLAINANT'S ADDRESS], do hereby make oath and state as follows:

1. I am [AGE] years old and am engaged in [BUSINESS/OCCUPATION].

2. On or about [DATE], I was approached by [ACCUSED'S NAME] who represented himself/herself as [ACCUSED'S REPRESENTATION].

3. The accused induced me to [ACTION TAKEN] by making the following false representations:
   a) [FALSE REPRESENTATION 1]
   b) [FALSE REPRESENTATION 2]
   c) [FALSE REPRESENTATION 3]

4. I relied on these representations and as a result:
   a) I paid the sum of [AMOUNT] to the accused
   b) I transferred ownership of [PROPERTY/ASSET]
   c) I executed [DOCUMENT] in favor of the accused

5. The representations were false and the accused had no intention of performing the promised obligations.

6. I suffered the following damages:
   a) Financial loss: [AMOUNT]
   b. Property loss: [DESCRIPTION]
   c) Other damages: [DESCRIPTION]

7. I discovered the fraud on [DATE OF DISCOVERY] when [HOW DISCOVERED].

8. The accused has refused to return my money/property despite repeated demands.

9. I therefore pray that this honorable court may:
   a. Issue a warrant for the accused's arrest
   b. Order the accused to return my money/property
   c. Award costs and damages
   d. Grant such other relief as deemed just

DATED THIS [DAY] DAY OF [MONTH], [YEAR]

_________________________
DEPONENT

SWORN BEFORE ME AT [PLACE] ON THIS [DAY] DAY OF [MONTH], [YEAR]

_________________________
COMMISSIONER OF OATHS`,
        createdBy: adminUser._id
      },
      {
        title: 'Theft Charge Sheet',
        category: 'Theft',
        content: `CHARGE SHEET

IN THE [COURT NAME]
CRIMINAL CASE NO. [CASE NUMBER]

REPUBLIC
        ...COMPLAINANT

VERSUS
[ACCUSED'S NAME]
        ...ACCUSED

CHARGE

THE ACCUSED IS CHARGED WITH THE OFFENSE OF THEFT CONTRARY TO SECTION [SECTION NUMBER] OF THE [STATUTE NAME].

PARTICULARS OF OFFENSE

On or about [DATE] at [LOCATION] within the jurisdiction of this court, the accused:

1. Dishonestly appropriated [STOLEN PROPERTY] belonging to [OWNER'S NAME]
2. Valued at [VALUE] [CURRENCY]
3. With the intention of permanently depriving the owner thereof

EVIDENCE

1. The accused was found in possession of the stolen property on [DATE]
2. The accused failed to account for how he/she came into possession of said property
3. Witnesses saw the accused at the scene of the theft
4. CCTV footage shows the accused committing the theft

STATEMENT OF FACTS

1. On [DATE], [OWNER'S NAME] reported the theft of [PROPERTY] to the police
2. Police investigation led to the arrest of the accused on [ARREST DATE]
3. The accused was found in possession of the stolen property
4. The accused made a confession admitting to the theft

PRAYER

The Republic prays that the accused be:
a. Found guilty as charged
b. Sentenced according to law
c. Ordered to pay restitution to the victim

DATED THIS [DAY] DAY OF [MONTH], [YEAR]

_________________________
PROSECUTOR
[PROSECUTOR'S NAME]
[PROSECUTOR'S OFFICE]`,
        createdBy: adminUser._id
      },
      {
        title: 'Murder Defense Outline',
        category: 'Murder',
        content: `DEFENSE OUTLINE - MURDER TRIAL

IN THE [COURT NAME]
CRIMINAL CASE NO. [CASE NUMBER]

STATE
        ...PROSECUTOR

VERSUS
[ACCUSED'S NAME]
        ...ACCUSED

DEFENSE OUTLINE

ISSUES FOR DETERMINATION

1. Whether the accused caused the death of the deceased
2. Whether the accused acted with malice aforethought
3. Whether any statutory defenses apply

DEFENSE CASE

1. ALTERNATIVE THEORY OF DEATH
   a. Death was caused by natural causes
   b. Death was accidental/suicidal
   c. Medical evidence supports alternative cause

2. LACK OF INTENT
   a. No intention to cause death or grievous harm
   b. Act was done in self-defense
   c. Act was done under provocation

3. MISTAKEN IDENTITY
   a. Accused was not the perpetrator
   b. Witnesses unreliable
   c. Forensic evidence inconclusive

4. PROCEDURAL DEFECTS
   a. Unlawful arrest and detention
   b. Violation of constitutional rights
   c. Inadmissible evidence

WITNESSES FOR DEFENSE

1. [WITNESS 1] - will testify to alibi
2. [WITNESS 2] - will testify to character
3. [EXPERT WITNESS] - will give expert testimony
4. [WITNESS 3] - will testify to alternative theory

LEGAL ARGUMENTS

1. The prosecution has failed to prove its case beyond reasonable doubt
2. The evidence is circumstantial and inconclusive
3. The accused's constitutional rights have been violated
4. The accused is entitled to acquittal

PRAYER FOR RELIEF

The accused respectfully prays that:
1. The charge be dismissed
2. The accused be acquitted
3. Costs be awarded in favor of the accused

DATED THIS [DAY] DAY OF [MONTH], [YEAR]

_________________________
DEFENSE COUNSEL
[LAWYER'S NAME]
[LAW PRACTICE NUMBER]`,
        createdBy: adminUser._id
      }
    ];

    // Insert templates
    const templates = await Template.insertMany(sampleTemplates);
    console.log(`Created ${templates.length} sample templates`);

    // Display created templates
    console.log('\n📋 Created Templates:');
    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.title} (${template.category})`);
    });

    console.log('\n✅ Templates seeded successfully!');
    console.log('\n🎯 You can now login as admin and view these templates in the system.');

  } catch (error) {
    console.error('Error seeding templates:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedTemplates();
