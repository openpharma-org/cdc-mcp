# New CDC Datasets Discovered - Expansion Plan

**Discovery Date**: 2025-11-28
**Current MCP Coverage**: 23 public datasets
**New Datasets Found**: 33 additional public datasets
**Total After Expansion**: 56 public datasets (143% increase)

---

## Executive Summary

Systematic exploration of CDC's data catalog (data.cdc.gov and chronicdata.cdc.gov) revealed **33 additional publicly accessible datasets** across 11 health domains. All datasets tested successfully with SODA API access.

**Coverage Expansion by Domain**:
- Behavioral Risk Factors: +3 datasets
- Youth Health: +2 datasets
- Respiratory Surveillance: +4 datasets
- Vaccinations: +3 datasets
- Vital Statistics (Birth/Death): +4 datasets
- Oral & Vision Health: +2 datasets
- Environmental Health: +1 dataset
- Tobacco Impact & Policy: +5 datasets
- Injury (TBI/Motor Vehicle): +2 datasets
- Foodborne/Waterborne Disease: +1 dataset
- PLACES Variants: +3 datasets
- Nutrition: +2 datasets
- Infectious Disease: +1 dataset

---

## New Datasets by Category

### 1. Behavioral Risk Factors (3 new datasets)

#### **dttw-5yxu**: BRFSS Prevalence Data (2011-present) ⭐ HIGH PRIORITY
- **Description**: Comprehensive BRFSS data with 30+ health measures across all states
- **Why Add**: More comprehensive than our current BRFSS obesity/diabetes splits
- **Use Cases**: Chronic disease surveillance, state-level prevalence trends
- **Data Points**: 500K+ records
- **Status**: ✅ Tested - PUBLIC

#### **cpem-dkkm**: BRFSS SMART County Prevalence
- **Description**: Metropolitan Area Risk Trends - county-level BRFSS
- **Why Add**: Finer geographic granularity than state-level BRFSS
- **Use Cases**: Urban health disparities, metro area comparisons
- **Status**: ✅ Tested - PUBLIC

#### **t984-9cdv**: BRFSS Health Care Access/Coverage 1995-2010
- **Description**: Historical health insurance and access trends
- **Why Add**: Long-term policy impact analysis
- **Use Cases**: ACA impact studies, access trends over time
- **Status**: ✅ Tested - PUBLIC

---

### 2. Youth Health Surveillance (2 new datasets)

#### **svam-8dhg**: Youth Risk Behavior Surveillance System (YRBSS) - High School ⭐ HIGH PRIORITY
- **Description**: Teen health behaviors: substance use, sexual behaviors, violence, mental health
- **Why Add**: Critical for adolescent health research and prevention programs
- **Use Cases**: Teen suicide prevention, vaping trends, bullying, teen pregnancy
- **Data Points**: 100K+ records across all states
- **Status**: ✅ Tested - PUBLIC

#### **vba9-s8jp**: Nutrition, Physical Activity, Obesity - Youth Risk Behavior
- **Description**: Youth-specific nutrition and physical activity data
- **Why Add**: Complements adult NPAO data we already have
- **Use Cases**: Childhood obesity prevention, school health programs
- **Status**: ✅ Tested - PUBLIC

---

### 3. Respiratory Surveillance (4 new datasets)

#### **kvib-3txy**: RSV/COVID-19/Flu Hospitalizations (Combined) ⭐ HIGH PRIORITY
- **Description**: Integrated respiratory virus hospitalization surveillance
- **Why Add**: Unified respiratory disease monitoring across all three major viruses
- **Use Cases**: Seasonal preparedness, hospital capacity planning, vaccine strategy
- **Status**: ✅ Tested - PUBLIC

#### **29hc-w46k**: RSV Hospitalizations from RSV-NET
- **Description**: RSV-specific hospitalization surveillance network
- **Why Add**: Granular RSV data for infant/elder populations
- **Use Cases**: RSV vaccine uptake analysis, seasonal burden
- **Status**: ✅ Tested - PUBLIC

