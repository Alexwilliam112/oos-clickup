export default function FormAction({
  currentStep,
  handlePrevious,
  isSubmitting,
  handleFormSubmit,
  handleNext,
}) {
  return (
    <>
      {currentStep > 1 && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={isSubmitting}
        >
          Previous
        </button>
      )}
      <button
        type="button"
        className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
        onClick={currentStep === 3 ? handleFormSubmit : handleNext}
        disabled={isSubmitting}
      >
        {currentStep === 3 ? (isSubmitting ? "Mengirim..." : "Submit") : "Next"}
      </button>
    </>
  );
}
