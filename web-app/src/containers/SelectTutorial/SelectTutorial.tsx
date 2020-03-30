import * as React from 'react'
import * as T from 'typings'
import * as TT from 'typings/tutorial'
import { css, jsx } from '@emotion/core'
import TutorialItem from './TutorialItem'

const styles = {
  page: {
    position: 'relative' as 'relative',
    width: '100%',
  },
  banner: {
    minHeight: '3rem',
    fontSize: '1rem',
    padding: '1rem',
  },
}

interface Props {
  send(action: T.Action): void
  tutorialList: TT.Tutorial[]
}

const SelectTutorial = (props: Props) => {
  const onSelect = (tutorial: TT.Tutorial) => {
    props.send({
      type: 'SELECT_TUTORIAL',
      payload: {
        tutorial,
      },
    })
  }
  return (
    <div css={styles.page}>
      <div css={styles.banner}>
        <span>Select a tutorial to launch in this workspace:</span>
      </div>
      <div>
        {props.tutorialList.map((tutorial: TT.Tutorial) => (
          <TutorialItem
            key={tutorial.id}
            onSelect={() => onSelect(tutorial)}
            title={tutorial.summary.title || ''}
            description={tutorial.summary.description || ''}
          />
        ))}
      </div>
    </div>
  )
}

export default SelectTutorial
