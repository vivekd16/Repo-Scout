import React from 'react';
import styled from 'styled-components';

const getTextColor = () => {
  if (typeof document !== 'undefined') {
    return document.documentElement.classList.contains('dark') ? '#fff' : '#111';
  }
  return '#111';
};

const Loader = () => {
  const [color, setColor] = React.useState(getTextColor());

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setColor(getTextColor());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <StyledWrapper>
      <div>
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <rect x={8} y={8} width={64} height={64} />
            <text x="50%" y="60%" textAnchor="middle" fill={color} fontSize={24} fontWeight="bold">
              R
            </text>
          </svg>
        </div>
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <rect x={8} y={8} width={64} height={64} />
            <text x="50%" y="60%" textAnchor="middle" fill={color} fontSize={24} fontWeight="bold">
              E
            </text>
          </svg>
        </div>
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <rect x={8} y={8} width={64} height={64} />
            <text x="50%" y="60%" textAnchor="middle" fill={color} fontSize={24} fontWeight="bold">
              P
            </text>
          </svg>
        </div>
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <rect x={8} y={8} width={64} height={64} />
            <text x="50%" y="60%" textAnchor="middle" fill={color} fontSize={24} fontWeight="bold">
              O
            </text>
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader {
    --path: #2f3545;
    --dot: #3b82f6;
    --duration: 3s;
    width: 60px;
    height: 60px;
    position: relative;
  }

  html.dark .loader, .dark .loader {
    --loader-text-color: white;
  }

  .loader:before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    display: block;
    background: var(--dot);
    top: 45px;
    left: 26px;
    transform: translate(-18px, -18px);
    animation: dotRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  .loader svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .loader svg rect,
  .loader svg polygon,
  .loader svg circle {
    fill: none;
    stroke: var(--path);
    stroke-width: 10px;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .loader svg polygon {
    stroke-dasharray: 145 76 145 76;
    stroke-dashoffset: 0;
    animation: pathTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  .loader svg rect {
    stroke-dasharray: 192 64 192 64;
    stroke-dashoffset: 0;
    animation: pathRect var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86) infinite;
  }

  .loader svg circle {
    stroke-dasharray: 150 50 150 50;
    stroke-dashoffset: 75;
    animation: pathCircle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  .loader.triangle {
    width: 48px;
  }

  .loader.triangle:before {
    left: 21px;
    transform: translate(-10px, -18px);
    animation: dotTriangle var(--duration) cubic-bezier(0.785, 0.135, 0.15, 0.86)
      infinite;
  }

  @keyframes pathTriangle {
    33% {
      stroke-dashoffset: 74;
    }

    66% {
      stroke-dashoffset: 147;
    }

    100% {
      stroke-dashoffset: 221;
    }
  }

  @keyframes dotTriangle {
    33% {
      transform: translate(0, 0);
    }

    66% {
      transform: translate(10px, -18px);
    }

    100% {
      transform: translate(-10px, -18px);
    }
  }

  @keyframes pathRect {
    25% {
      stroke-dashoffset: 64;
    }

    50% {
      stroke-dashoffset: 128;
    }

    75% {
      stroke-dashoffset: 192;
    }

    100% {
      stroke-dashoffset: 256;
    }
  }

  @keyframes dotRect {
    25% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(18px, -18px);
    }

    75% {
      transform: translate(0, -36px);
    }

    100% {
      transform: translate(-18px, -18px);
    }
  }

  @keyframes pathCircle {
    25% {
      stroke-dashoffset: 125;
    }

    50% {
      stroke-dashoffset: 175;
    }

    75% {
      stroke-dashoffset: 225;
    }

    100% {
      stroke-dashoffset: 275;
    }
  }

  .loader {
    display: inline-block;
    margin: 0 16px;
  }`;

export default Loader; 