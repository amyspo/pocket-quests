import threeSparkles from '../assets/icons/ThreeSparkles.png'

function WelcomeSection() {
  return (
    <section className="welcome" aria-labelledby="welcome-heading">
      <div className="welcome-copy">
        <p className="eyebrow">YOUR PERSONAL QUEST JOURNAL</p>
        <h1 id="welcome-heading">Hello, traveler!</h1>
        <p className="welcome-description">
          Make a little room for the things that make you feel like you.
        </p>
      </div>
      <img src={threeSparkles} className="welcome-sparkles" alt="" />
    </section>
  )
}

export default WelcomeSection