#### **vh55-3he6**: Influenza Vaccination Coverage (All Ages 6+ Months)
- **Description**: Comprehensive flu vaccination rates by age, race, state
- **Why Add**: Broader than our current vaccination datasets
- **Use Cases**: Vaccination equity analysis, seasonal coverage trends
- **Status**: ✅ Tested - PUBLIC

#### **qvzb-qs6p**: Invasive Pneumococcal Disease 1998-2023
- **Description**: 25-year serotype surveillance for invasive pneumococcal disease
- **Why Add**: Long-term vaccine impact assessment
- **Use Cases**: Pneumococcal vaccine effectiveness, serotype replacement
- **Status**: ✅ Tested - PUBLIC

---

### 4. Vaccinations (3 new datasets)

#### **ee48-w5t6**: Teen Vaccination Coverage (13-17 Years) ⭐ HIGH PRIORITY
- **Description**: Adolescent immunization rates (HPV, Tdap, MenACWY, etc.)
- **Why Add**: Critical for teen vaccine policy and school requirements
- **Use Cases**: HPV vaccination campaigns, school entry requirements
- **Status**: ✅ Tested - PUBLIC

#### **h7pm-wmjc**: Vaccination Coverage among Pregnant Women
- **Description**: Maternal immunization rates (flu, Tdap during pregnancy)
- **Why Add**: Maternal-infant health protection strategies
- **Use Cases**: Prenatal care quality, congenital disease prevention
- **Status**: ✅ Tested - PUBLIC

#### **ijqb-a7ye**: Kindergarten Vaccination Coverage and Exemptions
- **Description**: School entry vaccination rates and exemption trends by state
- **Why Add**: School immunization policy monitoring
- **Use Cases**: Exemption trend analysis, outbreak risk assessment
- **Status**: ✅ Tested - PUBLIC

---

### 5. Vital Statistics - Birth & Death (4 new datasets)

#### **76vv-a7x8**: VSRR Quarterly Birth Indicators ⭐ HIGH PRIORITY
- **Description**: Provisional quarterly birth statistics (rates, cesarean delivery, preterm)
- **Why Add**: Real-time birth trend monitoring
- **Use Cases**: Fertility trends, maternal health outcomes
- **Status**: ✅ Tested - PUBLIC

#### **yt7u-eiyg**: Birth Rates by Age Group
- **Description**: Age-specific fertility rates over time
- **Why Add**: Demographic trend analysis
- **Use Cases**: Family planning, population projections
- **Status**: ✅ Tested - PUBLIC

#### **6rkc-nb2q**: Age-Adjusted Death Rates for Major Causes ⭐ HIGH PRIORITY
- **Description**: Standardized mortality rates for 10+ leading causes of death
- **Why Add**: Long-term mortality trends by cause
- **Use Cases**: Disease burden assessment, mortality trend analysis
- **Status**: ✅ Tested - PUBLIC

#### **qwpv-wpc8**: PRAMStat Data 2009
- **Description**: Pregnancy Risk Assessment Monitoring System (maternal experiences)
- **Why Add**: Maternal health behaviors and experiences during pregnancy
- **Use Cases**: Prenatal care quality, maternal mental health
- **Status**: ✅ Tested - PUBLIC

---

### 6. Oral & Vision Health (2 new datasets)

#### **jz6n-v26y**: NOHSS Adult Oral Health Indicators
- **Description**: National Oral Health Surveillance System - adult indicators
- **Why Add**: Oral health is often neglected in health surveillance
- **Use Cases**: Dental care access, oral cancer screening, tooth loss trends
- **Status**: ✅ Tested - PUBLIC

#### **vkwg-yswv**: Vision and Eye Health Surveillance
- **Description**: BRFSS vision health module (blindness, eye exams, diabetic retinopathy)
- **Why Add**: Vision impairment prevalence and eye care access
- **Use Cases**: Diabetic eye disease, aging vision health
- **Status**: ✅ Tested - PUBLIC

---

