import { CollapsibleSection } from '@/components/molecules/CollapsibleSection'
import { FormDatePicker } from '@/components/molecules/FormDatePicker'
import { FormFilePicker } from '@/components/molecules/FormFilePicker'
import { FormSelectField, SelectOption } from '@/components/molecules/FormSelectField'
import { FormTextField } from '@/components/molecules/FormTextField'
import { handleUpdateProfileFormErrors, useUpdateProfile } from '@/features/user/hooks/useUpdateProfile'
import editProfileSchema, { EditProfileSchema } from '@/features/user/schema/editProfile.schema'
import { User } from '@/features/user/types/user.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { UploadFile } from '@/shared/types/file.type'
import { setFormikFieldErrors } from '@/shared/utils/formErrors'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Formik } from 'formik'
import React, { useMemo } from 'react'
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

const GENDER_OPTIONS: SelectOption[] = [
  { label: 'Nam', value: 1 },
  { label: 'Nữ', value: 2 },
  { label: 'Khác', value: 3 }
]

type EditProfileFormValues = EditProfileSchema & {
  bankQRCodeFile?: UploadFile | null
}

export function EditProfileForm({ userProfile, onSuccess }: EditProfileFormProps) {
  const updateProfileMutation = useUpdateProfile()
  const { colors, gradients } = useTheme()

  const initialValues: EditProfileFormValues = useMemo(
    () => ({
      fullName: userProfile.fullName || '',
      genderID: userProfile.genderID || 1,
      birthDay: userProfile.birthDay || '',
      identityCode: userProfile.identityCode || '',
      email: userProfile.email || '',
      cellPhone: userProfile.cellPhone || '',
      address: userProfile.address || '',
      bankName: userProfile.bankName || '',
      bankAccountName: userProfile.bankAccountName || '',
      bankAccountNumber: userProfile.bankAccountNumber || '',
      bankQRCode: userProfile.bankQRCode || '',
      bankQRCodeFile: null
    }),
    [userProfile]
  )

  const handleSubmit = async (
    values: EditProfileFormValues,
    setFieldError: (field: string, message: string) => void
  ) => {
    try {
      const formData = new FormData()
      formData.append('fullName', values.fullName)
      formData.append('genderID', String(values.genderID))
      formData.append('birthDay', values.birthDay)
      formData.append('identityCode', values.identityCode)
      formData.append('email', values.email)
      formData.append('cellPhone', values.cellPhone)
      if (values.address) formData.append('address', values.address)
      if (values.bankName) formData.append('bankName', values.bankName)
      if (values.bankAccountName) formData.append('bankAccountName', values.bankAccountName)
      if (values.bankAccountNumber) formData.append('bankAccountNumber', values.bankAccountNumber)

      if (values.bankQRCodeFile) {
        formData.append('bankQRCode', {
          uri: values.bankQRCodeFile.uri,
          name: values.bankQRCodeFile.name,
          type: values.bankQRCodeFile.type
        } as any)
      } else if (values.bankQRCode) {
        formData.append('bankQRCode', values.bankQRCode)
      }

      await updateProfileMutation.mutateAsync(formData)
      onSuccess?.()
    } catch (error: any) {
      if (error.fieldErrors) {
        setFormikFieldErrors(setFieldError, error.fieldErrors)
      } else {
        handleUpdateProfileFormErrors(error, setFieldError)
      }
    }
  }

  return (
    <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Formik
        initialValues={initialValues}
        validationSchema={editProfileSchema}
        validateOnBlur={false}
        validateOnChange={false}
        enableReinitialize
        onSubmit={(values, { setFieldError }) => handleSubmit(values, setFieldError)}
      >
        {({ handleChange, handleBlur, handleSubmit, setTouched, setFieldValue, values, errors, touched, dirty }) => (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 100
            }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Personal Information Section */}
            <CollapsibleSection title='Thông tin cá nhân' icon='person-outline' defaultExpanded={false}>
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
                value={values.fullName}
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                error={errors.fullName}
                touched={touched.fullName}
                required
                placeholder='Nhập họ và tên'
              />

              {/* Gender */}
              <FormSelectField
                label='Giới tính'
                value={values.genderID}
                options={GENDER_OPTIONS}
                onChange={(value) => {
                  setFieldValue('genderID', Number(value))
                  setTouched({ ...touched, genderID: true })
                }}
                error={errors.genderID}
                touched={touched.genderID}
                required
                icon='people-outline'
              />

              <FormDatePicker
                label='Ngày sinh'
                value={values.birthDay}
                onChange={(date) => handleChange('birthDay')(date)}
                error={errors.birthDay}
                touched={touched.birthDay}
                required
              />

              <FormTextField
                label='Số CMND/CCCD'
                icon='card-outline'
                value={values.identityCode}
                onChangeText={handleChange('identityCode')}
                onBlur={handleBlur('identityCode')}
                error={errors.identityCode}
                touched={touched.identityCode}
                required
                placeholder='Nhập số CMND/CCCD'
                keyboardType='numeric'
              />
            </CollapsibleSection>

            {/* Contact Information Section */}
            <CollapsibleSection title='Thông tin liên hệ' icon='call-outline' defaultExpanded={false}>
              <FormTextField
                label='Email'
                icon='mail-outline'
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                required
                placeholder='Nhập email'
                keyboardType='email-address'
                autoCapitalize='none'
              />

              <FormTextField
                label='Số điện thoại'
                icon='call-outline'
                value={values.cellPhone}
                onChangeText={handleChange('cellPhone')}
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
                onChangeText={handleChange('address')}
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
            <CollapsibleSection title='Thông tin ngân hàng' icon='card-outline' defaultExpanded={false}>
              <FormTextField
                label='Tên ngân hàng'
                icon='business-outline'
                value={values.bankName}
                onChangeText={handleChange('bankName')}
                onBlur={handleBlur('bankName')}
                error={errors.bankName}
                touched={touched.bankName}
                placeholder='Nhập tên ngân hàng'
              />

              <FormTextField
                label='Tên chủ tài khoản'
                icon='person-outline'
                value={values.bankAccountName}
                onChangeText={handleChange('bankAccountName')}
                onBlur={handleBlur('bankAccountName')}
                error={errors.bankAccountName}
                touched={touched.bankAccountName}
                placeholder='Nhập tên chủ tài khoản'
              />

              <FormTextField
                label='Số tài khoản'
                icon='card-outline'
                value={values.bankAccountNumber}
                onChangeText={handleChange('bankAccountNumber')}
                onBlur={handleBlur('bankAccountNumber')}
                error={errors.bankAccountNumber}
                touched={touched.bankAccountNumber}
                placeholder='Nhập số tài khoản'
                keyboardType='numeric'
              />

              <FormFilePicker
                label='Mã QR Code ngân hàng'
                value={values.bankQRCodeFile}
                onChange={(file) => {
                  setFieldValue('bankQRCodeFile', file)
                  if (file) {
                    setFieldValue('bankQRCode', '')
                  }
                }}
                error={errors.bankQRCode}
                touched={touched.bankQRCode}
                placeholder='Tải lên QR code'
              />
            </CollapsibleSection>

            {/* Save Button */}
            <TouchableOpacity
              onPress={() => {
                setTouched({
                  fullName: true,
                  genderID: true,
                  birthDay: true,
                  identityCode: true,
                  email: true,
                  cellPhone: true,
                  address: true,
                  bankName: true,
                  bankAccountName: true,
                  bankAccountNumber: true,
                  bankQRCode: true
                })
                handleSubmit()
              }}
              disabled={updateProfileMutation.isPending || !dirty}
              activeOpacity={0.9}
              style={{
                opacity: updateProfileMutation.isPending || !dirty ? 0.6 : 1,
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
