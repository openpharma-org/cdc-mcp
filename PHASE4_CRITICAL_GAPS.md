# Phase 4: Critical Surveillance Gaps - Implementation Plan

**Target**: Real-time outbreak detection + overdose crisis monitoring
**Datasets to Add**: 20 (NNDSS + COVID Vaccination + Drug Overdose)
**Estimated Effort**: 3-4 days
**Priority**: 🔴 CRITICAL

---

## Executive Summary

Current implementation (v1.3.0) added 30 excellent datasets but **missed the most critical real-time surveillance capabilities**:

- ❌ **Zero outbreak detection** (no NNDSS)
- ❌ **Zero COVID vaccination tracking** (no county-level equity analysis)
- ❌ **Zero overdose crisis monitoring** (no fentanyl/opioid tracking)

Phase 4 addresses these critical gaps with 20 high-impact datasets.

---

## Critical Gap #1: NNDSS - Disease Outbreak Detection

### Problem
**No real-time disease surveillance** - Cannot detect outbreaks of notifiable diseases

### Solution: Add 14 NNDSS Datasets

#### Current Surveillance (8 datasets - Weekly Provisional)

| Disease Category | Dataset ID | Update | Records | Priority |
|------------------|-----------|--------|---------|----------|
| **Arboviral Diseases** | `4ewf-ciy6` | Weekly | ~5K | 🔴 HIGH |
| **Hepatitis (A, B, C)** | `xna8-x7qg` | Weekly | ~8K | 🔴 HIGH |
| **Tuberculosis** | `tfu6-pjxh` | Weekly | ~15K | 🔴 HIGH |
| **Rubella** | `2khz-k7sv` | Weekly | ~1K | 🟡 MEDIUM |
| **Pertussis** | `247v-f7n9` | Weekly | ~12K | 🔴 HIGH |
| **Haemophilus influenzae** | `cvcu-witw` | Weekly | ~2K | 🟡 MEDIUM |
| **Q Fever** | `tdge-ieq8` | Weekly | ~500 | 🟢 LOW |
| **Botulism** | `qwf3-87ny` | Weekly | ~300 | 🟢 LOW |

#### Historical Surveillance (6 datasets - TB Trends)

| Disease | Dataset ID | Year | Records | Priority |
|---------|-----------|------|---------|----------|
| Tuberculosis | `5avu-ff58` | 2019 | ~3K | 🟡 MEDIUM |
| Tuberculosis | `u3yt-gdfa` | 2018 | ~3K | 🟡 MEDIUM |
| Tuberculosis | `9g7x-sfq4` | 2017 | ~3K | 🟡 MEDIUM |
| Tuberculosis | `pkas-xr96` | 2016 | ~3K | 🟢 LOW |
| Tuberculosis | `ei7y-3g6s` | 2015 | ~3K | 🟢 LOW |
| Tuberculosis | `pxa6-asqb` | 2014 | ~3K | 🟢 LOW |

**Total**: 14 datasets covering 50+ notifiable diseases

### Implementation

#### Step 1: Add to `constants.ts` (25 lines)

```typescript
// === PHASE 4: NNDSS SURVEILLANCE (14 datasets) ===

// NNDSS: National Notifiable Diseases Surveillance System
nndss_arboviral: '4ewf-ciy6',              // Arboviral diseases (West Nile, encephalitis)
nndss_hepatitis: 'xna8-x7qg',              // Hepatitis A, B, C (acute + perinatal)
nndss_tuberculosis: 'tfu6-pjxh',           // Tuberculosis (weekly provisional 2020-2022)
nndss_rubella: '2khz-k7sv',                // Rubella & congenital rubella syndrome
nndss_pertussis: '247v-f7n9',              // Pertussis & poliomyelitis
nndss_haemophilus: 'cvcu-witw',            // Haemophilus influenzae (invasive disease)
nndss_qfever: 'tdge-ieq8',                 // Q fever (acute & chronic)
nndss_botulism: 'qwf3-87ny',               // Botulism (foodborne, infant, wound)

// NNDSS Historical (TB Trends)
nndss_tb_2019: '5avu-ff58',
nndss_tb_2018: 'u3yt-gdfa',
nndss_tb_2017: '9g7x-sfq4',
nndss_tb_2016: 'pkas-xr96',
nndss_tb_2015: 'ei7y-3g6s',
nndss_tb_2014: 'pxa6-asqb',
```

#### Step 2: Add to `types.ts` (10 lines)

```typescript
// Phase 4 Method
| 'get_nndss_surveillance'

// NNDSS parameters
disease?: 'arboviral' | 'hepatitis' | 'tuberculosis' | 'rubella' | 'pertussis' |
          'haemophilus' | 'qfever' | 'botulism' | 'all';
```

