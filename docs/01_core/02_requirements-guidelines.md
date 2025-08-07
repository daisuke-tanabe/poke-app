# Requirements Document Creation Guidelines

## Core Principles

### 1. Document the Target State
- Describe ideal functionality and systems, not current implementation status
- Focus on business problem resolution and end-user operational efficiency

### 2. Avoid Implementation Status References
- Exclude expressions such as "implemented," "not implemented," or "planned for implementation"
- Maintain clear separation between requirements and design/development phases

### 3. Prioritize Stakeholder Perspective
- Articulate end-user operational requirements and problem-solving approaches
- Establish clear linkage to business requirements
- Document business scenarios underlying each requirement

## Functional Requirements Classification

### Classification Criteria
Classify based on functional characteristics and importance levels:

#### Core Functions
- Essential functions that form the system's foundation
- Functions that directly realize business requirements
- Examples: User management, data registration/update/deletion

#### Extended Functions
- Functions that complement core capabilities and improve operational efficiency
- Value-added features that provide differentiation
- Examples: Batch processing, advanced search/analytics

#### System Functions
- Functions necessary for system operation and maintenance
- Security and audit capabilities
- Examples: Log management, backup/restore, access control

### Priority Expression Method
Express as "functional priority" rather than implementation sequence:
- **Critical**: Essential for business continuity
- **Important**: Significantly impacts operational efficiency
- **Value-Added**: Enhances convenience and differentiation

## Non-Functional Requirements Management

### Classification and Documentation Policy
- **Performance Requirements**: Response time and processing capacity targets
- **Security Requirements**: Authentication, authorization, and data protection specifications
- **Operations & Maintenance Requirements**: Availability, maintainability, and scalability requirements
- **Interface Requirements**: External system integration specifications

### Ensuring Verifiability
Each requirement must include the following elements:
- Quantitative criteria (numerical values where possible)
- Clear verification and testing methods
- Success and failure determination criteria

## Expressions to Avoid

### Implementation Status Related Expressions
- ❌ "Implemented," "Not implemented," "Planned for implementation"
- ❌ "Current behavior," "Post-modification behavior"
- ❌ "Current state," "Modification requirements"

### Recommended Alternative Expressions
- ✅ "The system shall provide XX functionality"
- ✅ "Users shall be able to perform XX"
- ✅ "The system shall satisfy XX under XX conditions"

## Specific Correction Examples

### Classification Method Improvements
- **Before (NG)**: Classification by "Implemented features" and "Near-term implementation features"
- **After (OK)**: Classification by "Core functions," "Extended functions," and "System functions"

### Requirements Description Improvements
- **Before (NG)**: "Modify the current login function and add two-factor authentication"
- **After (OK)**: "The system shall provide two-factor authentication functionality for user authentication"

## Requirements Granularity and Level Setting

### Appropriate Granularity Guidelines
- **Major Category**: System-wide functional groups (e.g., Customer Management Functions)
- **Medium Category**: Specific business processes (e.g., Customer Information Registration Function)
- **Minor Category**: Individual operations/processes (e.g., Customer Information Input Validation Function)

### Level Setting Criteria
- Maintain appropriate abstraction level that can be detailed in downstream processes (design, development, testing)
- Clarify one responsibility scope per requirement

## Consistency with Related Documents

### Role Definition Clarification
- **Requirements Document**: WHAT (what to achieve)
- **Functional Specifications**: HOW (how to achieve)
- **System Design Document**: WHERE/WHEN (where and when to execute)

### Maintaining Sequence
1. Business requirements confirmation
2. Functional and non-functional requirements definition
3. Deployment to system design and database design

## Quality Checkpoint

### Completeness Verification
- [ ] Are all stakeholder requirements covered?
- [ ] Are all business flow processes covered?
- [ ] Are exception handling and error handling considered?

### Verifiability Confirmation
- [ ] Are all requirements described in testable format?
- [ ] Are success criteria clearly defined?
- [ ] Are acceptance conditions specifically documented?

### Consistency Confirmation
- [ ] Are terminology definitions unified?
- [ ] Are there no contradictions between requirements?
- [ ] Are priority settings logical?
