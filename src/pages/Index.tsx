import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Users, Award, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/property/PropertyCard';
import SearchFilters from '@/components/property/SearchFilters';
import { Button } from '@/components/ui/button';

// Sample featured properties
const featuredProperties = [
  {
    id: '1',
    title: 'Palm Hills Residence',
    location: 'New Cairo, Egypt',
    price: 5500000,
    salePrice: 4950000,
    beds: 4,
    baths: 3,
    area: 280,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    status: 'available' as const,
    tag: 'hot' as const,
    constructionProgress: 85,
  },
  {
    id: '2',
    title: 'Marina Bay Penthouse',
    location: 'North Coast, Egypt',
    price: 12000000,
    beds: 5,
    baths: 4,
    area: 450,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    status: 'available' as const,
    tag: 'new' as const,
  },
  {
    id: '3',
    title: 'Garden View Villa',
    location: '6th October City, Egypt',
    price: 8500000,
    beds: 5,
    baths: 4,
    area: 380,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    status: 'reserved' as const,
    constructionProgress: 100,
  },
  {
    id: '4',
    title: 'Skyline Apartment',
    location: 'Zamalek, Cairo',
    price: 3200000,
    beds: 3,
    baths: 2,
    area: 180,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    status: 'available' as const,
    tag: 'bestValue' as const,
  },
];

// Stats
const stats = [
  { icon: Building2, value: '500+', label: 'Properties' },
  { icon: Users, value: '2,000+', label: 'Happy Clients' },
  { icon: Award, value: '15+', label: 'Years Experience' },
  { icon: TrendingUp, value: '98%', label: 'Satisfaction Rate' },
];

const Index = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center watermark-bg">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-hero" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-display text-5xl md:text-7xl font-semibold text-foreground mb-6 leading-tight">
                {t('hero.title').split(' ').map((word, i) => (
                  <span key={i}>
                    {i === 1 ? (
                      <span className="text-gold-gradient">{word}</span>
                    ) : (
                      word
                    )}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-3xl mx-auto"
            >
              <SearchFilters compact />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/properties">
                <Button className="btn-gold text-lg px-8 py-6">
                  {t('hero.explore')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" className="text-lg px-8 py-6 border-border/50 hover:border-primary/50 hover:bg-primary/5">
                  {t('hero.viewProjects')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-border/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-3xl font-display font-semibold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
              {t('property.featured')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('property.featuredSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/properties">
              <Button variant="outline" size="lg" className="border-border/50 hover:border-primary/50 gap-2">
                View All Properties
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-card" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-gold blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6">
                Ready to Find Your{' '}
                <span className="text-gold-gradient">Dream Home?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                Our team of experts is ready to help you discover the perfect property 
                that matches your lifestyle and investment goals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button className="btn-gold text-lg px-8 py-6">
                    Schedule Consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/properties">
                  <Button variant="outline" className="text-lg px-8 py-6 border-border/50 hover:border-primary/50">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
