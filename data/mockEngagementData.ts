
// This file represents a sample dataset that would be used to train
// a custom deep learning model for engagement prediction.
// In a real-world scenario, this dataset would contain thousands or millions
// of entries and would be sourced from actual LinkedIn data.

export interface EngagementDataSample {
  text: string;
  engagement: 'Low' | 'Medium' | 'High';
}

export const mockEngagementData: EngagementDataSample[] = [
  // High Engagement Examples
  {
    text: "Thrilled to announce I've passed the AWS Certified Solutions Architect exam! It was a tough journey, but the late nights paid off. What's one certification you're proud of? Let's celebrate our wins! #AWS #Cloud #Certification #CareerGrowth",
    engagement: 'High',
  },
  {
    text: "I used to think that 'work-life balance' was a myth. But after burning out last year, I discovered a 3-step framework that changed everything for me. Want me to share it? Let me know in the comments! 👇 #WorkLifeBalance #MentalHealth #Productivity",
    engagement: 'High',
  },
  {
    text: "Just published a new article on the future of AI in marketing. We dive deep into personalization engines and predictive analytics. Link in the comments. Would love to hear your thoughts! #AI #Marketing #FutureOfWork",
    engagement: 'High',
  },
  
  // Medium Engagement Examples
  {
    text: "Our team is hiring a Senior Frontend Engineer. We're working with React, TypeScript, and GraphQL on some exciting new projects. Check out the careers page on our website for more info. #Hiring #Frontend #ReactDev",
    engagement: 'Medium',
  },
  {
    text: "Attending the #DevOps conference this week. Looking forward to learning more about CI/CD pipelines and container orchestration.",
    engagement: 'Medium',
  },
  {
    text: "Finished a great book on leadership this weekend. 'The Five Dysfunctions of a Team' has some timeless lessons. #Leadership #Reading #BookRecommendation",
    engagement: 'Medium',
  },

  // Low Engagement Examples
  {
    text: "new job.",
    engagement: 'Low',
  },
  {
    text: "Check out my new blog post.",
    engagement: 'Low',
  },
  {
    text: "Updated my resume today. #jobsearch",
    engagement: 'Low',
  },
];
