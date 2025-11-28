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
    version: '1.0.0',
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

Available data sources:
- PLACES: Local disease prevalence data at county, place, census tract, and ZIP code levels
- BRFSS: Behavioral Risk Factor Surveillance System for chronic disease risk factors
- VSRR: Vital Statistics Rapid Release for provisional mortality data
- Nutrition/Physical Activity/Obesity: Behavioral and environmental data
- Disease-specific datasets: Diabetes, obesity, heart disease, cancer, etc.

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
        ],
        description: `The operation to perform:
- get_places_data: Get PLACES local disease prevalence data
- get_brfss_data: Get BRFSS behavioral risk factor data
- search_dataset: Generic search across any CDC dataset
- get_available_measures: List available measures for a dataset
- list_datasets: List all available CDC datasets`,
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
