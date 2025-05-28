import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import classNames from "classnames/bind";
import styles from "../post/post.module.scss"; // Nếu có sử dụng CSS module
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { fetchUserId } from "~/hook/service";
import JoditEditor from "jodit-react";

const cx = classNames.bind(styles);

function Update() {
  const editor = useRef(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null);
  const [isCheckVip, setCheckVip] = useState(false);
  const [membership, setMembership] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Chưa chọn tệp");
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");
  const [errorMembership, setErrorMembership] = useState("");
  const navigate = useNavigate();
  const { postId } = useParams(); // Lấy postId từ URL để xác định bài viết cần chỉnh sửa

  // Cấu hình JoditEditor
  const config = {
    placeholder: "Nhập nội dung",
    height: 400,
    textIcons: false,
    iframe: false,
    replaceNBSP: true,
    removeEmptyBlocks: false,
  };

  // Lấy danh sách danh mục
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/category`)
      .then((res) => {
        setCategory(res.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Lấy thông tin người dùng
  useEffect(() => {
    fetchUserId(setUserId);
  }, []);

  // Lấy thông tin membership của người dùng
  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/${userId}`);
        if (isMounted) {
          setMembership(response.data.membershipId);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Lấy dữ liệu bài viết cần chỉnh sửa (nếu có postId)
  useEffect(() => {
    if (!postId) return; // Nếu không có postId, đây là chế độ tạo mới

    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${postId}`);
        const post = response.data;
        setTitle(post.title);
        setContent(post.content);
        setCategoryId(post.categoryId);
        setCheckVip(post.checkMembership);
        setFileName(post.image ? post.image : "Chưa chọn tệp"); // Giả sử API trả về tên file hoặc URL
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bài viết:", error);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      }
    };

    fetchPost();
  }, [postId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "Chưa chọn tệp");
  };

  const handleSelectmembership = (e) => {
    const selectedValue = e.target.value;
    const isVip = selectedValue === "true";

    if (membership === 1 && isVip) {
      setErrorMembership(
        <div className={cx("text-danger", "mt-2")}>
          Bạn không có quyền chọn VIP. Hãy nâng cấp thành viên{" "}
          <Link to="/nang-cap">
            <span className={cx("fw-bold", "text-danger")}>tại đây</span>
          </Link>
        </div>
      );
      return;
    }

    setErrorMembership(null);
    setCheckVip(isVip);
  };

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Kiểm tra dữ liệu đầu vào
    if (!title.trim()) {
      setError("Tiêu đề không được để trống");
      setIsSubmitting(false);
      return;
    }

    if (!content.trim()) {
      setError("Nội dung không được để trống");
      setIsSubmitting(false);
      return;
    }

    if (!categoryId) {
      setError("Hãy chọn danh mục");
      setIsSubmitting(false);
      return;
    }

    setError("");

    if (!userId) {
      alert("Bạn cần đăng nhập để tạo hoặc chỉnh sửa bài viết.");
      setIsSubmitting(false);
      return navigate("/login");
    }

    const formDataWithContent = new FormData();
    formDataWithContent.append("title", title);
    formDataWithContent.append("content", content);
    formDataWithContent.append("userId", userId);
    formDataWithContent.append("categoryId", categoryId);
    formDataWithContent.append("checkMembership", isCheckVip);
    if (file) formDataWithContent.append("file", file);

    try {
      if (postId) {
        // Chế độ cập nhật bài viết
        await axios.put(`http://localhost:8080/api/posts/${postId}`, formDataWithContent, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Cập nhật bài viết thành công!");
      } else {
        // Chế độ tạo mới bài viết
        await axios.post("http://localhost:8080/api/posts", formDataWithContent, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Tạo bài viết thành công!");
      }

      // Reset form và chuyển hướng
      setContent("");
      setTitle("");
      setCategoryId("");
      setFile(null);
      setFileName("Chưa chọn tệp");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi xử lý bài viết. Vui lòng thử lại sau và báo cáo với admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div>
        <h1 className={cx("title", "py-5")}>{postId ? "Chỉnh sửa bài viết" : "Thêm bài viết"}</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className={cx("my-3")}>
            <Form.Label className={cx("tit")}>Tiêu đề</Form.Label>
            <Form.Control
              className={cx("p-3", "post-title")}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              type="text"
              placeholder="Nhập tiêu đề"
              onInvalid={(e) => {
                e.target.setCustomValidity("Vui lòng nhập tiêu đề");
              }}
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </Form.Group>

          <Form.Group className={cx("my-3")}>
            <Form.Label className={cx("tit")}>Nội dung</Form.Label>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              onBlur={(newContent) => setContent(newContent)}
              onChange={() => {}}
              onInvalid={(e) => {
                e.target.setCustomValidity("Vui lòng nhập nội dung!");
              }}
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label className={cx("tit")}>Danh mục</Form.Label>
            <Form.Select
              as="select"
              className={cx("p-3", "categories", "categoryName")}
              value={categoryId}
              onChange={handleCategoryChange}
            >
              <option value="">Chọn danh mục</option>
              {category.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {error && <p className={cx("text-danger fw-bold mt-2")}>{error}</p>}

          <Form.Group className={cx("my-2")}>
            <div>
              <Form.Label className={cx("text-success", "success")}>
                Bạn có thể chọn ảnh phù hợp với nội dung. Nếu để trống, hình ảnh mặc định sẽ được sử dụng.
              </Form.Label>
            </div>

            <Form.Label className={cx("tit")}>Hình ảnh</Form.Label>
            <div>
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="fileInput">{fileName}</label>
              <Button
                variant="outline-secondary"
                onClick={() => document.getElementById("fileInput").click()}
                className={cx("image-file", "mx-3")}
              >
                Chọn tệp
              </Button>
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label className={cx("tit")}>Quyền đọc</Form.Label>
            <Form.Select
              as="select"
              className={cx("p-3", "categories", "categoryName")}
              value={isCheckVip.toString()}
              onChange={handleSelectmembership}
            >
              <option value="">Chọn quyền</option>
              <option value="true">VIP</option>
              <option value="false">Thường</option>
            </Form.Select>
          </Form.Group>

          {errorMembership && <p className={cx("text-danger mt-2")}>{errorMembership}</p>}

          <Button variant="secondary" className={cx("new-post", "my-5")} type="submit" disabled={isSubmitting}>
            {postId ? "Cập nhật bài viết" : "Tạo bài viết"}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Update;