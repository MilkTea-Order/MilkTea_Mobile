import { FormDatePicker } from '@/components/molecules/FormDatePicker'
import { FormSelectField } from '@/components/molecules/FormSelectField'
import { FormTextField } from '@/components/molecules/FormTextField'
import { useAddFinanceTransaction } from '@/features/report/hooks/useReport'
import schema, { FinanceSchema } from '@/features/report/schema/finance.schema'
import { AddFinanceTransactionPayload, FinanceGroupReport } from '@/features/report/types/finance.type'
import { User } from '@/features/user/types/user.type'
import { useTheme } from '@/shared/hooks/useTheme'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { Formik } from 'formik'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

interface Props {
  visible: boolean
  onClose: () => void
  groups: FinanceGroupReport[]
  users: User[]
}

export function CreateExpenseModal({ visible, onClose, groups, users }: Props) {
  const { colors } = useTheme()

  /* ================= REFS ================= */
  const scrollRef = useRef<ScrollView>(null)
  const nameRef = useRef<any>(null)
  const amountRef = useRef<any>(null)
  const noteRef = useRef<any>(null)

  /* ================= ANIMATION ================= */
  const overlayOpacity = useRef(new Animated.Value(0)).current
  const cardTranslateY = useRef(new Animated.Value(100)).current

  useEffect(() => {
    if (!visible) return

    overlayOpacity.setValue(0)
    cardTranslateY.setValue(100)

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }),
      Animated.timing(cardTranslateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      })
    ]).start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  /* ================= OPTIONS ================= */
  const groupOptions = useMemo(() => {
    return groups.map((g) => {
      let shortName = g.name

      if (g.name.toLowerCase().includes('thu')) shortName = 'thu'
      if (g.name.toLowerCase().includes('chi')) shortName = 'chi'

      return {
        label: g.name,
        group: shortName,
        value: g.id
      }
    })
  }, [groups])
  const userOptions = useMemo(() => users.map((u) => ({ label: u.fullName, value: u.userId })), [users])

  /* ================= INITIAL ================= */
  const initialValues: FinanceSchema = {
    transactionGroupId: null as any,
    name: '',
    transactionDate: '',
    amount: '' as any,
    transactionBy: null as any,
    note: undefined
  }

  const blurAll = useCallback(() => {
    nameRef.current?.blur?.()
    amountRef.current?.blur?.()
    noteRef.current?.blur?.()
  }, [])

  const handleSubmit = (values: FinanceSchema) => {
    const payload: AddFinanceTransactionPayload = {
      transactionGroupId: values.transactionGroupId,
      name: values.name,
      transactionDate: dayjs(values.transactionDate, 'DD/MM/YYYY').toISOString(),
      transactionBy: values.transactionBy,
      amount: Number(values.amount),
      note: values.note
    }
    createFinanceTransactionMutation.mutate(payload)
    onClose()
  }
  const createFinanceTransactionMutation = useAddFinanceTransaction()
  return (
    <Modal visible={visible} transparent animationType='none' onRequestClose={onClose}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {/* Overlay */}
          <Pressable onPress={onClose} style={{ position: 'absolute', inset: 0 }}>
            <Animated.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', opacity: overlayOpacity }} />
          </Pressable>

          {/* CARD */}
          <Animated.View
            style={{
              backgroundColor: colors.card,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              maxHeight: '85%',
              transform: [{ translateY: cardTranslateY }]
            }}
          >
            {/* HEADER */}
            <View className='flex-row justify-between items-center px-5 py-4'>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name='close' size={24} color={colors.textSecondary} />
              </TouchableOpacity>

              <Text className='text-lg font-bold' style={{ color: colors.text }}>
                Tạo thu chi
              </Text>

              <View style={{ width: 24 }} />
            </View>

            <Formik
              initialValues={initialValues}
              validationSchema={schema}
              validateOnBlur
              validateOnChange={false}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                setFieldTouched,
                isValid,
                dirty
              }) => (
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                  <ScrollView
                    ref={scrollRef}
                    keyboardShouldPersistTaps='handled'
                    keyboardDismissMode='on-drag'
                    contentContainerStyle={{ padding: 20 }}
                  >
                    {/* GROUP */}
                    <FormSelectField
                      label='Nhóm'
                      placeholder='Chọn nhóm'
                      required
                      onPress={blurAll}
                      value={values.transactionGroupId ?? ''}
                      options={groupOptions}
                      onChange={(v) => setFieldValue('transactionGroupId', v, true)}
                      error={errors.transactionGroupId}
                      touched={touched.transactionGroupId}
                    />

                    {/* NAME */}
                    <FormTextField
                      ref={nameRef}
                      label={
                        'Nội dung ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      required
                      value={values.name}
                      onChangeText={(text) => setFieldValue('name', text, true)}
                      onBlur={handleBlur('name')}
                      returnKeyType='next'
                      placeholder={
                        'Nhập nội dung ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      onSubmitEditing={() => amountRef.current?.focus()}
                      error={errors.name}
                      touched={touched.name}
                    />

                    {/* DATE */}
                    <FormDatePicker
                      label={
                        'Ngày ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      required
                      value={values.transactionDate}
                      onChange={(date) => {
                        setFieldValue('transactionDate', date, true)
                      }}
                      placeholder={
                        'Chọn ngày ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      error={errors.transactionDate}
                      touched={touched.transactionDate}
                    />

                    {/* AMOUNT */}
                    <FormTextField
                      ref={amountRef}
                      // label='Số tiền'
                      label={
                        'Số tiền ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      required
                      value={String(values.amount)}
                      keyboardType='numeric'
                      onChangeText={(text) => {
                        const clean = text.replace(/[^0-9]/g, '')
                        setFieldValue('amount', clean, true)
                      }}
                      placeholder={
                        'Nhập số tiền ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      onBlur={handleBlur('amount')}
                      returnKeyType='next'
                      onSubmitEditing={() => noteRef.current?.focus()}
                      error={errors.amount}
                      touched={touched.amount}
                      formatDisplay={(value) => {
                        if (!value) return ''
                        const num = typeof value === 'string' ? Number(value) : value
                        if (isNaN(num)) return ''
                        return num.toLocaleString('vi-VN')
                      }}
                    />

                    {/* USER */}
                    <FormSelectField
                      label={
                        'Người ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      required
                      value={values.transactionBy ?? ''}
                      onPress={blurAll}
                      options={userOptions}
                      onChange={(v) => {
                        setFieldValue('transactionBy', v, true)
                      }}
                      error={errors.transactionBy}
                      placeholder={
                        'Chọn người ' +
                        (!!values.transactionGroupId
                          ? groupOptions.find((x) => x.value === values.transactionGroupId)?.group
                          : 'thu chi')
                      }
                      touched={touched.transactionBy}
                    />

                    {/* NOTE */}
                    <FormTextField
                      ref={noteRef}
                      label='Ghi chú'
                      placeholder='Nhập ghi chú'
                      value={values.note}
                      onChangeText={(text) => setFieldValue('note', text)}
                      returnKeyType='done'
                    />

                    {/* SUBMIT */}
                    <TouchableOpacity
                      onPress={() => {
                        handleSubmit()

                        // scroll tới lỗi (basic)
                        if (errors.transactionBy) {
                          scrollRef.current?.scrollTo({ y: 400, animated: true })
                        }
                      }}
                      disabled={!isValid || !dirty || createFinanceTransactionMutation.isPending}
                      style={{
                        marginTop: 16,
                        opacity: createFinanceTransactionMutation.isPending || !dirty || !isValid ? 0.7 : 1
                      }}
                    >
                      <View
                        style={{
                          height: 50,
                          backgroundColor: colors.primary,
                          borderRadius: 16,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lưu</Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </KeyboardAvoidingView>
              )}
            </Formik>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  )
}
