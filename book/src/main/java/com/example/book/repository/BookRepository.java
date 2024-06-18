package com.example.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.book.dto.Dto;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

// JpaRepositoryを継承したインターフェースを作成し、データベースを操作する
public interface BookRepository extends JpaRepository<Dto, Integer> {
	// JPQLでクエリを記載
	@Query("SELECT b FROM Dto b WHERE b.title LIKE %:keyword% OR b.author LIKE %:keyword%")
	List<Dto> searchByTitleOrAuthor(@Param("keyword") String keyword);
}