package com.example.test.respositories;

import com.example.test.models.Posts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRespo extends JpaRepository<Posts, Long> {
    // Tìm kiếm bài viết có tiêu đề chứa từ khóa 'title', không phân biệt chữ hoa chữ thường

    List<Posts> findByTitleContainingIgnoreCase(String title);//viet dung de tim kiem

    //dung de duyet bai viet
    List<Posts>findByStatus(Posts.PostStatus status);


    List<Posts> findByCategoryIdAndStatus(Long categoryId, Posts.PostStatus status);

    List<Posts>findByUserId(Long UserId);

}

