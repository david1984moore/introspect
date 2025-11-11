/**
 * Enhanced Conversation State Manager v2
 * 
 * Manages conversation state with topic closure tracking to prevent duplicate questions.
 * Extracts facts from answers, tracks covered topics, and generates compressed payloads for Claude API.
 */

import { TOPIC_MAPPINGS, getTopicMapping } from './topicMappings'
import type { 
  ConversationFact, 
  CompressedPromptPayload,
  TopicMapping 
} from '@/types/conversation'

export class ConversationStateManager {
  private facts: Map<string, ConversationFact> = new Map()
  private history: Array<{ question: string; answer: string; timestamp: Date }> = []
  private coveredTopics: Set<string> = new Set()
  private recentQuestionTopics: string[] = [] // Last 5 question topics for similarity guard
  
  /**
   * Extract facts from user answer
   * Called immediately after each answer submission
   */
  extractFacts(
    questionId: string,
    questionText: string,
    answerText: string,
    questionMetadata: { category: string; extractionRules?: string[]; scopeSection?: string }
  ): ConversationFact[] {
    const newFacts: ConversationFact[] = []
    
    // Foundation questions have explicit extraction rules
    if (questionMetadata.category === 'foundation') {
      const fact = this.extractFoundationFact(questionId, questionText, answerText)
      if (fact) {
        this.facts.set(fact.key, fact)
        newFacts.push(fact)
      }
    }
    
    // Feature selections are automatically factual
    if (questionMetadata.category === 'feature_selection' || questionMetadata.category === 'features') {
      const fact: ConversationFact = {
        id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'feature',
        key: `selected_${questionId}`,
        value: answerText,
        confidence: 1.0,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      }
      this.facts.set(fact.key, fact)
      newFacts.push(fact)
    }
    
    // Business context questions may contain multiple facts
    if (questionMetadata.category === 'business_context' || questionMetadata.category === 'business') {
      const contextFacts = this.extractBusinessContextFacts(questionId, questionText, answerText)
      contextFacts.forEach(fact => {
        // Use fact key as map key to prevent duplicates
        if (!this.facts.has(fact.key)) {
          this.facts.set(fact.key, fact)
          newFacts.push(fact)
        }
      })
    }
    
    // Technical questions
    if (questionMetadata.category === 'technical' || questionMetadata.category === 'technical_requirements') {
      const technicalFacts = this.extractTechnicalFacts(questionId, questionText, answerText)
      technicalFacts.forEach(fact => {
        if (!this.facts.has(fact.key)) {
          this.facts.set(fact.key, fact)
          newFacts.push(fact)
        }
      })
    }
    
    // Design/branding questions
    if (questionMetadata.category === 'design' || questionMetadata.category === 'brand_assets') {
      const designFacts = this.extractDesignFacts(questionId, questionText, answerText)
      designFacts.forEach(fact => {
        if (!this.facts.has(fact.key)) {
          this.facts.set(fact.key, fact)
          newFacts.push(fact)
        }
      })
    }
    
    // Fallback: Create a generic fact for any answer that doesn't match specific patterns
    // This ensures ALL answers are tracked and displayed in the transition animation
    if (newFacts.length === 0 && answerText.trim()) {
      // Generate a readable key from the question text
      const questionKey = questionText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, 50) || 'answer'
      
      const factKey = `answer_${questionKey}`
      
      // Only create if we don't already have a fact for this question
      if (!this.facts.has(factKey)) {
        const genericFact: ConversationFact = {
          id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          category: questionMetadata.category === 'technical' ? 'technical' : 
                   questionMetadata.category === 'design' ? 'business' : 'business',
          key: factKey,
          value: answerText.trim(),
          confidence: 0.8,
          sourceQuestionId: questionId,
          extractedAt: new Date()
        }
        this.facts.set(factKey, genericFact)
        newFacts.push(genericFact)
      }
    }
    
    // After extracting facts, update covered topics
    this.updateCoveredTopics()
    
