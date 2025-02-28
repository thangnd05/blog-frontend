import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import classNames from "classnames/bind";
import style from "./btnCate.module.scss"

const cx=classNames.bind(style)

function Category() {
  const [categories, setCategories] = useState([]); 
  const navigate = useNavigate();
  

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/category")
      .then((response) => {
        setCategories(response.data); 
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh mục:", error);
      });
  }, []);

  const handleClick = (categoryId) => {
    navigate(`/category/${categoryId}`); // Điều hướng tới trang với categoryId
  };

  return (
    <div>
    <p className={cx("fw-bold pt-4" )} style={{fontSize: "2.2rem",}}>Đề xuất</p>
      <div style={{ display: "flex", gap: "10px" , flexWrap: "wrap"}}>
        {categories.map((category) => (
          <Button
            variant=""
            key={category.category_id} 
            className={cx("bg-body-tertiary","btn-cate")}
            onClick={() => handleClick(category.category_id)} // Truyền category.id khi click
          >
            {category.categoryName}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default Category;