### 7. Environmental Health (1 new dataset)

#### **cjae-szjv**: Air Quality - National Environmental Health Tracking ⭐ HIGH PRIORITY
- **Description**: County-level air quality measures (PM2.5, ozone) with health tracking
- **Why Add**: Environmental determinants of health
- **Use Cases**: Asthma burden, air pollution impact on cardiovascular disease
- **Status**: ✅ Tested - PUBLIC

---

### 8. Tobacco Impact & Policy (5 new datasets)

#### **4yyu-3s69**: SAMMEC - Smoking-Attributable Mortality/Morbidity/Economic Costs ⭐ HIGH PRIORITY
- **Description**: Economic burden of smoking (deaths, medical costs, productivity loss)
- **Why Add**: Policy impact assessment, cost-benefit analysis
- **Use Cases**: Tobacco control policy justification, state-level economic impact
- **Status**: ✅ Tested - PUBLIC

#### **ntaa-dtex**: Medicaid Coverage of Cessation Treatments
- **Description**: State Medicaid coverage policies for smoking cessation
- **Why Add**: Cessation treatment access and policy landscape
- **Use Cases**: Medicaid policy analysis, treatment barriers
- **Status**: ✅ Tested - PUBLIC

#### **32fd-hyzc**: STATE System - Smokefree Indoor Air Legislation
- **Description**: State/local smokefree air laws by venue type
- **Why Add**: Tobacco policy tracking
- **Use Cases**: Secondhand smoke exposure reduction, policy effectiveness
- **Status**: ✅ Tested - PUBLIC

#### **eb4y-d4ic**: STATE System - Tobacco Licensure Legislation
- **Description**: Tobacco retail licensing requirements by state
- **Why Add**: Tobacco retail regulation monitoring
- **Use Cases**: Youth access prevention, retailer compliance
- **Status**: ✅ Tested - PUBLIC

#### **2dwv-vfam**: STATE System - Tobacco Tax Legislation
- **Description**: State cigarette and tobacco product tax rates over time
- **Why Add**: Tax policy impact on consumption
- **Use Cases**: Price elasticity studies, revenue projections
- **Status**: ✅ Tested - PUBLIC

---

### 9. Injury & Trauma (2 new datasets)

#### **b4av-siev**: TBI Emergency Department Visits, Hospitalizations, Deaths
- **Description**: Traumatic brain injury surveillance by mechanism and age
- **Why Add**: Injury prevention and trauma system planning
- **Use Cases**: Concussion prevention, fall prevention in elderly
- **Status**: ✅ Tested - PUBLIC

#### **haed-k2ka**: Occupant & Alcohol-Impaired Driving Deaths 2005-2014
- **Description**: Motor vehicle mortality with alcohol involvement
- **Why Add**: Traffic safety interventions
- **Use Cases**: DUI prevention, seatbelt law effectiveness
- **Status**: ✅ Tested - PUBLIC

---

### 10. Foodborne & Waterborne Disease (1 new dataset)

#### **5xkq-dg7x**: NORS - Foodborne/Waterborne Disease Outbreaks
- **Description**: National Outbreak Reporting System for enteric diseases
- **Why Add**: Food safety surveillance
- **Use Cases**: Outbreak investigation, food safety policy
- **Status**: ✅ Tested - PUBLIC

---

### 11. PLACES Variants (3 new datasets)

**Note**: We already have PLACES County 2024 (swc5-untb). These add more geographic levels and years.

#### **qnzd-25i4**: PLACES ZCTA (ZIP Code) 2024
- **Description**: ZIP code-level health measures (same 40+ measures as county)
- **Why Add**: Neighborhood-level health analysis
- **Status**: ✅ Tested - PUBLIC

#### **i46a-9kgh**: PLACES County 2023
- **Description**: Previous year county data for trend analysis
- **Why Add**: Year-over-year change detection
- **Status**: ✅ Tested - PUBLIC

#### **eav7-hnsx**: PLACES Place (City) Data 2024
- **Description**: City-level health measures for incorporated places
- **Why Add**: City-specific health profiles
- **Status**: ✅ Tested - PUBLIC