#### Step 3: Add to `cdc-client.ts` (40 lines)

```typescript
async getNNDSSSurveillance(request: {
  disease?: string;
  year?: string;
  state?: string;
  limit: number;
  offset: number;
}): Promise<CDCResponse> {
  const { disease = 'all', year, state, limit, offset } = request;

  // Dataset mapping
  const datasetMap: Record<string, string> = {
    arboviral: DATASETS.nndss_arboviral,
    hepatitis: DATASETS.nndss_hepatitis,
    tuberculosis: year
      ? DATASETS[`nndss_tb_${year}` as keyof typeof DATASETS] || DATASETS.nndss_tuberculosis
      : DATASETS.nndss_tuberculosis,
    rubella: DATASETS.nndss_rubella,
    pertussis: DATASETS.nndss_pertussis,
    haemophilus: DATASETS.nndss_haemophilus,
    qfever: DATASETS.nndss_qfever,
    botulism: DATASETS.nndss_botulism,
  };

  const datasetId = datasetMap[disease] || DATASETS.nndss_tuberculosis;

  // Build query
  let query = `${CDC_BASE_URL}/${datasetId}.json?$limit=${limit}&$offset=${offset}`;

  if (state) {
    query += `&$where=reporting_area='${state.toUpperCase()}'`;
  }

  await this.rateLimit();
  const response = await this.axiosInstance.get(query);

  return {
    dataset: disease,
    count: response.data.length,
    data: response.data,
  };
}
```

#### Step 4: Add to `index.ts` tool schema (15 lines)

```typescript
// In method enum
| 'get_nndss_surveillance'

// In parameters
disease: {
  type: 'string',
  enum: ['arboviral', 'hepatitis', 'tuberculosis', 'rubella', 'pertussis',
         'haemophilus', 'qfever', 'botulism', 'all'],
  description: 'For get_nndss_surveillance: Notifiable disease category',
},

// In handler
case 'get_nndss_surveillance':
  result = await cdcClient.getNNDSSSurveillance({
    disease: params.disease || 'all',
    year: params.year,
    state: params.state,
    limit: params.limit || 100,
    offset: params.offset || 0,
  });
  break;
```

**Total Code**: ~90 lines

---

## Critical Gap #2: COVID-19 Vaccination Tracking

### Problem
**No vaccination campaign monitoring** - Cannot track county-level vaccination or equity

### Solution: Add 4 COVID Vaccination Datasets

| Dataset | ID | Granularity | Update | Records | Priority |
|---------|-----|-------------|--------|---------|----------|
| **Jurisdiction-Level** | `unsk-b7fc` | National/State | Weekly | ~300K | 🔴 HIGH |
| **County-Level + Equity** | `8xkx-amqh` | County | Weekly | ~2M | 🔴 HIGH |
| **Weekly Respiratory Vax** | `5c6r-xi2t` | National | Weekly | ~5K | 🟡 MEDIUM |
| **Age Group Trends** | `gxj9-t96f` | National | Archived | ~50K | 🟢 LOW |

**Equity Metrics**: Social Vulnerability Index (SVI), urban/rural, metro/non-metro

### Implementation

#### Step 1: Add to `constants.ts` (8 lines)

```typescript
// === PHASE 4: COVID-19 VACCINATION (4 datasets) ===

covid_vax_jurisdiction: 'unsk-b7fc',       // National/state/territory level
covid_vax_county: '8xkx-amqh',             // County + equity metrics (SVI, urban/rural)
covid_vax_respiratory_weekly: '5c6r-xi2t', // Weekly respiratory virus vaccination
covid_vax_age_trends: 'gxj9-t96f',         // Age group trends (archived)
```

#### Step 2: Add to `types.ts` (8 lines)

```typescript
| 'get_covid_vaccination'

// COVID vaccination parameters
vax_geography?: 'national' | 'state' | 'county';
equity_metrics?: boolean; // Include SVI, urban/rural classification
```

#### Step 3: Add to `cdc-client.ts` (45 lines)

