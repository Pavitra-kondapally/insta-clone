import React from 'react'

const SearchContext = React.createContext({
  searchValue: '',
  updateSearch: () => {},
  searchPosts: [],
  updatingSearchPosts: () => {},
  isSearchButtonClicked: false,
  changingSearchButtonState: () => {},
  initiateSearchPostLikeApi: () => {},
})

export default SearchContext
