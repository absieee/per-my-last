import PetraRoadmapGame from './PetraRoadmapGame.jsx'

export default function MiniGameRouter({ type, character, onComplete }) {
  if (type === 'roadmap') {
    return <PetraRoadmapGame character={character} onComplete={onComplete} />
  }

  return null
}
