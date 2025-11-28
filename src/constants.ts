/**
 * CDC Dataset Identifiers for Socrata Open Data API (SODA)
 *
 * Total: 73 public datasets (no authentication required) - TIER 1-3 + PHASE 4 EXPANSION
 * Coverage: 80+ health measures + real-time outbreak detection
 * Last Updated: 2025-11-28 (Phase 4: Critical Surveillance)
 */

export const CDC_BASE_URL = 'https://data.cdc.gov/resource';
export const CHRONICDATA_BASE_URL = 'https://chronicdata.cdc.gov/resource';

// Rate limiting: Conservative 500ms between requests
export const REQUEST_DELAY_MS = 500;

/**
 * Available CDC datasets with their Socrata dataset IDs
 */
export const DATASETS = {
  // PLACES: Local Data for Better Health (5 datasets)
  // 40+ health measures × 5 geographic levels
  places_county_2024: 'swc5-untb',
  places_county_2023: 'i46a-9kgh',
  places_place_2024: 'eav7-hnsx',
  places_tract_2024: 'q9s5-f4ms',
  places_zcta_2024: 'qnzd-25i4', // Fixed: was 'csmw-bzzp' (404 error)

  // BRFSS: Behavioral Risk Factor Surveillance System (6 datasets)
  brfss_obesity_national: 'tcmp-75zb',
  brfss_obesity_state: 'xtew-z72g',
  brfss_diabetes: '7yww-23y7',
  brfss_asthma: 'kj5r-3dtm',
  brfss_asthma_prevalence: 'xb47-c5mz', // Current asthma prevalence (2011+)
  brfss_tobacco_use: '8zak-ewtm', // Tobacco use trends (1995-2010)

  // Nutrition, Physical Activity, Obesity (3 datasets)
  nutrition_obesity: 'hn4x-zwk7',
  nutrition_policy_environmental: 'k8w5-7ju6', // Policy/environmental supports
  nutrition_commute_patterns: '8mrp-rmkw', // ACS commuting data

  // Heart Disease, Diabetes, Cancer, COVID (4 datasets)
  heart_disease_mortality: '6x7h-usvx',
  diabetes_indicators: 'qfvz-agah',
  covid_cases: 'vbim-akqf',
  cancer_incidence: 'c7dz-iz9w',

  // VSRR: Vital Statistics Rapid Release (3 datasets)
  vsrr_quarterly_mortality: '489q-934x',
  vsrr_maternal_mortality: 'e2d5-ggg7',
  vsrr_infant_mortality: 'jqwm-z2g9',

  // NCHS & Tobacco (2 datasets)
  nchs_death_rates_life_expectancy: 'w9j2-ggv5', // Since 1900
  adult_tobacco_consumption: 'rnvb-cpxx', // 2000+

  // === TIER 1 EXPANSION: HIGH PRIORITY DATASETS (10 datasets) ===
  // Added 2025-11-28 - See NEW_DATASETS_DISCOVERED.md for details

  // Comprehensive BRFSS (1 dataset)
  brfss_comprehensive: 'dttw-5yxu', // BRFSS Prevalence Data (2011-present) - 30+ health measures

  // Youth Health Surveillance (1 dataset)
  yrbss_high_school: 'svam-8dhg', // Youth Risk Behavior Surveillance System (substance use, mental health, violence)

  // Respiratory Surveillance (1 dataset)
  respiratory_combined: 'kvib-3txy', // RSV/COVID-19/Flu Combined Hospitalizations

  // Vaccinations (1 dataset)
  teen_vaccinations: 'ee48-w5t6', // Teen Vaccination Coverage (13-17 years) - HPV, Tdap, MenACWY

  // Vital Statistics - Birth & Death (2 datasets)
  vsrr_birth_quarterly: '76vv-a7x8', // VSRR Quarterly Birth Indicators (provisional)
  death_rates_major_causes: '6rkc-nb2q', // Age-Adjusted Death Rates for Leading Causes

  // Environmental Health (1 dataset)
  air_quality_tracking: 'cjae-szjv', // Air Quality Measures - National Environmental Health Tracking

  // Tobacco Impact & Policy (1 dataset)
  sammec_smoking_impact: '4yyu-3s69', // SAMMEC - Smoking-Attributable Mortality, Morbidity, Economic Costs

  // Oral & Vision Health (2 datasets)
  oral_health_indicators: 'jz6n-v26y', // NOHSS Adult Oral Health Indicators
  vision_health: 'vkwg-yswv', // Vision and Eye Health Surveillance (BRFSS module)

  // === TIER 2 EXPANSION: HIGH VALUE DATASETS (12 datasets) ===
  // Added 2025-11-28 - Policy-relevant, niche specializations

  // Respiratory Surveillance Extended (1 dataset)
  rsv_hospitalizations: '29hc-w46k', // RSV Hospitalizations from RSV-NET

  // Vaccination Coverage Extended (3 datasets)
  flu_vaccination_coverage: 'vh55-3he6', // Influenza Vaccination Coverage (All Ages 6+ Months)
  pregnant_vaccinations: 'h7pm-wmjc', // Vaccination Coverage among Pregnant Women
  kindergarten_vaccinations: 'ijqb-a7ye', // Kindergarten Vaccination Coverage and Exemptions

  // Vital Statistics Extended (1 dataset)
  birth_rates_age: 'yt7u-eiyg', // Birth Rates by Age Group

  // Injury Surveillance (1 dataset)
  tbi_surveillance: 'b4av-siev', // TBI Emergency Department Visits, Hospitalizations, Deaths

  // Tobacco Policy & Coverage (2 datasets)
  smokefree_air_legislation: '32fd-hyzc', // CDC STATE System - Smokefree Indoor Air Legislation
  medicaid_cessation_coverage: 'ntaa-dtex', // Medicaid Coverage of Cessation Treatments

  // BRFSS Extended (1 dataset)
  brfss_smart_county: 'cpem-dkkm', // BRFSS SMART County Prevalence (Metropolitan Area Risk Trends)

  // Youth Health Extended (1 dataset)
  youth_nutrition_activity: 'vba9-s8jp', // Nutrition, Physical Activity, Obesity - Youth Risk Behavior

  // Infectious Disease Surveillance (2 datasets)
  pneumococcal_disease: 'qvzb-qs6p', // Invasive Pneumococcal Disease 1998-2023 (Serotype Data)
  foodborne_outbreaks: '5xkq-dg7x', // NORS - Foodborne/Waterborne Disease Outbreaks

  // === TIER 3 EXPANSION: COMPLETENESS DATASETS (8 datasets) ===
  // Added 2025-11-28 - Additional coverage, historical data, niche use cases

  // Maternal & Child Health (2 datasets)
  breastfeeding_nis: '8hxn-cvik', // National Immunization Survey - Breastfeeding Rates
  pramstat_2009: 'qwpv-wpc8', // PRAMStat - Pregnancy Risk Assessment Monitoring System 2009

  // Tobacco Policy Extended (3 datasets)
  tobacco_licensure: 'eb4y-d4ic', // CDC STATE System - Tobacco Retailer Licensure Legislation
  tobacco_tax: '2dwv-vfam', // CDC STATE System - Tobacco Tax Legislation
  ecigarette_legislation: 'wan8-w4er', // CDC STATE System - E-Cigarette Legislation

  // Environmental & Injury Prevention (2 datasets)
  water_fluoridation: '8235-5d73', // Water Fluoridation Statistics
  alcohol_impaired_driving: 'haed-k2ka', // Alcohol-Impaired Driving Deaths

  // Historical BRFSS (1 dataset)
  brfss_healthcare_access_historical: 't984-9cdv', // BRFSS Health Care Access/Coverage 1995-2010

  // === PHASE 4: CRITICAL SURVEILLANCE GAPS (20 datasets) ===
  // Added 2025-11-28 - Real-time outbreak detection, vaccination tracking, overdose monitoring

  // NNDSS: National Notifiable Diseases Surveillance System (14 datasets)
  // Real-time disease outbreak detection (weekly provisional)
  nndss_arboviral: '4ewf-ciy6', // Arboviral diseases (West Nile, St. Louis encephalitis, Eastern/Western equine)
  nndss_hepatitis: 'xna8-x7qg', // Hepatitis A, B, C (acute + perinatal infection, influenza-associated pediatric mortality)
  nndss_tuberculosis: 'tfu6-pjxh', // Tuberculosis surveillance (weekly provisional 2020-2022)
  nndss_rubella: '2khz-k7sv', // Rubella & congenital rubella syndrome
  nndss_pertussis: '247v-f7n9', // Pertussis & poliomyelitis (whooping cough surveillance)
  nndss_haemophilus: 'cvcu-witw', // Haemophilus influenzae invasive disease (age <5 years, serotypes)
  nndss_qfever: 'tdge-ieq8', // Q fever (acute & chronic surveillance)
  nndss_botulism: 'qwf3-87ny', // Botulism (foodborne, infant, wound)

  // NNDSS Historical - Tuberculosis Trends (6 datasets)
  nndss_tb_2019: '5avu-ff58', // Tuberculosis surveillance 2019
  nndss_tb_2018: 'u3yt-gdfa', // Tuberculosis surveillance 2018
  nndss_tb_2017: '9g7x-sfq4', // Tuberculosis surveillance 2017
  nndss_tb_2016: 'pkas-xr96', // Tuberculosis surveillance 2016
  nndss_tb_2015: 'ei7y-3g6s', // Tuberculosis surveillance 2015
  nndss_tb_2014: 'pxa6-asqb', // Tuberculosis surveillance 2014

  // COVID-19 Vaccination Tracking (4 datasets)
  // County-level tracking with equity metrics (SVI, urban/rural)
  covid_vax_jurisdiction: 'unsk-b7fc', // National/state/territory vaccination (weekly updates)
  covid_vax_county: '8xkx-amqh', // County-level + equity data (SVI, metro/non-metro, completeness)
  covid_vax_respiratory_weekly: '5c6r-xi2t', // Weekly respiratory virus vaccination (flu, COVID, RSV) - all ages
  covid_vax_age_trends: 'gxj9-t96f', // Vaccination & case trends by age group (archived - Oct 2022)

  // Drug Overdose Crisis Monitoring (6 datasets)
  // Real-time overdose surveillance with drug-specific tracking
  overdose_provisional_state: 'xkb8-kh2a', // VSRR Provisional drug overdose deaths (monthly state-level)
  overdose_county: 'gb4e-yj24', // County-level overdose deaths (12-month ending provisional)
  overdose_by_drug: '8hzs-zshh', // Deaths by specific drugs (opioids, fentanyl, heroin, cocaine, meth)
  overdose_demographics: '95ax-ymtc', // Overdose deaths by demographics (age, sex, race, drug type)
  overdose_nowcast: 'v2g4-wqg2', // Early model-based estimates (nowcasting with reporting lag adjustment)
  nchs_injury_mortality: 'nt65-c7a7', // NCHS Injury mortality (all mechanisms + intents - annual)
} as const;

