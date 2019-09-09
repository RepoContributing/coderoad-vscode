import * as React from 'react'
import { Button, Card } from '@alifd/next'
import * as CR from 'typings'
import * as T from 'typings/graphql'

interface Props {
  tutorial: T.Tutorial
  onContinue(): void
}

export const ContinuePage = (props: Props) => (
  <div>
    <h3>Continue</h3>
    <Card showTitleBullet={false} contentHeight="auto">
      <div>
        <h2>{props.tutorial.title}</h2>
        <p>{props.tutorial.text}</p>
        <Button onClick={props.onContinue}>Resume</Button>
      </div>
    </Card>
  </div>
)

interface ContainerProps {
  context: CR.MachineContext
  send(action: CR.Action | string): void
}

const ContinuePageContainer = ({ context, send }: ContainerProps) => {
  const { tutorial } = context

  if (!tutorial) {
    throw new Error('Tutorial not found')
  }

  return <ContinuePage tutorial={tutorial} onContinue={() => send('TUTORIAL_START')} />
}

export default ContinuePageContainer
