import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const { field } = await request.json();

    if (!field) {
      return NextResponse.json(
        { error: 'Field is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Searching for apprenticeships in field:', field);

    // Create the prompt for OpenAI
    const prompt = `Generate a list of 25 realistic UK apprenticeship opportunities for school leavers (ages 16-18) in the ${field} field.

CRITICAL REQUIREMENTS:
1. Use ONLY companies from the verified list below
2. Use the EXACT URLs and EXACT locations provided - do not modify them
3. Use realistic opening dates between Jan 2025 - Dec 2026
4. DO NOT include closing dates

VERIFIED COMPANIES WITH LOCATIONS:

LAW (Solicitor / Paralegal):
- White & Case [London] — https://www.whitecase.com/careers/locations/uk/early-careers/our-offer/solicitor-apprenticeships
- Norton Rose Fulbright [London] — https://www.nortonrosefulbright.com/en-gb/graduates/opportunities/solicitor-apprenticeship
- Dentons [London] — https://challengers.dentons.com/uk-apprentices/the-programme/solicitor-apprenticeship/
- CMS [Sheffield, Manchester, Bristol, London] — https://cmsemergingtalent.com/programmes/england-wales-ni/solicitor-apprenticeships/
- Eversheds Sutherland [London, Manchester, Leeds] — https://www.eversheds-sutherland.com/en/where/europe/uk/graduate-careers/solicitor-apprenticeship
- DLA Piper [London, Birmingham, Manchester, Leeds] — https://www.dlapiper.com/en/careers/locations/uk/early-careers/solicitor-apprenticeship/
- Pinsent Masons [London, Birmingham, Manchester, Leeds, Glasgow] — https://www.pinsentmasons.com/careers/early-careers/solicitor-apprenticeship
- Addleshaw Goddard [London, Manchester, Leeds] — https://www.addleshawgoddard.com/en/careers/early-careers/uk/solicitor-apprenticeship/
- Clyde & Co [London, Manchester, Edinburgh] — https://earlycareers.clydeco.com/uk/apprenticeships/
- Weightmans [Liverpool, Birmingham, Leeds, Manchester] — https://www.weightmans.com/careers/apprenticeships/solicitor-apprenticeships/
- Kennedys [London, Manchester, Birmingham, Taunton] — https://www.kennedyslaw.com/careers/early-careers/apprenticeships/
- DAC Beachcroft [London, Bristol, Manchester, Leeds] — https://www.dacbeachcroft.com/en/careers/early-careers/apprenticeships/

ACCOUNTING, AUDIT & TAX:
- PwC [London, Manchester, Birmingham, Leeds, Bristol, Belfast] — https://www.pwc.co.uk/careers/early-careers/school-jobs.html
- Deloitte [London, Manchester, Birmingham, Leeds, Edinburgh] — https://www2.deloitte.com/uk/en/pages/careers/articles/brightstart-apprenticeships.html
- KPMG [London, Manchester, Birmingham, Leeds, Cambridge, Glasgow, Bristol] — https://www.kpmgcareers.co.uk/people-and-culture/early-careers/apprenticeships/
- EY [London, Manchester, Reading, Birmingham] — https://www.ey.com/en_uk/careers/students/programmes/schools
- BDO [London, Bristol, Manchester, Birmingham, Leeds] — https://www.bdoearlyincareer.co.uk/programmes/school-leaver-programme/
- Grant Thornton [London, Manchester, Birmingham, Leeds] — https://www.grantthornton.co.uk/careers/early-careers/school-leavers/
- RSM [London, Manchester, Birmingham, Leeds, Edinburgh] — https://www.rsmuk.com/careers/students/school-and-college-leavers
- Mazars [London, Leeds, Birmingham, Glasgow, Bristol] — https://www.mazarscareers.co.uk/uk/en/students-graduates
- Azets [Regional offices across England, Scotland & Wales] — https://www.azets.co.uk/careers/early-careers/apprenticeships/
- Evelyn Partners [London, Birmingham, Manchester] — https://www.evelyn.com/careers/early-careers/school-leavers/
- Crowe UK [London, Midlands, Thames Valley] — https://www.crowe.com/uk/careers/early-careers

BANKING, MARKETS & INSURANCE:
- Barclays [Knutsford, Northampton, Glasgow, London, Manchester] — https://search.jobs.barclays/apprenticeships
- Lloyds Banking Group [Bristol, Birmingham, Edinburgh, London, Manchester] — https://www.lloydsbankinggrouptalent.com/our-opportunities/apprenticeships/
- NatWest Group [London, Edinburgh, Manchester] — https://jobs.natwestgroup.com/pages/apprenticeships
- HSBC [UK-wide] — https://www.hsbc.com/careers/students-and-graduates/schools-and-apprenticeships
- Santander UK [UK-wide] — https://www.santanderjobs.co.uk/early-in-career/apprenticeships
- Bank of England [London, Leeds] — https://www.bankofengland.co.uk/careers/early-careers
- J.P. Morgan [Bournemouth, London] — https://www.jpmorganchase.com/careers/explore-opportunities/programs/financial-services-apprenticeship
- Goldman Sachs [London, Birmingham] — https://www.goldmansachs.com/careers/students/programs/emea/degree-apprenticeship/
- UBS [London] — https://www.ubs.com/global/en/careers/apprenticeships/gbr.html
- Deutsche Bank [London] — https://careers.db.com/locations/united-kingdom/early-careers/
- Schroders [London] — https://www.schroders.com/en/careers/students/apprenticeships/
- Aviva [Norwich, Bristol, London, Sheffield] — https://careers.aviva.co.uk/our-programmes/apprenticeships/

TECHNOLOGY & DIGITAL:
- IBM UK [London, Hursley, Manchester, Edinburgh] — https://www.ibm.com/careers/career-opportunities
- Accenture UK [London, Newcastle, Manchester] — https://www.accenture.com/gb-en/careers/local/apprenticeships
- BT Group [Birmingham, London, Ipswich, Cardiff, Glasgow] — https://jobs.bt.com/content/Apprenticeships---BT-Group/
- Vodafone UK [London, Newbury, Stoke, Manchester] — https://careers.vodafone.com/early-careers/apprenticeships/
- Capgemini UK [Telford, London, Glasgow, Worthing] — https://www.capgemini.com/gb-en/careers/uk-students-and-graduates/apprenticeships/
- Amazon UK [Tilbury, Manchester, London] — https://www.amazonapprenticeships.co.uk/
- Microsoft UK [Reading, London, Manchester] — https://careers.microsoft.com/students/us/en/emea-apprenticeship
- Google UK [London] — https://buildyourfuture.withgoogle.com/apprenticeships
- Sky [Osterley, Livingston, Leeds] — https://careers.sky.com/earlycareers/apprenticeships/
- BBC [London, Salford, Cardiff, Glasgow, Birmingham] — https://www.bbc.co.uk/careers/trainee-schemes-and-apprenticeships
- Cisco UK [Feltham, Reading] — https://www.cisco.com/c/en_uk/about/careers/early-careers/apprenticeships.html
- Virgin Media O2 [Reading, Birmingham, Manchester] — https://careers.virginmediao2.co.uk/early-careers/apprentices/

ENGINEERING & MANUFACTURING:
- Rolls-Royce [Derby, Bristol] — https://careers.rolls-royce.com/united-kingdom/students-and-graduates/apprenticeships-and-school-leavers
- BAE Systems [Warton, Barrow-in-Furness, Portsmouth, Glasgow] — https://careers.baesystems.com/locations/uk/apprentices
- Airbus UK [Broughton, Filton] — https://www.airbus.com/en/careers/students-and-graduates/apprentices/apprenticeships-in-the-united-kingdom
- Leonardo [Edinburgh, Luton, Yeovil, Basildon] — https://uk.leonardo.com/en/people-careers/apprenticeships
- Siemens [Manchester, Lincoln, Worcester, Congleton] — https://www.siemens.com/uk/en/company/jobs/early-careers/apprenticeships.html
- Jaguar Land Rover [Gaydon, Solihull, Wolverhampton, Halewood] — https://careers.jaguarlandrover.com/early-careers/apprentices
- BMW Group [Oxford, Goodwood, Farnborough] — https://www.bmwgroup.jobs/gb/en/opportunities/apprentices.html
- Toyota Manufacturing UK [Derbyshire, Deeside] — https://recruitment.toyotauk.com/apprenticeships/
- Nissan Sunderland [Sunderland] — https://careersatnissan.co.uk/apprenticeships/
- JCB [Staffordshire] — https://www.jcb.com/en-gb/about/careers/early-careers/apprenticeships
- MBDA [Bolton, Stevenage, Bristol] — https://www.mbdacareers.co.uk/early-careers/apprentices/
- Babcock International [Bristol, Plymouth, Rosyth, Warrington] — https://www.babcockinternational.com/careers/early-careers/apprenticeships/
- Thales UK [Reading, Crawley, Templecombe, Glasgow] — https://www.thalesgroup.com/en/careers/early-careers/apprenticeships
- GKN Aerospace [Bristol, Cowes, Luton] — https://www.gknaerospace.com/en/careers/early-careers/apprenticeships/

CONSTRUCTION & SURVEYING:
- Balfour Beatty [London, Birmingham, Newcastle, Glasgow] — https://www.balfourbeattycareers.com/early-careers/apprentices/
- Kier [Birmingham, Cardiff, Manchester, London] — https://www.kier.co.uk/careers/early-careers/apprentices/
- Laing O'Rourke [London, Dartford, Manchester] — https://www.laingorourke.com/careers/early-talent/apprenticeships/
- Mace [London, Birmingham, Manchester] — https://www.macegroup.com/careers/early-careers/apprentices
- Skanska [London, Cambridge, Bristol] — https://www.skanska.co.uk/careers/early-careers/apprenticeships/
- Morgan Sindall [London, Manchester, Birmingham] — https://www.morgansindall.com/careers/early-careers/apprenticeships
- Costain [Maidenhead] — https://www.costain.com/careers/early-careers/apprenticeships/
- Galliford Try [Rugby, London] — https://www.gallifordtry.co.uk/careers/early-careers/apprenticeships/
- WSP [London, Bristol, Manchester, Newcastle, Guildford, Southampton] — https://www.wsp.com/en-gb/careers/early-careers/apprenticeships
- AtkinsRéalis [London, Bristol, Birmingham, Glasgow] — https://careers.atkinsrealis.com/early-careers/apprenticeships-uk
- Arup [London, Manchester, Birmingham, Leeds, Bristol, Glasgow] — https://www.arup.com/careers/early-careers/apprenticeships
- Mott MacDonald [London, Croydon, Cambridge, Leeds] — https://careers.mottmac.com/early-careers/apprenticeships

TRANSPORT, ENERGY & INFRASTRUCTURE:
- Transport for London [London] — https://tfl.gov.uk/corporate/careers/apprenticeships
- Network Rail [Birmingham, Manchester, York, London] — https://www.networkrail.co.uk/careers/early-careers/apprenticeships/
- National Highways [UK-wide] — https://careers.nationalhighways.co.uk/early-careers/apprenticeships/
- British Airways [London Heathrow, Manchester, Newcastle] — https://careers.ba.com/apprentices-and-work-experience/
- Royal Mail [UK-wide] — https://www.royalmailgroup.com/en/careers/career-areas/apprentices/
- Stagecoach [Manchester, London, Sheffield, Glasgow] — https://www.stagecoachbus.com/promos-and-offers/national/apprenticeships
- National Grid [Warwick, Wokingham, London] — https://jobs.nationalgrid.com/uk/early-careers/apprenticeships/
- SSE [Perth, Glasgow, Reading] — https://careers.sse.com/apprenticeships-and-trainees
- ScottishPower [Glasgow] — https://www.scottishpower.com/pages/apprenticeships.aspx
- E.ON UK [Nottingham, Coventry] — https://www.eon-uk-careers.com/early-careers/apprenticeships/
- Ørsted UK [Grimsby, Barrow, London] — https://orsted.co.uk/careers/early-careers/apprenticeships
- Thames Water [Reading, London, Swindon] — https://www.thameswater.co.uk/about-us/careers/early-careers/apprenticeships

PUBLIC SECTOR & DEFENCE:
- Civil Service [London, Leeds, Bristol, Manchester, Edinburgh] — https://www.gov.uk/government/organisations/government-economic-service/about/recruitment
- HMRC [Nottingham, Newcastle, Bristol, Manchester, Glasgow] — https://www.gov.uk/government/organisations/hm-revenue-customs/about/recruitment
- Home Office [London, Croydon, Sheffield, Manchester] — https://careers.homeoffice.gov.uk/role/apprenticeships/
- GCHQ [Cheltenham, Manchester, Scarborough] — https://www.gchq-careers.co.uk/early-careers/
- Metropolitan Police [London] — https://www.met.police.uk/car/careers/met/police-officer-roles/police-constable/entry-routes/pcda/
- British Army [UK-wide] — https://jobs.army.mod.uk/roles/apprenticeships/
- Royal Navy [Portsmouth] — https://www.royalnavy.mod.uk/careers/joining/get-ready-to-join/apprenticeships
- Royal Air Force [UK-wide] — https://recruitment.raf.mod.uk/apprenticeships
- DVLA [Swansea] — https://www.gov.uk/government/organisations/driver-and-vehicle-licensing-agency/about/recruitment
- Environment Agency [Nottingham, Bristol, Reading, Leeds] — https://environmentagencycareers.co.uk/early-careers/apprenticeships/

HEALTHCARE & PHARMA:
- NHS [UK-wide] — https://www.healthcareers.nhs.uk/career-planning/study-and-training/apprenticeships-nhs
- GSK [Ware, Stevenage, Barnard Castle, Montrose] — https://www.gsk.com/en-gb/careers/early-careers/apprentice-programmes/
- AstraZeneca [Macclesfield, Cambridge] — https://careers.astrazeneca.com/early-talent/uk-apprenticeships
- Pfizer UK [Sandwich, Hurley] — https://www.pfizer.co.uk/careers/apprenticeships
- Boots [Nottingham] — https://www.boots.jobs/early-careers/apprentices/
- Bupa [UK-wide] — https://careers.bupa.co.uk/early-careers/apprenticeships
- NHS Blood & Transplant [Bristol, Barnsley, Newcastle, London] — https://www.nhsbt.nhs.uk/careers/how-to-join-us/apprenticeships/
- UK Health Security Agency [London, Porton Down, Colindale] — https://www.gov.uk/government/organisations/uk-health-security-agency/about/recruitment

MEDIA & CREATIVE:
- BBC [London, Salford, Cardiff, Glasgow, Birmingham] — https://www.bbc.co.uk/careers/trainee-schemes-and-apprenticeships
- ITV [London, Manchester, Leeds] — https://www.itvjobs.com/early-careers/apprenticeships/
- Channel 4 [London, Leeds, Glasgow, Bristol] — https://careers.channel4.com/4skills/apprenticeships
- Sky [Osterley, Livingston, Leeds] — https://careers.sky.com/earlycareers/apprenticeships/
- Global [London] — https://global.com/careers/early-careers/
- Bauer Media [London, Manchester, Peterborough] — https://careers.bauer-media.com/early-careers/
- Warner Bros. Discovery [London] — https://careers.wbd.com/global/en/early-careers
- Bloomberg London [London] — https://www.bloomberg.com/company/careers/early-career/

RETAIL & HOSPITALITY:
- Tesco [UK-wide] — https://www.tesco-programmes.com/apprenticeships
- Sainsbury's [UK-wide] — https://sainsburys.jobs/working-at-sainsburys/early-careers/apprenticeships/
- Asda [UK-wide] — https://www.asda.jobs/early-careers/apprenticeships/
- Morrisons [Bradford] — https://www.morrisons.jobs/early-careers/degree-apprenticeships
- Aldi [UK-wide] — https://www.aldirecruitment.co.uk/apprenticeships
- Lidl [UK-wide] — https://careers.lidl.co.uk/apprenticeships
- Co-op [UK-wide] — https://jobs.coop.co.uk/early-careers/apprenticeships
- John Lewis & Waitrose [London, Bracknell] — https://www.jlpjobs.com/our-culture/early-careers/apprenticeships/
- Greene King [Bury St Edmunds] — https://www.greeneking.co.uk/careers/apprenticeships/
- Mitchells & Butlers [Birmingham] — https://www.mbcareersandjobs.com/apprenticeships/
- Whitbread [Dunstable] — https://www.whitbreadcareers.com/early-careers/apprenticeships/
- McDonald's UK [UK-wide] — https://people.mcdonalds.co.uk/early-careers/apprenticeships/

PROFESSIONAL SERVICES:
- PA Consulting [London, Cambridge, Edinburgh, Bristol] — https://www.paconsulting.com/careers/early-careers/apprenticeships
- CGI [Reading, Gloucester, London, Edinburgh] — https://www.cgi.com/uk/en-gb/early-careers/apprenticeships
- Sopra Steria [Hemel Hempstead, Edinburgh, Manchester] — https://www.soprasteria.co.uk/careers/early-careers/apprenticeships
- FDM [London, Leeds, Glasgow] — https://www.fdmgroup.com/uk/careers/apprenticeships/

CHARITIES & PUBLISHING:
- Cancer Research UK [London, Cambridge] — https://www.cancerresearchuk.org/about-us/working-with-us/early-careers/apprenticeships
- British Red Cross [London] — https://www.redcross.org.uk/get-involved/volunteer/young-people/apprenticeships
- Wellcome [London] — https://wellcome.org/jobs/early-careers
- Penguin Random House UK [London] — https://www.penguinrandomhousecareers.co.uk/your-career/our-schemes/apprenticeships/

For each apprenticeship, provide:
- name: Specific role title matching the company's sector
- company: Select from the EXACT company names above in the ${field} sector
- location: Select ONLY from the locations listed in brackets for that company
- openDate: Format "DD MMM YYYY" between Jan 2025 - Dec 2026
- type: One of: "Degree Apprenticeship", "Higher Apprenticeship", "Advanced Apprenticeship", "Intermediate Apprenticeship"
- link: Use the EXACT URL from the list above - DO NOT modify it

Return ONLY a valid JSON array with exactly 25 apprenticeships (no markdown, no code blocks). DO NOT include closingDate:
[
  {
    "name": "Apprenticeship Title",
    "company": "Company Name",
    "location": "City from company's list",
    "openDate": "DD MMM YYYY",
    "type": "Apprenticeship Type",
    "link": "https://exact.url.from.list"
  }
]`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful career advisor assistant that provides accurate information about UK apprenticeships for school leavers. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000
    });

    const responseText = completion.choices[0]?.message?.content;
    console.log('🤖 OpenAI response:', responseText);

    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let apprenticeships;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        apprenticeships = JSON.parse(jsonMatch[0]);
      } else {
        apprenticeships = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response:', parseError);
      throw new Error('Failed to parse apprenticeship data');
    }

    console.log('✅ Generated apprenticeships:', apprenticeships.length);

    return NextResponse.json({
      apprenticeships,
      field
    });

  } catch (error: any) {
    console.error('❌ Error searching apprenticeships:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search apprenticeships',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

