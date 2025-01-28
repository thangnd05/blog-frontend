import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

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
    <div style={{ display: "flex", gap: "10px" , flexWrap: "wrap"}}>
      {categories.map((category) => (
        <Button
          variant="outline-secondary"
          key={category.category_id} 
          style={{
            padding: "5px 15px",
            borderRadius: "10px",
            fontSize: "1.4rem",
            fontWeight: 700,
          }}
          onClick={() => handleClick(category.category_id)} // Truyền category.id khi click
        >
          {category.categoryName}
        </Button>
      ))}
    </div>
  );
}

export default Category;
