import { Link } from "react-router-dom";

const NewsCard = ({ item }) => {
  return (
    <div className="card h-300" id="news-homepage">
      <img
        src={
          item.images && item.images.length > 0
            ? item.images[0].file_image
            : "/images/cpsu.png"
        }
        className="card-img-top"
        alt={item.title}
      />

      <div className="card-body">
        <h5 className="card-title">
          {item.title.length > 80
            ? item.title.substring(0, 80) + "..."
            : item.title}
        </h5>

        <Link to={`/news/${item.news_id}`}>
          <button className="btn btn-more">อ่านต่อ</button>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;