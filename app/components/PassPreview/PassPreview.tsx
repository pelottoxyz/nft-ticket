import { styled, keyframes } from '@/stitches'
import { BallSticker } from '@/components'

type Props = {
  loading?: boolean
  show?: boolean
}

const size = 508

const bounce = keyframes({
  '0%': { transform: 'translateY(100%) ' },
  '40%': { transform: 'translateY(40%)' },
  '100%': { transform: 'translateY(100%)' },
})

const Root = styled('div', {
  position: 'relative',
  zIndex: 1,
  marginX: 'auto',
  width: size,
  height: 250,
  overflow: 'hidden',
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
  top: -140,
  marginX: 'auto',
  width: '100%',
  height: size,
  overflow: 'hidden',
  backgroundColor: '$black',
  //backgroundImage: `url(https://bafybeiakge6md7nbit3v6k47mttqjb6lhd2vf62atnwlhucvfev76kzqi4.ipfs.nftstorage.link/1.png)`,
  backgroundSize: size,
  backgroundRepeat: 'no-repeat',
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
      <Placeholder />
    </Root>
  )
}
