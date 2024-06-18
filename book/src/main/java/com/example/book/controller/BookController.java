package com.example.book.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.book.dto.Dto;
import com.example.book.service.BookService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class BookController {
	@GetMapping("/")
	public String hello() {
		return "アクセス成功です"; // 文字列を返す
	}

	@Autowired
	BookService service;

	// データベースのbookテーブルより本を全件取得
	@GetMapping("/Get")
	public List<Dto> get() {
		return service.findAll();
	}

	// 新規追加
	@PostMapping("/Create")
	public void save(@RequestBody Dto dto) {
		// serviceクラスのinsertメソッドを呼び出し、DBに入力値を登録
		service.insert(dto);
	}

	// 指定した本idで更新
	@PutMapping("/Update/{bookid}")
	public void update(@PathVariable("bookid") Integer bookid, @RequestBody Dto dto) {
		dto.setBookid(bookid);
		service.update(dto);
	}

	// 指定した本idで削除
	@DeleteMapping("/Delete/{bookid}")
	public void delete(@PathVariable("bookid") Integer bookid) {
		service.delete(bookid);
	}

	// タイトルと作者で検索する
	@PostMapping("/Search")
	public List<Dto> searchBooks(@RequestBody Map<String, String> requestData) {
		String keyword = requestData.get("keyword");
		return service.search(keyword);
	}

}
