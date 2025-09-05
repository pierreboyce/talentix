"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePoints } from '../../contexts/PointsContext';
import { useQuests } from '../../contexts/QuestContext';
import { ArrowLeft, Search, MapPin, Clock, Star, ExternalLink, Filter, Briefcase, DollarSign } from 'lucide-react';

interface JobResult {
  id: string;
  companyName: string;
  companyLogo: string;
  jobTitle: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  postedDate: string;
  rating: number;
  applyLink: string;
  tags: string[];
}

export default function SearchPage() {
  const router = useRouter();
  const { addPoints } = usePoints(); // Use shared points context
  const { updateQuestProgress } = useQuests(); // Use quest system
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Track job clicks and award points
  const trackJobClick = async (job: any) => {
    try {
      // Award points immediately
      addPoints(10, `Applied to ${job.companyName}`);
      
      // Update quest progress
      updateQuestProgress('job_explorer', 1);
      updateQuestProgress('job_application_spree', 1);
      updateQuestProgress('job_seeker', 1);
      
      // Track on backend
      await fetch('/api/jobs/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: `${job.companyName}-${job.title}`,
          jobTitle: job.title,
          company: job.companyName
        })
      });
    } catch (error) {
      console.error('Error tracking job click:', error);
    }
  };

  // Function to generate correct apply links for each company
  const getApplyLink = (companyName: string): string => {
    const companyLinks: { [key: string]: string } = {
      "McDonald's": "https://people.mcdonalds.co.uk/",
      "Boots": "https://jobs.boots.com/",
      "Tesco": "https://www.tesco-careers.com/search-and-apply/",
      "Costa Coffee": "https://www.costa.co.uk/careers/",
      "Sainsbury's": "https://sainsburys.jobs/",
      "Next": "https://www.next.co.uk/careers/",
      "Primark": "https://www.primark.com/careers/",
      "IKEA": "https://careers.ikea.co.uk/",
      "Starbucks": "https://www.starbucks.co.uk/careers/",
      "Greggs": "https://www.greggs.co.uk/careers/"
    };

    return companyLinks[companyName] || `https://www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/careers/`;
  };

  // Job database with popular companies
  const jobDatabase: JobResult[] = [
    // McDonald's Jobs
    { id: 'mc1', companyName: "McDonald's", companyLogo: '🍟', jobTitle: 'Crew Member', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Join our amazing team to create great customer experiences. Flexible hours, training provided, and opportunities to progress your career.', postedDate: '2 days ago', rating: 4.2, applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/part-time-crew-member', tags: ['entry-level', 'flexible-hours', 'training-provided'] },
    { id: 'mc2', companyName: "McDonald's", companyLogo: '🍟', jobTitle: 'Shift Manager', location: 'London, Birmingham', salary: '£11.50-£13.00/hr', type: 'Full-time', description: 'Lead a team and help run our restaurant. Great stepping stone to management with full training and development programs.', postedDate: '1 week ago', rating: 4.2, applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/shift-manager', tags: ['management', 'leadership', 'career-progression'] },
    
    // Boots Jobs
    { id: 'bt1', companyName: 'Boots', companyLogo: '💊', jobTitle: 'Customer Advisor', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Help customers find the right products and make their shopping experience exceptional. Join the UK\'s leading health and beauty retailer.', postedDate: '1 day ago', rating: 4.1, applyLink: 'https://www.boots.jobs/retail/customer-advisor/', tags: ['health-beauty', 'customer-service', 'retail'] },
    { id: 'bt2', companyName: 'Boots', companyLogo: '💊', jobTitle: 'Beauty Advisor', location: 'London, Manchester', salary: '£9.50-£12.00/hr', type: 'Full-time', description: 'Share your passion for beauty and help customers discover new products. Full training provided with amazing staff discounts.', postedDate: '4 days ago', rating: 4.1, applyLink: 'https://www.boots.jobs/retail/beauty-advisor/', tags: ['beauty', 'training-provided', 'staff-discount'] },
    
    // Tesco Jobs
    { id: 'ts1', companyName: 'Tesco', companyLogo: '🛒', jobTitle: 'Customer Assistant', location: 'Nationwide', salary: '£9.00-£11.50/hr', type: 'Part-time', description: 'Become the friendly face of our store, helping customers and ensuring shelves are perfectly stocked.', postedDate: '2 days ago', rating: 4.0, applyLink: 'https://www.tesco-careers.com/search-and-apply/', tags: ['customer-service', 'stocking', 'nationwide'] },
    { id: 'ts2', companyName: 'Tesco', companyLogo: '🛒', jobTitle: 'Online Picker', location: 'London, Birmingham', salary: '£9.50-£12.00/hr', type: 'Full-time', description: 'Help customers get their groceries by picking their online orders. Fast-paced role with great team spirit.', postedDate: '1 day ago', rating: 4.0, applyLink: 'https://www.tesco-careers.com/search-and-apply/', tags: ['online-shopping', 'fast-paced', 'teamwork'] },
    
    // Costa Coffee Jobs
    { id: 'cc1', companyName: 'Costa Coffee', companyLogo: '☕', jobTitle: 'Barista', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Create the perfect coffee experience for our customers. Full training provided with flexible scheduling.', postedDate: '1 day ago', rating: 4.3, applyLink: 'https://www.costa.co.uk/careers/barista', tags: ['coffee', 'training-provided', 'flexible-schedule'] },
    { id: 'cc2', companyName: 'Costa Coffee', companyLogo: '☕', jobTitle: 'Shift Supervisor', location: 'London, Manchester', salary: '£10.00-£12.50/hr', type: 'Full-time', description: 'Lead a team of baristas and ensure excellent customer service. Leadership experience preferred but not essential.', postedDate: '5 days ago', rating: 4.3, applyLink: 'https://www.costa.co.uk/careers/supervisor', tags: ['leadership', 'coffee', 'team-management'] },

    // Sainsbury's Jobs
    { id: 'sb1', companyName: "Sainsbury's", companyLogo: '🛍️', jobTitle: 'Sales Assistant', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Help customers find what they need and keep our store looking great. Weekend and evening shifts available.', postedDate: '2 days ago', rating: 4.1, applyLink: 'https://sainsburys.jobs/retail/sales-assistant', tags: ['sales', 'weekend-shifts', 'evening-shifts'] },
    
    // Next Jobs
    { id: 'nx1', companyName: 'Next', companyLogo: '👕', jobTitle: 'Sales Associate', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Join our fashion team and help customers find their perfect style. Great staff discount and flexible hours.', postedDate: '3 days ago', rating: 4.0, applyLink: 'https://www.next.co.uk/careers/retail-sales-associate', tags: ['fashion', 'staff-discount', 'style'] },
    
    // Starbucks Jobs
    { id: 'st1', companyName: 'Starbucks', companyLogo: '🌟', jobTitle: 'Barista', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Create the Starbucks experience for our customers. Comprehensive training and great benefits package.', postedDate: '1 day ago', rating: 4.2, applyLink: 'https://www.starbucks.co.uk/careers/barista', tags: ['coffee', 'training', 'benefits'] },
    
    // Greggs Jobs
    { id: 'gr1', companyName: 'Greggs', companyLogo: '🥖', jobTitle: 'Customer Assistant', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Serve our famous sausage rolls and sandwiches to hungry customers. Fast-paced but rewarding work.', postedDate: '2 days ago', rating: 4.0, applyLink: 'https://www.greggs.co.uk/careers/customer-assistant', tags: ['food-service', 'fast-paced', 'customer-service'] },

    // IKEA Jobs
    { id: 'ik1', companyName: 'IKEA', companyLogo: '🏠', jobTitle: 'Sales Co-worker', location: 'Multiple Locations', salary: '£9.50-£12.00/hr', type: 'Part-time', description: 'Help customers create their dream homes with our furniture and accessories. Passion for home design helpful.', postedDate: '2 days ago', rating: 4.2, applyLink: 'https://careers.ikea.co.uk/sales-co-worker', tags: ['home-design', 'furniture', 'customer-help'] },

    // Primark Jobs
    { id: 'pk1', companyName: 'Primark', companyLogo: '👗', jobTitle: 'Sales Assistant', location: 'Nationwide', salary: '£8.50-£9.50/hr', type: 'Part-time', description: 'Help customers find affordable fashion and keep our store looking its best. Flexible hours available.', postedDate: '2 days ago', rating: 3.8, applyLink: 'https://www.primark.com/careers/retail-sales-assistant', tags: ['fashion', 'affordable', 'flexible-hours'] },
    
    // Additional popular companies
    { id: 'pk2', companyName: 'Primark', companyLogo: '👗', jobTitle: 'Stock Replenisher', location: 'Birmingham, Leeds', salary: '£8.50-£9.50/hr', type: 'Part-time', description: 'Keep our stores fully stocked with the latest fashion trends. Fast-paced environment with great team spirit.', postedDate: '1 day ago', rating: 3.8, applyLink: 'https://www.primark.com/careers/stock-replenisher', tags: ['stocking', 'fast-paced', 'teamwork'] },
    
    { id: 'ar1', companyName: 'Argos', companyLogo: '📦', jobTitle: 'Customer Assistant', location: 'Multiple Locations', salary: '£9.00-£10.50/hr', type: 'Part-time', description: 'Help customers collect their orders and provide excellent service. Product knowledge training provided.', postedDate: '1 day ago', rating: 3.9, applyLink: 'https://www.argos.co.uk/careers/customer-assistant', tags: ['customer-service', 'product-knowledge', 'training'] },
    
    { id: 'cu1', companyName: 'Currys', companyLogo: '💻', jobTitle: 'Sales Advisor', location: 'Multiple Locations', salary: '£18,000-£22,000/yr', type: 'Full-time', description: 'Help customers find the perfect technology products. Commission and bonuses available for top performers.', postedDate: '3 days ago', rating: 3.8, applyLink: 'https://www.currys.co.uk/careers/sales-advisor', tags: ['technology', 'commission', 'sales'] },
    
    { id: 'jl1', companyName: 'John Lewis', companyLogo: '🏬', jobTitle: 'Sales Partner', location: 'Multiple Locations', salary: '£20,000-£25,000/yr', type: 'Full-time', description: 'Join our partnership and help customers with their shopping needs. Excellent benefits and staff discount.', postedDate: '4 days ago', rating: 4.3, applyLink: 'https://www.johnlewispartnership.co.uk/careers/sales-partner', tags: ['partnership', 'benefits', 'customer-service'] },
    
    { id: 'ms1', companyName: 'Marks & Spencer', companyLogo: '🍃', jobTitle: 'Customer Assistant', location: 'Multiple Locations', salary: '£9.50-£11.50/hr', type: 'Part-time', description: 'Help customers in our food halls and clothing departments. Flexible hours and staff discount available.', postedDate: '2 days ago', rating: 4.0, applyLink: 'https://careers.marksandspencer.com/customer-assistant', tags: ['food-retail', 'clothing', 'flexible-hours'] },
    
    { id: 'hm1', companyName: 'H&M', companyLogo: '👚', jobTitle: 'Sales Advisor', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Share your passion for fashion and help customers find their perfect look. Staff discount and flexible hours.', postedDate: '1 day ago', rating: 3.9, applyLink: 'https://career.hm.com/sales-advisor', tags: ['fashion', 'passion', 'staff-discount'] },
    
    { id: 'za1', companyName: 'Zara', companyLogo: '🖤', jobTitle: 'Sales Assistant', location: 'London, Birmingham', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Join our fast-fashion team and help customers stay on-trend. Dynamic environment with growth opportunities.', postedDate: '2 days ago', rating: 3.7, applyLink: 'https://www.zara.com/careers/sales-assistant', tags: ['fast-fashion', 'trends', 'dynamic'] },
    
    { id: 'wa1', companyName: 'Waterstones', companyLogo: '📚', jobTitle: 'Bookseller', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Share your love of books with customers and help them discover their next great read. Book lover\'s paradise!', postedDate: '3 days ago', rating: 4.1, applyLink: 'https://www.waterstones.com/careers/bookseller', tags: ['books', 'reading', 'recommendations'] },
    
    { id: 'wh1', companyName: 'WHSmith', companyLogo: '📰', jobTitle: 'Sales Assistant', location: 'Multiple Locations', salary: '£8.50-£9.50/hr', type: 'Part-time', description: 'Help customers with newspapers, magazines, and stationery. Perfect for students with flexible scheduling.', postedDate: '1 day ago', rating: 3.8, applyLink: 'https://www.whsmith.co.uk/careers/sales-assistant', tags: ['newspapers', 'stationery', 'student-friendly'] },
    
    { id: 'pl1', companyName: 'Poundland', companyLogo: '💷', jobTitle: 'Customer Assistant', location: 'Multiple Locations', salary: '£8.50-£9.50/hr', type: 'Part-time', description: 'Help customers find amazing value products. Fast-paced environment with opportunities to progress.', postedDate: '2 days ago', rating: 3.6, applyLink: 'https://www.poundland.co.uk/careers/customer-assistant', tags: ['value-retail', 'fast-paced', 'progression'] },
    
    { id: 'bm1', companyName: 'B&M', companyLogo: '🏪', jobTitle: 'Sales Assistant', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Join our growing retail team and help customers find great value products. Flexible hours available.', postedDate: '1 day ago', rating: 3.7, applyLink: 'https://www.bmstores.co.uk/careers/sales-assistant', tags: ['retail', 'value', 'flexible-hours'] },
    
    { id: 'sd1', companyName: 'Sports Direct', companyLogo: '⚽', jobTitle: 'Sales Assistant', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Help sports enthusiasts find the perfect gear. Sports knowledge helpful but not essential.', postedDate: '3 days ago', rating: 3.5, applyLink: 'https://www.sportsdirect.com/careers/sales-assistant', tags: ['sports', 'gear', 'enthusiasts'] },
    
    { id: 'jd1', companyName: 'JD Sports', companyLogo: '👟', jobTitle: 'Sales Associate', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Share your passion for sports and streetwear with customers. Great staff discount on latest brands.', postedDate: '2 days ago', rating: 3.8, applyLink: 'https://www.jdsports.co.uk/careers/sales-associate', tags: ['sports', 'streetwear', 'brands'] },
    
    { id: 'ga1', companyName: 'GAME', companyLogo: '🎮', jobTitle: 'Sales Assistant', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Help gaming enthusiasts find the latest games and consoles. Gaming knowledge and passion essential.', postedDate: '1 day ago', rating: 3.9, applyLink: 'https://www.game.co.uk/careers/sales-assistant', tags: ['gaming', 'consoles', 'passion'] },
    
    { id: 'kf1', companyName: 'KFC', companyLogo: '🍗', jobTitle: 'Team Member', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Be part of the Original Recipe team! Fast-paced kitchen and customer service roles available.', postedDate: '1 day ago', rating: 3.8, applyLink: 'https://www.kfc.co.uk/careers/team-member', tags: ['fast-food', 'kitchen', 'customer-service'] },
    
    { id: 'bk1', companyName: 'Burger King', companyLogo: '🍔', jobTitle: 'Crew Member', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Join the Home of the Whopper! Kitchen and front-of-house positions available with flexible hours.', postedDate: '2 days ago', rating: 3.5, applyLink: 'https://www.burgerking.co.uk/careers/crew-member', tags: ['fast-food', 'kitchen', 'flexible-hours'] },
    
    { id: 'sw1', companyName: 'Subway', companyLogo: '🥙', jobTitle: 'Sandwich Artist', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Create delicious customized subs for customers. Food preparation training provided.', postedDate: '2 days ago', rating: 3.6, applyLink: 'https://www.subway.com/careers/sandwich-artist', tags: ['food-prep', 'customization', 'training'] },
    
    { id: 'do1', companyName: "Domino's", companyLogo: '🍕', jobTitle: 'In-Store Team Member', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Help create amazing pizzas and provide great customer service. Fast-paced and fun environment.', postedDate: '1 day ago', rating: 3.7, applyLink: 'https://www.dominos.co.uk/careers/in-store-team', tags: ['pizza', 'fast-paced', 'fun'] },
    
    { id: 'pz1', companyName: 'Pizza Hut', companyLogo: '🍕', jobTitle: 'Team Member', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Join our pizza-loving team and help create memorable dining experiences. Flexible scheduling available.', postedDate: '3 days ago', rating: 3.6, applyLink: 'https://www.pizzahut.co.uk/careers/team-member', tags: ['pizza', 'dining', 'flexible'] },
    
    { id: 'na1', companyName: "Nando's", companyLogo: '🐔', jobTitle: 'Team Member', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Bring the PERi-PERi passion to our customers! Fun, energetic environment with great team spirit.', postedDate: '3 days ago', rating: 4.0, applyLink: 'https://www.nandos.co.uk/careers/team-member', tags: ['energetic', 'team-spirit', 'fun'] },
    
    { id: 'pi1', companyName: 'Premier Inn', companyLogo: '🏨', jobTitle: 'Receptionist', location: 'Multiple Locations', salary: '£18,000-£22,000/yr', type: 'Full-time', description: 'Provide excellent customer service to our hotel guests. Shift work including evenings and weekends.', postedDate: '1 week ago', rating: 4.0, applyLink: 'https://www.premierinn.com/careers/receptionist', tags: ['hospitality', 'shift-work', 'customer-service'] },
    
    { id: 'ci1', companyName: 'Cineworld', companyLogo: '🎬', jobTitle: 'Cinema Assistant', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Help movie lovers enjoy their cinema experience. Evening and weekend shifts available.', postedDate: '2 days ago', rating: 3.9, applyLink: 'https://www.cineworld.co.uk/careers/cinema-assistant', tags: ['cinema', 'movies', 'evening-shifts'] },
    
    { id: 'sn1', companyName: 'Superdrug', companyLogo: '💄', jobTitle: 'Beauty Advisor', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Share your passion for beauty and help customers look and feel their best. Training and discounts provided.', postedDate: '1 day ago', rating: 4.0, applyLink: 'https://www.superdrug.com/careers/beauty-advisor', tags: ['beauty', 'cosmetics', 'training'] },
    
    { id: 'hb1', companyName: 'Holland & Barrett', companyLogo: '🌿', jobTitle: 'Health Advisor', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Help customers with their health and wellness journey. Product knowledge training provided.', postedDate: '3 days ago', rating: 3.9, applyLink: 'https://www.hollandandbarrett.com/careers/health-advisor', tags: ['health', 'wellness', 'product-knowledge'] },
    
    { id: 'pa1', companyName: 'Pets at Home', companyLogo: '🐕', jobTitle: 'Customer Assistant', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Help pet owners find everything they need for their furry friends. Animal lover\'s dream job!', postedDate: '2 days ago', rating: 4.2, applyLink: 'https://www.petsathome.com/careers/customer-assistant', tags: ['pets', 'animals', 'pet-care'] },
    
    { id: 'pr1', companyName: 'Pret A Manger', companyLogo: '🥪', jobTitle: 'Team Member', location: 'London, Manchester', salary: '£9.50-£11.50/hr', type: 'Part-time', description: 'Join our passionate team creating fresh, natural food. Great benefits and career progression opportunities.', postedDate: '1 day ago', rating: 4.1, applyLink: 'https://www.pret.co.uk/careers/team-member', tags: ['fresh-food', 'natural', 'benefits'] }
  ];

  // Helper function to normalize text for flexible searching
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[''`]/g, '') // Remove apostrophes and quotes
      .replace(/[&]/g, 'and') // Convert & to 'and'
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  };

  // Helper function to check if text contains search term with fuzzy matching
  const fuzzyMatch = (text: string, searchTerm: string): boolean => {
    const normalizedText = normalizeText(text);
    const normalizedSearch = normalizeText(searchTerm);
    
    // Exact match after normalization
    if (normalizedText.includes(normalizedSearch)) return true;
    
    // Split search term into words and check if all words are present
    const searchWords = normalizedSearch.split(' ').filter(word => word.length > 0);
    if (searchWords.length > 1) {
      return searchWords.every(word => normalizedText.includes(word));
    }
    
    // For single words, also check partial matches for company names
    if (searchWords.length === 1) {
      const searchWord = searchWords[0];
      const textWords = normalizedText.split(' ');
      
      // Check if any word in the text starts with the search term
      return textWords.some(word => word.startsWith(searchWord) || searchWord.startsWith(word));
    }
    
    return false;
  };

  // Get search results with improved fuzzy matching
  const getSearchResults = (query: string): JobResult[] => {
    const searchTerm = query.trim();
    let results: JobResult[] = [];
    const addedIds = new Set<string>();
    
    // Helper function to add unique results
    const addUniqueResults = (newResults: JobResult[]) => {
      newResults.forEach(job => {
        if (!addedIds.has(job.id)) {
          results.push(job);
          addedIds.add(job.id);
        }
      });
    };
    
    // Use job database
    const allJobs = jobDatabase;
    
    if (!query || query.trim() === '') {
      return allJobs.slice(0, 50);
    }

    // 1. Company name matches (highest priority)
    const companyMatches = allJobs.filter(job => 
      fuzzyMatch(job.companyName, searchTerm)
    );
    addUniqueResults(companyMatches);
    
    // 2. Job title matches
    const titleMatches = allJobs.filter(job => 
      fuzzyMatch(job.jobTitle, searchTerm)
    );
    addUniqueResults(titleMatches);
    
    // 3. Tag matches
    const tagMatches = allJobs.filter(job => 
      job.tags.some(tag => fuzzyMatch(tag, searchTerm))
    );
    addUniqueResults(tagMatches);
    
    // 4. Generic search terms - show popular jobs
    if (results.length === 0) {
      const genericTerms = ['job', 'jobs', 'work', 'career', 'careers', 'employment', 'companies', 'hiring'];
      const isGenericSearch = genericTerms.some(term => fuzzyMatch(term, searchTerm));
      
      if (isGenericSearch) {
        addUniqueResults(allJobs);
      }
    }
    
    return results.slice(0, 50);
  };

  // Memoize search results for better performance
  const searchResults = useMemo(() => getSearchResults(searchQuery), [searchQuery]);

  // Memoize filtered results for better performance
  const filteredResults = useMemo(() => {
    return searchResults.filter(job => {
      // Job type filter
      if (selectedFilter !== 'all') {
        if (selectedFilter === 'part-time' && job.type !== 'Part-time') return false;
        if (selectedFilter === 'full-time' && job.type !== 'Full-time') return false;
      }
      
      // Location filter
      if (selectedLocation !== 'all') {
        if (selectedLocation === 'london' && !job.location.toLowerCase().includes('london')) return false;
        if (selectedLocation === 'manchester' && !job.location.toLowerCase().includes('manchester')) return false;
        if (selectedLocation === 'birmingham' && !job.location.toLowerCase().includes('birmingham')) return false;
      }
      
      return true;
    });
  }, [searchResults, selectedFilter, selectedLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)', display: 'flex' }}>
      {/* Left Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#1f2937',
        color: '#ffffff',
        padding: '24px 0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                background: 'none',
                border: 'none',
                color: '#fbbf24',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </button>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#fbbf24',
              margin: '0',
              fontFamily: "'Fredoka', 'Inter', sans-serif"
            }}>
              🎯 Job Search
            </h1>
          </div>
        </div>

        <nav style={{ padding: '0 16px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#9ca3af', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '16px',
              padding: '0 8px'
            }}>
              Filters
            </h3>
            
            {/* Job Type Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#d1d5db', 
                marginBottom: '8px',
                padding: '0 8px'
              }}>
                Job Type
              </h4>
              {[
                { key: 'all', label: 'All Jobs' },
                { key: 'part-time', label: 'Part-time' },
                { key: 'full-time', label: 'Full-time' }
              ].map((filter) => (
                <div 
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  style={{
                    backgroundColor: selectedFilter === filter.key ? '#374151' : 'transparent',
                    padding: '8px 16px',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}
                >
                  <Briefcase style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px' }}>{filter.label}</span>
                </div>
              ))}
            </div>

            {/* Location Filter */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: '#d1d5db', 
                marginBottom: '8px',
                padding: '0 8px'
              }}>
                Location
              </h4>
              {[
                { key: 'all', label: 'All Locations' },
                { key: 'london', label: 'London' },
                { key: 'manchester', label: 'Manchester' },
                { key: 'birmingham', label: 'Birmingham' }
              ].map((location) => (
                <div 
                  key={location.key}
                  onClick={() => setSelectedLocation(location.key)}
                  style={{
                    backgroundColor: selectedLocation === location.key ? '#374151' : 'transparent',
                    padding: '8px 16px',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}
                >
                  <MapPin style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '14px' }}>{location.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#9ca3af', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '16px',
              padding: '0 8px'
            }}>
              Quick Actions
            </h3>
            <div 
              onClick={() => setSearchQuery('McDonald\'s')}
              style={{
                backgroundColor: 'transparent',
                padding: '8px 16px',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '16px' }}>🍟</span>
              <span style={{ fontSize: '14px' }}>McDonald's Jobs</span>
            </div>
            <div 
              onClick={() => setSearchQuery('Costa Coffee')}
              style={{
                backgroundColor: 'transparent',
                padding: '8px 16px',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '16px' }}>☕</span>
              <span style={{ fontSize: '14px' }}>Costa Coffee</span>
            </div>
            <div 
              onClick={() => setSearchQuery('Tesco')}
              style={{
                backgroundColor: 'transparent',
                padding: '8px 16px',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderRadius: '6px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{ fontSize: '16px' }}>🛒</span>
              <span style={{ fontSize: '14px' }}>Tesco</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '280px', flex: 1, padding: '32px 48px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            margin: '0 0 8px 0',
            fontFamily: "'Fredoka', 'Inter', sans-serif"
          }}>
            Find Your Dream Job
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#4b5563', 
            margin: '0 0 32px 0',
            fontWeight: '400'
          }}>
            Discover amazing opportunities with top UK companies
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '16px 24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              maxWidth: '600px'
            }}>
              <Search style={{ width: '20px', height: '20px', color: '#6b7280', marginRight: '16px' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  backgroundColor: 'transparent'
                }}
              />
              <button
                type="submit"
                style={{
                  marginLeft: '16px',
                  padding: '8px 16px',
                  backgroundColor: '#fbbf24',
                  color: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </form>

          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
            Found {filteredResults.length} jobs
          </p>
        </div>

        {/* Job Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredResults.map((job) => (
            <div key={job.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              border: '2px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#fbbf24';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    {job.companyLogo}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                      {job.jobTitle}
                    </h3>
                    <p style={{ fontSize: '16px', color: '#6b7280', margin: '0' }}>
                      {job.companyName}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669', margin: '0 0 4px 0' }}>
                    {job.salary}
                  </p>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>
                    {job.type}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>{job.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>{job.postedDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Star style={{ width: '16px', height: '16px', color: '#fbbf24', fill: 'currentColor' }} />
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>{job.rating}</span>
                </div>
              </div>
              
              <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5', marginBottom: '16px' }}>
                {job.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {job.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} style={{
                      padding: '4px 12px',
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '12px'
                    }}>
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
                <a
                  href={getApplyLink(job.companyName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackJobClick(job)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: '#fbbf24',
                    color: '#1f2937',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f59e0b';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fbbf24';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Apply Now
                  <ExternalLink style={{ width: '16px', height: '16px' }} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}>🔍</span>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              No jobs found
            </h3>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
              Try adjusting your search or filters to find more opportunities
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
                setSelectedLocation('all');
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#fbbf24',
                color: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
