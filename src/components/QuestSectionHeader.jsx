import sparkle from '../assets/icons/OneSparkle.png'

function QuestSectionHeader({ onManage, onCreate }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">YOUR ADVENTURES</p>
        <h2 id="quests-heading">Quest board <img src={sparkle} className="eyebrow-sparkle" alt="" /></h2>
      </div>
      <div className="section-actions">
        <button
          className="button button--quiet"
          type="button"
          onClick={onManage}
        >
          Manage
        </button>
        <button className="button button--primary" type="button" onClick={onCreate}>
          <span aria-hidden="true">+</span> New quest
        </button>
      </div>
    </div>
  )
}

export default QuestSectionHeader
