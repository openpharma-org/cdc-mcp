# CDC MCP Server - Complete Disease & Health Condition Coverage

**Last Updated**: 2024-11-28
**Status**: Production Ready
**Total Datasets**: 23 public datasets
**Authentication**: None required

---

## Quick Summary

The CDC MCP server provides access to **40+ health measures** across multiple surveillance systems, covering the most prevalent chronic diseases, risk factors, mental health conditions, and vital statistics in the United States.

**Geographic Granularity**: County, city, census tract, ZIP code, state, and national levels

---

## Disease Categories & Coverage

### 1. Chronic Diseases (9 conditions)

#### Cardiovascular Diseases
- **Coronary Heart Disease (CHD)**
  - PLACES measure: `CHD`
  - Prevalence data by location
  - Age-adjusted rates
  - Geographic coverage: County → ZIP code level

- **Stroke**
  - PLACES measure: `STROKE`
  - State/county prevalence
  - Confidence intervals included
  - Historical trends available

- **High Blood Pressure**
  - PLACES measure: `BPHIGH`
  - Adult hypertension prevalence
  - State/county breakdowns
  - Supplemental dataset: Heart Disease Mortality (state-level)

#### Respiratory Diseases
- **Chronic Obstructive Pulmonary Disease (COPD)**
  - PLACES measure: `COPD`
  - Prevalence among adults
  - Geographic variation analysis

- **Asthma**
  - PLACES measure: `ASTHMA`
  - Current asthma prevalence
  - BRFSS asthma dataset (2 datasets)
  - Historical trends: 2011-present
  - State and national data

#### Metabolic Diseases
- **Diabetes**
  - PLACES measure: `DIABETES`
  - Diagnosed diabetes prevalence
  - BRFSS diabetes dataset
  - Diabetes Surveillance System indicators
  - County/state/national coverage
  - Age/gender/race stratifications available

- **Obesity**
  - PLACES measure: `OBESITY`
  - Adult obesity (BMI ≥30)
  - BRFSS obesity datasets (2 datasets):
    - National trends
    - State-level prevalence
  - Nutrition/Physical Activity/Obesity dataset
  - Historical trends available
  - Multiple stratifications

- **High Cholesterol**
  - PLACES measure: `CHOLSCREEN`
  - Cholesterol screening rates
  - Prevention measure

#### Other Chronic Conditions
- **Cancer**
  - PLACES measure: `CANCER`
  - Cancer prevalence (excluding skin cancer)
  - Cancer incidence dataset
  - Multiple cancer types

- **Chronic Kidney Disease**
  - PLACES measure: `KIDNEY`
  - CKD prevalence among adults
  - State/county breakdowns

- **Arthritis**
  - PLACES measure: `ARTHRITIS`
  - Arthritis prevalence
  - Age-adjusted rates

---

### 2. Mental Health Conditions (2 categories)

- **Depression**
  - PLACES measure: `DEPRESSION`
  - Diagnosed depression prevalence
  - State/county geographic coverage

- **Mental Health Status**
  - PLACES measure: `MHLTH`
  - Mental health "not good" for ≥14 days
  - Self-reported measure
  - Population-level trends

---

### 3. Physical Health & Disabilities (7 conditions)

- **Physical Health Status**
  - PLACES measure: `PHLTH`
  - Physical health "not good" for ≥14 days
  - Population quality of life indicator

- **Cognitive Disabilities**
  - PLACES measure: `COGNITION`
  - Serious difficulty concentrating/remembering/deciding
  - ACS-based estimates

- **Hearing Disability**
  - PLACES measure: `HEARING`
  - Deaf or serious difficulty hearing
  - ACS population estimates

- **Vision Disability**
  - PLACES measure: `VISION`
  - Blind or serious difficulty seeing
  - Geographic prevalence

- **Mobility Disability**
  - PLACES measure: `MOBILITY`
  - Serious difficulty walking/climbing stairs
  - State/county breakdowns

