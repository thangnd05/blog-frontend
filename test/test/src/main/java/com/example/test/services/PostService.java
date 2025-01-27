package com.example.test.services;
import com.example.test.Dto.PostDto;
import com.example.test.models.Posts;
import com.example.test.respositories.CommentRepo;
import com.example.test.respositories.PostRespo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRespo postRespo;


    public PostService(PostRespo postRespo) {
        this.postRespo = postRespo;
    }

    public List<Posts>getAll(){
        return postRespo.findAll();
    }



    //xem toàn bộ bài viết đã duyệt
    public List<Posts>getAllPostApproved(){
        return postRespo.findByStatus(Posts.PostStatus.Approved);
    }


    public Optional<Posts>getById(Long id){
        return postRespo.findById(id);
    }


    //lưu bài viết
    public Posts save(Posts post) {
        if (post.getPost_id() == null) {
            post.setCreated_at(LocalDate.now());
        }
        post.setUpdated_at(LocalDate.now());
        return postRespo.save(post);
    }

    @Transactional

    //sửa bài viết
    public Posts update(Long id,Posts post){
        return postRespo.findById(id).map(postUpdate -> {
            postUpdate.setTitle(post.getTitle());
            postUpdate.setContent(post.getContent());
            postUpdate.setUpdated_at(LocalDate.now());
            return postRespo.save(postUpdate); // Lưu và trả về bản ghi đã cập nhật
        }).orElseThrow(() ->new RuntimeException("Not Found with id:" + id));
    }


    //Duyệt bài viết
    public Posts Approved(Long id){
        return postRespo.findById(id).map(postApproved ->{
            postApproved.setStatus(Posts.PostStatus.Approved);
            return postRespo.save(postApproved);
        }).orElseThrow(() ->new RuntimeException("Not Found with id:" + id));
    }



    @Transactional
    public void deleteById(Long id){
        postRespo.deleteById(id);
    }

    //tìm kiếm bài viết bằng tiêu đề
    @Transactional
    public List<Posts>searchPostByTile(String title){
        return postRespo.findByTitleContainingIgnoreCase(title);
    }


    public List<Posts>findPostByCategoryId(Long categoryId){
        return postRespo.findByCategoryIdAndStatus(categoryId,Posts.PostStatus.Approved);
    }


    //tìm bài viết tất cả bài viết thông qua user
    public List<Posts>getPostByUserId(Long userId){
        return  postRespo.findByUserId(userId);
    }





}
