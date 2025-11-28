# Missing CDC Datasets - Comprehensive Analysis

## Summary

The current CDC MCP server implementation covers **~15 datasets** but CDC's public data portal has **hundreds** of datasets. This document catalogs what's missing for complete coverage.

---

## 1. BRFSS - Behavioral Risk Factor Surveillance System

### ✅ Currently Implemented (4 datasets)
- `brfss_obesity_national` - National obesity trends
- `brfss_obesity_state` - State obesity prevalence
- `brfss_diabetes` - Diabetes prevalence
- `brfss_asthma` - Asthma prevalence

### ❌ Missing BRFSS Datasets

#### High Priority
- **BRFSS: Table of Chronic Health Indicators**
  - Dataset ID: `u7k3-tu8b`
  - Coverage: 2011-present
  - Description: Combined landline/cell phone prevalence for chronic conditions
  - URL: https://chronicdata.cdc.gov/Behavioral-Risk-Factors/BRFSS-Table-of-Chronic-Health-Indicators/u7k3-tu8b

- **BRFSS: Table of Demographics**
  - Dataset ID: `6rsf-i7tq`
  - Coverage: 2011-present
  - Description: Demographic breakdowns of BRFSS data
  - URL: https://chronicdata.cdc.gov/Behavioral-Risk-Factors/BRFSS-Table-of-Demographics/6rsf-i7tq

- **BRFSS National CVD Surveillance**
  - Dataset ID: `ikwk-8git`
  - Description: Cardiovascular disease and risk factors
  - URL: https://chronicdata.cdc.gov/Heart-Disease-Stroke-Prevention/Behavioral-Risk-Factor-Surveillance-System-BRFSS-N/ikwk-8git

#### Additional BRFSS Datasets to Research
- State-level SMART (Selected Metropolitan/Micropolitan Area Risk Trends) data
- Individual health indicator datasets (there are dozens more)

---

## 2. VSRR - Vital Statistics Rapid Release

### ❌ Currently NOT Implemented

#### Critical Mortality Datasets

- **VSRR Quarterly Provisional Mortality Estimates**
  - Dataset ID: `489q-934x`
  - Coverage: 2023-Q4 2024
  - Indicators: 15 leading causes of death + drug overdose, falls, HIV, homicide, firearms
  - URL: https://data.cdc.gov/NCHS/NCHS-VSRR-Quarterly-provisional-estimates-for-sele/489q-934x

- **VSRR Provisional Maternal Death Counts**
  - Dataset ID: `e2d5-ggg7`
  - Description: Maternal mortality rates per 100,000 live births
  - URL: https://data.cdc.gov/NCHS/VSRR-Provisional-Maternal-Death-Counts-and-Rates/e2d5-ggg7

- **VSRR State/National Provisional Counts**
  - Description: Monthly births, deaths, infant deaths by state
  - Research needed for dataset ID

#### Specific Cause Mortality (Research Needed for IDs)
- Drug overdose deaths
- Firearm-related mortality
- Suicide rates
- COVID-19 deaths (provisional)

---

## 3. Nutrition, Physical Activity & Obesity

### ✅ Currently Implemented
- `nutrition_obesity` - Behavioral risk factors (`hn4x-zwk7`)

### ❌ Missing NPO Datasets

- **Nutrition/Obesity - Policy and Environmental Data**
  - Dataset IDs: `8p3t-sevr` (HealthData.gov) or `k8w5-7ju6` (chronicdata)
  - Description: Policy/environmental supports for physical activity, diet, breastfeeding
  - URL: https://data.cdc.gov/Nutrition-Physical-Activity-and-Obesity/

- **Nutrition/Obesity - American Community Survey Data**
  - Dataset ID: `8mrp-rmkw`
  - Description: Census data on biking/walking to work
  - URL: https://chronicdata.cdc.gov/Nutrition-Physical-Activity-and-Obesity/Nutrition-Physical-Activity-and-Obesity-American-C/8mrp-rmkw

---

## 4. CDC WONDER API - Completely Different Architecture

### ❌ NOT Implemented - Requires Separate Integration

**Challenge:** CDC WONDER uses XML POST requests, not REST/JSON SODA API

**Available Databases:**

#### Mortality
- **Detailed Mortality** - County-level deaths since 1999
- **Compressed Mortality** - County-level deaths since 1979
- **Multiple Cause of Death** - Detailed death certificate data

#### Natality (Births)
- **Natality Database** - County-level birth data 2007-2024
- Birth certificates with demographic details

#### Tuberculosis
- **Online TB Information System** - State/metro TB cases since 1993

#### Cancer
- **U.S. Cancer Statistics** - State-level cancer incidence/mortality
- **Pediatric Cancer** - Childhood cancer data

#### Population
- **Bridged-Race Population** - Census population estimates
- **Postcensal Population** - Intercensal estimates

**API Documentation:** https://wonder.cdc.gov/wonder/help/wonder-api.html

**Key Limitation:** WONDER API only provides **national-level data** (no state/county filtering via API)

