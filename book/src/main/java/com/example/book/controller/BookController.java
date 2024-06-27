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

import com.example.book.dto.BookDto;
import com.example.book.service.BookService;

/**
 *
 * @author 芳末　拓也
 * 本の取得・登録・更新・削除・検索を行うコントローラークラス
 *
 */
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class BookController {

	@Autowired
	BookService service;

	/**
	 * 本を全件取得するメソッド
	 * @return { "bookid": number, "title": "タイトル", "author": "作者", "impression": "感想" }
	 */
	// データベースのbookテーブルより本を全件取得
	@GetMapping("/Get")
	public List<BookDto> get() {
		return service.findAll();
	}

	/**
	 * 本を登録するメソッド
	 * @param dto
	 */
	// 新規追加
	@PostMapping("/Create")
	public void save(@RequestBody BookDto dto) {
		// serviceクラスのinsertメソッドを呼び出し、DBに入力値を登録
		service.insert(dto);
	}

	/**
	 * 本の情報を更新するメソッド
	 * @param bookid
	 * @param dto
	 */
	// 指定した本idで更新
	@PutMapping("/Update/{bookid}")
	public void update(@PathVariable("bookid") Integer bookid, @RequestBody BookDto dto) {
		dto.setBookid(bookid);
		service.update(dto);
	}

	/**
	 * 本の情報を削除するメソッド
	 * @param bookid
	 */
	// 指定した本idで削除
	@DeleteMapping("/Delete/{bookid}")
	public void delete(@PathVariable("bookid") Integer bookid) {
		service.delete(bookid);
	}

	/**
	 * タイトルまたは作者で検索して本の情報を取得するメソッド
	 * @param requestData
	 * @return { "bookid": number, "title": "タイトル", "author": "作者", "impression": "感想" }
	 */
	// タイトルと作者で検索する
	@PostMapping("/Search")
	public List<BookDto> searchBooks(@RequestBody Map<String, String> requestData) {
		String keyword = requestData.get("keyword");
		return service.search(keyword);
	}

}
