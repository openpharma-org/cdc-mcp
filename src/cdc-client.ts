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
}
