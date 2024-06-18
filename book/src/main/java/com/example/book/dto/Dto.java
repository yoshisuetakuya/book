package com.example.book.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

//JPAのエンティティであることを示すアノテーション
@Entity
@Getter
@Setter
//エンティティに対応するテーブル名を指定。 "book"部分はPostgreSQLで作成したテーブル名
@Table(name = "book")
public class Dto {
	// エンティティの主キーを指定。今回であれば "bookid" カラムになる
	@Id
	//　bookidを自動採番する
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	// カラムに名前を付与
	@Column(name = "bookid")
	private Integer bookid;

	@Column(name = "title")
	private String title;

	@Column(name = "author")
	private String author;

	@Column(name = "impression")
	private String impression;

}
