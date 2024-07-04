import React, { useState, useEffect, useCallback } from "react";
import SearchForm from "./SearchForm";
import BookTable from "./BookTable";
import BookForm from "./BookForm";
import type { Book, BookFormData, UpdateFormData } from "./@types";  // 型をインポート
// URLの定数を定義
const url = "http://localhost:8080";

const App = () => {
  // useStateでデータの保持
  const [data, setData] = useState<Book[]>([]);;
  const [bookData, setBookData] = useState<BookFormData>({
    title: "",
    author: "",
    impression: "",
  });
  const [updateData, setUpdateData] = useState<UpdateFormData>({
    updateTitle: "",
    updateAuthor: "",
    updateImpression: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchWord, setSearchWord] = useState<string>("");
  const [sortState, setSortState] = useState<string>("");

  // 初回レンダリング時にデータを全件取得する
  useEffect(() => {
    fetch(`${url}/Get`)  // fetchメソッドでサーバーからデータを取得
      .then((res) => res.json())        // 取得したレスポンスをjson形式に変換
      .then((json) => setData(json))    // jsonデータをセット
      .catch((error) => console.log("Error:", error));     // エラーが発生した場合の処理
  }, []); // 第二引数に[]を渡すことで初回レンダリング時のみ実行

  // 本の追加処理
  function handleCreate() {
    fetch(`${url}/Create`, {
      method: 'POST', // POSTメソッドを指定
      body: JSON.stringify({ "title": bookData.title, "author": bookData.author, "impression": bookData.impression }),// リクエストボディに新規本データをセット
      headers: {
        'Content-type': 'application/json',// リクエストヘッダーをJSON形式に指定
      },
    })
      .then((json) => {
        console.log(json);
        // 入力フォームを空にする
        setBookData({ title: "", author: "", impression: "", });
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => {
        // データを再取得する
        fetch(`${url}/Get`)
          .then((res) => res.json())
          .then((json) => setData(json))
          .catch((error) => console.error('Error:', error));
      });
  };

  // 本の削除処理
  const handleDelete = (bookid: number) => {
    fetch(`${url}/Delete/${bookid}`, {
      method: 'DELETE',// DELETEメソッドを指定
    })
      .then((json) => {
        console.log(json);
        // 削除後、データをフィルタリングして更新する
        setData(data.filter(item => item.bookid !== bookid));
      })
      .catch((error) => console.log("Error:", error));
  };

  // 本の更新処理
  const handleUpdate = (bookid: number) => {
    fetch(`${url}/Update/${bookid}`, {
      method: 'PUT',// PUTメソッドを指定
      body: JSON.stringify({ "bookid": bookid, "title": updateData.updateTitle, "author": updateData.updateAuthor, "impression": updateData.updateImpression }), // リクエストボディに更新データをセット
      headers: {
        'Content-type': 'application/json',// リクエストヘッダーをJSON形式に指定
      },
    })
      .then((json) => {
        console.log(json);
        // 該当のbookidで本のデータを更新する
        const updatedData = data.map(item => {
          if (item.bookid === bookid) {
            return { ...item, "title": updateData.updateTitle, "author": updateData.updateAuthor, "impression": updateData.updateImpression };
          } else {
            return item;
          }
        });
        setData(updatedData);// 更新後のデータをセット
        setEditingId(null);// 更新後、nullを渡して編集モードを解除する
      })
      .catch((error) => console.log("Error:", error));
  }

  //本の検索処理
  function handleSearch() {
    fetch(`${url}/Search`, {
      method: 'POST',// POSTメソッドを指定
      body: JSON.stringify({ "keyword": searchWord }), // リクエストボディに検索キーワードをセット
      headers: {
        'Content-type': 'application/json',// リクエストヘッダーをJSON形式に指定
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setData(json)// 検索結果をセットする
        setSearchWord(""); // 入力フォームを空にする
        setSortState("") // // ソート状態をリセットする
      })
      .catch((error) => console.error('Error:', error));
  };

  // タイトルでソートする機能
  function handleTitleSort() {
    if (sortState !== "ascTitle") {
      // 昇順にソートする
      const sortedData = [...data].sort((a, b) => (a.title < b.title ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新する
      setSortState("ascTitle"); // ソート状態を昇順に設定する
    } else if (sortState === "ascTitle") {
      // 降順にソートする
      const sortedData = [...data].sort((a, b) => (a.title > b.title ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新する
      setSortState("descTitle"); // ソート状態を降順に設定する
    }
  }
  // 作者でソートする機能
  function handleAuthorSort() {
    if (sortState !== "ascAuthor") {
      // 昇順にソートする
      const sortedData = [...data].sort((a, b) => (a.author < b.author ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新する
      setSortState("ascAuthor"); // ソート状態を昇順設定する
    } else if (sortState === "ascAuthor") {
      // 降順にソートします
      const sortedData = [...data].sort((a, b) => (a.author > b.author ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新する
      setSortState("descAuthor"); // ソート状態を降順設定する
    }
  }

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, setBookData: React.Dispatch<React.SetStateAction<BookFormData>>, bookData: BookFormData) => {
    setBookData({ ...bookData, [event.target.name]: event.target.value });
  }, []);

  const handleUpdateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, setUpdateData: React.Dispatch<React.SetStateAction<UpdateFormData>>, updateData: UpdateFormData) => {
    setUpdateData({ ...updateData, [event.target.name]: event.target.value });
  }, []);

  const handleSearchWordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>, setSearchWord: React.Dispatch<React.SetStateAction<string>>) => {
    setSearchWord(event.target.value);
  }, []);
  return (
    <>
      <h1>読書記録</h1>
      <BookForm
        bookData={bookData}
        handleChange={handleChange}
        handleCreate={handleCreate}
        setBookData={setBookData}
      />
      <SearchForm
        searchWord={searchWord}
        handleSearchWordChange={handleSearchWordChange}
        handleSearch={handleSearch}
        setSearchWord={setSearchWord}
      />
      <BookTable
        data={data}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
        handleUpdateChange={handleUpdateChange}
        setEditingId={setEditingId}
        setUpdateData={setUpdateData}
        updateData={updateData}
        editingId={editingId}
        handleTitleSort={handleTitleSort}
        handleAuthorSort={handleAuthorSort}
        sortState={sortState}
      />
    </>
  );
}

export default App;