    return newFacts
  }
  
  private extractFoundationFact(
    questionId: string,
    questionText: string,
    answerText: string
  ): ConversationFact | null {
    const factKeyMap: Record<string, { category: ConversationFact['category']; key: string }> = {
      'foundation_name': { category: 'business', key: 'contact_name' },
      'foundation_email': { category: 'business', key: 'contact_email' },
      'foundation_phone': { category: 'business', key: 'contact_phone' },
      'foundation_website_type': { category: 'business', key: 'website_type' },
    }
    
    // Also check if question text contains keywords
    const lowerQuestion = questionText.toLowerCase()
    if (lowerQuestion.includes('name') && !factKeyMap[questionId]) {
      if (lowerQuestion.includes('business') || lowerQuestion.includes('company')) {
        return {
          id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          category: 'business',
          key: 'business_name',
          value: answerText.trim(),
          confidence: 1.0,
          sourceQuestionId: questionId,
          extractedAt: new Date()
        }
      }
    }
    
    const mapping = factKeyMap[questionId]
    if (!mapping) return null
    
    return {
      id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      category: mapping.category,
      key: mapping.key,
      value: answerText.trim(),
      confidence: 1.0,
      sourceQuestionId: questionId,
      extractedAt: new Date()
    }
  }
  
  private extractBusinessContextFacts(
    questionId: string,
    questionText: string,
    answerText: string
  ): ConversationFact[] {
    const facts: ConversationFact[] = []
    const lowerQuestion = questionText.toLowerCase()
    const lowerAnswer = answerText.toLowerCase()
    
    // Business name extraction
    if (lowerQuestion.includes('name') && (lowerQuestion.includes('business') || lowerQuestion.includes('company'))) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'business',
        key: 'business_name',
        value: answerText.trim(),
        confidence: 1.0,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // Target audience extraction
    if (lowerQuestion.includes('customer') || lowerQuestion.includes('audience') || lowerQuestion.includes('who')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'business',
        key: 'target_audience',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // Services/value proposition extraction
    if (lowerQuestion.includes('service') || lowerQuestion.includes('offer') || 
        lowerQuestion.includes('provide') || lowerQuestion.includes('help')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'business',
        key: 'services_offered',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // Goals extraction
    if (lowerQuestion.includes('goal') || lowerQuestion.includes('objective') || lowerQuestion.includes('purpose')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'business',
        key: 'project_purpose',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // Timeline extraction
    const timelinePatterns = [
      /in (\d+) months?/i,
      /within (\d+) weeks?/i,
      /by ([A-Za-z]+ \d{4})/i,
      /(urgent|asap|immediately)/i,
      /(\d+) days?/i,
    ]
    
    for (const pattern of timelinePatterns) {
      const match = answerText.match(pattern)
      if (match) {
        facts.push({
          id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
          category: 'timeline',
          key: 'project_timeline',
          value: match[0],
          confidence: 0.8,
          sourceQuestionId: questionId,
          extractedAt: new Date()
        })
        break // Only take first timeline match
      }
    }
    
    // Budget extraction
    const budgetPatterns = [
      /\$[\d,]+k?/,
      /(budget|spend|invest).{0,30}(\d+k?)/i,
      /(tight|limited|flexible|unlimited) budget/i,
      /under.*\d+/i,
      /\d+.*to.*\d+/i,
    ]
    
    for (const pattern of budgetPatterns) {
      const match = answerText.match(pattern)
      if (match) {
        facts.push({
          id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
          category: 'budget',
          key: 'budget_indication',
          value: match[0],
          confidence: 0.7,
          sourceQuestionId: questionId,
          extractedAt: new Date()
        })
        break
      }
    }
    
    return facts
  }
  
  private extractTechnicalFacts(
    questionId: string,
    questionText: string,
    answerText: string
  ): ConversationFact[] {
    const facts: ConversationFact[] = []
    const lowerQuestion = questionText.toLowerCase()
    
    // Authentication extraction
    if (lowerQuestion.includes('login') || lowerQuestion.includes('authentication') || 
        lowerQuestion.includes('sign in') || lowerQuestion.includes('auth')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'technical',
        key: 'auth_method',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // Platform extraction
    if (lowerQuestion.includes('platform') || lowerQuestion.includes('device') || 
        lowerQuestion.includes('mobile') || lowerQuestion.includes('web')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'technical',
        key: 'platform',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // CMS extraction
    if (lowerQuestion.includes('cms') || lowerQuestion.includes('content') && lowerQuestion.includes('update')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'technical',
        key: 'cms_type',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // Payment extraction
    if (lowerQuestion.includes('payment') || lowerQuestion.includes('billing') || 
        lowerQuestion.includes('checkout') || lowerQuestion.includes('stripe') || 
        lowerQuestion.includes('paypal')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'technical',
        key: 'payment_provider',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    return facts
  }
  
  private extractDesignFacts(
    questionId: string,
    questionText: string,
    answerText: string
  ): ConversationFact[] {
    const facts: ConversationFact[] = []
    const lowerQuestion = questionText.toLowerCase()
    
    // Brand materials extraction
    if (lowerQuestion.includes('brand') && (lowerQuestion.includes('material') || 
        lowerQuestion.includes('logo') || lowerQuestion.includes('upload'))) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'business',
        key: 'existing_branding',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    // Design style extraction
    if (lowerQuestion.includes('design') || lowerQuestion.includes('style') || 
        lowerQuestion.includes('look') || lowerQuestion.includes('aesthetic')) {
      facts.push({
        id: `fact_${Date.now()}_${facts.length}_${Math.random().toString(36).substr(2, 9)}`,
        category: 'business',
        key: 'design_style',
        value: answerText.trim(),
        confidence: 0.9,
        sourceQuestionId: questionId,
        extractedAt: new Date()
      })
    }
    
    return facts
  }
  
  /**
   * Add Q&A to history and track question topic
   */
  addToHistory(question: string, answer: string): void {
    this.history.push({
      question,
      answer,
      timestamp: new Date()
    })
    
    // Extract topic from question for similarity tracking
    const topic = this.extractQuestionTopic(question)
    this.recentQuestionTopics.push(topic)
    
    // Keep only last 5
    if (this.recentQuestionTopics.length > 5) {
      this.recentQuestionTopics.shift()
    }
  }
  
  /**
   * Extract the topic/theme of a question for duplicate detection
   */
  private extractQuestionTopic(question: string): string {
    const lowerQuestion = question.toLowerCase()
    
    // Check against topic mappings
    for (const mapping of TOPIC_MAPPINGS) {
      if (mapping.keywords.some(keyword => lowerQuestion.includes(keyword))) {
        return mapping.topic
      }
    }
    
    return 'general'
  }
  
  /**
   * Update covered topics based on current fact set
   * A topic is "covered" when we have enough facts from that topic's required list
   */
  private updateCoveredTopics(): void {
    for (const mapping of TOPIC_MAPPINGS) {
      // Count how many required facts we have for this topic
      const factsFound = mapping.requiredFacts.filter(key => this.facts.has(key))
      
      // If we've met the minimum threshold, mark topic as covered
      if (factsFound.length >= mapping.minFactsForClosure) {
        this.coveredTopics.add(mapping.topic)
      }
    }
  }
  
  /**
   * Generate compressed payload for Claude API
   */
  generateCompressedPayload(): CompressedPromptPayload {
    // Ensure topics are up to date
    this.updateCoveredTopics()
    
    // Group facts by category for readable summary
    const factsByCategory = this.groupFactsByCategory()
    const factSummary = this.generateFactSummary(factsByCategory)
    const recentExchanges = this.generateRecentExchanges()
    const topicClosureSection = this.generateTopicClosureSection()
    const recentTopicsSection = this.generateRecentTopicsSection()
    
    return {
      systemContext: this.buildSystemContext(),
      factSummary,
      recentExchanges,
      topicClosureSection,
      recentTopicsSection,
      currentQuestion: '' // Set by caller
    }
  }
  
  /**
   * Group facts by their category for organized display
   */
  private groupFactsByCategory(): Record<string, ConversationFact[]> {
    const grouped: Record<string, ConversationFact[]> = {}
    
    this.facts.forEach(fact => {
      if (!grouped[fact.category]) {
        grouped[fact.category] = []
      }
      grouped[fact.category].push(fact)
    })
    
    return grouped
  }
  
  /**
   * Generate fact summary with visual markers
   */
  private generateFactSummary(factsByCategory: Record<string, ConversationFact[]>): string {
    if (this.facts.size === 0) {
      return 'INFORMATION ALREADY GATHERED:\nNone yet (this is the beginning of the conversation)'
    }
    
    const sections = Object.entries(factsByCategory).map(([category, facts]) => {
      const factLines = facts.map(f => {
        // Truncate long values for readability
        const value = f.value.length > 60 ? f.value.substring(0, 57) + '...' : f.value
        return `    ✓ ${this.formatFactKey(f.key)}: ${value}`
      }).join('\n')
      
      return `  ${category.toUpperCase()}:\n${factLines}`
    })
    
    return `INFORMATION ALREADY GATHERED:\n${sections.join('\n\n')}`
  }
  
  /**
   * Format fact keys to be human-readable
   */
  private formatFactKey(key: string): string {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  /**
   * Generate recent exchanges section
   */
  private generateRecentExchanges(): string {
    const recentHistory = this.history.slice(-2)
    
    if (recentHistory.length === 0) {
      return 'RECENT CONVERSATION:\nNo previous exchanges.'
    }
    
    const exchanges = recentHistory
      .map((h, i) => `Q${i + 1}: ${h.question}\nA${i + 1}: ${h.answer}`)
      .join('\n\n')
    
    return `RECENT CONVERSATION (last 2 exchanges):\n${exchanges}`
  }
  
  /**
   * Generate topic closure section - THE KEY TO PREVENTING DUPLICATES
   */
  private generateTopicClosureSection(): string {
    if (this.coveredTopics.size === 0) {
      return `TOPICS ALREADY COVERED:\nNone yet (this is the beginning of the conversation)`
    }
    
    const coveredList = Array.from(this.coveredTopics)
      .map(topic => {
        const mapping = getTopicMapping(topic)
        return `  ❌ ${mapping?.displayName || topic}`
      })
      .join('\n')
    
    return `TOPICS ALREADY COVERED - DO NOT ASK ABOUT THESE AGAIN:
${coveredList}

⚠️ CRITICAL INSTRUCTION: The user has already provided information about the topics listed above.
Do NOT ask questions that revisit these topics, even if phrased differently or from a different angle.
Move to NEW topics that haven't been covered yet.`
  }
  
  /**
   * Generate recent topics section - SIMILARITY GUARD
   */
  private generateRecentTopicsSection(): string {
    if (this.recentQuestionTopics.length === 0) {
      return ''
    }
    
    // Deduplicate and format
    const uniqueTopics = Array.from(new Set(this.recentQuestionTopics))
      .map(topic => {
        const mapping = getTopicMapping(topic)
        return mapping ? mapping.displayName : topic
      })
      .filter(topic => topic !== 'general') // Don't show generic topics
    
    if (uniqueTopics.length === 0) {
      return ''
    }
    
    const topicList = uniqueTopics.map(t => `  • ${t}`).join('\n')
    
    return `
RECENTLY ASKED ABOUT (last 5 questions - avoid similar questions):
${topicList}

Avoid asking questions too similar to recent questions, even if technically different.`
  }
  
  /**
   * Build system context with enhanced instructions
   * Note: This is a simplified version - the full system prompt is in the API route
   */
  private buildSystemContext(): string {
    return `You are the intelligent orchestration engine for Introspect, a professional client intake system.

Your role is to gather complete project requirements through structured, contextual questioning.

CONVERSATION STATE AWARENESS:
You have access to:
1. Extracted facts from all previous answers
2. The last 2 question-answer pairs for continuity
3. Topics already covered (marked as closed)
4. Recent question topics (for similarity avoidance)

CRITICAL BEHAVIORAL RULES:

1. NEVER REVISIT COVERED TOPICS
   - If a topic is marked with ❌, it is CLOSED
   - Do not ask about it again, even if phrased differently
   - Example: If "Payment processing" is covered, don't ask about billing, subscriptions, or payment gateways

2. AVOID SIMILAR QUESTIONS
   - Check the "recently asked about" list
   - Don't ask questions on the same general theme as recent questions
   - Move to genuinely new territory

3. USE GATHERED INFORMATION
   - Reference known facts to provide context
   - Adapt question phrasing to their business type
   - Skip irrelevant questions (e.g., don't ask about e-commerce features for a portfolio site)

4. MAINTAIN NATURAL FLOW
   - Ask the most logical next question given what you know
   - Build on previous answers naturally
   - Keep questions focused and specific`
  }
  
  /**
   * Get all facts (for display, analytics, or SCOPE generation)
   */
  getAllFacts(): ConversationFact[] {
    return Array.from(this.facts.values())
  }
  
  /**
   * Get covered topics (for debugging/analytics)
   */
  getCoveredTopics(): string[] {
    return Array.from(this.coveredTopics)
  }
  
  /**
   * Get full history (for debugging or advanced features)
   */
  getFullHistory() {
    return [...this.history]
  }
  
  /**
   * Get token usage metrics
   */
  getTokenMetrics() {
    const factTokens = this.estimateFactTokens()
    const recentContextTokens = this.estimateRecentContextTokens()
    const topicClosureTokens = this.estimateTopicClosureTokens()
    const totalTokens = factTokens + recentContextTokens + topicClosureTokens
    
    return {
      factCount: this.facts.size,
      factTokens,
      recentContextTokens,
      topicClosureTokens,
      totalTokens,
      questionNumber: this.history.length,
      coveredTopicCount: this.coveredTopics.size,
    }
  }
  
  private estimateFactTokens(): number {
    let charCount = 0
    this.facts.forEach(fact => {
      charCount += fact.key.length + fact.value.length + 10
    })
    return Math.ceil(charCount / 4)
  }
  
  private estimateRecentContextTokens(): number {
    const recent = this.history.slice(-2)
    let charCount = 0
    recent.forEach(h => {
      charCount += h.question.length + h.answer.length
    })
    return Math.ceil(charCount / 4)
  }
  
  private estimateTopicClosureTokens(): number {
    // Topic closure section + recent topics section
    const closureText = this.generateTopicClosureSection()
    const recentText = this.generateRecentTopicsSection()
    return Math.ceil((closureText.length + recentText.length) / 4)
  }
  
  /**
   * Reset state (for new conversation)
   */
  reset(): void {
    this.facts.clear()
    this.history = []
    this.coveredTopics.clear()
    this.recentQuestionTopics = []
  }
  
  /**
   * Manual topic marking (for edge cases or admin control)
   */
  manuallyMarkTopicCovered(topic: string): void {
    this.coveredTopics.add(topic)
  }
  
  manuallyUnmarkTopic(topic: string): void {
    this.coveredTopics.delete(topic)
  }
  
  /**
   * Import state from external source (for persistence)
   */
  importState(state: {
    facts: ConversationFact[]
    history: Array<{ question: string; answer: string; timestamp: Date }>
    coveredTopics: string[]
    recentQuestionTopics: string[]
  }): void {
    this.facts.clear()
    state.facts.forEach(fact => {
      this.facts.set(fact.key, fact)
    })
    this.history = [...state.history]
    this.coveredTopics = new Set(state.coveredTopics)
    this.recentQuestionTopics = [...state.recentQuestionTopics]
  }
  
  /**
   * Export state for persistence
   */
  exportState() {
    return {
      facts: Array.from(this.facts.values()),
      history: [...this.history],
      coveredTopics: Array.from(this.coveredTopics),
      recentQuestionTopics: [...this.recentQuestionTopics],
    }
  }
}

