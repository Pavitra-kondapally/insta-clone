import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const myProfileApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MyProfile extends Component {
  state = {
    myProfileApiStatus: myProfileApiStatusConstants.initial,
    myProfileData: [],
  }

  componentDidMount() {
    this.getMyProfileData()
  }

  getMyProfileData = async () => {
    this.setState({
      myProfileApiStatus: myProfileApiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        id: data.profile.id,
        userId: data.profile.user_id,
        userName: data.profile.user_name,
        profilePic: data.profile.profile_pic,
        followersCount: data.profile.followers_count,
        followingCount: data.profile.following_count,
        userBio: data.profile.user_bio,
        posts: data.profile.posts,
        postsCount: data.profile.posts_count,
        stories: data.profile.stories,
      }
      this.setState({
        myProfileApiStatus: myProfileApiStatusConstants.success,
        myProfileData: updatedData,
      })
    } else {
      this.setState({
        myProfileApiStatus: myProfileApiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="user-story-loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderSuccessView = () => {
    const {myProfileData} = this.state
    return (
      <div className="my-profile-page-container">
        <div className="my-profile-info-container">
          <img
            src={myProfileData.profilePic}
            className="profile-pic"
            alt="my profile"
          />
          <div className="my-profile-text">
            <h1 className="user-name">{myProfileData.userName}</h1>
            <div className="followers-container">
              <p className="follow-text">
                <span className="follow-count">{myProfileData.postsCount}</span>
                posts
              </p>
              <p className="follow-text">
                <span className="follow-count">
                  {myProfileData.followersCount}
                </span>
                followers
              </p>
              <p className="follow-text">
                <span className="follow-count">
                  {myProfileData.followingCount}
                </span>
                following
              </p>
            </div>
            <p className="user-id">{myProfileData.userId}</p>
            <p className="user-bio">{myProfileData.userBio}</p>
          </div>
        </div>
        <ul className="stories-list">
          {myProfileData.stories.map(eachStory => {
            const {id, image} = eachStory
            return (
              <li className="each-story-item" key={id}>
                <img
                  src={image}
                  alt="user story"
                  className="user-story-image"
                />
              </li>
            )
          })}
        </ul>
        <div className="posts-heading-container">
          <BsGrid3X3 className="grid-icon" />
          <h1 className="posts-heading">Posts</h1>
        </div>
        {myProfileData.posts.length > 0 ? (
          <ul className="my-profile-posts-container">
            {myProfileData.posts.map(eachPost => {
              const {id, image} = eachPost
              return (
                <li className="each-post-item" key={id}>
                  <img
                    src={image}
                    className="each-post-image"
                    alt="user post"
                  />
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="no-posts-container">
            <BiCamera className="camera-icon" />
            <h1 className="no-posts-heading">No Posts Yet</h1>
          </div>
        )}
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure_view_container">
      <img
        className="user_profile_failure_img"
        src="https://res.cloudinary.com/dl9ywntts/image/upload/v1700376206/alert-triangle_hqda7o.jpg"
        alt="failure view"
      />
      <p className="failure_heading">Something went wrong. Please try again</p>
      <button
        onClick={() => this.getMyProfileData()}
        type="submit"
        className="failure-button"
      >
        Try again
      </button>
    </div>
  )

  render() {
    const {myProfileApiStatus} = this.state
    let myProfileContent = null
    switch (myProfileApiStatus) {
      case myProfileApiStatusConstants.inProgress:
        myProfileContent = this.renderLoadingView()
        break
      case myProfileApiStatusConstants.success:
        myProfileContent = this.renderSuccessView()
        break
      case myProfileApiStatusConstants.failure:
        myProfileContent = this.renderFailureView()
        break

      default:
        myProfileContent = null
        break
    }
    return (
      <div>
        <Header />
        {myProfileContent}
      </div>
    )
  }
}

export default MyProfile
