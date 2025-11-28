/**
 * CDC SODA API Client
 * Handles interactions with CDC's Socrata Open Data API (SODA) for public health data.
 */

import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import {
  CDC_BASE_URL,
  CHRONICDATA_BASE_URL,
  DATASETS,
  DATASET_DESCRIPTIONS,
  REQUEST_DELAY_MS,
  DatasetName,
} from './constants.js';
import {
  CDCResponse,
  PlacesDataRequest,
  BRFSSDataRequest,
  SearchDatasetRequest,
  RateLimiter,
} from './types.js';

export class CDCClient {
  private rateLimiter: RateLimiter;
  private axiosInstance: AxiosInstance;
  private appToken?: string;

  constructor(appToken?: string) {
    this.appToken = appToken;
    this.rateLimiter = {
      lastRequestTime: 0,
      delay: REQUEST_DELAY_MS,
    };

    // Create axios instance with retry logic
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add X-App-Token header if provided (Socrata standard authentication)
    if (appToken) {
      headers['X-App-Token'] = appToken;
      console.log('CDC Client: Using app token for enhanced rate limits');
    }

    this.axiosInstance = axios.create({
      timeout: 30000,
      headers,
    });

    // Configure automatic retries
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.response?.status === 429 // Rate limit
        );
      },
    });
  }

  /**
   * Implement rate limiting between requests
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.rateLimiter.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimiter.delay) {
      const sleepTime = this.rateLimiter.delay - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
    }

    this.rateLimiter.lastRequestTime = Date.now();
  }

  /**
   * Make a request to CDC SODA API with rate limiting
   */
  private async makeRequest(
    endpoint: string,
    params: Record<string, any> = {},
    baseUrl: string = CDC_BASE_URL
  ): Promise<any[]> {
    await this.rateLimit();

    const url = `${baseUrl}/${endpoint}.json`;

    try {
      const response = await this.axiosInstance.get(url, { params });
      console.log(`CDC API request successful: ${endpoint}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('CDC API rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 403) {
        throw new Error(`Access denied to dataset: ${endpoint}`);
      } else {
        throw new Error(`Failed to fetch CDC data: ${error.message}`);
    }
    }
  }

  /**
   * Get PLACES (Local Data for Better Health) data
   */
  async getPlacesData(request: PlacesDataRequest): Promise<CDCResponse> {
    const { geography_level, year, state, measure_id, location, limit, offset } = request;

    // Select appropriate dataset
    const datasetKey = `places_${geography_level}_${year}` as DatasetName;
    if (!(datasetKey in DATASETS)) {
      throw new Error(`Invalid geography_level/year combination: ${geography_level}/${year}`);
    }

    const datasetId = DATASETS[datasetKey];

    // Build SoQL query parameters
    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    // Build WHERE clause
    const whereClauses: string[] = [];
    if (state) whereClauses.push(`stateabbr='${state.toUpperCase()}'`);
    if (measure_id) whereClauses.push(`measureid='${measure_id.toUpperCase()}'`);
    if (location) whereClauses.push(`locationname='${location}'`);

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: datasetKey,
      count: data.length,
      data,
    };
  }

  /**
   * Get BRFSS (Behavioral Risk Factor Surveillance System) data
   */
  async getBRFSSData(request: BRFSSDataRequest): Promise<CDCResponse> {
    const { dataset_type, year, state, limit, offset } = request;

    const datasetKey = `brfss_${dataset_type}` as DatasetName;
    if (!(datasetKey in DATASETS)) {
      throw new Error(`Invalid BRFSS dataset type: ${dataset_type}`);
    }

    const datasetId = DATASETS[datasetKey];

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    const whereClauses: string[] = [];
    if (year !== undefined) whereClauses.push(`year=${year}`);
    if (state) whereClauses.push(`locationabbr='${state.toUpperCase()}'`);

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    // BRFSS data is on chronicdata.cdc.gov
    const data = await this.makeRequest(datasetId, params, CHRONICDATA_BASE_URL);

    return {
      dataset: datasetKey,
      count: data.length,
      data,
    };
  }

  /**
   * Generic search across any CDC dataset
   */
  async searchDataset(request: SearchDatasetRequest): Promise<CDCResponse> {
    const { dataset_name, select_fields, where_clause, order_by, limit, offset } = request;

    // Check if dataset_name is a key in DATASETS or a direct dataset ID
    let datasetId: string;
    if (dataset_name in DATASETS) {
      datasetId = DATASETS[dataset_name as DatasetName];
    } else {
      datasetId = dataset_name;
    }

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    if (select_fields && select_fields.length > 0) {
      params.$select = select_fields.join(',');
    }

    if (where_clause) {
      params.$where = where_clause;
    }

    if (order_by) {
      params.$order = order_by;
    }

    // Try data.cdc.gov first, fall back to chronicdata.cdc.gov
    let data: any[];
    try {
      data = await this.makeRequest(datasetId, params);
    } catch (error) {
      console.log('Trying chronicdata.cdc.gov...');
      data = await this.makeRequest(datasetId, params, CHRONICDATA_BASE_URL);
    }

    return {
      dataset: dataset_name,
      count: data.length,
      data,
    };
  }

  /**
   * Get list of available measures for a dataset
   */
  async getAvailableMeasures(dataset_type: string): Promise<CDCResponse> {
    if (!(dataset_type in DATASETS)) {
      throw new Error(`Invalid dataset type: ${dataset_type}`);
    }

    const datasetId = DATASETS[dataset_type as DatasetName];

    // Get distinct measure IDs
    const params = {
      $select: 'DISTINCT measureid, measure',
      $limit: 1000,
    };

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: dataset_type,
      measure_count: data.length,
      measures: data,
      count: data.length,
      data,
    };
  }

  /**
   * List all available CDC datasets
   */
  listDatasets(): CDCResponse {
    return {
      available_datasets: Object.keys(DATASETS),
      dataset_descriptions: DATASET_DESCRIPTIONS,
      total_datasets: Object.keys(DATASETS).length,
      count: Object.keys(DATASETS).length,
      data: [],
    };
  }

  // === TIER 1 EXPANSION METHODS ===

  /**
   * Get YRBSS (Youth Risk Behavior Surveillance System) data
   */
  async getYRBSSData(
    state?: string,
    topic?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    const datasetId = DATASETS.yrbss_high_school;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`locationabbr='${state.toUpperCase()}'`);
    if (year) whereClauses.push(`year=${year}`);
    if (topic) {
      // Topic mapping to YRBSS question categories
      const topicMap: Record<string, string> = {
        substance_use: "topic LIKE '%Tobacco%' OR topic LIKE '%Alcohol%' OR topic LIKE '%Marijuana%'",
        mental_health: "topic LIKE '%Mental Health%' OR topic LIKE '%Suicide%'",
        violence: "topic LIKE '%Violence%' OR topic LIKE '%Bullying%'",
        sexual_behaviors: "topic LIKE '%Sexual%'",
        nutrition: "topic LIKE '%Dietary%' OR topic LIKE '%Fruit%' OR topic LIKE '%Vegetable%'",
        physical_activity: "topic LIKE '%Physical Activity%' OR topic LIKE '%Sports%'",
      };
      if (topicMap[topic]) {
        whereClauses.push(`(${topicMap[topic]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: 'yrbss_high_school',
      count: data.length,
      data,
    };
  }

  /**
   * Get respiratory surveillance data (RSV/COVID-19/Flu combined)
   */
  async getRespiratorySurveillance(
    virus?: string,
    state?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    const datasetId = DATASETS.respiratory_combined;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
      $order: 'weekendingdate DESC',
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`jurisdiction='${state}'`);
    if (year) whereClauses.push(`year=${year}`);
    if (virus && virus !== 'combined') {
      const virusMap: Record<string, string> = {
        rsv: "indicator LIKE '%RSV%'",
        covid: "indicator LIKE '%COVID%'",
        flu: "indicator LIKE '%Influenza%' OR indicator LIKE '%Flu%'",
      };
      if (virusMap[virus]) {
        whereClauses.push(`(${virusMap[virus]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: 'respiratory_combined',
      count: data.length,
      data,
    };
  }

  /**
   * Get vaccination coverage data (teen/pregnant/kindergarten)
   */
  async getVaccinationCoverage(
    age_group: string,
    state?: string,
    vaccine_type?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Select appropriate dataset based on age group
    const datasetMap: Record<string, DatasetName> = {
      teen: 'teen_vaccinations',
      pregnant: 'h7pm-wmjc' as any, // Not in DATASETS yet
      kindergarten: 'ijqb-a7ye' as any, // Not in DATASETS yet
    };

    const datasetKey = datasetMap[age_group] || 'teen_vaccinations';
    const datasetId = DATASETS[datasetKey as DatasetName];

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`geography='${state}'`);
    if (year) whereClauses.push(`year=${year}`);
    if (vaccine_type) {
      const vaccineMap: Record<string, string> = {
        hpv: "vaccine LIKE '%HPV%'",
        tdap: "vaccine LIKE '%Tdap%' OR vaccine LIKE '%DTaP%'",
        menacwy: "vaccine LIKE '%MenACWY%' OR vaccine LIKE '%Meningococcal%'",
        flu: "vaccine LIKE '%Influenza%' OR vaccine LIKE '%Flu%'",
      };
      if (vaccineMap[vaccine_type]) {
        whereClauses.push(`(${vaccineMap[vaccine_type]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: `vaccination_coverage_${age_group}`,
      count: data.length,
      data,
    };
  }

  /**
   * Get birth statistics data
   */
  async getBirthStatistics(
    indicator?: string,
    state?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Use quarterly birth indicators by default
    const datasetId = indicator === 'birth_rate'
      ? DATASETS.death_rates_major_causes // Placeholder - contains vital stats
      : DATASETS.vsrr_birth_quarterly;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
      $order: 'year DESC',
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`jurisdiction='${state}'`);
    if (year) whereClauses.push(`year=${year}`);
    if (indicator && indicator !== 'birth_rate') {
      const indicatorMap: Record<string, string> = {
        preterm: "indicator LIKE '%Preterm%'",
        cesarean: "indicator LIKE '%Cesarean%' OR indicator LIKE '%C-section%'",
        low_birth_weight: "indicator LIKE '%Low birth weight%'",
      };
      if (indicatorMap[indicator]) {
        whereClauses.push(`(${indicatorMap[indicator]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: 'birth_statistics',
      count: data.length,
      data,
    };
  }

  /**
   * Get environmental health data (air quality)
   */
  async getEnvironmentalHealth(
    pollutant?: string,
    state?: string,
    county?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    const datasetId = DATASETS.air_quality_tracking;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
      $order: 'year DESC',
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`statefips='${state}' OR statename='${state}'`);
    if (county) whereClauses.push(`countyname LIKE '%${county}%'`);
    if (year) whereClauses.push(`year=${year}`);
    if (pollutant && pollutant !== 'combined') {
      const pollutantMap: Record<string, string> = {
        pm25: "measurename LIKE '%PM2.5%' OR measurename LIKE '%Particulate%'",
        ozone: "measurename LIKE '%Ozone%' OR measurename LIKE '%O3%'",
      };
      if (pollutantMap[pollutant]) {
        whereClauses.push(`(${pollutantMap[pollutant]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: 'air_quality_tracking',
      count: data.length,
      data,
    };
  }

  /**
   * Get tobacco impact data (SAMMEC - Smoking-Attributable Mortality, Morbidity, Economic Costs)
   */
  async getTobaccoImpact(
    impact_type?: string,
    state?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    const datasetId = DATASETS.sammec_smoking_impact;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`locationabbr='${state.toUpperCase()}'`);
    if (year) whereClauses.push(`year=${year}`);
    if (impact_type) {
      const impactMap: Record<string, string> = {
        mortality: "measureid LIKE '%MORT%' OR measureid LIKE '%DEATH%'",
        morbidity: "measureid LIKE '%MORB%' OR measureid LIKE '%ILL%'",
        economic_cost: "measureid LIKE '%COST%' OR measureid LIKE '%ECONOMIC%'",
      };
      if (impactMap[impact_type]) {
        whereClauses.push(`(${impactMap[impact_type]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params, CHRONICDATA_BASE_URL);

    return {
      dataset: 'sammec_smoking_impact',
      count: data.length,
      data,
    };
  }

  /**
   * Get oral and vision health data
   */
  async getOralVisionHealth(
    health_domain: string,
    state?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Select appropriate dataset based on health domain
    const datasetId = health_domain === 'oral'
      ? DATASETS.oral_health_indicators
      : DATASETS.vision_health;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`locationabbr='${state.toUpperCase()}'`);
    if (year) whereClauses.push(`year=${year}`);

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params, CHRONICDATA_BASE_URL);

    return {
      dataset: health_domain === 'oral' ? 'oral_health_indicators' : 'vision_health',
      count: data.length,
      data,
    };
  }

  // === TIER 2 EXPANSION METHODS ===

  /**
   * Get injury surveillance data (TBI, motor vehicle)
   */
  async getInjurySurveillance(
    injury_type: string = 'tbi',
    state?: string,
    mechanism?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    const datasetId = DATASETS.tbi_surveillance;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
      $order: 'year DESC',
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`state='${state}'`);
    if (year) whereClauses.push(`year=${year}`);
    if (mechanism && mechanism !== 'all') {
      const mechanismMap: Record<string, string> = {
        fall: "injurymechanism LIKE '%Fall%' OR injurymechanism LIKE '%Unintentional Fall%'",
        motor_vehicle: "injurymechanism LIKE '%Motor Vehicle%' OR injurymechanism LIKE '%MVT%'",
        assault: "injurymechanism LIKE '%Assault%' OR injurymechanism LIKE '%Violence%'",
        sports: "injurymechanism LIKE '%Sports%' OR injurymechanism LIKE '%Recreation%'",
      };
      if (mechanismMap[mechanism]) {
        whereClauses.push(`(${mechanismMap[mechanism]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: 'tbi_surveillance',
      count: data.length,
      data,
    };
  }

  /**
   * Get tobacco policy data (legislation, Medicaid coverage)
   */
  async getTobaccoPolicy(
    policy_type: string,
    state?: string,
    venue?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Select dataset based on policy type
    const datasetMap: Record<string, string> = {
      smokefree_air: DATASETS.smokefree_air_legislation,
      medicaid_cessation: DATASETS.medicaid_cessation_coverage,
      // Tier 3 Expansion
      licensure: DATASETS.tobacco_licensure,
      tax: DATASETS.tobacco_tax,
      ecigarette: DATASETS.ecigarette_legislation,
    };

    const datasetId = datasetMap[policy_type] || DATASETS.smokefree_air_legislation;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`locationabbr='${state.toUpperCase()}'`);
    if (year) whereClauses.push(`year=${year}`);
    if (venue && venue !== 'all' && policy_type === 'smokefree_air') {
      const venueMap: Record<string, string> = {
        workplace: "locationtype='Private Worksites'",
        restaurant: "locationtype='Restaurants'",
        bar: "locationtype='Bars'",
        government: "locationtype='Government Worksites'",
        school: "locationtype='Schools'",
      };
      if (venueMap[venue]) {
        whereClauses.push(venueMap[venue]);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params, CHRONICDATA_BASE_URL);

    return {
      dataset: `tobacco_policy_${policy_type}`,
      count: data.length,
      data,
    };
  }

  /**
   * Get infectious disease surveillance data (pneumococcal, foodborne/waterborne)
   */
  async getInfectiousDisease(
    disease: string,
    state?: string,
    serotype?: string,
    pathogen?: string,
    year?: number,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Select dataset based on disease type
    const datasetMap: Record<string, string> = {
      pneumococcal: DATASETS.pneumococcal_disease,
      foodborne: DATASETS.foodborne_outbreaks,
      waterborne: DATASETS.foodborne_outbreaks, // NORS covers both
    };

    const datasetId = datasetMap[disease] || DATASETS.pneumococcal_disease;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
      $order: 'year DESC',
    };

    const whereClauses: string[] = [];
    if (state) whereClauses.push(`state='${state}'`);
    if (year) whereClauses.push(`year=${year}`);

    // Pneumococcal-specific filtering
    if (disease === 'pneumococcal' && serotype) {
      whereClauses.push(`serotype='${serotype}'`);
    }

    // Foodborne/waterborne-specific filtering
    if ((disease === 'foodborne' || disease === 'waterborne') && pathogen) {
      whereClauses.push(`(etiology LIKE '%${pathogen}%' OR confirmedagent LIKE '%${pathogen}%')`);
    }

    if (disease === 'waterborne') {
      whereClauses.push("(mode LIKE '%Water%' OR waterexposure='Yes')");
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: `infectious_disease_${disease}`,
      count: data.length,
      data,
    };
  }

  /**
   * === PHASE 4 EXPANSION ===
   * Real-time outbreak detection, vaccination tracking, overdose monitoring
   */

  /**
   * Get NNDSS surveillance data (National Notifiable Diseases Surveillance System)
   * Real-time disease outbreak detection for 50+ notifiable diseases
   */
  async getNNDSSSurveillance(
    nndss_disease: string = 'all',
    year?: string,
    state?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Dataset mapping for different diseases
    const datasetMap: Record<string, string> = {
      arboviral: DATASETS.nndss_arboviral,
      hepatitis: DATASETS.nndss_hepatitis,
      tuberculosis: year
        ? (DATASETS[`nndss_tb_${year}` as keyof typeof DATASETS] as string) || DATASETS.nndss_tuberculosis
        : DATASETS.nndss_tuberculosis,
      rubella: DATASETS.nndss_rubella,
      pertussis: DATASETS.nndss_pertussis,
      haemophilus: DATASETS.nndss_haemophilus,
      qfever: DATASETS.nndss_qfever,
      botulism: DATASETS.nndss_botulism,
    };

    const datasetId = datasetMap[nndss_disease] || DATASETS.nndss_tuberculosis;

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    // Add state filter if provided
    const whereClauses: string[] = [];
    if (state) {
      whereClauses.push(`reporting_area='${state.toUpperCase()}'`);
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: `nndss_${nndss_disease}`,
      count: data.length,
      data,
    };
  }

  /**
   * Get COVID-19 vaccination data (county-level tracking with equity metrics)
   */
  async getCovidVaccination(
    vax_geography: string = 'state',
    state?: string,
    county?: string,
    equity_metrics?: boolean,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Choose dataset based on geographic level
    let datasetId: string;
    if (vax_geography === 'county' || county) {
      datasetId = DATASETS.covid_vax_county;
    } else if (vax_geography === 'national') {
      datasetId = DATASETS.covid_vax_jurisdiction;
    } else {
      datasetId = DATASETS.covid_vax_jurisdiction;
    }

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
      $order: 'date DESC',
    };

    // Build filters
    const whereClauses: string[] = [];
    if (state) whereClauses.push(`location='${state.toUpperCase()}'` + ` OR stateabbr='${state.toUpperCase()}' OR recip_state='${state.toUpperCase()}'`);
    if (county) whereClauses.push(`recip_county='${county}' OR county='${county}'`);

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: `covid_vax_${vax_geography}`,
      count: data.length,
      data,
    };
  }

  /**
   * Get drug overdose surveillance data
   * Real-time overdose crisis monitoring with drug-specific tracking
   */
  async getOverdoseSurveillance(
    overdose_geography: string = 'state',
    drug_type: string = 'all',
    provisional: boolean = true,
    state?: string,
    county?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<CDCResponse> {
    // Choose dataset based on parameters
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

    const params: Record<string, any> = {
      $limit: Math.min(limit, 50000),
      $offset: offset,
    };

    // Build filters
    const whereClauses: string[] = [];
    if (state) whereClauses.push(`state='${state.toUpperCase()}' OR state_name='${state}' OR stateabbr='${state.toUpperCase()}'`);
    if (county) whereClauses.push(`county='${county}'`);
    if (drug_type !== 'all') {
      // Drug type mapping for indicator field
      const drugMap: Record<string, string> = {
        opioid: "indicator LIKE '%Opioid%' OR indicator LIKE '%Synthetic opioids%'",
        fentanyl: "indicator LIKE '%Fentanyl%' OR indicator LIKE '%Synthetic opioids%'",
        heroin: "indicator LIKE '%Heroin%'",
        cocaine: "indicator LIKE '%Cocaine%'",
        methamphetamine: "indicator LIKE '%Methamphetamine%' OR indicator LIKE '%Psychostimulants%'",
      };
      if (drugMap[drug_type]) {
        whereClauses.push(`(${drugMap[drug_type]})`);
      }
    }

    if (whereClauses.length > 0) {
      params.$where = whereClauses.join(' AND ');
    }

    const data = await this.makeRequest(datasetId, params);

    return {
      dataset: `overdose_${overdose_geography}_${drug_type}`,
      count: data.length,
      data,
    };
  }
}
