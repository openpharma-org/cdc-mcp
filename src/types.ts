/**
 * TypeScript types for CDC MCP Server
 */

import { DatasetName, PlacesMeasureId } from './constants.js';

/**
 * MCP Tool Request Parameters
 */
export interface CDCToolRequest {
  method:
    | 'get_places_data'
    | 'get_brfss_data'
    | 'search_dataset'
    | 'get_available_measures'
    | 'list_datasets'
    // Tier 1 Expansion Methods
    | 'get_yrbss_data'
    | 'get_respiratory_surveillance'
    | 'get_vaccination_coverage'
    | 'get_birth_statistics'
    | 'get_environmental_health'
    | 'get_tobacco_impact'
    | 'get_oral_vision_health';

  // PLACES parameters
  geography_level?: 'county' | 'place' | 'tract' | 'zcta';
  year?: string;
  state?: string;
  measure_id?: PlacesMeasureId | string;
  location?: string;

  // BRFSS parameters
  dataset_type?: 'obesity_national' | 'obesity_state' | 'diabetes' | 'asthma';

  // Tier 1 Expansion Parameters
  // YRBSS parameters
  topic?: 'substance_use' | 'mental_health' | 'violence' | 'sexual_behaviors' | 'nutrition' | 'physical_activity';

  // Respiratory parameters
  virus?: 'rsv' | 'covid' | 'flu' | 'combined';

  // Vaccination parameters
  age_group?: 'teen' | 'pregnant' | 'kindergarten';
  vaccine_type?: 'hpv' | 'tdap' | 'menacwy' | 'flu';

  // Birth statistics parameters
  indicator?: 'birth_rate' | 'preterm' | 'cesarean' | 'low_birth_weight';

  // Environmental health parameters
  pollutant?: 'pm25' | 'ozone' | 'combined';
  county?: string;

  // Tobacco impact parameters
  impact_type?: 'mortality' | 'morbidity' | 'economic_cost';

  // Oral/Vision health parameters
  health_domain?: 'oral' | 'vision';

  // Generic search parameters
  dataset_name?: DatasetName | string;
  select_fields?: string[];
  where_clause?: string;
  order_by?: string;

  // Pagination
  limit?: number;
  offset?: number;
}

/**
 * CDC API Response
 */
export interface CDCResponse {
  dataset?: string;
  count: number;
  data: any[];
  error?: string;
  available_datasets?: Record<string, any>;
  dataset_descriptions?: Record<string, string>;
  total_datasets?: number;
  measures?: any[];
  measure_count?: number;
}

/**
 * PLACES Data Request
 */
export interface PlacesDataRequest {
  geography_level: 'county' | 'place' | 'tract' | 'zcta';
  year: string;
  state?: string;
  measure_id?: string;
  location?: string;
  limit: number;
  offset: number;
}

/**
 * BRFSS Data Request
 */
export interface BRFSSDataRequest {
  dataset_type: 'obesity_national' | 'obesity_state' | 'diabetes' | 'asthma';
  year?: number;
  state?: string;
  limit: number;
  offset: number;
}

/**
 * Generic Dataset Search Request
 */
export interface SearchDatasetRequest {
  dataset_name: string;
  select_fields?: string[];
  where_clause?: string;
  order_by?: string;
  limit: number;
  offset: number;
}

/**
 * Rate Limiter State
 */
export interface RateLimiter {
  lastRequestTime: number;
  delay: number;
}
