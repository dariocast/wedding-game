# General Development Rules for Cursor AI

## 🎯 **CORE PRINCIPLES**

### 1. **Build-First Mentality**
- **ALWAYS** run build commands before commits
- Never push code that fails to compile
- Fix all TypeScript errors and critical ESLint warnings
- Verify deployment readiness before any push

### 2. **Concise Expert Communication**
- Treat users as **technical experts**
- Provide **direct, actionable solutions**
- Avoid unnecessary explanations or filler language
- Focus on **what to do** rather than **why it might work**

### 3. **Parallel Tool Execution**
- **Maximize parallel tool calls** whenever possible
- Execute multiple read operations simultaneously
- Batch information gathering before making decisions
- Only use sequential calls when output of A is required for input of B

## 🏗️ **ARCHITECTURE PATTERNS**

### 4. **Modern Framework Standards**
- Use **latest stable versions** of frameworks
- Follow **official best practices** and patterns
- Implement **type safety** throughout the codebase
- Choose **battle-tested libraries** over experimental ones

### 5. **API Design Consistency**
- **RESTful endpoints** with proper HTTP methods
- **Consistent error handling** across all routes
- **Input validation** on both client and server
- **Structured response formats** with proper status codes

### 6. **Database Best Practices**
- Use **ORM/Query builders** for type safety
- Implement **proper indexing** for performance
- **Validate constraints** at database level
- **Handle migrations** systematically

## 🎨 **UI/UX STANDARDS**

### 7. **Design System Approach**
- Create **reusable component libraries**
- Maintain **consistent color palettes**
- Implement **responsive design** from the start
- Use **semantic HTML** for accessibility

### 8. **Performance-First UI**
- **Lazy load** non-critical components
- **Optimize images** and media automatically
- **Minimize bundle sizes** with code splitting
- **Cache static assets** aggressively

### 9. **Accessibility by Default**
- **Keyboard navigation** for all interactive elements
- **Screen reader compatibility** with proper ARIA labels
- **Color contrast** meeting WCAG standards
- **Focus management** in modals and dynamic content

## 🔧 **DEVELOPMENT WORKFLOW**

### 10. **Error Handling Strategy**
- **Graceful degradation** for all failure modes
- **User-friendly error messages** in appropriate language
- **Logging and monitoring** for debugging
- **Fallback content** for missing data

### 11. **State Management**
- Use **appropriate state solutions** for complexity level
- **Minimize state** and prefer derived values
- **Optimize re-renders** with proper dependencies
- **Handle loading and error states** consistently

### 12. **Security First**
- **Validate all inputs** on server side
- **Sanitize user content** before display
- **Use environment variables** for sensitive config
- **Implement proper authentication** and authorization

## 📱 **RESPONSIVE DESIGN**

### 13. **Mobile-First Development**
- Start with **mobile layouts** and scale up
- Use **touch-friendly** interaction targets (min 44px)
- **Test on real devices** not just browser dev tools
- **Optimize for slow networks** and limited bandwidth

### 14. **Cross-Browser Compatibility**
- Test on **major browsers** (Chrome, Firefox, Safari, Edge)
- Use **progressive enhancement** for advanced features
- **Polyfill** only when necessary
- **Graceful fallbacks** for unsupported features

## 🚀 **DEPLOYMENT & MAINTENANCE**

### 15. **CI/CD Best Practices**
- **Automated testing** in pipeline
- **Environment parity** between dev/staging/prod
- **Rollback strategies** for failed deployments
- **Health checks** and monitoring

### 16. **Performance Monitoring**
- **Core Web Vitals** tracking
- **Error rate monitoring** with alerts
- **Database query optimization**
- **CDN and caching** strategies

### 17. **Documentation Standards**
- **README files** with clear setup instructions
- **API documentation** for all endpoints
- **Code comments** for complex business logic
- **Change logs** for version tracking

## 🔍 **DEBUGGING METHODOLOGY**

### 18. **Systematic Problem Solving**
- **Reproduce issues** consistently
- **Isolate variables** to find root cause
- **Check logs** at multiple levels (client, server, database)
- **Use debugging tools** effectively (browser dev tools, profilers)

### 19. **Performance Debugging**
- **Profile before optimizing** to identify bottlenecks
- **Measure impact** of performance changes
- **Monitor memory usage** and prevent leaks
- **Optimize critical rendering path**

## 📚 **CODE QUALITY**

### 20. **Clean Code Principles**
- **Meaningful variable names** that explain intent
- **Small, focused functions** with single responsibility
- **Consistent formatting** with automated tools
- **Remove dead code** and unused imports

### 21. **Testing Strategy**
- **Unit tests** for business logic
- **Integration tests** for API endpoints
- **E2E tests** for critical user flows
- **Manual testing** for UX validation

### 22. **Version Control**
- **Atomic commits** with descriptive messages
- **Feature branches** for non-trivial changes
- **Code reviews** before merging
- **Semantic versioning** for releases

## 🎯 **PROJECT ORGANIZATION**

### 23. **File Structure**
- **Logical grouping** by feature or domain
- **Consistent naming conventions**
- **Separate concerns** (components, utils, types, etc.)
- **Easy navigation** with clear hierarchies

### 24. **Dependency Management**
- **Lock file commits** for reproducible builds
- **Regular updates** with testing
- **Minimal dependencies** - avoid bloat
- **Security audits** for vulnerabilities

## 🔄 **CONTINUOUS IMPROVEMENT**

### 25. **Technical Debt Management**
- **Regular refactoring** sessions
- **Document known issues** and improvement opportunities
- **Prioritize fixes** based on impact and effort
- **Measure and track** code quality metrics

### 26. **Learning and Adaptation**
- **Stay updated** with framework changes
- **Experiment with new tools** in non-critical areas
- **Share knowledge** through documentation
- **Learn from production issues**

---

## 📋 **UNIVERSAL PRE-COMMIT CHECKLIST**

Before any commit:

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] No critical linting warnings
- [ ] Code formatted consistently
- [ ] No sensitive data in commit
- [ ] Commit message is descriptive
- [ ] Related documentation updated
- [ ] Performance impact considered

---

## 🛠️ **COMMON TOOL CONFIGURATIONS**

### TypeScript Config Essentials:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint Must-Have Rules:
```json
{
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Git Commit Message Format:
```
type(scope): description

✨ feat: add new feature
🐛 fix: resolve bug
📚 docs: update documentation  
🎨 style: improve UI/UX
♻️ refactor: restructure code
⚡ perf: optimize performance
✅ test: add/update tests
🔧 chore: maintenance tasks
```

---

**These rules ensure consistent, high-quality development practices across all projects. Adapt specific implementation details to match project requirements while maintaining these core principles.**
