package com.example.test.respositories;
import com.example.test.models.Images;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRespo extends JpaRepository<Images,Long> {

//    List<Images> findByPostId(Long postId);

    Optional<Images>findByPostId(Long postId);

    @Transactional  //Đảm bảo rằng thao tác được thực hiện trong một giao dịch.
    @Modifying //Chỉ định rằng đây là một truy vấn sửa đổi dữ liệu (DELETE/UPDATE).
    @Query("DELETE FROM Images c WHERE c.postId = :postId") //Sử dụng JPQL để thực hiện xóa tất cả các Image có postId tương ứng.
    void deleteByPostId(Long postId);


}
