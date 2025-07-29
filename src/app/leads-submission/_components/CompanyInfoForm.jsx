export default function CompanyInfoForm({
  errors,
  register,
  handleProductChange,
  trigger,
  getAvailableEmployees,
}) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="companyName" className="form-label">
          Nama Perusahaan Klien
        </label>
        <input
          id="companyName"
          type="text"
          className={`form-input ${errors.companyName ? "error" : ""}`}
          placeholder="Masukkan Nama Perusahaan Klien"
          {...register("companyName")}
        />
        {errors.companyName && (
          <div className="error-message">{errors.companyName.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="product" className="form-label">
          Produk
        </label>
        <div className="form-select">
          <select
            id="product"
            className={`form-input select ${errors.product ? "error" : ""}`}
            {...register("product")}
            onChange={(e) => handleProductChange(e.target.value)}
          >
            <option value="Mekari Talenta">Mekari Talenta</option>
            <option value="Mekari Qontak">Mekari Qontak</option>
            <option value="Mekari Jurnal">Mekari Jurnal</option>
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
        {errors.product && (
          <div className="error-message">{errors.product.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="picMekariName" className="form-label">
          Nama PIC Mekari
        </label>
        <div className="form-select">
          <select
            id="picMekariName"
            className={`form-input select ${
              errors.picMekariName ? "error" : ""
            }`}
            {...register("picMekariName", {
              onChange: async (e) => {
                await trigger("picMekariName");
              },
            })}
          >
            <option value="">Pilih Nama PIC Mekari</option>
            {getAvailableEmployees().map((employee) => (
              <option key={employee.id} value={employee.name}>
                {employee.name}
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
        {errors.picMekariName && (
          <div className="error-message">{errors.picMekariName.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="partnerCode" className="form-label">
          Kode Partner
        </label>
        <input
          id="partnerCode"
          type="text"
          className={`form-input ${errors.partnerCode ? "error" : ""}`}
          placeholder="Masukkan Kode Partner"
          {...register("partnerCode")}
        />
        {errors.partnerCode && (
          <div className="error-message">{errors.partnerCode.message}</div>
        )}
      </div>
    </>
  );
}
