/**
 * CDC Dataset Identifiers for Socrata Open Data API (SODA)
 *
 * Total: 23 public datasets (no authentication required)
 * Coverage: 40+ health measures across multiple surveillance systems
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
