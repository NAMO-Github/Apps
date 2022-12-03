import { createGlobalStyle, css } from 'styled-components';

export const AppStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    font-family: 'Inter', sans-serif;
    box-sizing: border-box;
  }

  #root{
    min-width: 320px;
  }

  #nprogress {
    .spinner {
      display: none !important;
    }
  }
  .Toastify__toast-body > div:last-child{
    white-space: pre-wrap;
    word-break: break-word;
  }

  .Toastify__toast-theme--colored.Toastify__toast--default {

  }
  .Toastify__toast-theme--colored.Toastify__toast--info {
  }
  .Toastify__toast-theme--colored.Toastify__toast--success {
    background: #4BA97E;
    box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.11), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    border-radius: 8px;
  }
  .Toastify__toast-theme--colored.Toastify__toast--warning {
  }
  .Toastify__toast-theme--colored.Toastify__toast--error {
    background: #FF5562;
    box-shadow: 0px 0.6px 1.8px rgba(0, 0, 0, 0.11), 0px 3.2px 7.2px rgba(0, 0, 0, 0.13);
    border-radius: 8px;
  }


  .__react_component_tooltip {
    @media (max-width: 767.98px) {
      padding: 4px 8px !important;
    font-size: 12px !important;
    }
  }

  .p-container {
    padding-left: 1rem;
    padding-right: 1rem;

    @media (min-width: 992px) {
      padding-left: 9%;
      padding-right: 9%;
    }
  }
`;

export const ellipsisHidden = css`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
