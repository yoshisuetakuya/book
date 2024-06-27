package com.example.book.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.book.dto.BookDto;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 *
 * @author 芳末 拓也 コントローラーのテストを行うクラス
 */
@SpringBootTest
@AutoConfigureMockMvc
class BookControllerTest {

	@Autowired
	private MockMvc mockMvc;

	/**
	 * 本の一覧を取得するメソッドのテスト
	 *
	 * @throws Exception
	 */
	@Test
	public void getTest() throws Exception {
		mockMvc.perform(get("/Get")).andDo(print()) // コンソールに出力
				.andExpect(status().isOk()) // ステータスがOKであることを検証
				.andExpect(content().contentType(MediaType.APPLICATION_JSON)) // JSONであることを検証
				.andExpect(jsonPath("$[0].bookid").value("2")) // 最初の要素のbookidが"2"であることを検証
				.andExpect(jsonPath("$[0].title").value("test")) // 最初の要素のtitleが"test"であることを検証
				.andExpect(jsonPath("$[0].author").value("test")) // 最初の要素のauthorが"test"であることを検証
				.andExpect(jsonPath("$[0].impression").value("test")); // 最初の要素のimpressionが"test"であることを検証
	}

	/**
	 * 本を追加するメソッドのテスト
	 *
	 * @throws Exception
	 */
	@Test
	public void saveTest() throws Exception {
		// 新しい本の情報
		String newTitle = "テスト本";
		String newAuthor = "テスト著者";
		String newImpression = "テスト感想";

		// 情報をセットする
		BookDto bookDto = new BookDto();
		bookDto.setTitle(newTitle);
		bookDto.setAuthor(newAuthor);
		bookDto.setImpression(newImpression);

		// JSON文字列に変換する
		ObjectMapper mapper = new ObjectMapper();
		String bookJson = mapper.writeValueAsString(bookDto);

		// POSTリクエストを実行する
		mockMvc.perform(post("/Create").contentType(MediaType.APPLICATION_JSON).content(bookJson))
				.andExpect(status().isOk()) // ステータスがOKであることを検証
				.andDo(print()); // コンソールに出力
	}

	/**
	 * 本を更新するメソッドのテスト
	 *
	 * @throws Exception
	 */
	@Test
	public void updateTest() throws Exception {
		// 更新データ
		int bookId = 1;
		String updatedTitle = "更新タイトル";
		String updatedAuthor = "更新作者";
		String updatedImpression = "更新感想";

		// 情報をセットする
		BookDto bookDto = new BookDto();
		bookDto.setTitle(updatedTitle);
		bookDto.setAuthor(updatedAuthor);
		bookDto.setImpression(updatedImpression);

		// JSON文字列に変換する
		ObjectMapper mapper = new ObjectMapper();
		String json = mapper.writeValueAsString(bookDto);

		// PUTリクエストを実行する
		mockMvc.perform(put("/Update/{bookid}", bookId).contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(status().isOk()) // ステータスがOKであることを検証
				.andDo(print()); // コンソールに出力
	}

	/**
	 * 本を削除するメソッドのテスト
	 *
	 * @throws Exception
	 */
	@Test
	public void deleteTest() throws Exception {
		mockMvc.perform(delete("/Delete/{bookid}", 1)).andDo(print())// コンソールに出力
				.andExpect(status().isOk());// ステータスがOKであることを検証
	}

	/**
	 * 本をキーワードで検索するメソッドのテスト
	 *
	 * @throws Exception
	 */
	@Test
	public void searchTest() throws Exception {
		//　オブジェクトを作成しjsonにしている
		ObjectMapper objectMapper = new ObjectMapper();
		String json = objectMapper.writeValueAsString(Map.of("keyword", "test"));

		mockMvc.perform(post("/Search").contentType(MediaType.APPLICATION_JSON).content(json))
				.andExpect(status().isOk()) // ステータスがOKであることを検証
				.andDo(print()) // コンソールに出力
				.andExpect(jsonPath("$").isArray()) // レスポンスが配列であることを検証
				.andExpect(jsonPath("$[0].title").value("test")) // 期待するタイトルの値を検証
				.andExpect(jsonPath("$[0].author").value("test")); // 期待する著者の値を検証
	}

}
