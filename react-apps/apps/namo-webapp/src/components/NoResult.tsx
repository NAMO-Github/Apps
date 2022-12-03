import { ReactComponent as IcEmptyBox } from '@assets/images/common/ic-empty-box.svg';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body1, Body2 } from '@namo-workspace/ui/Typography';
import { FC } from 'react';
import styled from 'styled-components';
interface PropsNoResult {
  className?: string;
  title: string;
  subTitle: string;
}

const NoResult: FC<PropsNoResult> = ({ className, title, subTitle }) => {
  return (
    <Container>
      <WrapperNoResults className={className}>
        <IcEmptyBox />
        <WrapperContent>
          <Content>{title}</Content>
          <SubContent>{subTitle}</SubContent>
        </WrapperContent>
      </WrapperNoResults>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: calc(330px - 68px);
`;

const WrapperNoResults = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 575.98px) {
    & svg {
      width: 80px;
      height: 52px;
    }
  }
`;

const WrapperContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Content = styled(Body1)`
  margin-top: 12px;
  margin-bottom: 4px;
  color: ${Colors.textLevel1};
  font-weight: 700;

  @media (max-width: 575.98px) {
    font-weight: 600;
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;

const SubContent = styled(Body2)`
  color: ${Colors.textLevel3};

  @media (max-width: 575.98px) {
    font-weight: 400;
    font-size: ${FontSize.body4}px;
    line-height: ${FontHeight.body4}px;
  }
`;

export default NoResult;
