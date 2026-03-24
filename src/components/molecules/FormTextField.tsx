import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import React, { forwardRef } from 'react'
import { Text, TextInput, TextInputProps, View } from 'react-native'

interface FormTextFieldProps extends Omit<TextInputProps, 'style' | 'onChangeText' | 'value'> {
  label?: string
  icon?: keyof typeof Ionicons.glyphMap
  error?: string
  touched?: boolean
  required?: boolean
  disabled?: boolean

  value?: string
  onChangeText?: (text: string) => void

  formatDisplay?: (value: string) => string
  parseValue?: (text: string) => string
}

export const FormTextField = forwardRef<TextInput, FormTextFieldProps>(
  (
    {
      label,
      icon,
      error,
      touched,
      required = false,
      disabled = false,
      value = '',
      onChangeText,
      formatDisplay,
      parseValue,
      ...rest
    },
    ref
  ) => {
    const { colors } = useTheme()
    const hasError = touched && error

    /* ================= FORMAT ================= */
    const displayValue = formatDisplay ? formatDisplay(value) : value

    const handleChange = (text: string) => {
      let finalValue = text

      if (parseValue) {
        finalValue = parseValue(text)
      }

      onChangeText?.(finalValue)
    }

    return (
      <View className='mb-4'>
        {/* LABEL */}
        {label && (
          <View className='flex-row items-center mb-2'>
            {icon && (
              <Ionicons
                name={icon}
                size={16}
                color={hasError ? colors.error || '#ef4444' : colors.textSecondary}
                style={{ marginRight: 6 }}
              />
            )}
            <Text className='text-sm font-semibold' style={{ color: colors.text }}>
              {label}
              {required && <Text style={{ color: colors.error || '#ef4444' }}> *</Text>}
            </Text>
          </View>
        )}

        {/* INPUT */}
        <View
          className='rounded-xl px-4 py-3.5'
          style={{
            backgroundColor: disabled ? colors.surface : colors.card,
            borderWidth: 2,
            borderColor: hasError ? colors.error || '#ef4444' : colors.border,
            opacity: disabled ? 0.6 : 1,
            shadowColor: hasError ? colors.error || '#ef4444' : 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: hasError ? 2 : 0
          }}
        >
          <TextInput
            ref={ref} // 🔥 FIX CHÍNH
            {...rest}
            value={displayValue}
            onChangeText={handleChange}
            editable={!disabled}
            placeholderTextColor={colors.textTertiary}
            style={{
              color: colors.text,
              fontSize: 15,
              fontWeight: '500',
              padding: 0,
              margin: 0
            }}
          />
        </View>

        {/* ERROR */}
        {hasError && (
          <View className='flex-row items-center mt-1.5 ml-1'>
            <Ionicons name='alert-circle' size={14} color={colors.error || '#ef4444'} />
            <Text className='text-xs ml-1.5' style={{ color: colors.error || '#ef4444' }}>
              {error}
            </Text>
          </View>
        )}
      </View>
    )
  }
)

FormTextField.displayName = 'FormTextField'

// import { useTheme } from '@/shared/hooks/useTheme'
// import { Ionicons } from '@expo/vector-icons'
// import React from 'react'
// import { Text, TextInput, TextInputProps, View } from 'react-native'

// interface FormTextFieldProps extends Omit<TextInputProps, 'style' | 'onChangeText' | 'value'> {
//   label?: string
//   icon?: keyof typeof Ionicons.glyphMap
//   error?: string
//   touched?: boolean
//   required?: boolean
//   disabled?: boolean

//   value?: string
//   onChangeText?: (text: string) => void

//   /** 👉 format hiển thị */
//   formatDisplay?: (value: string) => string

//   /** 👉 parse value trước khi trả ra */
//   parseValue?: (text: string) => string
// }

// export function FormTextField({
//   label,
//   icon,
//   error,
//   touched,
//   required = false,
//   disabled = false,
//   value = '',
//   onChangeText,

//   formatDisplay,
//   parseValue,

//   ...rest
// }: FormTextFieldProps) {
//   const { colors } = useTheme()
//   const hasError = touched && error

//   /* ================= FORMAT ================= */
//   const displayValue = formatDisplay ? formatDisplay(value) : value

//   const handleChange = (text: string) => {
//     let finalValue = text

//     if (parseValue) {
//       finalValue = parseValue(text)
//     }

//     onChangeText?.(finalValue)
//   }

