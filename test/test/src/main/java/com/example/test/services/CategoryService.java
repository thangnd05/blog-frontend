package com.example.test.services;

import com.example.test.models.Categories;
import com.example.test.models.Posts;
import com.example.test.respositories.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private CategoryRepo categoryRepo;
    @Autowired
    public CategoryService(CategoryRepo categoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    public List<Categories>getAllCategory(){
        return categoryRepo.findAll();
    }

    public Optional<Categories> findById(Long categoryId) {
        return categoryRepo.findById(categoryId);  // Sử dụng categoryId cho đúng
    }
    @Transactional
    public Categories saveCategory(Categories categories) {
        if (categories.getCategory_id() == null) {
            categories.setCreated_at(LocalDateTime.now());
        }
        return categoryRepo.save(categories);
    }
    @Transactional
    public void DeleteCategorybyId(Long id){
        categoryRepo.deleteById(id);
    }


    @Transactional
    public Categories update(Long id, Categories categories){
        return categoryRepo.findById(id).map(cateUpdate -> {
            cateUpdate.setCategoryName(categories.getCategoryName());
            return categoryRepo.save(cateUpdate); // Lưu và trả về bản ghi đã cập nhật
        }).orElseThrow(() ->new RuntimeException("Not Found with id:" + id));
    }








    public List<Categories>findCategoryBycategoryName(String categoryName){
        return  categoryRepo.findCategoryByCategoryName(categoryName);
    }
}