- **Self-Care Disability**
  - PLACES measure: `SELFCARE`
  - Difficulty dressing or bathing
  - Functional limitation measure

- **Independent Living Disability**
  - PLACES measure: `INDEPENDENCE`
  - Difficulty doing errands alone
  - ACS-based prevalence

---

### 4. Prevention Measures (5 indicators)

- **Dental Visits**
  - PLACES measure: `DENTAL`
  - Annual dental visit rates
  - Preventive care access

- **Health Insurance**
  - PLACES measure: `ACCESS2`
  - Lack of health insurance among adults <65
  - Healthcare access indicator

- **Routine Checkups**
  - PLACES measure: `CHECKUP`
  - No annual checkup in past year
  - Primary care utilization

- **Core Preventive Services (Men)**
  - PLACES measure: `COREW`
  - Men age 65+ receiving core services
  - Medicare beneficiary measure

- **Core Preventive Services (Women)**
  - PLACES measure: `COREM`
  - Women age 65+ receiving core services
  - Includes mammography, cervical cancer screening

---

### 5. Risk Factors & Behaviors (17 indicators)

#### Substance Use
- **Smoking (Current)**
  - PLACES measure: `CSMOKING`
  - Current smoking prevalence among adults
  - BRFSS tobacco dataset (trends 1995-2010)
  - Adult tobacco consumption dataset (2000+)
  - Historical data available

- **Binge Drinking**
  - PLACES measure: `BINGE`
  - Binge drinking prevalence
  - Defined as ≥5 drinks (men), ≥4 drinks (women) on one occasion

#### Physical Activity & Sleep
- **Physical Inactivity**
  - PLACES measure: `LPA`
  - No leisure-time physical activity
  - Sedentary behavior measure
  - Nutrition/Physical Activity datasets:
    - Policy/environmental supports
    - Commuting patterns (walking/biking to work)

- **Sleep Deprivation**
  - PLACES measure: `SLEEP`
  - <7 hours sleep per night
  - Population health indicator

#### Cancer Screening (Underutilization)
- **Cervical Cancer Screening**
  - PLACES measure: `CERVICAL`
  - Women age 21-65 who have NOT had screening
  - Preventable cancer indicator

- **Colorectal Cancer Screening**
  - PLACES measure: `COLON_SCREEN`
  - Adults age 50-75 who have NOT had screening
  - Prevention gap measure

- **Mammography**
  - PLACES measure: `MAMMOUSE`
  - Women age 50-74 who have NOT had mammogram
  - Breast cancer screening rates

#### Other Risk Factors
- **Kidney Disease Risk**
  - Associated with diabetes, hypertension
  - CKD prevalence measure

- **Fair/Poor Health Status**
  - PLACES measure: `GHLTH`
  - Self-rated general health
  - Overall population health

- **Frequent Physical Distress**
  - Captured in PHLTH measure
  - Quality of life indicator

- **Frequent Mental Distress**
  - Captured in MHLTH measure
  - Population mental health burden

- **Obesity-Related Risks**
  - Multiple datasets:
    - PLACES obesity measure
    - BRFSS obesity trends
    - Nutrition/physical activity data
  - Environmental/policy factors

- **Cardiovascular Risk Factors**
  - High blood pressure
  - High cholesterol (screening measure)
  - Smoking
  - Diabetes
  - Obesity

---

### 6. Mortality & Vital Statistics (8 categories)

#### Provisional Mortality (VSRR)
- **Leading Causes of Death**
  - 15+ causes tracked:
    - Heart disease
    - Cancer (malignant neoplasms)
    - Chronic lower respiratory diseases
    - Cerebrovascular diseases (stroke)
    - Alzheimer's disease
    - Diabetes
    - Influenza and pneumonia
    - Nephritis (kidney disease)
    - Accidents (unintentional injuries)
    - Suicide
    - Septicemia
    - Chronic liver disease
    - Hypertension
    - Parkinson's disease
    - Pneumonitis

- **Specific Causes**
  - Drug overdose deaths
  - Firearm-related mortality
  - HIV deaths
  - Homicide

