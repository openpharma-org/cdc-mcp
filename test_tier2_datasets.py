#!/usr/bin/env python3
"""
Test script to verify accessibility of all Tier 2 datasets
"""

import requests
import time

# Base URL for CDC Socrata API
BASE_URL = "https://data.cdc.gov/resource"

# Tier 2 datasets to test
TIER2_DATASETS = {
    '29hc-w46k': 'RSV Hospitalizations (RSV-NET)',
    'vh55-3he6': 'Flu Vaccination Coverage (All Ages)',
    'h7pm-wmjc': 'Pregnant Women Vaccinations',
    'ijqb-a7ye': 'Kindergarten Vaccinations',
    'yt7u-eiyg': 'Birth Rates by Age Group',
    'b4av-siev': 'TBI Surveillance',
    '32fd-hyzc': 'Smokefree Air Legislation',
    'ntaa-dtex': 'Medicaid Cessation Coverage',
    'cpem-dkkm': 'BRFSS SMART County',
    'vba9-s8jp': 'Youth Nutrition & Physical Activity',
    'qvzb-qs6p': 'Pneumococcal Disease',
    '5xkq-dg7x': 'Foodborne/Waterborne Outbreaks (NORS)',
}

def test_dataset_accessibility(dataset_id, name):
    """Test if a dataset is accessible via SODA API"""
    url = f"{BASE_URL}/{dataset_id}.json"
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
    print("TIER 2 EXPANSION - DATASET VERIFICATION")
    print("="*80)
    print(f"{'Dataset ID':<12} {'Status':<10} {'Count':<8} {'Name'}")
    print("-"*80)

    results = {'success': 0, 'failed': 0}

    for dataset_id, name in TIER2_DATASETS.items():
        success, result = test_dataset_accessibility(dataset_id, name)

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
    print(f"\n✅ Success: {results['success']}/{len(TIER2_DATASETS)}")
    print(f"❌ Failed: {results['failed']}/{len(TIER2_DATASETS)}")

    if results['failed'] == 0:
        print("\n🎉 ALL TIER 2 DATASETS ACCESSIBLE - READY FOR PRODUCTION!")
    else:
        print(f"\n⚠️  WARNING: {results['failed']} dataset(s) failed accessibility check")

if __name__ == '__main__':
    main()
