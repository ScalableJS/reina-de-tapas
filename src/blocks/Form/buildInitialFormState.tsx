import type { FormFieldBlock } from '@payloadcms/plugin-form-builder/types'

export const buildInitialFormState = (fields: FormFieldBlock[]) => {
  return fields?.reduce<Record<string, unknown>>((initialSchema, field) => {
    if (field.blockType === 'checkbox') {
      return {
        ...initialSchema,
        [field.name]: field.defaultValue ?? false,
      }
    }

    if (
      field.blockType === 'country' ||
      field.blockType === 'email' ||
      field.blockType === 'text' ||
      field.blockType === 'select' ||
      field.blockType === 'state'
    ) {
      return {
        ...initialSchema,
        [field.name]: '',
      }
    }

    return initialSchema // обязательно возвращаем, если блок не подходит
  }, {})
}
