"""
CDC MCP Server - Usage Examples
Demonstrates various ways to query CDC public health data.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from cdc_mcp.cdc_client import CDCAPIClient


def example_1_diabetes_by_state():
    """Example 1: Get diabetes prevalence for all counties in a state."""
    print("=" * 70)
    print("EXAMPLE 1: Diabetes Prevalence in Texas Counties")
    print("=" * 70)

    client = CDCAPIClient()

    result = client.get_places_data(
        geography_level="county",
        year="2024",
        state="TX",
        measure_id="DIABETES",
        limit=10
    )

    print(f"\nFound {result['count']} counties with data")
    print("\nTop 10 Texas counties by diabetes prevalence:")

    # Sort by data value
    sorted_data = sorted(
        result['data'],
        key=lambda x: float(x.get('data_value', 0)),
        reverse=True
    )

    for i, record in enumerate(sorted_data[:10], 1):
        location = record.get('locationname', 'Unknown')
        value = record.get('data_value', 'N/A')
        print(f"{i:2}. {location:30} {value}%")


def example_2_obesity_trends():
    """Example 2: Track national obesity trends over time."""
    print("\n" + "=" * 70)
    print("EXAMPLE 2: National Obesity Trends")
    print("=" * 70)

    client = CDCAPIClient()

    result = client.get_brfss_data(
        dataset_type="obesity_national",
        limit=100
    )

    print(f"\nFound {result['count']} data points")
    print("\nRecent national obesity prevalence:")

    # Group by year if available
    if result['data']:
        # Show sample records
        for record in result['data'][:5]:
            year = record.get('year', 'N/A')
            location = record.get('locationdesc', 'N/A')
            value = record.get('data_value', 'N/A')
            print(f"  {year}: {location:20} {value}%")


def example_3_multiple_measures():
    """Example 3: Compare multiple health measures in one location."""
    print("\n" + "=" * 70)
    print("EXAMPLE 3: Multiple Health Measures for California")
    print("=" * 70)

    client = CDCAPIClient()

    measures = ["DIABETES", "OBESITY", "BPHIGH", "CHD", "COPD"]

    print("\nCalifornia health measures (sample counties):")

    for measure in measures:
        result = client.get_places_data(
            geography_level="county",
            year="2024",
            state="CA",
            measure_id=measure,
            limit=5
        )

        if result['data']:
            avg_value = sum(float(r.get('data_value', 0)) for r in result['data']) / len(result['data'])
            measure_name = result['data'][0].get('measure', measure)
            print(f"\n{measure:10} ({measure_name[:40]})")
            print(f"  Average across {len(result['data'])} counties: {avg_value:.1f}%")


def example_4_high_prevalence_search():
    """Example 4: Find locations with high disease prevalence."""
    print("\n" + "=" * 70)
    print("EXAMPLE 4: Counties with Highest Obesity Rates")
    print("=" * 70)

    client = CDCAPIClient()

    result = client.search_dataset(
        dataset_name="places_county_2024",
        select_fields=["locationname", "stateabbr", "measureid", "data_value"],
        where_clause="measureid='OBESITY' AND data_value>40.0",
        order_by="data_value DESC",
        limit=15
    )

    print(f"\nFound {result['count']} counties with obesity >40%")
    print("\nTop counties by obesity prevalence:")

    for i, record in enumerate(result['data'], 1):
        location = record.get('locationname', 'Unknown')
        state = record.get('stateabbr', '??')
        value = record.get('data_value', 'N/A')
        print(f"{i:2}. {location:30} ({state})  {value}%")


def example_5_geographic_comparison():
    """Example 5: Compare health metrics across multiple states."""
    print("\n" + "=" * 70)
    print("EXAMPLE 5: Diabetes Comparison Across States")
    print("=" * 70)

    client = CDCAPIClient()

    states = ["CA", "TX", "NY", "FL", "IL"]

    print("\nAverage diabetes prevalence by state (county-level):")

    for state in states:
        result = client.get_places_data(
            geography_level="county",
            year="2024",
            state=state,
            measure_id="DIABETES",
            limit=200
        )

        if result['data']:
            avg_diabetes = sum(float(r.get('data_value', 0)) for r in result['data']) / len(result['data'])
            county_count = len(result['data'])
            print(f"\n{state}: {avg_diabetes:.1f}% (across {county_count} counties)")

            # Show highest and lowest county
            sorted_counties = sorted(
                result['data'],
                key=lambda x: float(x.get('data_value', 0))
            )

            if sorted_counties:
                lowest = sorted_counties[0]
                highest = sorted_counties[-1]
                print(f"   Lowest:  {lowest.get('locationname', 'Unknown'):25} {lowest.get('data_value', 'N/A')}%")
                print(f"   Highest: {highest.get('locationname', 'Unknown'):25} {highest.get('data_value', 'N/A')}%")


def example_6_available_measures():
    """Example 6: Discover all available health measures."""
    print("\n" + "=" * 70)
    print("EXAMPLE 6: Available Health Measures in PLACES")
    print("=" * 70)

    client = CDCAPIClient()

    result = client.get_available_measures(
        dataset_type="places_county_2024"
    )

    print(f"\nTotal available measures: {result['measure_count']}")
    print("\nAll health measures:")

    for measure in result['measures']:
        measure_id = measure.get('measureid', 'N/A')
        measure_name = measure.get('measure', 'N/A')
        print(f"  {measure_id:15} {measure_name}")


def example_7_zip_code_level():
    """Example 7: Get neighborhood-level data (ZIP code)."""
    print("\n" + "=" * 70)
    print("EXAMPLE 7: ZIP Code Level Health Data (New York)")
    print("=" * 70)

    client = CDCAPIClient()

    result = client.get_places_data(
        geography_level="zcta",
        year="2024",
        state="NY",
        measure_id="DIABETES",
        limit=10
    )

    print(f"\nFound {result['count']} ZIP codes with diabetes data")
    print("\nSample ZIP codes in New York:")

    for record in result['data'][:10]:
        location = record.get('locationname', 'Unknown')
        value = record.get('data_value', 'N/A')
        ci_low = record.get('low_confidence_limit', 'N/A')
        ci_high = record.get('high_confidence_limit', 'N/A')
        print(f"  ZIP {location}: {value}% (95% CI: {ci_low}%-{ci_high}%)")


def main():
    """Run all examples."""
    print("\n" + "=" * 70)
    print("CDC MCP SERVER - USAGE EXAMPLES")
    print("=" * 70)
    print("\nThese examples demonstrate various CDC data queries.")
    print("Rate limiting is enabled, so examples will take ~10-15 seconds.\n")

    import time
    time.sleep(2)

    try:
        example_1_diabetes_by_state()
        time.sleep(1)

        example_2_obesity_trends()
        time.sleep(1)

        example_3_multiple_measures()
        time.sleep(1)

        example_4_high_prevalence_search()
        time.sleep(1)

        example_5_geographic_comparison()
        time.sleep(1)

        example_6_available_measures()
        time.sleep(1)

        example_7_zip_code_level()

        print("\n" + "=" * 70)
        print("ALL EXAMPLES COMPLETED!")
        print("=" * 70)
        print("\nYou can now use these patterns to query CDC data for your needs.\n")

    except KeyboardInterrupt:
        print("\n\nExamples interrupted by user.")
    except Exception as e:
        print(f"\n\n❌ Examples failed: {e}")


if __name__ == "__main__":
    main()
