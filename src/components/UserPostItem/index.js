import {Link} from 'react-router-dom'
import './index.css'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'

const UserPostItem = props => {
  const {userPostDetails, initiatePostLikeApi} = props
  const {
    postId,
    userId,
    userName,
    profilePic,
    postDetails,
    likesCount,
    comments,
    createdAt,
    message,
  } = userPostDetails
  const {imageUrl, caption} = postDetails

  const isLiked = message === 'Post has been liked'

  const postLikeApi = () => {
    initiatePostLikeApi(postId, true)
  }

  const postUnLikeApi = () => {
    initiatePostLikeApi(postId, false)
  }

  return (
    <li className="user-post-item">
      <div className="user-profile-container">
        <img
          src={profilePic}
          className="user-profile-pic"
          alt="post author profile"
        />
        <Link to={`/users/${userId}`}>
          <p className="user-name-styling">{userName}</p>
        </Link>
      </div>
      <img src={imageUrl} className="post-image" alt="post" />
      <div className="post-info-container">
        <div className="icon-container">
          {isLiked ? (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              onClick={postUnLikeApi}
              data-testid="unLikeIcon"
              type="button"
              className="icon_button"
            >
              <FcLike className="icon-styling" />
            </button>
          ) : (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              onClick={postLikeApi}
              data-testid="likeIcon"
              type="button"
              className="icon_button"
            >
              <BsHeart className="icon-styling" />
            </button>
          )}
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            data-testid="commentIcon"
            className="icon_button"
          >
            <FaRegComment className="icon-styling" />
          </button>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button type="button" data-testid="shareIcon" className="icon_button">
            <BiShareAlt className="icon-styling" />
          </button>
        </div>
        <p className="like-styling">{likesCount} likes</p>
        <p className="caption-styling">{caption}</p>
        {comments.map(each => (
          <p className="comment-username-styling" key={each.userId}>
            {each.userName}{' '}
            <span className="comment-styling">{each.comment}</span>
          </p>
        ))}
        <p className="time-difference-styling">{createdAt}</p>
      </div>
    </li>
  )
}

export default UserPostItem
