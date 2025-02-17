const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = []
  
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
  
    return (
      <nav className="pagination">
        <ul>
          {pageNumbers.map((number) => (
            <li key={number} className={number === currentPage ? "active" : ""}>
              <button onClick={() => onPageChange(number)}>{number}</button>
            </li>
          ))}
        </ul>
      </nav>
    )
  }
  
  export default Pagination
  
  