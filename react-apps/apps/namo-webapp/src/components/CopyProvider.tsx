import React, { ReactNode, useCallback, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ReactComponent as IcCopy } from '@assets/images/profile/ic-bx-copy.svg';

type Props = {
  target: string;
  children: ReactNode;
  className?: string;
};

export default function CopyProvider({ target, children, className }: Props) {
  const [isCopy, setIsCopy] = useState<boolean>(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(target);
    setIsCopy(true);
  }, [target]);

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { onClick: handleCopy });
    }
    return child;
  });

  return (
    <>
      <div
        className={`d-flex flex-row align-items-center ${className}`}
        role="button"
      >
        {childrenWithProps}
        <IcCopy
          data-tip=""
          data-place="top"
          data-effect="solid"
          className="ms-1"
        />
      </div>

      <ReactTooltip
        getContent={() => <span>{isCopy ? 'Copied' : 'Copy'}</span>}
        afterHide={() => setIsCopy(false)}
      />
    </>
  );
}
