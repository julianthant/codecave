import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
  highlighted?: boolean;
}

// Server-side FAQ Card component
const FAQCard: React.FC<{ faq: FAQItem; index: number }> = ({ faq, index }) => {
  // Alternate between highlighted (colored) and default (white) cards
  const isHighlighted = index % 3 === 0 || index % 5 === 0; // Creates varied pattern
  
  return (
    <div className={`rounded-2xl p-8 transition-all duration-200 hover:scale-[1.02] ${
      isHighlighted 
        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
        : 'bg-white border border-gray-200 text-gray-900'
    }`}>
      <h3 className={`text-xl font-bold font-mono mb-4 ${
        isHighlighted ? 'text-white' : 'text-gray-900'
      }`}>
        {faq.question}
      </h3>
      <p className={`font-mono leading-relaxed ${
        isHighlighted ? 'text-white/90' : 'text-gray-600'
      }`}>
        {faq.answer}
      </p>
    </div>
  );
};

// Static FAQ data
const faqItems: FAQItem[] = [
  {
    question: "How does CodeCave work?",
    answer: "CodeCave is a platform where developers can showcase their projects, collaborate with others, and discover innovative solutions. Simply sign up, create your profile, and start sharing your work with the community."
  },
  {
    question: "Is CodeCave free to use?",
    answer: "Yes! CodeCave offers a free plan that includes 5 public projects, community access, and basic code reviews. You can upgrade to Pro or Team plans for additional features."
  },
  {
    question: "Can I collaborate with other developers?",
    answer: "Absolutely! CodeCave is built for collaboration. You can join existing projects, find contributors for your own projects, and participate in community discussions and code reviews."
  },
  {
    question: "What types of projects can I share?",
    answer: "Any type of software project! From web applications and mobile apps to machine learning models, open-source libraries, and creative coding experiments. All programming languages and frameworks are welcome."
  },
  {
    question: "How do code reviews work?",
    answer: "Our community-driven code review system allows experienced developers to provide feedback on your projects. Submit your code, get constructive feedback, and help others improve their work too."
  },
  {
    question: "Can I use CodeCave for my team?",
    answer: "Yes! Our Team plan includes collaboration tools, private projects, custom domains, and advanced analytics. Perfect for development teams and organizations."
  }
];

// Main server component
const FAQSection: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Section Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <span className="text-sm font-medium font-mono text-orange-500 uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
        </header>

        {/* FAQ Grid - Bento Box Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {faqItems.map((faq, index) => (
            <FAQCard key={index} faq={faq} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <footer className="text-center">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold font-mono text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 font-mono mb-6">
              Our community and support team are here to help you get started.
            </p>
            <a
              href="#contact"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-mono font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer inline-flex items-center"
            >
              Contact Support
            </a>
          </div>
        </footer>
        
      </div>
    </section>
  );
};

export default FAQSection; 