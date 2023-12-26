import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import api from '@/apis/api';
import { COLORS } from '@/styles/palettes';
import { fontStyle } from '@/styles/fontStyle';
import FormInput from '@/components/Input/FormInput';
import LoginButton from '@/components/common/Button/LoginButton';
import mainLogo from '@/public/assets/icons/mainPurpleLogo.svg';
import mainLogoText from '@/public/assets/icons/logoText.svg';
import * as C from '@/constants/SignValidate';
import * as L from '../login';

interface FormValue {
  email?: string;
  nickname?: string;
  password?: string;
  pwdcheck?: string;
  errors: {
    email: {
      message: string;
    };
    nickname: {
      message: string;
    };
    password: {
      message: string;
    };
    pwdcheck: {
      message: string;
    };
  };
  extraError: string;
}
function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValue>({ mode: 'onBlur' });

  const watchInputsEmpty = Object.values(watch());
  const [isBtnActive, setIsBtnActive] = useState(false);
  const [isAgreeChecked, setIsAgreeChecked] = useState(false);
  const initialErrorMsg = {
    serverError: '',
    noCheck: '',
  };
  const [errorMsg, setErrorMsg] = useState(initialErrorMsg);

  const router = useRouter();

  const passwordRef = useRef<string | null | undefined>(null);
  passwordRef.current = watch('password');

  const initServerErrorMsg = () => {
    errorMsg && setErrorMsg(initialErrorMsg);
  };

  const onSubmit = async (data: FormValue) => {
    if (!isAgreeChecked) {
      setErrorMsg({ ...errorMsg, noCheck: '이용약관에 동의하셔야 합니다.' });
      return;
    } else {
      setErrorMsg({ ...errorMsg, noCheck: '' });
    }

    let response;
    try {
      response = await api.users.signup({
        email: data.email as string,
        nickname: data.nickname as string,
        password: data.password as string,
      });
      alert('가입이 완료되었습니다');
      router.push('/login');
    } catch (e: any) {
      setErrorMsg({ ...errorMsg, serverError: e?.data?.message });
    }
  };

  useEffect(() => {
    if (watchInputsEmpty.every((inputEl) => inputEl)) {
      setIsBtnActive(true);
    } else {
      setIsBtnActive(false);
    }
  }, [watchInputsEmpty]);

  return (
    <StyledContainer>
      <L.StyledLogoContainer>
        <L.StyledLogoImg src={mainLogo} height={190} width={165} alt="메인 로고" />
        <L.StyledLogoText src={mainLogoText} height={55} width={198} alt="메인 로고 텍스트" />
        <L.StyledDescription>첫 방문을 환영합니다!</L.StyledDescription>
      </L.StyledLogoContainer>

      <L.StyledForm onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="이메일"
          register={register('email', {
            required: C.NO_VALUE_ERROR,
            pattern: { value: C.EMAIL_VALIDATE_PATTERN, message: C.EMAIL_ERROR.FORMAT_ERROR },
            onChange: initServerErrorMsg,
          })}
          errorMessage={errors?.email?.message}
        />
        {errorMsg.serverError && <L.StyledServerErrorText>{errorMsg.serverError}</L.StyledServerErrorText>}
        <FormInput
          label="닉네임"
          register={register('nickname', { required: C.NO_VALUE_ERROR, onChange: initServerErrorMsg })}
          errorMessage={errors?.nickname?.message}
        />
        <FormInput
          label="비밀번호"
          register={register('password', {
            required: C.NO_VALUE_ERROR,
            pattern: { value: C.PWD_VALIDATE_PATTERN, message: C.PWD_ERROR.FORMAT_ERROR },
            minLength: { value: 8, message: C.PWD_ERROR.MIN_LENGTH_ERROR },
            onChange: initServerErrorMsg,
          })}
          errorMessage={errors?.password?.message}
        />
        <FormInput
          label="비밀번호 확인"
          register={register('pwdcheck', {
            required: C.NO_VALUE_ERROR,
            validate: { pwdNotSame: (value) => value === passwordRef.current || C.PWD_CHECK_ERROR.PWD_NOT_SAME },
          })}
          errorMessage={errors?.pwdcheck?.message}
        />
        <StyledCheckBoxContainer>
          <StyledCheckBox
            type="checkbox"
            checked={isAgreeChecked}
            onChange={() => {
              setIsAgreeChecked((prev) => !prev);
            }}
          />
          <StyledText>이용약관에 동의합니다.</StyledText>
        </StyledCheckBoxContainer>
        {!isAgreeChecked && <StyledAgreeNotCheckedText>{errorMsg.noCheck}</StyledAgreeNotCheckedText>}
        <LoginButton active={isBtnActive} usingType="login" text="회원가입" type="submit" margin="-3px 0 0" />
      </L.StyledForm>

      <StyledBottomTextContainer>
        <StyledText>
          이미 가입하셨나요? <L.StyledLink href="/login">가입하기</L.StyledLink>
        </StyledText>
      </StyledBottomTextContainer>
    </StyledContainer>
  );
}

export default SignUp;

const StyledContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 17px;
  background-color: ${COLORS.GRAY_FA};
`;

const StyledCheckBoxContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
`;

const StyledBottomTextContainer = styled.div`
  margin-top: -5px;
`;

const StyledCheckBox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid ${COLORS.GRAY_D9};
  background: ${COLORS.WHITE_FF};

  &:checked {
    background: ${COLORS.VIOLET_55};
  }
`;

const StyledText = styled.h5`
  text-align: center;
  ${fontStyle(16, 400)}
`;

const StyledAgreeNotCheckedText = styled(L.StyledServerErrorText)`
  margin-top: -15px;
`;
