# Phase 7: Deployment & Monitoring
**Days 20-21 | Introspect V3 Implementation - COMPLETE**

## Overview

Deploy to production on Render with comprehensive monitoring systems including all V3.2 metrics: business model classification tracking, feature adoption, question efficiency, validation effectiveness, and conversion funnel analytics.

**Duration:** 2 days  
**Prerequisites:** Phases 1-6 complete  
**Deliverables:**
- Production deployment on Render
- Complete monitoring setup (Sentry, Analytics, Custom Metrics)
- Business intelligence dashboard
- Real-time alerting system
- Documentation and runbooks
- Handoff procedures

---

## Day 20: Production Deployment

### 20.1 Render Configuration with V3 Requirements

**File:** `render.yaml`

```yaml
services:
  - type: web
    name: introspect-v3
    runtime: node
    region: oregon
    plan: starter # Upgrade to standard for production
    buildCommand: |
      npm ci --production=false
      npm run build
      npm run test:ci
      npx prisma generate
      npx prisma migrate deploy
    startCommand: npm run start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_VERSION
        value: 20
      - key: NODE_ENV
        value: production
      - key: ANTHROPIC_API_KEY
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_URL
        sync: false
      - key: NEXT_PUBLIC_SUPABASE_ANON_KEY
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: RESEND_API_KEY
        sync: false
      - key: ENCRYPTION_KEY
        generateValue: true
      - key: NEXT_PUBLIC_APP_URL
        value: https://introspect.applicreations.com
      - key: SENTRY_DSN
        sync: false
      - key: NEXT_PUBLIC_POSTHOG_KEY
        sync: false
      - key: NEXT_PUBLIC_POSTHOG_HOST
        value: https://app.posthog.com
      - key: NEXT_PUBLIC_GA_ID
        sync: false
      - key: MONITORING_WEBHOOK_URL
        sync: false
    autoDeploy: false # Manual deployment for production
    domains:
      - introspect.applicreations.com
```

### 20.2 Enhanced Health Check with V3 Metrics

**File:** `app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { redis } from '@/lib/redis'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.npm_package_version || '3.2.0',
    environment: process.env.NODE_ENV,
    checks: {
      database: false,
      redis: false,
      claude: false,
      email: false,
    },
    metrics: {
      sessionsToday: 0,
      completionsToday: 0,
      averageQuestions: 0,
      businessModelsClassified: 0,
      featuresAdopted: 0,
    },
  }
  
  try {
    // Database check
    const { error: dbError } = await supabase
      .from('sessions')
      .select('count')
      .limit(1)
    checks.checks.database = !dbError
    
    // Redis check
    try {
      await redis.ping()
      checks.checks.redis = true
    } catch {
      checks.checks.redis = false
    }
    
    // Claude API check
    try {
      const response = await fetch('https://api.anthropic.com/v1/models', {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY!,
          'anthropic-version': '2023-06-01',
        },
      })
      checks.checks.claude = response.ok
    } catch {
      checks.checks.claude = false
    }
    
    // Email service check
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'HEAD',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
      })
      checks.checks.email = response.ok
    } catch {
      checks.checks.email = false
    }
    
    // Get today's metrics
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { data: todaysSessions } = await supabase
      .from('sessions')
      .select('*')
      .gte('created_at', today.toISOString())
    
    if (todaysSessions) {
      checks.metrics.sessionsToday = todaysSessions.length
      checks.metrics.completionsToday = todaysSessions.filter(s => s.status === 'completed').length
      checks.metrics.averageQuestions = todaysSessions.reduce((sum, s) => sum + (s.question_count || 0), 0) / todaysSessions.length || 0
      checks.metrics.businessModelsClassified = todaysSessions.filter(s => s.business_model).length
      checks.metrics.featuresAdopted = todaysSessions.filter(s => s.features_selected?.length > 0).length
    }
    
    // Determine overall health
    const criticalChecks = ['database', 'claude']
    const allCriticalHealthy = criticalChecks.every(check => checks.checks[check as keyof typeof checks.checks])
    
    if (!allCriticalHealthy) {
      checks.status = 'degraded'
    }
    
    return NextResponse.json(checks, {
      status: checks.status === 'healthy' ? 200 : 503,
    })
  } catch (error) {
    return NextResponse.json({
      ...checks,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 503 })
  }
}
```

