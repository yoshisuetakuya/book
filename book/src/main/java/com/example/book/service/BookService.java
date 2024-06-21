package com.example.book.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.book.dto.BookDto;
import com.example.book.repository.BookRepository;

import jakarta.transaction.Transactional;

/**
 *
 * @author 芳末　拓也
 *　本の取得・登録・更新・削除・検索を行うサービスクラス
 */
@Service
@Transactional // @Transactionalを付けることでトランザクション制御を行う
public class BookService {
	@Autowired
	BookRepository repository;

	/**
	 * 本を全件取得するメソッド
	 * @return　{ "bookid": number, "title": "タイトル", "author": "作者", "impression": "感想" }
	 */
	public List<BookDto> findAll() {
		return repository.findAll();
	}

	/**
	 * 本を登録するメソッド
	 * @param dto
	 */
	public void insert(BookDto dto) {
		repository.save(dto);
	}

	/**
	 * 本の情報を更新するメソッド
	 * @param dto
	 */
	public void update(BookDto dto) {
		repository.save(dto);
	}

	/**
	 *　本の情報を削除するメソッド
	 * @param bookid
	 */
	public void delete(Integer bookid) {
		repository.deleteById(bookid);
	}

	/**
	 * タイトルまたは作者で検索して本の情報を取得するメソッド
	 * @param keyword
	 * @return { "bookid": number, "title": "タイトル", "author": "作者", "impression": "感想" }
	 */
	public List<BookDto> search(String keyword) {
		return repository.searchByTitleOrAuthor(keyword);
	}
}
