# Development Tasks and Requirements

## BEFORE YOU BEGIN

1. **Use Context7 MCP Server**: For every task, look through the context7 mcp server for documentation to accurately build files. While you go through the file, check if it matches the documentations from context7.

2. **Documentation Check**: Look through the documentation folder to get any necessary documentation. Use context7 to get the documentation or request me the needed documentation. I will provide you link or texts.

3. **Create TODO**: Create a todo for each task.

4. **Read Rules**: Read through `.cursor/rules`

## MAIN TASKS

### Task 1: Setup OAuth button functionality with betterauth

- **Objective**: Update the OAuthButtons component

- **Requirements**: Read through the betterauth docs and the nextjs docs.

## CONDITIONAL CHECKS

_(Only perform these checks if you edit the respective file types)_

### FRONTEND CHECKS

**Do these checks ONLY IF you edited frontend files:**

- **Component Optimization**: Go through all files created and optimize them
- **Server/Client Side Split**: If components can be split more into server side and client side, do it. Don't have unnecessary client side components
- **useEffect Prohibition**: Don't use useEffect at all. There are always better alternatives. Go through files to check for useEffect usage. Keep only if really necessary
- **Compliance Check**: Check through all files to ensure compliance with requests
- **Error Detection**: Look for runtime errors. **ALWAYS DOUBLE CHECK FILES AFTER CREATION**
- **Cleanup**: Remove unused components and imports

### BACKEND CHECKS

**Do these checks ONLY IF you edited backend files:**

- **Local Testing**: Test locally to see if it works in development
- **Production Configuration**: Check if implementation is configured for production
- **Comprehensive Review**: Go through all created files for errors
- **File Cleanup**: Remove unnecessary, redundant, and unused files
- **Code Structure**: Clean up code structure if possible
- **Codescence Compliance**: Check if code written is compliant with codescence checks
- **Git Configuration**: Update `.gitignore` if necessary
- **Environment Security**: Check if any env files are exposed
- **Problem Resolution**: Look through problems tab for existing issues

## DOCUMENTATION (BOTH FRONTEND & BACKEND)

### Documentation Requirements:

- Create comprehensive documentation for implemented features in the `documentation` folder
- Update existing documentation as needed
- Remove unnecessary documentation or simplify/merge existing ones where it makes sense
- Focus on **library implementations** - document HOW you implemented them
- Create complete implementation summaries in markdown files (like `docker.md`)
- Use all documentation in root folder combined with your knowledge
- **Goal**: Complete technical documentation, not chat summaries

### Documentation Structure:

```
documentation/
├── [feature-name].md
├── docker.md
└── [other-implementation-docs].md
```

## QUALITY ASSURANCE CHECKLIST

### Pre-Implementation

- [ ] Read context7 documentation
- [ ] Review existing documentation folder
- [ ] Create task todos
- [ ] Read `.cursor/rules`

### Post-Implementation

- [ ] Run appropriate checks (Frontend/Backend)
- [ ] Test functionality
- [ ] Review for errors and compliance
- [ ] Clean up code and files
- [ ] Create/update documentation
- [ ] Verify security (env files, etc.)

## PRIORITY ORDER

1. Documentation review and setup
2. Main task implementation
3. Quality checks and testing
4. Documentation creation/updates
5. Final cleanup and optimization