### 20.3 Deployment Scripts

**File:** `scripts/deploy.sh`

```bash
#!/bin/bash

# Introspect V3 Production Deployment Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Starting Introspect V3 Deployment..."

# 1. Run pre-deployment checks
echo "📋 Running pre-deployment checks..."

# Check Node version
NODE_VERSION=$(node -v)
if [[ ! "$NODE_VERSION" == v20* ]]; then
    echo -e "${RED}❌ Node version must be 20.x${NC}"
    exit 1
fi

# Run tests
echo "🧪 Running tests..."
npm run test:ci
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Tests failed. Aborting deployment.${NC}"
    exit 1
fi

# Check build
echo "🔨 Testing build..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Aborting deployment.${NC}"
    exit 1
fi

# 2. Check environment variables
echo "🔐 Checking environment variables..."
REQUIRED_VARS=(
    "ANTHROPIC_API_KEY"
    "NEXT_PUBLIC_SUPABASE_URL"
    "SUPABASE_SERVICE_ROLE_KEY"
    "RESEND_API_KEY"
    "SENTRY_DSN"
)

for VAR in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!VAR}" ]; then
        echo -e "${RED}❌ Missing required environment variable: $VAR${NC}"
        exit 1
    fi
done

# 3. Database migrations
echo "📊 Running database migrations..."
npx prisma migrate deploy

# 4. Tag release
VERSION=$(node -p "require('./package.json').version")
echo "🏷️  Tagging release v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"
git push origin "v$VERSION"

# 5. Deploy to Render
echo "🚢 Deploying to Render..."
render deploy --service introspect-v3

# 6. Wait for health check
echo "⏳ Waiting for deployment to be healthy..."
sleep 30

HEALTH_URL="https://introspect.applicreations.com/api/health"
MAX_ATTEMPTS=10
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)
    if [ $RESPONSE -eq 200 ]; then
        echo -e "${GREEN}✅ Deployment healthy!${NC}"
        break
    fi
    
    ATTEMPT=$((ATTEMPT+1))
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS - Status: $RESPONSE"
    sleep 10
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}❌ Deployment health check failed${NC}"
    exit 1
fi

# 7. Run smoke tests
echo "🔥 Running smoke tests..."
npm run test:smoke

# 8. Update monitoring dashboards
echo "📊 Updating monitoring dashboards..."
curl -X POST $MONITORING_WEBHOOK_URL \
    -H "Content-Type: application/json" \
    -d "{\"event\": \"deployment\", \"version\": \"$VERSION\", \"status\": \"success\"}"

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "Version $VERSION is now live at https://introspect.applicreations.com"
```

---

## Day 21: Monitoring & Analytics

### 21.1 Comprehensive Monitoring Setup

**File:** `lib/monitoring/metrics.ts`

