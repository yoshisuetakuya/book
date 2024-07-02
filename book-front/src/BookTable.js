import React from 'react';

const BookTable = ({ data, handleDelete, handleUpdate, handleUpdateChange, setEditingId, setUpdateData, updateData, editingId, handleTitleSort, handleAuthorSort, sortState }) => {
  return (
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
);
};

export default BookTable;
