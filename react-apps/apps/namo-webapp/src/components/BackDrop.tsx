import styled from 'styled-components';

interface Props {
  onClick?: () => void;
  zIndex: number;
  className?: string;
}

interface ZIndex {
  zIndex: number;
}

const BackDrop = ({ onClick, zIndex, className }: Props) => {
  return <BackDropS onClick={onClick} zIndex={zIndex} className={className} />;
};

const BackDropS = styled.div<ZIndex>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: ${({ zIndex }) => zIndex};
`;

export default BackDrop;