export type DatasetName = keyof typeof DATASETS;

/**
 * Dataset descriptions for documentation
 */
export const DATASET_DESCRIPTIONS: Record<DatasetName, string> = {
  places_county_2024: 'PLACES: County-level disease prevalence (2024)',
  places_county_2023: 'PLACES: County-level disease prevalence (2023)',
  places_place_2024: 'PLACES: City/town-level disease prevalence (2024)',
  places_tract_2024: 'PLACES: Census tract-level disease prevalence (2024)',
  places_zcta_2024: 'PLACES: ZIP code-level disease prevalence (2024)',
  brfss_obesity_national: 'BRFSS: National obesity prevalence trends',
  brfss_obesity_state: 'BRFSS: State-level obesity prevalence',
  brfss_diabetes: 'BRFSS: Diabetes prevalence data',
  brfss_asthma: 'BRFSS: Asthma prevalence data',
  brfss_asthma_prevalence: 'BRFSS: Current asthma prevalence (2011+)',
  brfss_tobacco_use: 'BRFSS: Tobacco use prevalence trends (1995-2010)',
  nutrition_obesity: 'Nutrition, Physical Activity, and Obesity - Behavioral',
  nutrition_policy_environmental: 'Nutrition, Physical Activity - Policy/Environmental',
  nutrition_commute_patterns: 'Nutrition, Physical Activity - Commuting Patterns',
  heart_disease_mortality: 'Heart Disease Mortality by State',
  diabetes_indicators: 'Diabetes Surveillance System indicators',
  covid_cases: 'COVID-19 Case Surveillance (if available)',
  cancer_incidence: 'Cancer incidence statistics',
  vsrr_quarterly_mortality: 'VSRR: Quarterly provisional mortality estimates',
  vsrr_maternal_mortality: 'VSRR: Provisional maternal death counts',
  vsrr_infant_mortality: 'VSRR: Quarterly provisional infant mortality estimates',
  nchs_death_rates_life_expectancy: 'NCHS: Death rates and life expectancy at birth (since 1900)',
  adult_tobacco_consumption: 'Adult tobacco consumption in the U.S. (2000+)',

  // Tier 1 Expansion Descriptions
  brfss_comprehensive: 'BRFSS: Comprehensive prevalence data 2011-present (30+ health measures)',
  yrbss_high_school: 'YRBSS: High school youth risk behaviors (substance use, mental health, violence)',
  respiratory_combined: 'Respiratory Surveillance: Combined RSV/COVID-19/Flu hospitalizations',
  teen_vaccinations: 'Vaccination Coverage: Adolescents 13-17 years (HPV, Tdap, MenACWY)',
  vsrr_birth_quarterly: 'VSRR: Quarterly provisional birth indicators (rates, cesarean, preterm)',
  death_rates_major_causes: 'NCHS: Age-adjusted death rates for leading causes of death',
  air_quality_tracking: 'Environmental Health: Air quality measures (PM2.5, ozone) with health tracking',
  sammec_smoking_impact: 'SAMMEC: Smoking-attributable mortality, morbidity, and economic costs',
  oral_health_indicators: 'NOHSS: Adult oral health indicators (dental visits, tooth loss, cancer screening)',
  vision_health: 'BRFSS: Vision and eye health surveillance (blindness, exams, diabetic retinopathy)',

  // Tier 2 Expansion Descriptions
  rsv_hospitalizations: 'RSV-NET: RSV-specific hospitalization surveillance by age group',
  flu_vaccination_coverage: 'Influenza Vaccination Coverage: All ages 6+ months by race, state',
  pregnant_vaccinations: 'Vaccination Coverage: Pregnant women (flu, Tdap during pregnancy)',
  kindergarten_vaccinations: 'Kindergarten Vaccination Coverage: School entry rates and exemption trends',
  birth_rates_age: 'NCHS: Age-specific fertility rates over time',
  tbi_surveillance: 'TBI Surveillance: Emergency visits, hospitalizations, deaths by mechanism',
  smokefree_air_legislation: 'STATE System: Smokefree indoor air laws by venue type',
  medicaid_cessation_coverage: 'Medicaid Coverage: Smoking cessation treatment policies by state',
  brfss_smart_county: 'BRFSS SMART: Metropolitan Area Risk Trends - county-level prevalence',
  youth_nutrition_activity: 'NPAO: Youth-specific nutrition and physical activity data',
  pneumococcal_disease: 'Invasive Pneumococcal Disease: 25-year serotype surveillance (1998-2023)',
  foodborne_outbreaks: 'NORS: Foodborne/waterborne disease outbreak surveillance',

  // Tier 3 Expansion Descriptions
  breastfeeding_nis: 'NIS: Breastfeeding rates - initiation, duration, exclusivity by state',
  pramstat_2009: 'PRAMStat: Pregnancy Risk Assessment Monitoring System 2009 data',
  tobacco_licensure: 'STATE System: Tobacco retailer licensure laws by state',
  tobacco_tax: 'STATE System: Cigarette and tobacco tax legislation',
  ecigarette_legislation: 'STATE System: E-cigarette regulation and taxation policies',
  water_fluoridation: 'Water Systems: Community water fluoridation statistics',
  alcohol_impaired_driving: 'FARS: Alcohol-impaired driving deaths by state',
  brfss_healthcare_access_historical: 'BRFSS: Historical health care access/coverage trends 1995-2010',

  // Phase 4 Expansion Descriptions
  nndss_arboviral: 'NNDSS: Arboviral diseases surveillance (West Nile, encephalitis) - weekly provisional',
  nndss_hepatitis: 'NNDSS: Hepatitis A, B, C surveillance (acute + perinatal) - weekly provisional',
  nndss_tuberculosis: 'NNDSS: Tuberculosis surveillance (weekly provisional 2020-2022)',
  nndss_rubella: 'NNDSS: Rubella & congenital rubella syndrome - weekly provisional',
  nndss_pertussis: 'NNDSS: Pertussis & poliomyelitis surveillance - weekly provisional',
  nndss_haemophilus: 'NNDSS: Haemophilus influenzae invasive disease (age <5) - weekly provisional',
  nndss_qfever: 'NNDSS: Q fever (acute & chronic) surveillance - weekly provisional',
  nndss_botulism: 'NNDSS: Botulism (foodborne, infant, wound) - weekly provisional',
  nndss_tb_2019: 'NNDSS: Tuberculosis surveillance 2019 (historical trends)',
  nndss_tb_2018: 'NNDSS: Tuberculosis surveillance 2018 (historical trends)',
  nndss_tb_2017: 'NNDSS: Tuberculosis surveillance 2017 (historical trends)',
  nndss_tb_2016: 'NNDSS: Tuberculosis surveillance 2016 (historical trends)',
  nndss_tb_2015: 'NNDSS: Tuberculosis surveillance 2015 (historical trends)',
  nndss_tb_2014: 'NNDSS: Tuberculosis surveillance 2014 (historical trends)',
  covid_vax_jurisdiction: 'COVID-19 Vaccination: National/state/territory level (weekly updates)',
  covid_vax_county: 'COVID-19 Vaccination: County-level + equity metrics (SVI, urban/rural)',
  covid_vax_respiratory_weekly: 'Respiratory Virus Vaccination: Weekly flu/COVID/RSV coverage (all ages)',
  covid_vax_age_trends: 'COVID-19 Vaccination: Age group trends & case correlation (archived Oct 2022)',
  overdose_provisional_state: 'VSRR: Provisional drug overdose deaths (monthly state-level)',
  overdose_county: 'VSRR: County-level overdose deaths (12-month ending provisional)',
  overdose_by_drug: 'VSRR: Overdose deaths by specific drugs (opioids, fentanyl, cocaine, meth)',
  overdose_demographics: 'VSRR: Overdose deaths by demographics (age, sex, race, drug type)',
  overdose_nowcast: 'VSRR: Early model-based overdose estimates (nowcasting with lag adjustment)',
  nchs_injury_mortality: 'NCHS: Injury mortality - all mechanisms and intents (annual)',
};

