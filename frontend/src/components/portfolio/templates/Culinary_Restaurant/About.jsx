import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function About({
  title = "Where culinary art meets timeless tradition",
  subtitle = "Our Story",
  established = "EST. 2004",
  storyTitle = "A Legacy of Taste",
  story = "Our culinary journey began with a simple belief: that dining should be a sensory celebration. Over the last two decades, we have refined our craft, marrying classical gastronomy techniques with modern culinary imagination to deliver unforgettable plates that tell a story of heritage and passion. What started as a modest 40-seat dining room has blossomed into an award-winning culinary destination, yet our commitment to excellence remains unchanged. Every dish we create is a testament to our dedication to the art of cooking, our respect for ingredients, and our passion for creating moments that linger in memory long after the last bite.",
  tabs = [
    {
      id: "heritage",
      label: "Our Heritage",
      title: "Honoring the Craft",
      content:
        "For over twenty years, our kitchen has stood as a beacon of culinary dedication. We began as a small boutique dining room and have grown into a celebrated culinary destination. Through it all, we have remained true to our founding principle: to create exceptional, honest dishes that elevate local ingredients to their highest potential."
    },
    {
      id: "sustainability",
      label: "Eco-Gastronomy",
      title: "Respecting the Land",
      content:
        "Sustainability is not a buzzword for us; it is our foundation. We practice a zero-waste philosophy in our kitchen, composting organics, repurposing trimmings, and choosing partners who utilize biodynamic and sustainable farming techniques. Eating well should mean eating in harmony with the planet."
    },
    {
      id: "experience",
      label: "The Ambience",
      title: "An Immersive Sanctuary",
      content:
        "We believe the perfect dining experience extends far beyond the plate. Our dining room is crafted with natural stone, brass accents, and ambient lighting designed to evoke a sense of warm intimacy. It is a sanctuary where time slows down, conversations flow, and memories are savored."
    },
    {
      id: "awards",
      label: "Recognition",
      title: "Celebrated Excellence",
      content:
        "Our commitment to culinary excellence has been recognized by the industry's most prestigious institutions. From Michelin recommendations to James Beard nominations, these honors reflect our unwavering dedication to the craft and the trust our guests place in us every evening."
    },
    {
      id: "philosophy",
      label: "Our Philosophy",
      title: "The Art of Hospitality",
      content:
        "At our core, we believe that great food is about connection—between farmer and chef, between kitchen and table, between tradition and innovation. Every plate tells a story, every meal creates a memory, and every guest becomes part of our extended family."
    }
  ]
}) {

  // Defensive tab handling
  const initialTabId = tabs?.[0]?.id ?? null;

  const [activeTab, setActiveTab] = useState(initialTabId);

  useEffect(() => {
    if (!Array.isArray(tabs) || !tabs.length) {
      setActiveTab(null);
      return;
    }

    const tabExists = tabs.some((tab) => tab.id === activeTab);

    if (!tabExists) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const activeTabContent =
    tabs?.find((t) => t.id === activeTab) ?? tabs?.[0] ?? null;

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="bg-[#0B0907] text-[#E8E6E3] font-sans py-20 px-4 md:px-8 lg:px-16 overflow-hidden relative min-h-screen flex flex-col justify-center">

      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#8B5A2B]/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Decorative Top Border Line */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="h-[1px] w-12 bg-[#D4AF37]/30" />
          <span className="text-[#D4AF37] tracking-[0.25em] text-xs font-semibold uppercase">
            {established}
          </span>
          <div className="h-[1px] w-12 bg-[#D4AF37]/30" />
        </div>

        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#D4AF37] font-serif italic text-lg block mb-2">
            {subtitle}
          </span>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white tracking-wide font-normal leading-tight">
            {title}
          </h2>

          <div className="w-16 h-[2px] bg-[#D4AF37] mx-auto mt-6" />
        </motion.div>

        {/* Story + Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="lg:col-span-7 space-y-8"
          >

            <div className="space-y-4">
              <h3 className="text-2xl font-serif text-white tracking-wide">
                {storyTitle}
              </h3>

              <p className="text-[#C2BFB9] leading-relaxed text-base md:text-lg">
                {story}
              </p>
            </div>

            {/* Tabs */}
            {Array.isArray(tabs) && tabs.length > 0 && (
              <>
                <div className="border-b border-[#D4AF37]/20 pb-2">
                  <div className="flex flex-wrap gap-6 md:gap-8">

                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative pb-3 text-sm tracking-wider uppercase font-semibold transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'text-[#D4AF37]'
                            : 'text-[#C2BFB9]/60 hover:text-[#C2BFB9]'
                        }`}
                      >
                        {tab.label}

                        {activeTab === tab.id && (
                          <motion.div
                            layoutId="activeTabUnderline"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D4AF37]"
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30
                            }}
                          />
                        )}
                      </button>
                    ))}

                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[140px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >

                      <h4 className="text-xl font-serif text-[#D4AF37] italic font-medium">
                        {activeTabContent?.title ?? ""}
                      </h4>

                      <p className="text-[#C2BFB9] leading-relaxed text-sm md:text-base">
                        {activeTabContent?.content ?? ""}
                      </p>

                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}

          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Eyebrow({ children }) {
  return (
    <span className="block text-[10px] font-medium tracking-[0.25em] uppercase text-[#c5a880] mb-4">
      {children}
    </span>
  );
}

export default function About() {
  const [activeValue, setActiveValue] = useState(0);

  return (
    <section className="w-full bg-[#0a0a0a] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 border border-[#c5a880]/20 pointer-events-none" />
            <div className="absolute -inset-8 border border-[#c5a880]/10 pointer-events-none" />

            <div className="relative overflow-hidden bg-[#111111] border border-[#222222]">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=900"
                alt={CHEF_STORY.name}
                className="w-full h-[520px] object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-[10px] tracking-[0.25em] uppercase text-[#c5a880] mb-2">
                  Executive Chef & Founder
                </p>
                <h3 className="font-serif text-3xl font-light tracking-wide text-white">
                  {CHEF_STORY.name}
                </h3>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 bg-[#c5a880] text-[#0a0a0a] px-6 py-4 text-center shadow-2xl">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-1">Crafting since</p>
              <p className="font-serif text-3xl font-bold leading-none">{CHEF_STORY.since}</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <GoldDivider icon={ChefHat} />
            <Eyebrow>The Chef Behind the Craft</Eyebrow>

            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-wide mb-4">
              A Story Told Through Food
            </h2>

            <p className="text-[#c5a880] font-light italic text-lg mb-8 border-l-2 border-[#c5a880]/40 pl-5 leading-relaxed">
              "{CHEF_STORY.tagline}"
            </p>

            <p className="text-gray-400 font-light leading-relaxed mb-6 text-[15px]">
              {CHEF_STORY.bio1}
            </p>
            <p className="text-gray-400 font-light leading-relaxed mb-10 text-[15px]">
              {CHEF_STORY.bio2}
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Michelin Stars', value: CHEF_STORY.michelin },
                { label: 'Restaurants', value: CHEF_STORY.restaurants },
                { label: 'Years Mastery', value: '20+' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-[#222222] hover:border-[#c5a880]/50 transition-colors duration-300 p-4 text-center"
                >
                  <p className="font-serif text-3xl text-[#c5a880] font-light mb-1">{value}</p>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#1a1a1a]">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="group flex flex-col items-center justify-center gap-3 py-12 px-6 hover:bg-[#111111] transition-colors duration-300"
              >
                <Icon className="w-6 h-6 text-[#c5a880] group-hover:scale-110 transition-transform duration-300" />
                <p className="font-serif text-4xl font-light text-white">{value}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <GoldDivider />
          <Eyebrow>The Journey</Eyebrow>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-wide">
            Milestones of Excellence
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-px bg-[#1e1e1e] hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {MILESTONES.map(({ year, label }, i) => (
              <div key={year} className="flex flex-col items-center text-center gap-4 relative">
                <div className="relative z-10 w-10 h-10 rounded-full border-2 border-[#c5a880] bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#c5a880]" />
                </div>

                <div>
                  <p className="font-serif text-2xl text-[#c5a880] font-light mb-1">{year}</p>
                  <p className="text-gray-400 text-sm font-light leading-snug">{label}</p>
                </div>

                {/* gradient connector between dots, desktop only */}
                {i < MILESTONES.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-gradient-to-r from-[#c5a880]/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border-t border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="text-center mb-16">
            <GoldDivider />
            <Eyebrow>Our Philosophy</Eyebrow>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white tracking-wide">
              What Guides Every Dish
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
             <button
                key={title}
                onClick={() => setActiveValue(i)}
                aria-pressed={activeValue === i}
                className={`group text-left p-8 border transition-all duration-500 ${
                  activeValue === i
                    ? 'border-[#c5a880]/60 bg-[#111111]'
                    : 'border-[#1e1e1e] bg-transparent hover:border-[#c5a880]/30 hover:bg-[#0f0f0f]'
                }`}
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center mb-6 border transition-colors duration-500 ${
                    activeValue === i
                      ? 'border-[#c5a880] bg-[#c5a880]/10'
                      : 'border-[#2a2a2a] group-hover:border-[#c5a880]/50'
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#c5a880]" />
                </div>

                <h3
                  className={`font-serif text-xl mb-3 font-light tracking-wide transition-colors duration-300 ${
                    activeValue === i ? 'text-white' : 'text-gray-300'
                  }`}
                >
                  {title}
                </h3>
                <p className="text-gray-500 text-sm font-light leading-relaxed">{desc}</p>

                <div
                  className={`mt-6 h-px bg-[#c5a880] transition-all duration-500 ${
                    activeValue === i ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #c5a880 0px,
              #c5a880 1px,
              transparent 1px,
              transparent 60px
            )`,
          }}
        />

        <div className="absolute top-8 left-1/2 -translate-x-1/2 font-serif text-[200px] leading-none text-[#c5a880]/5 select-none pointer-events-none">
          "
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <GoldDivider icon={ChefHat} />
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-light leading-relaxed tracking-wide mb-10">
            "Cooking is not a profession. It is a devotion. Every flame, every knife stroke,
            every plated moment is an act of love for the person sitting at the table."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#c5a880]/50" />
            <p className="text-[#c5a880] text-sm tracking-[0.2em] uppercase font-medium">
              {CHEF_STORY.name}
            </p>
            <div className="h-px w-16 bg-[#c5a880]/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
