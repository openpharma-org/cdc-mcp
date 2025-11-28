#!/usr/bin/env node

/**
 * CDC MCP Server
 * Provides access to CDC public health data through the Model Context Protocol (MCP).
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { CDCClient } from './cdc-client.js';
import { CDCToolRequest } from './types.js';

// Initialize CDC client with optional app token from environment
const appToken = process.env.CDC_APP_TOKEN;
if (appToken) {
  console.error('CDC MCP Server: Using app token for enhanced rate limits (1000 req/hour)');
} else {
  console.error('CDC MCP Server: No app token - using shared rate limit pool');
}

const cdcClient = new CDCClient(appToken);

// MCP Server
const server = new Server(
  {
    name: 'cdc-mcp-server',
    version: '1.4.0', // Phase 4 Complete - 73 datasets (added NNDSS, COVID vax, overdose)
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definition with unified interface
const CDC_TOOL: Tool = {
  name: 'cdc_health_data',
  description: `Unified tool for CDC public health data operations: access disease prevalence, chronic disease indicators, behavioral risk factors, and health surveillance data from CDC's Socrata Open Data API (SODA).

Available data sources (73 datasets - Phase 4 Complete: Critical Surveillance):
- PLACES: Local disease prevalence data at county, place, census tract, and ZIP code levels
- BRFSS: Behavioral Risk Factor Surveillance System for chronic disease risk factors (comprehensive 2011-present)
- YRBSS: Youth Risk Behavior Surveillance (substance use, mental health, violence, sexual behaviors)
- Respiratory Surveillance: Combined RSV/COVID-19/Flu hospitalization tracking
- Vaccination Coverage: Teen (HPV, Tdap, MenACWY), pregnant women, kindergarten immunizations
- Birth Statistics: VSRR quarterly birth indicators (rates, preterm, cesarean delivery)
- Environmental Health: Air quality tracking (PM2.5, ozone) with health impacts
- Tobacco Impact: SAMMEC smoking-attributable mortality, morbidity, economic costs
- Oral & Vision Health: NOHSS oral health indicators, BRFSS vision health surveillance
- VSRR: Vital Statistics Rapid Release for provisional mortality data
- Nutrition/Physical Activity/Obesity: Behavioral and environmental data
- Disease-specific datasets: Diabetes, obesity, heart disease, cancer, etc.
- NNDSS: National Notifiable Diseases Surveillance (real-time outbreak detection for 50+ diseases)
- COVID-19 Vaccination: County-level tracking with equity metrics (SVI, urban/rural)
- Drug Overdose: Real-time crisis monitoring with drug-specific tracking (fentanyl, opioids, etc.)

Use the method parameter to specify the operation type.`,
  inputSchema: {
    type: 'object',
    properties: {
      method: {
        type: 'string',
        enum: [
          'get_places_data',
          'get_brfss_data',
          'search_dataset',
          'get_available_measures',
          'list_datasets',
          // Tier 1 Expansion Methods
          'get_yrbss_data',
          'get_respiratory_surveillance',
          'get_vaccination_coverage',
          'get_birth_statistics',
          'get_environmental_health',
          'get_tobacco_impact',
          'get_oral_vision_health',
          // Tier 2 Expansion Methods
          'get_injury_surveillance',
          'get_tobacco_policy',
          'get_infectious_disease',
          // Phase 4 Methods
          'get_nndss_surveillance',
          'get_covid_vaccination',
          'get_overdose_surveillance',
        ],
        description: `The operation to perform:
- get_places_data: Get PLACES local disease prevalence data
- get_brfss_data: Get BRFSS behavioral risk factor data
- search_dataset: Generic search across any CDC dataset
- get_available_measures: List available measures for a dataset
- list_datasets: List all available CDC datasets

TIER 1 EXPANSION METHODS:
- get_yrbss_data: Youth Risk Behavior Surveillance (substance use, mental health, violence)
- get_respiratory_surveillance: Combined RSV/COVID-19/Flu hospitalization surveillance
- get_vaccination_coverage: Teen/pregnant/kindergarten vaccination rates
- get_birth_statistics: Birth rates, preterm births, cesarean delivery data
- get_environmental_health: Air quality tracking (PM2.5, ozone) with health impacts
- get_tobacco_impact: Smoking-attributable mortality, morbidity, economic costs
- get_oral_vision_health: Oral and vision health indicators

TIER 2 EXPANSION METHODS:
- get_injury_surveillance: TBI surveillance - emergency visits, hospitalizations, deaths by mechanism
- get_tobacco_policy: Smokefree air legislation and Medicaid cessation coverage by state
- get_infectious_disease: Pneumococcal disease and foodborne/waterborne outbreak surveillance`,
      },

      // PLACES parameters
      geography_level: {
        type: 'string',
        enum: ['county', 'place', 'tract', 'zcta'],
        description: 'For get_places_data: Geographic level (county, place, tract, zcta)',
      },
      year: {
        type: 'string',
        description:
          'For get_places_data/get_brfss_data: Data release year (e.g., "2023", "2024", or integer for BRFSS)',
      },
      state: {
        type: 'string',
        description: 'State abbreviation (e.g., "CA", "TX", "NY")',
      },
      measure_id: {
        type: 'string',
        description:
          'Disease/condition measure code (e.g., "DIABETES", "OBESITY", "CHD", "COPD", "ASTHMA")',
      },
      location: {
        type: 'string',
        description: 'Specific location name (e.g., "Harris County", "Los Angeles")',
      },

      // BRFSS parameters
      dataset_type: {
        type: 'string',
        enum: ['obesity_national', 'obesity_state', 'diabetes', 'asthma'],
        description: 'For get_brfss_data: Type of BRFSS dataset',
      },

      // Generic search parameters
      dataset_name: {
        type: 'string',
        description:
          'For search_dataset/get_available_measures: Dataset identifier (e.g., "places_county_2024", "brfss_diabetes")',
      },
      select_fields: {
        type: 'array',
        items: { type: 'string' },
        description: 'For search_dataset: List of field names to return',
      },
      where_clause: {
        type: 'string',
        description: 'For search_dataset: SoQL WHERE clause (e.g., "stateabbr=\'CA\' AND year>2020")',
      },
      order_by: {
        type: 'string',
        description: 'For search_dataset: Field to order results by',
      },

      // Pagination parameters
      limit: {
        type: 'integer',
        description: 'Maximum number of results to return (default: 100, max: 50000)',
        default: 100,
        minimum: 1,
        maximum: 50000,
      },
      offset: {
        type: 'integer',
        description: 'Starting record number for pagination (default: 0)',
        default: 0,
        minimum: 0,
      },

      // === TIER 1 EXPANSION PARAMETERS ===

      // YRBSS parameters
      topic: {
        type: 'string',
        enum: ['substance_use', 'mental_health', 'violence', 'sexual_behaviors', 'nutrition', 'physical_activity'],
        description: 'For get_yrbss_data: Topic category filter',
      },

      // Respiratory surveillance parameters
      virus: {
        type: 'string',
        enum: ['rsv', 'covid', 'flu', 'combined'],
        description: 'For get_respiratory_surveillance: Virus type to filter (default: combined)',
      },

      // Vaccination parameters
      age_group: {
        type: 'string',
        enum: ['teen', 'pregnant', 'kindergarten'],
        description: 'For get_vaccination_coverage: Age group category',
      },
      vaccine_type: {
        type: 'string',
        enum: ['hpv', 'tdap', 'menacwy', 'flu'],
        description: 'For get_vaccination_coverage: Specific vaccine type',
      },

      // Birth statistics parameters
      indicator: {
        type: 'string',
        enum: ['birth_rate', 'preterm', 'cesarean', 'low_birth_weight'],
        description: 'For get_birth_statistics: Birth indicator type',
      },

      // Environmental health parameters
      pollutant: {
        type: 'string',
        enum: ['pm25', 'ozone', 'combined'],
        description: 'For get_environmental_health: Air pollutant type (default: combined)',
      },
      county: {
        type: 'string',
        description: 'For get_environmental_health: County name filter',
      },

      // Tobacco impact parameters
      impact_type: {
        type: 'string',
        enum: ['mortality', 'morbidity', 'economic_cost'],
        description: 'For get_tobacco_impact: Type of smoking impact data',
      },

      // Oral/Vision health parameters
      health_domain: {
        type: 'string',
        enum: ['oral', 'vision'],
        description: 'For get_oral_vision_health: Health domain (oral or vision)',
      },

      // === TIER 2 EXPANSION PARAMETERS ===

      // Injury surveillance parameters
      injury_type: {
        type: 'string',
        enum: ['tbi', 'motor_vehicle', 'all'],
        description: 'For get_injury_surveillance: Type of injury (default: tbi)',
      },
      mechanism: {
        type: 'string',
        enum: ['fall', 'motor_vehicle', 'assault', 'sports', 'all'],
        description: 'For get_injury_surveillance: Injury mechanism filter',
      },

      // Tobacco policy parameters
      policy_type: {
        type: 'string',
        enum: ['smokefree_air', 'licensure', 'tax', 'medicaid_cessation', 'ecigarette'],
        description: 'For get_tobacco_policy: Type of tobacco policy',
      },
      venue: {
        type: 'string',
        enum: ['workplace', 'restaurant', 'bar', 'government', 'school', 'all'],
        description: 'For get_tobacco_policy: Venue type for smokefree air legislation',
      },

      // Infectious disease parameters
      disease: {
        type: 'string',
        enum: ['pneumococcal', 'foodborne', 'waterborne'],
        description: 'For get_infectious_disease: Disease type',
      },
      serotype: {
        type: 'string',
        description: 'For get_infectious_disease: Pneumococcal serotype filter (e.g., "19A", "3")',
      },
      pathogen: {
        type: 'string',
        description: 'For get_infectious_disease: Pathogen name for foodborne/waterborne outbreaks',
      },

      // === PHASE 4 EXPANSION PARAMETERS ===

      // NNDSS surveillance parameters
      nndss_disease: {
        type: 'string',
        enum: ['arboviral', 'hepatitis', 'tuberculosis', 'rubella', 'pertussis', 'haemophilus', 'qfever', 'botulism', 'all'],
        description: 'For get_nndss_surveillance: Notifiable disease category (default: all)',
      },

      // COVID vaccination parameters
      vax_geography: {
        type: 'string',
        enum: ['national', 'state', 'county'],
        description: 'For get_covid_vaccination: Geographic level (default: state)',
      },
      equity_metrics: {
        type: 'boolean',
        description: 'For get_covid_vaccination: Include SVI and urban/rural equity metrics',
      },

      // Drug overdose parameters
      overdose_geography: {
        type: 'string',
        enum: ['national', 'state', 'county'],
        description: 'For get_overdose_surveillance: Geographic level (default: state)',
      },
      drug_type: {
        type: 'string',
        enum: ['opioid', 'fentanyl', 'heroin', 'cocaine', 'methamphetamine', 'all'],
        description: 'For get_overdose_surveillance: Specific drug type (default: all)',
      },
      provisional: {
        type: 'boolean',
        description: 'For get_overdose_surveillance: Use provisional data (true) or finalized (false)',
      },
    },
    required: ['method'],
  },
};

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [CDC_TOOL],
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name !== 'cdc_health_data') {
    throw new Error(`Unknown tool: ${name}`);
  }

  const params = args as unknown as CDCToolRequest;
  const method = params.method;

  console.error(`CDC MCP: Calling method ${method}`);

  try {
    let result: any;

    switch (method) {
      case 'list_datasets':
        result = cdcClient.listDatasets();
        break;

      case 'get_places_data':
        result = await cdcClient.getPlacesData({
          geography_level: params.geography_level || 'county',
          year: params.year || '2024',
          state: params.state,
          measure_id: params.measure_id,
          location: params.location,
          limit: params.limit || 100,
          offset: params.offset || 0,
        });
        break;

      case 'get_brfss_data':
        result = await cdcClient.getBRFSSData({
          dataset_type: params.dataset_type || 'obesity_national',
          year: params.year ? parseInt(params.year) : undefined,
          state: params.state,
          limit: params.limit || 100,
          offset: params.offset || 0,
        });
        break;

      case 'search_dataset':
        if (!params.dataset_name) {
          throw new Error('dataset_name is required for search_dataset');
        }
        result = await cdcClient.searchDataset({
          dataset_name: params.dataset_name,
          select_fields: params.select_fields,
          where_clause: params.where_clause,
          order_by: params.order_by,
          limit: params.limit || 100,
          offset: params.offset || 0,
        });
        break;

      case 'get_available_measures':
        if (!params.dataset_name) {
          throw new Error('dataset_name is required for get_available_measures');
        }
        result = await cdcClient.getAvailableMeasures(params.dataset_name);
        break;

      // === TIER 1 EXPANSION METHODS ===

      case 'get_yrbss_data':
        result = await cdcClient.getYRBSSData(
          params.state,
          params.topic,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_respiratory_surveillance':
        result = await cdcClient.getRespiratorySurveillance(
          params.virus,
          params.state,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_vaccination_coverage':
        if (!params.age_group) {
          throw new Error('age_group is required for get_vaccination_coverage');
        }
        result = await cdcClient.getVaccinationCoverage(
          params.age_group,
          params.state,
          params.vaccine_type,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_birth_statistics':
        result = await cdcClient.getBirthStatistics(
          params.indicator,
          params.state,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_environmental_health':
        result = await cdcClient.getEnvironmentalHealth(
          params.pollutant,
          params.state,
          params.county,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_tobacco_impact':
        result = await cdcClient.getTobaccoImpact(
          params.impact_type,
          params.state,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_oral_vision_health':
        if (!params.health_domain) {
          throw new Error('health_domain is required for get_oral_vision_health');
        }
        result = await cdcClient.getOralVisionHealth(
          params.health_domain,
          params.state,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      // === TIER 2 EXPANSION METHODS ===

      case 'get_injury_surveillance':
        result = await cdcClient.getInjurySurveillance(
          params.injury_type || 'tbi',
          params.state,
          params.mechanism,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_tobacco_policy':
        if (!params.policy_type) {
          throw new Error('policy_type is required for get_tobacco_policy');
        }
        result = await cdcClient.getTobaccoPolicy(
          params.policy_type,
          params.state,
          params.venue,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_infectious_disease':
        if (!params.disease) {
          throw new Error('disease is required for get_infectious_disease');
        }
        result = await cdcClient.getInfectiousDisease(
          params.disease,
          params.state,
          params.serotype,
          params.pathogen,
          params.year ? parseInt(params.year) : undefined,
          params.limit || 100,
          params.offset || 0
        );
        break;

      // === PHASE 4 EXPANSION METHODS ===

      case 'get_nndss_surveillance':
        result = await cdcClient.getNNDSSSurveillance(
          params.nndss_disease || 'all',
          params.year,
          params.state,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_covid_vaccination':
        result = await cdcClient.getCovidVaccination(
          params.vax_geography || 'state',
          params.state,
          params.county,
          params.equity_metrics,
          params.limit || 100,
          params.offset || 0
        );
        break;

      case 'get_overdose_surveillance':
        result = await cdcClient.getOverdoseSurveillance(
          params.overdose_geography || 'state',
          params.drug_type || 'all',
          params.provisional !== undefined ? params.provisional : true,
          params.state,
          params.county,
          params.limit || 100,
          params.offset || 0
        );
        break;

      default:
        throw new Error(`Unknown method: ${method}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error: any) {
    console.error(`Error executing CDC tool: ${error.message}`);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message,
              method: params.method,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Main entry point
async function main() {
  console.error('Starting CDC MCP Server...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('CDC MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
