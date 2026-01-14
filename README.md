# Giới thiệu

**milktea_mobile** là ứng dụng mobile xây bằng **Expo + React Native**, dùng:

- **Expo Router** cho file-based routing trong thư mục `src/app`
- **TypeScript**
- **NativeWind + TailwindCSS** cho styling
- **React Query**, **Axios**, **Zustand** cho state management và gọi API (dùng cho các feature như `auth`)

Repo đã được refactor lại cấu trúc component theo hướng **Atomic Design** để sau này scale dự án dễ hơn.

---

## Tech stack chính

- **Runtime / Framework**
  - Expo `~54`
  - React Native `0.81`
  - Expo Router `~6`
- **UI & styling**
  - NativeWind + TailwindCSS
  - Expo Icons, Symbols
  - Dark / Light theme với các hook `use-color-scheme`, `use-theme-color`
- **State & data**
  - React Query
  - Zustand
  - Axios

---

## Cấu trúc thư mục

Tree tổng quát:

```text
├── 📁 app
│   ├── 📁 (tabs)
├── 📁 components
│   ├── 📁 atoms
│   ├── 📁 layouts
│   ├── 📁 molecules
│   └── 📁 organisms
├── 📁 features
│   └── 📁 auth
│       ├── 📁 apis
│       ├── 📁 components
│       ├── 📁 hooks
│       └── 📁 types
└── 📁 shared
    ├── 📁 constants
    ├── 📁 hooks
    ├── 📁 scripts
    ├── 📁 types
    └── 📁 utils
```

- **`src/app`**: nơi khai báo route / màn hình chính bằng Expo Router.
- **`src/components`**: thư viện UI dùng lại chung (Atomic Design):
  - `atoms/`: các phần tử UI đơn lẻ (text, view theo theme, icon, animation nhỏ, …)
  - `molecules/`: các block UI ghép từ nhiều atom (card nhỏ, collapsible, link có style, haptic tab, …)
  - `layouts/`: component dùng để bố cục màn hình (parallax scroll, screen container, …)
  - `organisms/`: dành cho các khối UI lớn/phức tạp (sẽ dùng khi app lớn hơn).
- **`src/features`**: code theo từng nghiệp vụ (ví dụ: `auth`, `order`, `product`, …):
  - `apis/`: hàm gọi API riêng cho feature đó
  - `components/`: UI gắn chặt với feature (không dùng chung toàn app)
  - `hooks/`: hook logic cho feature (ví dụ `useLogin`)
  - `types/`: type/interface liên quan đến dữ liệu của feature.
- **`src/shared`**: mọi thứ dùng chung cho nhiều feature:
  - `constants/`: config, theme, giá trị cố định dùng chung (ví dụ: `theme.ts` chứa màu sắc, fonts)
  - `hooks/`: hook dùng lại nhiều nơi (ví dụ: `use-color-scheme`, `use-theme-color` để xử lý dark/light mode)
  - `scripts/`: script utility (ví dụ: `reset-project.js` để reset project về trạng thái ban đầu)
  - `types/`: type/interface dùng chung cho nhiều feature
  - `utils/`: helper function, utility function dùng chung (format date, validate, …).

---

## Cài đặt & chạy dự án

### 1. Cài đặt

Repo đang dùng **pnpm** (có `pnpm-lock.yaml`), nhưng bạn có thể dùng npm/yarn nếu muốn.

**Khuyến nghị (pnpm):**

```bash
pnpm install
```

Hoặc:

```bash
npm install
# hoặc
yarn install
```

### 2. Chạy app

- Chạy dev server chung:

```bash
pnpm dev
# hoặc
npm run dev
```

- Mở nhanh từng platform:

```bash
pnpm android   # Mở Android emulator / device
pnpm ios       # Mở iOS simulator (macOS)
pnpm web       # Chạy phiên bản web
```

### 3. Lint

```bash
pnpm lint
# hoặc
npm run lint
```

### 4. Reset về project trống (script mặc định của Expo)

```bash
pnpm reset-project
# hoặc
npm run reset-project
```

Lệnh này sẽ di chuyển code starter hiện tại sang thư mục `app-example` và tạo mới thư mục `app` trống.

---

## Quy ước khi thêm code mới

- **Component UI dùng lại chung**:
  - UI nhỏ, đơn (button, text wrapper, icon, badge, …) → đặt trong `src/components/atoms`
  - Kết hợp 2–3 atom thành một block (card, form nhỏ, row có icon + text, …) → `src/components/molecules`
  - Layout wrapper (screen container, scroll layout, v.v.) → `src/components/layouts`
  - Block UI lớn (header, footer, section phức tạp của màn hình) → `src/components/organisms`

- **Theo feature**:
  - Logic / API / UI dính chặt vào một nghiệp vụ (vd: Auth, Order, Product, …) thì để trong `src/features/<feature-name>/...`
  - Chỉ những gì thực sự dùng chung nhiều feature mới đưa vào `src/shared`

---
