import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {useState} from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'
import {IoCloseCircle} from 'react-icons/io5'
import {FaSearch} from 'react-icons/fa'

import SearchContext from '../../context/SearchContext'

import './index.css'

const Header = props => {
  const [isOpen, setHamburgerButton] = useState(false)
  const [searchBarVisible, setShowSearchBar] = useState(false)
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <SearchContext.Consumer>
      {value => {
        const {
          searchValue,
          updateSearch,
          searchPosts,
          updatingSearchPosts,
          isSearchButtonClicked,
          changingSearchButtonState,
        } = value

        const showSearchBar = () => {
          setShowSearchBar(!searchBarVisible)
        }

        const onUpdatingSearchInput = async event => {
          updateSearch(event.target.value)
          const jwtToken = Cookies.get('jwt_token')
          const apiUrl = `https://apis.ccbp.in/insta-share/posts?search=${event.target.value}`
          const options = {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
          }
          const response = await fetch(apiUrl, options)
          const data = await response.json()
          if (response.ok === true) {
            const updatedData = data.posts.map(eachPost => ({
              postId: eachPost.post_id,
              createdAt: eachPost.created_at,
              likesCount: eachPost.likes_count,
              comments: eachPost.comments,
              userId: eachPost.user_id,
              profilePic: eachPost.profile_pic,
              userName: eachPost.user_name,
              postCaption: eachPost.post_details.caption,
              postImage: eachPost.post_details.image_url,
            }))
            updatingSearchPosts(updatedData)
          }
        }
        console.log(searchValue)

        const onUpdatingSearchPostsData = updatedPostsData => {
          console.log('search posts: ', updatedPostsData)
          updatingSearchPosts(updatedPostsData)
        }

        const getFormattedPostData = data => ({
          imageUrl: data.image_url,
          caption: data.caption,
        })

        const getFormattedCommentsData = data => ({
          userName: data.user_name,
          userId: data.user_id,
          comment: data.comment,
        })

        const getUserSearchPosts = async () => {
          const jwtToken = Cookies.get('jwt_token')
          const searchApiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchValue}`
          const options = {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
          }
          const response = await fetch(searchApiUrl, options)
          const fetchedData = await response.json()
          const updatedPostsData = fetchedData.posts.map(eachPost => ({
            postId: eachPost.post_id,
            userId: eachPost.user_id,
            userName: eachPost.user_name,
            profilePic: eachPost.profile_pic,
            postDetails: getFormattedPostData(eachPost.post_details),
            likesCount: eachPost.likes_count,
            comments: eachPost.comments.map(eachComment =>
              getFormattedCommentsData(eachComment),
            ),
            createdAt: eachPost.created_at,
          }))
          onUpdatingSearchPostsData(updatedPostsData)
          changingSearchButtonState()
        }

        return (
          <nav className="nav-header">
            <div className="large-devices">
              <div className="website-logo-container">
                <Link to="/">
                  <img
                    src="https://res.cloudinary.com/dl9ywntts/image/upload/v1699274144/Standard_Collection_8_zbcz7z.jpg"
                    alt="website logo"
                    className="header-desktop-website-image"
                  />
                </Link>
                <h1 className="header-title">Insta Share</h1>
              </div>
              <div className="header-right-container">
                <div className="search-container">
                  <input
                    className="input-box"
                    placeholder="Search Caption"
                    value={searchValue}
                    onChange={onUpdatingSearchInput}
                  />
                  <button
                    className="search-icon-button"
                    type="button"
                    onClick={getUserSearchPosts}
                    data-testid="searchIcon"
                  >
                    <img
                      src="https://res.cloudinary.com/dl9ywntts/image/upload/v1699274575/search_cxamlz.jpg"
                      alt="search-icon"
                      className="search-image"
                    />
                  </button>
                </div>
                <ul className="nav-menu">
                  <Link to="/" className="nav-link">
                    <li className="nav-list-item">Home</li>
                  </Link>
                  <Link to="/my-profile" className="nav-link">
                    <li className="nav-list-item">Profile</li>
                  </Link>
                </ul>
                <button
                  type="button"
                  className="logout-btn"
                  onClick={onClickLogout}
                >
                  Logout
                </button>
              </div>
            </div>
            <div className="mobile-devices">
              <div className="top-container">
                <div className="title-container">
                  <Link to="/">
                    <img
                      src="https://res.cloudinary.com/dl9ywntts/image/upload/v1699274144/Standard_Collection_8_zbcz7z.jpg"
                      alt="website logo"
                      className="header-mobile-website-image"
                    />
                  </Link>
                  <h1 className="header-title">Insta Share</h1>
                </div>
                <button
                  onClick={() => setHamburgerButton(!isOpen)}
                  data-testid="hamburgerIcon"
                  className="hamburgerButton"
                  type="button"
                  aria-label="Toggle Hamburger Menu"
                >
                  <GiHamburgerMenu className="hamburgerIcon" />
                </button>
              </div>
              {isOpen && (
                <div className="links_div">
                  <ul className="nav_bar">
                    <Link to="/" className="nav_item">
                      <li className="nav-list-item">Home</li>
                    </Link>
                    <Link to="/my-profile" className="nav_item">
                      <li className="nav-list-item">Profile</li>
                    </Link>
                    <li onClick={showSearchBar} className="nav-list-item">
                      Search
                    </li>
                  </ul>
                  <button
                    onClick={onClickLogout}
                    type="button"
                    className="logout_button"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setHamburgerButton(!isOpen)}
                    type="button"
                    className="close-button"
                    aria-label="Logout"
                  >
                    <IoCloseCircle className="hamburgerIcon" />
                  </button>
                </div>
              )}
              {searchBarVisible && (
                <div className="search_div">
                  <input
                    value={searchValue}
                    onChange={onUpdatingSearchInput}
                    className="searchBar"
                    type="search"
                    placeholder="Search Caption"
                  />
                  <button
                    onClick={getUserSearchPosts}
                    className="searchButton"
                    type="button"
                    data-testid="searchIcon"
                    aria-label="Search"
                  >
                    <FaSearch className="searchIcon" />
                  </button>
                </div>
              )}
            </div>
          </nav>
        )
      }}
    </SearchContext.Consumer>
  )
}

export default withRouter(Header)
