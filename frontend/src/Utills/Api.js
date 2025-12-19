export async function fetchSearchSuggestions(query) {
  const url = new URL(
    "https://nal.tmmumbai.in/CustomerService/getSearchSuggestion"
  );
  url.searchParams.set("searchString", query);
  url.searchParams.set("isMultiSearch", "true");
  url.searchParams.set("elasticSearchType", "SEARCH_SUGGESTION");
  url.searchParams.set("warehouseId", "20");
  url.searchParams.set("variantId", "18");
  url.searchParams.set("searchVariant", "N");
  url.searchParams.set("orderConfirmSrc", "WEBSITE");
  url.searchParams.set("sourceVersion", "TM_WEBSITE_V_4.0.3");

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("API request failed with status:", response.status);
      return;
    }

    const json = await response.json();
    const suggestions = json.responseData.suggestionWithType || [];
    return suggestions;
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Example usage
// fetchSearchSuggestions("pa");
