# CDC MCP Server

A comprehensive Node.js MCP (Model Context Protocol) server providing access to CDC (Centers for Disease Control and Prevention) public health data through the Socrata Open Data API (SODA).

**Version**: 1.4.0
**Total Datasets**: 73 (no authentication required)
**Surveillance Systems**: 18 different CDC programs
**Health Measures**: 100+ indicators across chronic disease, behavioral risk, environmental health, outbreak detection, vaccination, and drug overdose

## Features

- **TypeScript Implementation**: Built with @modelcontextprotocol/sdk
- **Comprehensive Coverage**: 73 public datasets across 18 surveillance systems
- **Unified Interface**: Single tool with 18 specialized methods
- **Real-Time Surveillance**: NNDSS outbreak detection for 50+ notifiable diseases
- **COVID-19 Vaccination**: County-level tracking with equity metrics (SVI, urban/rural)
- **Drug Overdose Crisis**: Real-time monitoring with drug-specific tracking (fentanyl, opioids)
- **Rate Limiting**: Built-in rate limiting (500ms delay) to respect API quotas
- **App Token Support**: Enhanced rate limits (1,000 requests/hour) with valid app token
- **Flexible Querying**: Support for filtering, pagination, and custom SoQL queries
- **100% Public Data**: All datasets accessible without authentication

## Available Data Sources

### Dataset Coverage (73 Total)

| Category | Datasets | Key Features |
|----------|----------|--------------|
| **PLACES** | 5 | County, place, tract, ZCTA (40+ health measures) |
| **BRFSS** | 7 | Comprehensive 2011-present + historical 1995-2010 |
| **YRBSS** | 2 | Youth health surveillance (substance use, mental health) |
| **Respiratory** | 2 | Combined RSV/COVID/Flu + RSV-specific |
| **Vaccination** | 5 | Teen, pregnant, kindergarten, flu all ages, RSV |
| **Vital Statistics** | 5 | Birth, death, maternal, infant statistics |
| **Environmental** | 2 | Air quality, water fluoridation |
| **Tobacco** | 6 | Economic impact + 5 policy types |
| **Injury** | 2 | TBI surveillance, alcohol-impaired driving |
| **Infectious Disease** | 2 | Pneumococcal, foodborne/waterborne |
| **Maternal-Child** | 3 | Breastfeeding, PRAMS, birth statistics |
| **Oral/Vision** | 2 | NOHSS oral health, BRFSS vision |
| **Nutrition** | 3 | Behavioral, policy, youth-specific |
| **Disease-Specific** | 4 | Heart disease, diabetes, cancer, COVID |
| **Historical** | 1 | Pre-ACA health care access (1995-2010) |
| **🔥 NNDSS** | **14** | **Real-time outbreak detection (50+ notifiable diseases)** |
| **🔥 COVID-19 Vaccination** | **4** | **County-level tracking with equity metrics** |
| **🔥 Drug Overdose** | **6** | **Provisional + finalized overdose data by drug type** |

## Installation

```bash
git clone https://github.com/openpharma-org/cdc-mcp
cd cdc-mcp-server
npm install
npm run build
```

## Configuration

### MCP Client Setup

Add to your MCP client configuration (`.mcp.json` or Claude Code settings):

```json
{
  "mcpServers": {
    "cdc-mcp-server": {
      "command": "node",
      "args": ["/path/to/cdc-mcp-server/build/index.js"],
      "env": {
        "CDC_APP_TOKEN": "your_app_token_here"
      }
    }
  }
}
```

**Note**: The `CDC_APP_TOKEN` environment variable is optional but recommended for enhanced rate limits (1,000 req/hour vs shared pool).

### Getting an App Token (Optional)

For enhanced rate limits:
1. Register at https://data.cdc.gov/profile/app_tokens
2. Create a new app token
3. Add to your configuration

## MCP Methods

### Core Methods (5)

#### 1. `list_datasets`
List all 53 available CDC datasets.

```json
{
  "method": "list_datasets"
}
```

#### 2. `get_places_data`
Get PLACES local disease prevalence data (40+ health measures).

**Parameters**:
- `geography_level`: "county", "place", "tract", "zcta" (default: "county")
- `year`: "2023", "2024" (default: "2024")
- `state`: State abbreviation (e.g., "CA", "TX")
- `measure_id`: Disease measure (e.g., "DIABETES", "OBESITY", "CHD")
- `location`: Specific location name
- `limit`: Max results (default: 100)
- `offset`: Pagination offset (default: 0)

