import React, { useState, useEffect, useCallback } from "react";

// URLの定数を定義
const url = "http://localhost:8080";

function App() {
  // useStateでデータの保持
  const [data, setData] = useState([]);
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    impression: "",
  });
  const [updateData, setUpdateData] = useState({
    updateTitle: "",
    updateAuthor: "",
    updateImpression: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [sortState, setSortState] = useState("");

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
  const handleDelete = (bookid) => {
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
  const handleUpdate = (bookid) => {
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

  const handleChange = useCallback((event, setBookData, bookData) => {
    setBookData({ ...bookData, [event.target.name]: event.target.value });
  }, []);

  const handleUpdateChange = useCallback((event, setUpdateData, updateData) => {
    setUpdateData({ ...updateData, [event.target.name]: event.target.value });
  }, []);

  const handleSearchWordChange = useCallback((event, setSearchWord) => {
    setSearchWord(event.target.value);
  }, []);

  return (
    <>
      <h1>読書記録</h1>
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
      <div>
        <input
          name="searchWord"
          placeholder="検索フォーム"
          value={searchWord}
          onChange={(event) => handleSearchWordChange(event, setSearchWord)}
        />
        <button onClick={handleSearch}>検索</button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>
              {(() => {
                if (sortState === "ascTitle") {
                  return <button onClick={handleTitleSort} >タイトル ↑</button>;
                } else if (sortState === "descTitle") {
                  return <button onClick={handleTitleSort}>タイトル ↓</button>;
                } else {
                  return <button onClick={handleTitleSort}>タイトル</button>;
                }
              })()}
            </th>
            <th>
              {(() => {
                if (sortState === "ascAuthor") {
                  return <button onClick={handleAuthorSort}>作者 ↑</button>;
                } else if (sortState === "descAuthor") {
                  return <button onClick={handleAuthorSort}>作者 ↓</button>;
                } else {
                  return <button onClick={handleAuthorSort}>作者</button>;
                }
              })()}
            </th>
            <th>ひとこと感想</th>
            <th>削除ボタン</th>
            <th>編集/更新ボタン</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.bookid}>
              <td>
                {editingId === item.bookid ? ( // 編集モード時にテキストボックスを表示
                  <input
                    name="updateTitle"
                    placeholder="タイトルを入力して更新"
                    value={updateData.updateTitle}
                    onChange={(event) => handleUpdateChange(event, setUpdateData, updateData)}
                  />
                ) : (
                  item.title // 通常時はタイトルを表示
                )}
              </td>
              <td>
                {editingId === item.bookid ? (// 編集モード時にテキストボックスを表示
                  <input
                    name="updateAuthor"
                    placeholder="作者を入力して更新"
                    value={updateData.updateAuthor}
                    onChange={(event) => handleUpdateChange(event, setUpdateData, updateData)}
                  />
                ) : (
                  item.author // 通常時は作者を表示
                )}
              </td>
              <td>
                {editingId === item.bookid ? (// 編集モード時にテキストボックスを表示
                  <input
                    name="updateImpression"
                    placeholder="ひとこと感想を入力して更新"
                    value={updateData.updateImpression}
                    onChange={(event) => handleUpdateChange(event, setUpdateData, updateData)}
                  />
                ) : (
                  item.impression // 通常時は感想を表示
                )}
              </td>
              <td><button onClick={() => handleDelete(item.bookid)}>削除</button></td>
              <td>
                {editingId === item.bookid ? ( // 編集モード時は「更新ボタン」を表示
                  <button onClick={() => handleUpdate(item.bookid)}>更新</button>
                ) : (
                  <button onClick={() => {
                    // 編集ボタンをクリックで編集モードに入り、初期値に本の情報をセット
                    setEditingId(item.bookid);
                    setUpdateData({ "updateTitle": item.title, "updateAuthor": item.author, "updateImpression": item.impression, });
                  }}>編集</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
