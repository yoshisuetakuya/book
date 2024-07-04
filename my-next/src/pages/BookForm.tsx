import React from 'react';
import type { BookFormProps } from "./@types";  // 型をインポート

const BookForm = ({
  bookData = {
    title: "",
    author: "",
    impression: ""
  },
  handleChange,
  handleCreate,
  setBookData
}: BookFormProps) => {
  return (
    <div>
      <p>本を追加する</p>
      <input
        name="title"
        placeholder="タイトル"
        value={bookData.title}
        onChange={(event) => handleChange(event, setBookData, bookData)}
      />
      <input
        name="author"
        placeholder="作者"
        value={bookData.author}
        onChange={(event) => handleChange(event, setBookData, bookData)}
      />
      <input
        name="impression"
        placeholder="ひとこと感想"
        value={bookData.impression}
        onChange={(event) => handleChange(event, setBookData, bookData)}
      />
      <button onClick={handleCreate}>追加</button>
    </div>
  );
};

export default BookForm;
