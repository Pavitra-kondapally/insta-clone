import {Component} from 'react'
import './App.css'
import {Switch, Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import LoginPage from './components/LoginPage'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import MyProfile from './components/MyProfile'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

import SearchContext from './context/SearchContext'

class App extends Component {
  state = {
    searchValue: '',
    searchPosts: [],
    isSearchButtonClicked: false,
  }

  updateSearch = searchValue => {
    this.setState({searchValue})
  }

  updatingSearchPosts = updatedData => {
    console.log('updated search post in app component: ', updatedData)
    this.setState({searchPosts: updatedData})
  }

  changingSearchButtonState = () => {
    this.setState(prevState => ({
      isSearchButtonClicked: !prevState.isSearchButtonClicked,
    }))
  }

  initiateSearchPostLikeApi = async (postId, likeStatus) => {
    const {searchPosts} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const likeDetails = {
      like_status: likeStatus,
    }
    const apiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'POST',
      body: JSON.stringify(likeDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    let userPostsData = searchPosts
    userPostsData = userPostsData.map(eachObject => {
      if (eachObject.postId === postId && likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount + 1,
        }
      }
      if (eachObject.postId === postId && !likeStatus) {
        return {
          ...eachObject,
          message: data.message,
          likesCount: eachObject.likesCount - 1,
        }
      }

      return eachObject
    })
    this.setState({searchPosts: userPostsData})
  }

  render() {
    const {searchValue, searchPosts, isSearchButtonClicked} = this.state
    return (
      <SearchContext.Provider
        value={{
          searchValue,
          updateSearch: this.updateSearch,
          searchPosts,
          updatingSearchPosts: this.updatingSearchPosts,
          isSearchButtonClicked,
          changingSearchButtonState: this.changingSearchButtonState,
          initiateSearchPostLikeApi: this.initiateSearchPostLikeApi,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/users/:id" component={UserProfile} />
          <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
