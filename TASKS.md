# Development Tasks and Requirements

## BEFORE YOU BEGIN

1. **Use Context7 MCP Server**: For every task, look through the context7 mcp server for documentation to accurately build files. While you go through the file, check if it matches the documentations from context7.

2. **Documentation Check**: Look through the documentation folder to get any necessary documentation. Use context7 to get the documentation or request me the needed documentation. I will provide you link or texts.

3. **Create TODO**: Create a todo for each task.

4. **Read Rules**: Read through `.cursor/rules`

## MAIN TASKS

### Task 1: Auth.ts fix

- **Objective**: Large Method
  The definition is simple: the function exceeds the threshold for excessive function length.

Solution
Overly long functions make the code harder to read, but we recommend being careful here - just splitting long functions doesn't necessarily make the code easier to read. Instead, look for natural chunks inside the functions that expresses a specific task or concern. Often, such concerns are indicated by a Code Comment followed by an if-statement. Use the EXTRACT FUNCTION refactoring to encapsulate that concern.

Complex Method
A complex method is a function with a high cyclomatic complexity. Cyclomatic complexity counts the number of logical paths through a function. That is, each if-statement, each control structure like a for or while loop adds complexity. We count them and sum it up to get a complexity value.

It's somewhat of a crude metric, because whether or not the function is difficult to understand may depend on other factor as well, such as how deeply nested the code is.

Solution
The solution heavily depends on specifics of the function. Sometimes when the cyclomatic complexity gets too high, another design approach is beneficial such as

modeling state using an explicit state machine rather than conditionals, or
using table lookup rather than long chains of logic.
In other scenarios, the function can be split using EXTRACT FUNCTION. Just make sure you extract natural and cohesive functions. Complex Methods can also be addressed by identifying complex conditional expressions and then using the DECOMPOSE CONDITIONAL refactoring.

- **Requirements**: Read through the codescene docs

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
