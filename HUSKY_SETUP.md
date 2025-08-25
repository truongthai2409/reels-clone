# Husky Setup Guide

Dự án này đã được cấu hình với Husky để quản lý Git hooks và đảm bảo chất lượng code.

## Cài đặt

Husky đã được cài đặt và cấu hình sẵn. Các dependencies cần thiết:

```bash
npm install --save-dev husky lint-staged prettier
```

## Cấu hình

### Git Hooks

1. **pre-commit**: Chạy lint-staged để kiểm tra và format code trước khi commit
2. **commit-msg**: Kiểm tra format commit message theo conventional commits
3. **pre-push**: Kiểm tra type và build trước khi push

### Lint-staged

Tự động chạy ESLint và Prettier trên các file được staged:

- `*.{js,jsx,ts,tsx}`: ESLint + Prettier
- `*.{json,css,md}`: Prettier

### Prettier

Cấu hình code style:

- Semi-colons: true
- Single quotes: true
- Tab width: 2 spaces
- Print width: 80 characters
- Trailing comma: es5

## Scripts

```bash
# Lint code
npm run lint

# Fix lint errors
npm run lint:fix

# Format code với Prettier
npm run format

# Kiểm tra format
npm run format:check

# Kiểm tra TypeScript types
npm run type-check

# Build project
npm run build
```

## Conventional Commits

Commit messages phải tuân theo format:

```
<type>(<scope>): <description>
```

### Types:

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật tài liệu
- `style`: Thay đổi format code
- `refactor`: Refactor code
- `perf`: Cải thiện hiệu suất
- `test`: Thêm/sửa test
- `build`: Thay đổi build system
- `ci`: Thay đổi CI/CD
- `chore`: Công việc bảo trì
- `revert`: Revert commit

### Ví dụ:

```bash
git commit -m "feat(auth): add login functionality"
git commit -m "fix(upload): resolve file upload error"
git commit -m "docs(readme): update installation guide"
```

## Workflow

1. **Development**: Code và test locally
2. **Staging**: `git add .` để stage changes
3. **Pre-commit**: Husky tự động chạy lint-staged
4. **Commit**: Nếu pre-commit pass, commit được tạo
5. **Pre-push**: Husky kiểm tra type và build
6. **Push**: Nếu pre-push pass, code được push

## Troubleshooting

### Nếu pre-commit fail:

```bash
npm run lint:fix
npm run format
git add .
git commit -m "style: fix linting issues"
```

### Nếu pre-push fail:

```bash
npm run type-check
npm run build
# Fix errors và thử lại
```

### Reset Husky:

```bash
rm -rf .husky
npm run prepare
```

## Lưu ý

- Luôn chạy `npm run prepare` sau khi clone project
- Đảm bảo code pass tất cả checks trước khi commit
- Sử dụng conventional commits để maintain history rõ ràng
- Prettier sẽ tự động format code khi commit
