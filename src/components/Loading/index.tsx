function Loading() {
  return (
    <>
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <style jsx>
        {`
          .spinner {
            display: inline-block;
            position: relative;
            width: 50px;
            height: 50px;
          }
          .spinner div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 24px;
            height: 24px;
            margin: 20px auto;
            border: 3px solid #444;
            border-radius: 50%;
            animation: spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: #444 transparent transparent transparent;
          }
          .spinner div:div:nth-child(1) {
            animation-delay: -0.45s;
          }
          .spinner div:nth-child(2) {
            animation-delay: -0.3s;
          }
          .spinner div:nth-child(3) {
            animation-delay: -0.15s;
          }
          @keyframes spinner {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}
export default Loading;
