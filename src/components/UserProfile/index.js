import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class UserProfile extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    userProfile: [],
  }

  componentDidMount() {
    this.getUserData()
  }

  getUserData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/insta-share/users/${id}`

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
        id: data.user_details.id,
        userId: data.user_details.user_id,
        userName: data.user_details.user_name,
        profilePic: data.user_details.profile_pic,
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        userBio: data.user_details.user_bio,
        postsCount: data.user_details.posts_count,
        posts: data.user_details.posts,
        stories: data.user_details.stories,
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        userProfile: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="user-story-loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure_view_container">
      <img
        className="user_profile_failure_img"
        src="https://res.cloudinary.com/dl9ywntts/image/upload/v1700376206/alert-triangle_hqda7o.jpg"
        alt="failure view"
      />
      <p className="failure_heading">Something went wrong. Please try again</p>
      <button
        onClick={() => this.getUserData()}
        type="submit"
        className="failure-button"
      >
        Try again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {userProfile} = this.state
    return (
      <div className="user-profile-page-container">
        <div className="user-profile-info-container">
          <img
            src={userProfile.profilePic}
            className="profile-pic"
            alt="user profile"
          />
          <div className="user-profile-text">
            <h1 className="user-name">{userProfile.userName}</h1>
            <div className="followers-container">
              <p className="follow-text">
                <span className="follow-count">
                  {userProfile.postsCount}
                  <br />
                </span>
                posts
              </p>
              <p className="follow-text">
                <span className="follow-count">
                  {userProfile.followersCount}
                  <br />
                </span>
                followers
              </p>
              <p className="follow-text">
                <span className="follow-count">
                  {userProfile.followingCount}
                  <br />
                </span>
                following
              </p>
            </div>
            <p className="user-id">{userProfile.userId}</p>
            <p className="user-bio">{userProfile.userBio}</p>
          </div>
        </div>
        <ul className="stories-list">
          {userProfile.stories.map(eachStory => {
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
        {userProfile.posts.length > 0 ? (
          <ul className="user-profile-posts-container">
            {userProfile.posts.map(eachPost => {
              const {id, image} = eachPost
              return (
                <li className="each-user-post-item" key={id}>
                  <img
                    src={image}
                    className="each-user-post-image"
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

  render() {
    const {apiStatus} = this.state
    let userProfileContent = null
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        userProfileContent = this.renderLoadingView()
        break
      case apiStatusConstants.success:
        userProfileContent = this.renderSuccessView()
        break
      case apiStatusConstants.failure:
        userProfileContent = this.renderFailureView()
        break

      default:
        break
    }

    return (
      <div>
        <Header />
        {userProfileContent}
      </div>
    )
  }
}

export default UserProfile
