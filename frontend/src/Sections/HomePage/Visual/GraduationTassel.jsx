export function GraduationTassel() {
  return (
    <svg
      width="24"
      height="40"
      viewBox="0 0 24 60"
      xmlns="http://www.w3.org/2000/svg"
      className="tassel-animation"
    >
     <style>
        {`
          @keyframes sway {
            0%, 100% {
              transform: rotate(0deg);
              transform-origin: 12px 0px;
            }
            25% {
              transform: rotate(8deg);
              transform-origin: 12px 0px;
            }
            75% {
              transform: rotate(-8deg);
              transform-origin: 12px 0px;
            }
          }
          
          @keyframes swing {
            0%, 100% {
              transform: rotate(0deg);
              transform-origin: 12px 38px;
            }
            25% {
              transform: rotate(12deg);
              transform-origin: 12px 38px;
            }
            75% {
              transform: rotate(-12deg);
              transform-origin: 12px 38px;
            }
          }
          
          .tassel-animation {
            animation: sway 3s ease-in-out infinite;
          }
          
          .tassel-part {
            animation: swing 3s ease-in-out infinite;
          }
        `}
     </style>

      {/* string */}
      <line
        x1="12"
        y1="18"
        x2="12"
        y2="38"
        stroke="#0654B7"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* knot */}
      <circle cx="12" cy="37" r="5" fill="#0654B7" />

      {/* tassel */}
      <path
      className="tassel-part"
        d="M12 42
           C6 42, 4 50, 6 56
           C8 61, 15 62, 18 56
           C20 50, 18 42, 12 42Z"
        fill="#0654B7"
      />
    </svg>
  );
}