/**
 * Common PLACES health measures (40+ total)
 */
export const PLACES_MEASURES = {
  // Chronic Diseases
  DIABETES: 'Diagnosed diabetes',
  OBESITY: 'Adult obesity (BMI ≥30)',
  CHD: 'Coronary heart disease',
  COPD: 'Chronic obstructive pulmonary disease',
  ASTHMA: 'Current asthma',
  STROKE: 'Stroke',
  BPHIGH: 'High blood pressure',
  CANCER: 'Cancer (excluding skin cancer)',
  KIDNEY: 'Chronic kidney disease',
  ARTHRITIS: 'Arthritis',

  // Mental Health
  DEPRESSION: 'Depression',
  MHLTH: 'Mental health not good for ≥14 days',

  // Physical Health & Disabilities
  PHLTH: 'Physical health not good for ≥14 days',
  COGNITION: 'Cognitive disability',
  HEARING: 'Hearing disability',
  VISION: 'Vision disability',
  MOBILITY: 'Mobility disability',
  SELFCARE: 'Self-care disability',
  INDEPENDENCE: 'Independent living disability',

  // Prevention
  DENTAL: 'Annual dental visit',
  ACCESS2: 'Lack of health insurance (adults <65)',
  CHECKUP: 'No annual checkup',
  CHOLSCREEN: 'Cholesterol screening',
  COREW: 'Core preventive services (men 65+)',
  COREM: 'Core preventive services (women 65+)',
  CERVICAL: 'Cervical cancer screening (NOT received)',
  COLON_SCREEN: 'Colorectal cancer screening (NOT received)',
  MAMMOUSE: 'Mammography (NOT received)',

  // Risk Factors
  CSMOKING: 'Current smoking',
  BINGE: 'Binge drinking',
  LPA: 'No leisure-time physical activity',
  SLEEP: 'Sleep <7 hours',
  GHLTH: 'Fair or poor health status',
} as const;

export type PlacesMeasureId = keyof typeof PLACES_MEASURES;
