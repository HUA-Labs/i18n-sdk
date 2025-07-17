# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-27

### 🎉 Major Release - Production Ready

This is the first stable release of hua-i18n-sdk, marking the transition from beta to production-ready status. This release includes comprehensive features for enterprise-level internationalization with full SSR/CSR support.

### Added

- **Complete SSR/CSR Support**: Full server-side rendering compatibility with Next.js App Router
- **Type-Safe Translation System**: End-to-end TypeScript support with autocomplete
- **Comprehensive Example Project**: Complete Next.js demo with all features
- **Enterprise-Grade Documentation**: API Reference, usage guides, and best practices
- **Advanced Fallback System**: Intelligent fallback chain (ko → en → [MISSING])
- **Performance Optimizations**: Memoization, lazy loading, and bundle optimization
- **Developer Experience**: Debug tools, error handling, and development utilities

### Changed

- **Stable API**: All public APIs are now stable and backward compatible
- **Enhanced Type Safety**: Improved TypeScript definitions and generic support
- **Better Error Handling**: Comprehensive error messages and recovery mechanisms
- **Optimized Bundle Size**: Reduced package size with tree-shaking support
- **Professional Documentation**: Clean, comprehensive docs with code examples

### Fixed

- **Hydration Issues**: Resolved SSR/CSR hydration mismatches
- **TypeScript Compatibility**: Fixed all type safety issues
- **Memory Leaks**: Optimized memory usage and cleanup
- **Performance Bottlenecks**: Improved rendering performance

### Migration Guide

This release is fully backward compatible with 0.4.0. No breaking changes were introduced.

---

## [0.4.0] - 2025-07-17

### Added

- **SSR Support**: `ssrTranslate` function for server-side rendering without hydration issues
- **Server Component Support**: Direct translation in Next.js App Router server components
- **SEO-friendly Translations**: Server-side meta tag and title translations
- **Language Detection**: Server-side language detection from Accept-Language headers
- **Fallback Chain**: Improved fallback logic (ko → en → MISSING]) for SSR
- **Enhanced Documentation**: Comprehensive README with SSR/CSR usage examples
- **Developer Experience**: Better error messages and debugging tools

### Changed

- **Enhanced Type Safety**: Better TypeScript support for SSR translations
- **Improved Documentation**: Added comprehensive SSR usage examples
- **Better Error Handling**: More user-friendly missing translation messages
- **README Structure**: Added summary section and improved organization

## [0.3.2] - 2025-07-16

### Changed

- Package name changed from @hua-i18n-sdk to hua-i18n-sdk for public npm publishing
- Updated all documentation and examples to use hua-i18n-sdk

## [0.3.1] - 2025-07-16

### Added

- README 상단에 hua API 스타일 최적화, 공식 유지보수 아님, 환경별 import 주의 안내
- Next.js, Vite, Webpack 환경별 번역 파일 import 예시
- Storybook/예제 프로젝트 TODO

## [0.3.0] - 2025-07-16

### Added

- **Debug Page**: Complete UI for debugging translations (`I18nDebugPage`)
- **Enhanced Type Safety**: Better TypeScript support with `createTranslationKey` helper
- **Improved Fallback Chain**: `ko → en → [MISSING]` flow for global services
- **Translation Key Autocomplete**: IDE support for translation keys
- **Real-time Debug Info**: Live monitoring of translation system status

### Changed

- **Default Fallback Language**: Changed from Korean to English for global services
- **Enhanced Error Handling**: Better error reporting and recovery
- **Improved Performance**: Memoization and optimized re-renders
- **Better Documentation**: Updated README with new features and best practices

### Fixed

- **TypeScript Errors**: Fixed generic type issues and symbol conversion warnings
- **Missing Translation Detection**: Better handling of missing translation keys

## [0.2.0] - 2025-07-16

### Added

- **Simple API**: hua-api style translation function `t('namespace.key')`
- **Pre-loading**: All translations loaded on initialization
- **Fallback support**: Automatic fallback to default language
- **Parameter interpolation**: `tWithParams()` for dynamic content
- **Debug tools**: Development utilities for troubleshooting
- **Type safety**: Full TypeScript support

### Changed

- **Simplified usage**: No more `useAutoLoadNamespace` or complex setup
- **Performance optimization**: Cached translations with memory efficiency
- **Better error handling**: Graceful fallbacks and error reporting

### Removed

- **Complex async translation**: Replaced with simple sync function
- **Manual namespace loading**: Automatic loading on initialization
- **Zustand dependency**: Using React Context for state management

## [0.1.0] - 2025-07-15

### Added

- Initial release with complex async translation system
- Namespace management
- Zustand-based state management
- Basic translation functionality

### Known Issues

- Complex API that was difficult for developers to use
- Performance issues with async loading
- Hydration errors in Next.js
