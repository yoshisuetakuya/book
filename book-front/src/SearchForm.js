import React from 'react';

const SearchForm = ({ searchWord, handleSearchWordChange, handleSearch, setSearchWord }) => {
  return (
    <div>
      <input
        name="searchWord"
        placeholder="検索フォーム"
        value={searchWord}
        onChange={(event) => handleSearchWordChange(event, setSearchWord)}
      />
      <button onClick={handleSearch}>検索</button>
    </div>
  );
};

export default SearchForm;
