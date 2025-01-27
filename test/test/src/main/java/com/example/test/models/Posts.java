package com.example.test.models;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "posts")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "post_id")  // Thêm ID generator
public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long post_id;

    private String title;

    @Lob // @Lob cho phép lưu trữ văn bản dài
    @Column(name = "content",length = 500000000)
    private String content;

    //Nếu bạn muốn cho phép một số định dạng ngày tháng tùy chỉnh, bạn có thể sử dụng annotation
    // @DateTimeFormat trong Spring Boot để chỉ định định dạng cho LocalDate.
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate created_at;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate updated_at;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private PostStatus status; // Trạng thái của bài viết (pending, approved, rejected)


    public enum PostStatus {
        Pending,Approved
    }

    @PrePersist
    public void setDefaultStatus() {
        if (this.status == null) {
            this.status = PostStatus.Pending;
        }
    }







}