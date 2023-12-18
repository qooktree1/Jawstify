import Image from 'next/image'
import styled from 'styled-components'
import { onTablet, onMobile } from '@/styles/mediaQuery'
import plusImage from '@/public/assets/icons/plusImage.svg'

function ColumnPlusButton() {
  return (
    <>
      <StyledButton>
        새로운 칼럼 추가하기
        <PlusImage src={plusImage} alt="plus이미지" />
      </StyledButton>
    </>
  )
}

export default ColumnPlusButton

const StyledButton = styled.button`
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 354px;
  height: 70px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #333236;
  font-size: 18px;
  font-weight: 700;

  ${onTablet} {
    width: 544px;
    height: 70px;
  }
  ${onMobile} {
    font-size: 16px;
    width: 284px;
    height: 60px;
  }
`
const PlusImage = styled(Image)`
  width: 16px;
  height: 16px;

  ${onMobile} {
    width: 14.5px;
    height: 14.5px;
  }
`
