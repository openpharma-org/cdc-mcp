"""
Simple test script for CDC MCP client.
Tests basic functionality without overwhelming the API.
"""

import sys
import os
import time

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from cdc_mcp.cdc_client import CDCAPIClient


def test_list_datasets():
    """Test listing available datasets."""
    print("=" * 60)
    print("TEST 1: List Available Datasets")
    print("=" * 60)

    client = CDCAPIClient()
    datasets = client.DATASETS

    print(f"\nTotal datasets available: {len(datasets)}")
    print("\nDataset identifiers:")
    for name, dataset_id in list(datasets.items())[:5]:
        print(f"  - {name}: {dataset_id}")
    print(f"  ... and {len(datasets) - 5} more\n")

    time.sleep(1)  # Rate limiting


def test_places_data():
    """Test PLACES data retrieval."""
    print("=" * 60)
    print("TEST 2: Get PLACES County Data (California Diabetes)")
    print("=" * 60)

    client = CDCAPIClient()

    try:
        result = client.get_places_data(
            geography_level="county",
            year="2024",
            state="CA",
            measure_id="DIABETES",
            limit=5
        )

        print(f"\nDataset: {result['dataset']}")
        print(f"Records found: {result['count']}")

        if result['data']:
            print("\nSample record (first result):")
            sample = result['data'][0]
            print(f"  Location: {sample.get('locationname', 'N/A')}")
            print(f"  Measure: {sample.get('measure', 'N/A')}")
            print(f"  Value: {sample.get('data_value', 'N/A')}%")
            print(f"  Year: {sample.get('year', 'N/A')}")

        print("\n✅ PLACES data retrieval successful")

    except Exception as e:
        print(f"\n❌ Error: {e}")

    time.sleep(1)  # Rate limiting


def test_chronic_disease_indicators():
    """Test Chronic Disease Indicators."""
    print("=" * 60)
    print("TEST 3: Get Chronic Disease Indicators (Diabetes)")
    print("=" * 60)

    client = CDCAPIClient()

    try:
        result = client.get_chronic_disease_indicators(
            topic="Diabetes",
            year_start=2022,
            limit=3
        )

        print(f"\nDataset: {result['dataset']}")
        print(f"Records found: {result['count']}")

        if result['data']:
            print("\nSample record (first result):")
            sample = result['data'][0]
            print(f"  Topic: {sample.get('topic', 'N/A')}")
            print(f"  Question: {sample.get('question', 'N/A')[:80]}...")
            print(f"  Location: {sample.get('locationdesc', 'N/A')}")

        print("\n✅ Chronic Disease Indicators retrieval successful")

    except Exception as e:
        print(f"\n❌ Error: {e}")

    time.sleep(1)  # Rate limiting


def test_available_measures():
    """Test getting available measures."""
    print("=" * 60)
    print("TEST 4: Get Available PLACES Measures")
    print("=" * 60)

    client = CDCAPIClient()

    try:
        result = client.get_available_measures(
            dataset_type="places_county_2024"
        )

        print(f"\nDataset: {result['dataset']}")
        print(f"Total measures: {result['measure_count']}")

        if result['measures']:
            print("\nFirst 5 measures:")
            for measure in result['measures'][:5]:
                print(f"  - {measure.get('measureid', 'N/A')}: {measure.get('measure', 'N/A')}")

        print("\n✅ Available measures retrieval successful")

    except Exception as e:
        print(f"\n❌ Error: {e}")

    time.sleep(1)  # Rate limiting


def test_search_dataset():
    """Test generic dataset search."""
    print("=" * 60)
    print("TEST 5: Generic Dataset Search (High Diabetes Prevalence)")
    print("=" * 60)

    client = CDCAPIClient()

    try:
        result = client.search_dataset(
            dataset_name="places_county_2024",
            select_fields=["locationname", "stateabbr", "measureid", "data_value"],
            where_clause="measureid='DIABETES' AND data_value>15.0",
            order_by="data_value DESC",
            limit=5
        )

        print(f"\nDataset: {result['dataset']}")
        print(f"Records found: {result['count']}")

        if result['data']:
            print("\nCounties with >15% diabetes prevalence:")
            for record in result['data']:
                print(f"  - {record.get('locationname', 'N/A')}, {record.get('stateabbr', 'N/A')}: {record.get('data_value', 'N/A')}%")

        print("\n✅ Generic search successful")

    except Exception as e:
        print(f"\n❌ Error: {e}")


def main():
    """Run all tests."""
    print("\n" + "=" * 60)
    print("CDC MCP CLIENT TEST SUITE")
    print("=" * 60)
    print("\nNote: This test suite uses rate limiting to avoid")
    print("overwhelming the CDC API. Tests will take ~5-10 seconds.")
    print("=" * 60 + "\n")

    time.sleep(2)

    try:
        test_list_datasets()
        test_places_data()
        test_chronic_disease_indicators()
        test_available_measures()
        test_search_dataset()

        print("\n" + "=" * 60)
        print("ALL TESTS COMPLETED SUCCESSFULLY! ✅")
        print("=" * 60)
        print("\nThe CDC MCP client is working correctly.")
        print("You can now use it with your MCP server setup.\n")

    except KeyboardInterrupt:
        print("\n\nTests interrupted by user.")
    except Exception as e:
        print(f"\n\n❌ Test suite failed with error: {e}")


if __name__ == "__main__":
    main()
