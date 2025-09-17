/**
 * LegalEaseFile Automated Glossary System
 * JSON-LD Generator for Legal Terms with Schema.org DefinedTerm compliance
 */

const { OpenAI } = require('openai');

class LegalGlossaryGenerator {
  constructor(openaiKey = process.env.OPENAI_API_KEY) {
    this.openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;
    this.baseUrl = process.env.BASE_URL || 'https://legaleasefile.com';
  }

  /**
   * Generate JSON-LD for a glossary term (schema.org DefinedTerm)
   */
  generateJsonLD(termData) {
    const {
      term,
      description,
      aliases = [],
      externalLinks = [],
      imageUrl = null,
      internalLinks = [],
      version = "1.0",
      jurisdiction = null,
      termCode = null
    } = termData;

    const url = `${this.baseUrl}/glossary/${this.slugify(term)}`;
    const glossaryUrl = `${this.baseUrl}/glossary`;

    const jsonld = {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": term,
      "description": description,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "@id": glossaryUrl,
        "name": "LegalEaseFile Legal Glossary",
        "description": "Comprehensive legal terminology for self-represented litigants"
      },
      "url": url,
      "dateCreated": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "publisher": {
        "@type": "Organization",
        "name": "LegalEaseFile",
        "url": this.baseUrl,
        "logo": `${this.baseUrl}/images/logo.png`
      },
      "version": version
    };

    // Add optional fields
    if (aliases && aliases.length > 0) {
      jsonld.alternateName = aliases;
    }

    if (externalLinks && externalLinks.length > 0) {
      jsonld.sameAs = externalLinks;
    }

    if (imageUrl) {
      jsonld.image = {
        "@type": "ImageObject",
        "url": imageUrl,
        "caption": `Legal illustration for ${term}`,
        "copyrightHolder": {
          "@type": "Organization",
          "name": "LegalEaseFile"
        }
      };
    }

    if (internalLinks && internalLinks.length > 0) {
      jsonld.subjectOf = internalLinks;
    }

    if (termCode) {
      jsonld.termCode = termCode;
    }

    // Add jurisdiction-specific metadata
    if (jurisdiction) {
      jsonld.spatialCoverage = {
        "@type": "Place",
        "name": jurisdiction,
        "identifier": jurisdiction
      };
    }

