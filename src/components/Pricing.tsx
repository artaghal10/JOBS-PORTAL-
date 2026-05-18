import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Standard Post",
      price: "1,500",
      features: [
        "Single Job Listing",
        "7 Days Visibility",
        "Basic Social Media Push",
        "WhatsApp Application View",
        "Standard Analytics"
      ],
      popular: false
    },
    {
      name: "Premium Elite",
      price: "5,000",
      features: [
        "Featured Homepage Placement",
        "30 Days Visibility",
        "Priority Search Ranking",
        "Targeted Meta Ad Campaign",
        "Manager Verified Badge",
        "Direct Talent Matching"
      ],
      popular: true
    },
    {
      name: "Enterprise Bulk",
      price: "Custom",
      features: [
        "Unlimited Job Postings",
        "Dedicated Talent Manager",
        "Brand Awareness Section",
        "Candidate Pre-Screening",
        "Recruitment Loop Automation",
        "Executive Search Access"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-corporate-blue mb-4 uppercase tracking-tighter text-center">Elite Employer <span className="text-purple-tech">Plans</span></h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Investment pathways for companies seeking top-tier talent across Pakistan and overseas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-3xl p-10 shadow-sm border ${plan.popular ? "border-purple-tech ring-4 ring-purple-tech/5" : "border-gray-100"}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-purple-tech text-white px-4 py-1 rounded-full text-xs font-bold flex items-center space-x-1 outline outline-8 outline-gray-50">
                  <Sparkles className="w-3 h-3" />
                  <span>MOST POPULAR</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-corporate-blue mb-4">{plan.name}</h3>
              <div className="mb-8">
                <span className="text-4xl font-black text-corporate-deep">PKR {plan.price}</span>
                {plan.price !== "Custom" && <span className="text-gray-400 text-sm font-medium"> /Listing</span>}
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-3 text-sm text-gray-600">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? "bg-purple-tech text-white shadow-lg neon-glow-hover" : "bg-corporate-blue/5 text-corporate-blue hover:bg-corporate-blue hover:text-white"}`}>
                Purchase Protocol
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
