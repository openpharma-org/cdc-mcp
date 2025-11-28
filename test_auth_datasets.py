"""
Test script to verify CDC authentication unlocks restricted datasets.
"""

import sys
import os
import time
sys.path.insert(0, 'src')

from cdc_mcp.cdc_client import CDCAPIClient

# Use credentials from environment or hardcoded for testing
app_token = "ciwjrlxs4tbyj9xh8m8zouxak"
app_token_secret = "50gqhd75xdkv785hg7ski6sxnixlr83p4hs0skqndz7uu126r1"

print("=" * 80)
print("Testing CDC Authentication with Restricted Datasets")
print("=" * 80)

# Initialize client with authentication
client = CDCAPIClient(app_token=app_token, app_token_secret=app_token_secret)

# Test restricted datasets
auth_required_datasets = [
    ("chronic_disease_indicators", "Chronic Disease Indicators"),
    ("brfss_chronic_health_indicators", "BRFSS Chronic Health Indicators"),
    ("brfss_demographics", "BRFSS Demographics"),
    ("brfss_cvd_surveillance", "BRFSS CVD Surveillance")
]

results = []

for dataset_key, dataset_name in auth_required_datasets:
    print(f"\n{'=' * 80}")
    print(f"Testing: {dataset_name} ({dataset_key})")
    print("=" * 80)

    try:
        # Try to fetch a small sample
        result = client.search_dataset(
            dataset_name=dataset_key,
            limit=2,
            offset=0
        )

        if result and result['count'] > 0:
            print(f"✅ SUCCESS: Retrieved {result['count']} records")
            print(f"   Sample data fields: {list(result['data'][0].keys())[:5]}...")
            results.append((dataset_name, True, result['count']))
        else:
            print(f"⚠️  WARNING: No data returned")
            results.append((dataset_name, False, 0))

    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        results.append((dataset_name, False, str(e)))

    # Rate limiting
    time.sleep(1)

# Summary
print("\n" + "=" * 80)
print("AUTHENTICATION TEST SUMMARY")
print("=" * 80)

success_count = sum(1 for _, success, _ in results if success)
total_count = len(results)

for dataset_name, success, detail in results:
    status = "✅" if success else "❌"
    if success:
        print(f"{status} {dataset_name}: {detail} records retrieved")
    else:
        print(f"{status} {dataset_name}: FAILED")

print(f"\n{'=' * 80}")
print(f"Results: {success_count}/{total_count} datasets accessible with authentication")
print(f"{'=' * 80}")

if success_count == total_count:
    print("\n🎉 ALL AUTHENTICATION TESTS PASSED!")
    print("   CDC credentials successfully unlock restricted datasets.")
    print(f"   Total accessible datasets: 23 public + {success_count} authenticated = {23 + success_count}")
elif success_count > 0:
    print(f"\n⚠️  PARTIAL SUCCESS: {success_count} of {total_count} authenticated datasets accessible")
else:
    print("\n❌ AUTHENTICATION FAILED: No restricted datasets accessible")
    print("   Check credentials or API permissions")
