package com.example.test.controller;

import com.example.test.models.Images;
import com.example.test.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3001") // Cho phép frontend truy cập
@RequestMapping("/api")
public class ImageController {

    @Autowired
    private ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    //lay anh theo id anh
//    @GetMapping("/images/{id}")
//    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
//        Optional<Images> imageOpt = imageService.getImageById(id);
//        if (imageOpt.isPresent()) {
//            Images image = imageOpt.get();
//            return ResponseEntity.ok()
//                    .contentType(MediaType.parseMediaType(image.getFileType()))
//                    .body(image.getImageData());  // Trả về imageData (dữ liệu ảnh)
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }

    //lay anh bang postId
    @GetMapping("/image/post/{id}")
    public ResponseEntity<byte[]> getImageByPostId(@PathVariable Long id) {
        Optional<Images> imagePostOpt = imageService.getImageByPostId(id);
        if (imagePostOpt.isPresent()) {
            Images image = imagePostOpt.get();
            byte[] imageData = image.getImageData(); // `getData()` là phương thức trả về dữ liệu ảnh (mảng byte).
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // Hoặc IMAGE_PNG, tùy định dạng ảnh.
                    .body(imageData);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    //lay anh theo ten
@GetMapping("/image/{fileName}")
public ResponseEntity<byte[]> getImage(@PathVariable String fileName) {
    try {
        // Xác định đường dẫn file
        Path path = Paths.get("uploads/").resolve(fileName);

        // Đọc file thành byte array
        byte[] imageData = Files.readAllBytes(path);

        // Trả về file ảnh với header đúng
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // hoặc MediaType.IMAGE_PNG
                .body(imageData);
    } catch (IOException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
}








}