    return JSON.stringify(jsonld, null, 2);
  }

  /**
   * Generate DefinedTermSet JSON-LD for the entire glossary
   */
  generateTermSetJsonLD(terms) {
    const glossaryUrl = `${this.baseUrl}/glossary`;

    const termSet = {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      "@id": glossaryUrl,
      "name": "LegalEaseFile Legal Glossary",
      "description": "Comprehensive legal terminology database for self-represented litigants with jurisdiction-specific guidance",
      "url": glossaryUrl,
      "publisher": {
        "@type": "Organization",
        "name": "LegalEaseFile",
        "url": this.baseUrl
      },
      "hasDefinedTerm": terms.map(term => ({
        "@type": "DefinedTerm",
        "name": term.name,
        "url": `${this.baseUrl}/glossary/${this.slugify(term.name)}`
      })),
      "numberOfItems": terms.length,
      "dateCreated": new Date().toISOString(),
      "dateModified": new Date().toISOString()
    };

    return JSON.stringify(termSet, null, 2);
  }

  /**
   * AI-powered definition enhancement
   */
  async enhanceDefinition(term, rawDefinition) {
    if (!this.openai) {
      console.warn('OpenAI not configured, returning original definition');
      return {
        definition: rawDefinition,
        example: null,
        confidence: 0.5
      };
    }

    try {
      const prompt = `
You are a legal writing expert creating definitions for self-represented litigants.

Rewrite this legal term definition to be:
- Clear and accessible to non-lawyers
- Accurate and legally sound
- Under 100 words
- Include a practical example sentence

Term: ${term}
Current Definition: ${rawDefinition}

Format your response as:
DEFINITION: [enhanced definition]
EXAMPLE: [practical example sentence]
CONFIDENCE: [0.0-1.0 score for accuracy]
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.3
      });

      const content = response.choices[0].message.content;
      const definitionMatch = content.match(/DEFINITION:\s*(.+?)(?=EXAMPLE:|$)/s);
      const exampleMatch = content.match(/EXAMPLE:\s*(.+?)(?=CONFIDENCE:|$)/s);
      const confidenceMatch = content.match(/CONFIDENCE:\s*([0-9.]+)/);

      return {
        definition: definitionMatch ? definitionMatch[1].trim() : rawDefinition,
        example: exampleMatch ? exampleMatch[1].trim() : null,
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.8
      };

    } catch (error) {
      console.error('Error enhancing definition:', error);
      return {
        definition: rawDefinition,
        example: null,
        confidence: 0.5
      };
    }
  }

  /**
   * Extract legal terms from content using NLP
   */
  async extractTerms(content) {
    if (!this.openai) {
      console.warn('OpenAI not configured for term extraction');
      return [];
    }

    try {
      const prompt = `
Extract legal terms and phrases from this content that would be useful in a legal glossary.
Focus on terms that self-represented litigants would need to understand.

Content: ${content.substring(0, 2000)}...

Return a JSON array of terms with this format:
[
  {
    "term": "summary judgment",
    "aliases": ["motion for summary judgment", "MSJ"],
    "context": "brief context from the content",
    "confidence": 0.95
  }
]

Only include terms with confidence > 0.7.
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.2
      });

      const jsonMatch = response.choices[0].message.content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return [];

    } catch (error) {
      console.error('Error extracting terms:', error);
      return [];
    }
  }

  /**
   * Generate authoritative external links for a legal term
   */
  generateAuthorityLinks(term) {
    const termSlug = this.slugify(term);

    const authorities = [
      {
        name: "Cornell Law School Legal Information Institute",
        url: `https://www.law.cornell.edu/wex/${termSlug.replace(/-/g, '_')}`,
        priority: 1
      },
      {
        name: "FindLaw Legal Dictionary",
        url: `https://dictionary.findlaw.com/definition/${termSlug}.html`,
        priority: 2
      },
      {
        name: "Justia Legal Dictionary",
        url: `https://law.justia.com/dictionary/${termSlug}/`,
        priority: 3
      },
      {
        name: "Black's Law Dictionary",
        url: `https://thelawdictionary.org/search/?cx=&cof=FORID%3A11&ie=UTF-8&q=${encodeURIComponent(term)}`,
        priority: 4
      }
    ];

    return authorities
      .sort((a, b) => a.priority - b.priority)
      .map(auth => auth.url);
  }

  /**
   * Process content for automated glossary generation
   */
  async processContent(content, sourceUrl = null) {
    try {
      // Extract terms from content
      const extractedTerms = await this.extractTerms(content);

      const processedTerms = [];

      for (const termData of extractedTerms) {
        if (termData.confidence > 0.7) {
          // Enhance definition
          const enhanced = await this.enhanceDefinition(
            termData.term,
            termData.context || `${termData.term} is a legal term.`
          );

          // Generate authority links
          const externalLinks = this.generateAuthorityLinks(termData.term);

          // Build complete term data
          const completeTermData = {
            term: termData.term,
            description: enhanced.definition,
            aliases: termData.aliases || [],
            externalLinks: externalLinks,
            internalLinks: sourceUrl ? [sourceUrl] : [],
            example: enhanced.example,
            confidence: enhanced.confidence,
            extractedFrom: sourceUrl,
            jurisdiction: this.detectJurisdiction(content)
          };

          // Generate JSON-LD
          const jsonld = this.generateJsonLD(completeTermData);

          processedTerms.push({
            ...completeTermData,
            jsonld: jsonld
          });
        }
      }

      return processedTerms;

    } catch (error) {
      console.error('Error processing content:', error);
      return [];
    }
  }

  /**
   * Detect jurisdiction from content
   */
  detectJurisdiction(content) {
    const jurisdictionPatterns = {
      'MA': /massachusetts|barnstable|worcester|essex|middlesex|norfolk|plymouth|hampden|hampshire|franklin|berkshire/i,
      'FEDERAL': /federal court|u\.?s\.? district|circuit court|supreme court|frcp|federal rules/i,
      'CA': /california|los angeles|san francisco|orange county|san diego/i,
      'NY': /new york|manhattan|brooklyn|queens|bronx|westchester/i,
      'TX': /texas|harris county|dallas|travis county|bexar county/i
    };

    for (const [jurisdiction, pattern] of Object.entries(jurisdictionPatterns)) {
      if (pattern.test(content)) {
        return jurisdiction;
      }
    }

    return null;
  }

  /**
   * Create URL-friendly slug
   */
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Generate alphabet navigation for glossary
   */
  generateAlphabetNav(terms) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const termsByLetter = {};

    // Group terms by first letter
    terms.forEach(term => {
      const firstLetter = term.name.charAt(0).toUpperCase();
      if (!termsByLetter[firstLetter]) {
        termsByLetter[firstLetter] = [];
      }
      termsByLetter[firstLetter].push(term);
    });

    // Generate navigation HTML
    return alphabet.map(letter => ({
      letter: letter,
      hasTerms: termsByLetter[letter] && termsByLetter[letter].length > 0,
      count: termsByLetter[letter] ? termsByLetter[letter].length : 0,
      anchor: `#letter-${letter.toLowerCase()}`
    }));
  }
}

module.exports = LegalGlossaryGenerator;

// Example usage for testing
if (require.main === module) {
  const generator = new LegalGlossaryGenerator();

  const sampleTerm = {
    term: "Summary Judgment",
    description: "A judgment granted by the court without a full trial because there is no dispute of material fact.",
    aliases: ["Motion for Summary Judgment", "MSJ"],
    externalLinks: [
      "https://www.law.cornell.edu/wex/summary_judgment",
      "https://dictionary.findlaw.com/definition/summary-judgment.html"
    ],
    imageUrl: "https://assets.legaleasefile.com/images/summary-judgment.jpg",
    internalLinks: [
      "https://legaleasefile.com/blog/how-to-file-msj",
      "https://legaleasefile.com/forms/msj-template"
    ],
    jurisdiction: "FEDERAL",
    termCode: "SMJ"
  };

  console.log("=== JSON-LD for Summary Judgment ===");
  console.log(generator.generateJsonLD(sampleTerm));
}