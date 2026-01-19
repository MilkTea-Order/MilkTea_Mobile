// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*']
  },
  {
    rules: {
      // Khai báo rule cho prettier/prettier để eslint dùng để check
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always', // Luôn thêm ngoặc đơn cho tham số arrow function
          semi: false, // Không dùng dấu chấm phẩy ở cuối dòng
          trailingComma: 'none', // Không thêm dấu phẩy cuối cùng trong object/array
          tabWidth: 2, // Mỗi tab = 2 khoảng trắng
          endOfLine: 'auto', // Xuống dòng tự động theo hệ điều hành
          useTabs: false, // Dùng space thay vì tab
          singleQuote: true, // Dùng nháy đơn thay cho nháy kép
          printWidth: 120, // Giới hạn 120 ký tự mỗi dòng
          jsxSingleQuote: true // Trong JSX cũng dùng nháy đơn
        }
      ]
    }
  }
])