**Implementation Notes:**
- Requires XML parsing
- Different authentication/rate limiting model
- Would need separate `CDCWonderClient` class
- Example Python implementation: https://github.com/alipphardt/cdc-wonder-api

---

## 5. Vaccine & Immunization Data

### ❌ Missing Datasets

- **National Immunization Survey (NIS)**
  - Child/teen/adult vaccination coverage
  - COVID vaccination data (NIS-CCM)

- **VaxView Dashboards**
  - Aggregate vaccination coverage by age group
  - Research needed for API access

- **VAERS - Vaccine Adverse Events**
  - **Note:** Hosted on HHS.gov, not CDC
  - URL: https://vaers.hhs.gov/data.html
  - Downloadable CSV files

- **IIS - Immunization Information Systems**
  - Vaccine code sets
  - May not have public API access

---

## 6. Youth Risk Behavior Surveillance (YRBSS)

### ❌ Missing - Major Surveillance System

- High school student health behaviors
- Dataset IDs need research
- Potential API: data.cdc.gov

---

## 7. STD/HIV Surveillance

### ❌ Missing

- **Atlas Plus** - HIV surveillance
- **STD Surveillance Data** - Syphilis, gonorrhea, chlamydia
- Dataset IDs need research

---

## 8. Foodborne & Healthcare-Associated Infections

### ❌ Missing

- **FoodNet** - Foodborne disease surveillance
- **NORS** - Norovirus outbreak surveillance
- **NHSN** - Healthcare-associated infection data
- Dataset IDs need research

---

## 9. Other NCHS Datasets

### ❌ Potentially Missing

- **NHANES** - National Health and Nutrition Examination Survey
- **NHIS** - National Health Interview Survey
- These may not be on data.cdc.gov (separate systems)

---

## 10. Chronic Disease Indicators

### ⚠️ Partially Implemented

- Dataset ID: `g4ie-h725`
- **Issue:** Requires authentication (403 Forbidden)
- Currently commented out in code
- Need to investigate authentication requirements

---

## Implementation Priority

### **Tier 1: Quick Wins (Same SODA API)**

Add these dataset IDs to existing `cdc_client.py`:

```python
DATASETS = {
    # ... existing datasets ...

    # BRFSS additions
    "brfss_chronic_health_indicators": "u7k3-tu8b",
    "brfss_demographics": "6rsf-i7tq",
    "brfss_cvd_surveillance": "ikwk-8git",

    # VSRR mortality
    "vsrr_quarterly_mortality": "489q-934x",
    "vsrr_maternal_mortality": "e2d5-ggg7",

    # Nutrition additions
    "nutrition_policy_environmental": "k8w5-7ju6",
    "nutrition_commute_patterns": "8mrp-rmkw",
}
```

**Effort:** 1-2 hours
**Impact:** 7+ new datasets

### **Tier 2: CDC WONDER Integration**

Requires new client class with XML POST support:

```python
class CDCWonderClient:
    """Client for CDC WONDER XML API"""

    def query_mortality(self, ...):
        # Build XML request
        # POST to wonder.cdc.gov
        # Parse XML response
        pass
```

**Effort:** 4-8 hours
**Impact:** Access to major mortality, natality, TB, cancer databases

### **Tier 3: Research & Add**

Research dataset IDs for:
- YRBSS
- STD/HIV surveillance
- Foodborne diseases
- Vaccine data (if API-accessible)

**Effort:** Variable (4-12 hours)

---

## Rate Limiting Considerations

**Current Implementation:** 500ms delay between requests

**WONDER API:** Recommended 2-minute intervals between queries

**Recommendation:**
- Keep SODA API rate limiting as-is
- Implement separate, more conservative rate limiting for WONDER (if added)

---

## Authentication Issues

### Datasets Requiring Auth

Some datasets return 403 Forbidden without authentication:
- Chronic Disease Indicators (`g4ie-h725`)

### Solution Options

1. **Socrata App Token** - Register at data.cdc.gov/profile/app_tokens
   - Increases rate limits
   - May grant access to restricted datasets

2. **Document Limitations** - Clearly note which datasets require auth

---

## Testing Recommendations

Before adding new datasets:

1. Test dataset accessibility: `curl https://data.cdc.gov/resource/{id}.json?$limit=1`
2. Verify data structure matches expected format
3. Check for authentication requirements (403 errors)
4. Test pagination for large datasets
5. Validate field names match documentation

---

## Documentation Updates Needed

Once datasets are added:

1. Update `DATASETS` dict in `cdc_client.py`
2. Update README.md with new data sources
3. Add examples for new dataset types
4. Update tool description in `server.py`
5. Create skill discovery entries for agentic-os integration

---

## Estimated Complete Coverage

**Current:** ~15 datasets
**Tier 1 additions:** ~7 datasets = **22 total**
**Tier 2 (WONDER):** ~10+ databases = **32+ total**
**Tier 3 additions:** ~10-20 datasets = **42-52 total**

**Time to comprehensive coverage:** 16-30 hours of development work