```typescript
import * as Sentry from '@sentry/nextjs'
import posthog from 'posthog-js'
import { conversionFunnel } from '@/lib/analytics/conversion-funnel'

export interface MetricEvent {
  name: string
  properties?: Record<string, any>
  timestamp: Date
  userId?: string
  sessionId: string
}

export class MetricsCollector {
  private queue: MetricEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null
  
  constructor() {
    // Initialize Sentry
    if (process.env.NODE_ENV === 'production') {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 0.1,
        beforeSend(event) {
          // Remove PII
          if (event.user) {
            delete event.user.email
            delete event.user.username
          }
          return event
        },
      })
    }
    
    // Start flush interval
    this.flushInterval = setInterval(() => this.flush(), 30000) // 30 seconds
  }
  
  // Core metrics
  trackSessionStart(sessionId: string, websiteType: string) {
    this.track('session_start', {
      websiteType,
      timestamp: new Date(),
    }, sessionId)
  }
  
  trackBusinessModelClassified(
    sessionId: string,
    model: string,
    confidence: number,
    questionNumber: number
  ) {
    this.track('business_model_classified', {
      model,
      confidence,
      questionNumber,
      classificationTiming: questionNumber <= 7 ? 'on_time' : 'delayed',
    }, sessionId)
    
    // Alert if classification delayed
    if (questionNumber > 7) {
      this.alert('Business model classification delayed', {
        sessionId,
        questionNumber,
      })
    }
  }
  
  trackFeatureRecommendation(
    sessionId: string,
    features: string[],
    package: string,
    totalPrice: number,
    questionNumber: number
  ) {
    this.track('features_recommended', {
      featureCount: features.length,
      features,
      package,
      totalPrice,
      presentationTiming: questionNumber,
      timedCorrectly: questionNumber >= 10 && questionNumber <= 12,
    }, sessionId)
  }
  
  trackFeatureSelection(
    sessionId: string,
    selected: string[],
    rejected: string[],
    totalPrice: number
  ) {
    this.track('features_selected', {
      selectedCount: selected.length,
      selected,
      rejected,
      totalPrice,
      adoptionRate: selected.length / (selected.length + rejected.length),
    }, sessionId)
  }
  
  trackValidationLoop(
    sessionId: string,
    loopNumber: number,
    category: string,
    response: 'correct' | 'clarify',
    clarification?: string
  ) {
    this.track('validation_loop', {
      loopNumber,
      category,
      response,
      hadClarification: !!clarification,
    }, sessionId)
  }
  
  trackQuestionEfficiency(
    sessionId: string,
    questionCount: number,
    status: 'normal' | 'warning' | 'critical' | 'maximum'
  ) {
    this.track('question_efficiency', {
      questionCount,
      status,
      efficiency: questionCount <= 22 ? 'excellent' : 
                 questionCount <= 25 ? 'good' : 
                 questionCount <= 28 ? 'acceptable' : 'poor',
    }, sessionId)
  }
  
  trackConflictResolution(
    sessionId: string,
    conflictType: string,
    resolution: string
  ) {
    this.track('conflict_resolution', {
      conflictType,
      resolution,
    }, sessionId)
  }
  
  trackSessionComplete(
    sessionId: string,
    questionCount: number,
    duration: number,
    confidence: number
  ) {
    this.track('session_complete', {
      questionCount,
      duration,
      confidence,
      efficiency: this.calculateEfficiencyScore(questionCount, duration, confidence),
    }, sessionId)
  }
  
  trackDocumentGeneration(
    sessionId: string,
    documentType: 'scope' | 'client_pdf',
    wordCount: number,
    generationTime: number
  ) {
    this.track('document_generated', {
      documentType,
      wordCount,
      generationTime,
      quality: wordCount > 5000 ? 'comprehensive' : 'standard',
    }, sessionId)
  }
  
  // Helper methods
  private track(name: string, properties: Record<string, any>, sessionId: string) {
    const event: MetricEvent = {
      name,
      properties,
      timestamp: new Date(),
      sessionId,
    }
    
    // Add to queue
    this.queue.push(event)
    
    // Send to analytics providers
    if (typeof window !== 'undefined') {
      // PostHog
      posthog.capture(name, {
        ...properties,
        distinct_id: sessionId,
      })
      
      // Google Analytics
      if (window.gtag) {
        window.gtag('event', name, properties)
      }
      
      // Conversion funnel
      conversionFunnel.track(name as any, properties)
    }
    
    // Send to Sentry as breadcrumb
    Sentry.addBreadcrumb({
      message: name,
      data: properties,
      level: 'info',
    })
  }
  
  private alert(message: string, context: Record<string, any>) {
    // Send to Sentry
    Sentry.captureMessage(message, {
      level: 'warning',
      contexts: { custom: context },
    })
    
    // Send to webhook for Slack/Discord alerts
    if (process.env.MONITORING_WEBHOOK_URL) {
      fetch(process.env.MONITORING_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'alert',
          message,
          context,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error)
    }
  }
  
  private calculateEfficiencyScore(
    questionCount: number,
    duration: number,
    confidence: number
  ): number {
    const questionScore = questionCount <= 22 ? 100 : 
                         questionCount <= 25 ? 80 : 
                         questionCount <= 28 ? 60 : 40
    
    const durationScore = duration <= 900 ? 100 :    // 15 min
                         duration <= 1200 ? 80 :      // 20 min
                         duration <= 1500 ? 60 : 40   // 25 min
    
    const confidenceScore = confidence
    
    return Math.round((questionScore + durationScore + confidenceScore) / 3)
  }
  
  private async flush() {
    if (this.queue.length === 0) return
    
    const events = [...this.queue]
    this.queue = []
    
    try {
      // Batch send to analytics database
      await fetch('/api/metrics/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      })
    } catch (error) {
      // Re-queue on failure
      this.queue.unshift(...events)
      console.error('Failed to flush metrics:', error)
    }
  }
  
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flush()
  }
}

export const metricsCollector = new MetricsCollector()
```

