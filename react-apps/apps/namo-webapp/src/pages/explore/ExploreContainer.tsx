import { MaxWidthContent } from '@namo-workspace/ui/MaxWidthContent.styled';
import { Container } from '../home/Home';

interface Props {
  html: string;
}

const ExploreContainer = ({ html }: Props) => {
  return (
    <MaxWidthContent>
      <Container className="py-3 py-lg-5 p-container">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </MaxWidthContent>
  );
};

export default ExploreContainer;