//   return (
//     <View className='mb-4'>
//       {/* LABEL */}
//       {label && (
//         <View className='flex-row items-center mb-2'>
//           {icon && (
//             <Ionicons
//               name={icon}
//               size={16}
//               color={hasError ? colors.error || '#ef4444' : colors.textSecondary}
//               style={{ marginRight: 6 }}
//             />
//           )}
//           <Text className='text-sm font-semibold' style={{ color: colors.text }}>
//             {label}
//             {required && <Text style={{ color: colors.error || '#ef4444' }}> *</Text>}
//           </Text>
//         </View>
//       )}

//       {/* INPUT */}
//       <View
//         className='rounded-xl px-4 py-3.5'
//         style={{
//           backgroundColor: disabled ? colors.surface : colors.card,
//           borderWidth: 2,
//           borderColor: hasError ? colors.error || '#ef4444' : colors.border,
//           opacity: disabled ? 0.6 : 1,
//           shadowColor: hasError ? colors.error || '#ef4444' : 'transparent',
//           shadowOffset: { width: 0, height: 0 },
//           shadowOpacity: 0.1,
//           shadowRadius: 4,
//           elevation: hasError ? 2 : 0
//         }}
//       >
//         <TextInput
//           {...rest}
//           value={displayValue}
//           onChangeText={handleChange}
//           editable={!disabled}
//           placeholderTextColor={colors.textTertiary}
//           style={{
//             color: colors.text,
//             fontSize: 15,
//             fontWeight: '500',
//             padding: 0,
//             margin: 0
//           }}
//         />
//       </View>

//       {/* ERROR */}
//       {hasError && (
//         <View className='flex-row items-center mt-1.5 ml-1'>
//           <Ionicons name='alert-circle' size={14} color={colors.error || '#ef4444'} />
//           <Text className='text-xs ml-1.5' style={{ color: colors.error || '#ef4444' }}>
//             {error}
//           </Text>
//         </View>
//       )}
//     </View>
//   )
// }

// // import { useTheme } from '@/shared/hooks/useTheme'
// // import { Ionicons } from '@expo/vector-icons'
// // import React from 'react'
// // import { Text, TextInput, TextInputProps, View } from 'react-native'

// // interface FormTextFieldProps extends Omit<TextInputProps, 'style'> {
// //   label?: string
// //   icon?: keyof typeof Ionicons.glyphMap
// //   error?: string
// //   touched?: boolean
// //   required?: boolean
// //   disabled?: boolean
// // }

// // export function FormTextField({
// //   label,
// //   icon,
// //   error,
// //   touched,
// //   required = false,
// //   disabled = false,
// //   ...textInputProps
// // }: FormTextFieldProps) {
// //   const { colors } = useTheme()
// //   const hasError = touched && error

// //   return (
// //     <View className='mb-4'>
// //       {label && (
// //         <View className='flex-row items-center mb-2'>
// //           {icon && (
// //             <Ionicons
// //               name={icon}
// //               size={16}
// //               color={hasError ? colors.error || '#ef4444' : colors.textSecondary}
// //               style={{ marginRight: 6 }}
// //             />
// //           )}
// //           <Text className='text-sm font-semibold' style={{ color: colors.text }}>
// //             {label}
// //             {required && <Text style={{ color: colors.error || '#ef4444' }}> *</Text>}
// //           </Text>
// //         </View>
// //       )}

// //       <View
// //         className='rounded-xl px-4 py-3.5'
// //         style={{
// //           backgroundColor: disabled ? colors.surface : colors.card,
// //           borderWidth: 2,
// //           borderColor: hasError ? colors.error || '#ef4444' : colors.border,
// //           opacity: disabled ? 0.6 : 1,
// //           shadowColor: hasError ? colors.error || '#ef4444' : 'transparent',
// //           shadowOffset: { width: 0, height: 0 },
// //           shadowOpacity: 0.1,
// //           shadowRadius: 4,
// //           elevation: hasError ? 2 : 0
// //         }}
// //       >
// //         <TextInput
// //           {...textInputProps}
// //           editable={!disabled}
// //           placeholderTextColor={colors.textTertiary}
// //           style={{
// //             color: colors.text,
// //             fontSize: 15,
// //             fontWeight: '500',
// //             padding: 0,
// //             margin: 0
// //           }}
// //         />
// //       </View>

// //       {hasError && (
// //         <View className='flex-row items-center mt-1.5 ml-1'>
// //           <Ionicons name='alert-circle' size={14} color={colors.error || '#ef4444'} />
// //           <Text className='text-xs ml-1.5' style={{ color: colors.error || '#ef4444' }}>
// //             {error}
// //           </Text>
// //         </View>
// //       )}
// //     </View>
// //   )
// // }
