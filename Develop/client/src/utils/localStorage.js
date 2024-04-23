// Function to retrieve saved book IDs from local storage
export const getSavedBookIds = () => {
  // Retrieve saved book IDs from local storage or initialize an empty array
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : [];

  return savedBookIds;
};

// Function to save book IDs to local storage
export const saveBookIds = (bookIdArr) => {
  // If book ID array is not empty, save it to local storage as JSON
  // Otherwise, remove the saved_books item from local storage
  if (bookIdArr.length) {
    localStorage.setItem('saved_books', JSON.stringify(bookIdArr));
  } else {
    localStorage.removeItem('saved_books');
  }
};

// Function to remove a specific book ID from local storage
export const removeBookId = (bookId) => {
  // Retrieve saved book IDs from local storage or return false if not available
  const savedBookIds = localStorage.getItem('saved_books')
    ? JSON.parse(localStorage.getItem('saved_books'))
    : null;

  // If saved book IDs are not available, return false
  if (!savedBookIds) {
    return false;
  }

  // Filter out the specified book ID from saved book IDs
  const updatedSavedBookIds = savedBookIds?.filter((savedBookId) => savedBookId !== bookId);
  // Update saved book IDs in local storage
  localStorage.setItem('saved_books', JSON.stringify(updatedSavedBookIds));

  return true;
};
