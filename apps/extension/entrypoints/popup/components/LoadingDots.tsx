export const LoadingDots = () => {
	return (
		<>
			<span className="dot dot-1">.</span>
			<span className="dot dot-2">.</span>
			<span className="dot dot-3">.</span>

			<style>{`
        @keyframes dot-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        .dot {
          animation: dot-blink 1.4s infinite;
          animation-fill-mode: both;
        }

        .dot-1 { animation-delay: 0s; }
        .dot-2 { animation-delay: 0.2s; }
        .dot-3 { animation-delay: 0.4s; }
      `}</style>
		</>
	);
};
