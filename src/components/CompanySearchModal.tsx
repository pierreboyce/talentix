"use client";

import React, { useState } from 'react';
import { X, Clock, MapPin, Building2, Star, ExternalLink, Filter, Search } from 'lucide-react';

interface CompanySearchModalProps {
  searchQuery: string;
  onClose: () => void;
}

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

export default function CompanySearchModal({ searchQuery, onClose }: CompanySearchModalProps) {
  
  
  
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Massive job database with Google-style results
  const jobDatabase: JobResult[] = [
    // McDonald's Jobs
    { id: 'mc1', companyName: "McDonald's", companyLogo: '/logos/McDonalds.png', jobTitle: 'Crew Member', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Join our amazing team to create great customer experiences. Flexible hours, training provided, and opportunities to progress your career.', postedDate: '2 days ago', rating: 4.2, applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/part-time-crew-member', tags: ['entry-level', 'flexible-hours', 'training-provided'] },
    { id: 'mc2', companyName: "McDonald's", companyLogo: '/logos/McDonalds.png', jobTitle: 'Shift Manager', location: 'London, Birmingham', salary: '£11.50-£13.00/hr', type: 'Full-time', description: 'Lead a team and help run our restaurant. Great stepping stone to management with full training and development programs.', postedDate: '1 week ago', rating: 4.2, applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/shift-manager', tags: ['management', 'leadership', 'career-progression'] },
    { id: 'mc3', companyName: "McDonald's", companyLogo: '/logos/McDonalds.png', jobTitle: 'Kitchen Team Member', location: 'Manchester, Leeds', salary: '£8.50-£9.50/hr', type: 'Part-time', description: 'Work in our fast-paced kitchen preparing quality food. Perfect for students with flexible scheduling options.', postedDate: '3 days ago', rating: 4.2, applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/kitchen-team', tags: ['kitchen', 'fast-paced', 'student-friendly'] },
    { id: 'mc4', companyName: "McDonald's", companyLogo: '/logos/McDonalds.png', jobTitle: 'Customer Service Assistant', location: 'Bristol, Cardiff', salary: '£8.50-£9.00/hr', type: 'Part-time', description: 'Be the friendly face customers see when they visit. Great communication skills and a smile are all you need to start.', postedDate: '5 days ago', rating: 4.2, applyLink: 'https://people.mcdonalds.co.uk/opportunities/restaurant/customer-service', tags: ['customer-service', 'communication', 'friendly'] },

    // Boots Jobs
    { id: 'bt1', companyName: 'Boots', companyLogo: '/logos/Boots.png', jobTitle: 'Customer Advisor', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Help customers find the right products and make their shopping experience exceptional. Join the UK\'s leading health and beauty retailer.', postedDate: '1 day ago', rating: 4.1, applyLink: 'https://www.boots.jobs/retail/customer-advisor/', tags: ['health-beauty', 'customer-service', 'retail'] },
    { id: 'bt2', companyName: 'Boots', companyLogo: '/logos/Boots.png', jobTitle: 'Beauty Advisor', location: 'London, Manchester', salary: '£9.50-£12.00/hr', type: 'Full-time', description: 'Share your passion for beauty and help customers discover new products. Full training provided with amazing staff discounts.', postedDate: '4 days ago', rating: 4.1, applyLink: 'https://www.boots.jobs/retail/beauty-advisor/', tags: ['beauty', 'training-provided', 'staff-discount'] },
    { id: 'bt3', companyName: 'Boots', companyLogo: '/logos/Boots.png', jobTitle: 'Pharmacy Assistant', location: 'Birmingham, Liverpool', salary: '£10.00-£13.00/hr', type: 'Full-time', description: 'Support our qualified pharmacists in delivering excellent healthcare services to our customers.', postedDate: '1 week ago', rating: 4.1, applyLink: 'https://www.boots.jobs/healthcare/pharmacy-assistant/', tags: ['healthcare', 'pharmacy', 'professional'] },
    { id: 'bt4', companyName: 'Boots', companyLogo: '/logos/Boots.png', jobTitle: 'Stock Assistant', location: 'Edinburgh, Glasgow', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Keep our stores well-stocked and organized. Perfect role for detail-oriented individuals who enjoy working behind the scenes.', postedDate: '6 days ago', rating: 4.1, applyLink: 'https://www.boots.jobs/retail/stock-assistant/', tags: ['stock-management', 'organized', 'behind-scenes'] },

    // Tesco Jobs
    { id: 'ts1', companyName: 'Tesco', companyLogo: '🛒', jobTitle: 'Customer Assistant', location: 'Nationwide', salary: '£9.00-£11.50/hr', type: 'Part-time', description: 'Become the friendly face of our store, helping customers and ensuring shelves are perfectly stocked.', postedDate: '2 days ago', rating: 4.0, applyLink: 'https://www.tesco-careers.com/search-and-apply/', tags: ['customer-service', 'stocking', 'nationwide'] },
    { id: 'ts2', companyName: 'Tesco', companyLogo: '🛒', jobTitle: 'Online Picker', location: 'London, Birmingham', salary: '£9.50-£12.00/hr', type: 'Full-time', description: 'Help customers get their groceries by picking their online orders. Fast-paced role with great team spirit.', postedDate: '1 day ago', rating: 4.0, applyLink: 'https://www.tesco-careers.com/search-and-apply/', tags: ['online-shopping', 'fast-paced', 'teamwork'] },
    { id: 'ts3', companyName: 'Tesco', companyLogo: '🛒', jobTitle: 'Checkout Operator', location: 'Manchester, Leeds', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Provide excellent service at our checkouts, helping customers complete their shopping with a smile.', postedDate: '3 days ago', rating: 4.0, applyLink: 'https://www.tesco-careers.com/search-and-apply/', tags: ['checkout', 'customer-service', 'retail'] },
    { id: 'ts4', companyName: 'Tesco', companyLogo: '🛒', jobTitle: 'Night Shift Stocker', location: 'Bristol, Cardiff', salary: '£10.50-£13.00/hr', type: 'Full-time', description: 'Work overnight to restock shelves and prepare the store for the next day. Great pay rates for night work.', postedDate: '5 days ago', rating: 4.0, applyLink: 'https://www.tesco-careers.com/search-and-apply/', tags: ['night-shift', 'stocking', 'higher-pay'] },

    // Sainsbury's Jobs
    { id: 'sb1', companyName: "Sainsbury's", companyLogo: '🛍️', jobTitle: 'Sales Assistant', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Help customers find what they need and keep our store looking great. Weekend and evening shifts available.', postedDate: '2 days ago', rating: 4.1, applyLink: 'https://sainsburys.jobs/retail/sales-assistant', tags: ['sales', 'weekend-shifts', 'evening-shifts'] },
    { id: 'sb2', companyName: "Sainsbury's", companyLogo: '🛍️', jobTitle: 'Bakery Assistant', location: 'London, Birmingham', salary: '£9.50-£11.50/hr', type: 'Full-time', description: 'Work in our in-store bakery creating fresh bread and pastries daily. Early morning starts with competitive pay.', postedDate: '4 days ago', rating: 4.1, applyLink: 'https://sainsburys.jobs/food/bakery-assistant', tags: ['bakery', 'early-morning', 'food-production'] },
    { id: 'sb3', companyName: "Sainsbury's", companyLogo: '🛍️', jobTitle: 'Petrol Station Attendant', location: 'Manchester, Leeds', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Serve customers at our petrol stations, handling fuel sales and convenience store items.', postedDate: '1 week ago', rating: 4.1, applyLink: 'https://sainsburys.jobs/retail/petrol-attendant', tags: ['petrol-station', 'convenience', 'customer-service'] },

    // ASDA Jobs
    { id: 'as1', companyName: 'ASDA', companyLogo: '🛒', jobTitle: 'Customer Assistant', location: 'Nationwide', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Provide excellent service to customers and help keep our store running smoothly. Flexible hours available.', postedDate: '1 day ago', rating: 3.9, applyLink: 'https://www.asda.jobs/retail/customer-assistant', tags: ['customer-service', 'flexible-hours', 'retail'] },
    { id: 'as2', companyName: 'ASDA', companyLogo: '🛒', jobTitle: 'Home Shopping Picker', location: 'Birmingham, Liverpool', salary: '£9.50-£11.50/hr', type: 'Full-time', description: 'Pick and pack online grocery orders for home delivery. Physical role with good team environment.', postedDate: '3 days ago', rating: 3.9, applyLink: 'https://www.asda.jobs/online/home-shopping', tags: ['online-shopping', 'physical-work', 'teamwork'] },

    // Costa Coffee Jobs
    { id: 'cc1', companyName: 'Costa Coffee', companyLogo: '☕', jobTitle: 'Barista', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Create the perfect coffee experience for our customers. Full training provided with flexible scheduling.', postedDate: '1 day ago', rating: 4.3, applyLink: 'https://www.costa.co.uk/careers/barista', tags: ['coffee', 'training-provided', 'flexible-schedule'] },
    { id: 'cc2', companyName: 'Costa Coffee', companyLogo: '☕', jobTitle: 'Shift Supervisor', location: 'London, Manchester', salary: '£10.00-£12.50/hr', type: 'Full-time', description: 'Lead a team of baristas and ensure excellent customer service. Leadership experience preferred but not essential.', postedDate: '5 days ago', rating: 4.3, applyLink: 'https://www.costa.co.uk/careers/supervisor', tags: ['leadership', 'coffee', 'team-management'] },
    { id: 'cc3', companyName: 'Costa Coffee', companyLogo: '☕', jobTitle: 'Store Manager', location: 'Birmingham, Bristol', salary: '£25,000-£30,000', type: 'Full-time', description: 'Manage all aspects of store operations including staff, sales, and customer satisfaction. Management experience required.', postedDate: '1 week ago', rating: 4.3, applyLink: 'https://www.costa.co.uk/careers/manager', tags: ['management', 'operations', 'experience-required'] },

    // Starbucks Jobs
    { id: 'sb4', companyName: 'Starbucks', companyLogo: '☕', jobTitle: 'Barista', location: 'London, Edinburgh', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Craft handcrafted beverages and create moments of connection with customers. Join our coffee-loving community.', postedDate: '2 days ago', rating: 4.2, applyLink: 'https://www.starbucks.co.uk/careers/barista', tags: ['coffee', 'handcrafted', 'community'] },
    { id: 'sb5', companyName: 'Starbucks', companyLogo: '☕', jobTitle: 'Shift Leader', location: 'Manchester, Birmingham', salary: '£10.50-£13.00/hr', type: 'Full-time', description: 'Support store operations and lead by example. Great opportunity for career development in a global brand.', postedDate: '6 days ago', rating: 4.2, applyLink: 'https://www.starbucks.co.uk/careers/shift-leader', tags: ['leadership', 'career-development', 'global-brand'] },

    // Next Jobs
    { id: 'nx1', companyName: 'Next', companyLogo: '👕', jobTitle: 'Sales Associate', location: 'Multiple Locations', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Join our fashion team and help customers find their perfect style. Great staff discount and flexible hours.', postedDate: '3 days ago', rating: 4.0, applyLink: 'https://www.next.co.uk/careers/retail-sales-associate', tags: ['fashion', 'staff-discount', 'style'] },
    { id: 'nx2', companyName: 'Next', companyLogo: '👕', jobTitle: 'Visual Merchandiser', location: 'London, Manchester', salary: '£18,000-£22,000', type: 'Full-time', description: 'Create stunning visual displays that showcase our latest fashion collections. Creative role with fashion focus.', postedDate: '1 week ago', rating: 4.0, applyLink: 'https://www.next.co.uk/careers/visual-merchandiser', tags: ['creative', 'visual-display', 'fashion'] },

    // Primark Jobs
    { id: 'pk1', companyName: 'Primark', companyLogo: '👗', jobTitle: 'Sales Assistant', location: 'Nationwide', salary: '£8.50-£9.50/hr', type: 'Part-time', description: 'Help customers find affordable fashion and keep our store looking its best. Flexible hours available.', postedDate: '2 days ago', rating: 3.8, applyLink: 'https://www.primark.com/careers/retail-sales-assistant', tags: ['fashion', 'affordable', 'flexible-hours'] },
    { id: 'pk2', companyName: 'Primark', companyLogo: '👗', jobTitle: 'Stock Room Assistant', location: 'Birmingham, Liverpool', salary: '£8.50-£9.50/hr', type: 'Full-time', description: 'Work behind the scenes processing stock deliveries and ensuring smooth store operations.', postedDate: '4 days ago', rating: 3.8, applyLink: 'https://www.primark.com/careers/stock-assistant', tags: ['stock-room', 'behind-scenes', 'operations'] },

    // Currys PC World Jobs
    { id: 'cy1', companyName: 'Currys PC World', companyLogo: '💻', jobTitle: 'Sales Consultant', location: 'Multiple Locations', salary: '£18,000-£25,000 + Commission', type: 'Full-time', description: 'Help customers choose the right technology for their needs. Tech knowledge helpful but training provided.', postedDate: '3 days ago', rating: 3.9, applyLink: 'https://careers.currys.co.uk/sales-consultant', tags: ['technology', 'commission', 'training-provided'] },
    { id: 'cy2', companyName: 'Currys PC World', companyLogo: '💻', jobTitle: 'Tech Support Specialist', location: 'London, Birmingham', salary: '£20,000-£28,000', type: 'Full-time', description: 'Provide technical support and repairs for customer devices. Technical qualifications preferred.', postedDate: '1 week ago', rating: 3.9, applyLink: 'https://careers.currys.co.uk/tech-support', tags: ['technical-support', 'repairs', 'qualifications-preferred'] },

    // IKEA Jobs
    { id: 'ik1', companyName: 'IKEA', companyLogo: '🏠', jobTitle: 'Sales Co-worker', location: 'Multiple Locations', salary: '£9.50-£12.00/hr', type: 'Part-time', description: 'Help customers create their dream homes with our furniture and accessories. Passion for home design helpful.', postedDate: '2 days ago', rating: 4.2, applyLink: 'https://careers.ikea.co.uk/sales-co-worker', tags: ['home-design', 'furniture', 'customer-help'] },
    { id: 'ik2', companyName: 'IKEA', companyLogo: '🏠', jobTitle: 'Warehouse Co-worker', location: 'Birmingham, Manchester', salary: '£10.00-£13.00/hr', type: 'Full-time', description: 'Work in our warehouse picking customer orders and managing stock. Physical role with good team environment.', postedDate: '5 days ago', rating: 4.2, applyLink: 'https://careers.ikea.co.uk/warehouse', tags: ['warehouse', 'physical-work', 'stock-management'] },

    // Additional Companies for More Results
    { id: 'jl1', companyName: 'John Lewis', companyLogo: '🏬', jobTitle: 'Partner (Sales)', location: 'London, Birmingham', salary: '£19,000-£24,000', type: 'Full-time', description: 'Join our Partnership and deliver exceptional customer service in our department stores. Employee ownership model.', postedDate: '1 day ago', rating: 4.4, applyLink: 'https://www.johnlewispartnership.co.uk/careers/', tags: ['partnership', 'department-store', 'employee-ownership'] },
    
    { id: 'ms1', companyName: 'Marks & Spencer', companyLogo: '🛍️', jobTitle: 'Customer Assistant', location: 'Multiple Locations', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Help customers in our clothing, home, and food departments. Join a British retail institution.', postedDate: '3 days ago', rating: 4.0, applyLink: 'https://careers.marksandspencer.com/', tags: ['british-institution', 'clothing-home-food', 'retail'] },

    { id: 'wt1', companyName: 'Waitrose', companyLogo: '🥗', jobTitle: 'Customer Service Partner', location: 'London, Bristol', salary: '£10.00-£12.50/hr', type: 'Part-time', description: 'Deliver exceptional service in our premium supermarkets. Great benefits and partnership perks.', postedDate: '2 days ago', rating: 4.3, applyLink: 'https://www.waitrose.com/careers/', tags: ['premium', 'partnership-perks', 'exceptional-service'] },

    { id: 'ar1', companyName: 'Argos', companyLogo: '📦', jobTitle: 'Stock Assistant', location: 'Nationwide', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Help with stock management and customer collections at our catalogue stores.', postedDate: '4 days ago', rating: 3.7, applyLink: 'https://careers.argos.co.uk/', tags: ['stock-management', 'catalogue', 'collections'] },

    { id: 'pc1', companyName: 'Pizza Express', companyLogo: '🍕', jobTitle: 'Waiter/Waitress', location: 'London, Manchester', salary: '£8.50-£10.00/hr + Tips', type: 'Part-time', description: 'Serve customers in our popular pizza restaurants. Great tips and flexible scheduling.', postedDate: '1 day ago', rating: 4.1, applyLink: 'https://careers.pizzaexpress.com/', tags: ['restaurant', 'tips', 'pizza'] },

    { id: 'nf1', companyName: 'Nandos', companyLogo: '🐔', jobTitle: 'Team Member', location: 'Multiple Locations', salary: '£8.50-£10.50/hr', type: 'Part-time', description: 'Join our legendary chicken restaurant team. Fun environment with great staff perks.', postedDate: '2 days ago', rating: 4.2, applyLink: 'https://careers.nandos.co.uk/', tags: ['chicken', 'fun-environment', 'staff-perks'] },

    { id: 'sp1', companyName: 'Superdrug', companyLogo: '💄', jobTitle: 'Beauty Advisor', location: 'Birmingham, Leeds', salary: '£9.00-£11.50/hr', type: 'Full-time', description: 'Share your passion for beauty and health products with customers. Training and development provided.', postedDate: '5 days ago', rating: 4.0, applyLink: 'https://careers.superdrug.com/', tags: ['beauty', 'health-products', 'development'] },

    { id: 'hw1', companyName: 'H&M', companyLogo: '👚', jobTitle: 'Sales Advisor', location: 'London, Edinburgh', salary: '£8.50-£10.00/hr', type: 'Part-time', description: 'Help customers discover the latest fashion trends in our stores. International fashion brand experience.', postedDate: '3 days ago', rating: 3.9, applyLink: 'https://career.hm.com/', tags: ['fashion-trends', 'international-brand', 'discovery'] },

    { id: 'za1', companyName: 'Zara', companyLogo: '👔', jobTitle: 'Sales Assistant', location: 'London, Manchester', salary: '£9.00-£11.00/hr', type: 'Part-time', description: 'Work for one of the world\'s leading fashion retailers. Fast fashion environment with style focus.', postedDate: '6 days ago', rating: 3.8, applyLink: 'https://careers.zara.com/', tags: ['leading-retailer', 'fast-fashion', 'style-focus'] }
  ];

  // Get search results with improved matching
  const getSearchResults = (query: string): JobResult[] => {
    
    
    if (!query || query.trim() === '') return jobDatabase.slice(0, 20); // Show first 20 for empty query
    
    const searchTerm = query.toLowerCase().trim();
    let results: JobResult[] = [];
    
    // Exact company name matches (highest priority)
    results = jobDatabase.filter(job => 
      job.companyName.toLowerCase().includes(searchTerm) ||
      searchTerm.includes(job.companyName.toLowerCase())
    );
    
    // Job title matches
    if (results.length < 10) {
      const titleMatches = jobDatabase.filter(job => 
        job.jobTitle.toLowerCase().includes(searchTerm) &&
        !results.some(r => r.id === job.id)
      );
      results.push(...titleMatches);
    }
    
    // Tag matches
    if (results.length < 15) {
      const tagMatches = jobDatabase.filter(job => 
        job.tags.some(tag => tag.includes(searchTerm)) &&
        !results.some(r => r.id === job.id)
      );
      results.push(...tagMatches);
    }
    
    // Location matches
    if (results.length < 20) {
      const locationMatches = jobDatabase.filter(job => 
        job.location.toLowerCase().includes(searchTerm) &&
        !results.some(r => r.id === job.id)
      );
      results.push(...locationMatches);
    }
    
    // Description matches (lowest priority)
    if (results.length < 25) {
      const descMatches = jobDatabase.filter(job => 
        job.description.toLowerCase().includes(searchTerm) &&
        !results.some(r => r.id === job.id)
      );
      results.push(...descMatches);
    }
    
    // If still no results, show popular jobs
    if (results.length === 0) {
      results = jobDatabase.slice(0, 20);
    }
    
    
    return results.slice(0, 40); // Limit to 40 results
  };

  const searchResults = getSearchResults(searchQuery);
  const resultCount = searchResults.length;
  const searchTime = "0.42 seconds"; // Simulate Google search timing

  const filters = [
    { key: 'all', label: 'All Jobs', count: resultCount },
    { key: 'part-time', label: 'Part-time', count: searchResults.filter(job => job.type === 'Part-time').length },
    { key: 'full-time', label: 'Full-time', count: searchResults.filter(job => job.type === 'Full-time').length },
    { key: 'retail', label: 'Retail', count: searchResults.filter(job => job.tags.includes('retail')).length },
    { key: 'hospitality', label: 'Hospitality', count: searchResults.filter(job => job.tags.includes('restaurant') || job.tags.includes('coffee')).length }
  ];

  const filteredResults = selectedFilter === 'all' 
    ? searchResults 
    : searchResults.filter(job => {
        switch (selectedFilter) {
          case 'part-time': return job.type === 'Part-time';
          case 'full-time': return job.type === 'Full-time';
          case 'retail': return job.tags.includes('retail');
          case 'hospitality': return job.tags.includes('restaurant') || job.tags.includes('coffee');
          default: return true;
        }
      });

  return (
    <div 
      className="fixed inset-0 bg-white flex flex-col"
      style={{ 
        zIndex: 9999,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}
    >
      {/* Google-style Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        {/* Top Bar with Talentix Branding */}
        <div className="flex items-center justify-between px-6 py-4 bg-yellow-400 border-b-2 border-black">
          <div className="flex items-center gap-4">
            <h1 
              className="text-2xl font-bold text-black"
              style={{ fontFamily: "'Fredoka', 'Inter', sans-serif" }}
            >
              🎯 Talentix
            </h1>
            <div className="flex items-center bg-white rounded-full px-4 py-2 border-2 border-black">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700">{searchQuery}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {/* Search Stats */}
        <div className="px-6 py-3 text-sm text-gray-600 bg-gray-50">
          About {resultCount.toLocaleString()} results ({searchTime})
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex gap-6">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`text-sm py-2 px-1 border-b-2 transition-colors ${
                  selectedFilter === filter.key
                    ? 'border-blue-600 text-blue-600 font-medium'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="space-y-6">
            {filteredResults.map((job, index) => (
              <div key={job.id} className="group">
                {/* Job Result Card - Google Style */}
                <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-6">
                  {/* Company Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {job.companyLogo.startsWith('/') ? (
                          <img 
                            src={job.companyLogo} 
                            alt={job.companyName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling!.textContent = job.companyName.charAt(0);
                            }}
                          />
                        ) : (
                          <span className="text-2xl">{job.companyLogo}</span>
                        )}
                        <span className="hidden text-lg font-bold text-gray-600">
                          {job.companyName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-700 font-medium">{job.companyName}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">{job.rating}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {job.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{job.salary}</div>
                      <div className="text-xs text-gray-500">{job.type}</div>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h3 className="text-xl font-medium text-blue-600 hover:underline cursor-pointer mb-2">
                    {job.jobTitle} - {job.companyName}
                  </h3>

                  {/* Location and Date */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag.replace('-', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <div className="flex items-center justify-between">
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-full font-medium text-sm transition-colors border-2 border-black hover:border-gray-800"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <span className="text-xs text-gray-500">
                      Via {job.companyName} Careers
                    </span>
                  </div>
                </div>

                {/* Separator */}
                {index < filteredResults.length - 1 && (
                  <div className="border-b border-gray-100 my-6"></div>
                )}
              </div>
            ))}
          </div>

          {/* Load More */}
          {filteredResults.length === 40 && (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm mb-4">
                Showing {filteredResults.length} of {resultCount} results
              </p>
              <div className="text-xs text-gray-500">
                Scroll up to refine your search or try different keywords
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-500">
          <span>Powered by Talentix Job Search</span>
          <span>
            Press <kbd className="px-2 py-1 bg-gray-200 rounded">Escape</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

