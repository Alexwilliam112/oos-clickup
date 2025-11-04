export default function ProgressStep({ steps, currentStep }) {
  console.log(steps);
  return (
    <div className="progress-steps" style={{ "--current-step": currentStep }}>
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step ${currentStep >= step.number ? "active" : ""}`}
        >
          <div className="step-circle">
            {currentStep > step.number ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M15 4.5L6.75 12.75L3 9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              step.number
            )}
          </div>
          <div className="step-content">
            <div className="step-title">{step.title}</div>
            <div className="step-subtitle">{step.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
