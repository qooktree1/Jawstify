import { styled } from 'styled-components';
import sunIcon from '@/public/assets/icons/sun.svg';
import moonIcon from '@/public/assets/icons/moon.svg';
import useTheme from '@/hooks/useTheme';
import Image from 'next/image';

function DarkModeToggleButton() {

  const { themeMode, toggleThemeMode } = useTheme();


  return (
    <StyledThemeDiv onClick={() => toggleThemeMode()}>
      {themeMode === 'dark' ? (
          <button>
            <StyledThemeModeIcon src={sunIcon} width={20} height={20} alt="라이트 모드로 변경" />
          </button>
      ) : (
        <button>
          <StyledThemeModeIcon src={moonIcon} width={20} height={20} alt="다크 모드로 변경" />
        </button>
      )}
    </StyledThemeDiv>
  );
}
export default DarkModeToggleButton;

const StyledThemeDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledThemeModeIcon = styled(Image)`
  margin-top: 5px;
  margin-right: 10px;
  cursor: pointer;
`;

// const StyledThemebutton = styled(button)