### 21.2 Business Intelligence Dashboard

**File:** `app/admin/dashboard/page.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DashboardMetrics {
  // Real-time metrics
  activeSessions: number
  sessionsToday: number
  completionsToday: number
  
  // Conversion funnel
  funnelMetrics: {
    stage: string
    count: number
    rate: number
  }[]
  
  // Business model distribution
  businessModels: {
    model: string
    count: number
    percentage: number
  }[]
  
  // Feature adoption
  featureAdoption: {
    feature: string
    adoptionRate: number
    revenue: number
  }[]
  
  // Question efficiency
  questionEfficiency: {
    date: string
    average: number
    target: number
  }[]
  
  // Validation effectiveness
  validationStats: {
    loopNumber: number
    correctRate: number
    clarificationRate: number
  }[]
  
  // Performance metrics
  performance: {
    apiLatencyP95: number
    errorRate: number
    uptime: number
  }
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [refreshInterval, setRefreshInterval] = useState(30000) // 30 seconds
  
  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, refreshInterval)
    return () => clearInterval(interval)
  }, [refreshInterval])
  
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics')
      const data = await response.json()
      setMetrics(data)
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    }
  }
  
  if (!metrics) {
    return <div>Loading dashboard...</div>
  }
  
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Introspect V3 Dashboard</h1>
        <select 
          value={refreshInterval} 
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          className="border rounded px-3 py-1"
        >
          <option value={10000}>10s refresh</option>
          <option value={30000}>30s refresh</option>
          <option value={60000}>1m refresh</option>
          <option value={300000}>5m refresh</option>
        </select>
      </div>
      
      {/* Real-time Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeSessions}</div>
            <p className="text-xs text-gray-500">Current sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessionsToday}</div>
            <p className="text-xs text-gray-500">
              {metrics.completionsToday} completed ({Math.round((metrics.completionsToday / metrics.sessionsToday) * 100)}%)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">API Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance.apiLatencyP95}ms</div>
            <p className="text-xs text-gray-500">P95 latency</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.performance.uptime}%</div>
            <p className="text-xs text-gray-500">
              Error rate: {metrics.performance.errorRate}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.funnelMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rate" fill="#8884d8">
                <Cell fill="#10b981" /> {/* Green for good rates */}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Business Models & Features */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Business Model Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.businessModels}
                  dataKey="count"
                  nameKey="model"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.model}: ${entry.percentage}%`}
                >
                  {metrics.businessModels.map((entry, index) => (
                    <Cell key={index} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Feature Adoption Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.featureAdoption.slice(0, 5).map((feature) => (
                <div key={feature.feature} className="flex justify-between items-center">
                  <span className="text-sm">{feature.feature}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${feature.adoptionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{feature.adoptionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Question Efficiency Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Question Efficiency Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.questionEfficiency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="average" stroke="#8884d8" name="Average Questions" />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" name="Target (22)" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Validation Effectiveness */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Loop Effectiveness</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.validationStats.map((stat) => (
              <div key={stat.loopNumber} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Validation Loop {stat.loopNumber}</span>
                  <span>{stat.correctRate}% correct first time</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${stat.correctRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Correct</p>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stat.clarificationRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Needed clarification</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 21.3 Operations Runbook

**File:** `docs/OPERATIONS_RUNBOOK.md`

```markdown
# Introspect V3 Operations Runbook

## System Overview

**Application:** Introspect V3 - AI-Powered Client Intake System
**Version:** 3.2.0
**Infrastructure:** Render (Web), Supabase (Database), Anthropic (AI)
**Monitoring:** Sentry, PostHog, Custom Dashboard

## Daily Operations

### Morning Checks (9 AM)

1. **Health Check**
   ```bash
   curl https://introspect.applicreations.com/api/health
   ```

2. **Dashboard Review**
   - Visit: https://introspect.applicreations.com/admin/dashboard
   - Check:
     - [ ] Active sessions count normal
     - [ ] Conversion rates within targets
     - [ ] No critical alerts
     - [ ] API latency < 3s P95

3. **Error Review**
   - Check Sentry for new errors
   - Review any failed sessions
   - Check for prompt injection attempts

### Metrics to Monitor

#### Conversion Funnel Targets
- Landing → CTA Click: >60%
- CTA → Foundation Start: >90%
- Foundation → Conversation: >50%
- Conversation → Features: >70%
- Features → Complete: >60%

#### Business Model Classification
- Target: Classified by question 7 in >95% of sessions
- Alert if: Classification delayed or confidence <80%

#### Question Efficiency
- Target: Average 22 questions
- Warning: >25 average questions
- Critical: >28 average questions

#### Feature Adoption
- Target: >60% of recommended features selected
- Monitor: Which features are most/least adopted

## Emergency Procedures

### Site Down

1. **Check Render Status**
   ```bash
   render status --service introspect-v3
   ```

2. **Check Health Endpoint**
   ```bash
   curl -v https://introspect.applicreations.com/api/health
   ```

3. **Restart if Needed**
   ```bash
   render restart --service introspect-v3
   ```

4. **Check Dependencies**
   - Supabase: https://status.supabase.com
   - Anthropic: https://status.anthropic.com
   - Render: https://status.render.com

### High Error Rate

1. **Check Sentry**
   - Identify error pattern
   - Check for recent deployment

2. **Common Issues**
   - Claude API rate limiting → Reduce concurrent sessions
   - Database connection pool → Scale database
   - Memory issues → Check for memory leaks

3. **Rollback if Needed**
   ```bash
   render deploy --service introspect-v3 --commit [previous-commit]
   ```

### Claude API Issues

1. **Check API Key**
   ```bash
   curl -H "x-api-key: $ANTHROPIC_API_KEY" \
        -H "anthropic-version: 2023-06-01" \
        https://api.anthropic.com/v1/models
   ```

2. **Check Rate Limits**
   - Current limit: 60 requests/minute
   - Implement backoff if hitting limits

3. **Fallback Mode**
   - Enable cached responses
   - Reduce concurrent sessions
   - Queue overflow sessions

### Database Issues

1. **Connection Check**
   ```sql
   SELECT NOW();
   ```

2. **Performance Issues**
   - Check slow query log
   - Review indexes
   - Scale if needed

3. **Backup Recovery**
   - Automated backups every 6 hours
   - Point-in-time recovery available

## Monitoring Alerts

### Critical Alerts (Page immediately)
- Site down (health check fails)
- Error rate >5%
- API latency >10s
- Database connection failures
- Payment processing failures

### Warning Alerts (Check within 1 hour)
- Conversion rate drop >20%
- Question efficiency >28 average
- Business model classification delayed
- Feature adoption <40%
- Memory usage >90%

### Info Alerts (Daily review)
- New error types
- Unusual traffic patterns
- Low adoption features
- Validation clarification rates

## Performance Tuning

### Database Optimization
```sql
-- Check slow queries
SELECT query, calls, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Update statistics
ANALYZE;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan;
```

### Application Optimization
- Enable caching for common queries
- Implement connection pooling
- Use CDN for static assets
- Optimize bundle size

## Security Procedures

### Daily Security Checks
- Review authentication logs
- Check for unusual API usage
- Monitor for prompt injection attempts
- Verify encryption is working

### Weekly Security Tasks
- Update dependencies
- Review access logs
- Check SSL certificate expiry
- Audit user permissions

### Incident Response
1. Isolate affected systems
2. Preserve logs
3. Notify stakeholders
4. Document timeline
5. Implement fixes
6. Post-mortem review

## Backup and Recovery

### Backup Schedule
- Database: Every 6 hours
- Code: Git repository (continuous)
- Environment: Weekly snapshots

### Recovery Procedures
1. **Database Recovery**
   ```bash
   supabase db restore --backup [backup-id]
   ```

2. **Application Recovery**
   ```bash
   git checkout [last-known-good]
   render deploy --service introspect-v3
   ```

3. **Session Recovery**
   - Magic links valid for 48 hours
   - Sessions persist in localStorage
   - Cloud sync every 5 messages

## Maintenance Windows

### Scheduled Maintenance
- Time: Sunday 2-4 AM PST
- Notification: 48 hours advance
- Procedure:
  1. Enable maintenance mode
  2. Perform updates
  3. Run health checks
  4. Disable maintenance mode

### Emergency Maintenance
- Notification: Immediate via status page
- Maximum duration: 2 hours
- Rollback plan required

## Contact Information

### Escalation Path
1. On-call engineer
2. Lead developer (David Moore)
3. CTO
4. External support (Anthropic, Render)

### Key Contacts
- David Moore: david@applicreations.com
- Render Support: support@render.com
- Anthropic Support: support@anthropic.com
- Supabase Support: support@supabase.com

### Communication Channels
- Status Page: https://status.applicreations.com
- Internal: Slack #introspect-alerts
- Customer: Email to affected users

## Success Metrics

### Daily KPIs
- Sessions started
- Completion rate
- Average question count
- Feature adoption rate
- Document generation success

### Weekly KPIs
- Conversion funnel performance
- Business model classification accuracy
- Validation effectiveness
- Question efficiency trends
- Revenue impact

### Monthly KPIs
- Total projects generated
- Customer satisfaction
- System uptime
- Cost per session
- ROI metrics

---

**Last Updated:** November 2025
**Version:** 3.2.0
**Next Review:** December 2025
```

---

## Deployment Checklist

### Pre-Deployment ✅
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Monitoring configured
- [ ] Rollback plan prepared

### Deployment ✅
- [ ] Tag release in Git
- [ ] Deploy to Render
- [ ] Health check passing
- [ ] Smoke tests passing
- [ ] Monitoring active
- [ ] Alerts configured

### Post-Deployment ✅
- [ ] Dashboard accessible
- [ ] Metrics flowing
- [ ] Error rate normal
- [ ] Performance acceptable
- [ ] User flow working
- [ ] Documentation updated

---

## Success Criteria

✅ Production deployment live and stable  
✅ All V3.2 features deployed successfully  
✅ Health monitoring comprehensive  
✅ Business intelligence dashboard functional  
✅ Real-time alerting configured  
✅ Operations runbook complete  
✅ Team trained on procedures  
✅ Rollback procedures tested  
✅ Security measures active  
✅ Performance within targets  

---

## Conclusion

Introspect V3 is now fully deployed with comprehensive monitoring covering:
- Business model classification tracking
- Feature recommendation effectiveness
- Question efficiency optimization
- Validation loop performance
- Complete conversion funnel analytics
- Real-time alerting and dashboards

The system is ready for production use with all V3.2 architectural principles implemented and monitored.
