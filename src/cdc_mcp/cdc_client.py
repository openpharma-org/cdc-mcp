"""
CDC SODA API Client
Handles interactions with CDC's Socrata Open Data API (SODA) for public health data.
"""

import requests
import time
from typing import Dict, List, Optional, Any, Union
from urllib.parse import urlencode, quote
import logging

logger = logging.getLogger(__name__)


class CDCAPIClient:
    """Client for CDC Socrata Open Data API (SODA)."""

    BASE_URL = "https://data.cdc.gov/resource"
    CHRONICDATA_URL = "https://chronicdata.cdc.gov/resource"

    # Rate limiting: Be conservative to avoid hitting limits
    REQUEST_DELAY = 0.5  # 500ms between requests

    # Dataset identifiers for common CDC datasets
    DATASETS = {
        # PLACES: Local Data for Better Health
        "places_county_2024": "swc5-untb",
        "places_county_2023": "i46a-9kgh",
        "places_place_2024": "eav7-hnsx",
        "places_tract_2024": "q9s5-f4ms",
        "places_zcta_2024": "csmw-bzzp",

        # BRFSS: Behavioral Risk Factor Surveillance System
        "brfss_obesity_national": "tcmp-75zb",
        "brfss_obesity_state": "xtew-z72g",
        "brfss_diabetes": "7yww-23y7",
        "brfss_asthma": "kj5r-3dtm",
        # Note: Some BRFSS datasets require authentication
        # "brfss_chronic_health_indicators": "u7k3-tu8b",  # Requires auth
        # "brfss_demographics": "6rsf-i7tq",  # Requires auth
        # "brfss_cvd_surveillance": "ikwk-8git",  # Requires auth

        # Chronic Disease Indicators (Note: May require authentication)
        # "chronic_disease_indicators": "g4ie-h725",

        # Nutrition, Physical Activity, Obesity
        "nutrition_obesity": "hn4x-zwk7",
        "nutrition_policy_environmental": "k8w5-7ju6",  # Policy/environmental supports
        "nutrition_commute_patterns": "8mrp-rmkw",  # ACS commuting data

        # Heart Disease Mortality
        "heart_disease_mortality": "6x7h-usvx",

        # Diabetes Surveillance
        "diabetes_indicators": "qfvz-agah",

        # COVID-19 Data (if still available)
        "covid_cases": "vbim-akqf",

        # Cancer Statistics
        "cancer_incidence": "c7dz-iz9w",

        # VSRR: Vital Statistics Rapid Release (Provisional Mortality)
        "vsrr_quarterly_mortality": "489q-934x",  # Quarterly provisional mortality estimates
        "vsrr_maternal_mortality": "e2d5-ggg7",  # Provisional maternal death counts
    }

    def __init__(self, app_token: Optional[str] = None):
        """
        Initialize CDC API client.

        Args:
            app_token: Optional Socrata app token for higher rate limits
                      (1000 requests/hour vs shared pool)
        """
        self.app_token = app_token
        self.last_request_time = 0
        self.session = requests.Session()

        if app_token:
            self.session.headers.update({"X-App-Token": app_token})

    def _rate_limit(self):
        """Implement rate limiting between requests."""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time

        if time_since_last < self.REQUEST_DELAY:
            time.sleep(self.REQUEST_DELAY - time_since_last)

        self.last_request_time = time.time()

    def _make_request(
        self,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        base_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Make a request to CDC SODA API with rate limiting.

        Args:
            endpoint: Dataset identifier (e.g., 'swc5-untb')
            params: Query parameters
            base_url: Override base URL (default: data.cdc.gov)

        Returns:
            API response as dictionary
        """
        self._rate_limit()

        url = f"{base_url or self.BASE_URL}/{endpoint}.json"

        try:
            response = self.session.get(url, params=params, timeout=30)
            response.raise_for_status()

            data = response.json()
            logger.info(f"CDC API request successful: {endpoint}")
            return data

        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:
                logger.error("Rate limit exceeded. Consider using an app token.")
                raise Exception("CDC API rate limit exceeded. Please try again later.")
            else:
                logger.error(f"HTTP error: {e}")
                raise Exception(f"CDC API error: {e}")
        except Exception as e:
            logger.error(f"Request failed: {e}")
            raise Exception(f"Failed to fetch CDC data: {e}")

    def get_places_data(
        self,
        geography_level: str = "county",
        year: str = "2024",
        state: Optional[str] = None,
        measure_id: Optional[str] = None,
        location: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        Get PLACES (Local Data for Better Health) data.

        Args:
            geography_level: Geographic level (county, place, tract, zcta)
            year: Data release year (2023, 2024)
            state: State abbreviation (e.g., 'CA', 'TX')
            measure_id: Disease/condition measure (e.g., 'DIABETES', 'OBESITY', 'CHD')
            location: Specific location name
            limit: Maximum results to return (max 50000)
            offset: Starting record for pagination

        Returns:
            Dictionary with PLACES data
        """
        # Select appropriate dataset
        dataset_key = f"places_{geography_level}_{year}"
        if dataset_key not in self.DATASETS:
            raise ValueError(f"Invalid geography_level/year combination: {geography_level}/{year}")

        dataset_id = self.DATASETS[dataset_key]

        # Build SoQL query parameters
        params = {
            "$limit": min(limit, 50000),
            "$offset": offset
        }

        # Build WHERE clause
        where_clauses = []
        if state:
            where_clauses.append(f"stateabbr='{state.upper()}'")
        if measure_id:
            where_clauses.append(f"measureid='{measure_id.upper()}'")
        if location:
            where_clauses.append(f"locationname='{location}'")

        if where_clauses:
            params["$where"] = " AND ".join(where_clauses)

        data = self._make_request(dataset_id, params)

        return {
            "dataset": dataset_key,
            "count": len(data),
            "data": data
        }

    def get_brfss_data(
        self,
        dataset_type: str = "obesity_national",
        year: Optional[int] = None,
        state: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        Get BRFSS (Behavioral Risk Factor Surveillance System) data.

        Args:
            dataset_type: Type of BRFSS data (obesity_national, obesity_state, diabetes, asthma)
            year: Year for data (leave None for all years)
            state: State abbreviation (for state-level datasets)
            limit: Maximum results to return
            offset: Starting record for pagination

        Returns:
            Dictionary with BRFSS data
        """
        dataset_key = f"brfss_{dataset_type}"
        if dataset_key not in self.DATASETS:
            raise ValueError(f"Invalid BRFSS dataset type: {dataset_type}")

        dataset_id = self.DATASETS[dataset_key]

        params = {
            "$limit": min(limit, 50000),
            "$offset": offset
        }

        where_clauses = []
        if year:
            where_clauses.append(f"year={year}")
        if state:
            where_clauses.append(f"locationabbr='{state.upper()}'")

        if where_clauses:
            params["$where"] = " AND ".join(where_clauses)

        # BRFSS data is on chronicdata.cdc.gov
        data = self._make_request(dataset_id, params, base_url=self.CHRONICDATA_URL)

        return {
            "dataset": dataset_key,
            "count": len(data),
            "data": data
        }

    def get_chronic_disease_indicators(
        self,
        topic: Optional[str] = None,
        question: Optional[str] = None,
        year_start: Optional[int] = None,
        year_end: Optional[int] = None,
        location: Optional[str] = None,
        stratification: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        Get Chronic Disease Indicators data.

        Args:
            topic: Topic area (e.g., 'Diabetes', 'Cardiovascular Disease')
            question: Specific indicator question
            year_start: Start year for data range
            year_end: End year for data range
            location: Location abbreviation (state code or US)
            stratification: Stratification level (e.g., 'Overall', 'Gender', 'Race/Ethnicity')
            limit: Maximum results to return
            offset: Starting record for pagination

        Returns:
            Dictionary with chronic disease indicator data
        """
        if "chronic_disease_indicators" not in self.DATASETS:
            raise ValueError("Chronic disease indicators dataset is currently unavailable (may require authentication)")

        dataset_id = self.DATASETS["chronic_disease_indicators"]

        params = {
            "$limit": min(limit, 50000),
            "$offset": offset
        }

        where_clauses = []
        if topic:
            where_clauses.append(f"topic='{topic}'")
        if question:
            where_clauses.append(f"question LIKE '%{question}%'")
        if year_start and year_end:
            where_clauses.append(f"yearstart>={year_start} AND yearend<={year_end}")
        elif year_start:
            where_clauses.append(f"yearstart>={year_start}")
        if location:
            where_clauses.append(f"locationabbr='{location.upper()}'")
        if stratification:
            where_clauses.append(f"stratification1='{stratification}'")

        if where_clauses:
            params["$where"] = " AND ".join(where_clauses)

        # Try chronicdata.cdc.gov first for chronic disease indicators
        try:
            data = self._make_request(dataset_id, params, base_url=self.CHRONICDATA_URL)
        except Exception:
            logger.info("Trying data.cdc.gov for chronic disease indicators...")
            data = self._make_request(dataset_id, params)

        return {
            "dataset": "chronic_disease_indicators",
            "count": len(data),
            "data": data
        }

    def search_dataset(
        self,
        dataset_name: str,
        select_fields: Optional[List[str]] = None,
        where_clause: Optional[str] = None,
        order_by: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        Generic search across any CDC dataset.

        Args:
            dataset_name: Dataset identifier key (from DATASETS dict) or direct dataset ID
            select_fields: List of field names to return
            where_clause: SoQL WHERE clause
            order_by: Field to order results by
            limit: Maximum results to return
            offset: Starting record for pagination

        Returns:
            Dictionary with search results
        """
        # Check if dataset_name is a key in DATASETS or a direct dataset ID
        if dataset_name in self.DATASETS:
            dataset_id = self.DATASETS[dataset_name]
        else:
            dataset_id = dataset_name

        params = {
            "$limit": min(limit, 50000),
            "$offset": offset
        }

        if select_fields:
            params["$select"] = ",".join(select_fields)

        if where_clause:
            params["$where"] = where_clause

        if order_by:
            params["$order"] = order_by

        # Try data.cdc.gov first, fall back to chronicdata.cdc.gov
        try:
            data = self._make_request(dataset_id, params)
        except Exception:
            logger.info("Trying chronicdata.cdc.gov...")
            data = self._make_request(dataset_id, params, base_url=self.CHRONICDATA_URL)

        return {
            "dataset": dataset_name,
            "count": len(data),
            "data": data
        }

    def get_available_measures(
        self,
        dataset_type: str = "places_county_2024"
    ) -> Dict[str, Any]:
        """
        Get list of available measures for a dataset.

        Args:
            dataset_type: Dataset identifier key

        Returns:
            Dictionary with unique measures
        """
        if dataset_type not in self.DATASETS:
            raise ValueError(f"Invalid dataset type: {dataset_type}")

        dataset_id = self.DATASETS[dataset_type]

        # Get distinct measure IDs
        params = {
            "$select": "DISTINCT measureid, measure",
            "$limit": 1000
        }

        data = self._make_request(dataset_id, params)

        return {
            "dataset": dataset_type,
            "measure_count": len(data),
            "measures": data
        }