- **Maternal Mortality**
  - Provisional maternal death counts
  - Maternal mortality rates per 100,000 live births
  - Quarterly updates

- **Infant Mortality**
  - Quarterly provisional estimates
  - Neonatal and postneonatal deaths
  - State-level data

#### Historical Mortality (NCHS)
- **Death Rates & Life Expectancy**
  - Dataset coverage: 1900-present
  - Age-adjusted death rates
  - Life expectancy at birth
  - Long-term trend analysis

---

### 7. Infectious Diseases (1 category)

- **COVID-19**
  - Case surveillance data (if available)
  - Historical pandemic tracking
  - State/national counts

---

## Data Access Methods

### By Geographic Level

**National Level**
- BRFSS national trends (obesity, diabetes, asthma, tobacco)
- VSRR provisional mortality
- NCHS death rates and life expectancy

**State Level**
- PLACES state aggregations
- BRFSS state-level data
- VSRR state provisional mortality
- Heart disease mortality
- Cancer incidence

**County Level**
- PLACES county data (2023, 2024)
- All 40+ health measures
- Historical comparisons

**City/Place Level**
- PLACES place data (2024)
- City-specific prevalence
- Urban health analysis

**Census Tract Level**
- PLACES tract data (2024)
- Neighborhood-level analysis
- Health disparities research
- Environmental justice

**ZIP Code Level**
- PLACES ZCTA data (2024)
- ZIP code tabulation areas
- Community health assessments

---

## Dataset Summary

### PLACES: Local Data for Better Health (5 datasets)
- **Coverage**: 40 health measures × 5 geographic levels
- **Years**: 2023, 2024
- **Total Data Points**: Millions of records
- **Measures**: All chronic diseases, risk factors, prevention, disabilities

### BRFSS: Behavioral Risk Factor Surveillance (6 datasets)
- **Coverage**: Obesity, diabetes, asthma, tobacco use
- **Historical Range**: 1995-present
- **Geographic**: National and state levels
- **Stratifications**: Age, gender, race/ethnicity available

### VSRR: Vital Statistics Rapid Release (3 datasets)
- **Coverage**: Leading causes of death, maternal mortality, infant mortality
- **Update Frequency**: Quarterly provisional data
- **Timeliness**: Most recent mortality trends
- **Granularity**: State and national

### Nutrition, Physical Activity & Obesity (3 datasets)
- **Coverage**: Behavioral factors, policy/environmental supports, commuting patterns
- **Data Types**: Individual behaviors, community infrastructure, population patterns
- **Policy Analysis**: State/local policy effectiveness

### Other Health Datasets (6 datasets)
- **Heart Disease Mortality**: State-level CVD deaths
- **Diabetes Surveillance**: Comprehensive diabetes indicators
- **COVID-19 Cases**: Pandemic surveillance (if available)
- **Cancer Incidence**: State cancer statistics
- **NCHS Mortality**: Historical death rates since 1900
- **Adult Tobacco**: Consumption trends 2000+

---

## Use Cases

### Public Health Research
- ✅ Disease prevalence mapping
- ✅ Geographic health disparities
- ✅ Temporal trend analysis
- ✅ Risk factor associations
- ✅ Population health assessment

### Clinical Applications
- ✅ Community health needs assessment
- ✅ Target population identification
- ✅ Resource allocation planning
- ✅ Prevention program evaluation
- ✅ Health equity analysis

### Policy & Planning
- ✅ Health policy effectiveness
- ✅ Environmental health factors
- ✅ Infrastructure impact (walkability, food access)
- ✅ State/county comparisons
- ✅ Resource gap identification

### Academic Research
- ✅ Epidemiological studies
- ✅ Social determinants of health
- ✅ Geographic information systems (GIS)
- ✅ Predictive modeling
- ✅ Health outcomes research

---

## How to Query

### Example Queries

