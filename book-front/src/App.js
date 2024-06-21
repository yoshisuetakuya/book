import React, { useState, useEffect } from "react";

function App() {
  //useStateでデータの保持
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [impression, setImpression] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateAuthor, setUpdateAuthor] = useState("");
  const [updateImpression, setUpdateImpression] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchWord, setSearchWord] = useState("");
  const [sortState, setSortState] = useState("");

   // 初回レンダリング時にデータを全件取得する
  useEffect(() => {
    fetch("http://localhost:8080/Get")  // fetchメソッドでサーバーからデータを取得
      .then((res) => res.json())        // 取得したレスポンスをjson形式に変換
      .then((json) => setData(json))    // jsonデータをセット
      .catch((error) => console.log("Error:", error));     // エラーが発生した場合の処理
  }, []); // 第二引数に[]を渡すことで初回レンダリング時のみ実行

  // 本の追加処理
  function handleCreate() {
    fetch("http://localhost:8080/Create", {
      method: 'POST', // POSTメソッドを指定
      body: JSON.stringify({ "title": title, "author": author, "impression": impression }),// リクエストボディに新規本データをセット
      headers: {
        'Content-type': 'application/json',// リクエストヘッダーをJSON形式に指定
      },
    })
      .then((json) => {
        console.log(json);
        // 入力フォームを空にする
        setTitle("");
        setAuthor("");
        setImpression("");
      })
      .catch((error) => console.error('Error:', error))
      .finally(() => {
        // データを再取得する
        fetch("http://localhost:8080/Get")
          .then((res) => res.json())
          .then((json) => setData(json))
          .catch((error) => console.error('Error:', error));
      });
  };

  // 本の削除処理
  const handleDelete = (bookid) => {
    fetch(`http://localhost:8080/Delete/${bookid}`, {
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
    fetch(`http://localhost:8080/Update/${bookid}`, {
      method: 'PUT',// PUTメソッドを指定
      body: JSON.stringify({ "bookid": bookid, "title": updateTitle, "author": updateAuthor, "impression": updateImpression }), // リクエストボディに更新データをセット
      headers: {
        'Content-type': 'application/json',// リクエストヘッダーをJSON形式に指定
      },
    })
      .then((json) => {
        console.log(json);
        // 該当のbookidで本のデータを更新する
        const updateData = data.map(item => {
          if (item.bookid === bookid) {
            return { ...item, "title": updateTitle, "author": updateAuthor, "impression": updateImpression };
          } else {
            return item;
          }
        });
        setData(updateData);// 更新後のデータをセット
        setEditingId(null);// 更新後、nullを渡して編集モードを解除する
      })
      .catch((error) => console.log("Error:", error));
  }

  //本の検索処理
  function handleSearch() {
    fetch("http://localhost:8080/Search", {
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

  return (
    <>
      <h1>読書記録</h1>
      <div>
        <p>本を追加する</p>
        <input placeholder="タイトル" value={title} onChange={(event) => setTitle(event.target.value)}></input>
        <input placeholder="作者" value={author} onChange={(event) => setAuthor(event.target.value)}></input>
        <input placeholder="ひとこと感想" value={impression} onChange={(event) => setImpression(event.target.value)}></input>
        <button onClick={handleCreate}>追加</button>
      </div>
      <div>
        <input placeholder="検索フォーム" value={searchWord} onChange={(event) => setSearchWord(event.target.value)}></input>
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
                  <input placeholder="タイトルを入力して更新" value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} />
                ) : (
                  item.title // 通常時はタイトルを表示
                )}
              </td>
              <td>
                {editingId === item.bookid ? (// 編集モード時にテキストボックスを表示
                  <input placeholder="作者を入力して更新" value={updateAuthor} onChange={(event) => setUpdateAuthor(event.target.value)} />
                ) : (
                  item.author // 通常時は作者を表示
                )}
              </td>
              <td>
                {editingId === item.bookid ? (// 編集モード時にテキストボックスを表示
                  <input placeholder="ひとこと感想を入力して更新" value={updateImpression} onChange={(event) => setUpdateImpression(event.target.value)} />
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
                    setUpdateTitle(item.title);
                    setUpdateAuthor(item.author);
                    setUpdateImpression(item.impression);
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
