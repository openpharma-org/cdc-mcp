"""
Simple test script to verify CDC authentication (avoids MCP dependencies).
"""

import requests
import time
import base64

# Credentials
app_token = "ciwjrlxs4tbyj9xh8m8zouxak"
app_token_secret = "50gqhd75xdkv785hg7ski6sxnixlr83p4hs0skqndz7uu126r1"

# Set up Basic Authentication
credentials = f"{app_token}:{app_token_secret}"
encoded = base64.b64encode(credentials.encode()).decode()

headers = {
    "Authorization": f"Basic {encoded}",
    "X-App-Token": app_token
}

print("=" * 80)
print("Testing CDC Authentication with Restricted Datasets")
print("=" * 80)

# Test datasets that previously required auth
auth_datasets = [
    ("g4ie-h725", "Chronic Disease Indicators", "https://data.cdc.gov"),
    ("u7k3-tu8b", "BRFSS Chronic Health Indicators", "https://chronicdata.cdc.gov"),
    ("6rsf-i7tq", "BRFSS Demographics", "https://chronicdata.cdc.gov"),
    ("ikwk-8git", "BRFSS CVD Surveillance", "https://chronicdata.cdc.gov")
]

results = []

for dataset_id, dataset_name, base_url in auth_datasets:
    print(f"\n{'=' * 80}")
    print(f"Testing: {dataset_name}")
    print(f"Dataset ID: {dataset_id}")
    print("=" * 80)

    url = f"{base_url}/resource/{dataset_id}.json"
    params = {"$limit": 2}

    try:
        response = requests.get(url, params=params, headers=headers, timeout=30)

        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                print(f"✅ SUCCESS: Retrieved {len(data)} records")
                print(f"   Sample fields: {list(data[0].keys())[:5]}...")
                results.append((dataset_name, True, len(data)))
            else:
                print(f"⚠️  WARNING: No data returned (empty dataset)")
                results.append((dataset_name, True, 0))
        elif response.status_code == 403:
            print(f"❌ FAILED: 403 Forbidden (authentication not working)")
            results.append((dataset_name, False, "403 Forbidden"))
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            results.append((dataset_name, False, f"HTTP {response.status_code}"))

    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        results.append((dataset_name, False, str(e)))

    time.sleep(1)  # Rate limiting

# Summary
print("\n" + "=" * 80)
print("AUTHENTICATION TEST SUMMARY")
print("=" * 80)

success_count = sum(1 for _, success, _ in results if success)
total_count = len(results)

for dataset_name, success, detail in results:
    status = "✅" if success else "❌"
    if success:
        print(f"{status} {dataset_name}: {detail} records")
    else:
        print(f"{status} {dataset_name}: {detail}")

print(f"\n{'=' * 80}")
print(f"Results: {success_count}/{total_count} datasets accessible")
print(f"{'=' * 80}")

if success_count == total_count:
    print("\n🎉 ALL AUTHENTICATION TESTS PASSED!")
    print("   CDC credentials successfully unlock restricted datasets.")
    print(f"   Total accessible datasets: 23 public + {success_count} authenticated = {23 + success_count}")
elif success_count > 0:
    print(f"\n⚠️  PARTIAL SUCCESS: {success_count} of {total_count} datasets accessible")
else:
    print("\n❌ AUTHENTICATION FAILED")
    print("   Check credentials or API permissions")
