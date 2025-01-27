package com.example.test.respositories;

import com.example.test.models.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository<Comments,Long> {

    List<Comments>findByPostId( Long postId); //can khop vs ten

    List<Comments>findByUserId(Long userId);

    @Transactional  //Đảm bảo rằng thao tác được thực hiện trong một giao dịch.
    @Modifying //Chỉ định rằng đây là một truy vấn sửa đổi dữ liệu (DELETE/UPDATE).
    @Query("DELETE FROM Comments c WHERE c.postId = :postId") //Sử dụng JPQL để thực hiện xóa tất cả các Comments có postId tương ứng.
    void deleteByPostId(Long postId);
}
