#!/usr/bin/env python3
"""
Test script to verify accessibility of all Tier 3 datasets
"""

import requests
import time

# Base URLs for CDC Socrata API
CDC_BASE_URL = "https://data.cdc.gov/resource"
CHRONICDATA_BASE_URL = "https://chronicdata.cdc.gov/resource"

# Tier 3 datasets to test
TIER3_DATASETS = {
    '8hxn-cvik': ('Breastfeeding NIS', CDC_BASE_URL),
    'qwpv-wpc8': ('PRAMStat 2009', CDC_BASE_URL),
    'eb4y-d4ic': ('Tobacco Licensure Legislation', CHRONICDATA_BASE_URL),
    '2dwv-vfam': ('Tobacco Tax Legislation', CHRONICDATA_BASE_URL),
    'wan8-w4er': ('E-Cigarette Legislation', CHRONICDATA_BASE_URL),
    '8235-5d73': ('Water Fluoridation', CDC_BASE_URL),
    'haed-k2ka': ('Alcohol-Impaired Driving Deaths', CDC_BASE_URL),
    't984-9cdv': ('BRFSS Health Care Access 1995-2010', CDC_BASE_URL),
}

def test_dataset_accessibility(dataset_id, name, base_url):
    """Test if a dataset is accessible via SODA API"""
    url = f"{base_url}/{dataset_id}.json"
    params = {'$limit': 3}

    try:
        response = requests.get(url, params=params, timeout=10)

        if response.status_code == 200:
            data = response.json()
            count = len(data)
            return True, count
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def main():
    print("\n" + "="*80)
    print("TIER 3 EXPANSION - DATASET VERIFICATION")
    print("="*80)
    print(f"{'Dataset ID':<12} {'Status':<10} {'Count':<8} {'Name'}")
    print("-"*80)

    results = {'success': 0, 'failed': 0}

    for dataset_id, (name, base_url) in TIER3_DATASETS.items():
        success, result = test_dataset_accessibility(dataset_id, name, base_url)

        if success:
            status = "✓ OK"
            results['success'] += 1
            print(f"{dataset_id:<12} {status:<10} {result:<8} {name}")
        else:
            status = "✗ FAIL"
            results['failed'] += 1
            print(f"{dataset_id:<12} {status:<10} {result:<8} {name}")

        # Rate limiting: 500ms delay between requests
        time.sleep(0.5)

    print("-"*80)
    print(f"\n✅ Success: {results['success']}/{len(TIER3_DATASETS)}")
    print(f"❌ Failed: {results['failed']}/{len(TIER3_DATASETS)}")

    if results['failed'] == 0:
        print("\n🎉 ALL TIER 3 DATASETS ACCESSIBLE - READY FOR PRODUCTION!")
        print("\n📊 COMPLETE EXPANSION SUMMARY:")
        print("   - Tier 1: 10 datasets (high-priority health surveillance)")
        print("   - Tier 2: 12 datasets (policy-relevant, niche specializations)")
        print("   - Tier 3: 8 datasets (completeness, historical data)")
        print("   - TOTAL: 53 datasets (130% expansion from 23 baseline)")
    else:
        print(f"\n⚠️  WARNING: {results['failed']} dataset(s) failed accessibility check")

if __name__ == '__main__':
    main()
