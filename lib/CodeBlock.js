import { Prism } from 'react-syntax-highlighter'
import { vs } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export default function CodeBlock({ language, value }) {
  return <Prism language={language} style={vs}>{value}</Prism>
}
