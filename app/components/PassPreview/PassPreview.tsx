import { styled, keyframes } from '@/stitches'
import { BallSticker } from '@/components'
import { TicketReveal } from '../TicketReveal'

type Props = {
  loading?: boolean
  show?: boolean
}

const bounce = keyframes({
  '0%': { transform: 'translateY(100%) ' },
  '40%': { transform: 'translateY(40%)' },
  '100%': { transform: 'translateY(100%)' },
})

const Root = styled('div', {
  marginTop: '$6',
  marginBottom: '$5',
  position: 'relative',
  zIndex: 1,
  marginX: 'auto',
  width: '100%',
  maxWidth: 470,
  height: 240,
  overflow: 'hidden',
  '@bp1': {
    maxWidth: 300,
    height: 160
  },
  '@bp2': {
    maxWidth: 470,
    height: 240
  }
})

const BallArea = styled('div', {
  width: 115,
  height: 115,
  position: 'absolute',
  left: '50%',
  top: 38,
  transform: 'translateX(-50%)',
  zIndex: 999,
})

const Loading = styled('div', {
  width: 95,
  height: 99,
  animation: `${bounce} 1s infinite`,
})

const Placeholder = styled('div', {
  position: 'absolute',
  marginX: 'auto',
  width: '100%',
  overflow: 'hidden',
  opacity: .2
})

export function PassPreviewModal({ loading = true }: Props) {
  return (
    <Root>
      {loading && (
        <BallArea>
          <Loading>
            <BallSticker />
          </Loading>
        </BallArea>
      )}
      <Placeholder>
        <TicketReveal />
      </Placeholder>
    </Root>
  )
}
