// Job API Integration System
// Supports multiple job board APIs for comprehensive job data

interface JobListing {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  salary: string;
  datePosted: string;
  description: string;
  tags: string[];
  applyUrl: string;
  source: 'linkedin' | 'indeed' | 'glassdoor' | 'rapidapi' | 'manual';
}

interface JobApiConfig {
  rapidApiKey?: string;
  jsearchApiKey?: string;
  linkedinPartnerToken?: string;
}

class JobApiManager {
  private config: JobApiConfig;
  private rateLimiter: Map<string, number> = new Map();

  constructor(config: JobApiConfig) {
    this.config = config;
  }

  // Rate limiting helper
  private checkRateLimit(apiName: string, maxRequests: number = 100): boolean {
    const now = Date.now();
    const lastRequest = this.rateLimiter.get(apiName) || 0;
    const timeDiff = now - lastRequest;
    
    // Reset if more than 1 hour has passed
    if (timeDiff > 3600000) {
      this.rateLimiter.set(apiName, 0);
      return true;
    }
    
    const currentCount = this.rateLimiter.get(`${apiName}_count`) || 0;
    if (currentCount >= maxRequests) {
      return false;
    }
    
    this.rateLimiter.set(`${apiName}_count`, currentCount + 1);
    this.rateLimiter.set(apiName, now);
    return true;
  }

