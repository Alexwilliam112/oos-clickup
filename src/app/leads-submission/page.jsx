'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import './styles/App.css'
import { steps } from './data/StepsData'
import { employeeMap } from './data/EmployeeData'
import { productMapping } from './data/ProductData'
import { dealTypes } from './data/DealsTypeData'
import { formSchema } from './_components/FormValidation'
import { productPreferences } from './data/ProductPrefrenceData'
import { industries } from './data/IndustriesData'
import Notification from './_components/Notification'
import DealDetailsForm from './_components/DealDetailsForm'
import ProgressStep from './_components/ProgressStep'
import CompanyInfoForm from './_components/CompanyInfoForm'
import PicContactForm from './_components/PicContactForm'
import FormAction from './_components/FormAction'

export default function LeadsSubmissionPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState(null)

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      product: 'Mekari Talenta',
      picMekariName: '',
      partnerCode: '',
      picName: '',
      picPhoneNumber: '',
      picEmail: '',
      picDivision: '',
      numberOfEmployee: '',
      dealType: '',
      industry: '',
      productPreference: '',
      needsDetail: '',
    },
  })

  const selectedProduct = watch('product')

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const hideNotification = () => {
    setNotification(null)
  }

  const getAvailableEmployees = () => {
    return employeeMap[selectedProduct] || []
  }

  const handleProductChange = async (value) => {
    setValue('product', value)
    setValue('picMekariName', '') // Reset PIC selection when product changes
    setValue('productPreference', '') // Reset product preference when product changes
    await trigger('product') // Trigger validation for product
    await trigger('picMekariName') // Trigger validation for picMekariName after reset
    await trigger('productPreference') // Trigger validation for productPreference
  }

  const validateStep1 = async () => {
    const step1Fields = ['companyName', 'product', 'picMekariName', 'partnerCode']
    const results = await Promise.all(step1Fields.map((field) => trigger(field)))
    return results.every((result) => result)
  }

  const validateStep2 = async () => {
    const step2Fields = ['picName', 'picPhoneNumber', 'picEmail', 'picDivision', 'numberOfEmployee']
    const results = await Promise.all(step2Fields.map((field) => trigger(field)))
    return results.every((result) => result)
  }

  const validateStep3 = async () => {
    const step3Fields = ['dealType', 'industry', 'needsDetail']
    if (selectedProduct === 'Mekari Qontak') {
      step3Fields.push('productPreference')
    }
    const results = await Promise.all(step3Fields.map((field) => trigger(field)))
    return results.every((result) => result)
  }

  const handleFormSubmit = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      // Validate all steps before submission
      const step1Valid = await validateStep1()
      const step2Valid = await validateStep2()
      const step3Valid = await validateStep3()

      if (!step1Valid || !step2Valid || !step3Valid) {
        console.log('Form submission failed: Not all steps are valid')
        showNotification('error', 'Mohon lengkapi semua field yang wajib diisi di semua step.')

        // Navigate to first invalid step
        if (!step1Valid) {
          setCurrentStep(1)
        } else if (!step2Valid) {
          setCurrentStep(2)
        } else if (!step3Valid) {
          setCurrentStep(3)
        }
        setIsSubmitting(false)
        return
      }

      const formData = watch()

      const selectedEmployee = employeeMap[formData.product]?.find(
        (emp) => emp.name === formData.picMekariName
      )

      const selectedDealType = dealTypes.find((deal) => deal.name === formData.dealType)

      const selectedIndustry = industries.find((industry) => industry.name === formData.industry)

      const selectedProductPreference = formData.productPreference
        ? productPreferences.find((pref) => pref.name === formData.productPreference)
        : null

      const currentTime = new Date()
      const apiPayload = {
        clientCompanyName: formData.companyName,
        createdAtIso: currentTime.toISOString(),
        createdAtTimestamp: currentTime.getTime(),
        dealType: {
          id: selectedDealType?.id || '',
          name: selectedDealType?.name || '',
        },
        industry: {
          id: selectedIndustry?.id || '',
          name: selectedIndustry?.name || '',
        },
        needsDetail: formData.needsDetail,
        numOfEmployee: parseInt(formData.numberOfEmployee),
        partnerCode: formData.partnerCode,
        picDivision: formData.picDivision,
        picEmail: formData.picEmail,
        picEmployeeName: {
          id: selectedEmployee?.id || 0,
          name: selectedEmployee?.name || '',
        },
        picName: formData.picName,
        picPhoneNumber: formData.picPhoneNumber,
        product: productMapping[formData.product] || {
          id: '',
          name: formData.product,
        },
        productReference: {
          id: selectedProductPreference?.id || '',
          name: selectedProductPreference?.name || '',
        },
      }

      const response = await axios.post(
        'https://api-oos.jojonomic.com/14/FormSubmissionPartner',
        apiPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      )

      if (response.data.error === false) {
        showNotification('success', 'Form berhasil dikirim! Terima kasih atas submission Anda.')

        setCurrentStep(1)

        setValue('companyName', '')
        setValue('product', 'Mekari Talenta')
        setValue('picMekariName', '')
        setValue('partnerCode', '')
        setValue('picName', '')
        setValue('picPhoneNumber', '')
        setValue('picEmail', '')
        setValue('picDivision', '')
        setValue('numberOfEmployee', '')
        setValue('dealType', '')
        setValue('industry', '')
        setValue('productPreference', '')
        setValue('needsDetail', '')
      } else {
        const errorMessage = response.data.message || 'Terjadi kesalahan saat mengirim form.'
        showNotification('error', `Error: ${errorMessage}`)
      }
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data
        const errorMessage = errorData.message || 'Terjadi kesalahan saat mengirim form.'
        showNotification('error', `Error (${error.response.status}): ${errorMessage}`)
      } else if (error.request) {
        showNotification(
          'error',
          'Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.'
        )
      } else {
        showNotification('error', 'Terjadi kesalahan tak terduga. Silakan coba lagi.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    console.log(`Current step sebelum next: ${currentStep}`)
    let isValid = false

    if (currentStep === 1) {
      isValid = await validateStep1()
    } else if (currentStep === 2) {
      isValid = await validateStep2()
    } else if (currentStep === 3) {
      // Di step 3, tidak perlu melakukan apa-apa karena tombol akan menjadi Submit
      return
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
      console.log(`Step berubah menjadi: ${currentStep + 1}`)
    } else if (!isValid) {
      console.log(`Validasi gagal untuk step ${currentStep}`)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      console.log(`Step berubah menjadi: ${currentStep - 1}`)
    }
  }

  return (
    <div className="app">
      <div className="form-container">
        <div className="form-card">
          {/* Header with Logo */}
          <div className="form-header">
            <img src="/brand/logo-color-rgb.svg" alt="Mekari" className="mekari-logo" />
          </div>

          <Notification notification={notification} hideNotification={hideNotification} />

          <ProgressStep steps={steps} currentStep={currentStep} />

          <div className="form-content">
            {currentStep === 1 && (
              <CompanyInfoForm
                errors={errors}
                register={register}
                handleProductChange={handleProductChange}
                trigger={trigger}
                getAvailableEmployees={getAvailableEmployees}
              />
            )}

            {currentStep === 2 && <PicContactForm errors={errors} register={register} />}

            {currentStep === 3 && (
              <DealDetailsForm
                errors={errors}
                register={register}
                dealTypes={dealTypes}
                industries={industries}
                selectedProduct={selectedProduct}
                productPreferences={productPreferences}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <FormAction
              currentStep={currentStep}
              handlePrevious={handlePrevious}
              isSubmitting={isSubmitting}
              handleFormSubmit={handleFormSubmit}
              handleNext={handleNext}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
