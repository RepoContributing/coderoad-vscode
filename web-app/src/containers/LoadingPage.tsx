import * as React from 'react'
import Loading from '../components/Loading'

interface Props {
  text: string
}

const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: window.innerWidth - 20,
    height: window.innerHeight - 20,
  },
}

const LoadingPage = ({ text }: Props) => (
  <div style={styles.page}>
    <Loading text={text} />
  </div>
)

export default LoadingPage