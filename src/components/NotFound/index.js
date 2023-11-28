import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dl9ywntts/image/upload/v1701175063/erroring_1_kbvefm.png"
      className="not-found-image"
      alt="not found"
    />
    <h1 className="not-found-title">Page Not Found</h1>
    <p className="not-found-text">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage.
    </p>
    <button className="home-page-button">Home Page</button>
  </div>
)

export default NotFound
