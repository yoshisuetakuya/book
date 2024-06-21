package com.example.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.book.dto.BookDto;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author 芳末　拓也
 * データベースを操作するためのクエリを記載したリポジトリクラス
 */
public interface BookRepository extends JpaRepository<BookDto, Integer> {
	/**
	 *
	 * タイトルまたは作者に部分一致する本の情報を返すメソッド
	 *  @param keyword
	 *  @return { "bookid": number, "title": "タイトル", "author": "作者", "impression": "感想" }
	 */
	@Query("SELECT b FROM BookDto b WHERE b.title LIKE %:keyword% OR b.author LIKE %:keyword%")
	List<BookDto> searchByTitleOrAuthor(@Param("keyword") String keyword);
}