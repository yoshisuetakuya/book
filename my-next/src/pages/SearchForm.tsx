import React from 'react';
import type { SearchFormProps } from '../pages/@types/index';

const SearchForm = ({
  searchWord,
  handleSearchWordChange,
  handleSearch,
  setSearchWord
}: SearchFormProps) => {
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
