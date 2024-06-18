package com.example.book.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.book.dto.Dto;
import com.example.book.repository.BookRepository;

import jakarta.transaction.Transactional;

@Service // serviceクラスであることを示す
@Transactional // @Transactionalを付けることでトランザクション制御を行う
public class BookService {
	@Autowired
	BookRepository repository;

	// データベースより本を全件取得
	public List<Dto> findAll() {
		return repository.findAll();
	}

	// データベースに本を登録
	public void insert(Dto dto) {
		repository.save(dto);
	}

	// データベースの値を更新
	public void update(Dto dto) {
		repository.save(dto);
	}

	// データベースの値を削除
	public void delete(Integer bookid) {
		repository.deleteById(bookid);
	}

	// データベースよりタイトルまたは作者で検索して取得
	public List<Dto> search(String keyword) {
		return repository.searchByTitleOrAuthor(keyword);
	}
}