```typescript
async getCovidVaccination(request: {
  vax_geography?: string;
  state?: string;
  county?: string;
  equity_metrics?: boolean;
  limit: number;
  offset: number;
}): Promise<CDCResponse> {
  const { vax_geography = 'state', state, county, equity_metrics, limit, offset } = request;

  // Choose dataset based on granularity
  let datasetId: string;
  if (vax_geography === 'county' || county) {
    datasetId = DATASETS.covid_vax_county;
  } else if (vax_geography === 'national') {
    datasetId = DATASETS.covid_vax_jurisdiction;
  } else {
    datasetId = DATASETS.covid_vax_jurisdiction;
  }

  // Build query
  let query = `${CDC_BASE_URL}/${datasetId}.json?$limit=${limit}&$offset=${offset}`;

  // Filters
  const filters: string[] = [];
  if (state) filters.push(`state='${state.toUpperCase()}'`);
  if (county) filters.push(`county='${county}'`);

  if (filters.length > 0) {
    query += `&$where=${filters.join(' AND ')}`;
  }

  await this.rateLimit();
  const response = await this.axiosInstance.get(query);

  return {
    dataset: vax_geography,
    count: response.data.length,
    data: response.data,
  };
}
```

**Total Code**: ~60 lines

---

## Critical Gap #3: Drug Overdose Crisis Monitoring

### Problem
**No overdose surveillance** - Cannot track fentanyl epidemic or county hotspots

### Solution: Add 6 Drug Overdose Datasets

| Dataset | ID | Level | Update | Records | Priority |
|---------|-----|-------|--------|---------|----------|
| **Provisional State Deaths** | `xkb8-kh2a` | State | Monthly | ~20K | 🔴 HIGH |
| **County Deaths** | `gb4e-yj24` | County | Monthly | ~150K | 🔴 HIGH |
| **Deaths by Drug** | `8hzs-zshh` | State/Region | Monthly | ~30K | 🔴 HIGH |
| **Deaths by Demographics** | `95ax-ymtc` | National | Annual | ~15K | 🟡 MEDIUM |
| **Model-Based Estimates** | `v2g4-wqg2` | National | Weekly | ~10K | 🟡 MEDIUM |
| **NCHS Injury Mortality** | `nt65-c7a7` | National | Annual | ~500K | 🟢 LOW |

**Drug Categories**: Opioids, fentanyl, heroin, cocaine, methamphetamine, benzodiazepines

### Implementation

#### Step 1: Add to `constants.ts` (12 lines)

```typescript
// === PHASE 4: DRUG OVERDOSE CRISIS (6 datasets) ===

overdose_provisional_state: 'xkb8-kh2a',   // Monthly provisional state-level deaths
overdose_county: 'gb4e-yj24',              // County-level deaths (12-month ending)
overdose_by_drug: '8hzs-zshh',             // Deaths by specific drugs (fentanyl, opioids, etc.)
overdose_demographics: '95ax-ymtc',        // Deaths by age, sex, race, drug type
overdose_nowcast: 'v2g4-wqg2',             // Early model-based estimates (weekly)
nchs_injury_mortality: 'nt65-c7a7',        // All injury deaths (mechanism + intent)
```

#### Step 2: Add to `types.ts` (10 lines)

```typescript
| 'get_overdose_surveillance'

// Overdose parameters
overdose_geography?: 'national' | 'state' | 'county';
drug_type?: 'opioid' | 'fentanyl' | 'heroin' | 'cocaine' | 'methamphetamine' | 'all';
provisional?: boolean; // True for real-time provisional data
```

#### Step 3: Add to `cdc-client.ts` (50 lines)

```typescript
async getOverdoseSurveillance(request: {
  overdose_geography?: string;
  drug_type?: string;
  provisional?: boolean;
  state?: string;
  county?: string;
  limit: number;
  offset: number;
}): Promise<CDCResponse> {
  const {
    overdose_geography = 'state',
    drug_type = 'all',
    provisional = true,
    state,
    county,
    limit,
    offset
  } = request;

  // Choose dataset
  let datasetId: string;
  if (county || overdose_geography === 'county') {
    datasetId = DATASETS.overdose_county;
  } else if (drug_type !== 'all') {
    datasetId = DATASETS.overdose_by_drug;
  } else if (provisional) {
    datasetId = DATASETS.overdose_provisional_state;
  } else {
    datasetId = DATASETS.overdose_demographics;
  }

  // Build query
  let query = `${CDC_BASE_URL}/${datasetId}.json?$limit=${limit}&$offset=${offset}`;

  // Filters
  const filters: string[] = [];
  if (state) filters.push(`state='${state.toUpperCase()}'`);
  if (county) filters.push(`county='${county}'`);
  if (drug_type !== 'all') filters.push(`indicator LIKE '%${drug_type}%'`);

  if (filters.length > 0) {
    query += `&$where=${filters.join(' AND ')}`;
  }

  await this.rateLimit();
  const response = await this.axiosInstance.get(query);

  return {
    dataset: `overdose_${overdose_geography}`,
    count: response.data.length,
    data: response.data,
  };
}
```

**Total Code**: ~75 lines

---

