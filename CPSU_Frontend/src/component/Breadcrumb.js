import { Link } from "react-router-dom";

function Breadcrumb({ items }) {
  return (
    <div className="container mt-3">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">
              <i className="bi bi-house-fill me-1"></i>
              หน้าหลัก
            </Link>
          </li>

          {items.map((item, index) => (
            <li
              key={index}
              className={`breadcrumb-item ${
                index === items.length - 1 ? "active" : ""
              }`}
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.path ? (
                <Link to={item.path} className="text-decoration-none">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumb;
