export default function PicContactForm({ errors, register }) {
  return (
    <>
      <div className="form-field">
        <label htmlFor="picName" className="form-label">
          Nama PIC
        </label>
        <input
          id="picName"
          type="text"
          className={`form-input ${errors.picName ? "error" : ""}`}
          placeholder="Masukkan Nama PIC"
          {...register("picName")}
        />
        {errors.picName && (
          <div className="error-message">{errors.picName.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="picPhoneNumber" className="form-label">
          Nomor Telepon PIC
        </label>
        <input
          id="picPhoneNumber"
          type="text"
          className={`form-input ${errors.picPhoneNumber ? "error" : ""}`}
          placeholder="Masukkan Nomor Telepon PIC"
          {...register("picPhoneNumber")}
        />
        {errors.picPhoneNumber && (
          <div className="error-message">{errors.picPhoneNumber.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="picEmail" className="form-label">
          Email PIC
        </label>
        <input
          id="picEmail"
          type="email"
          className={`form-input ${errors.picEmail ? "error" : ""}`}
          placeholder="Masukkan Email PIC"
          {...register("picEmail")}
        />
        {errors.picEmail && (
          <div className="error-message">{errors.picEmail.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="picDivision" className="form-label">
          Divisi PIC
        </label>
        <input
          id="picDivision"
          type="text"
          className={`form-input ${errors.picDivision ? "error" : ""}`}
          placeholder="Masukkan Divisi PIC"
          {...register("picDivision")}
        />
        {errors.picDivision && (
          <div className="error-message">{errors.picDivision.message}</div>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="numberOfEmployee" className="form-label">
          Jumlah Karyawan
        </label>
        <input
          id="numberOfEmployee"
          type="number"
          className={`form-input ${errors.numberOfEmployee ? "error" : ""}`}
          placeholder="Masukkan Jumlah Karyawan"
          {...register("numberOfEmployee")}
        />
        {errors.numberOfEmployee && (
          <div className="error-message">{errors.numberOfEmployee.message}</div>
        )}
      </div>
    </>
  );
}
