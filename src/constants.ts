/**
 * CDC Dataset Identifiers for Socrata Open Data API (SODA)
 *
 * Total: 33 public datasets (no authentication required) - TIER 1 EXPANSION
 * Coverage: 60+ health measures across multiple surveillance systems
 * Last Updated: 2025-11-28
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
  places_zcta_2024: 'csmw-bzzp',

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
