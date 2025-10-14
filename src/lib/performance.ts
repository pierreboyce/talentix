import React from 'react';

/**
 * Performance monitoring utilities for tracking metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'timing' | 'counter' | 'gauge';
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private measurements = new Map<string, number>();

  /**
   * Start measuring a performance metric
   * @param name - Name of the measurement
   */
  startMeasure(name: string): void {
    this.measurements.set(name, performance.now());
  }

  /**
   * End measuring and record the metric
   * @param name - Name of the measurement
   */
  endMeasure(name: string): number | null {
    const startTime = this.measurements.get(name);
    if (!startTime) {
      
      return null;
    }

    const duration = performance.now() - startTime;
    this.measurements.delete(name);
    
    this.logMetric(name, duration, 'timing');
    return duration;
  }

  /**
   * Log a performance metric
   * @param name - Metric name
   * @param value - Metric value
   * @param type - Type of metric
   */
  logMetric(name: string, value: number, type: PerformanceMetric['type'] = 'gauge'): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type,
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      
    }
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics by name
   * @param name - Metric name to filter by
   */
  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  /**
   * Get average value for a metric
   * @param name - Metric name
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.length = 0;
    this.measurements.clear();
  }

  /**
   * Get performance summary
   */
  getSummary() {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);
    
    const recentMetrics = this.metrics.filter(m => m.timestamp > lastHour);
    
    const summary = {
      totalMetrics: this.metrics.length,
      recentMetrics: recentMetrics.length,
      averageResponseTime: this.getAverageMetric('api_response_time'),
      averageRenderTime: this.getAverageMetric('component_render_time'),
    };

    return summary;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React Hook for measuring component render performance
 */
export function usePerformanceTracking(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      performanceMonitor.logMetric(`${componentName}_render_time`, renderTime, 'timing');
    };
  }, [componentName]);
}

/**
 * Higher-order component for automatic performance tracking
 */
export function withPerformanceTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithPerformanceTracking = (props: P) => {
    usePerformanceTracking(displayName);
    return React.createElement(WrappedComponent, props);
  };

  WithPerformanceTracking.displayName = `withPerformanceTracking(${displayName})`;
  
  return WithPerformanceTracking;
}

// Web Vitals tracking (if available)
if (typeof window !== 'undefined') {
  // Track Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        performanceMonitor.logMetric(entry.name, entry.duration, 'timing');
      } else if (entry.entryType === 'navigation') {
        const navEntry = entry as PerformanceNavigationTiming;
        performanceMonitor.logMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart, 'timing');
      }
    }
  });

  try {
    observer.observe({ entryTypes: ['measure', 'navigation'] });
  } catch (e) {
    // Browser doesn't support these entry types
    
  }
}