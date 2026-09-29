import axios from "axios";
import { useState, useEffect } from "react";
import "./table.css";

const PAGE_SIZE = 10;

function Table() {
  const [quotes, setQuotes] = useState([]);
  const HEADER = ["Id", "Author", "Quote"];

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const [filters, setFilters] = useState({
    author: "",
    quote: "",
  });

  const sortableColumns = ["Author", "Quote"];
  const filterableColumns = ["Author", "Quote"];

  const getKey = (header) => header.toLowerCase();

  // -------------------------
  // Sorting
  // -------------------------
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // -------------------------
  // Filtering
  // -------------------------
  const handleFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // -------------------------
  // Fetch quotes
  // -------------------------
  const fetchQuotes = async () => {
    try {
      const skip = (page - 1) * PAGE_SIZE;

      const response = await axios.get(
        "https://dummyjson.com/quotes",
        {
          params: {
            limit: PAGE_SIZE,
            skip,
          },
        }
      );

      setQuotes(response.data.quotes);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [page]);

  // -------------------------
  // Filter
  // -------------------------
  const filteredQuotes = quotes.filter((quote) => {
    const authorMatch = quote.author
      .toLowerCase()
      .includes(filters.author.toLowerCase());

    const quoteMatch = quote.quote
      .toLowerCase()
      .includes(filters.quote.toLowerCase());

    return authorMatch && quoteMatch;
  });
  // -------------------------
  // Sort
  // -------------------------
  const processedQuotes = [...filteredQuotes].sort((a, b) => {
    if (!sortConfig.key) {
      return 0;
    }

    const valueA = a[sortConfig.key]
      ?.toString()
      .toLowerCase();
    const valueB = b[sortConfig.key]
      ?.toString()
      .toLowerCase();

    if (valueA < valueB) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }

    if (valueA > valueB) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            {HEADER.map((header) => {
              const key = getKey(header);

              const isSortable =
                sortableColumns.includes(header);

              const isFilterable =
                filterableColumns.includes(header);

              return (
                <th key={header}>
                  <div className="data-table-header">
                    {/* Sort */}
                    <div
                      className={
                        isSortable
                          ? "data-table-sort"
                          : ""
                      }
                      onClick={() =>
                        isSortable && handleSort(key)
                      }
                    >
                      {header}

                      {isSortable &&
                        sortConfig.key === key &&
                        (sortConfig.direction === "asc"
                          ? " ↑"
                          : " ↓")}
                    </div>

                    {/* Filter */}
                    {isFilterable && (
                      <input
                        type="text"
                        placeholder={`Filter ${header}`}
                        value={filters[key]}
                        onChange={(e) =>
                          handleFilter(
                            key,
                            e.target.value
                          )
                        }
                      />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {processedQuotes.map((quote) => (
            <tr key={quote.id}>
              <td>{quote.id}</td>
              <td>{quote.author}</td>
              <td>{quote.quote}</td>
            </tr>
          ))}

          {processedQuotes.length === 0 && (
            <tr>
              <td colSpan={HEADER.length}>
                No quotes found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="data-table-pagination">
        <button
          className="data-table-pagination-button"
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="data-table-pagination-button"
          disabled={page === totalPages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
        >
          Next
        </button>
      </div>
    </>
  );
}

export default Table;