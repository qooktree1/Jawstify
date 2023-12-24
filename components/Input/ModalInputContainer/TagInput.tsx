import styled from 'styled-components';
import { ChangeEvent, useState, MouseEvent, KeyboardEvent, useEffect } from 'react';
import { fontStyle } from '@/styles/fontStyle';
import { COLORS } from '@/styles/palettes';
import { NO_VALUE_ERROR } from '@/constants/Input';
import { TAG_COLOR } from '@/constants/Input';
import { StyledErrorText, StyledLabel } from '../Input.style';
import ContentChip from '@/components/Chip/ContentChip';

export interface TagProps {
  inputValue?: string;
  placeholder?: string;
  errorMessage?: string;
  label?: string;
  onChange: (inputLabel: string, value: Tag[]) => void;
  onButtonClick?: (e: MouseEvent<HTMLElement>) => void;
}

interface Tag {
  value: string;
  color: string;
  backgroundColor: string;
}
/**
 * Modal Tag Input
 * @param errorMessage 부모 컴포넌트에서 제어하는 input에 띄우고자 하는 에러 메세지, exist하면 error design 표시
 * @param label input 라벨 텍스트
 * @param onChange 부모 컴포넌트에서 제어하는 input onChange 함수
 * */
function TagInput({ errorMessage = '', label = '태그', onChange }: TagProps) {
  const [isNoValue, setIsNoValue] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [value, setValue] = useState<string>('');

  const hasError = errorMessage !== '';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleDeleteClick = (selectedValue: string) => {
    setTags((prev) => prev.filter((prevTags) => prevTags.value !== selectedValue));
  };

  const handleOnEnterKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || value === '') return;

    const ranVal = Math.floor(Math.random() * 4);
    const TagColors = TAG_COLOR[ranVal];
    const newTagEl = { value: value, backgroundColor: TagColors[0], color: TagColors[1] };

    setTags((prev) => {
      if (prev.find((prevTags) => prevTags.value === newTagEl.value)) return prev;
      return [...prev, newTagEl];
    });

    setValue('');
    checkEmptyValError(newTagEl.value);
  };

  const handleBlur = () => {
    checkEmptyValError();
  };

  const checkEmptyValError = (isNewTagExist: string = '') => {
    !isNewTagExist && tags.length === 0 ? setIsNoValue(true) : setIsNoValue(false);
  };

  useEffect(() => {
    onChange(label, tags);
  }, [tags]);

  return (
    <div>
      <StyledLabel>{label}</StyledLabel>
      <StyledInputContainer $error={isNoValue || hasError} onBlur={handleBlur}>
        {tags &&
          tags.map((value, index) => (
            <ContentChip text={value.value} key={index} backgroundColor={value.backgroundColor} color={value.color}>
              <StyledDeleteBtn
                onClick={(e: MouseEvent<HTMLElement>) => handleDeleteClick(value.value)}
                $color={value.color}
              >
                x
              </StyledDeleteBtn>
            </ContentChip>
          ))}
        {tags.length !== 0 ? (
          <StyledInput value={value} onChange={handleInputChange} onKeyUp={handleOnEnterKeyUp} />
        ) : (
          <StyledInput
            value={value}
            onChange={handleInputChange}
            onKeyUp={handleOnEnterKeyUp}
            placeholder="입력 후 Enter"
          />
        )}
      </StyledInputContainer>
      {(isNoValue || hasError) && <StyledErrorText>{errorMessage || NO_VALUE_ERROR}</StyledErrorText>}
    </div>
  );
}

export default TagInput;

const StyledInput = styled.input`
  width: auto;
  background-color: ${COLORS.WHITE_FF};
  color: ${COLORS.BLACK_33};
  ${fontStyle(16, 400)}
  border: none;
  background: transparent;
  padding: 13px 10px 15px;
`;

const StyledInputContainer = styled.div<{ $error: boolean }>`
  width: 100%;
  padding-left: 5px;
  border-radius: 8px;
  border: 1px solid ${({ $error }) => ($error ? COLORS.RED_D6 : COLORS.GRAY_D9)};
  color: ${COLORS.BLACK_33};
  ${fontStyle(16, 400)};
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }

  &:hover,
  &:focus,
  &:active {
    border: 1px solid ${({ $error }) => ($error ? COLORS.RED_D6 : COLORS.VIOLET_55)};
    color: ${COLORS.BLACK_33};
    outline: none;
  }
`;

const StyledDeleteBtn = styled.button<{ $color: string }>`
  font-size: 12px;
  font-weight: 700;
  padding: 0 2px 3px 4px;
  color: ${({ $color }) => $color};
`;
