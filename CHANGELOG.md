# Changelog

All notable changes to the CDC MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2025-11-28

### Added - Phase 4: Critical Surveillance Gaps
- **NNDSS (National Notifiable Diseases Surveillance System)**: 14 datasets
  - Real-time outbreak detection for 50+ notifiable diseases
  - Arboviral diseases (Zika, West Nile, etc.)
  - Viral hepatitis A, B, C
  - Tuberculosis (current + historical 2014-2019)
  - Rubella, pertussis, haemophilus, Q fever, botulism
  - Method: `get_nndss_surveillance`

- **COVID-19 Vaccination Tracking**: 4 datasets
  - County-level vaccination coverage
  - Equity metrics (SVI, urban/rural classification)
  - State/territory and national tracking
  - Weekly respiratory virus vaccination trends
  - Age-stratified vaccination data
  - Method: `get_covid_vaccination`

- **Drug Overdose Crisis Monitoring**: 6 datasets
  - Provisional state-level overdose deaths
  - County-level overdose mortality
  - Drug-specific tracking (opioid, fentanyl, heroin, cocaine, methamphetamine)
  - Demographic-stratified data
  - Lag-adjusted nowcast estimates
  - Comprehensive injury mortality data
  - Method: `get_overdose_surveillance`

### Changed
- Expanded from 53 to 73 datasets (+38%)
- Expanded from 15 to 18 methods
- Expanded from 15 to 18 surveillance systems
- Updated tool description to highlight real-time surveillance capabilities
- Enhanced README with Phase 4 method documentation

### Impact
- **Transformation**: From chronic disease monitoring → comprehensive public health surveillance
- **New capabilities**: Real-time outbreak detection, vaccination equity analysis, overdose crisis monitoring
- **100% dataset accessibility**: All 20 Phase 4 datasets validated

---

## [1.3.0] - 2025-11-28

### Added - Tier 3 Expansion
- Additional disease-specific surveillance datasets
- Extended coverage for chronic disease monitoring
- Enhanced geographic granularity (ZCTA support)

### Fixed
- Critical ZCTA (ZIP Code Tabulation Area) data retrieval bug
- Improved error handling for geographic queries

### Changed
- Expanded from 45 to 53 datasets
- Improved documentation structure

---

## [1.2.0] - 2025-11-28

### Added - Tier 2 Expansion
- **Injury Surveillance**: TBI tracking by mechanism (falls, motor vehicle, assault, sports)
  - Method: `get_injury_surveillance`
  - Dataset: TBI emergency visits, hospitalizations, deaths

- **Tobacco Policy Tracking**: 5 policy types
  - Method: `get_tobacco_policy`
  - Policies: Smokefree air, licensure, tax, Medicaid cessation, e-cigarette regulation
  - Venue-specific tracking for smokefree air laws

- **Infectious Disease Surveillance**: Pneumococcal and foodborne/waterborne diseases
  - Method: `get_infectious_disease`
  - 25-year serotype data for pneumococcal disease
  - Pathogen-specific tracking

### Changed
- Expanded from 33 to 45 datasets
- Enhanced method count from 12 to 15

---

## [1.1.0] - 2025-11-28

### Added - Tier 1 Expansion: High-Priority Health Surveillance
- **Youth Risk Behavior Surveillance (YRBSS)**
  - Method: `get_yrbss_data`
  - Topics: Substance use, mental health, violence, sexual behaviors, nutrition, physical activity

- **Respiratory Surveillance**
  - Method: `get_respiratory_surveillance`
  - Combined RSV/COVID-19/Flu hospitalization tracking
  - Virus-specific filtering

- **Vaccination Coverage**
  - Method: `get_vaccination_coverage`
  - Age groups: Teen (HPV, Tdap, MenACWY), pregnant women, kindergarten
  - State-level coverage rates

- **Birth Statistics**
  - Method: `get_birth_statistics`
  - VSRR quarterly indicators: Birth rates, preterm birth, cesarean delivery, low birth weight

- **Environmental Health**
  - Method: `get_environmental_health`
  - Air quality tracking (PM2.5, ozone)
  - County-level pollution data with health impacts

- **Tobacco Impact**
  - Method: `get_tobacco_impact`
  - SAMMEC data: Smoking-attributable mortality, morbidity, economic costs

- **Oral and Vision Health**
  - Method: `get_oral_vision_health`
  - NOHSS oral health indicators
  - BRFSS vision module data

### Changed
- Expanded from 23 to 33 datasets
- Added 7 new specialized methods
- Enhanced comprehensive health surveillance coverage

---

## [1.0.0] - 2025-11-27

### Added - Initial Release
- **Core Methods** (5):
  - `list_datasets`: List all available CDC datasets
  - `get_places_data`: PLACES local disease prevalence (40+ health measures)
  - `get_brfss_data`: BRFSS behavioral risk factors
  - `search_dataset`: Generic search with custom SoQL queries
  - `get_available_measures`: List measures for specific datasets

- **Initial Dataset Coverage** (23):
  - PLACES: 5 datasets (county, place, tract, ZCTA)
  - BRFSS: 7 datasets (comprehensive 2011-present + historical)
  - Vital Statistics: 5 datasets
  - Nutrition/Obesity: 3 datasets
  - Disease-Specific: 3 datasets

- **Features**:
  - TypeScript implementation with @modelcontextprotocol/sdk
  - Socrata Open Data API (SODA) integration
  - Rate limiting (500ms delay between requests)
  - App token support (1,000 req/hour with token)
  - SoQL query support (filtering, pagination, sorting)
  - 100% public data (no authentication required)

---

## Future Roadmap

### Potential Enhancements
- Additional equity metrics and health disparity indicators
- Time-series analysis capabilities
- Geographic visualization support
- Automated data quality monitoring
- Enhanced caching strategies

### Dataset Expansion Considerations
- State-level policy tracking datasets
- Social determinants of health (SDOH) datasets
- Healthcare access and quality measures
- Additional notifiable disease surveillance

---

## Notes

- All CDC data is in the public domain
- Data sources: https://data.cdc.gov and https://chronicdata.cdc.gov
- MCP Protocol: https://modelcontextprotocol.io
- Issues: https://github.com/uh-joan/cdc-mcp-server/issues
