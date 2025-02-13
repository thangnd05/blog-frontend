import classNames from "classnames/bind";
import style from "./search.module.scss"
import { useState,useRef,useEffect } from "react";
import { SearchIcon } from "~/assets/images";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import routes from "~/config";

const cx=classNames.bind(style)

function Search() {
    const [searchValue, setSearchValue] = useState(""); 
    const inputRef=useRef();
    const [showResult, setShowResult] = useState(false);
    const [data,setData]=useState([])
    const navigate = useNavigate();


    //nhúng data tìm kiếm
    useEffect(() => {
        if (searchValue) {
            // Gửi yêu cầu GET đến API với giá trị tìm kiếm (searchValue)
            axios.get(`http://192.168.100.205:8080/api/search?title=${searchValue}`)
                .then((response) => {
                    // console.log(response.data);
                    setData(response.data);
                })
                .catch((error) => {
                    console.error("Error", error);
                });
        } else {
            // Nếu giá trị tìm kiếm rỗng, xóa kết quả tìm kiếm
            setData([]);
        }
    }, [searchValue]); // useEffect chỉ chạy lại khi searchValue thay đổi

    //nút xóa bỏ nội dung ở tìm kiếm
    const handleClear = () => {
        setSearchValue("");      
        inputRef.current.focus();
    }

    const handleOut = () => {
        setShowResult(false);
        setSearchValue(""); 
    }

    
    const onSearch = (e) => {
        e.preventDefault();
        if (searchValue) {
            if (data.length === 0) {
                navigate(routes.error); // Chuyển hướng nếu không có kết quả
            } else {
                navigate(`/search/${searchValue}`);
            }
            setShowResult(false);
            setSearchValue("");
        }
    };
    return(
        <div className={cx('wrapper')}>

            <input
            ref={inputRef}
            className={cx('search','py-2 rounded')}
            value={searchValue}
            placeholder="Tìm kiếm"
            onChange={(e)=>setSearchValue(e.target.value)}
            onKeyDown={(e) => {//onkeydown thường dúng vs những tác vụ enter e
            if (e.key === ' ' && searchValue === '') {
                e.preventDefault(); 
            }
            if (e.key === "Enter") {
            onSearch(e);  // Gọi hàm onSearch khi nhấn Enter
        }}}
            onFocus={() => setShowResult(true)}
            onBlur={() => setTimeout(() =>handleOut(false), 250)}
            />


{/* nút x để xóa nội dung tìm kiếm */}
            {searchValue && (
                <button type="button" className={cx("btn-close",'clear')} onClick={handleClear} >
                {/* <FontAwesomeIcon icon={faXmark} /> */}
            </button>
            )}
            
            {/* hiển thị kết quả dưới search */}
            {showResult && searchValue && (
                <div className={cx('search-results')}>
                    {/* Nếu có dữ liệu từ API */}
                    {data.length > 0 ? (
                        data.map((item) => (
                            <Link to={routes.postDetail.replace(':id', item.post_id)} 
                            onClick={() =>{ setShowResult(false);setSearchValue('')}}>
                                <div key={item.post_id} className={cx('result-item')}>
                                    {item.title} 
                                </div>
                            </Link>
                        ))
                    ) : (
                        // Nếu không tìm thấy kết quả
                        <div className={cx('no-results')}>Không tìm thấy kết quả</div>
                    )}
                </div>
            )}
            <button className={cx('search-btn',"bg-dark py-2 px-3 mx-2 rounded",)} onClick={onSearch}  >
                <SearchIcon />
            </button>
           



        </div>
    );
}

export default Search;