---

### 12. Nutrition Expanded (2 new datasets)

#### **8hxn-cvik**: NPAO - Breastfeeding (National Immunization Survey)
- **Description**: Breastfeeding initiation and duration rates
- **Why Add**: Infant nutrition surveillance
- **Use Cases**: WIC program evaluation, maternal support services
- **Status**: ✅ Tested - PUBLIC

#### **wan8-w4er**: STATE System - E-Cigarette Smokefree Air Legislation
- **Description**: E-cigarette/vaping product regulations by state
- **Why Add**: Emerging tobacco product policy tracking
- **Use Cases**: Youth vaping prevention, indoor vaping restrictions
- **Status**: ✅ Tested - PUBLIC

---

## Prioritization for Implementation

### Tier 1 - Immediate Add (10 datasets) ⭐
**Rationale**: High impact, fills major gaps, frequently requested

1. **dttw-5yxu** - BRFSS Comprehensive (2011-present)
2. **svam-8dhg** - YRBSS High School
3. **kvib-3txy** - RSV/COVID/Flu Combined Hospitalizations
4. **ee48-w5t6** - Teen Vaccinations
5. **76vv-a7x8** - VSRR Quarterly Birth Indicators
6. **6rkc-nb2q** - Death Rates Major Causes
7. **cjae-szjv** - Air Quality Environmental Health
8. **4yyu-3s69** - SAMMEC Smoking Impact
9. **jz6n-v26y** - Oral Health Indicators
10. **vkwg-yswv** - Vision Health

**Expected Impact**: Adds critical youth health, environmental health, comprehensive BRFSS, unified respiratory surveillance

---

### Tier 2 - High Value (12 datasets)
**Rationale**: Fills specific niches, policy-relevant, good data quality

11. **29hc-w46k** - RSV Hospitalizations
12. **vh55-3he6** - Influenza Vaccination Coverage
13. **h7pm-wmjc** - Pregnant Women Vaccinations
14. **ijqb-a7ye** - Kindergarten Vaccinations
15. **yt7u-eiyg** - Birth Rates by Age
16. **b4av-siev** - TBI Surveillance
17. **32fd-hyzc** - Smokefree Air Legislation
18. **ntaa-dtex** - Medicaid Cessation Coverage
19. **cpem-dkkm** - BRFSS SMART County
20. **vba9-s8jp** - Youth Nutrition/Physical Activity
21. **qvzb-qs6p** - Invasive Pneumococcal Disease
22. **5xkq-dg7x** - Foodborne/Waterborne Outbreaks

---

### Tier 3 - Nice to Have (11 datasets)
**Rationale**: Adds completeness, specific use cases, historical data

23. **qnzd-25i4** - PLACES ZCTA 2024
24. **i46a-9kgh** - PLACES County 2023
25. **eav7-hnsx** - PLACES Place 2024
26. **8hxn-cvik** - Breastfeeding NIS
27. **eb4y-d4ic** - Tobacco Licensure Legislation
28. **2dwv-vfam** - Tobacco Tax Legislation
29. **wan8-w4er** - E-Cigarette Legislation
30. **8235-5d73** - Water Fluoridation
31. **haed-k2ka** - Alcohol-Impaired Driving Deaths
32. **qwpv-wpc8** - PRAMStat 2009
33. **t984-9cdv** - BRFSS Health Care Access 1995-2010

---

## Implementation Roadmap

### Phase 1: Tier 1 Datasets (10 datasets)
**Timeline**: Immediate
**Effort**: 2-3 hours (dataset definitions, method handlers, documentation)
**Testing**: Verify each dataset endpoint, field mappings
**Outcome**: 33 → 43 datasets (+30% coverage)

### Phase 2: Tier 2 Datasets (12 datasets)
**Timeline**: Week 2
**Effort**: 3-4 hours
**Outcome**: 43 → 55 datasets (+66% from baseline)

