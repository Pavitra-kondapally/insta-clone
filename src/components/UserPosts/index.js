import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Redirect, Link} from 'react-router-dom'

import UserPostItem from '../UserPostItem'
import SearchPostItem from '../SearchPostItem'

import SearchContext from '../../context/SearchContext'

import './index.css'

const postsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserPosts extends Component {
  state = {
    postsApiStatus: postsApiStatusConstants.initial,
    postsList: [],
    searchPosts: this.props,
  }

  static getDerivedStateFromProps(props, state) {
    if (props.searchPosts !== state.searchPosts) {
      return {
        searchPosts: props.searchPosts,
      }
    }
    return null
  }

  componentDidMount() {
    this.getPosts()
  }

  getFormattedPostData = data => ({
    imageUrl: data.image_url,
    caption: data.caption,
  })

  getFormattedCommentsData = data => ({
    userName: data.user_name,
    userId: data.user_id,
    comment: data.comment,
  })

  getPosts = async () => {
    this.setState({
      postsApiStatus: postsApiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const postApiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const postsResponse = await fetch(postApiUrl, options)
    if (postsResponse.ok === true) {
      const fetchedData = await postsResponse.json()
      console.log(fetchedData)
      const updatedPostsData = fetchedData.posts.map(eachPost => ({
        postId: eachPost.post_id,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
        profilePic: eachPost.profile_pic,
        postDetails: this.getFormattedPostData(eachPost.post_details),
        likesCount: eachPost.likes_count,
        comments: eachPost.comments.map(eachComment =>
          this.getFormattedCommentsData(eachComment),
        ),
        createdAt: eachPost.created_at,
      }))
      this.setState({
        postsList: updatedPostsData,
        postsApiStatus: postsApiStatusConstants.success,
      })
    } else {
      this.setState({
        postsApiStatus: postsApiStatusConstants.failure,
      })
    }
  }

  renderLoadingPostsView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  initiatePostLikeApi = async (postId, likeStatus) => {
    const {postsList} = this.state
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
    let userPostsData = postsList
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

    this.setState({postsList: userPostsData})
  }

  renderNoSearchPosts = () => (
    <div className="no-search-posts-container">
      <img
        src="https://res.cloudinary.com/dl9ywntts/image/upload/v1700973512/no_search_hhkrbh.jpg"
        alt="no search"
        className="no-search-image"
      />
      <h1 className="no-search-heading">Search Not Found</h1>
      <p className="no-search-text">Try different keyword or search again</p>
    </div>
  )

  renderSearchResults = searchPosts => (
    <ul className="search-result-list">
      {searchPosts &&
        searchPosts.map(eachSearchPost => (
          <SearchPostItem
            searchUserPostDetails={eachSearchPost}
            key={eachSearchPost.postId}
            initiateSearchPostLikeApi={this.initiateSearchPostLikeApi}
          />
        ))}
    </ul>
  )

  renderPostsResults = postsList => (
    <ul className="posts-list">
      {postsList.map(eachPost => (
        <UserPostItem
          userPostDetails={eachPost}
          key={eachPost.postId}
          initiatePostLikeApi={this.initiatePostLikeApi}
        />
      ))}
    </ul>
  )

  renderSuccessPostsView = () => (
    <SearchContext.Consumer>
      {value => {
        const {postsList} = this.state
        const {searchPosts, isSearchButtonClicked} = value
        console.log('search posts in the component: ', searchPosts)
        console.log('context value in userPosts: ', value)
        if (isSearchButtonClicked) {
          if (searchPosts.length === 0) {
            return this.renderNoSearchPosts()
          }
          return this.renderSearchResults(searchPosts)
        }

        return this.renderPostsResults(postsList)
      }}
    </SearchContext.Consumer>
  )

  render() {
    const {postsApiStatus} = this.state
    let postsContent = null
    switch (postsApiStatus) {
      case postsApiStatusConstants.inProgress:
        postsContent = this.renderLoadingPostsView()
        break
      case postsApiStatusConstants.success:
        postsContent = this.renderSuccessPostsView()
        break
      case postsApiStatusConstants.failure:
        postsContent = this.renderFailurePostsView()
        break

      default:
        postsContent = null
        break
    }
    return <div className="user-posts-container">{postsContent}</div>
  }
}

export default UserPosts