**Example**:
```json
{
  "method": "get_places_data",
  "geography_level": "county",
  "year": "2024",
  "state": "CA",
  "measure_id": "DIABETES"
}
```

#### 3. `get_brfss_data`
Get BRFSS behavioral risk factor data.

**Parameters**:
- `dataset_type`: "obesity_national", "obesity_state", "diabetes", "asthma"
- `year`: Specific year
- `state`: State abbreviation
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_brfss_data",
  "dataset_type": "diabetes",
  "year": 2023,
  "state": "NY"
}
```

#### 4. `search_dataset`
Generic search across any CDC dataset with custom SoQL queries.

**Parameters**:
- `dataset_name`: Dataset identifier (required)
- `select_fields`: Fields to return
- `where_clause`: SoQL WHERE clause
- `order_by`: Sort field
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "search_dataset",
  "dataset_name": "breastfeeding_nis",
  "where_clause": "state='Texas'",
  "limit": 100
}
```

#### 5. `get_available_measures`
List all available measures for a specific dataset.

**Example**:
```json
{
  "method": "get_available_measures",
  "dataset_name": "places_county_2024"
}
```

---

### Tier 1 Methods: High-Priority Health Surveillance (7)

#### 6. `get_yrbss_data`
Youth Risk Behavior Surveillance (substance use, mental health, violence).

**Parameters**:
- `state`: State abbreviation
- `topic`: "substance_use", "mental_health", "violence", "sexual_behaviors", "nutrition", "physical_activity"
- `year`: Survey year
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_yrbss_data",
  "state": "CA",
  "topic": "mental_health",
  "year": 2023
}
```

#### 7. `get_respiratory_surveillance`
Combined RSV/COVID-19/Flu hospitalization surveillance.

**Parameters**:
- `virus`: "rsv", "covid", "flu", "combined" (default: "combined")
- `state`: Jurisdiction
- `year`: Year filter
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_respiratory_surveillance",
  "virus": "rsv",
  "state": "NY",
  "year": 2024
}
```

#### 8. `get_vaccination_coverage`
Vaccination rates by age group.

**Parameters**:
- `age_group`: "teen", "pregnant", "kindergarten" (required)
- `state`: State abbreviation
- `vaccine_type`: "hpv", "tdap", "menacwy", "flu"
- `year`: Survey year
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_vaccination_coverage",
  "age_group": "teen",
  "state": "TX",
  "vaccine_type": "hpv",
  "year": 2023
}
```

#### 9. `get_birth_statistics`
Birth rates and birth outcome indicators.

**Parameters**:
- `indicator`: "birth_rate", "preterm", "cesarean", "low_birth_weight"
- `state`: Jurisdiction
- `year`: Year filter
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_birth_statistics",
  "indicator": "preterm",
  "state": "CA",
  "year": 2024
}
```

#### 10. `get_environmental_health`
Air quality measures with health tracking.

**Parameters**:
- `pollutant`: "pm25", "ozone", "combined" (default: "combined")
- `state`: State filter
- `county`: County name
- `year`: Year filter
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_environmental_health",
  "pollutant": "pm25",
  "county": "Los Angeles",
  "year": 2023
}
```

#### 11. `get_tobacco_impact`
Smoking-attributable mortality, morbidity, and economic costs.

**Parameters**:
- `impact_type`: "mortality", "morbidity", "economic_cost"
- `state`: State abbreviation
- `year`: Year filter
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_tobacco_impact",
  "impact_type": "economic_cost",
  "state": "OH",
  "year": 2022
}
```

#### 12. `get_oral_vision_health`
Oral and vision health surveillance.

