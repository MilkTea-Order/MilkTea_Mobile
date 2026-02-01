import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { FormDatePicker } from '@/components/molecules/FormDatePicker'
import { FormFilePicker } from '@/components/molecules/FormFilePicker'
import { FormSelectField } from '@/components/molecules/FormSelectField'
import { FormTextField } from '@/components/molecules/FormTextField'
import { handleUpdateProfileFormErrors, useUpdateProfile } from '@/features/user/hooks/useUpdateProfile'
import editProfileSchema, { EditProfileSchema } from '@/features/user/schema/editProfile.schema'
import { User } from '@/features/user/types/user.type'
import { GENDER_OPTIONS } from '@/shared/constants/other'
import { useTheme } from '@/shared/hooks/useTheme'
import { isChangedNumber, isChangedText, isRNFile } from '@/shared/utils/utils'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React, { useRef } from 'react'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

interface EditProfileFormProps {
  userProfile: User
  onSuccess?: () => void
}

export function EditProfileForm({ userProfile, onSuccess }: EditProfileFormProps) {
  const updateProfileMutation = useUpdateProfile()
  const { colors, gradients } = useTheme()

  const initialValuesRef = useRef<EditProfileSchema>({
    fullName: userProfile.fullName || '',
    genderID: userProfile.genderID || GENDER_OPTIONS[0].value,
    birthDay: userProfile.birthDay || '',
    identityCode: userProfile.identityCode || '',
    email: userProfile.email || '',
    cellPhone: userProfile.cellPhone || '',
    address: userProfile.address || '',
    bankName: userProfile.bankName || '',
    bankAccountName: userProfile.bankAccountName || '',
    bankAccountNumber: userProfile.bankAccountNumber || '',
    bankQRCode: userProfile.bankQRCode || null
  })
  const initialValues = initialValuesRef.current

  const validateWithChangedContext = async (values: EditProfileSchema) => {
    const birthDayChanged = isChangedText(values.birthDay, initialValues.birthDay)
    const emailChanged = isChangedText(values.email, initialValues.email)
    const addressChanged = isChangedText(values.address, initialValues.address)
    const bankNameChanged = isChangedText(values.bankName, initialValues.bankName)
    const bankAccountNameChanged = isChangedText(values.bankAccountName, initialValues.bankAccountName)
    const bankAccountNumberChanged = isChangedText(values.bankAccountNumber, initialValues.bankAccountNumber)
    const bankQRCodeChanged = isRNFile(values.bankQRCode)
    const bankInfoChanged = bankNameChanged || bankAccountNameChanged || bankAccountNumberChanged || bankQRCodeChanged

    try {
      await editProfileSchema.validate(values, {
        abortEarly: false,
        context: {
          birthDayChanged,
          emailChanged,
          addressChanged,
          bankNameChanged,
          bankAccountNameChanged,
          bankAccountNumberChanged,
          bankQRCodeChanged,
          bankInfoChanged
        }
      })
      return {}
    } catch (err: any) {
      const formErrors: Record<string, string> = {}
      const inner = err?.inner
      if (Array.isArray(inner)) {
        for (const e of inner) {
          const path = e?.path
          const message = e?.message
          if (typeof path === 'string' && typeof message === 'string' && !formErrors[path]) {
            formErrors[path] = message
          }
        }
      } else if (typeof err?.path === 'string' && typeof err?.message === 'string') {
        formErrors[err.path] = err.message
      }
      return formErrors
    }
  }

  const handleSubmit = async (values: EditProfileSchema, setFieldError: (field: string, message: string) => void) => {
    try {
      const formData = new FormData()
      if (isChangedText(values.fullName, initialValues.fullName)) {
        formData.append('fullName', values.fullName ?? '')
      }
      if (isChangedNumber(values.genderID, initialValues.genderID)) {
        formData.append('genderID', String(values.genderID ?? ''))
      }
      if (isChangedText(values.birthDay, initialValues.birthDay)) {
        formData.append('birthDay', values.birthDay ?? '')
      }
      if (isChangedText(values.identityCode, initialValues.identityCode)) {
        formData.append('identityCode', values.identityCode ?? '')
      }
      if (isChangedText(values.email, initialValues.email)) {
        formData.append('email', values.email ?? '')
      }
      if (isChangedText(values.cellPhone, initialValues.cellPhone)) {
        formData.append('cellPhone', values.cellPhone ?? '')
      }
      if (isChangedText(values.address ?? '', initialValues.address ?? '')) {
        formData.append('address', values.address ?? '')
      }
      const bankNameChanged = isChangedText(values.bankName ?? '', initialValues.bankName ?? '')
      const bankAccountNameChanged = isChangedText(values.bankAccountName ?? '', initialValues.bankAccountName ?? '')
      const bankAccountNumberChanged = isChangedText(
        values.bankAccountNumber ?? '',
        initialValues.bankAccountNumber ?? ''
      )
      const bankQRCodeChanged = isRNFile(values.bankQRCode)
      const bankInfoChanged = bankNameChanged || bankAccountNameChanged || bankAccountNumberChanged || bankQRCodeChanged

      if (bankInfoChanged) {
        formData.append('bankName', values.bankName ?? '')
        formData.append('bankAccountName', values.bankAccountName ?? '')
        formData.append('bankAccountNumber', values.bankAccountNumber ?? '')
        if (bankQRCodeChanged && values.bankQRCode && isRNFile(values.bankQRCode)) {
          formData.append('bankQRCode', {
            uri: values.bankQRCode.uri,
            name: values.bankQRCode.name,
            type: values.bankQRCode.type
          } as any)
        }
      }

      await updateProfileMutation.mutateAsync(formData)
      onSuccess?.()
    } catch (error: any) {
      handleUpdateProfileFormErrors(error, setFieldError)
    }
  }

  return (
    <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Formik
        initialValues={initialValues}
        validate={validateWithChangedContext}
        validateOnMount={false}
        validateOnBlur
        validateOnChange={false}
        onSubmit={(values, { setFieldError }) => handleSubmit(values, setFieldError)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit: handleSubmitFormik,
          setFieldTouched,
          setFieldValue,
          values,
          errors,
          touched,
          dirty,
          isValid
        }) => (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 100
            }}
            // keyboardShouldPersistTaps='handled'
            keyboardShouldPersistTaps='always'
            keyboardDismissMode='none'
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Personal Information Section */}
            <CollapsibleSection title='Thông tin cá nhân' icon='person-outline' defaultExpanded={true}>
              {/* User name */}
              <FormTextField
                label='Tên đăng nhập'
                icon='person-outline'
                value={userProfile.userName || ''}
                editable={false}
                disabled
                placeholder='Tên đăng nhập'
              />

              {/* Full name */}
              <FormTextField
                label='Họ và tên'
                icon='person-outline'
                value={values.fullName ?? ''}
                onChangeText={(text) => {
                  handleChange('fullName')(text)
                }}
                onBlur={handleBlur('fullName')}
                error={errors.fullName}
                touched={touched.fullName}
                required
                placeholder='Nhập họ và tên'
              />

              {/* Gender */}
              <FormSelectField
                label='Giới tính'
                value={values.genderID!}
                options={GENDER_OPTIONS}
                onChange={(value) => {
                  setFieldValue('genderID', Number(value))
                  setFieldTouched('genderID', true, false)
                }}
                error={errors.genderID}
                touched={touched.genderID}
                required
                icon='people-outline'
              />

              <FormDatePicker
                label='Ngày sinh'
                value={values.birthDay ?? ''}
                onChange={(date) => {
                  handleChange('birthDay')(date)
                  setFieldTouched('birthDay', true, false)
                }}
                error={errors.birthDay}
                touched={touched.birthDay}
                required
              />

              <FormTextField
                label='Số CMND/CCCD'
                icon='card-outline'
                value={values.identityCode ?? ''}
                onChangeText={(text) => {
                  handleChange('identityCode')(text)
                }}
                onBlur={handleBlur('identityCode')}
                error={errors.identityCode}
                touched={touched.identityCode}
                required
                placeholder='Nhập số CMND/CCCD'
                keyboardType='numeric'
              />
            </CollapsibleSection>

            {/* Contact Information Section */}
            <CollapsibleSection title='Thông tin liên hệ' icon='call-outline' defaultExpanded={true}>
              {/* Email */}
              <FormTextField
                label='Email'
                icon='mail-outline'
                value={values.email ?? ''}
                onChangeText={(text) => {
                  handleChange('email')(text)
                }}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                placeholder='Nhập email'
                keyboardType='email-address'
                autoCapitalize='none'
              />
              {/* Cell phone */}
              <FormTextField
                label='Số điện thoại'
                icon='call-outline'
                value={values.cellPhone ?? ''}
                onChangeText={(text) => {
                  handleChange('cellPhone')(text)
                }}
                onBlur={handleBlur('cellPhone')}
                error={errors.cellPhone}
                touched={touched.cellPhone}
                required
                placeholder='Nhập số điện thoại'
                keyboardType='phone-pad'
              />

              <FormTextField
                label='Địa chỉ'
                icon='location-outline'
                value={values.address}
                onChangeText={(text) => {
                  handleChange('address')(text)
                }}
                onBlur={handleBlur('address')}
                error={errors.address}
                touched={touched.address}
                placeholder='Nhập địa chỉ'
                multiline
                numberOfLines={3}
                textAlignVertical='top'
              />
            </CollapsibleSection>

            {/* Bank Information Section */}
            <CollapsibleSection title='Thông tin ngân hàng' icon='card-outline' defaultExpanded={true}>
              <FormTextField
                label='Tên ngân hàng'
                icon='business-outline'
                value={values.bankName ?? ''}
                onChangeText={(text) => {
                  handleChange('bankName')(text)
                }}
                onBlur={handleBlur('bankName')}
                error={errors.bankName}
                touched={touched.bankName}
                placeholder='Nhập tên ngân hàng'
              />

              <FormTextField
                label='Tên chủ tài khoản'
                icon='person-outline'
                value={values.bankAccountName ?? ''}
                onChangeText={(text) => {
                  handleChange('bankAccountName')(text)
                }}
                onBlur={handleBlur('bankAccountName')}
                error={errors.bankAccountName}
                touched={touched.bankAccountName}
                placeholder='Nhập tên chủ tài khoản'
              />

              <FormTextField
                label='Số tài khoản'
                icon='card-outline'
                value={values.bankAccountNumber ?? ''}
                onChangeText={(text) => {
                  handleChange('bankAccountNumber')(text)
                }}
                onBlur={handleBlur('bankAccountNumber')}
                error={errors.bankAccountNumber}
                touched={touched.bankAccountNumber}
                placeholder='Nhập số tài khoản'
                keyboardType='numeric'
              />

              <FormFilePicker
                label='Mã QR Code ngân hàng'
                value={values.bankQRCode ?? null}
                onChange={(file) => {
                  setFieldValue('bankQRCode', file)
                  setFieldTouched('bankQRCode', true, false)
                }}
                error={typeof errors.bankQRCode === 'string' ? errors.bankQRCode : undefined}
                touched={typeof touched.bankQRCode === 'boolean' ? touched.bankQRCode : false}
                placeholder='Mã QR code ngân hàng'
              />
            </CollapsibleSection>

            {/* Save Button */}
            <TouchableOpacity
              onPress={() => handleSubmitFormik()}
              disabled={updateProfileMutation.isPending || !dirty || !isValid}
              activeOpacity={0.9}
              style={{
                opacity: updateProfileMutation.isPending || !dirty || !isValid ? 0.6 : 1,
                marginTop: 12
              }}
            >
              <View
                className='rounded-2xl overflow-hidden'
                style={{
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12,
                  elevation: 10
                }}
              >
                <LinearGradient
                  colors={gradients.header as any}
                  className='items-center justify-center'
                  style={{
                    height: 56,
                    paddingVertical: 16
                  }}
                >
                  {updateProfileMutation.isPending ? (
                    <ActivityIndicator color='white' size='small' />
                  ) : (
                    <View className='flex-row items-center justify-center'>
                      <Text className='text-white text-lg font-bold mr-2'>Lưu thay đổi</Text>
                      <View className='rounded-full bg-white/20 p-1 ml-1'>
                        <Ionicons name='checkmark' size={18} color='white' />
                      </View>
                    </View>
                  )}
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  )
}
