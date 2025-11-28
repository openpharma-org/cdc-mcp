# CDC MCP Server Integration Guide

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/joan.saez-pons/code/cdc-mcp-server
pip install -e .
```

### 2. Test the Server

```bash
# Run basic tests
python3 test_cdc_client.py

# Run usage examples
python3 examples/usage_examples.py
```

### 3. Add to MCP Configuration

Add to your Claude Code MCP configuration file (`.claude/mcp.json` or equivalent):

```json
{
  "mcpServers": {
    "cdc": {
      "command": "python3",
      "args": [
        "-m",
        "cdc_mcp.server"
      ],
      "cwd": "/Users/joan.saez-pons/code/cdc-mcp-server",
      "env": {
        "PYTHONPATH": "/Users/joan.saez-pons/code/cdc-mcp-server/src",
        "CDC_APP_TOKEN": ""
      }
    }
  }
}
```

### 4. Optional: Register for App Token

For higher rate limits (1,000 requests/hour):

1. Visit: https://data.cdc.gov/profile/app_tokens
2. Create an account and generate an app token
3. Add token to the `CDC_APP_TOKEN` environment variable above

## Using with Agentic OS

### Add MCP Client Stub

Create a stub file in `.claude/mcp/servers/cdc_mcp/`:

```python
# .claude/mcp/servers/cdc_mcp/__init__.py
"""
CDC MCP Server Client Stub
"""

from typing import Dict, List, Optional, Any


def get_places_data(
    geography_level: str = "county",
    year: str = "2024",
    state: Optional[str] = None,
    measure_id: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
) -> Dict[str, Any]:
    """Get PLACES local disease prevalence data."""
    pass


def get_brfss_data(
    dataset_type: str = "obesity_national",
    year: Optional[int] = None,
    state: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
) -> Dict[str, Any]:
    """Get BRFSS behavioral risk factor data."""
    pass


def search_dataset(
    dataset_name: str,
    select_fields: Optional[List[str]] = None,
    where_clause: Optional[str] = None,
    order_by: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
) -> Dict[str, Any]:
    """Generic search across any CDC dataset."""
    pass


def get_available_measures(
    dataset_name: str = "places_county_2024"
) -> Dict[str, Any]:
    """Get list of available measures for a dataset."""
    pass


def list_datasets() -> Dict[str, Any]:
    """List all available CDC datasets."""
    pass
```

### Create MCP Tool Guide

Create documentation in `.claude/.context/mcp-tool-guides/cdc.md`:

```markdown
# CDC MCP Server - API Guide

## Overview

The CDC MCP server provides access to CDC public health data through the Socrata Open Data API (SODA).

## Available Methods

### 1. get_places_data
Get PLACES local disease prevalence data at various geographic levels.

**Returns**: JSON with disease prevalence data

### 2. get_brfss_data
Get BRFSS behavioral risk factor surveillance data.

**Returns**: JSON with risk factor data

### 3. search_dataset
Generic search across any CDC dataset with custom SoQL queries.

**Returns**: JSON with search results

### 4. get_available_measures
List all available health measures for a dataset.

**Returns**: JSON with measure list

### 5. list_datasets
List all available CDC datasets.

**Returns**: JSON with dataset descriptions

## Common Disease Measures

- DIABETES: Diagnosed diabetes
- OBESITY: Adult obesity
- BPHIGH: High blood pressure
- CHD: Coronary heart disease
- COPD: Chronic obstructive pulmonary disease
- ASTHMA: Current asthma
- STROKE: Stroke
- CANCER: Cancer (excluding skin cancer)

## Example Usage

See README.md for comprehensive examples.
```

### Add Code Examples

Create pattern example in `.claude/.context/code-examples/cdc_patterns.md`:

```markdown
# CDC Data Collection Patterns

## Pattern: Get Disease Prevalence by State

\`\`\`python
from mcp.servers.cdc_mcp import get_places_data

# Get diabetes prevalence for California counties
result = get_places_data(
    geography_level="county",
    year="2024",
    state="CA",
    measure_id="DIABETES",
    limit=100
)

# Process results
for record in result['data']:
    location = record['locationname']
    value = record['data_value']
    print(f"{location}: {value}%")
\`\`\`

## Pattern: Compare Multiple States

\`\`\`python
from mcp.servers.cdc_mcp import get_places_data

states = ["CA", "TX", "NY", "FL"]

for state in states:
    result = get_places_data(
        geography_level="county",
        year="2024",
        state=state,
        measure_id="DIABETES"
    )

    # Calculate average
    avg = sum(float(r['data_value']) for r in result['data']) / len(result['data'])
    print(f"{state}: {avg:.1f}%")
\`\`\`

## Pattern: Advanced Search with Filters

\`\`\`python
from mcp.servers.cdc_mcp import search_dataset

# Find high-prevalence areas
result = search_dataset(
    dataset_name="places_county_2024",
    where_clause="measureid='DIABETES' AND data_value>15.0",
    order_by="data_value DESC",
    limit=20
)
\`\`\`
```

## Verification

Test the integration:

```bash
# From agentic-os directory
python3 -c "
import sys
sys.path.insert(0, '/Users/joan.saez-pons/code/cdc-mcp-server/src')
from cdc_mcp.cdc_client import CDCAPIClient
client = CDCAPIClient()
result = client.get_places_data(state='CA', measure_id='DIABETES', limit=5)
print(f'✅ CDC MCP integration working: {result[\"count\"]} records found')
"
```

## Rate Limiting

The server implements conservative rate limiting:
- 500ms delay between requests
- Without app token: Shared pool (may be throttled)
- With app token: 1,000 requests/hour

## Troubleshooting

### Import Errors

If you get import errors, ensure:
1. PYTHONPATH is set correctly in MCP configuration
2. Dependencies are installed: `pip install mcp requests httpx`

### 403 Forbidden Errors

Some datasets may require authentication:
- Register for a free app token at data.cdc.gov
- Add token to CDC_APP_TOKEN environment variable

### Rate Limiting

If you hit rate limits:
1. Register for an app token (increases limit to 1000/hour)
2. Reduce query frequency
3. Use pagination with smaller page sizes

## Support

- CDC Data Portal: https://data.cdc.gov
- SODA API Docs: https://dev.socrata.com
- Issues: https://github.com/uh-joan/cdc-mcp-server/issues
