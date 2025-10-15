/**
 * Challenge Description Parser Utility
 *
 * This utility extracts structured information from AI-generated challenge descriptions
 * that follow the Timmy agent's markdown format.
 */

/**
 * Extracts the problem overview section from a challenge description
 * @param challengeDescription - The full markdown challenge description
 * @returns The problem overview text or empty string if not found
 */
export function extractProblemOverview(challengeDescription: string): string {
    if (!challengeDescription || typeof challengeDescription !== 'string') {
        return '';
    }

    // Look for "## 1. Problem Overview:" section
    const overviewMatch = challengeDescription.match(/##\s*1\.\s*Problem\s*Overview:\s*\n([\s\S]*?)(?=##\s*2\.|$)/i);

    if (overviewMatch && overviewMatch[1]) {
        return overviewMatch[1].trim();
    }

    // Fallback: look for any "Problem Overview" section
    const fallbackMatch = challengeDescription.match(/##\s*Problem\s*Overview:\s*\n([\s\S]*?)(?=##|$)/i);

    if (fallbackMatch && fallbackMatch[1]) {
        return fallbackMatch[1].trim();
    }

    return '';
}

/**
 * Extracts the problem statement section from a challenge description
 * @param challengeDescription - The full markdown challenge description
 * @returns The problem statement text or empty string if not found
 */
export function extractProblemStatement(challengeDescription: string): string {
    if (!challengeDescription || typeof challengeDescription !== 'string') {
        return '';
    }

    // Look for "## 2. Problem Statement:" section
    const statementMatch = challengeDescription.match(/##\s*2\.\s*Problem\s*Statement:\s*\n([\s\S]*?)(?=##\s*3\.|$)/i);

    if (statementMatch && statementMatch[1]) {
        return statementMatch[1].trim();
    }

    // Fallback: look for any "Problem Statement" section
    const fallbackMatch = challengeDescription.match(/##\s*Problem\s*Statement:\s*\n([\s\S]*?)(?=##|$)/i);

    if (fallbackMatch && fallbackMatch[1]) {
        return fallbackMatch[1].trim();
    }

    return '';
}

/**
 * Extracts the requirements section from a challenge description
 * @param challengeDescription - The full markdown challenge description
 * @returns The requirements text or empty string if not found
 */
export function extractRequirements(challengeDescription: string): string {
    if (!challengeDescription || typeof challengeDescription !== 'string') {
        return '';
    }

    // Look for "## 3. Requirements:" section
    const requirementsMatch = challengeDescription.match(/##\s*3\.\s*Requirements:\s*\n([\s\S]*?)(?=##\s*4\.|$)/i);

    if (requirementsMatch && requirementsMatch[1]) {
        return requirementsMatch[1].trim();
    }

    // Fallback: look for any "Requirements" section
    const fallbackMatch = challengeDescription.match(/##\s*Requirements:\s*\n([\s\S]*?)(?=##|$)/i);

    if (fallbackMatch && fallbackMatch[1]) {
        return fallbackMatch[1].trim();
    }

    return '';
}

/**
 * Extracts the deliverables section from a challenge description
 * @param challengeDescription - The full markdown challenge description
 * @returns The deliverables text or empty string if not found
 */
export function extractDeliverables(challengeDescription: string): string {
    if (!challengeDescription || typeof challengeDescription !== 'string') {
        return '';
    }

    // Look for "## 5. Deliverables:" section
    const deliverablesMatch = challengeDescription.match(/##\s*5\.\s*Deliverables:\s*\n([\s\S]*?)(?=##\s*6\.|$)/i);

    if (deliverablesMatch && deliverablesMatch[1]) {
        return deliverablesMatch[1].trim();
    }

    // Fallback: look for any "Deliverables" section
    const fallbackMatch = challengeDescription.match(/##\s*Deliverables:\s*\n([\s\S]*?)(?=##|$)/i);

    if (fallbackMatch && fallbackMatch[1]) {
        return fallbackMatch[1].trim();
    }

    return '';
}

/**
 * Extracts the evaluation rubric section from a challenge description
 * @param challengeDescription - The full markdown challenge description
 * @returns The evaluation rubric text or empty string if not found
 */
export function extractEvaluationRubric(challengeDescription: string): string {
    if (!challengeDescription || typeof challengeDescription !== 'string') {
        return '';
    }

    // Look for "## 6. Evaluation Rubric:" section
    const rubricMatch = challengeDescription.match(/##\s*6\.\s*Evaluation\s*Rubric:\s*\n([\s\S]*?)(?=##|$)/i);

    if (rubricMatch && rubricMatch[1]) {
        return rubricMatch[1].trim();
    }

    // Fallback: look for any "Evaluation Rubric" section
    const fallbackMatch = challengeDescription.match(/##\s*Evaluation\s*Rubric:\s*\n([\s\S]*?)(?=##|$)/i);

    if (fallbackMatch && fallbackMatch[1]) {
        return fallbackMatch[1].trim();
    }

    return '';
}

/**
 * Maps technology names to their official documentation URLs
 */
const TECH_DOCUMENTATION_LINKS: Record<string, string> = {
    // Frontend Frameworks
    'react': 'https://react.dev',
    'vue': 'https://vuejs.org',
    'angular': 'https://angular.io',
    'svelte': 'https://svelte.dev',
    'next.js': 'https://nextjs.org',
    'nuxt': 'https://nuxt.com',
    'gatsby': 'https://www.gatsbyjs.com',

    // Backend Frameworks
    'express': 'https://expressjs.com',
    'fastapi': 'https://fastapi.tiangolo.com',
    'django': 'https://www.djangoproject.com',
    'flask': 'https://flask.palletsprojects.com',
    'spring': 'https://spring.io',
    'laravel': 'https://laravel.com',
    'rails': 'https://rubyonrails.org',
    'asp.net': 'https://dotnet.microsoft.com/en-us/apps/aspnet',

    // Programming Languages
    'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    'typescript': 'https://www.typescriptlang.org',
    'python': 'https://www.python.org',
    'java': 'https://www.java.com',
    'c#': 'https://docs.microsoft.com/en-us/dotnet/csharp',
    'go': 'https://golang.org',
    'rust': 'https://www.rust-lang.org',
    'php': 'https://www.php.net',
    'ruby': 'https://www.ruby-lang.org',
    'swift': 'https://swift.org',
    'kotlin': 'https://kotlinlang.org',

    // Databases
    'postgresql': 'https://www.postgresql.org',
    'mysql': 'https://www.mysql.com',
    'mongodb': 'https://www.mongodb.com',
    'redis': 'https://redis.io',
    'sqlite': 'https://www.sqlite.org',
    'elasticsearch': 'https://www.elastic.co/elasticsearch',
    'cassandra': 'https://cassandra.apache.org',

    // DevOps & Cloud
    'docker': 'https://www.docker.com',
    'kubernetes': 'https://kubernetes.io',
    'aws': 'https://aws.amazon.com',
    'azure': 'https://azure.microsoft.com',
    'gcp': 'https://cloud.google.com',
    'terraform': 'https://www.terraform.io',
    'jenkins': 'https://www.jenkins.io',
    'github actions': 'https://github.com/features/actions',
    'gitlab ci': 'https://docs.gitlab.com/ee/ci',

    // Testing
    'jest': 'https://jestjs.io',
    'cypress': 'https://www.cypress.io',
    'playwright': 'https://playwright.dev',
    'mocha': 'https://mochajs.org',
    'chai': 'https://www.chaijs.com',
    'pytest': 'https://pytest.org',
    'junit': 'https://junit.org',

    // Tools
    'git': 'https://git-scm.com',
    'npm': 'https://www.npmjs.com',
    'yarn': 'https://yarnpkg.com',
    'webpack': 'https://webpack.js.org',
    'vite': 'https://vitejs.dev',
    'eslint': 'https://eslint.org',
    'prettier': 'https://prettier.io',
    'figma': 'https://www.figma.com',
    'jira': 'https://www.atlassian.com/software/jira',
    'confluence': 'https://www.atlassian.com/software/confluence',
};

/**
 * Gets the official documentation URL for a technology
 * @param techName - The technology name
 * @returns The official documentation URL or null if not found
 */
export function getTechDocumentationUrl(techName: string): string | null {
    const normalizedName = techName.toLowerCase().trim();
    return TECH_DOCUMENTATION_LINKS[normalizedName] || null;
}

/**
 * Parses the requirements section into structured subsections
 * @param requirementsText - The requirements text from the challenge description
 * @returns An object containing parsed requirement subsections
 */
export function parseRequirementsSubsections(requirementsText: string): {
    functionalRequirements: string[];
    nonFunctionalRequirements: string[];
    constraints: string[];
    allowedTools: string[];
    disallowedTools: string[];
    externalServices: string[];
} {
    if (!requirementsText || typeof requirementsText !== 'string') {
        return {
            functionalRequirements: [],
            nonFunctionalRequirements: [],
            constraints: [],
            allowedTools: [],
            disallowedTools: [],
            externalServices: [],
        };
    }

    const lines = requirementsText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    const result = {
        functionalRequirements: [] as string[],
        nonFunctionalRequirements: [] as string[],
        constraints: [] as string[],
        allowedTools: [] as string[],
        disallowedTools: [] as string[],
        externalServices: [] as string[],
    };

    let currentSection = '';
    let currentItems: string[] = [];

    for (const line of lines) {
        const lowerLine = line.toLowerCase();

        // Detect section headers
        if (lowerLine.includes('functional requirements') || lowerLine.includes('functional:')) {
            if (currentSection && currentItems.length > 0) {
                (result as any)[currentSection] = [...currentItems];
            }
            currentSection = 'functionalRequirements';
            currentItems = [];
        } else if (lowerLine.includes('non-functional requirements') || lowerLine.includes('non-functional:')) {
            if (currentSection && currentItems.length > 0) {
                (result as any)[currentSection] = [...currentItems];
            }
            currentSection = 'nonFunctionalRequirements';
            currentItems = [];
        } else if (lowerLine.includes('constraints') || lowerLine.includes('constraint:')) {
            if (currentSection && currentItems.length > 0) {
                (result as any)[currentSection] = [...currentItems];
            }
            currentSection = 'constraints';
            currentItems = [];
        } else if (lowerLine.includes('allowed tools') || lowerLine.includes('allowed:')) {
            if (currentSection && currentItems.length > 0) {
                (result as any)[currentSection] = [...currentItems];
            }
            currentSection = 'allowedTools';
            currentItems = [];
        } else if (lowerLine.includes('disallowed tools') || lowerLine.includes('disallowed:') || lowerLine.includes('prohibited tools') || lowerLine.includes('forbidden tools') || lowerLine.includes('not allowed')) {
            if (currentSection && currentItems.length > 0) {
                (result as any)[currentSection] = [...currentItems];
            }
            currentSection = 'disallowedTools';
            currentItems = [];
        } else if (lowerLine.includes('external services') || lowerLine.includes('external:')) {
            if (currentSection && currentItems.length > 0) {
                (result as any)[currentSection] = [...currentItems];
            }
            currentSection = 'externalServices';
            currentItems = [];
        } else if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || /^\d+\./.test(line)) {
            // This is a list item
            const cleanItem = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
            if (cleanItem) {
                currentItems.push(cleanItem);
            }
        } else if (line.length > 0 && !lowerLine.includes('requirements') && !lowerLine.includes('constraints') && !lowerLine.includes('tools') && !lowerLine.includes('services')) {
            // This might be a continuation of the current section
            if (currentSection) {
                currentItems.push(line);
            }
        }
    }

    // Add the last section
    if (currentSection && currentItems.length > 0) {
        (result as any)[currentSection] = [...currentItems];
    }

    // Debug logging
    console.log('Parsed requirements subsections:', {
        functionalRequirements: result.functionalRequirements.length,
        nonFunctionalRequirements: result.nonFunctionalRequirements.length,
        constraints: result.constraints.length,
        allowedTools: result.allowedTools.length,
        disallowedTools: result.disallowedTools.length,
        externalServices: result.externalServices.length,
    });

    return result;
}

/**
 * Parses the deliverables section into structured list items
 * @param deliverablesText - The deliverables text from the challenge description
 * @returns An array of deliverable items
 */
export function parseDeliverablesList(deliverablesText: string): string[] {
    if (!deliverablesText || typeof deliverablesText !== 'string') {
        return [];
    }

    const lines = deliverablesText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const deliverables: string[] = [];

    for (const line of lines) {
        // Skip section headers
        if (line.toLowerCase().includes('deliverables') || line.toLowerCase().includes('deliverable:')) {
            continue;
        }

        // Check for list items (bullets, numbers, dashes)
        if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || /^\d+\./.test(line)) {
            const cleanItem = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
            if (cleanItem) {
                deliverables.push(cleanItem);
            }
        } else if (line.length > 0 && !line.toLowerCase().includes('deliverables')) {
            // This might be a continuation or standalone deliverable
            deliverables.push(line);
        }
    }

    return deliverables;
}

/**
 * Parses the evaluation rubric section into structured list items
 * @param evaluationText - The evaluation rubric text from the challenge description
 * @returns An array of evaluation criteria items
 */
export function parseEvaluationRubricList(evaluationText: string): string[] {
    if (!evaluationText || typeof evaluationText !== 'string') {
        return [];
    }

    const lines = evaluationText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const criteria: string[] = [];

    for (const line of lines) {
        // Skip section headers
        if (line.toLowerCase().includes('evaluation rubric') || line.toLowerCase().includes('evaluation:')) {
            continue;
        }

        // Check for list items (bullets, numbers, dashes)
        if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*') || /^\d+\./.test(line)) {
            const cleanItem = line.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
            if (cleanItem) {
                criteria.push(cleanItem);
            }
        } else if (line.length > 0 && !line.toLowerCase().includes('evaluation')) {
            // This might be a continuation or standalone criterion
            criteria.push(line);
        }
    }

    return criteria;
}

/**
 * Extracts all structured sections from a challenge description
 * @param challengeDescription - The full markdown challenge description
 * @returns An object containing all extracted sections
 */
export function extractAllSections(challengeDescription: string): {
    problemOverview: string;
    problemStatement: string;
    requirements: string;
    deliverables: string;
    evaluationRubric: string;
} {
    return {
        problemOverview: extractProblemOverview(challengeDescription),
        problemStatement: extractProblemStatement(challengeDescription),
        requirements: extractRequirements(challengeDescription),
        deliverables: extractDeliverables(challengeDescription),
        evaluationRubric: extractEvaluationRubric(challengeDescription),
    };
}
