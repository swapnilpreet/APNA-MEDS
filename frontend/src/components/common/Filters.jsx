import "../css/Filters.css";

const Filters = ({
  keyword,
  setKeyword,
  brand,
  setBrand,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  brandList,
  onApply,
  setCurrentPage,
}) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="filter-input"
        placeholder="Search medicine..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setCurrentPage(1);
        }}
      />

      <select
        className="filter-select"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      >
        <option value="">All Brands</option>
        {brandList.map((b, index) => (
          <option key={index} value={b}>
            {b}
          </option>
        ))}
      </select>

      <input
        type="number"
        className="filter-input"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />

      <input
        type="number"
        className="filter-input"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />

      <button className="apply-button" onClick={onApply}>
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;
