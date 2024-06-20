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

  //初回レンダリングで全件を表示する
  useEffect(() => {
    fetch("http://localhost:8080/Get")  //fetchメソッドでhttp://localhost:8080/Getにデータを取得しに行く
      .then((res) => res.json())        //ここでjson形式のデータを取得
      .then((json) => setData(json))    //取得したデータをsetDataにセット
      .catch((error) => console.log("Error:", error));     //エラーが起きた場合の処理
  }, []);                               //useEffectで第二引数に[]を渡し初回レンダリング時に実行させる

  // 本の追加処理
  function handleCreate() {
    fetch("http://localhost:8080/Create", {
      method: 'POST',
      body: JSON.stringify({ "title": title, "author": author, "impression": impression }),
      headers: {
        'Content-type': 'application/json',
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
      method: 'DELETE',
    })
      .then((json) => {
        console.log(json);
        // 削除している
        setData(data.filter(item => item.bookid !== bookid));
      })
      .catch((error) => console.log("Error:", error));
  };

  // 本の更新処理
  const handleUpdate = (bookid) => {
    fetch(`http://localhost:8080/Update/${bookid}`, {
      method: 'PUT',
      body: JSON.stringify({ "bookid": bookid, "title": updateTitle, "author": updateAuthor, "impression": updateImpression }),
      headers: {
        'Content-type': 'application/json',
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
        setData(updateData);
        setEditingId(null);//新しく更新した後にsetEditingIdにnullをセットしておくことで編集のボタンに変わる
      })
      .catch((error) => console.log("Error:", error));
  }

  //本の検索処理
  function handleSearch() {
    fetch("http://localhost:8080/Search", {
      method: 'POST',
      body: JSON.stringify({ "keyword": searchWord }),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setData(json)
        setSearchWord(""); // 入力フォームを空にする
        setSortState("") // ソートしたまま検索をかけたときに元の並び順(bookid)に戻す
      })
      .catch((error) => console.error('Error:', error));
  };

  // タイトルでソートする機能
  function handleTitleSort() {
    if (sortState !== "ascTitle") {
      // 現在のソート状態が「タイトルの昇順」ではない場合
      // データをタイトルの昇順にソートします
      const sortedData = [...data].sort((a, b) => (a.title < b.title ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新します
      setSortState("ascTitle"); // ソート状態を「タイトルの昇順」に設定します
    } else {
      // 現在のソート状態が「タイトルの昇順」である場合
      // データをタイトルの降順にソートします
      const sortedData = [...data].sort((a, b) => (a.title > b.title ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新します
      setSortState("descTitle"); // ソート状態を「タイトルの降順」に設定します
    }
  }
  // 作者でソートする機能
  function handleAuthorSort() {
    if (sortState !== "ascAuthor") {
      // 現在のソート状態が「作者の昇順」ではない場合
      // データを作者の昇順にソートします
      const sortedData = [...data].sort((a, b) => (a.author < b.author ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新します
      setSortState("ascAuthor"); // ソート状態を「作者の昇順」に設定します
    } else {
      // 現在のソート状態が「作者の昇順」である場合
      // データを作者の降順にソートします
      const sortedData = [...data].sort((a, b) => (a.author > b.author ? -1 : 1));
      setData(sortedData); // ソートされたデータを更新します
      setSortState("descAuthor"); // ソート状態を「作者の降順」に設定します
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
                  return <button onClick={handleTitleSort}>タイトル ↑</button>;
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
                {editingId === item.bookid ? (//編集のボタンをクリックでテキストボックスを表示
                  <input placeholder="タイトルを入力して更新" value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} />
                ) : (
                  item.title //nullの時(初期値の時)はタイトルを表示
                )}
              </td>
              <td>
                {editingId === item.bookid ? (//編集のボタンをクリックででテキストボックスを表示
                  <input placeholder="作者を入力して更新" value={updateAuthor} onChange={(event) => setUpdateAuthor(event.target.value)} />
                ) : (
                  item.author //nullの時(初期値の時)は作者を表示
                )}
              </td>
              <td>
                {editingId === item.bookid ? (//編集のボタンをクリックでテキストボックスを表示
                  <input placeholder="ひとこと感想を入力して更新" value={updateImpression} onChange={(event) => setUpdateImpression(event.target.value)} />
                ) : (
                  item.impression //nullの時(初期値の時)はひとこと感想を表示
                )}
              </td>
              <td><button onClick={() => handleDelete(item.bookid)}>削除</button></td>
              <td>
                {editingId === item.bookid ? (//該当行の「編集ボタン」クリックで「更新ボタン」に表示を変えてクリックで更新できるようにする
                  <button onClick={() => handleUpdate(item.bookid)}>更新</button>
                ) : (
                  <button onClick={() => {//setEditingIdがnullの時(初期値)「編集ボタン」を表示しクリックで該当行のにbookidをsetEditingIdセットして初期値に本の情報をセットする
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
