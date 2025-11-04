import z from 'zod'
import { employeeMap } from '../data/EmployeeData'
const availableProducts = Object.keys(employeeMap)

export const formSchema = z
  .object({
    companyName: z
      .string({
        required_error: 'Nama Perusahaan tidak boleh kosong.',
        invalid_type_error: 'Nama Perusahaan tidak boleh kosong.',
      })
      .min(3, 'Nama Perusahaan tidak boleh kosong.')
      .refine((val) => val && val.trim().length > 0, {
        message: 'Nama Perusahaan tidak boleh kosong.',
      }),
    product: z
      .string({
        required_error: 'Produk tidak boleh kosong.',
        invalid_type_error: 'Produk tidak boleh kosong.',
      })
      .refine((val) => availableProducts.includes(val), {
        message: 'Produk harus dipilih dari daftar yang tersedia.',
      }),
    picMekariName: z
      .string({
        required_error: 'Nama PIC Mekari harus dipilih.',
        invalid_type_error: 'Nama PIC Mekari harus dipilih.',
      })
      .min(3, 'Nama PIC Mekari harus dipilih.'),
    partnerCode: z
      .string({
        required_error: 'Kode Partner tidak boleh kosong.',
        invalid_type_error: 'Kode Partner tidak boleh kosong.',
      })
      .min(2, 'Kode Partner tidak boleh kosong.'),

    // Step 2: PIC Contact
    picName: z
      .string({
        required_error: 'Nama PIC tidak boleh kosong.',
        invalid_type_error: 'Nama PIC tidak boleh kosong.',
      })
      .min(3, 'Nama PIC tidak boleh kosong.')
      .refine((val) => val && val.trim().length > 0, {
        message: 'Nama PIC tidak boleh kosong.',
      }),
    picPhoneNumber: z
      .string({
        required_error: 'Nomor Telepon PIC tidak boleh kosong.',
        invalid_type_error: 'Nomor Telepon PIC tidak boleh kosong.',
      })
      .min(3, 'Nomor Telepon PIC tidak boleh kosong.')
      .refine((val) => val && val.trim().length > 0, {
        message: 'Nomor Telepon PIC tidak boleh kosong.',
      })
      .refine((val) => /^(?:62|0)?8[0-9]{9,12}$/.test(val), {
        message:
          'Format nomor telepon tidak valid. Gunakan format Indonesia (08xxxxxxxx atau 628xxxxxxxx).',
      }),
    picEmail: z
      .string({
        required_error: 'Email PIC tidak boleh kosong.',
        invalid_type_error: 'Email PIC tidak boleh kosong.',
      })
      .min(3, 'Email PIC tidak boleh kosong.')
      .refine((val) => val && val.trim().length > 0, {
        message: 'Email PIC tidak boleh kosong.',
      })
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: 'Format email tidak valid.',
      }),
    picDivision: z
      .string({
        required_error: 'Divisi PIC tidak boleh kosong.',
        invalid_type_error: 'Divisi PIC tidak boleh kosong.',
      })
      .min(3, 'Divisi PIC tidak boleh kosong.')
      .refine((val) => val && val.trim().length > 0, {
        message: 'Divisi PIC tidak boleh kosong.',
      }),
    numberOfEmployee: z
      .string({
        required_error: 'Jumlah Karyawan tidak boleh kosong.',
        invalid_type_error: 'Jumlah Karyawan tidak boleh kosong.',
      })
      .refine((val) => val && val.trim().length > 0, {
        message: 'Jumlah Karyawan tidak boleh kosong.',
      })
      .refine((val) => !isNaN(parseInt(val)), {
        message: 'Jumlah Karyawan harus berupa angka.',
      })
      .refine((val) => parseInt(val) > 0, {
        message: 'Jumlah Karyawan harus lebih besar dari 0.',
      }),

    // Step 3: Deal Details
    dealType: z
      .string({
        required_error: 'Jenis Deal tidak boleh kosong.',
        invalid_type_error: 'Jenis Deal tidak boleh kosong.',
      })
      .min(1, 'Jenis Deal harus dipilih.'),
    industry: z
      .string({
        required_error: 'Industri tidak boleh kosong.',
        invalid_type_error: 'Industri tidak boleh kosong.',
      })
      .min(1, 'Industri harus dipilih.'),
    productPreference: z.string().optional(),
    needsDetail: z
      .string({
        required_error: 'Detail Kebutuhan tidak boleh kosong.',
        invalid_type_error: 'Detail Kebutuhan tidak boleh kosong.',
      })
      .min(1, 'Detail Kebutuhan tidak boleh kosong.')
      .refine((val) => val && val.trim().length > 0, {
        message: 'Detail Kebutuhan tidak boleh kosong.',
      }),
  })
  .refine(
    (data) => {
      // Custom validation: PIC Mekari must match selected product
      const availableEmployeesForProduct = employeeMap[data.product] || []
      const validEmployeeNames = availableEmployeesForProduct.map((emp) => emp.name)
      return validEmployeeNames.includes(data.picMekariName)
    },
    {
      message: 'Nama PIC Mekari harus sesuai dengan produk yang dipilih.',
      path: ['picMekariName'],
    }
  )
  .refine(
    (data) => {
      // Product Preference is required only for Mekari Qontak
      if (data.product === 'Mekari Qontak') {
        return data.productPreference && data.productPreference.trim().length > 0
      }
      return true
    },
    {
      message: 'Preferensi Produk harus dipilih untuk Mekari Qontak.',
      path: ['productPreference'],
    }
  )
