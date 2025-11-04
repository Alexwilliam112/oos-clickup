export default function DealDetailsForm({
  errors,
  register,
  dealTypes,
  industries,
  selectedProduct,
  productPreferences,
}) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="dealType" className="form-label">
          Jenis Deal
        </label>
        <div className="form-select">
          <select
            id="dealType"
            className={`form-input select ${errors.dealType ? "error" : ""}`}
            {...register("dealType")}
          >
            <option value="">Pilih Jenis Deal</option>
            {dealTypes.map((dealType) => (
              <option key={dealType.id} value={dealType.name}>
                {dealType.name}
              </option>
            ))}
          </select>
          <svg
            className="select-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {errors.dealType && (
          <div className="error-message">{errors.dealType.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="industry" className="form-label">
          Industri
        </label>
        <div className="form-select">
          <select
            id="industry"
            className={`form-input select ${errors.industry ? "error" : ""}`}
            {...register("industry")}
          >
            <option value="">Pilih Industri</option>
            {industries.map((industry) => (
              <option key={industry.id} value={industry.name}>
                {industry.name}
              </option>
            ))}
          </select>
          <svg
            className="select-arrow"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#64748b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {errors.industry && (
          <div className="error-message">{errors.industry.message}</div>
        )}
      </div>

      {selectedProduct === "Mekari Qontak" && (
        <div className="form-field">
          <label htmlFor="productPreference" className="form-label">
            Preferensi Produk
          </label>
          <div className="form-select">
            <select
              id="productPreference"
              className={`form-input select ${
                errors.productPreference ? "error" : ""
              }`}
              {...register("productPreference")}
            >
              <option value="">Pilih Preferensi Produk</option>
              {productPreferences.map((preference) => (
                <option key={preference.id} value={preference.name}>
                  {preference.name}
                </option>
              ))}
            </select>
            <svg
              className="select-arrow"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          {errors.productPreference && (
            <div className="error-message">
              {errors.productPreference.message}
            </div>
          )}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="needsDetail" className="form-label">
          Detail Kebutuhan
        </label>
        <textarea
          id="needsDetail"
          className={`form-input ${errors.needsDetail ? "error" : ""}`}
          placeholder="Masukkan Detail Kebutuhan"
          rows="4"
          {...register("needsDetail")}
        />
        {errors.needsDetail && (
          <div className="error-message">{errors.needsDetail.message}</div>
        )}
      </div>
    </>
  );
}