  // JSearch API Integration (RapidAPI)
  async fetchJobsFromJSearch(query: string, location: string = 'UK'): Promise<JobListing[]> {
    if (!this.config.jsearchApiKey || !this.checkRateLimit('jsearch', 50)) {
      
      return [];
    }

    try {
      // Force UK-specific search with multiple location parameters
      const ukQuery = `${query} in United Kingdom`;
      const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(ukQuery)}&page=1&num_pages=2&date_posted=week&country=GB&employment_types=FULLTIME%2CPARTTIME%2CCONTRACT`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.config.jsearchApiKey,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`JSearch API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformJSearchData(data.data || []);
    } catch (error) {
      
      return [];
    }
  }

  // Transform JSearch data to our format
  private transformJSearchData(jobs: any[]): JobListing[] {
    return jobs
      .filter((job: any) => {
        // Filter out non-UK jobs
        const location = job.job_city && job.job_country ? `${job.job_city}, ${job.job_country}` : job.job_country || '';
        const isUK = location.toLowerCase().includes('united kingdom') || 
                    location.toLowerCase().includes('uk') ||
                    location.toLowerCase().includes('england') ||
                    location.toLowerCase().includes('scotland') ||
                    location.toLowerCase().includes('wales') ||
                    location.toLowerCase().includes('london') ||
                    location.toLowerCase().includes('manchester') ||
                    location.toLowerCase().includes('birmingham') ||
                    location.toLowerCase().includes('glasgow') ||
                    location.toLowerCase().includes('liverpool') ||
                    location.toLowerCase().includes('leeds') ||
                    location.toLowerCase().includes('bristol') ||
                    location.toLowerCase().includes('sheffield') ||
                    location.toLowerCase().includes('edinburgh') ||
                    location.toLowerCase().includes('cardiff');
        
        return isUK;
      })
      .map((job: any) => ({
        id: `jsearch_${job.job_id || Math.random().toString(36).substr(2, 9)}`,
        title: job.job_title || 'Job Title',
        companyName: job.employer_name || 'Company',
        companyLogo: this.getCompanyEmoji(job.employer_name),
        location: this.formatUKLocation(job.job_city, job.job_country),
        salary: this.formatSalary(job.job_salary),
        datePosted: this.formatDate(job.job_posted_at_datetime_utc),
        description: this.truncateDescription(job.job_description || 'No description available'),
        tags: this.extractTags(job.job_title, job.job_description),
        applyUrl: job.job_apply_link || '#',
        source: 'rapidapi'
      }));
  }

  // Indeed Jobs API (via RapidAPI)
  async fetchJobsFromIndeed(query: string, location: string = 'UK'): Promise<JobListing[]> {
    if (!this.config.rapidApiKey || !this.checkRateLimit('indeed', 30)) {
      
      return [];
    }

    try {
      // Force UK location and add UK-specific parameters
      const ukLocation = location === 'UK' ? 'United Kingdom' : `${location}, UK`;
      const response = await fetch(`https://indeed12.p.rapidapi.com/jobs/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(ukLocation)}&page_id=1&locality=uk&country=uk`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.config.rapidApiKey,
          'X-RapidAPI-Host': 'indeed12.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`Indeed API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformIndeedData(data.hits || []);
    } catch (error) {
      
      return [];
    }
  }

  // Transform Indeed data to our format
  private transformIndeedData(jobs: any[]): JobListing[] {
    return jobs
      .filter((job: any) => {
        // Filter out non-UK jobs
        const location = job.location || '';
        const isUK = location.toLowerCase().includes('united kingdom') || 
                    location.toLowerCase().includes('uk') ||
                    location.toLowerCase().includes('england') ||
                    location.toLowerCase().includes('scotland') ||
                    location.toLowerCase().includes('wales') ||
                    !location.toLowerCase().includes('united states') &&
                    !location.toLowerCase().includes('usa') &&
                    !location.toLowerCase().includes('canada') &&
                    !location.toLowerCase().includes('australia');
        
        return isUK;
      })
      .map((job: any) => ({
        id: `indeed_${job.id || Math.random().toString(36).substr(2, 9)}`,
        title: job.title || 'Job Title',
        companyName: job.company || 'Company',
        companyLogo: this.getCompanyEmoji(job.company),
        location: this.formatUKLocation(job.location || '', ''),
        salary: this.formatSalary(job.salary),
        datePosted: this.formatDate(job.pub_date),
        description: this.truncateDescription(job.snippet || 'No description available'),
        tags: this.extractTags(job.title, job.snippet),
        applyUrl: job.url || '#',
        source: 'indeed'
      }));
  }

  // LinkedIn Jobs (if partnership access is available)
  async fetchJobsFromLinkedIn(query: string, location: string = 'United Kingdom'): Promise<JobListing[]> {
    if (!this.config.linkedinPartnerToken || !this.checkRateLimit('linkedin', 1000)) {
      
      return [];
    }

    try {
      // Note: This requires LinkedIn Partner API access
      const response = await fetch(`https://api.linkedin.com/v2/jobSearch?keywords=${encodeURIComponent(query)}&locationId=102257491&start=0&count=25`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.linkedinPartnerToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformLinkedInData(data.elements || []);
    } catch (error) {
      
      return [];
    }
  }

  // Transform LinkedIn data to our format
  private transformLinkedInData(jobs: any[]): JobListing[] {
    return jobs.map((job: any) => ({
      id: `linkedin_${job.id || Math.random().toString(36).substr(2, 9)}`,
      title: job.title || 'Job Title',
      companyName: job.companyDetails?.company || 'Company',
      companyLogo: this.getCompanyEmoji(job.companyDetails?.company),
      location: this.formatUKLocation(job.formattedLocation || '', ''),
      salary: 'Competitive', // LinkedIn often doesn't provide salary in search results
      datePosted: this.formatDate(job.listedAt),
      description: this.truncateDescription(job.description?.text || 'No description available'),
      tags: this.extractTags(job.title, job.description?.text),
      applyUrl: `https://www.linkedin.com/jobs/view/${job.id}/`,
      source: 'linkedin'
    }));
  }

  // Aggregate jobs from all available sources
  async fetchAllJobs(query: string, location: string = 'UK'): Promise<JobListing[]> {
    
    
    const promises = [
      this.fetchJobsFromJSearch(query, location),
      this.fetchJobsFromIndeed(query, location),
      this.fetchJobsFromLinkedIn(query, location)
    ];

    try {
      const results = await Promise.allSettled(promises);
      const allJobs: JobListing[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allJobs.push(...result.value);
          
        } else {
          
        }
      });

      // Remove duplicates based on title and company
      const uniqueJobs = this.removeDuplicates(allJobs);
      
      
      return uniqueJobs;
    } catch (error) {
      
      return [];
    }
  }

  // Remove duplicate jobs
  private removeDuplicates(jobs: JobListing[]): JobListing[] {
    const seen = new Set();
    return jobs.filter(job => {
      const key = `${job.title.toLowerCase()}_${job.companyName.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Helper functions
  private getCompanyEmoji(companyName: string): string {
    const emojiMap: { [key: string]: string } = {
      'McDonald\'s': '🍔',
      'Boots': '💊',
      'Tesco': '🛒',
      'Sainsbury\'s': '🛍️',
      'ASDA': '🏪',
      'Morrisons': '🥬',
      'Costa Coffee': '☕',
      'Starbucks': '☕',
      'Amazon': '📦',
      'Google': '🔍',
      'Microsoft': '💻',
      'Apple': '🍎',
      'Meta': '📘',
      'Netflix': '🎬',
      'Uber': '🚗',
      'Deliveroo': '🍕',
      'Just Eat': '🍔'
    };
    
    return emojiMap[companyName] || '🏢';
  }

  private formatDate(dateString: string | number): string {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return 'Recently';
    }
  }

  private extractTags(title: string, description: string): string[] {
    const text = `${title} ${description}`.toLowerCase();
    const commonTags = [
      'remote', 'full-time', 'part-time', 'contract', 'temporary',
      'senior', 'junior', 'graduate', 'internship', 'apprentice',
      'manager', 'lead', 'director', 'assistant', 'coordinator',
      'javascript', 'python', 'react', 'node', 'sql', 'aws',
      'marketing', 'sales', 'customer service', 'finance', 'hr',
      'retail', 'hospitality', 'healthcare', 'education', 'engineering'
    ];
    
    return commonTags.filter(tag => text.includes(tag)).slice(0, 5);
  }

  // Format UK-specific location
  private formatUKLocation(city: string, country: string): string {
    if (!city && !country) return 'UK';
    if (!city) return country.includes('United Kingdom') ? 'UK' : country;
    if (!country) return city;
    
    // Clean up common UK location formats
    if (country.toLowerCase().includes('united kingdom') || country.toLowerCase() === 'uk') {
      return city;
    }
    
    return `${city}, UK`;
  }

  // Format salary to UK format
  private formatSalary(salary: string | null): string {
    if (!salary) return 'Competitive';
    
    // Convert USD to GBP roughly and format
    const salaryStr = salary.toString();
    
    // If it's already in GBP format, return as is
    if (salaryStr.includes('£')) return salaryStr;
    
    // If it contains USD, try to convert
    if (salaryStr.includes('$')) {
      const numbers = salaryStr.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        const usdAmount = parseInt(numbers[0]);
        const gbpAmount = Math.round(usdAmount * 0.8); // Rough conversion
        return `£${gbpAmount.toLocaleString()}`;
      }
    }
    
    // If it's just numbers, assume it's annual salary
    const numbers = salaryStr.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      const amount = parseInt(numbers[0]);
      if (amount > 1000) {
        return `£${amount.toLocaleString()}`;
      }
    }
    
    return 'Competitive';
  }

  // Truncate long descriptions
  private truncateDescription(description: string): string {
    if (!description) return 'No description available';
    
    // Remove excessive whitespace and clean up
    const cleaned = description
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.,!?-]/g, '')
      .trim();
    
    // Limit to 200 characters with word boundary
    if (cleaned.length <= 200) return cleaned;
    
    const truncated = cleaned.substring(0, 200);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > 150) {
      return truncated.substring(0, lastSpace) + '...';
    }
    
    return truncated + '...';
  }
}

export { JobApiManager, type JobListing, type JobApiConfig };

