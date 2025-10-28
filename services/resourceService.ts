

interface Job {
  title: string;
  company: string;
}

interface Course {
  title: string;
  source: string;
  skills: string[];
}

export interface SearchResults {
    jobs: Job[];
    courses: Course[];
    skills: string[];
}

// A simple CSV parser that can handle basic quoted fields.
// This is not fully RFC 4180 compliant but works for our specific data format.
const parseCSV = <T extends Record<string, any>>(csvText: string, mapper: (headers: string[], values: string[]) => T): T[] => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1);

    return rows.map(row => {
        // This regex handles comma-separated values, including those enclosed in double quotes.
        const values = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const cleanedValues = values.map(v => v.replace(/^"|"$/g, '').trim());
        return mapper(headers, cleanedValues);
    });
};


class ResourceService {
  private jobs: Job[] = [];
  private courses: Course[] = [];
  private allSkills: Set<string> = new Set();
  private uniqueJobTitles: string[] = [];
  private isLoaded = false;
  private isLoading = false;
  private loadPromise: Promise<void> | null = null;

  private async loadData(): Promise<void> {
    if (this.isLoaded) return;
    if (this.isLoading && this.loadPromise) return this.loadPromise;

    this.isLoading = true;
    this.loadPromise = (async () => {
        try {
            const [jobsResponse, coursesResponse] = await Promise.all([
                fetch('/data/job_listings.csv'),
                fetch('/data/online_courses.csv')
            ]);

            if (!jobsResponse.ok || !coursesResponse.ok) {
                throw new Error('Failed to fetch resource data');
            }

            const [jobsText, coursesText] = await Promise.all([
                jobsResponse.text(),
                coursesResponse.text()
            ]);
            
            this.jobs = parseCSV(jobsText, (headers, values) => ({
                title: values[headers.indexOf('title')] || '',
                company: values[headers.indexOf('company')] || '',
            }));

            const titles = new Set(this.jobs.map(job => job.title));
            this.uniqueJobTitles = ['All Titles', ...Array.from(titles).sort()];

            this.courses = parseCSV(coursesText, (headers, values) => {
                const skills = (values[headers.indexOf('skills_taught')] || '').split(';').map(s => s.trim()).filter(Boolean);
                skills.forEach(skill => this.allSkills.add(skill));
                return {
                    title: values[headers.indexOf('title')] || '',
                    source: values[headers.indexOf('source')] || '',
                    skills,
                };
            });
            
            this.isLoaded = true;
        } catch (error) {
            console.error("Error loading resource data:", error);
            // In case of error, prevent retrying indefinitely
            this.isLoaded = false;
        } finally {
            this.isLoading = false;
            this.loadPromise = null;
        }
    })();
    
    return this.loadPromise;
  }
  
  async getUniqueJobTitles(): Promise<string[]> {
    await this.loadData();
    return this.uniqueJobTitles;
  }

  async search(query: string): Promise<SearchResults> {
    await this.loadData();
    if (!this.isLoaded) return { jobs: [], courses: [], skills: [] };

    const lowerCaseQuery = query.toLowerCase();

    const filteredJobs = this.jobs.filter(job =>
      job.title.toLowerCase().includes(lowerCaseQuery) ||
      job.company.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 50); // Increase limit to allow for client-side filtering

    const filteredCourses = this.courses.filter(course =>
      course.title.toLowerCase().includes(lowerCaseQuery) ||
      course.skills.some(skill => skill.toLowerCase().includes(lowerCaseQuery))
    ).slice(0, 5);

    const filteredSkills = Array.from(this.allSkills).filter(skill =>
        skill.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 10);

    return {
      jobs: filteredJobs,
      courses: filteredCourses,
      skills: filteredSkills,
    };
  }
}

const resourceService = new ResourceService();
export default resourceService;