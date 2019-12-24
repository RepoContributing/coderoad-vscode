import { storiesOf } from '@storybook/react'
import React from 'react'
import LoadingPage from '../src/containers/LoadingPage'
import SideBarDecorator from './utils/SideBarDecorator'

storiesOf('Components', module)
  .addDecorator(SideBarDecorator)
  .add('Loading', () => <LoadingPage text="Content" context={{}} />)