### Phase 3: Tier 3 Datasets (11 datasets)
**Timeline**: As needed
**Effort**: 3 hours
**Outcome**: 55 → 66 datasets (+187% from baseline)

---

## Technical Implementation Notes

### Code Changes Required

**1. Update `src/constants.ts`**:
```typescript
export const DATASETS = {
  // ... existing 23 datasets ...

  // TIER 1 ADDITIONS (10 datasets)
  brfss_comprehensive: 'dttw-5yxu',
  yrbss_high_school: 'svam-8dhg',
  respiratory_combined: 'kvib-3txy',
  teen_vaccinations: 'ee48-w5t6',
  vsrr_birth_quarterly: '76vv-a7x8',
  death_rates_major_causes: '6rkc-nb2q',
  air_quality_tracking: 'cjae-szjv',
  sammec_smoking_impact: '4yyu-3s69',
  oral_health_indicators: 'jz6n-v26y',
  vision_health: 'vkwg-yswv',

  // TIER 2 ADDITIONS (12 datasets)
  rsv_hospitalizations: '29hc-w46k',
  flu_vaccination_coverage: 'vh55-3he6',
  pregnant_vaccinations: 'h7pm-wmjc',
  kindergarten_vaccinations: 'ijqb-a7ye',
  birth_rates_age: 'yt7u-eiyg',
  tbi_surveillance: 'b4av-siev',
  smokefree_air_legislation: '32fd-hyzc',
  medicaid_cessation_coverage: 'ntaa-dtex',
  brfss_smart_county: 'cpem-dkkm',
  youth_nutrition_activity: 'vba9-s8jp',
  pneumococcal_disease: 'qvzb-qs6p',
  foodborne_outbreaks: '5xkq-dg7x',

  // ... Tier 3 as needed ...
} as const;
```

**2. Add new methods to MCP tool**:
- `get_yrbss_data` - Youth Risk Behavior
- `get_respiratory_surveillance` - Combined RSV/COVID/Flu
- `get_vaccination_coverage` - Teen/pregnant/kindergarten
- `get_birth_statistics` - Birth rates and indicators
- `get_environmental_health` - Air quality tracking
- `get_tobacco_policy` - Legislation and impact
- `get_injury_surveillance` - TBI and motor vehicle
- `get_oral_vision_health` - Oral and vision indicators

**3. Update tool description and schema** in `src/index.ts`

**4. Add method handlers** in `src/cdc-client.ts`

---

## Data Quality Assessment

All 33 datasets tested successfully:
- ✅ HTTP 200 responses
- ✅ JSON format returned
- ✅ No authentication required
- ✅ Rate limit compliance (500ms delay)
- ✅ Data freshness verified (2023-2024 for most)

---

## Expected User Impact

**Research Capabilities Unlocked**:
- Youth health surveillance (YRBSS first-time addition)
- Environmental health determinants (air quality)
- Comprehensive respiratory virus monitoring
- Tobacco policy impact assessment
- Maternal-child health outcomes
- Oral and vision health surveillance
- Foodborne outbreak tracking

**Query Examples Enabled**:
- "What percentage of high school students vape by state?" (YRBSS)
- "How does air quality correlate with asthma prevalence?" (Air Quality + PLACES)
- "What states have comprehensive smokefree air laws?" (Legislation)
- "Compare RSV, flu, and COVID hospitalization rates" (Combined respiratory)
- "Teen HPV vaccination rates by state" (Teen vaccinations)

---

## Next Steps

1. ✅ Discovery complete (33 new datasets identified)
2. ✅ Accessibility testing complete (100% accessible)
3. ⏳ Categorization and prioritization complete (this document)
4. 🔲 Update MCP server code (Tier 1: 10 datasets)
5. 🔲 Test new methods with sample queries
6. 🔲 Update README documentation
7. 🔲 Commit and version bump to v1.1.0

---

**Document Status**: Ready for implementation
**Approval**: Pending user review
**Estimated Total Implementation Time**: 8-10 hours (all 3 tiers)
