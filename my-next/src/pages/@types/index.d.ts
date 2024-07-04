export interface Book {
  bookid: number;
  title: string;
  author: string;
  impression: string;
}

export interface BookFormData {
  title: string;
  author: string;
  impression: string;
}

export interface UpdateFormData {
  updateTitle: string;
  updateAuthor: string;
  updateImpression: string;
}

export interface SearchFormProps {
  searchWord: string;
  handleSearchWordChange: (event: React.ChangeEvent<HTMLInputElement>, setSearchWord: React.Dispatch<React.SetStateAction<string>>) => void;
  handleSearch: () => void;
  setSearchWord: React.Dispatch<React.SetStateAction<string>>;
}

export interface BookFormProps {
  bookData: BookFormData;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, setBookData: React.Dispatch<React.SetStateAction<BookFormData>>, bookData: BookFormData) => void;
  handleCreate: () => void;
  setBookData: React.Dispatch<React.SetStateAction<BookFormData>>;
}

export interface BookTableProps {
  data: Book[];
  handleDelete: (bookid: number) => void;
  handleUpdate: (bookid: number) => void;
  handleUpdateChange: (event: React.ChangeEvent<HTMLInputElement>, setUpdateData: React.Dispatch<React.SetStateAction<UpdateFormData>>, updateData: UpdateFormData) => void;
  setEditingId: React.Dispatch<React.SetStateAction<number | null>>;
  setUpdateData: React.Dispatch<React.SetStateAction<UpdateFormData>>;
  updateData: UpdateFormData;
  editingId: number | null;
  handleTitleSort: () => void;
  handleAuthorSort: () => void;
  sortState: string;
}
