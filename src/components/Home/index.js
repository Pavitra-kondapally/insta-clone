import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Redirect, Link} from 'react-router-dom'

import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Header from '../Header'
import UserPosts from '../UserPosts'

import './index.css'

const userStoriesApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {
    userStoriesList: [],
    userStoriesApiStatus: userStoriesApiStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserStories()
  }

  getUserStories = async () => {
    this.setState({
      userStoriesApiStatus: userStoriesApiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const userApiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const storiesResponse = await fetch(userApiUrl, options)
    if (storiesResponse.ok === true) {
      const fetchedData = await storiesResponse.json()
      const updatedUserData = fetchedData.users_stories.map(eachStory => ({
        userId: eachStory.user_id,
        userName: eachStory.user_name,
        storyUrl: eachStory.story_url,
      }))
      this.setState({
        userStoriesList: updatedUserData,
        userStoriesApiStatus: userStoriesApiStatusConstants.success,
      })
    } else {
      this.setState({
        userStoriesApiStatus: userStoriesApiStatusConstants.failure,
      })
    }
  }

  renderLoadingUserStoriesView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSuccessUserStoriesView = () => {
    const {userStoriesList} = this.state
    console.log(userStoriesList)
    return (
      <div className="slider-container">
        <Slider {...settings}>
          {userStoriesList.map(each => {
            const {userId, userName, storyUrl} = each
            return (
              <div className="slick-item" key={userId}>
                <img src={storyUrl} className="story-image" alt="user story" />
                <p className="name-style">{userName}</p>
              </div>
            )
          })}
        </Slider>
      </div>
    )
  }

  onRetryingStoriesApi = () => {
    this.getUserStories()
  }

  renderFailureUserStoriesView = () => (
    <div className="failure-container">
      <img
        src="https://res.cloudinary.com/dl9ywntts/image/upload/v1699360134/failure_image_dujtym.png"
        className="failure-image"
        alt="Failure View"
      />
      <h1 className="failure-text">Something went wrong. Please try again</h1>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onRetryingStoriesApi}
      >
        Try again
      </button>
    </div>
  )

  render() {
    const {userStoriesApiStatus} = this.state
    let userStoryContent = null

    switch (userStoriesApiStatus) {
      case userStoriesApiStatusConstants.inProgress:
        userStoryContent = this.renderLoadingUserStoriesView()
        break
      case userStoriesApiStatusConstants.success:
        userStoryContent = this.renderSuccessUserStoriesView()
        break
      case userStoriesApiStatusConstants.failure:
        userStoryContent = this.renderFailureUserStoriesView()
        break

      default:
        userStoryContent = null
        break
    }

    return (
      <>
        <Header />
        <div className="user-story-container">{userStoryContent}</div>
        <UserPosts />
      </>
    )
  }
}

export default Home
