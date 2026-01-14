// import "../css/Pagination.css";

// const Pagination = ({ totalPages, handlePageChange, currentPage }) => {
//   return (
//     <>
//       {totalPages > 1 && (
//         <div className="pagination-wrapper">
//           <button
//             className="page-button"
//             onClick={() => handlePageChange(currentPage - 1)}
//             disabled={currentPage===1}
//           >
//             Prev
//           </button>

// {/* if number are to big then hide as per the screen size for mobile screen show first 4 button then silde button as per the click */}
//           {[...Array(totalPages)].map((_, index) => (
//             <button
//               key={index}
//               className={`page-button ${
//                 currentPage === index + 1 ? "active" : ""
//               }`}
//               onClick={() => handlePageChange(index + 1)}
//             >
//               {index + 1}
//             </button>
//           ))}

//           <button
//             className="page-button"
//             onClick={() => handlePageChange(currentPage + 1)}
//             disabled={currentPage === totalPages}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default Pagination;


import "../css/Pagination.css";

const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = window.innerWidth < 768 ? 3 : 6;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    // Always show first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // // Always show last page
    if (end < totalPages) {
      if (end < totalPages-1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <button
        className="page-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="dots">...</span>
        ) : (
          <button
            key={index}
            className={`page-button ${
              currentPage === page ? "active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="page-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
