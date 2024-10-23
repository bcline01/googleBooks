export const getSavedBookIds = () => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books')!)
    : [];

  return savedBookIds;
};

export const saveBookIds = (bookIdArr: string[]) => {
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

export const removeBookId = (bookId: string) => {
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books')!)
    : [];

  // Log the current savedBookIds
  console.log('Current saved book IDs:', savedBookIds);

  // Filter out the bookId
  const updatedSavedBookIds = savedBookIds.filter((savedBookId: string) => savedBookId !== bookId);

  // If the array is unchanged, log a message
  if (savedBookIds.length === updatedSavedBookIds.length) {
    console.log(`Book ID ${bookId} not found in saved books.`);
    return false; // No changes made
  }

  // Update local storage
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));
  console.log('Updated saved book IDs:', updatedSavedBookIds);
  
  return true;
};