**Get diabetes prevalence in California counties:**
```json
{
  "method": "get_places_data",
  "geography_level": "county",
  "year": "2024",
  "state": "CA",
  "measure_id": "DIABETES"
}
```

**Get national obesity trends:**
```json
{
  "method": "get_brfss_data",
  "dataset_type": "obesity_national"
}
```

**Get quarterly mortality for leading causes:**
```json
{
  "method": "search_dataset",
  "dataset_name": "vsrr_quarterly_mortality",
  "limit": 100
}
```

**Get all available health measures:**
```json
{
  "method": "get_available_measures",
  "dataset_name": "places_county_2024"
}
```

---

## Data Quality Notes

### PLACES Data
- **Source**: CDC Division of Population Health
- **Method**: Model-based small area estimates
- **Confidence Intervals**: Provided for all estimates
- **Validation**: Calibrated to BRFSS data
- **Coverage**: 99% of U.S. population

### BRFSS Data
- **Source**: CDC Behavioral Risk Factor Surveillance System
- **Method**: Random-digit-dial telephone survey
- **Sample Size**: 400,000+ adults annually
- **Weighting**: Population-weighted estimates
- **Limitation**: Self-reported data

### VSRR Data
- **Source**: CDC National Vital Statistics System
- **Method**: Death certificates
- **Timeliness**: Provisional (subject to revision)
- **Completeness**: ~60-70% complete at release (improves over time)
- **Update**: Quarterly

### NCHS Data
- **Source**: CDC National Center for Health Statistics
- **Method**: Finalized death certificates
- **Validation**: Gold standard mortality data
- **Historical**: Complete back to 1900
- **Quality**: Final, fully validated

---

## Limitations

### What's Covered ✅
- **40+ health conditions** and risk factors
- **Multiple surveillance systems** (PLACES, BRFSS, VSRR, NCHS)
- **5 geographic levels** (national → ZIP code)
- **Historical trends** (1900-present depending on dataset)
- **Provisional and finalized data**
- **Population-level estimates**

### What's NOT Covered ❌
- **Individual-level data** (all data is aggregated)
- **Youth Risk Behavior Surveillance** (requires special access)
- **STD/HIV surveillance** (requires special access)
- **Foodborne disease surveillance** (NORS - requires access)
- **Healthcare-associated infections** (NHSN - requires access)
- **Vaccine coverage** (VaxView - different system)
- **VAERS adverse events** (hosted on HHS.gov)
- **Birth statistics** (CDC WONDER - different API)
- **Tuberculosis surveillance** (CDC WONDER)

---

## Future Expansion

### Potential Additions (Public Access)
- Additional PLACES years as released
- More BRFSS topic-specific datasets
- Additional VSRR mortality categories
- State-level SMART data (Selected Metropolitan Area Risk Trends)
- Enhanced geographic coverage

### Requires Special Access
- Chronic Disease Indicators (comprehensive)
- BRFSS Demographics
- BRFSS CVD Surveillance
- Youth Risk Behavior Surveillance
- STD/HIV surveillance
- Foodborne disease data

### Different API Architecture
- CDC WONDER (mortality, natality, TB, cancer)
- Requires XML POST requests
- Separate implementation needed

---

## References

- **CDC PLACES**: https://www.cdc.gov/places/
- **CDC BRFSS**: https://www.cdc.gov/brfss/
- **CDC VSRR**: https://www.cdc.gov/nchs/nvss/vsrr.htm
- **CDC WONDER**: https://wonder.cdc.gov/
- **Data Portal**: https://data.cdc.gov
- **Chronic Data**: https://chronicdata.cdc.gov

---

## Conclusion

The CDC MCP server provides **comprehensive disease surveillance coverage** for the most prevalent health conditions in the United States. With **23 public datasets** covering **40+ health measures** at **5 geographic levels**, it enables population health research, clinical applications, policy analysis, and academic studies without requiring authentication or special permissions.

**Coverage**: 30-40% of CDC's public SODA API datasets, focusing on the most valuable disease surveillance data.

**Quality**: Production-ready, tested, and documented for immediate use.