**Parameters**:
- `health_domain`: "oral", "vision" (required)
- `state`: State abbreviation
- `year`: Year filter
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_oral_vision_health",
  "health_domain": "oral",
  "state": "FL",
  "year": 2023
}
```

---

### Tier 2 Methods: Policy-Relevant & Niche Specializations (3)

#### 13. `get_injury_surveillance`
TBI surveillance - emergency visits, hospitalizations, deaths by mechanism.

**Parameters**:
- `injury_type`: "tbi", "motor_vehicle", "all" (default: "tbi")
- `state`: State abbreviation
- `mechanism`: "fall", "motor_vehicle", "assault", "sports", "all"
- `year`: Year filter
- `limit`, `offset`: Pagination

**Example**:
```json
{
  "method": "get_injury_surveillance",
  "injury_type": "tbi",
  "mechanism": "fall",
  "state": "FL",
  "year": 2022
}
```

#### 14. `get_tobacco_policy`
Tobacco control policy tracking (5 policy types supported).

**Parameters**:
- `policy_type`: "smokefree_air", "medicaid_cessation", "licensure", "tax", "ecigarette" (required)
- `state`: State abbreviation
- `venue`: "workplace", "restaurant", "bar", "government", "school", "all" (for smokefree_air only)
- `year`: Year filter
- `limit`, `offset`: Pagination

**Examples**:

Smokefree air legislation:
```json
{
  "method": "get_tobacco_policy",
  "policy_type": "smokefree_air",
  "venue": "restaurant",
  "state": "CA"
}
```

Tobacco tax legislation:
```json
{
  "method": "get_tobacco_policy",
  "policy_type": "tax",
  "state": "NY",
  "year": 2023
}
```

E-cigarette regulation:
```json
{
  "method": "get_tobacco_policy",
  "policy_type": "ecigarette",
  "state": "MA"
}
```

#### 15. `get_infectious_disease`
Infectious disease surveillance (pneumococcal, foodborne, waterborne).

**Parameters**:
- `disease`: "pneumococcal", "foodborne", "waterborne" (required)
- `state`: State abbreviation
- `serotype`: Pneumococcal serotype filter (e.g., "19A", "3")
- `pathogen`: Pathogen name for foodborne/waterborne (e.g., "Salmonella", "E. coli")
- `year`: Year filter
- `limit`, `offset`: Pagination

**Examples**:

Pneumococcal disease by serotype:
```json
{
  "method": "get_infectious_disease",
  "disease": "pneumococcal",
  "serotype": "19A",
  "year": 2023
}
```

Foodborne outbreaks:
```json
{
  "method": "get_infectious_disease",
  "disease": "foodborne",
  "pathogen": "Salmonella",
  "state": "TX"
}
```

---

### Phase 4 Methods: Critical Surveillance Gaps (3)

#### 16. `get_nndss_surveillance`
National Notifiable Diseases Surveillance System - real-time outbreak detection for 50+ diseases.

**Parameters**:
- `nndss_disease`: "arboviral", "hepatitis", "tuberculosis", "rubella", "pertussis", "haemophilus", "qfever", "botulism", "all" (default: "all")
- `year`: Year filter (for historical TB data: 2014-2019)
- `state`: State abbreviation
- `limit`, `offset`: Pagination

**Examples**:

Arboviral disease surveillance:
```json
{
  "method": "get_nndss_surveillance",
  "nndss_disease": "arboviral",
  "state": "FL",
  "year": "2024"
}
```

Historical tuberculosis data:
```json
{
  "method": "get_nndss_surveillance",
  "nndss_disease": "tuberculosis",
  "year": "2019",
  "state": "CA"
}
```

#### 17. `get_covid_vaccination`
COVID-19 vaccination tracking with equity metrics.

**Parameters**:
- `vax_geography`: "national", "state", "county" (default: "state")
- `state`: State abbreviation
- `county`: County name
- `equity_metrics`: Include SVI and urban/rural classification (boolean)
- `limit`, `offset`: Pagination

**Examples**:

State-level vaccination rates:
```json
{
  "method": "get_covid_vaccination",
  "vax_geography": "state",
  "state": "TX"
}
```

County-level with equity metrics:
```json
{
  "method": "get_covid_vaccination",
  "vax_geography": "county",
  "state": "NY",
  "county": "New York",
  "equity_metrics": true
}
```

#### 18. `get_overdose_surveillance`
Drug overdose crisis monitoring with drug-specific tracking.

**Parameters**:
- `overdose_geography`: "national", "state", "county" (default: "state")
- `drug_type`: "opioid", "fentanyl", "heroin", "cocaine", "methamphetamine", "all" (default: "all")
- `provisional`: Use provisional data (true) or finalized (false) - default: true
- `state`: State abbreviation
- `county`: County name
- `limit`, `offset`: Pagination

**Examples**:

Fentanyl overdoses by state:
```json
{
  "method": "get_overdose_surveillance",
  "overdose_geography": "state",
  "drug_type": "fentanyl",
  "state": "OH",
  "provisional": true
}
```

County-level opioid deaths:
```json
{
  "method": "get_overdose_surveillance",
  "overdose_geography": "county",
  "drug_type": "opioid",
  "county": "Alameda",
  "state": "CA"
}
```

All overdoses (finalized data):
```json
{
  "method": "get_overdose_surveillance",
  "overdose_geography": "national",
  "drug_type": "all",
  "provisional": false
}
```

---

## Common PLACES Measure IDs

### Chronic Diseases
- `DIABETES`: Diagnosed diabetes
- `OBESITY`: Adult obesity (BMI ≥30)
- `CHD`: Coronary heart disease
- `COPD`: Chronic obstructive pulmonary disease
- `ASTHMA`: Current asthma
- `STROKE`: Stroke
- `BPHIGH`: High blood pressure
- `CANCER`: Cancer (excluding skin cancer)
- `KIDNEY`: Chronic kidney disease
- `ARTHRITIS`: Arthritis

### Mental Health
- `DEPRESSION`: Depression
- `MHLTH`: Mental health not good for ≥14 days

### Prevention
- `DENTAL`: Annual dental visit
- `ACCESS2`: Lack of health insurance (adults <65)
- `CHECKUP`: No annual checkup
- `CHOLSCREEN`: Cholesterol screening
- `CERVICAL`: Cervical cancer screening
- `COLON_SCREEN`: Colorectal cancer screening
- `MAMMOUSE`: Mammography

### Risk Factors
- `CSMOKING`: Current smoking
- `BINGE`: Binge drinking
- `LPA`: No leisure-time physical activity
- `SLEEP`: Sleep <7 hours

## Dataset Reference

### Complete Dataset List (73)

<details>
<summary>Click to expand full dataset list</summary>

**PLACES (5 datasets)**:
- `places_county_2024` - County-level 2024
- `places_county_2023` - County-level 2023
- `places_place_2024` - City/town-level 2024
- `places_tract_2024` - Census tract-level 2024
- `places_zcta_2024` - ZIP code-level 2024

**BRFSS (7 datasets)**:
- `brfss_comprehensive` - 2011-present (30+ measures)
- `brfss_obesity_national` - National obesity trends
- `brfss_obesity_state` - State obesity prevalence
- `brfss_diabetes` - Diabetes prevalence
- `brfss_asthma` - Asthma prevalence
- `brfss_smart_county` - Metropolitan county-level
- `brfss_healthcare_access_historical` - 1995-2010

**Youth Health (2 datasets)**:
- `yrbss_high_school` - Youth risk behaviors
- `youth_nutrition_activity` - Youth nutrition/activity

**Respiratory (2 datasets)**:
- `respiratory_combined` - RSV/COVID/Flu combined
- `rsv_hospitalizations` - RSV-specific

**Vaccination (5 datasets)**:
- `teen_vaccinations` - HPV, Tdap, MenACWY
- `flu_vaccination_coverage` - All ages 6+ months
- `pregnant_vaccinations` - Flu, Tdap during pregnancy
- `kindergarten_vaccinations` - School entry rates

**Vital Statistics (5 datasets)**:
- `vsrr_birth_quarterly` - Birth indicators
- `birth_rates_age` - Age-specific fertility
- `vsrr_quarterly_mortality` - Mortality estimates
- `vsrr_maternal_mortality` - Maternal deaths
- `vsrr_infant_mortality` - Infant mortality

**Environmental (2 datasets)**:
- `air_quality_tracking` - PM2.5, ozone
- `water_fluoridation` - Fluoridation statistics

**Tobacco (6 datasets)**:
- `sammec_smoking_impact` - Economic costs
- `smokefree_air_legislation` - Smokefree laws
- `medicaid_cessation_coverage` - Cessation coverage
- `tobacco_licensure` - Retailer licensure
- `tobacco_tax` - Tax legislation
- `ecigarette_legislation` - E-cigarette regulation

**Injury (2 datasets)**:
- `tbi_surveillance` - TBI surveillance
- `alcohol_impaired_driving` - Drunk driving deaths

**Infectious Disease (2 datasets)**:
- `pneumococcal_disease` - 25-year serotype data
- `foodborne_outbreaks` - Foodborne/waterborne

**Maternal-Child (3 datasets)**:
- `breastfeeding_nis` - Breastfeeding rates
- `pramstat_2009` - PRAMS 2009

**Oral/Vision (2 datasets)**:
- `oral_health_indicators` - NOHSS
- `vision_health` - BRFSS vision module

**Nutrition (3 datasets)**:
- `nutrition_obesity` - Behavioral
- `nutrition_policy_environmental` - Policy/environmental
- `nutrition_commute_patterns` - Commuting

**Disease-Specific (4 datasets)**:
- `heart_disease_mortality` - Heart disease
- `diabetes_indicators` - Diabetes surveillance
- `cancer_incidence` - Cancer statistics
- `covid_cases` - COVID-19

**Historical (1 dataset)**:
- Already listed under BRFSS

**NNDSS - National Notifiable Diseases Surveillance (14 datasets)**:
- `nndss_arboviral` - Arboviral diseases (Zika, West Nile, etc.)
- `nndss_hepatitis` - Viral hepatitis A, B, C
- `nndss_tuberculosis` - Current TB surveillance
- `nndss_rubella` - Rubella and congenital rubella
- `nndss_pertussis` - Whooping cough surveillance
- `nndss_haemophilus` - Haemophilus influenzae disease
- `nndss_qfever` - Q fever surveillance
- `nndss_botulism` - Botulism surveillance
- `nndss_tb_2019` - Historical TB 2019
- `nndss_tb_2018` - Historical TB 2018
- `nndss_tb_2017` - Historical TB 2017
- `nndss_tb_2016` - Historical TB 2016
- `nndss_tb_2015` - Historical TB 2015
- `nndss_tb_2014` - Historical TB 2014

**COVID-19 Vaccination (4 datasets)**:
- `covid_vax_jurisdiction` - State/territory vaccination rates
- `covid_vax_county` - County-level vaccination coverage
- `covid_vax_respiratory_weekly` - Weekly respiratory virus vaccination
- `covid_vax_age_trends` - Age-stratified vaccination trends

**Drug Overdose Surveillance (6 datasets)**:
- `overdose_provisional_state` - Provisional state-level overdose deaths
- `overdose_county` - County-level overdose mortality
- `overdose_by_drug` - Drug-specific overdose deaths
- `overdose_demographics` - Demographic-stratified overdose data
- `overdose_nowcast` - Lag-adjusted overdose estimates
- `nchs_injury_mortality` - Comprehensive injury mortality data

</details>

## Rate Limiting

The server implements conservative rate limiting (500ms between requests):

- **Without app token**: Shared pool (may be throttled)
- **With app token**: 1,000 requests/hour

To increase limits, register for a free app token at https://data.cdc.gov/profile/app_tokens

## Response Format

All methods return JSON with consistent structure:

```json
{
  "dataset": "places_county_2024",
  "count": 58,
  "data": [
    {
      "year": "2022",
      "stateabbr": "CA",
      "locationname": "Los Angeles County",
      "measureid": "DIABETES",
      "data_value": "11.2",
      "data_value_unit": "%",
      "low_confidence_limit": "10.8",
      "high_confidence_limit": "11.6"
    }
  ]
}
```

## SoQL Query Language

CDC datasets support Socrata Query Language (SoQL):

### Common Parameters
- `$select`: Choose specific fields
- `$where`: Filter conditions
- `$order`: Sort results
- `$limit`: Max results
- `$offset`: Pagination start

### Example SoQL Clauses

**Filtering**:
```
stateabbr='CA' AND data_value>15.0
year>=2020 AND year<=2024
measureid IN ('DIABETES', 'OBESITY', 'CHD')
```

**Sorting**:
```
data_value DESC
year ASC, data_value DESC
```

## Error Handling

The server handles common errors gracefully:
- **Rate limiting**: Clear message if rate limit exceeded
- **Invalid parameters**: Parameter validation
- **Network errors**: Automatic retries with exponential backoff
- **Data not found**: Returns empty result set

## Development

### Building from Source

```bash
npm install
npm run build
```

### Running in Dev Mode

```bash
npm run dev  # Watch mode
```

## Data Sources

All data comes from official CDC sources:
- https://data.cdc.gov
- https://chronicdata.cdc.gov

Data is provided by CDC and is in the public domain.

## Version History

- **v1.4.0** (2025-11-28): Phase 4 Complete - Critical surveillance gaps filled - 73 datasets total
  - ✅ NNDSS: 14 datasets for real-time outbreak detection (50+ notifiable diseases)
  - ✅ COVID-19 Vaccination: 4 datasets with county-level tracking and equity metrics
  - ✅ Drug Overdose: 6 datasets with provisional data and drug-specific tracking
  - 🔥 **Transformation**: From chronic disease monitoring → comprehensive public health surveillance
- **v1.3.0** (2025-11-28): Tier 3 expansion + critical ZCTA fix - 53 datasets total
- **v1.2.0** (2025-11-28): Tier 2 expansion - 45 datasets
- **v1.1.0** (2025-11-28): Tier 1 expansion - 33 datasets
- **v1.0.0**: Initial release - 23 datasets

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions welcome! Please submit issues and pull requests.

## Support

- **CDC Data Questions**: https://www.cdc.gov/about/data-policy/
- **MCP Server Issues**: https://github.com/openpharma-org/cdc-mcp/issues
- **MCP Protocol**: https://modelcontextprotocol.io

## Acknowledgments

- CDC for providing open data through Socrata
- Anthropic for the Model Context Protocol specification
- Contributors to the open-source community
