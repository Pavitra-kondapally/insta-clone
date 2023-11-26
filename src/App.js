import {Component} from 'react'
import './App.css'
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom'

import LoginPage from './components/LoginPage'
import Home from './components/Home'
import UserProfile from './components/UserProfile'
import MyProfile from './components/MyProfile'
import ProtectedRoute from './components/ProtectedRoute'

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

  updatingSearchPosts = searchPosts => {
    console.log('updated search post in app component: ', searchPosts)
    this.setState(searchPosts)
  }

  changingSearchButtonState = () => {
    this.setState(prevState => ({
      isSearchButtonClicked: !prevState.isSearchButtonClicked,
    }))
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
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/users/:id" component={UserProfile} />
            <ProtectedRoute exact path="/my-profile" component={MyProfile} />
          </Switch>
        </BrowserRouter>
      </SearchContext.Provider>
    )
  }
}

export default App