## Implementation Summary

### Phase 4 Total
- **Datasets to Add**: 20
- **New Methods**: 3 (`get_nndss_surveillance`, `get_covid_vaccination`, `get_overdose_surveillance`)
- **Total Code**: ~225 lines
- **Estimated Effort**: 3-4 days

### Code Changes Breakdown

| File | Lines to Add | Changes |
|------|-------------|---------|
| `constants.ts` | 45 | 20 dataset IDs + descriptions |
| `types.ts` | 28 | 3 method signatures + parameters |
| `cdc-client.ts` | 135 | 3 new methods (45-50 lines each) |
| `index.ts` | 60 | Tool schema updates + handlers |
| **TOTAL** | **268** | **Comprehensive real-time surveillance** |

### Testing Checklist

- [ ] TypeScript compilation (no errors)
- [ ] NNDSS datasets accessibility (14/14)
- [ ] COVID vaccination datasets (4/4)
- [ ] Drug overdose datasets (6/6)
- [ ] Rate limiting (no throttling)
- [ ] Query filtering (state, county, disease, drug)
- [ ] Response format consistency

---

## Expected Outcomes

### Before Phase 4 (Current v1.3.0)
- ✅ 53 datasets
- ✅ 15 surveillance systems
- ✅ Chronic disease monitoring
- ❌ No outbreak detection
- ❌ No vaccination tracking
- ❌ No overdose monitoring

### After Phase 4 (v1.4.0)
- ✅ 73 datasets (+38%)
- ✅ 18 surveillance systems
- ✅ Chronic disease monitoring
- ✅ **Real-time outbreak detection** (50+ diseases)
- ✅ **Vaccination campaign monitoring** (county + equity)
- ✅ **Overdose crisis monitoring** (drug-specific + hotspots)

### New Capabilities
1. **Weekly disease outbreak detection**
   - Arboviral (West Nile, encephalitis)
   - Hepatitis outbreaks
   - TB surveillance
   - Vaccine-preventable diseases

2. **COVID vaccination equity analysis**
   - County-level tracking
   - Social Vulnerability Index (SVI)
   - Urban/rural classification
   - Demographic stratification

3. **Drug overdose crisis response**
   - Monthly provisional deaths
   - Fentanyl/opioid tracking
   - County hotspot identification
   - Nowcasting (weekly estimates)

---

## Use Case Examples

### Use Case 1: Detect Hepatitis Outbreak
```typescript
{
  method: 'get_nndss_surveillance',
  disease: 'hepatitis',
  state: 'CA',
  limit: 500
}
```
**Result**: Weekly hepatitis cases in California for outbreak detection

### Use Case 2: Track COVID Vaccination Equity
```typescript
{
  method: 'get_covid_vaccination',
  vax_geography: 'county',
  state: 'TX',
  equity_metrics: true,
  limit: 1000
}
```
**Result**: County-level vaccination rates + SVI for equity targeting

### Use Case 3: Monitor Fentanyl Crisis
```typescript
{
  method: 'get_overdose_surveillance',
  overdose_geography: 'county',
  drug_type: 'fentanyl',
  state: 'OH',
  provisional: true,
  limit: 200
}
```
**Result**: Monthly provisional fentanyl deaths by Ohio county

---

## Risk Assessment

### ✅ Low Risk
- All 20 datasets validated as publicly accessible
- Standard SODA JSON format (compatible with existing code)
- Rate limiting already implemented
- App token working (1,000 req/hour)

### Effort Breakdown
- **Day 1**: Add constants + types (1-2 hours)
- **Day 2**: Implement NNDSS method (3-4 hours)
- **Day 3**: Implement COVID vaccination + overdose methods (4-5 hours)
- **Day 4**: Testing + documentation (2-3 hours)

**Total**: 3-4 days for complete Phase 4

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Approve Phase 4** implementation
3. **Implement in sequence**:
   - NNDSS (highest priority)
   - COVID vaccination
   - Drug overdose
4. **Test thoroughly** (20/20 datasets)
5. **Update README** with new capabilities
6. **Release v1.4.0** - Real-time surveillance edition

---

## Conclusion

Phase 4 addresses the **most critical gaps** in current CDC MCP implementation:
- ❌ → ✅ Disease outbreak detection (NNDSS)
- ❌ → ✅ COVID vaccination tracking (county + equity)
- ❌ → ✅ Drug overdose crisis monitoring (fentanyl + hotspots)

**Impact**: Transforms MCP from chronic disease monitoring → **comprehensive real-time public health surveillance platform**.

**Recommendation**: **Proceed with Phase 4 immediately** - highest value, moderate effort, low risk.
