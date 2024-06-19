import React, { useState, useEffect } from "react";

function App() {
  //useStateでデータの保持
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [impression, setImpression] = useState("");

  //画面に表示させる
  useEffect(() => {
    fetch("http://localhost:8080/Get")  //fetchメソッドでhttp://localhost:8080/Getにデータを取得しに行く
      .then((res) => res.json())        //ここでjson形式のデータを取得
      .then((json) => setData(json))    //取得したデータをsetDataにセット
      .catch((error) => console.log("Error:", error));     //エラーが起きた場合の処理
  }, []);                               //useEffectで第二引数に[]を渡し初回レンダリング時に実行させる

  // // 本の追加処理
  // function handleCreate() {
  //   fetch("http://localhost:8080/Create", {
  //     method: 'POST',
  //     body: JSON.stringify({ "title": title, "author": author, "impression": impression }),
  //     headers: {
  //       'Content-type': 'application/json',
  //     },
  //   })
  //   .then((res) => res.json())
  //     .then((json) => {
  //       console.log(json);
  //       // データを更新する
  //       // 元の配列をスプレッド構文で複製した上でそれに追加している
  //       setData([...data, { "title": title, "author": author, "impression": impression }]);
  //       setTitle("");
  //       setAuthor("");
  //       setImpression("");
  //     })
  //     .catch((error) => console.log("Error:", error));
  // };

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
      // データを更新する
      setData([...data, json]); // 新しいデータを追加
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
    .then((resText) => {
      console.log(resText);
      // データを更新する
      // フィルターにかけて表示から消す
      setData(data.filter(item => item.bookid !== bookid));
    })
      .catch((error) => console.log("Error:", error));
  };
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
      {/* ここから画面に出力している */}
      <table border={1}>
        <thead>
          <tr>
            <th>タイトル</th>
            <th>作者</th>
            <th>ひとこと感想</th>
            <th>削除ボタン</th>
            <th>編集/更新ボタン</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.bookid}>
             <td>{item.bookid}</td>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>{item.impression}</td>
              <td><button onClick={() => handleDelete(item.bookid)}>削除</button></td>
              <td><button></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
